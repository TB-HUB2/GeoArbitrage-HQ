# Knowledge Base — RAG-Integration Konzept

## Überblick

Die GeoArbitrage HQ Knowledge Base trennt **Wissen** von **Instruktionen**:

- **Core Prompts** (~500-700 Tokens): Rolle, Pflichtregeln, Output-Format → werden IMMER an den Agenten geschickt
- **Knowledge Chunks** (~500-1000 Tokens): Fachwissen zu spezifischen Themen → werden per RAG nur bei Relevanz geladen
- **Shared Chunks** (Mandantenprofil, Output-Standards): → werden IMMER mitgeschickt

### Token-Einsparung pro Anfrage

| Vorher | Nachher | Ersparnis |
|--------|---------|-----------|
| ~6.000-8.000 Tokens System Prompt | ~1.700 Tokens (Core + Shared + 3-5 RAG Chunks) | ~70% |

## Architektur

```
User-Frage via:
  ├── Claude (MCP Server Trigger) ← interaktive Beratung
  └── Telegram (Webhook)          ← Alerts, Mobile, Dateneingabe

Externe Datenquellen (automatisch via Cron):
  ├── Google Calendar (MCP Client) ← iPhone-Kalender → Fristen/Termine
  ├── Yahoo Finance / CoinGecko    ← Kursdaten
  └── OSINT APIs (GDELT etc.)      ← Länderstabilität
    │
    ▼
┌─────────────────────────────┐
│ CFO Orchestrator (Haiku)    │
│ 1. Source erkennen (mcp/tg) │
│ 2. Intent Classification    │
│ 3. Agent-Routing            │
│ 4. Keyword-Extraktion       │
│    für RAG-Query            │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ Supabase pgvector           │
│ Similarity Search           │
│ → Top 3-5 relevante Chunks │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ Fachagent (Sonnet/Haiku)    │
│ = Core Prompt               │
│ + Mandantenprofil            │
│ + Output-Standards           │
│ + RAG-Chunks (3-5)          │
│ + User-Frage + Context      │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ Validator (Sonnet)          │
│ = Core Prompt (Validator)   │
│ + Validierungs-Checkliste   │
│ + DA-Angriffsvektoren       │
│ + Agent-Output              │
│ + Relevante RAG-Chunks      │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ Response Assembly (Haiku)   │
│ + Response Router:          │
│   ├── MCP → zurück an Claude│
│   └── Telegram → Bot-Reply  │
│ + DB-State-Update            │
└─────────────────────────────┘
```

## n8n Workflow-Anpassungen

### 1. Embedding-Pipeline (einmalig + bei Updates)

```
Trigger: Manuell oder bei Chunk-Update
    │
    ▼
[Read MD Files] → Alle .md Dateien aus /knowledge_base/
    │
    ▼
[Split & Prepare] → Chunk-ID, Titel, Inhalt, Bereich, relevante Agenten extrahieren
    │
    ▼
[Voyage AI API] → voyage-4-lite Embedding (1024 Dimensionen)
    │  Endpoint: POST https://api.voyageai.com/v1/embeddings
    │  Model: voyage-4-lite (kostenlos bis 200M Tokens)
    │
    ▼
[Supabase Upsert] → Tabelle: knowledge_base
    │  Spalten: id, chunk_id, title, content, bereich,
    │  relevante_agenten TEXT[], embedding vector(1024),
    │  updated_at
```

### 2. RAG-Query im Agenten-Workflow

```
[Nach CFO Intent Classification]
    │
    ▼
[Extract Keywords] → Haiku extrahiert 3-5 Suchbegriffe aus der User-Frage
    │  Beispiel: "Wie funktioniert die Wegzugssteuer für GmbH?"
    │  → Keywords: ["Wegzugssteuer", "§6 AStG", "GmbH-Anteile", "Ratenzahlung"]
    │
    ▼
[Voyage AI Embed Query] → Keywords → Embedding-Vektor
    │
    ▼
[Supabase RPC: match_knowledge] → pgvector Similarity Search
    │
    │  SELECT chunk_id, title, content,
    │         1 - (embedding <=> query_embedding) AS similarity
    │  FROM knowledge_base
    │  WHERE bereich = ANY('{tax,shared}')  -- gefiltert nach Agent-Bereich
    │    AND 1 - (embedding <=> query_embedding) > 0.7  -- Mindest-Similarity
    │  ORDER BY similarity DESC
    │  LIMIT 5;
    │
    ▼
[Assemble Prompt] → Core Prompt + Shared Chunks + RAG Results + User-Frage
    │
    ▼
[Claude API Call] → An den Fachagenten
```

### 3. Bereichs-Mapping (Agent → Knowledge-Bereiche)

| Agent | Primäre Bereiche | Sekundäre Bereiche |
|-------|-----------------|-------------------|
| Tax Architect | tax, shared | corporate, immigration |
| Immobilien-Spezialist | immobilien, shared | tax |
| Gesellschaftsrechtler | corporate, shared | tax, immigration |
| Immigration-Spezialist | immigration, shared | tax, relocation |
| Wealth Manager | wealth, shared | tax, corporate |
| Versicherungs-Analyst | insurance, shared | relocation |
| Relocation-Analyst | relocation, shared | immigration |
| CFO (Orchestrator) | cfo, shared | alle (+ calendar_events via Google Calendar Sync) |
| Validator | quality, shared | alle |

## Supabase Schema-Erweiterung

```sql
-- Knowledge Base Tabelle (RAG-Wissens-Chunks mit pgvector Embeddings)
-- EINHEITLICHES SCHEMA: deckt MD-Chunks (primär) und PDF-Ingest (Sprint 7.3) ab.
CREATE TABLE knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- MD-Chunk Felder (primärer Use Case, alle Werte gesetzt)
  chunk_id TEXT UNIQUE NOT NULL,         -- z.B. "tax/wegzugssteuer-§6-astg"
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  bereich TEXT NOT NULL,                 -- z.B. "tax", "immobilien", "shared"
  relevante_agenten TEXT[] NOT NULL,     -- z.B. {"Tax Architect", "CFO"}

  -- PDF-Ingest Felder (Sprint 7.3, für MD-Chunks NULL)
  source_type TEXT,                      -- 'md_chunk', 'law', 'dba', 'bfh_ruling', 'article'
  source_name TEXT,                      -- z.B. "§2 AStG" oder "DBA DE-UAE"
  last_verified DATE,
  verification_status TEXT DEFAULT 'unverified',

  -- Embedding + Metadaten
  embedding vector(1024),                -- Voyage AI voyage-4-lite
  token_count INTEGER,                   -- Für Budget-Tracking
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index für Similarity Search (HNSW: bessere Query-Qualität, kein Training nötig)
CREATE INDEX IF NOT EXISTS idx_knowledge_base_embedding ON knowledge_base
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- RPC Function für Similarity Search
-- Filtert nach bereich (Text-Array) — deckt alle Agent-Bereichs-Mappings ab.
CREATE OR REPLACE FUNCTION match_knowledge(
  query_embedding  vector(1024),
  match_threshold  FLOAT   DEFAULT 0.7,
  match_count      INT     DEFAULT 5,
  filter_bereiche  TEXT[]  DEFAULT NULL
)
RETURNS TABLE (
  chunk_id    TEXT,
  title       TEXT,
  content     TEXT,
  bereich     TEXT,
  source_name TEXT,
  source_type TEXT,
  similarity  FLOAT
)
LANGUAGE SQL STABLE AS $$
  SELECT
    chunk_id,
    title,
    content,
    bereich,
    source_name,
    source_type,
    1 - (embedding <=> query_embedding) AS similarity
  FROM knowledge_base
  WHERE (filter_bereiche IS NULL OR bereich = ANY(filter_bereiche))
    AND embedding IS NOT NULL
    AND 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;
```

## Kosten-Kalkulation

### Embedding (einmalig)
- ~104 Chunks × ~750 Tokens Durchschnitt = ~78.000 Tokens
- Voyage AI Free Tier: 200M Tokens → 0€
- Re-Embedding bei Updates: vernachlässigbar

### Pro Anfrage (RAG-Query)
- Query Embedding: ~20 Tokens → 0€ (Free Tier)
- Supabase pgvector Query: 0€ (Free Tier)
- Eingesparte Input-Tokens: ~4.000-5.000 pro Call
- Bei Sonnet 4.6 ($3/MTok Input): ~$0.012-0.015 Ersparnis pro Call

### Monatlich (bei ~80 Anfragen)
- Token-Ersparnis: ~$1.00-1.20 auf Input-Tokens
- Voyage AI: 0€ (Free Tier, ~80 × 20 Tokens = 1.600 Tokens/Monat)
- Gesamt-Ersparnis: ~$1.00-1.20/Monat

## Wartung

### Knowledge-Chunks aktualisieren
1. MD-Datei in /knowledge_base/ editieren
2. Re-Embedding-Workflow in n8n triggern (manuell oder per Webhook)
3. Supabase wird automatisch aktualisiert

### Neue Chunks hinzufügen
1. Neue .md Datei im richtigen Unterordner erstellen
2. Format einhalten (Chunk-ID, Titel, Relevante Agenten)
3. Re-Embedding-Workflow triggern

### Qualitätssicherung
- Quartalsweiser Review: Sind alle Chunks noch aktuell?
- Coverage Gap Detection (CFO): Werden Fragen gestellt, für die kein Chunk existiert?
- Chunk-Performance: Welche Chunks werden am häufigsten abgerufen? Welche nie?

## Verzeichnisstruktur

```
knowledge_base/
├── core-prompts/          ← Schlanke System Prompts (~500-700 Tokens)
│   ├── agent-01-tax-architect.md
│   ├── agent-02-immobilien.md
│   ├── agent-03-corporate.md
│   ├── agent-04-immigration.md
│   ├── agent-05-wealth.md
│   ├── agent-06-insurance.md
│   ├── agent-07-relocation.md
│   ├── agent-08-cfo.md
│   └── agent-09-validator.md       ← Ehem. Validator + Devil's Advocate
│
├── tax/                   ← 21 Chunks
├── immobilien/            ← 15 Chunks
├── corporate/             ← 14 Chunks
├── immigration/           ← 13 Chunks
├── wealth/                ← 15 Chunks
├── insurance/             ← 10 Chunks
├── relocation/            ← 10 Chunks
├── cfo/                   ← 7 Chunks (CFO-Methodik & Prozesse)
│   ├── cashflow-management.md
│   ├── steuerkalender-tracking.md
│   ├── entscheidungsvorbereitung.md
│   ├── reporting-auto-commentary.md
│   ├── roadmap-szenario-engine.md
│   ├── governance-entscheidungsqualitaet.md
│   └── coverage-gap-detection.md
├── shared/                ← 3 Chunks (immer mitgeschickt)
│   ├── mandantenprofil.md
│   ├── eskalations-matrix.md
│   └── output-format-standards.md
├── quality/               ← 5 Chunks (für Validator)
│   ├── validierungs-checkliste.md
│   ├── devils-advocate-angriffsvektoren.md
│   ├── halluzinations-trigger-katalog.md
│   ├── cross-agent-konsistenz-matrix.md
│   └── worst-case-szenarien.md
│
└── RAG-INTEGRATION.md     ← Dieses Dokument
```

## Migration: Von altem System zu RAG

### Phase 1: Knowledge Base aufbauen (✅ ERLEDIGT)
- [x] Verzeichnisstruktur erstellen
- [x] Wissens-Chunks extrahieren
- [x] Kern-Prompts erstellen

### Phase 2: Embeddings erstellen (Sprint 2.2 im Blueprint)
- [ ] pgvector in Supabase aktivieren (Extension)
- [ ] knowledge_base Tabelle + RPC Function erstellen
- [ ] Voyage AI API Key in .env
- [ ] n8n Embedding-Pipeline bauen
- [ ] Alle Chunks embedden

### Phase 3: Agent-Workflows anpassen (Sprint 2.3)
- [ ] CFO-Workflow: Keyword-Extraktion + RAG-Query hinzufügen
- [ ] Fachagent-Workflows: Core Prompt + RAG-Assembly
- [ ] Validator-Workflow: Zusammengelegter Validator + DA

### Phase 4: Testen & Optimieren
- [ ] 10 Test-Anfragen pro Agent → Output-Qualität vergleichen
- [ ] Similarity-Threshold tunen (0.7 als Start)
- [ ] Chunk-Count tunen (3-5 als Start)
- [ ] Token-Verbrauch messen (vorher vs. nachher)

## Änderungen gegenüber ursprünglicher Architektur

| Aspekt | Vorher | Nachher |
|--------|--------|---------|
| System Prompt Größe | ~6.000-8.000 Tokens | ~1.700 Tokens |
| Agenten-Anzahl | 11 (8 Kern + 3 QC) | 9 (8 Kern + 1 QC) |
| Devil's Advocate | Eigener Agent (Sonnet) | In Validator integriert |
| Performance Manager | Monatlich automatisch | Quartalsweise manuell |
| Wissens-Updates | System Prompt editieren | MD-Datei editieren + Re-Embed |
| Qualitätskontrolle | 2 LLM-Calls (Validator + DA) | 1 LLM-Call (Validator mit DA) |
| LLM-Calls pro Anfrage | 5-6 | 4-5 |
| Geschätzte API-Kosten | ~$4-5/Mo | ~$2-3/Mo |
| CFO-Agent | Reiner Router (42 Zeilen) | Vollwertiger CFO mit 10 Capabilities + 7 RAG-Chunks |
| Knowledge Chunks gesamt | 69 | 104 (+7 cfo/, +5 insurance/, +5 relocation/, +4 corporate/, +3 immigration/, +2 wealth/, +3 tax/, +3 immobilien/, +3 quality/) |
