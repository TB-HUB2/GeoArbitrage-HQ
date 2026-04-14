# GeoArbitrage HQ -- Sprint Guide

Dieser Guide enthaelt die Claude Code Prompts fuer alle 7 Sprints.
Oeffne Claude Code in deinem Terminal und kopiere den jeweiligen Prompt.

## Wie du Claude Code verwendest

1. Terminal oeffnen
2. `claude` eingeben (startet Claude Code)
3. Sprint-Prompt kopieren und einfuegen
4. Claude Code arbeitet autonom -- melde dich bei Fragen

---

## Sprint 1: Foundation (Woche 1-2)

**Ziel:** Server steht, Datenbank ist erstellt, erster Agent antwortet auf Fragen.

### 1.1 -- Hetzner VPS aufsetzen + Docker installieren

**Claude Code Prompt:**
```
Ich moechte einen Hetzner CX22 VPS (Ubuntu 24.04) einrichten fuer mein
GeoArbitrage-Projekt. Bitte erstelle mir:

1. Ein docker-compose.yml das folgende Services enthaelt:
   - n8n (docker.n8n.io/n8nio/n8n:2.14.1, mit Persistent Volume,
     lauscht NUR auf 127.0.0.1:5678 -- NICHT auf 0.0.0.0!)
   - PostgreSQL 16 (als Datenbank fuer n8n, lauscht NUR auf localhost)
   - Nginx als Reverse Proxy mit SSL

   WICHTIG -- Restart-Policies fuer alle Container:
   Jeder Service MUSS `restart: unless-stopped` haben.
   Ohne Restart-Policy bleibt ein Container nach einem Crash
   oder Server-Reboot DAUERHAFT gestoppt. Mit `unless-stopped` startet Docker
   die Container automatisch nach Crash ODER Server-Reboot.

   VERSIONS-PINNING (PFLICHT):
   NIEMALS `latest` oder unversionierte Tags in Production verwenden!
   Alle Images MUESSEN auf eine spezifische Version gepinnt sein.

   UPDATE-PROZEDUR (vor jedem Image-Update):
   1. Hetzner Snapshot erstellen (Hetzner Console)
   2. Backup manuell ausfuehren: bash /opt/geoarbitrage/backup.sh
   3. Version in docker-compose.yml aendern (PYTHON, kein sed!)
   4. docker compose pull n8n && docker compose up -d (NICHT restart!)
   5. Healthcheck pruefen: curl http://localhost:5678/healthz
   6. Version verifizieren: docker compose exec n8n n8n --version
   7. Altes Image entfernen: docker image rm docker.n8n.io/n8nio/n8n:ALTE_VERSION
   8. Bei Problemen: docker compose down, alte Version eintragen, up -d
   9. Wenn alles stabil (24h): Snapshot kann geloescht werden

   UPDATE-FENSTER: Samstag morgens (geringste Nutzung).
   Bei BSI/CERT-Warnungen (kritische CVEs): SOFORT patchen, kein Warten!

   Referenz docker-compose.yml Struktur:

   services:
     n8n:
       image: docker.n8n.io/n8nio/n8n:2.14.1
       restart: unless-stopped
       ports:
         - "127.0.0.1:5678:5678"
       volumes:
         - n8n_data:/home/node/.n8n
       environment:
         - DB_TYPE=postgresdb
         - DB_POSTGRESDB_HOST=postgres
         - DB_POSTGRESDB_PORT=5432
         - DB_POSTGRESDB_DATABASE=${POSTGRES_DB}
         - DB_POSTGRESDB_USER=${POSTGRES_USER}
         - DB_POSTGRESDB_PASSWORD=${POSTGRES_PASSWORD}
         - N8N_USER_MANAGEMENT_DISABLED=false
         - N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
         - N8N_EDITOR_BASE_URL=${N8N_EDITOR_BASE_URL}
         - WEBHOOK_URL=${WEBHOOK_URL}
         - SUPABASE_URL=${SUPABASE_URL}
         - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
         - MODEL_SONNET=${MODEL_SONNET}
         - MODEL_HAIKU=${MODEL_HAIKU}
         - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
         - TAVILY_API_KEY=${TAVILY_API_KEY}
         - VOYAGE_API_KEY=${VOYAGE_API_KEY}
         - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
         - TELEGRAM_SECRET_TOKEN=${TELEGRAM_SECRET_TOKEN}
         - TELEGRAM_ALLOWED_CHAT_ID=${TELEGRAM_ALLOWED_CHAT_ID}
         - TELEGRAM_CHAT_ID=${TELEGRAM_CHAT_ID}
         - N8N_BLOCK_ENV_ACCESS_IN_NODE=false
         - NODES_EXCLUDE=[]
       depends_on:
         postgres:
           condition: service_healthy
       healthcheck:
         test: ["CMD", "wget", "--spider", "-q", "http://localhost:5678/healthz"]
         interval: 30s
         timeout: 10s
         retries: 3
         start_period: 30s

     postgres:
       image: postgres:16.6-alpine
       restart: unless-stopped
       volumes:
         - postgres_data:/var/lib/postgresql/data
       environment:
         - POSTGRES_DB=${POSTGRES_DB}
         - POSTGRES_USER=${POSTGRES_USER}
         - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
       healthcheck:
         test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
         interval: 10s
         timeout: 5s
         retries: 5

     nginx:
       image: nginx:1.27-alpine
       restart: unless-stopped
       ports:
         - "80:80"
         - "443:443"
       volumes:
         - ./nginx/conf.d:/etc/nginx/conf.d:ro
         - ./nginx/ssl:/etc/nginx/ssl:ro
         - certbot_data:/var/www/certbot:ro
       depends_on:
         - n8n

   volumes:
     n8n_data:
     postgres_data:
     certbot_data:

2. Ein Setup-Script (setup.sh) das auf einem frischen Ubuntu 24.04
   Server folgendes macht:
   - Docker + Docker Compose installieren
   - Tailscale installieren und konfigurieren (VPN fuer n8n-Zugang)
   - UFW Firewall: NUR Ports 22 (SSH), 443 (HTTPS), 80 (HTTP) offen
     -- KEIN Port 5678 (n8n nur via nginx Reverse Proxy!)
   - fail2ban installieren (SSH + Nginx Schutz)
   - SSRF-Schutz: iptables Rule gegen 169.254.169.254 (Cloud Metadata)
   - unattended-upgrades aktivieren (automatische Security-Updates)
   - Die docker-compose.yml starten
   - Cron fuer Supabase Keep-Alive einrichten (taeglich 12:00 Uhr)
   - Cron fuer verschluesseltes Backup einrichten (Sonntags 03:00 Uhr)
   - Certbot Auto-Renewal Timer verifizieren + Cron-Fallback
   - Disk/RAM/Docker Watchdog einrichten (alle 5 Minuten)
   - Redundanten Supabase Keep-Alive (2. unabhaengiger Mechanismus)

3. Nginx-Konfiguration mit 2 Server-Blocks:
   a) n8n Interface: Lauscht auf YOUR_TAILSCALE_HOSTNAME:443
      SSL: Tailscale-eigene Certs
      Nur erreichbar wenn du im Tailscale VPN bist
   b) Telegram Webhook: Lauscht auf webhook.YOUR_DOMAIN.com
      NUR Pfad /webhook/telegram, Rate Limit 10 Requests/Minute
      SSL: Let's Encrypt via Certbot
      Alles andere -> 404

4. Umgebungsvariablen (.env, Permissions 600) mit Platzhaltern fuer:
   - PostgreSQL Credentials
   - Domain-Name
   - E-Mail fuer Let's Encrypt
   - Telegram Secret Token
   - Anthropic API Key
   - Erlaubte Telegram Chat-ID
   - SUPABASE_MANAGEMENT_TOKEN
   - BACKUP_PASSPHRASE (fuer AES-256 Backup-Verschluesselung)
   - ACLED_EMAIL + ACLED_PASSWORD
   - COINGECKO_API_KEY
   - VOYAGE_API_KEY
   - N8N_ENCRYPTION_KEY
   - N8N_API_KEY
   - MODEL_SONNET=claude-sonnet-4-6
   - MODEL_HAIKU=claude-haiku-4-5-20251001

5. SSH-Haertung:
   - Key-Only Authentication (kein Passwort-Login)
   - Root-Login deaktiviert
   - Port 22

6. DEVOPS-VERIFIKATION im Test-Script (test_setup.sh)

Bitte erklaere jeden Schritt, damit ich verstehe was passiert.

SICHERHEITS-ANFORDERUNGEN (nicht verhandelbar):
- n8n darf NIEMALS auf der oeffentlichen IP erreichbar sein
- Alle API-Keys NUR in .env, NIEMALS in Workflow-Nodes hardcoded
- Telegram Webhook MUSS Secret Token verifizieren
- Telegram Webhook MUSS Absender-Nummer gegen Whitelist pruefen
- Anthropic API: Spending Limit 20 EUR/Monat setzen
- Supabase: Service Role Key NIEMALS im Frontend
```

### 1.2 -- Supabase Projekt aufsetzen + Datenbank-Schema erstellen

**Claude Code Prompt:**
```
Ich nutze Supabase (Free Tier) fuer mein GeoArbitrage AI-System.
Bitte erstelle mir ein vollstaendiges SQL-Migrations-Script, das ich in
Supabase SQL Editor ausfuehren kann. Das Script soll folgende Tabellen
erstellen:

1. decisions -- Audit Trail aller Entscheidungen
   (id UUID, created_at, title, category [tax/immo/corporate/immigration/
   wealth/insurance/relocation/budget], urgency [red/yellow/green],
   status [open/decided/implemented/reversed], decision_brief JSONB,
   chosen_option, reasoning, agents_involved TEXT[], reversible BOOLEAN,
   cost_estimate NUMERIC, human_validated BOOLEAN, tags TEXT[])

2. actions -- Action Items mit Deadlines und Dependencies
   (id, decision_id FK, title, description, responsible, status,
   deadline, depends_on UUID[], priority, completed_at)

3. calendar_events -- Steuer- & Compliance-Kalender
   (id, title, event_type, event_date, warning_days DEFAULT 28,
   recurring, category, description, status,
   source TEXT DEFAULT 'manual',
   google_event_id TEXT UNIQUE,
   synced_at TIMESTAMPTZ)

4. budget -- Monatliches Budget-Tracking
   (id, month DATE, category, type [income/expense/investment/reserve],
   planned NUMERIC, actual NUMERIC, currency DEFAULT 'EUR', notes)

5. residence_tracker -- 183-Tage-Tracking
   (id UUID, country_code TEXT, country_name TEXT,
   arrival_date DATE NOT NULL, departure_date DATE,
   purpose TEXT, tax_relevant BOOLEAN DEFAULT TRUE)
   Plus: Views fuer days_counted und residence_summary mit 183-Tage-Warnsystem

6. human_experts -- Berater-Datenbank
7. chat_history -- Langzeit-Konversations-Gedaechtnis
8. agent_logs -- Debugging und Kostenkontrolle
9. wealth_snapshots -- Monatliche Vermoegens-Snapshots (mit GENERATED columns)
10. properties -- Immobilien-Register (vollstaendig mit Kauf, Finanzierung, AfA, Verkauf)
11. portfolio_holdings -- Wertpapier-Positionen
12. milestones -- Strategische Meilensteine
13. savings_goals -- Dynamische Spar- und Investitionsziele
14. exit_prerequisites -- Dynamische Exit-Readiness-Voraussetzungen
15. milestone_dependencies -- Strukturierte Abhaengigkeiten
16. asset_recommendations -- Agent-Empfehlungen zu Assets
17. target_countries -- Dynamische Ziellaender-Konfiguration
18. country_stability -- OSINT-Monitoring-Daten pro Land/Monat
19. monthly_scan_results -- Scan-Ergebnisse
20. knowledge_base -- RAG-Vektordatenbank (vector(1024), HNSW-Index, match_knowledge() RPC)
21. jurisdiction_costs -- Firmengruendungs- und Jahreskosten
22. passport_rankings -- Reisepass-Vergleichsdaten
23. insurance_coverage -- Versicherungspolicen
24. city_cost_of_living -- Lebenshaltungskosten pro Zielstadt
25. fx_rates -- Wechselkurse monatlich
26. portfolio_lots -- Individuelle Kauf-Lots fuer Haltefrist-Tracking
27. prompt_versions -- Prompt-Version-Control
28. user_feedback -- Mandanten-Feedback
29. coverage_gaps -- Fragen die kein Agent beantworten konnte
30. property_valuations -- Historische Immobilien-Wertentwicklung
31. infrastructure_health -- Woechentliche Infrastruktur-Logs
32. incident_log -- Infrastruktur-Fehler mit Learnings
33. agent_performance -- Monatliche Agent-Bewertungen
34. country_inflation -- Inflationsdaten pro Zielland
35. market_intelligence -- Markt-Signale aus externen Quellen
36. monthly_reports -- Weekly/Monthly Intelligence Briefs
37. macro_indicators -- Gold-Preis + EZB-Leitzins (woechentlich)

Bitte erstelle auch:
- Row Level Security (RLS) Policies (mit spezifischer User-UUID)
- Sinnvolle Indexe (auf agent, category, status, event_date)
- Initiale Calendar Events fuer deutsche Steuertermine 2026
- match_knowledge() und match_chat_history() RPC-Funktionen
- Views fuer residence_tracker und savings_goals

Kommentiere das SQL ausfuehrlich auf Deutsch.
```

### 1.3 -- Erster Agent: CFO + Tax Architect in n8n

**Claude Code Prompt:**
```
Ich moechte in n8n (self-hosted) einen Multi-Agent-Workflow bauen.
Bitte erstelle mir die detaillierte Schritt-fuer-Schritt-Anleitung
(inkl. Node-Konfigurationen als JSON, die ich importieren kann) fuer:

WORKFLOW 1: "CFO Orchestrator" (Main Workflow)

DUAL-TRIGGER ARCHITEKTUR:
Der Workflow hat ZWEI Eingaenge -- die Kernlogik danach ist identisch.

- Trigger A: MCP Server Trigger (fuer interaktive Beratung aus Claude)
  Exponiert den CFO als MCP-Tool namens "geoarbitrage_cfo"
  Input: {message: "...", session_id: "auto-generated"}
  Sicherheit: Nur ueber Tailscale VPN erreichbar + Bearer Token

- Trigger B: Webhook (POST, fuer Telegram-Bot)
  empfaengt JSON: {message: "...", session_id: "..."}
  Telegram Secret Token + Absender-Whitelist Verifikation

- Node "Merge": Vereinigt beide Trigger-Outputs in einheitliches Format
  {message, session_id, source: "mcp"|"telegram"}

Ab hier IDENTISCHER Flow fuer beide Kanaele:

- Node 1: HTTP Request -> Supabase (lade relevanten Context)
  "Always Output Data" = AN, $input.all() statt .first()
- Node 2: AI Agent Node (Claude Haiku 4.5) -- Intent Classification
  Output: JSON {agents_needed: ["tax"], routing_order, urgency, is_data_entry}
- Node 3: IF-Bedingung: Dateneintrag oder Frage?
- Node 4: Execute Sub-Workflow "Tax Architect"
  Node-Typ: "Execute Workflow" (NICHT den veralteten "Execute Sub-Workflow")
- Node 5: Execute Sub-Workflow "Validator"
- Node 6: AI Agent Node (Claude Haiku) -> Response Assembly
  Validator-Output Fallback-Kette: validated_response || response || overall_assessment
- Node 7: HTTP Request -> Supabase (schreibe chat_history + agent_logs)
- Node 8: Response Router (Switch Node):
  IF source = "mcp": Respond to MCP
  IF source = "telegram": Respond to Webhook

WORKFLOW 2: "Tax Architect" (Sub-Workflow)
- Trigger: "When Executed by Another Workflow" (Modus: "Accept all data")
- Input-Felder mit Fallback: question || user_message, context || chat_history
- Node 1: HTTP Request -> Supabase pgvector (match_knowledge, filter_bereiche='{tax,shared}')
- Node 2: AI Agent Node (Claude Sonnet 4.6)
  Body Content Type = Raw (NICHT JSON!)
  Auth: x-api-key Header (NICHT Bearer)
  max_tokens = 8192
  System Prompt: [AUS knowledge_base/core-prompts/agent-01-tax-architect.md]
- Return: Output an Main Workflow

WORKFLOW 3: "Validator" (Sub-Workflow)
- Trigger: "When Executed by Another Workflow" (Accept all data)
- Input-Felder mit Fallback: agent_response || recommendation
- Node 1: AI Agent Node (Claude Sonnet 4.6)
  JSON-Parse via indexOf/lastIndexOf, NICHT Regex
  max_tokens = 8192
- Return: Validierungsergebnis

Bitte erstelle fuer jeden Workflow:
1. Eine n8n-kompatible JSON-Datei die ich importieren kann
2. Die exakte Konfiguration jedes Nodes
3. Die Credential-Platzhalter die ich ausfuellen muss
4. Einen Test-Befehl (curl) um den Webhook zu testen

Fuer den System Prompt des Tax Architect verwende den Prompt aus
knowledge_base/core-prompts/agent-01-tax-architect.md.
```

### 1.4 -- Infrastructure Health Check (Woechentlicher Monitoring-Workflow)

**Claude Code Prompt:**
```
Erstelle einen n8n Cron-Workflow "Infrastructure Health Check":

Trigger: Cron (jeden Montag, 06:00 CET)

=== SCHICHT 1: Automatische Checks (kein LLM) ===

CHECK 1 -- SERVER-GESUNDHEIT:
   Bash Node (Execute Command):
   NODES_EXCLUDE=[] in docker-compose.yml muss gesetzt sein!
   - Disk Usage (ALERT wenn >80%)
   - RAM Usage (ALERT wenn >85%)
   - Docker Container Status (ALERT wenn nicht "Up")
   - Uptime, Load Average (ALERT wenn > 2.0)

CHECK 2 -- SSL-ZERTIFIKATE:
   - Tage bis Ablauf pruefen (ALERT wenn <14 Tage)

CHECK 3 -- N8N VERSION:
   - GitHub API: aktuellste Version vergleichen
   - KRITISCH wenn Major-Version-Differenz

CHECK 4 -- API-ENDPUNKTE PING:
   a) Anthropic b) Voyage AI c) GDELT d) CoinGecko
   e) Yahoo Finance f) ExchangeRate g) Tavily h) ACLED
   Pro Endpunkt: Status Code + Response Time

CHECK 5 -- SUPABASE FREE TIER LIMITS:
   - DB-Groesse via SQL (ALERT wenn > 400MB)
   - Storage-Nutzung via Management API
   - Auth-User-Count (ALERT wenn > 1)

CHECK 6 -- WORKFLOW ERROR LOGS
CHECK 7 -- N8N WORKFLOW EXECUTION LOGS
CHECK 8 -- TAILSCALE STATUS
CHECK 9 -- API-KOSTEN-STATUS (WARNUNG wenn >75% Budget)

=== SCHICHT 2: Fehleranalyse (nur bei Alarmen, Haiku) ===

Haiku Call nur wenn Schicht 1 mindestens einen ALERT produziert.
Output: {critical_issues, warnings, system_health_score}

=== SCHICHT 3: Logging & Alerting ===

1. Supabase Insert in infrastructure_health Tabelle
2. Telegram Alert (nur bei critical/warning, NICHT bei healthy)
3. Dashboard Integration: System Health Abschnitt

Kosten: 0 EUR (kein LLM wenn alles OK, ~0.01 EUR Haiku wenn Alarm)
```

### 1.5 -- Automatisches Backup (Woechentlich)

**Claude Code Prompt:**
```
Erstelle ein Backup-Script (backup.sh) und einen Cron-Job:

Zeitplan: Jeden Sonntag 03:00 Uhr

Schritte:
1. n8n Workflows exportieren
2. n8n Credentials exportieren (verschluesselt)
3. .env Datei sichern (BACKUP_PASSPHRASE NICHT ins Backup)
4. Nginx-Konfiguration sichern
5. Verschluesseltes Archiv erstellen (AES-256-CBC mit BACKUP_PASSPHRASE)
6. Alte Backups loeschen (behalte letzte 4 Wochen)
7. Off-Site Backup via Private GitHub Repo (SSH Deploy Key)

8. Restore-Script (restore.sh):
   a) BACKUP_PASSPHRASE manuell eingeben
   b) Backup entschluesseln
   c) .env wiederherstellen
   d) Nginx-Konfiguration wiederherstellen
   e) Docker Compose starten
   f) Warten bis n8n gesund ist
   g) Workflows importieren
   h) Credentials importieren
   i) Workflows publishen (n8n 2.x -- ohne Publish keine Webhook-Triggers)
   j) Verifikation

BACKUP_PASSPHRASE separat sichern (Passwort-Manager oder Tresor).
```

---

## Sprint 2: Chat Memory + RAG Pipeline (Woche 3-4)

**Ziel:** Antworten werden validiert UND stress-getestet, Chat History wird gespeichert und abrufbar.

### 2.1 -- Validator & Stress-Tester Sub-Workflow

**Claude Code Prompt:**
```
Erstelle einen n8n Sub-Workflow "Validator & Stress-Tester" mit folgender Logik:

- Input: Agent-Empfehlung (JSON) + User-Frage + RAG-Chunks die der
  Fachagent erhalten hat
- Node 1: AI Agent Node (Claude Sonnet 4.6)
  Sprint 1 Bug Fixes beachten:
  - x-api-key Header, NICHT Bearer
  - Body Content Type = Raw (NICHT JSON!)
  - Input-Felder mit Fallback lesen (agent_response || recommendation)
  - max_tokens = 8192
  - JSON-Parse via indexOf/lastIndexOf, NICHT Regex
  System Prompt: Validator & Stress-Tester Kern-Prompt
  [AUS knowledge_base/core-prompts/agent-09-validator.md]
  Output: JSON {
    validation: {status: "validated|partial|rejected|unverifiable",
                 checked_claims: [], issues: []},
    stress_test: {showstoppers: [], significant_risks: [],
                  acceptable_risks: [], blind_spots: []}
  }
- Return: Validierung + Risiko-Assessment (kombiniert)

Integriere den Workflow in den CFO Orchestrator:
- Nach dem Fachagent-Sub-Workflow
- Conditional: Nur aufrufen wenn confidence < 0.85 ODER decision ist
  irreversibel ODER cost_estimate > 5000
- Bei einfachen Fragen: ueberspringen (spart 1 Sonnet-Call)

Erstelle auch die bedingte Logik (IF-Node) fuer diese Entscheidung.
```

### 2.2 -- Chat Memory + Episodic Retrieval

**Claude Code Prompt:**
```
Erweitere den CFO Orchestrator Workflow um ein vollstaendiges Memory-System:

WORKING MEMORY (bereits vorhanden):
- Letzte 10 Messages aus chat_history fuer aktuelle session_id

EPISODIC MEMORY (neu):
- Bei jeder neuen Anfrage: Erstelle ein Embedding der User-Nachricht
  (Voyage AI voyage-4-lite via HTTP Request)
- Suche in chat_history nach den 3 aehnlichsten vergangenen Konversationen
  (Cosine Similarity via pgvector)
- Fuege relevante vergangene Konversationen zum Context hinzu

VORAUSSETZUNG: chat_history Tabelle braucht embedding-Spalte:
  ALTER TABLE chat_history
    ADD COLUMN IF NOT EXISTS embedding vector(1024),
    ADD COLUMN IF NOT EXISTS embedding_model TEXT DEFAULT 'voyage-4-lite';

  CREATE INDEX IF NOT EXISTS idx_chat_history_embedding
    ON chat_history USING hnsw (embedding vector_cosine_ops);

Erstelle:
1. Einen n8n-Node der das Embedding generiert (HTTP Request zu Voyage AI API)
   Endpunkt: POST https://api.voyageai.com/v1/embeddings
   Body: {"input": ["User-Nachricht"], "model": "voyage-4-lite", "input_type": "query"}
   Header: Authorization: Bearer VOYAGE_API_KEY
2. Einen n8n-Node der die Similarity Search in Supabase ausfuehrt
   "Always Output Data" = AN, $input.all() statt .first()
3. Die Supabase SQL-Funktion match_chat_history(embedding, threshold, limit)
4. Die Integration in den Context Assembly Schritt des CFO Workflows

Fuer die Embeddings brauche ich auch:
- Einen separaten Workflow der nach jeder Konversation den Chat-Eintrag
  mit Embedding in chat_history speichert
  (Embedding-Modell: voyage-4-lite mit input_type: "document")
```

### 2.3 -- Agent Logging + Kosten-Tracking

**Claude Code Prompt:**
```
Erstelle in n8n einen "Logger" Utility-Workflow der nach JEDEM
Agent-Call automatisch aufgerufen wird und folgendes in die
agent_logs Tabelle schreibt:

- session_id
- agent name
- input_summary (erste 200 Zeichen)
- output_summary (erste 200 Zeichen)
- confidence_score (aus Agent-Output extrahiert)
- validation_status (aus Validator-Output)
- escalated (boolean)
- tokens_in und tokens_out (aus der Anthropic API Response)
- cost_eur (berechnet mit modellspezifischem Pricing):

  const PRICING_USD = {
    'claude-haiku-4-5-20251001': { input: 0.80 / 1_000_000, output: 4.00 / 1_000_000 },
    'claude-sonnet-4-6':         { input: 3.00 / 1_000_000, output: 15.00 / 1_000_000 },
  };
  const EUR_USD = 1.08;
  const cost_eur = ((tokens_in * p.input) + (tokens_out * p.output)) / EUR_USD;

- execution_time_ms

Erstelle auch einen Kosten-Aggregations-View in Supabase:
SELECT
  DATE_TRUNC('month', created_at) as month,
  SUM(cost_eur) as total_cost,
  COUNT(*) as total_calls,
  SUM(tokens_in + tokens_out) as total_tokens
FROM agent_logs
GROUP BY 1
ORDER BY 1 DESC;
```

---

## Sprint 3: Knowledge Base + Embedding (Woche 5-6)

**Ziel:** Agenten zitieren echte Gesetzestexte statt zu halluzinieren.

### 3.1 -- Embedding-Pipeline aufbauen

**Claude Code Prompt:**
```
Baue eine Embedding-Pipeline die Dokumente in die Supabase
knowledge_base Tabelle laedt. Ich brauche:

1. Ein Python-Script (ingest_documents.py) das:
   - PDF-Dateien einliest (pypdf oder pdfplumber)
   - Den Text in Chunks von ~500 Tokens aufteilt
     (mit 50 Token Overlap)
   - Fuer jeden Chunk ein Embedding generiert
     (Voyage AI voyage-4-lite, input_type: "document")
   - Den Chunk + Embedding + Metadaten in Supabase speichert

   Voyage AI API Call:
   POST https://api.voyageai.com/v1/embeddings
   Headers: Authorization: Bearer $VOYAGE_API_KEY
   Body: {"input": ["chunk text"], "model": "voyage-4-lite", "input_type": "document"}

   HINWEIS: voyage-4-lite gibt 1024-dimensionale Vektoren zurueck.

   Input-Parameter:
   - --file: Pfad zur PDF-Datei
   - --bereich: Wissensbereich (tax, immobilien, corporate, etc.)
   - --source_type: law, dba, bfh_ruling, program_guide, article
   - --source_name: z.B. "§2 AStG" oder "DBA DE-UAE"

2. Ein Batch-Script (ingest_all.sh) das eine Liste von Dokumenten
   nacheinander verarbeitet

3. Eine Anleitung wo ich die relevanten Gesetzestexte als PDF
   herunterladen kann:
   - AStG (Volltext)
   - Relevante EStG-Paragraphen
   - DBA Deutschland-UAE, -Zypern, -Portugal, -Malta, -Estland

Wichtig: Das Script muss Rate Limiting beachten (max 300 RPM
bei Voyage AI Free Tier) und Fortschritt anzeigen.
```

### 3.2 -- RAG-Tool in n8n integrieren

**Claude Code Prompt:**
```
Erstelle ein wiederverwendbares RAG-Tool als n8n Sub-Workflow:

Input: {query: "...", agent: "tax", top_k: 5, threshold: 0.7}

Schritte:
1. Embedding der Query generieren (Voyage AI API, input_type: "query")
2. Supabase RPC Call: match_knowledge(embedding, threshold, top_k, bereiche)
   Beispiel Tax Architect: filter_bereiche = '{tax,shared}'
   Beispiel Wealth Manager: filter_bereiche = '{wealth,shared}'
   Immer BEIDE Bereiche: Fachbereich + 'shared'
3. Ergebnisse formatieren als Context-String:
   "RELEVANTE RECHTSGRUNDLAGEN:\n[Source 1]: Content...\n[Source 2]: ..."
4. Return: Formatierter Context-String

Dieser Sub-Workflow wird von JEDEM Spezialisten-Agent aufgerufen
bevor der LLM-Call stattfindet.

Zeige mir auch wie ich den RAG-Context in den AI Agent Node
des Tax Architect einbaue.
```

---

## Sprint 4: Alle Agenten + Multi-Agent Routing (Woche 7-8)

**Ziel:** Alle 8 Kern-Agenten + Validator sind als Sub-Workflows implementiert.

### 4.1 -- Agenten nacheinander aufbauen

Reihenfolge:
1. Tax Architect (Sprint 1 erledigt)
2. Immobilien-Spezialist
3. Corporate Structure Agent
4. Wealth Manager
5. Immigration Agent
6. Insurance Agent
7. Relocation Agent

**Claude Code Prompt (Vorlage, fuer jeden Agent anpassen):**
```
Erstelle einen n8n Sub-Workflow fuer den Agenten
"[AGENT-NAME]" nach folgendem Muster:

Input: {question, context, session_id}

Schritte:
1. RAG Query (Sub-Workflow "RAG Tool" mit agent="[AGENT-ID]")
2. AI Agent Node:
   - Modell: [Claude Sonnet 4.6 ODER Haiku 4.5 -- siehe Modell-Routing]
   - System Prompt: [AUS knowledge_base/core-prompts/agent-XX-name.md]
   - Tools: AGENTEN-SPEZIFISCH (siehe unten)
   - Output: Strukturiertes JSON

Output: {empfehlung, optionen, confidence, affects, sources,
escalation_needed, escalation_reason}

AGENTEN-SPEZIFISCHE TOOLS:

Tax Architect:
  - Web Search (Tavily), Steuerrechner, Wechselkurs-API
  - DB Query READ: properties, budget, portfolio_holdings, portfolio_lots,
    target_countries, fx_rates, macro_indicators

Immobilien-Spezialist:
  - Web Search (Tavily), Cashflow-Simulator (15-Jahres-Modell),
    Finanzierungs-/AfA-Rechner
  - DB Query READ: properties, property_valuations, budget, decisions,
    macro_indicators

Corporate Structure:
  - Web Search (Tavily), Calculator
  - DB Query READ: jurisdiction_costs, target_countries, decisions

Immigration:
  - Web Search (Tavily), 183-Tage-Rechner
  - DB Query READ: residence_tracker, target_countries, passport_rankings,
    calendar_events

Wealth Manager:
  - Web Search (Tavily), Monte-Carlo-Simulator, Stress-Test-Simulator,
    Korrelations-Checker, FIRE-Rechner, Kurshistorien, Wechselkurs-API
  - DB Query READ: portfolio_holdings, portfolio_lots, wealth_snapshots,
    budget, fx_rates, properties, country_stability, macro_indicators

Insurance:
  - Web Search (Tavily), Coverage-Gap-Checker
  - DB Query READ: insurance_coverage, target_countries, properties

Relocation:
  - Web Search (Tavily), Zeitzonen-Rechner
  - DB Query READ: target_countries, city_cost_of_living,
    calendar_events, residence_tracker

Modell-Routing:
| Agent                      | Modell                        |
|----------------------------|-------------------------------|
| Tax Architect              | claude-sonnet-4-6             |
| Immobilien-Spezialist      | claude-sonnet-4-6             |
| Corporate Structure        | claude-sonnet-4-6             |
| Wealth Manager             | claude-sonnet-4-6             |
| Immigration                | claude-haiku-4-5-20251001     |
| Insurance                  | claude-haiku-4-5-20251001     |
| Relocation                 | claude-haiku-4-5-20251001     |
| Validator & Stress-Tester  | claude-sonnet-4-6             |
| CFO (Routing)              | claude-haiku-4-5-20251001     |

PFLICHT-CHECKLISTE fuer JEDEN neuen Agenten-Workflow:
- Anthropic Auth: x-api-key Header, NICHT Authorization: Bearer
- HTTP Body Type: Raw + application/json, NICHT JSON-Typ
- Credential-Dropdown nach Import neu auswaehlen
- max_tokens mind. 8192
- Supabase Lese-Nodes: "Always Output Data" = AN
- JSON-Parse: indexOf/lastIndexOf statt Regex
- Input-Felder: Doppelte Fallbacks (question/user_message etc.)
- System Prompts aus knowledge_base/core-prompts/ laden, NICHT selbst generieren
```

### 4.2 -- CFO Routing fuer alle Agenten erweitern

**Claude Code Prompt:**
```
Erweitere den CFO Orchestrator Workflow so, dass er basierend auf
dem Intent Classification Ergebnis die richtigen Sub-Workflows
aufruft:

agents_needed kann enthalten: tax, immo, corporate, immigration,
wealth, insurance, relocation

Fuer jedes Element in agents_needed:
- Rufe den entsprechenden Sub-Workflow auf (Execute Workflow Node)
- Uebergib: question + context + vorherige Agent-Ergebnisse
- Sammle alle Ergebnisse

Routing-Logik:
- "sequential": Agenten werden nacheinander aufgerufen,
  jeder sieht die Ergebnisse der vorherigen
- "parallel": Agenten werden unabhaengig aufgerufen
  (z.B. bei Vergleichsfragen)

Erstelle die Switch/Router-Logik mit n8n IF-Nodes und
Execute Workflow Nodes.
```

---

## Sprint 5: Dashboard + Telegram (Woche 9-10)

**Ziel:** Professionelles Dashboard und Telegram als primaerer Input-Kanal.

### Sprint 5 Prompt

```
Bitte lese HANDOFF_SPRINT_4_3.md und den Blueprint
(geo-arbitrage-implementation-blueprint.md, Abschnitt Sprint 5 / Woche 11-12)
und fahre mit Sprint 5 fort: Dashboard + Telegram.

Kontext: Sprint 4.3 ist komplett -- Multi-Agent Orchestration mit
SplitInBatches V3 Loop, Conditional Validator, RAG fuer alle 7 Bereiche
(1898 Chunks), 11 Workflows live. 4 E2E-Tests bestanden (inkl. Multi-Agent:
Corporate + Immigration + Tax).

Naechste Schritte laut Blueprint:
- Sprint 5.1: Next.js Dashboard mit Supabase Realtime
  (Prototyp in dashboard-v2.jsx)
- Sprint 5.2: Telegram Bot als primaerer Input-Kanal
  (Telegram Chat ID: siehe Memory)

Regeln:
- Hole dir ALLE kostenpflichtigen Freigaben EINMALIG am Anfang,
  dann arbeite komplett autonom
- Melde dich erst wenn alles fertig deployed und geprueft ist
- Pruefe VOR jedem Deploy gegen die bekannten Bugs in CLAUDE.md
  (aktuell 20+ dokumentierte Bugs)
- Deploy IMMER: Import -> Publish -> Restart
- Webhook-Tests: 600s Timeout
- Ich zahle nicht fuer bekannte Fehler
```

### Sprint 5 Blueprint-Prompts (Referenz)

#### 5.1 -- Next.js Dashboard deployen
```
Ich habe einen React-Dashboard-Prototyp (JSX-Datei mit Tailwind,
Recharts, alle Daten als Mock). Bitte konvertiere diesen in ein
vollstaendiges Next.js Projekt:

1. Next.js App Router Setup mit TypeScript
2. Supabase Client Integration (@supabase/supabase-js)
3. Ersetze alle Mock-Daten durch Supabase Queries
4. Realtime Subscription fuer Live-Updates (Supabase Realtime)
5. Deployment-Config fuer Vercel (vercel.json)
6. Environment Variables: NEXT_PUBLIC_SUPABASE_URL,
   NEXT_PUBLIC_SUPABASE_ANON_KEY

Hier ist der aktuelle React-Prototyp:
[DASHBOARD-V2.JSX INHALT HIER EINFUEGEN]
```

#### 5.2 -- Telegram Integration
```
Erstelle einen n8n Workflow fuer die Telegram Bot Integration.

VORAB EINMALIG (manuell):
1. Telegram -> @BotFather -> /newbot -> Name vergeben -> Token notieren
2. Chat-ID ermitteln via getUpdates
3. Webhook registrieren:
   POST https://api.telegram.org/bot{TOKEN}/setWebhook
   Body: {"url": "https://webhook.YOUR_DOMAIN.com/webhook/telegram",
          "secret_token": "{TELEGRAM_SECRET_TOKEN}"}

WORKFLOW: "Telegram Bot"

Node 1: Webhook Trigger + Secret Token Verifikation
Node 2: Parse Message + Absender-Verifikation (Chat-ID Whitelist)
Node 3: Intent Detection (Claude Haiku):
  data_entry | config | question | feedback

- IF data_entry: Parse -> Supabase Insert -> Telegram Reply
- IF config: Parse -> Supabase Update -> Telegram Reply
- IF question: CFO Orchestrator -> Kuerze fuer Telegram -> sendMessage
- IF feedback: Supabase Insert user_feedback

In .env ergaenzen:
  TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN
  TELEGRAM_SECRET_TOKEN=YOUR_SECRET_TOKEN
  TELEGRAM_ALLOWED_CHAT_ID=YOUR_CHAT_ID
```

#### 5.3 -- Proaktive Alerts via Telegram
```
Erstelle einen n8n Utility-Workflow "Send Alert":

Input: {message: "...", urgency: "red|yellow|green", category: "..."}

1. Formatiere die Nachricht (rot/gelb/gruen Emoji)
2. Sende via Telegram Bot API
3. Logge den Alert in agent_logs

Erstelle auch "Weekly Deadline Check":
- Trigger: Cron (Montags, 08:00 CET)
- calendar_events naechste 14 Tage pruefen
- Ueberfaellige actions pruefen
- Alerts senden
```

---

## Sprint 6: Weekly Scan + Calendar + Reports (Woche 11-12)

**Ziel:** Das System arbeitet selbstaendig -- woechentlicher Scan, Fristen-Ueberwachung, automatische Reports.

### Sprint 6 Prompt

```
Bitte lese HANDOFF_SPRINT_5.md und den Blueprint
(geo-arbitrage-implementation-blueprint.md, Abschnitt Sprint 6 / Woche 13-14)
und fahre mit Sprint 6 fort: Weekly Scan + Calendar + Reports.

Kontext: Sprint 5 ist komplett -- Dashboard live auf Vercel, Telegram Bot
aktiv (Daten/Fragen/Alerts), 15 Workflows (14 aktiv), 9 Bugs gefixt.
Security-Check bestanden.

Naechste Schritte laut Blueprint:
- Sprint 6.1: Weekly Scan Automation (Tavily Web Search + Agent Analysis)
- Sprint 6.2: Google Calendar Sync (iPhone -> iCloud -> Google Cal -> n8n)
- Sprint 6.3: Monthly Report Generator

Regeln:
- Hole dir ALLE Freigaben EINMALIG am Anfang, dann arbeite komplett autonom
- Melde dich erst wenn alles fertig deployed und geprueft ist
- Pruefe VOR jedem Deploy gegen die bekannten Bugs in CLAUDE.md
  (aktuell 30+ dokumentierte Bugs)
- Supabase Schema IMMER zuerst pruefen bevor Inserts gebaut werden
- Deploy IMMER: Import -> Publish -> Restart
- Neue Env Vars: docker compose up -d (NICHT restart!)
- Webhook-Tests: 600s Timeout
- Ich zahle nicht fuer bekannte Fehler
```

### Sprint 6 Blueprint-Prompts (Referenz)

#### 6.0 -- Google Calendar Sync
```
Erstelle einen n8n Cron-Workflow "Calendar Sync":

Trigger: Cron (alle 6 Stunden -- 06:00, 12:00, 18:00, 00:00 CET)

Schritt 1: Google Calendar Events laden (naechste 90 Tage)
Schritt 2: Events kategorisieren (Code Node, kein LLM)
  Keyword-Matching: Steuer -> tax, Notar -> real_estate, Visum -> immigration
Schritt 3: Upsert in calendar_events (Supabase)
  Match auf google_event_id (UNIQUE), source='google_calendar'
  Geloeschte Events -> status='cancelled' (nicht loeschen)
Schritt 4: Logging (Agent Logger, 0 Tokens)

Kosten: 0 EUR
```

#### 6.1 -- Weekly Monitoring Scan
```
Erstelle einen n8n Cron-Workflow "Weekly Scan":

Trigger: Cron (jeden Montag, 08:00 CET)

3 Scan-Schichten:
A) OSINT-Daten (kostenlose APIs, kein LLM):
   A1. GDELT Stability API (Instabilitaets-Score pro Zielland)
   A2. GDELT DOC API (Nachrichtenvolumen-Spikes)
   A3. ACLED Conflict Data (Protest-/Konfliktereignisse, OAuth2)
   A4. Polymarket (Geopolitische Prediction Markets)
   A5. Immobilien-Equity-Update (Tilgung + Cashflow berechnen)
   A6. Kurs-Update (Yahoo Finance + CoinGecko + Fallback Twelvedata)
   A7. Wechselkurs-Update (ExchangeRate-API)
   A8. Cost-of-Living-Update (quartalsweise, Tavily)
   A9. Inflations-Monitor (World Bank API)
   A10. Market Intelligence Scan (Tavily, kein LLM)
   A11. Fristen-Check (calendar_events + actions + residence_summary)
   A12. Gold-Preis-Update (Yahoo Finance GC=F)
   A13. EZB-Leitzins-Update (ECB Data Portal API)

B) Web Search (Tavily):
   B1. Steuerrecht-Scan (AStG, Wegzugsbesteuerung)
   B2. Immigration-Scan (Visa-Aenderungen in Ziellaendern)
   B3. Immobilien-Scan (Marktprognosen)
   B4. Wirtschafts-Scan (Wechselkurse, Wirtschaft)

C) AI-Bewertung (nur wenn noetig):
   C1. OSINT-Anomalie-Bewertung (Haiku, nur bei Alarmen)
   C2. Rechtsaenderungs-Bewertung (Haiku, nur bei Treffern)
   C3. Gesamt-Aggregation (Sonnet, nur bei Aenderungen)

DYNAMISCHE LAENDERLISTE: Scan liest aus target_countries WHERE status='active'.

Kosten: 0 EUR APIs + ~0.05-0.50 EUR LLM je nach Alarmen.
```

#### 6.2 -- Weekly Intelligence Brief
```
Erstelle einen n8n Workflow "Weekly Report Generator":

Trigger: Wird am Ende des Weekly Scan aufgerufen

1. Sammle Daten aus Supabase (Vermoegen, Budget, Portfolio, Immobilien,
   Actions, Milestones, Country Stability, Kosten, Scan-Ergebnisse,
   fx_rates, Savings Goals)
2. Stress-Test Snapshot (Code Node, kein LLM)
3. Korrelations-Check (Code Node, kein LLM)
4. Sonnet Call: "Erstelle den Weekly Intelligence Brief"
   4 Absaetze: Was ist passiert, Kontext, Handlungsbedarf, Ausblick
5. Telegram Delivery (Kurzversion + Dashboard-Link)
6. Dashboard: Vollstaendiger Brief im Scan Tab
```

#### 6.3 -- Quartalsweiser Quality Review
```
Erstelle einen n8n Cron-Workflow "Quarterly Quality Check":

Trigger: Cron (1. Dienstag im Januar, April, Juli, Oktober -- 10:00 CET)

Schritte (KEIN LLM -- nur Datensammlung + Telegram-Report):
1. DATEN SAMMELN: agent_logs pro Agent (Calls, Confidence, Validator Rate,
   Kosten)
2. USER FEEDBACK: user_feedback pro Agent (Positive Rate, Trend)
3. COVERAGE GAPS: Haeufungen identifizieren
4. KNOWLEDGE STALENESS CHECK: Veraltete Chunks finden
5. TELEGRAM REPORT: Zusammenfassung ohne LLM

Kosten: 0 EUR
```

---

## Sprint 7: APIs + Monitoring + Security (Woche 13-14)

**Ziel:** System mit echten Daten befuellen, erste vollstaendige Analyse durchfuehren.

### Sprint 7 Prompt

```
Bitte lese HANDOFF_SPRINT_6.md und den Blueprint
(geo-arbitrage-implementation-blueprint.md, Abschnitt Sprint 7)
und fahre mit Sprint 7 fort: Optimierung + Initiales Setup.

Kontext: Sprint 6 ist komplett -- Weekly Scan (27 Nodes, 13 Sub-Scans),
Weekly Report Generator, Quarterly Quality Check, Calendar Sync live.
19 Workflows (18 aktiv). Alle API Keys konfiguriert (Tavily, Twelvedata,
CoinGecko, Google Calendar OAuth2). ACLED Credentials fehlen noch.

Naechste Schritte laut Blueprint:
- Sprint 7.1: Initiale Daten einpflegen (Immobilien, Portfolio, Budget
  via Telegram oder Supabase)
- Sprint 7.2: Erste vollstaendige System-Analyse (voller Agent-Flow:
  CFO -> Agents -> Validator -> Decision Brief)
- Sprint 7.3: Knowledge Base erweitern (Rechtstexte AStG, EStG, GrEStG,
  DBA-Texte)

Offene Punkte aus Sprint 6 (vorher erledigen):
- ACLED_EMAIL + ACLED_PASSWORD in .env eintragen (User fragen)
- GDELT API Alternative evaluieren (v1 gibt 404)
- Polymarket Datum-Filter einbauen (gibt alte Markets zurueck)
- n8n API Key in UI erstellen

Regeln:
- Hole dir ALLE Freigaben EINMALIG am Anfang, dann arbeite komplett autonom
- Melde dich erst wenn alles fertig deployed und geprueft ist
- Pruefe VOR jedem Deploy gegen die bekannten Bugs in CLAUDE.md
- Supabase Schema IMMER zuerst pruefen bevor Inserts gebaut werden
- Deploy IMMER: Import -> Publish -> Restart
- Neue Env Vars: docker compose up -d (NICHT restart!)
- Webhook-Tests: 600s Timeout
- Ich zahle nicht fuer bekannte Fehler
```

### Sprint 7 Blueprint-Prompts (Referenz)

#### 7.1 -- Initiale Daten einpflegen

Via Telegram an den Bot (oder direkt in Supabase):
```
Immobilien:
"Immobilie hinzufuegen: ETW [YOUR_CITY] [YOUR_DISTRICT], Kaufdatum [DATUM],
Kaufpreis [BETRAG], aktueller Wert [BETRAG], Miete [BETRAG]/Monat,
Kredit [BETRAG] zu [ZINS]%, Privatbesitz, AfA linear 2%"

Portfolio:
"Portfolio: [ANZAHL]x [TICKER] zu [PREIS] EUR, [ANZAHL]x [TICKER] zu [PREIS] EUR,
[MENGE] BTC zu [PREIS] EUR, [MENGE] ETH zu [PREIS] EUR"

Budget:
"Gehalt netto: [BETRAG] EUR, Miete: [BETRAG] EUR, Versicherungen: [BETRAG] EUR,
Lifestyle-Budget: [BETRAG] EUR, ETF-Sparplan: [BETRAG] EUR, Krypto: [BETRAG] EUR,
Notreserve: [BETRAG] EUR, GeoArbitrage Fund: [BETRAG] EUR"
```

#### 7.2 -- Erste vollstaendige System-Analyse

Frage ueber Telegram:
```
"Bitte analysiere meine Gesamtsituation fuer das GeoArbitrage-Projekt:
- Angestellt, ~[BETRAG]k brutto, Immobilie in [YOUR_CITY]
- Ziel: Steuerdomizil mittelfristig verlagern (z.B. UAE oder Zypern)
- Immobilienportfolio ausbauen (Hebel + Steuervorteile)
- Zweite Staatsbuergerschaft erwerben
- Welche Schritte muss ich in welcher Reihenfolge gehen?"
```

Diese Frage aktiviert den vollen Agent-Flow: CFO routet an Tax + Immo + Immigration + Corporate -> Validator & Stress-Tester -> Decision Brief.

#### 7.3 -- Knowledge Base erweitern

**Claude Code Prompt:**
```
Erstelle ein Script das folgende frei verfuegbare Rechtstexte
herunterlaed und in die Knowledge Base ingested:

1. AStG von gesetze-im-internet.de
2. EStG (relevante Paragraphen) von gesetze-im-internet.de
3. GrEStG von gesetze-im-internet.de
4. DBA-Texte vom BMF (soweit als PDF verfuegbar)

Das Script soll:
- Die Webseiten fetchen
- Den relevanten Text extrahieren
- In Chunks aufteilen
- Embeddings generieren
- In Supabase speichern

Verwende BeautifulSoup fuer Web Scraping und die bestehende
ingest_documents.py Pipeline.
```
