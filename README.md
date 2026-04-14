# GeoArbitrage HQ -- AI Virtual Family Office

## Was ist das?

Ein AI-gestuetztes Virtual Family Office, das als persoenlicher Beraterstab fungiert. 9 spezialisierte AI-Agenten (8 Fachberater + 1 Qualitaetskontrolle), orchestriert durch n8n, mit RAG-basierter Knowledge Base (pgvector + Voyage AI), Telegram als Input-Kanal, einem Premium-Dashboard fuer Ueberblick, und automatischem Monitoring.

**Ziel:** Geografische und finanzielle Unabhaengigkeit vorbereiten -- Steueroptimierung, Immobilien-Strukturierung, zweite Staatsbuergerschaft, Vermoegensaufbau, Exit-Readiness aus Deutschland.

## Architektur

```
+-----------------------------------------------------------------+
|                    INTERFACE LAYER                                |
|  +----------------+  +---------------+  +----------------------+ |
|  | Claude (MCP)    |  | Telegram Bot   |  | Dashboard            | |
|  | (Beratung,      |  | (Alerts,       |  | (Next.js/Vercel)     | |
|  |  Analyse,       |  |  Reports,      |  |                      | |
|  |  Folgefragen)   |  |  Mobile,       |  |                      | |
|  |                 |  |  Dateneingabe)  |  |                      | |
|  +-------+---------+  +------+---------+  +---------+-----------+ |
+-----------+------------------+------------------------+----------+
            |                  |                        |
+-----------+------------------+------------------------+----------+
|           v                  v    AGENT LAYER         v          |
|  +--------------------------------------------------------------+|
|  |              n8n (Hetzner VPS, Docker)                        ||
|  |                                                               ||
|  |  MAIN: CFO Orchestrator Workflow                              ||
|  |  +-- TRIGGER (Dual-Input):                                   ||
|  |  |   +-- MCP Server Trigger (Claude -> direkte Beratung)     ||
|  |  |   +-- Webhook Trigger (Telegram -> Alerts/Reports)        ||
|  |  +-- Intent Classification (Haiku)                           ||
|  |  +-- Context Assembly (DB Queries)                           ||
|  |  +-- RAG Query (Voyage AI + pgvector):                       ||
|  |  |   +-- Top 3-5 Knowledge Chunks laden                     ||
|  |  +-- Agent Routing -> Sub-Workflows:                         ||
|  |  |   +-- Tax Architect (Sonnet)                              ||
|  |  |   +-- Immobilien-Spezialist (Sonnet)                      ||
|  |  |   +-- Corporate Structure (Sonnet)                        ||
|  |  |   +-- Immigration Agent (Haiku)                           ||
|  |  |   +-- Wealth Manager (Sonnet)                             ||
|  |  |   +-- Insurance Agent (Haiku)                             ||
|  |  |   +-- Relocation Agent (Haiku)                            ||
|  |  +-- Quality Gate:                                           ||
|  |  |   +-- Validator & Stress-Tester (Sonnet + Web Search)     ||
|  |  +-- Response Assembly (Haiku)                               ||
|  |  +-- Response Router:                                        ||
|  |  |   +-- -> MCP Response (zurueck an Claude)                 ||
|  |  |   +-- -> Telegram Response (zurueck an Telegram Bot)      ||
|  |  +-- State Update (DB Write)                                 ||
|  |                                                               ||
|  |  CRON: Weekly Scan + Report (-> Telegram)                    ||
|  |  CRON: Kurs-Update (Yahoo Finance + CoinGecko)              ||
|  |  CRON: Calendar Sync (Google Calendar -> calendar_events)    ||
|  +--------------------------------------------------------------+|
+------------------------------+-----------------------------------+
                               |
+------------------------------+-----------------------------------+
|                              v     DATA LAYER                     |
|  +----------------------+  +------------------+  +--------------+|
|  |  Supabase PostgreSQL  |  | Supabase pgvector |  |  Supabase   ||
|  |  (State & History)    |  | (Knowledge Base)  |  |  Storage    ||
|  +----------------------+  +------------------+  +--------------+|
+------------------------------------------------------------------+
```

## Tech-Stack

| Komponente | Technologie | Kosten |
|------------|-------------|--------|
| Orchestrator | n8n (self-hosted, Docker auf Hetzner CX22) | 4,51 EUR/Mo |
| Datenbank | Supabase Free Tier (PostgreSQL + pgvector + Auth + RLS) | 0 EUR |
| LLM | Claude API (Sonnet + Haiku, smartes Routing) | ~2-3 EUR/Mo |
| Embeddings | Voyage AI (voyage-4-lite, 1024 Dimensionen) | 0 EUR (Free Tier) |
| Frontend | Next.js Dashboard auf Vercel | 0 EUR (Free Tier) |
| Kommunikation | Telegram Bot API | 0 EUR |
| VPN | Tailscale (n8n nie oeffentlich erreichbar) | 0 EUR (Free Tier) |
| DNS/SSL | Cloudflare (DNS + SSL + Access) | 0 EUR (Free Tier) |
| **Gesamt** | | **~6,50-8,50 EUR/Mo** |

## Implementierungstool

Dieses Projekt wurde vollstaendig mit **Claude Code** (CLI-basierter Coding-Agent) gebaut. Die Sprint-Prompts in `SPRINT_GUIDE.md` sind direkte Copy-Paste-Prompts fuer Claude Code.

## 9 Agenten

| # | Agent | Modell | Aufgabe |
|---|-------|--------|---------|
| 1 | Tax Architect | Sonnet | Internationales Steuerrecht, Wegzugssteuer, DBA |
| 2 | Immobilien-Spezialist | Sonnet | Finanzierung, Cashflow, AfA, Marktanalyse |
| 3 | Gesellschaftsrechtler | Sonnet | Rechtsformen, Substanz, Transfer Pricing |
| 4 | Immigration-Spezialist | Haiku | Visa, Aufenthalt, Staatsbuergerschaften |
| 5 | Wealth Manager | Sonnet | Portfolio, FIRE, Asset Allocation |
| 6 | Versicherungs-Analyst | Haiku | KV, Haftpflicht, BU international |
| 7 | Relocation-Analyst | Haiku | Laenderbewertung, Lebensqualitaet |
| 8 | Personal CFO | Haiku | Orchestrator, Decision Briefs, Budgets |
| 9 | Validator | Sonnet | Faktencheck, Stress-Test, Knowledge Gaps |

## Knowledge Base

123 Markdown-Dateien in 10 Fachbereichen, ~1960 Chunks mit Voyage AI Embeddings (1024-dim):

| Bereich | Chunks | Beispiel-Themen |
|---------|--------|-----------------|
| tax | 18+ | EStG, AStG, DBAs, Krypto, Territorial Taxation |
| immobilien | 14 | Finanzierung, Cashflow, AfA, Marktanalyse |
| corporate | 13 | Rechtsformen, Banking, Transfer Pricing, IP |
| immigration | 13 | 183-Tage, Digital Nomad Visas, CBI |
| wealth | 15 | FIRE, Portfolio Stress Testing, Asset Allocation |
| insurance | 10 | KV international, BU, Expat-Versicherung |
| relocation | 10 | Laenderbewertung, Exit-Logistik, Klimarisiko |
| cfo | 7 | Cashflow, Governance, Reporting, Szenarien |
| quality | 5 | Validierung, Halluzinations-Trigger, Worst Cases |
| shared | 3 | Mandantenprofil, Eskalations-Matrix, Output-Format |

## Verzeichnisstruktur

```
template/
+-- README.md                    # Dieses Dokument
+-- SETUP.md                     # Schritt-fuer-Schritt Setup-Anleitung
+-- CLAUDE.md                    # Bug Tracker & Learnings (fuer Claude Code)
+-- SPRINT_GUIDE.md              # Sprint-Prompts fuer Claude Code
+-- geo-arbitrage-implementation-blueprint.md  # Vollstaendiger Blueprint
+--
+-- infrastructure/              # Server-Konfiguration
|   +-- docker-compose.yml       # n8n + PostgreSQL + nginx
|   +-- nginx.conf               # Reverse Proxy + SSL
|   +-- .env.example             # Alle Umgebungsvariablen
|   +-- backup.sh                # Backup-Script
+--
+-- sql/                         # Datenbank-Schema
|   +-- 01_extensions.sql        # pgvector Extension
|   +-- 02_business_tables.sql   # Alle Business-Tabellen
|   +-- 03_chat_memory.sql       # Chat History + Episodic Memory
|   +-- 04_agent_logs.sql        # Agent Logging + Kosten
|   +-- 05_knowledge_base.sql    # Knowledge Base + RAG
|   +-- 06_knowledge_gaps.sql    # Knowledge Gap Detection
|   +-- 07_rls_policies.sql      # Row Level Security
|   +-- 08_seed_data.sql         # Beispieldaten
+--
+-- dashboard/                   # Next.js Frontend
|   +-- src/                     # Quellcode
|   +-- package.json, etc.       # Konfiguration
+--
+-- knowledge_base/              # RAG Knowledge Base (123 Dateien)
|   +-- core-prompts/            # 9 Agenten System-Prompts
|   +-- tax/, immobilien/, ...   # Fach-Chunks
+--
+-- scripts/                     # Ingest & Deploy Scripts
+-- workflows/                   # n8n Workflow JSONs
+-- security/                    # Security Checklisten
```

## Schnellstart

1. Lies `SETUP.md` fuer die Account-Einrichtung
2. Lies `SPRINT_GUIDE.md` fuer die Sprint-Prompts
3. Starte Claude Code und gib ihm den Sprint 1 Prompt
4. Arbeite Sprint fuer Sprint durch (7 Sprints, ~14 Wochen)

## Laufende Kosten Breakdown

| Posten | Kosten/Monat |
|--------|-------------|
| Hetzner CX22 VPS | 4,51 EUR |
| Claude API (~80 Anfragen + Weekly Scan) | ~2-3 EUR |
| Supabase Free Tier | 0 EUR |
| Voyage AI Free Tier | 0 EUR |
| Vercel Free Tier | 0 EUR |
| Telegram Bot | 0 EUR |
| Tailscale Free Tier | 0 EUR |
| Cloudflare Free Tier | 0 EUR |
| **Gesamt** | **~6,50-8,50 EUR** |

## Voraussetzungen

- Claude Code CLI (oder Claude Desktop)
- Terminal/SSH-Zugang
- Grundverstaendnis Docker, Git, JavaScript/TypeScript
- Accounts: Hetzner, Supabase, Anthropic, Voyage AI, Telegram, Cloudflare, Vercel, Tailscale, Google (Calendar)
