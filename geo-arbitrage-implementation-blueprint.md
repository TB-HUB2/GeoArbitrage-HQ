# GeoArbitrage HQ — Vollständiges Implementierungs-Blueprint

## Projektübersicht

**Was wir bauen:** Ein AI-gestütztes Virtual Family Office ("GeoArbitrage HQ"), das als persönlicher Beraterstab fungiert. 9 spezialisierte AI-Agenten (8 Fachberater + 1 Qualitätskontrolle), orchestriert durch n8n, mit RAG-basierter Knowledge Base (pgvector + Voyage AI), Telegram als Input-Kanal, einem Premium-Dashboard für Überblick, und monatlichem automatischem Monitoring.

> **Architektur-Optimierung (März 2026):** Das Agenten-System wurde von 11 auf 9 Agenten konsolidiert. Der Devil's Advocate wurde in den Validator integriert (1 statt 2 QC-Calls). Der Performance Manager wurde durch quartalsweisen manuellen Review ersetzt. Das Fachwissen wurde aus den System Prompts in eine RAG-basierte Knowledge Base ausgelagert (~70% Token-Einsparung pro Call). Details: `knowledge_base/RAG-INTEGRATION.md`

**Ziel:** Geografische und finanzielle Unabhängigkeit vorbereiten — Steueroptimierung, Immobilien-Strukturierung, zweite Staatsbürgerschaft, Vermögensaufbau, Exit-Readiness aus Deutschland.

**Tech-Stack:**
- **Orchestrator:** n8n (self-hosted auf Hetzner VPS, NUR über VPN erreichbar)
- **Datenbank:** Supabase (Free Tier) — PostgreSQL + pgvector + Auth + RLS
- **LLM:** Claude API (Sonnet 4.6 + Haiku 4.5, smartes Routing, Budget-Limit 20€/Mo)
- **Frontend:** Next.js Dashboard (Vercel, Login + 2FA via Supabase Auth)
- **Kommunikation:** Telegram Bot API (Alerts, Reports, Mobile) + MCP Server Trigger (interaktive Beratung direkt aus Claude)
- **Sicherheit:** Tailscale VPN + fail2ban + Rate Limiting + API Spending Limits
- **Kurs-Daten:** Yahoo Finance API + CoinGecko API + ExchangeRate-API (alle kostenlos)

**Laufende Kosten:** ~13,90-14,90€/Monat (Stand April 2026, nach Hetzner-Preisanpassung, inkl. wöchentlichem Scan und Cloud Backup)

**Implementierungstool:** Claude Code (CLI-basierter Coding-Agent)

---

## Warum Claude Code und nicht Cowork?

Claude Code ist ein Command-Line-Tool, das direkt im Terminal arbeitet — es kann Dateien erstellen, Shell-Befehle ausführen, Docker-Container hochfahren, APIs testen und Code iterativ debuggen. Genau das brauchst du für dieses Projekt: Server-Setup, Datenbank-Schema, n8n-Konfiguration, Frontend-Entwicklung.

Cowork ist für Nicht-Entwickler gedacht (Datei- und Task-Management auf dem Desktop). Für technische Implementierung ist Claude Code 10x effektiver.

**Wie du Claude Code für dieses Projekt nutzt:**
1. Öffne dein Terminal
2. Starte Claude Code
3. Gib ihm den jeweiligen Sprint-Auftrag (unten detailliert beschrieben)
4. Claude Code erstellt Dateien, führt Befehle aus, testet, und iteriert

Jeder Sprint unten enthält einen konkreten **Prompt für Claude Code**, den du copy-pasten kannst.

---

## Gesamtarchitektur (Referenz)

```
┌──────────────────────────────────────────────────────────────────┐
│                    INTERFACE LAYER                                │
│  ┌────────────────┐  ┌───────────────┐  ┌──────────────────────┐ │
│  │ Claude (MCP)    │  │ Telegram Bot   │  │ Dashboard            │ │
│  │ (Beratung,      │  │ (Alerts,       │  │ (Next.js/Vercel)     │ │
│  │  Analyse,       │  │  Reports,      │  │                      │ │
│  │  Folgefragen)   │  │  Mobile,       │  │                      │ │
│  │                 │  │  Dateneingabe)  │  │                      │ │
│  └───────┬─────────┘  └──────┬─────────┘  └─────────┬───────────┘ │
└──────────┼───────────────────┼───────────────────────┼───────────┘
           │                   │                       │
┌──────────┼───────────────────┼───────────────────────┼───────────┐
│          ▼                   ▼    AGENT LAYER        ▼           │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │              n8n (Hetzner VPS, Docker)                    │    │
│  │                                                          │    │
│  │  MAIN: CFO Orchestrator Workflow                         │    │
│  │  ├── TRIGGER (Dual-Input):                               │    │
│  │  │   ├── MCP Server Trigger (Claude → direkte Beratung)  │    │
│  │  │   └── Webhook Trigger (Telegram → Alerts/Reports)     │    │
│  │  ├── Intent Classification (Haiku)                       │    │
│  │  ├── Context Assembly (DB Queries)                       │    │
│  │  ├── RAG Query (Voyage AI + pgvector):                    │    │
│  │  │   └── Top 3-5 Knowledge Chunks laden                  │    │
│  │  ├── Agent Routing → Sub-Workflows:                      │    │
│  │  │   ├── Tax Architect (Sonnet)                          │    │
│  │  │   ├── Immobilien-Spezialist (Sonnet)                  │    │
│  │  │   ├── Corporate Structure (Sonnet)                    │    │
│  │  │   ├── Immigration Agent (Haiku)                       │    │
│  │  │   ├── Wealth Manager (Sonnet)                         │    │
│  │  │   ├── Insurance Agent (Haiku)                         │    │
│  │  │   └── Relocation Agent (Haiku)                        │    │
│  │  ├── Quality Gate:                                       │    │
│  │  │   └── Validator & Stress-Tester (Sonnet + Web Search) │    │
│  │  ├── Response Assembly (Haiku)                           │    │
│  │  ├── Response Router:                                    │    │
│  │  │   ├── → MCP Response (zurück an Claude)               │    │
│  │  │   └── → Telegram Response (zurück an Telegram Bot)    │    │
│  │  └── State Update (DB Write)                             │    │
│  │                                                          │    │
│  │  CRON: Weekly Scan + Report (→ Telegram)                 │    │
│  │  CRON: Kurs-Update (Yahoo Finance + CoinGecko)           │    │
│  │  CRON: Calendar Sync (Google Calendar → calendar_events)  │    │
│  └──────────────────────────────────────────────────────────┘    │
└──────────────────────────────┬───────────────────────────────────┘
                               │
┌──────────────────────────────┼───────────────────────────────────┐
│                              ▼     DATA LAYER                    │
│  ┌──────────────────────┐  ┌──────────────────┐  ┌────────────┐ │
│  │  Supabase PostgreSQL  │  │ Supabase pgvector │  │  Supabase  │ │
│  │  (State & History)    │  │ (Knowledge Base)  │  │  Storage   │ │
│  └──────────────────────┘  └──────────────────┘  └────────────┘ │
└──────────────────────────────────────────────────────────────────┘
                               │
┌──────────────────────────────┼───────────────────────────────────┐
│                              ▼   EXTERNAL CALENDAR LAYER         │
│  ┌───────────────┐  ┌──────────────────┐  ┌────────────────────┐ │
│  │ iPhone Kalender│→ │ iCloud Sync       │→ │ Google Calendar    │ │
│  │ (Manuelle      │  │ (automatisch)     │  │ (MCP Client Node   │ │
│  │  Eingabe)      │  │                   │  │  in n8n)           │ │
│  └───────────────┘  └──────────────────┘  └────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

### Kanal-Strategie: MCP vs. Telegram

| Kanal | Zweck | Wann nutzen |
|-------|-------|-------------|
| **Claude (MCP)** | Interaktive Beratung, Analyse, Folgefragen, "Frag den CFO" | Ad-hoc-Anfragen, tiefe Analysen, wenn du ohnehin in Claude arbeitest |
| **Telegram** | Alerts, Reports, Dateneingabe, Mobile-Zugang | Unterwegs, automatische Benachrichtigungen, Weekly Scan, Fristen-Reminder |
| **Dashboard** | Überblick, Visualisierungen, historische Daten | Monatlicher Review, Portfolio-Überblick, Milestone-Tracking |
| **Google Calendar** | Steuer-Fristen, Compliance-Deadlines, 183-Tage-Tracking | Automatischer Sync in n8n via MCP Client Node — Datenquelle für Fristen-Checks |

> **Calendar-Sync:** Die native iPhone-Kalender-App synct via iCloud → Google Calendar (einmalig in iPhone-Einstellungen konfiguriert).
> n8n zapft Google Calendar per MCP Client Node an — kein eigener API-Code nötig.
> So werden manuell eingetragene Termine (z.B. Steuerberater-Fristen, Behördentermine) automatisch vom System erfasst.

> **Technisch:** Der CFO-Workflow hat zwei Eingänge (MCP Server Trigger + Webhook).
> Die Kernlogik (Intent → RAG → Agent → Validator → Response) ist identisch.
> Nur der Trigger und die Response-Zustellung unterscheiden sich.

---

## Sprint-Plan: 7 Sprints in ~14 Wochen

---

### SPRINT 1: Foundation (Woche 1-2)
**Ziel:** Server steht, Datenbank ist erstellt, erster Agent antwortet auf Fragen.

#### 1.1 — Hetzner VPS aufsetzen + Docker installieren

**Voraussetzung — Node.js installieren (falls nicht vorhanden):**
```bash
node --version   # Prüfen ob installiert
# Falls nicht: Homebrew installieren (Mac):
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install node
```
Node.js wird für Claude Code und das n8n-mcp Paket benötigt.

**Was passiert:** Du mietest einen Hetzner Cloud Server (CPX22, 9,51€/Mo + ~1,90€/Mo fuer Backup), installierst Docker und Docker Compose, und setzt n8n als Container auf.

> **WICHTIG:** Nimm **CPX22** (AMD EPYC, 80 GB NVMe) und NICHT CPX22 (Intel, 40 GB SSD). Die CPX-Linie hat sich im Betrieb als stabiler fuer Docker/n8n erwiesen, und die 80 GB Disk sind fuer die Knowledge Base + Backups wichtig.

**Claude Code Prompt:**
```
Ich möchte einen Hetzner CPX22 VPS (Ubuntu 24.04) einrichten für mein 
GeoArbitrage-Projekt. Bitte erstelle mir:

1. Ein docker-compose.yml das folgende Services enthält:
   - n8n (docker.n8n.io/n8nio/n8n:2.14.1, mit Persistent Volume,
     lauscht NUR auf 127.0.0.1:5678 — NICHT auf 0.0.0.0!)
   - PostgreSQL 16 (als Datenbank für n8n, lauscht NUR auf localhost)
   - Nginx als Reverse Proxy mit SSL

   WICHTIG — Restart-Policies für alle Container:
   Jeder Service MUSS `restart: unless-stopped` haben.
   Ohne Restart-Policy bleibt ein Container nach einem Crash
   oder Server-Reboot DAUERHAFT gestoppt → System tot bis
   manueller SSH-Login. Mit `unless-stopped` startet Docker
   die Container automatisch nach Crash ODER Server-Reboot.

   Referenz docker-compose.yml Struktur:

   ⚠️ VERSIONS-PINNING (PFLICHT):
   NIEMALS `latest` oder unversionierte Tags in Production verwenden!
   Ein `docker compose pull` mit `latest` kann jederzeit Breaking Changes
   einführen, die Workflows zerstören — ohne Rollback-Möglichkeit.
   Alle Images MÜSSEN auf eine spezifische Version gepinnt sein.

   UPDATE-PROZEDUR (vor jedem Image-Update):
   1. Hetzner Snapshot erstellen (Hetzner Console → Server → Snapshots)
   2. Backup manuell ausführen: bash /opt/geoarbitrage/backup.sh
   3. Version in docker-compose.yml ändern (PYTHON, kein sed!)
   4. docker compose pull n8n && docker compose up -d (NICHT restart!)
   5. Healthcheck prüfen: curl http://localhost:5678/healthz
   6. Version verifizieren: docker compose exec n8n n8n --version
   7. Altes Image entfernen: docker image rm docker.n8n.io/n8nio/n8n:ALTE_VERSION
   8. Bei Problemen: docker compose down, alte Version eintragen, up -d
   9. Wenn alles stabil (24h): Snapshot kann gelöscht werden

   UPDATE-FENSTER: Samstag morgens (geringste Nutzung).
   Bei BSI/CERT-Warnungen (kritische CVEs): SOFORT patchen, kein Warten!
   Changelog vorher lesen: https://github.com/n8n-io/n8n/releases

   MIGRATION 1.x → 2.x (EINMALIG, SICHERHEITSKRITISCH):

   ⚠️ Drei kritische CVEs betreffen alle n8n 1.x Versionen:

   | CVE              | CVSS | Beschreibung                                         |
   |------------------|------|------------------------------------------------------|
   | CVE-2025-68613   | hoch | RCE, aktiv ausgenutzt, im CISA KEV-Katalog           |
   | CVE-2025-68668   | 9.9  | Sandbox-Bypass im Python Code Node (Pyodide)         |
   | CVE-2026-21877   | 10.0 | Content-Type-Confusion RCE, keine Auth nötig          |

   Alle drei sind erst ab n8n 2.0+ gefixt. Migration ist NICHT optional.

   Migrations-Schritte:
   1. n8n auf mindestens Version 1.121 aktualisieren (Migration Report verfügbar)
   2. Migration Report prüfen: n8n Settings → Migration Report
      → Zeigt farbcodierte Checkliste aller Breaking Changes
   3. Hetzner Snapshot erstellen
   4. Backup manuell ausführen: bash /opt/geoarbitrage/backup.sh
   5. Image in docker-compose.yml ändern:
      image: docker.n8n.io/n8nio/n8n:2.14.1
   6. docker compose pull && docker compose up -d
   7. NACH Migration: Alle Workflows im Editor öffnen und "Publish" klicken
      (n8n 2.x hat Draft vs. Published State — ohne Publish reagieren
      Workflows NICHT auf Webhook-Triggers!)
   8. Healthcheck: curl http://localhost:5678/healthz
   9. Webhook-Test: curl https://webhook.deinedomain.de/webhook/telegram

   n8n 2.0 Breaking Changes (relevant für dieses Projekt):

   1. Draft vs. Published State:
      Workflows haben jetzt zwei Zustände. Nach dem Erstellen oder
      Importieren müssen Workflows explizit "Published" werden, damit
      sie auf Webhook-Triggers reagieren. Ohne Publish ist ein Workflow
      inaktiv. Das betrifft auch den Restore-Prozess (siehe restore.sh).

   2. Task Runners (standardmäßig aktiv):
      JavaScript/Python Code Nodes laufen in isolierten Sandboxen.
      Kein Handlungsbedarf, erhöht aber die Sicherheit.

   3. Sub-Workflow Wait-Verhalten:
      Human-in-the-Loop Sub-Workflows (z.B. mit Slack-Approval)
      funktionieren jetzt korrekt — der Parent-Workflow wartet, bis
      der Sub-Workflow zurückkehrt. Sub-Workflows müssen dafür im
      Published-State sein.

   4. Binary Data Handling:
      Standardmäßig Filesystem-basiertes Storage. Kein Handlungsbedarf
      bei frischer Installation.

   5. Docker Registry:
      n8n 2.x nutzt die neue Registry docker.n8n.io. Die alte
      Registry (Docker Hub n8nio/n8n) funktioniert für 2.x nicht.

   6. n8n API Key:
      Für MCP-Zugriff und automatisierte Workflow-Verwaltung (z.B.
      restore.sh Publish-Schritt) wird ein API Key benötigt.
      Erstellen: n8n Editor → Settings → API → Create API Key
      In .env eintragen: N8N_API_KEY=dein-n8n-api-key

   ```yaml
   services:
     n8n:
       image: docker.n8n.io/n8nio/n8n:2.14.1  # ← FESTE VERSION, niemals :latest! (Mindestversion 2.14 für MCP-Support)
       restart: unless-stopped          # ← PFLICHT
       ports:
         - "127.0.0.1:5678:5678"      # ⚠️ BUG FIX #18: MUSS "127.0.0.1:" Prefix haben! "5678:5678" ohne Prefix = Port öffentlich erreichbar!
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
         - SUPABASE_URL=${SUPABASE_URL}                          # BUG FIX #17: Fehlte → $env.SUPABASE_URL war undefiniert
         - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY} # BUG FIX #17: Fehlte → Supabase-Zugriff schlug fehl
         - MODEL_SONNET=${MODEL_SONNET}                          # BUG FIX #19: Fehlte → Agent-Modell undefiniert
         - MODEL_HAIKU=${MODEL_HAIKU}                            # BUG FIX #19: Fehlte → CFO-Routing-Modell undefiniert
         - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}                # Audit-Fix: Für $env.ANTHROPIC_API_KEY in Workflow-Nodes
         - TAVILY_API_KEY=${TAVILY_API_KEY}                      # Audit-Fix: Für Tavily Web Search Tool
         - VOYAGE_API_KEY=${VOYAGE_API_KEY}                      # Audit-Fix: Für Embedding-Generierung (Sprint 2.2+)
         - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}              # Audit-Fix: Für sendTelegram Helper
         - TELEGRAM_SECRET_TOKEN=${TELEGRAM_SECRET_TOKEN}        # Audit-Fix: Für Webhook-Verifikation
         - TELEGRAM_ALLOWED_CHAT_ID=${TELEGRAM_ALLOWED_CHAT_ID}  # Audit-Fix: Für Absender-Whitelist
         - TELEGRAM_CHAT_ID=${TELEGRAM_CHAT_ID}                  # BUG FIX #30: Für Telegram sendMessage (chat_id)
         - N8N_BLOCK_ENV_ACCESS_IN_NODE=false                    # BUG FIX #15: MUSS false sein, damit $env.X in Code Nodes funktioniert
         - NODES_EXCLUDE=[]                                      # BUG FIX #28: Ohne dies ist Execute Command Node in n8n 2.0+ unsichtbar
       depends_on:
         postgres:
           condition: service_healthy
       healthcheck:
         test: ["CMD", "wget", "--spider", "-q", "http://localhost:5678/healthz"]
         interval: 30s
         timeout: 10s
         retries: 3
         start_period: 30s
       logging:                          # ← Log-Rotation (verhindert Disk-Volllauf)
         driver: "json-file"
         options:
           max-size: "10m"
           max-file: "3"

     postgres:
       image: postgres:16.6-alpine      # ← FESTE VERSION
       restart: unless-stopped           # ← PFLICHT
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
       logging:
         driver: "json-file"
         options:
           max-size: "10m"
           max-file: "3"

     nginx:
       image: nginx:1.27-alpine         # ← FESTE VERSION
       restart: unless-stopped           # ← PFLICHT
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
   ```

   Die Healthchecks stellen sicher, dass Docker erkennt wenn
   ein Container zwar läuft aber nicht antwortet (z.B. n8n hängt).
   `depends_on` mit `service_healthy` verhindert, dass n8n
   startet bevor PostgreSQL bereit ist.

   ⚠️ n8n Auth seit Version 1.0 (Juli 2023):
   N8N_BASIC_AUTH_ACTIVE ist DEPRECATED und wird ignoriert.
   n8n nutzt stattdessen ein internes User-Management-System.
   Beim ersten Start von n8n wirst du aufgefordert, einen
   "Owner"-Account anzulegen (E-Mail + Passwort). Dieser
   Account ist der einzige der Zugang zum n8n-Editor hat.
   
   In docker-compose.yml NUR diese Auth-relevanten Variablen setzen:
   N8N_USER_MANAGEMENT_DISABLED=false  (Standard, Owner-Setup aktiv)
   
   NICHT setzen (veraltet, werden ignoriert):
   N8N_BASIC_AUTH_ACTIVE, N8N_BASIC_AUTH_USER, 
   N8N_BASIC_AUTH_PASSWORD, N8N_SECURITY_BASICAUTH_ACTIVE

   BUG FIX #13 — n8n Webhook-URL: Ohne diese Variablen generiert n8n
   interne Adressen (http://127.0.0.1:5678/...) für Webhooks, die
   Telegram nicht erreichen kann. In docker-compose.yml environment:
   und in .env setzen:
   N8N_EDITOR_BASE_URL=https://HOSTNAME.TAILNET.ts.net
   WEBHOOK_URL=https://webhook.deinedomain.de

   n8n API Key erstellen (nach Owner-Account-Setup):
   1. n8n Editor öffnen (über Tailscale MagicDNS)
   2. Settings → API → Create API Key
   3. Key in /opt/geoarbitrage/.env eintragen:
      N8N_API_KEY=dein-n8n-api-key
   Wird benötigt für: MCP-Zugriff, Restore-Script (Workflow-Publish),
   Infrastructure Health Check (Workflow Execution Logs).

   n8n Instance-Level MCP aktivieren (ab n8n 2.14):
   1. n8n Editor → Settings → Instance-level MCP
   2. Toggle "Enable MCP access" → ON
   3. Workflows Tab → "Enable workflows" für alle relevanten Workflows
   4. Access Token Tab → Token kopieren (nur 1x vollständig sichtbar!)
   MCP-Zugriff ist automatisch auf das Tailscale-VPN beschränkt
   (da n8n nur über Tailscale erreichbar ist). Access Token trotzdem
   sicher aufbewahren (Passwort-Manager).
   HINWEIS: Instance-Level MCP ist primär für Claude Desktop (OAuth).
   Für Claude Code CLI stattdessen das Community-Paket `n8n-mcp` nutzen:
   claude mcp add n8n-mcp -e MCP_MODE=stdio -e LOG_LEVEL=error \
     -e DISABLE_CONSOLE_OUTPUT=true \
     -e N8N_API_URL=https://HOSTNAME.TAILNET.ts.net \
     -e N8N_API_KEY=DEIN_N8N_API_KEY -- npx n8n-mcp
   (Siehe Setup-Guide Schritt 6 für vollständige Anleitung)

   CLAUDE.md für Workflow-Qualität (im Projektverzeichnis anlegen):
   Für optimale Claude Code Performance beim Workflow-Building eine
   CLAUDE.md im Projektverzeichnis erstellen mit folgenden Regeln:

   ```markdown
   # GeoArbitrage HQ — Claude Code Context

   ## n8n Instance
   - URL: https://HOSTNAME.TAILNET.ts.net
   - Version: 2.14+
   - MCP: Instance-level MCP aktiviert + n8n-mcp CLI-Paket konfiguriert
   - API Key: In .env (NICHT hier eintragen!)

   ## Regeln für Workflow-Erstellung
   - Workflows als Draft erstellen, NICHT automatisch aktivieren
   - Code Nodes: Immer mit Kommentaren versehen
   - Expressions: Mehrzeilig formatieren für Lesbarkeit
   - Credentials: Platzhalter verwenden, nie hardcoden
   - Node-Benennung: Deutsch, beschreibend (z.B. "Supabase: Context laden")
   - Error Handling: Jeden HTTP Request mit Error-Branch versehen
   ```

2. Ein Setup-Script (setup.sh) das auf einem frischen Ubuntu 24.04 
   Server folgendes macht:
   - Docker + Docker Compose installieren
   - Tailscale installieren und konfigurieren (VPN für n8n-Zugang)
   - UFW Firewall: NUR Ports 22 (SSH), 443 (HTTPS), 80 (HTTP für Cloudflare+Tailscale) 
     offen — KEIN Port 5678 (n8n nur via nginx Reverse Proxy!)
     STATUS (April 2026): ufw AKTIV, deny incoming, allow outgoing
     Regeln: 22/tcp, 80/tcp, 443/tcp + Tailscale-eigene Regeln auf tailscale0
     Prüfen: `sudo ufw status verbose`
   - fail2ban installieren (SSH + Nginx Schutz)

   SSRF-SCHUTZ (Defense in Depth):
   n8n kann HTTP Requests an beliebige URLs senden. Ohne Schutz
   könnte ein manipulierter Workflow den Cloud-Metadata-Endpunkt
   (169.254.169.254) oder interne Dienste ansprechen.

   a) iptables Rule (auf VPS-Level):
   iptables -A OUTPUT -d 169.254.169.254 -j DROP
   ip6tables -A OUTPUT -d fd00:ec2::254 -j DROP

   b) n8n Environment Variable:
   N8N_BLOCK_ENV_ACCESS_IN_NODE=false
   ⚠️ BUG FIX #15: Dieser Wert MUSS `false` sein!
   `true` blockiert AUCH den $env.X Zugriff in Code Nodes,
   der für alle Workflows benötigt wird (API-Keys, URLs).
   SSRF-Schutz erfolgt über iptables (oben) und Nginx,
   NICHT über diese Variable.
   (Hintergrund: n8n unterscheidet nicht zwischen process.env
   und $env — beide werden durch diese Flag blockiert)

   - unattended-upgrades aktivieren (automatische Security-Updates)
   - Die docker-compose.yml starten
   - Cron für Supabase Keep-Alive einrichten (täglich 12:00 Uhr)
   - Cron für verschlüsseltes Backup einrichten (Sonntags 03:00 Uhr)
   - Certbot Auto-Renewal Timer verifizieren + Cron-Fallback
   - Disk/RAM/Docker Watchdog einrichten (alle 5 Minuten)
   - Redundanten Supabase Keep-Alive (2. unabhängiger Mechanismus)

   DEVOPS-HÄRTUNG (in setup.sh integrieren):

   A) CERTBOT AUTO-RENEWAL VERIFIZIEREN:
      Certbot installiert einen systemd Timer. Prüfe ob er aktiv ist:
      systemctl status certbot.timer
      Falls NICHT aktiv: systemctl enable --now certbot.timer

      Zusätzlich Cron-Fallback einrichten (falls systemd Timer versagt):
      # Crontab: Täglich 02:30 Renewal-Check + Nginx Reload
      echo "30 2 * * * certbot renew --quiet --deploy-hook 'systemctl reload nginx'" \
        | crontab -l 2>/dev/null | cat - | sort -u | crontab -

      Einmaliger Dry-Run-Test (in setup.sh ausführen):
      certbot renew --dry-run
      → Muss "Congratulations" oder "No renewals" zeigen.
      → Falls Fehler: Meist DNS oder Port 80 Problem.

   B) DISK/RAM/DOCKER WATCHDOG (watchdog.sh):
      Erstelle /opt/geoarbitrage/watchdog.sh:

      ```bash
      #!/bin/bash
      # Watchdog — prüft alle 5 Min ob System gesund ist.
      # Sendet Telegram-Alert bei kritischen Problemen.

      source /opt/geoarbitrage/.env
      ALERT_SENT="/tmp/watchdog_alert_sent"

      send_alert() {
        local msg="$1"
        curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
          -d chat_id="${TELEGRAM_ALLOWED_CHAT_ID}" \
          -d text="$(echo -e "\xF0\x9F\x94\xB4 WATCHDOG ALERT\n${msg}\nServer: $(hostname)\nZeit: $(date '+%Y-%m-%d %H:%M')")" \
          -d parse_mode="HTML" > /dev/null 2>&1
      }

      # 1. Disk Check (>85% = Alert)
      DISK_PCT=$(df / | awk 'NR==2{gsub("%",""); print $5}')
      if [ "$DISK_PCT" -gt 85 ]; then
        send_alert "Disk ${DISK_PCT}% voll! Aktion nötig."
      fi

      # 2. RAM Check (>90% = Alert)
      RAM_PCT=$(free | awk '/Mem/{printf("%.0f", $3/$2 * 100)}')
      if [ "$RAM_PCT" -gt 90 ]; then
        send_alert "RAM ${RAM_PCT}% belegt! Möglicher OOM."
      fi

      # 3. Docker Container Check (n8n oder postgres nicht "running")
      for CONTAINER in n8n postgres nginx; do
        STATUS=$(docker inspect --format='{{.State.Status}}' "$CONTAINER" 2>/dev/null)
        if [ "$STATUS" != "running" ]; then
          send_alert "Container $CONTAINER ist $STATUS!"
          # Auto-Recovery: Versuche Container zu starten
          cd /opt/geoarbitrage && docker compose up -d "$CONTAINER"
        fi
      done

      # 4. n8n Health Check (HTTP)
      HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
        --max-time 10 http://127.0.0.1:5678/healthz 2>/dev/null)
      if [ "$HTTP_CODE" != "200" ]; then
        send_alert "n8n antwortet nicht (HTTP $HTTP_CODE)!"
      fi
      ```

      chmod +x /opt/geoarbitrage/watchdog.sh

      Crontab: Alle 5 Minuten ausführen:
      */5 * * * * /opt/geoarbitrage/watchdog.sh >> /var/log/watchdog.log 2>&1

      Kosten: 0€ (Telegram Bot API ist kostenlos und unlimitiert)

   C) REDUNDANTER SUPABASE KEEP-ALIVE:
      Problem: Supabase Free Tier pausiert nach 7 Tagen Inaktivität.
      Aktuell: 1x Cron (täglich 12:00). Wenn der Cron ausfällt → DB weg.

      Lösung: 2. unabhängiger Keep-Alive mit unterschiedlichem Timing:

      Keep-Alive Script /opt/geoarbitrage/keepalive.sh:
      ```bash
      #!/bin/bash
      source /opt/geoarbitrage/.env
      # Einfacher SELECT auf Supabase — hält DB wach
      HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
        "${SUPABASE_URL}/rest/v1/infrastructure_health?select=id&limit=1" \
        -H "apikey: ${SUPABASE_ANON_KEY}" \
        -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
        --max-time 15)

      if [ "$HTTP_CODE" != "200" ]; then
        # Alert: Supabase möglicherweise pausiert!
        curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
          -d chat_id="${TELEGRAM_ALLOWED_CHAT_ID}" \
          -d text="Supabase Keep-Alive fehlgeschlagen (HTTP $HTTP_CODE). DB möglicherweise pausiert! https://supabase.com/dashboard aufrufen." \
          > /dev/null 2>&1
      fi
      ```

      Zwei unabhängige Cron-Einträge mit unterschiedlichen Zeiten:
      0 12 * * * /opt/geoarbitrage/keepalive.sh   # Primary: 12:00 Uhr
      0 0  * * * /opt/geoarbitrage/keepalive.sh    # Backup:  00:00 Uhr

      Damit müssten BEIDE Crons gleichzeitig 7 Tage lang ausfallen,
      bevor die DB pausiert — praktisch unmöglich.

3. Nginx-Konfiguration mit 2 Server-Blocks:

   FIX #1 — SSL für n8n via Tailscale MagicDNS (NICHT Let's Encrypt):
   Let's Encrypt stellt KEINE Zertifikate für .ts.net Domains aus.
   Tailscale stellt eigene kostenlose Certs aus. Aktivierung:
   1. Admin Console: https://login.tailscale.com/admin/dns
      → Enable MagicDNS + Enable HTTPS
   2. Auf VPS: sudo tailscale cert HOSTNAME.TAILNET.ts.net
   3. Nginx Lesezugriff: chown root:www-data /var/lib/tailscale/certs/*.key
                         chmod 640 /var/lib/tailscale/certs/*.key

   a) n8n Interface: Lauscht auf HOSTNAME.TAILNET.ts.net:443
      SSL: /var/lib/tailscale/certs/HOSTNAME.TAILNET.ts.net.crt/.key
      → Nur erreichbar wenn du im Tailscale VPN bist
      → Security Headers: X-Frame-Options DENY, X-Content-Type nosniff,
        Referrer-Policy no-referrer, WebSocket-Support (Upgrade-Header)
   b) Telegram Webhook: Lauscht auf öffentlicher IP:443 unter
      webhook.deinedomain.de → NUR Pfad /webhook/telegram,
      Rate Limit 10 Requests/Minute burst 20, limit_req_status 429
      SSL: Let's Encrypt via Certbot (für webhook.deinedomain.de)
      → Security Headers: HSTS, X-Frame-Options, X-Content-Type,
        Referrer-Policy, Permissions-Policy, X-Hub-Signature-256 forwarden
      → Alles andere → 404

   HINWEIS: KEIN Dashboard Server-Block nötig — Dashboard läuft
   auf Vercel (nicht auf dem VPS).

   VOLLSTÄNDIGE NGINX-KONFIGURATION (/etc/nginx/conf.d/geoarbitrage.conf):

   ```nginx
   limit_req_zone $binary_remote_addr zone=webhook:10m rate=10r/m;
   ssl_protocols TLSv1.2 TLSv1.3;
   ssl_prefer_server_ciphers off;

   # Server-Block 1: n8n — NUR über Tailscale MagicDNS erreichbar
   # URL: https://HOSTNAME.TAILNET.ts.net
   # Nur erreichbar wenn Tailscale auf dem Gerät verbunden ist.
   server {
       listen 443 ssl;
       http2 on;                          # HTTP/2 aktivieren (Nginx >= 1.25.1)
       server_name HOSTNAME.TAILNET.ts.net;

       # Tailscale-eigene Certs — NICHT Let's Encrypt
       # Let's Encrypt kann keine Certs für .ts.net ausstellen.
       ssl_certificate     /var/lib/tailscale/certs/HOSTNAME.TAILNET.ts.net.crt;
       ssl_certificate_key /var/lib/tailscale/certs/HOSTNAME.TAILNET.ts.net.key;
       # Kein OCSP Stapling für Tailscale-Certs (interne CA, kein öffentlicher OCSP-Responder)

       # Security Headers
       add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;
       add_header X-Frame-Options "DENY" always;
       add_header X-Content-Type-Options "nosniff" always;
       add_header Referrer-Policy "no-referrer" always;
       add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
       # X-XSS-Protection bewusst NICHT gesetzt — deprecated, kann in manchen
       # Browsern Sicherheitslücken einführen. CSP ist der korrekte Schutz.

       location / {
           proxy_pass http://127.0.0.1:5678;
           proxy_http_version 1.1;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           # WebSocket-Support für n8n Live-Updates
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
           # BUG FIX #27/#31: Timeouts für lange Agent-Chains (Tax + Validator = >120s)
           proxy_read_timeout 300s;
           proxy_connect_timeout 10s;
           proxy_send_timeout 300s;
       }
   }

   # Server-Block 2: Telegram Webhook — Öffentlich, aber verifiziert
   # SSL via Let's Encrypt (certbot --nginx -d webhook.deinedomain.de)
   server {
       listen 443 ssl;
       http2 on;
       server_name webhook.deinedomain.de;

       ssl_certificate     /etc/letsencrypt/live/webhook.deinedomain.de/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/webhook.deinedomain.de/privkey.pem;
       include /etc/letsencrypt/options-ssl-nginx.conf;

       # OCSP Stapling für Let's Encrypt (öffentliche CA, Responder verfügbar)
       ssl_stapling on;
       ssl_stapling_verify on;
       ssl_trusted_certificate /etc/letsencrypt/live/webhook.deinedomain.de/chain.pem;
       resolver 8.8.8.8 8.8.4.4 valid=300s;
       resolver_timeout 5s;

       # Security Headers
       add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
       add_header X-Frame-Options "DENY" always;
       add_header X-Content-Type-Options "nosniff" always;
       add_header Referrer-Policy "no-referrer" always;
       add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
       add_header Content-Security-Policy "default-src 'none'" always;

       # NUR der Webhook-Pfad — exakter Match verhindert Pfad-Traversal
       location = /webhook/telegram {
           limit_req zone=webhook burst=20 nodelay;
           limit_req_status 429;
           proxy_pass http://127.0.0.1:5678;
           proxy_http_version 1.1;
           proxy_set_header Host $host;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_pass_header X-Hub-Signature-256;
           proxy_read_timeout 20s;
       }

       # Alles andere: 404
       location / {
           return 404;
       }
   }

   # HTTP → HTTPS Redirect (nur für Webhook-Domain)
   server {
       listen 80;
       server_name webhook.deinedomain.de;
       return 301 https://$host$request_uri;
   }

   # KEIN Dashboard Server-Block nötig — Dashboard läuft auf Vercel
   ```

4. Umgebungsvariablen (.env, Permissions 600) mit Platzhaltern für:
   - n8n Owner-Account (wird beim ersten Start im Browser angelegt,
     NICHT über .env konfiguriert — siehe Hinweis oben)
   - PostgreSQL Credentials
   - Domain-Name
   - E-Mail für Let's Encrypt
   - Telegram Secret Token (für Webhook-Verifikation)
   - Anthropic API Key
   - Erlaubte Telegram Chat-ID
   - SUPABASE_MANAGEMENT_TOKEN (für Infrastructure Health Check)
   - BACKUP_PASSPHRASE (für AES-256 Backup-Verschlüsselung)
   - ACLED_EMAIL + ACLED_PASSWORD (OAuth2, kein statischer Key mehr seit Sep 2025)
   - COINGECKO_API_KEY (kostenloser Demo Key — stabile 30 Calls/min)
   - VOYAGE_API_KEY=pa-DEIN-KEY
   - N8N_ENCRYPTION_KEY=langer-zufaelliger-string
   - N8N_API_KEY (für MCP-Zugriff + Restore-Script Publish-Schritt,
     erstellen: n8n Editor → Settings → API → Create API Key)
   - MODEL_SONNET=claude-sonnet-4-6
   - MODEL_HAIKU=claude-haiku-4-5-20251001

   ⚠️ BUG FIX #17 + #19 — .env VOLLSTÄNDIGKEIT:
   Jede Variable die in n8n Code Nodes via $env.X verwendet wird,
   MUSS sowohl in .env definiert ALS AUCH in docker-compose.yml
   unter n8n → environment durchgereicht werden!
   .env allein reicht NICHT — Docker übergibt nur explizit gelistete
   Variablen an den Container. Fehlende Variablen sind im Container
   undefined, auch wenn sie in .env stehen.

   Vollständige .env Pflicht-Variablen (Stand Sprint 1, aktualisiert nach Audit):
   POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD,
   N8N_ENCRYPTION_KEY, N8N_EDITOR_BASE_URL, WEBHOOK_URL,
   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY,
   SUPABASE_MANAGEMENT_TOKEN, ANTHROPIC_API_KEY, TAVILY_API_KEY,
   VOYAGE_API_KEY, MODEL_SONNET, MODEL_HAIKU,
   TELEGRAM_BOT_TOKEN, TELEGRAM_SECRET_TOKEN,
   TELEGRAM_ALLOWED_CHAT_ID, TELEGRAM_CHAT_ID

   Davon in docker-compose.yml n8n environment durchgereicht:
   ALLE außer POSTGRES_*, SUPABASE_ANON_KEY, SUPABASE_MANAGEMENT_TOKEN
   (SUPABASE_ANON_KEY wird nur im keepalive-Bash-Script verwendet,
   nicht in n8n Workflow-Nodes. SUPABASE_MANAGEMENT_TOKEN nur im
   Health-Check-Workflow der direkt auf die Management API zugreift —
   wird bei Bedarf in Sprint 1.4 ergänzt.)

   ⚠️ .env SICHERHEIT UND FORMAT:
   - Dateiberechtigungen SETZEN: chmod 600 /opt/geoarbitrage/.env
     (nur Owner darf lesen — ohne das kann jeder Prozess die Keys lesen!)
   - .gitignore: echo ".env" >> /opt/geoarbitrage/.gitignore
   - Format-Regeln: KEINE Leerzeichen um das = Zeichen
     RICHTIG: ANTHROPIC_API_KEY=sk-ant-xxx
     FALSCH:  ANTHROPIC_API_KEY = sk-ant-xxx
   - KEINE Kommentare am Zeilenende
     RICHTIG: ANTHROPIC_API_KEY=sk-ant-xxx
     FALSCH:  ANTHROPIC_API_KEY=sk-ant-xxx  # mein API key

5. SSH-Härtung:
   - Key-Only Authentication (kein Passwort-Login)
   - Root-Login deaktiviert
   - Port 22

6. DEVOPS-VERIFIKATION im Test-Script (test_setup.sh):
   Neben den Funktions-Tests auch Infrastructure-Härtung prüfen:

   # Restart-Policies prüfen
   for c in n8n postgres nginx; do
     POLICY=$(docker inspect --format='{{.HostConfig.RestartPolicy.Name}}' $c)
     echo "$c restart policy: $POLICY"
     [ "$POLICY" != "unless-stopped" ] && echo "WARNUNG: $c hat keine restart policy!"
   done

   # Healthchecks prüfen
   for c in n8n postgres; do
     HC=$(docker inspect --format='{{.State.Health.Status}}' $c 2>/dev/null)
     echo "$c health: $HC"
   done

   # Cron-Jobs prüfen
   echo "=== Cron Jobs ==="
   crontab -l 2>/dev/null | grep -E "keepalive|backup|watchdog|certbot"

   # Certbot Timer
   systemctl is-active certbot.timer && echo "Certbot Timer: OK" || echo "WARNUNG: Certbot Timer nicht aktiv!"

   # Watchdog Test
   [ -x /opt/geoarbitrage/watchdog.sh ] && echo "Watchdog: OK" || echo "WARNUNG: Watchdog fehlt!"

   FIX #3 — Korrekte Test-URLs:
   - n8n IST über Tailscale MagicDNS erreichbar:
     curl https://HOSTNAME.TAILNET.ts.net (erwartet: 200 oder 401)
     NICHT https://n8n.deinedomain.de — diese URL existiert nicht!
   - n8n ist NICHT von außen erreichbar (curl Port 5678 → timeout)
   - Webhook antwortet auf /webhook/telegram
   - Webhook gibt 404 auf alle anderen Pfade
   - Ungültige Webhook-Signatur wird abgelehnt (HTTP 4xx)
   - Port 5678 ist von außen NICHT erreichbar
   - Nur Ports 22, 443, 80, 41641/UDP sind offen (nmap-Check)

Bitte erkläre jeden Schritt, damit ich verstehe was passiert.

SICHERHEITS-ANFORDERUNGEN (nicht verhandelbar):
- n8n darf NIEMALS auf der öffentlichen IP erreichbar sein
- Alle API-Keys NUR in .env, NIEMALS in Workflow-Nodes hardcoded
- Telegram Webhook MUSS Secret Token verifizieren
- Telegram Webhook MUSS Absender-Nummer gegen Whitelist prüfen
- Anthropic API: Spending Limit 20€/Monat setzen
- Supabase: Service Role Key NIEMALS im Frontend
```

**Manuelle Schritte (nicht automatisierbar):**
- Hetzner Account erstellen: https://www.hetzner.com/cloud
- CPX22 Server bestellen (Ubuntu 24.04, Düsseldorf Standort)
- Domain kaufen oder Subdomain einrichten (z.B. bei Cloudflare)
- DNS A-Record: webhook.deinedomain.de → Server-IP
  (NUR der Webhook braucht die Domain. Dashboard läuft auf Vercel 
  mit eigener URL.)
- SSH-Key generieren (falls noch nicht vorhanden):
  ```bash
  # Prüfen ob Key existiert:
  ls ~/.ssh/id_ed25519.pub
  # Wenn "No such file" → neuen Key generieren:
  ssh-keygen -t ed25519 -C "geoarbitrage"
  # Enter für Standard-Speicherort, Passphrase vergeben (merken!)
  # Public Key anzeigen und kopieren:
  cat ~/.ssh/id_ed25519.pub
  ```
  Den kopierten Key in Hetzner beim Server-Erstellen unter "SSH-Keys" einfügen.
  Test: `ssh root@DEINE-SERVER-IP` (beim ersten Mal "yes" bestätigen)
- Tailscale Account erstellen: https://tailscale.com (kostenlos für 1 User)
- Tailscale auf deinem Laptop/Handy installieren
- Anthropic Console: Spending Limit auf 20€/Monat setzen

**Ergebnis:** n8n läuft NUR über VPN erreichbar (https://HOSTNAME.TAILNET.ts.net). Dashboard läuft auf Vercel (eigene URL, z.B. geoarbitrage.vercel.app) mit Login + 2FA via Supabase Auth. Webhook empfängt nur verifizierte Telegram-Nachrichten von deiner Nummer. MCP Server Trigger exponiert den CFO-Workflow als Tool für Claude Code/Desktop (ebenfalls nur über Tailscale VPN).

---

#### 1.2 — Supabase Projekt aufsetzen + Datenbank-Schema erstellen

**Was passiert:** Du erstellst ein Supabase-Projekt (Free Tier) und legst alle Tabellen an, die das System braucht.

**Claude Code Prompt:**
```
Ich nutze Supabase (Free Tier) für mein GeoArbitrage AI-System.
Bitte erstelle mir ein vollständiges SQL-Migrations-Script, das ich in 
Supabase SQL Editor ausführen kann. Das Script soll folgende Tabellen 
erstellen:

1. decisions — Audit Trail aller Entscheidungen
   (id UUID, created_at, title, category [tax/immo/corporate/immigration/
   wealth/insurance/relocation/budget], urgency [red/yellow/green], 
   status [open/decided/implemented/reversed], decision_brief JSONB, 
   chosen_option, reasoning, agents_involved TEXT[], reversible BOOLEAN, 
   cost_estimate NUMERIC, human_validated BOOLEAN, tags TEXT[])

2. actions — Action Items mit Deadlines und Dependencies
   (id, decision_id FK, title, description, responsible, status, 
   deadline, depends_on UUID[], priority, completed_at)

3. calendar_events — Steuer- & Compliance-Kalender
   (id, title, event_type, event_date, warning_days DEFAULT 28,
   recurring, category, description, status,
   source TEXT DEFAULT 'manual',        -- 'manual', 'google_calendar', 'system'
   google_event_id TEXT UNIQUE,         -- Google Calendar Event ID (für Sync-Duplikat-Check)
   synced_at TIMESTAMPTZ)              -- Letzter Sync-Zeitpunkt

   ⚠️ CALENDAR-SYNC-ARCHITEKTUR:
   iPhone Kalender → iCloud → Google Calendar → n8n MCP Client Node → calendar_events
   - User trägt Fristen in der nativen iPhone-Kalender-App ein
   - iCloud synct automatisch nach Google Calendar (einmalig konfiguriert)
   - n8n Cron-Workflow (Sprint 6.1a) liest per Google Calendar MCP Client Node
   - Neue/geänderte Events werden in calendar_events upserted (via google_event_id)
   - System-generierte Fristen (Steuer-Vorauszahlungen etc.) haben source='system'

4. budget — Monatliches Budget-Tracking
   (id, month DATE, category, type [income/expense/investment/reserve], 
   planned NUMERIC, actual NUMERIC, currency DEFAULT 'EUR', notes)

5. residence_tracker — 183-Tage-Tracking
   (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   country_code TEXT, country_name TEXT,
   arrival_date DATE NOT NULL,
   departure_date DATE,   -- NULL = laufender Aufenthalt
   purpose TEXT, tax_relevant BOOLEAN DEFAULT TRUE)

   ⚠️ KEIN GENERATED COLUMN für days_counted möglich:
   PostgreSQL erlaubt in GENERATED STORED Columns NUR immutable
   Functions. NOW()/CURRENT_DATE sind volatile/stable → SQL Error.
   Außerdem: (date - date) gibt in PostgreSQL einen INTEGER zurück,
   NICHT ein Interval — EXTRACT(DAY FROM integer) würde ebenfalls
   scheitern.

   LÖSUNG: View statt Generated Column. days_counted und year
   werden zur Laufzeit berechnet:
   
   ```sql
   CREATE OR REPLACE VIEW residence_tracker_computed AS
   SELECT *,
     COALESCE(departure_date, CURRENT_DATE) - arrival_date
       AS days_counted,
     EXTRACT(YEAR FROM arrival_date)::INTEGER AS arrival_year
   FROM residence_tracker;
   ```

   Plus: View "residence_summary" mit 183-Tage-Warnsystem:

   ⚠️ BUG FIX (Cross-Year-Stays): Die alte Version zählte nur
   Aufenthalte deren arrival_date im aktuellen Jahr liegt. Ein
   Aufenthalt von Dez 2025 bis März 2026 wurde im Jahr 2026 NICHT
   gezählt. Fix: Anteilige Berechnung pro Kalenderjahr.
   
   ```sql
   CREATE OR REPLACE VIEW residence_summary AS
   WITH current_year AS (
     SELECT EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER AS yr
   ),
   days_per_country AS (
     SELECT
       r.country_code,
       r.country_name,
       cy.yr AS year,
       -- Anteilige Tage im aktuellen Jahr berechnen:
       -- Start = MAX(arrival_date, 1. Januar des Jahres)
       -- Ende  = MIN(departure_date oder heute, 31. Dezember des Jahres)
       GREATEST(r.arrival_date, make_date(cy.yr, 1, 1))
        AS effective_start,
       LEAST(
         COALESCE(r.departure_date, CURRENT_DATE),
         make_date(cy.yr, 12, 31)
       ) AS effective_end
     FROM residence_tracker r
     CROSS JOIN current_year cy
     WHERE r.arrival_date <= make_date(cy.yr, 12, 31)
       AND COALESCE(r.departure_date, CURRENT_DATE) >= make_date(cy.yr, 1, 1)
   )
   SELECT
     country_code,
     country_name,
     year,
     SUM(GREATEST(effective_end - effective_start, 0))::INTEGER
       AS days_in_year,
     183 - SUM(GREATEST(effective_end - effective_start, 0))::INTEGER
       AS days_remaining_to_183,
     CASE
       WHEN SUM(GREATEST(effective_end - effective_start, 0)) >= 183
         THEN 'EXCEEDED'
       WHEN SUM(GREATEST(effective_end - effective_start, 0)) >= 150
         THEN 'WARNING'
       ELSE 'OK'
     END AS status_183
   FROM days_per_country
   GROUP BY country_code, country_name, year;
   ```

6. human_experts — Berater-Datenbank
   (id, name, role, specialization, jurisdictions TEXT[], contact, 
   hourly_rate, last_consulted)

7. chat_history — Langzeit-Konversations-Gedächtnis
   (id, created_at, session_id, role, content, metadata JSONB)
   
   FIX #7 — WICHTIG: Die embedding-Spalte für episodisches Gedächtnis
   (Sprint 2.2) ist NICHT in dieser Tabellendefinition — sie wird nach
   dem initialen Schema-Setup via ALTER TABLE hinzugefügt.
   Das Script 01_schema_additions_and_fixes.sql erledigt das automatisch.
   NICHT vergessen: dieses Script nach dem Haupt-Schema ausführen!

8. agent_logs — Debugging und Kostenkontrolle
   (id, created_at, session_id, agent, input_summary, output_summary, 
   confidence_score, validation_status, escalated BOOLEAN, 
   tokens_in, tokens_out, cost_eur,
   prompt_version INTEGER,         -- welche Prompt-Version war aktiv
   ab_test BOOLEAN DEFAULT FALSE,  -- wurde dieser Call als A/B-Test ausgeführt
   ab_version TEXT)                 -- 'A' (alt) oder 'B' (neu) bei A/B-Test

9. wealth_snapshots — Monatliche Vermögens-Snapshots
   (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   snapshot_date DATE NOT NULL,
   immobilien_wert NUMERIC DEFAULT 0,        -- Summe properties.current_value
   immobilien_schulden NUMERIC DEFAULT 0,    -- Summe properties.loan_amount_current
   immobilien_equity NUMERIC GENERATED ALWAYS AS
     (COALESCE(immobilien_wert,0) - COALESCE(immobilien_schulden,0)) STORED,
   immobilien_tilgung_monat NUMERIC DEFAULT 0, -- Summe aller Tilgungen im Monat
   immobilien_cashflow_monat NUMERIC DEFAULT 0, -- Summe aller Cashflows (nach Tilgung)
   aktien_portfolio NUMERIC DEFAULT 0,
   krypto_portfolio NUMERIC DEFAULT 0,
   cash_eur NUMERIC DEFAULT 0,
   cash_other JSONB,
   notreserve NUMERIC DEFAULT 0,
   nettovermoegen NUMERIC GENERATED ALWAYS AS (
     COALESCE(immobilien_wert,0) - COALESCE(immobilien_schulden,0)
     + COALESCE(aktien_portfolio,0)
     + COALESCE(krypto_portfolio,0)
     + COALESCE(cash_eur,0)
     + COALESCE(notreserve,0)
   ) STORED)  -- immobilien_equity + aktien + krypto + cash + notreserve
   
   Der Weekly Scan berechnet jeden Montag:
   1. Neue Restschulden (Tilgung verringert loan_amount_current)
   2. Neues Equity pro Immobilie
   3. Aktuelle Kurse (Yahoo Finance, CoinGecko)
   4. Alles zusammen = neuer wealth_snapshot

10. properties — Immobilien-Register
    (id, name, address, 
    plz TEXT,                          -- Postleitzahl (für ImmoScout/Sparkasse Lookup)
    stadt TEXT,                        -- Stadt
    stadtteil TEXT,                    -- Stadtteil/Ortsteil (für qm-Preis-Granularität)
    bundesland TEXT,                   -- z.B. 'SH', 'NW', 'BY' — für Boris-Portal-Routing
    status TEXT DEFAULT 'active',      -- active/sold
    
    -- Kauf (einmalig, bei Erwerb eintragen)
    purchase_date DATE,
    purchase_price NUMERIC,           -- reiner Kaufpreis
    purchase_notar NUMERIC,           -- Notarkosten (~1.5%)
    purchase_grunderwerbsteuer NUMERIC, -- GrESt (NRW 6.5%, BY 3.5% etc.)
    purchase_makler NUMERIC DEFAULT 0, -- Maklergebühr (wenn gezahlt)
    purchase_grundbuch NUMERIC,       -- Grundbuchkosten (~0.5%)
    purchase_sonstige NUMERIC DEFAULT 0, -- Gutachter, Renovierung etc.
    -- purchase_total = purchase_price + notar + grest + makler + grundbuch + sonstige
    -- Das sind die GESAMTEN Anschaffungskosten
    
    eigenkapital_eingesetzt NUMERIC,  -- Wie viel eigenes Geld hast du reingesteckt
    -- = purchase_total - loan_amount_initial
    
    current_value NUMERIC,
    current_value_date DATE,          -- wann wurde der Wert zuletzt geschätzt
    current_value_source TEXT,        -- 'manual' / 'market_estimate' / 'gutachten'
    
    -- Fläche & qm-Preis (Basis für Marktwert-Tracking)
    wohnflaeche_qm NUMERIC,           -- z.B. 72.5 qm
    purchase_price_per_qm NUMERIC,    -- Kaufpreis / qm (berechnet)
    current_price_per_qm NUMERIC,     -- aktueller Marktpreis / qm (wird quartalsweise aktualisiert)
    
    -- Wertentwicklung wird in property_valuations Tabelle historisch getrackt
    -- current_value = wohnflaeche_qm × current_price_per_qm (bei market_estimate)
    -- ODER manuell gesetzt (bei Gutachten oder eigener Einschätzung)
    structure TEXT,                    -- Privatbesitz/vGmbH/GbR/Stiftung
    
    -- Finanzierung (Detail)
    loan_amount_initial NUMERIC,      -- ursprünglicher Darlehensbetrag
    loan_amount_current NUMERIC,      -- aktuelle Restschuld (wird monatlich berechnet)
    loan_rate NUMERIC,                -- Sollzins p.a. als PROZENT (z.B. 1.8 für 1.8%)
                                      -- ⚠️ In Formeln IMMER durch 100 teilen!
    loan_tilgung_initial NUMERIC,     -- anfängliche Tilgung p.a. (z.B. 2%)
    loan_monthly_payment NUMERIC,     -- Annuität = feste Monatsrate (Zins + Tilgung)
    loan_sondertilgung_pa NUMERIC DEFAULT 0,  -- Sondertilgungsrecht p.a.
    loan_sondertilgung_gesamt NUMERIC DEFAULT 0, -- Summe aller geleisteten Sondertilgungen
    loan_zinsbindung_end DATE,        -- Ende der Zinsbindung → KRITISCH bei Wegzug
    loan_end DATE,                    -- vollständige Tilgung (geschätzt)
    loan_bank TEXT,                   -- Name der Bank (relevant für Wegzugs-Risiko)
    
    -- Einnahmen & Kosten (monatlich)
    monthly_rent_gross NUMERIC,       -- Kaltmiete
    monthly_hausgeld NUMERIC,         -- Hausgeld/NK-Vorauszahlung (WEG)
    monthly_nicht_umlagefaehig NUMERIC, -- nicht-umlagefähige NK
    monthly_verwaltung NUMERIC DEFAULT 0, -- Hausverwaltung Sondereigentum
    monthly_ruecklage NUMERIC DEFAULT 0,  -- Instandhaltungsrücklage (kalkulatorisch)
    
    -- Laufende Sonderkosten (kumuliert, werden bei Eingabe addiert)
    kosten_instandhaltung_gesamt NUMERIC DEFAULT 0, -- Reparaturen, Sanierungen
    kosten_leerstand_gesamt NUMERIC DEFAULT 0,      -- Mietausfall-Monate × Miete
    kosten_sonstige_gesamt NUMERIC DEFAULT 0,       -- Rechtskosten, Gutachten etc.
    
    -- Steuer
    afa_type TEXT,                     -- linear_2/linear_3/denkmal/sonder
    afa_basis NUMERIC,                -- Gebäudeanteil des Kaufpreises (nicht Grundstück!)
    afa_start_date DATE,
    afa_remaining_years INTEGER,
    afa_steuerersparnis_gesamt NUMERIC DEFAULT 0, -- Kumul. Steuerersparnis durch AfA+Zinsabzug
    speculation_end DATE,             -- purchase_date + 10 Jahre
    
    -- Verkauf (nur bei status='sold')
    sale_date DATE,
    sale_price NUMERIC,               -- Verkaufspreis
    sale_notar NUMERIC,               -- Notarkosten Verkauf
    sale_makler NUMERIC DEFAULT 0,    -- Maklergebühr Verkauf
    sale_vorfaelligkeits_entschaedigung NUMERIC DEFAULT 0, -- wenn Kredit vorzeitig abgelöst
    sale_spekulationssteuer NUMERIC DEFAULT 0, -- §23 EStG wenn < 10 Jahre
    sale_sonstige NUMERIC DEFAULT 0,  -- sonstige Verkaufskosten
    
    -- Berechnete Felder / Views
    -- LAUFEND (status='active'):
    -- equity = current_value - loan_amount_current
    -- monthly_zins = loan_amount_current * (loan_rate / 100) / 12
    --   ⚠️ loan_rate ist als PROZENT gespeichert (z.B. 1.8 für 1.8% p.a.)
    --   → Division durch 100 nötig!
    -- monthly_tilgung = loan_monthly_payment - monthly_zins
    -- cashflow_vor_steuer = rent - hausgeld - nk - verwaltung - zins
    -- cashflow_nach_tilgung = cashflow_vor_steuer - tilgung
    -- vermoegenszuwachs_monat = tilgung + cashflow_vor_steuer
    
    -- GESAMT-P&L (bei Verkauf ODER als laufende Bilanz):
    -- total_einnahmen = Summe aller Mieteinnahmen über Haltedauer
    --   (= monthly_rent_gross × Haltemonate - kosten_leerstand_gesamt)
    -- total_kaufkosten = purchase_total (Preis + NK)
    -- total_finanzierungskosten = Summe aller Zinszahlungen über Haltedauer
    -- total_laufende_kosten = Summe (hausgeld + nk + verwaltung) × Monate
    --                         + kosten_instandhaltung_gesamt + kosten_sonstige_gesamt
    -- total_verkaufskosten = sale_notar + sale_makler + sale_vfe + sale_speksteuer + sale_sonstige
    -- total_steuerersparnis = afa_steuerersparnis_gesamt (positiv, wird abgezogen)
    --
    -- GESAMT-GEWINN = sale_price (oder current_value)
    --                 + total_einnahmen
    --                 + total_steuerersparnis
    --                 - total_kaufkosten
    --                 - total_finanzierungskosten
    --                 - total_laufende_kosten
    --                 - total_verkaufskosten
    --
    -- RETURN ON EQUITY = GESAMT-GEWINN / eigenkapital_eingesetzt
    -- ANNUALISIERTE RENDITE = (1 + ROE)^(1/Haltejahre) - 1
    
    notes TEXT)
    
    WICHTIG — Vermögensaufbau durch Immobilien hat 3 Komponenten:
    1. TILGUNG: Jeden Monat sinkt die Restschuld → Equity steigt
       (loan_amount_current wird monatlich neu berechnet)
    2. WERTSTEIGERUNG: current_value kann über Zeit steigen
       (wird manuell oder via Marktdaten aktualisiert)
    3. CASHFLOW: Was tatsächlich auf dem Konto landet
       (Miete minus ALLE Kosten minus Annuität)
    
    Bei VERKAUF: Status auf 'sold' setzen, Verkaufsfelder befüllen.
    Die Immobilie bleibt in der DB (wird nicht gelöscht!) damit die 
    Gesamt-P&L jederzeit abrufbar ist. Im Dashboard wird sie im 
    "Verkaufte Objekte"-Bereich angezeigt mit vollständiger Bilanz.
    
    Weekly Scan berechnet automatisch:
    - Neue Restschuld: loan_amount_current = vorherige_restschuld 
      - (loan_monthly_payment - vorherige_restschuld * (loan_rate / 100) / 12)
    - Neues Equity: current_value - loan_amount_current
    - Speichert in wealth_snapshots: immobilien_wert (Summe current_value),
      immobilien_schulden (Summe loan_amount_current)

11. portfolio_holdings — Wertpapier-Positionen
    (id, name TEXT, ticker TEXT, 
    type TEXT,                          -- ETF/ETC/Aktie/Krypto/P2P/Edelmetall/... 
                                        -- FREI DEFINIERBAR — neue Typen erscheinen 
                                        -- automatisch im Pie Chart
    shares NUMERIC, avg_price NUMERIC, current_price NUMERIC, 
    last_price_update DATE,
    allocation_category TEXT,           -- Core/Satellite/Hedge/... FREI DEFINIERBAR
    broker TEXT,                        -- Trade Republic, IBKR, Bitpanda, etc.
    domicile TEXT,                      -- Fondsdomizil (IE, DE, LU) — relevant für Quellensteuer
    currency TEXT DEFAULT 'EUR',
    first_buy_date DATE,               -- Erster Kauf — für Haltedauer-Berechnung
    sparplan_monthly NUMERIC DEFAULT 0, -- Laufender Sparplan-Betrag
    notes TEXT)
    
    Typen sind FLEXIBEL: Wenn du "P2P", "Edelmetall" oder 
    "Private Equity" als type einträgst, erscheint es automatisch 
    als eigene Kategorie im Asset Allocation Pie Chart.
    
    Für Krypto-Haltefristen: Individuelle Lots in portfolio_lots 
    Tabelle (26) tracken — jeder Kauf hat eigene Frist.

12. milestones — Strategische Meilensteine
    (id, title, icon, status [active/research/blocked/upcoming/done], 
    progress INTEGER, color, current_step, next_action, 
    next_action_deadline, steps JSONB)
    
    HINWEIS: Das alte "blocked_by TEXT" Feld ist entfernt. 
    Dependencies werden jetzt über Tabelle 15 modelliert.

13. savings_goals — Dynamische Spar- und Investitionsziele
    ⚠️ HINWEIS: Vollständige und maßgebliche Definition siehe Tabelle 36 (FIX #4)
    weiter unten. Tabelle 36 hat mehr Felder (description, target_date, category,
    auto_update, monthly_required, progress_pct) und ist die einzige CREATE TABLE
    Anweisung die ausgeführt werden darf. Diese Tabellennummer dient nur der
    Referenzierung in anderen Tabellen (linked_savings_goal_id etc.).

14. exit_prerequisites — Dynamische Exit-Readiness-Voraussetzungen
    (id, label TEXT NOT NULL,
    weight INTEGER NOT NULL,       -- Gewichtung in % (alle zusammen = 100)
    met BOOLEAN DEFAULT FALSE,
    met_at TIMESTAMPTZ,
    category TEXT,                 -- 'tax', 'immigration', 'financial', 
                                   -- 'insurance', 'relocation', 'corporate'
    linked_milestone_id UUID,      -- Auto-Update wenn Milestone done
    linked_savings_goal_id UUID,   -- Auto-Update wenn Sparziel erreicht
    verification_type TEXT,        -- 'auto' (aus DB berechnet) oder 
                                   -- 'manual' (User bestätigt)
    auto_check_query TEXT,         -- Optional: SQL-Query die prüft ob 
                                   -- die Bedingung erfüllt ist
    priority INTEGER,
    notes TEXT)
    
    Beispiel auto_check_query: 
    "SELECT CASE WHEN current_amount >= target_amount THEN true 
     ELSE false END FROM savings_goals WHERE name = 'Notreserve'"
    
    HINWEIS: Wird NICHT beim initialen Setup befüllt. 
    Die Voraussetzungen ergeben sich aus der Bestandsaufnahme.
    Der CFO-Agent schlägt nach der initialen Analyse Voraussetzungen 
    vor, die du genehmigst. Jederzeit änderbar:
    "Neue Exit-Voraussetzung: Mietvertrag im Ausland unterschrieben, Gewicht 10%"
    "Ändere Gewicht von 'Steuerplan steht' auf 30%"
    "Entferne 'Probe-Aufenthalt' als Voraussetzung"

15. milestone_dependencies — Strukturierte Abhängigkeiten
    (id, source_milestone_id UUID REFERENCES milestones(id),
    target_milestone_id UUID REFERENCES milestones(id),
    dependency_type TEXT NOT NULL,  -- 'blocks' (hart, Target kann nicht 
                                    -- starten), 'influences' (weich, 
                                    -- sollte berücksichtigt werden), 
                                    -- 'prerequisite' (Target braucht Source)
    description TEXT,
    created_by TEXT DEFAULT 'system')  -- 'system', 'user', 'cfo_agent'
    
    Der CFO-Agent pflegt diese Tabelle automatisch wenn neue 
    Milestones erstellt oder Entscheidungen getroffen werden.
    Im Dashboard wird daraus die Dependency Map generiert.

16. asset_recommendations — Agent-Empfehlungen zu Assets
    (id, created_at TIMESTAMPTZ DEFAULT NOW(),
    asset_type TEXT NOT NULL,      -- 'property', 'portfolio_holding', 
                                   -- 'savings_goal', 'general'
    asset_id UUID,                 -- FK auf properties.id oder 
                                   -- portfolio_holdings.id
    agent TEXT NOT NULL,            -- Welcher Agent hat die Empfehlung gegeben
    recommendation TEXT NOT NULL,
    urgency TEXT [red/yellow/green],
    status TEXT DEFAULT 'active',   -- 'active', 'implemented', 'dismissed'
    valid_until DATE,               -- Empfehlung läuft ab (z.B. vor Fristende)
    linked_decision_id UUID,
    dismissed_reason TEXT)
    
    Wird automatisch vom CFO-Agent befüllt wenn Agenten 
    Empfehlungen zu konkreten Assets geben. Im Dashboard werden 
    die aktuellen (status='active') Empfehlungen direkt am 
    jeweiligen Asset angezeigt.

17. target_countries — Dynamische Zielländer-Konfiguration
    (id, country_code TEXT [FIPS Code für GDELT], country_name TEXT,
    iso_code TEXT [2-Buchstaben ISO für andere APIs],
    acled_name TEXT [exakter Name wie in ACLED API],
    role TEXT [steuerdomizil/residenz/firma/staatsbuergerschaft/aktuell],
    priority INTEGER [1=primär, 2=sekundär, 3=watchlist],
    status TEXT [active/evaluating/archived],
    added_at TIMESTAMPTZ DEFAULT NOW(),
    added_reason TEXT,
    archived_at TIMESTAMPTZ,
    archived_reason TEXT,
    notes TEXT)
    
    WICHTIG: Diese Tabelle wird NICHT beim initialen Setup befüllt!
    Sie bleibt leer bis die Agenten nach der Bestandsaufnahme 
    konkrete Länder empfehlen. Danach pflegt der CFO-Agent diese 
    Tabelle basierend auf Entscheidungen. Der User kann jederzeit 
    Länder per Telegram hinzufügen/entfernen:
    "Füge Singapur als Zielland hinzu (Firmenstandort)"
    "Entferne Malta von der Watchlist"
    "Setze Paraguay auf Priorität 2"

18. country_stability — OSINT-Monitoring-Daten pro Land/Monat
    (id, scan_date DATE, country_code TEXT, country_name TEXT,
    gdelt_instability NUMERIC, gdelt_instability_trend NUMERIC,
    gdelt_tone NUMERIC, gdelt_tone_trend NUMERIC,
    gdelt_news_spike BOOLEAN DEFAULT FALSE,
    acled_total_events INTEGER DEFAULT 0,
    acled_protests INTEGER DEFAULT 0,
    acled_riots INTEGER DEFAULT 0,
    acled_violence INTEGER DEFAULT 0,
    polymarket_relevant JSONB,
    overall_status TEXT [stable/watch/alert],
    notes TEXT)
    
19. monthly_scan_results — Scan-Ergebnisse (jetzt wöchentlich)
    (Tabellenname bleibt aus Kompatibilität, enthält aber 
    wöchentliche Einträge seit Umstellung auf Weekly Scan)
    (id, scan_date DATE, raw_data JSONB, ai_assessment TEXT,
    alerts JSONB, changes_detected BOOLEAN DEFAULT FALSE,
    countries_scanned TEXT[], cost_eur NUMERIC)

20. knowledge_base — RAG-Vektordatenbank
    EINHEITLICHES SCHEMA: MD-Chunks (primär, Sprint 2/3) + PDF-Ingest (Sprint 7.3).
    Vollständige Dokumentation + SQL: knowledge_base/RAG-INTEGRATION.md

    Kurzübersicht Spalten:
    - chunk_id TEXT UNIQUE NOT NULL     -- z.B. "tax/wegzugssteuer-§6-astg"
    - title TEXT NOT NULL
    - content TEXT NOT NULL
    - bereich TEXT NOT NULL             -- "tax", "immobilien", "shared", etc.
    - relevante_agenten TEXT[]          -- {"Tax Architect", "CFO"}
    - source_type TEXT                  -- NULL für MD-Chunks; 'law'/'dba'/... für PDFs
    - source_name TEXT                  -- NULL für MD-Chunks; "§2 AStG" für PDFs
    - last_verified DATE
    - verification_status TEXT DEFAULT 'unverified'
    - embedding vector(1024)            -- Voyage AI voyage-4-lite
    - token_count INTEGER
    - updated_at TIMESTAMPTZ DEFAULT NOW()

    Das SQL-Script muss folgendes erstellen:
    ```sql
    -- 1. pgvector Extension aktivieren
    CREATE EXTENSION IF NOT EXISTS vector;

    -- 2. Vektor-Index für schnelle Ähnlichkeitssuche
    -- ⚠️ IVFFlat benötigt mindestens so viele Zeilen wie "lists" (hier: 100).
    -- Auf einer LEEREN Tabelle schlägt CREATE INDEX fehl mit:
    -- ERROR: "too few rows to build an ivfflat index"
    --
    -- LÖSUNG A (empfohlen): HNSW statt IVFFlat — funktioniert auf leeren Tabellen:
    CREATE INDEX IF NOT EXISTS idx_knowledge_base_embedding
      ON knowledge_base USING hnsw (embedding vector_cosine_ops)
      WITH (m = 16, ef_construction = 64);
    -- HNSW: Bessere Query-Qualität, braucht mehr Speicher, kein Training nötig.
    -- Für <100k Vektoren (unser Use Case) ist HNSW die bessere Wahl.
    --
    -- LÖSUNG B (falls HNSW nicht gewünscht): Index NACH Sprint 3 erstellen,
    -- wenn die Knowledge Base mindestens 100 Einträge hat:
    -- CREATE INDEX idx_knowledge_base_embedding_ivfflat
    --   ON knowledge_base USING ivfflat (embedding vector_cosine_ops)
    --   WITH (lists = 100);

    -- 3. match_knowledge() Funktion für RAG
    -- Filtert nach filter_bereiche TEXT[] (Array!) — z.B. '{tax,shared}'
    -- Gibt chunk_id/title/bereich zurück (für MD-Chunks) + source_name/type (für PDFs)
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

    -- 4. match_chat_history() Funktion für episodisches Gedächtnis (Sprint 2.2)
    CREATE OR REPLACE FUNCTION match_chat_history(
      query_embedding vector(1024),
      match_threshold FLOAT DEFAULT 0.75,
      match_count     INT   DEFAULT 3
    )
    RETURNS TABLE (
      id         UUID,
      content    TEXT,
      session_id TEXT,
      created_at TIMESTAMPTZ,
      similarity FLOAT
    )
    LANGUAGE SQL STABLE AS $$
      SELECT
        id,
        content,
        session_id,
        created_at,
        1 - (embedding <=> query_embedding) AS similarity
      FROM chat_history
      WHERE embedding IS NOT NULL
        AND role = 'user'
        AND 1 - (embedding <=> query_embedding) > match_threshold
      ORDER BY embedding <=> query_embedding
      LIMIT match_count;
    $$;
    ```
    HINWEIS: vector(1024) weil Voyage AI voyage-4-lite
    1024-dimensionale Embeddings erzeugt

21. jurisdiction_costs — Firmengründungs- und Jahreskosten pro Jurisdiktion
    (id, jurisdiction TEXT, country TEXT, formation_cost NUMERIC, 
    annual_cost NUMERIC, min_capital NUMERIC, time_to_setup TEXT,
    substance_requirements JSONB, banking_difficulty TEXT 
    [easy/medium/hard/very_hard], corporate_tax_rate NUMERIC,
    audit_required BOOLEAN, last_verified DATE, notes TEXT)

22. passport_rankings — Reisepass-Vergleichsdaten
    (id, passport_country TEXT, visa_free_countries INTEGER, 
    henley_rank INTEGER, banking_power TEXT [high/medium/low],
    consular_coverage TEXT [extensive/moderate/minimal],
    e2_treaty BOOLEAN, schengen_access BOOLEAN, 
    china_visa_free BOOLEAN, military_service_risk BOOLEAN,
    cbi_available BOOLEAN, cbi_min_cost NUMERIC,
    citizenship_by_residence_years NUMERIC, last_verified DATE)

23. insurance_coverage — Versicherungspolicen und Prämien
    (id, type TEXT [health/liability/pi/do/cyber/life/bu],
    provider TEXT, plan_name TEXT, monthly_premium NUMERIC,
    annual_premium NUMERIC, deductible NUMERIC,
    coverage_limit NUMERIC, coverage_region TEXT, 
    age_bracket TEXT, key_exclusions TEXT[],
    waiting_period TEXT, status TEXT [active/quoted/archived],
    last_verified DATE, notes TEXT)

24. city_cost_of_living — Lebenshaltungskosten pro Zielstadt
    (id, city TEXT, country TEXT, scan_date DATE,
    rent_1bed_center NUMERIC, rent_1bed_outside NUMERIC,
    meal_inexpensive NUMERIC, groceries_monthly NUMERIC,
    transport_monthly NUMERIC, internet_monthly NUMERIC,
    gym_monthly NUMERIC, coworking_monthly NUMERIC,
    golf_green_fee NUMERIC, 
    total_estimated_monthly NUMERIC,
    source TEXT, notes TEXT)

25. fx_rates — Wechselkurse monatlich
    (id, scan_date DATE, base_currency TEXT DEFAULT 'EUR',
    target_currency TEXT, rate NUMERIC, 
    change_vs_last_month NUMERIC)
    
    API: https://open.er-api.com/v6/latest/EUR 
    (kostenlos, kein Key, tägliches Update)
    Weekly Scan speichert: EUR→USD, EUR→AED, EUR→CHF, 
    EUR→GEL, EUR→PYG + alle Zielland-Währungen aus target_countries

26. portfolio_lots — Individuelle Kauf-Lots für Haltefrist-Tracking
    (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    holding_id UUID REFERENCES portfolio_holdings(id) ON DELETE CASCADE,
    purchase_date DATE NOT NULL,
    purchase_price NUMERIC NOT NULL,
    quantity NUMERIC NOT NULL,
    currency TEXT DEFAULT 'EUR',
    tax_free_after DATE,  -- wird automatisch via Trigger gesetzt (siehe unten)
    status TEXT DEFAULT 'held' CHECK (status IN ('held','sold','transferred')),
    sold_date DATE, sold_price NUMERIC,
    realized_gain NUMERIC, notes TEXT)

    BUG FIX: tax_free_after wird via PostgreSQL-Trigger automatisch gesetzt,
    sodass kein Eintrag vergessen werden kann. Im SQL-Script hinzufügen:
    ```sql
    CREATE OR REPLACE FUNCTION set_tax_free_after()
    RETURNS TRIGGER AS $$
    BEGIN
      -- Nur setzen wenn nicht explizit angegeben (erlaubt manuelle Überschreibung)
      IF NEW.tax_free_after IS NULL THEN
        NEW.tax_free_after := NEW.purchase_date + INTERVAL '365 days';
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER trg_portfolio_lots_tax_free
    BEFORE INSERT ON portfolio_lots
    FOR EACH ROW EXECUTE FUNCTION set_tax_free_after();
    ```

    WICHTIG für Krypto: Jeder Kauf ist ein separater Lot mit
    eigener Haltefrist. tax_free_after = purchase_date + 365 Tage
    (für DE-Recht). Bei Wegzug: Haltefristen ändern sich je nach
    neuer Jurisdiktion → Agent muss tax_free_after neu berechnen
    und per UPDATE setzen (Trigger überschreibt bei INSERT, nicht bei UPDATE).

27. prompt_versions — Prompt-Version-Control für Performance Manager
    (id, agent TEXT, version INTEGER, prompt_text TEXT,
    changed_at TIMESTAMPTZ, changed_reason TEXT,
    changed_by TEXT [user/performance_manager],
    performance_before JSONB, performance_after JSONB,
    improvement_confirmed BOOLEAN)

28. user_feedback — Mandanten-Feedback pro Interaktion
    (id, feedback_date TIMESTAMPTZ DEFAULT NOW(),
    session_id TEXT, agent TEXT, 
    query_summary TEXT,               -- gekürzte Version der Frage
    rating TEXT,                      -- 'positive' / 'negative'
    follow_up TEXT,                   -- optionale Erklärung bei 👎
    action_taken TEXT DEFAULT NULL)   -- was der Performance Manager daraus gemacht hat
    
    Performance Manager analysiert monatlich:
    - Welcher Agent hat die meisten 👎?
    - Welche Frage-Typen bekommen schlechtes Feedback?
    - Trend: Wird Feedback über Monate besser oder schlechter?
    - Bei >3 negative Feedbacks/Agent/Monat → automatischer Prompt-Review

29. coverage_gaps — Fragen die kein Agent beantworten konnte
    (id, detected_at TIMESTAMPTZ DEFAULT NOW(),
    original_query TEXT,              -- die Frage des Mandanten
    detected_gap TEXT,                -- welches Themengebiet fehlt
    recommended_action TEXT,          -- 'new_agent' / 'kb_update' / 'human_expert'
    recommended_agent_type TEXT,      -- z.B. "VC-Fundraising-Agent"
    occurrences INTEGER DEFAULT 1,   -- wie oft dieses Gap aufgetreten ist
    resolved BOOLEAN DEFAULT FALSE,
    resolved_by TEXT,                 -- 'new_agent' / 'human_expert' / 'kb_update' / 'prompt_update'
    resolved_at TIMESTAMPTZ)
    
    CFO loggt hier jede Frage die außerhalb der Agent-Kompetenzen liegt.
    Bei ≥3 Einträgen zum selben Thema → automatische Empfehlung an Mandanten:
    "Ich empfehle, mein Team um einen [Typ]-Agenten zu erweitern."

30. property_valuations — Historische Immobilien-Wertentwicklung
    (id, property_id UUID FK→properties,
    valuation_date DATE,
    price_per_qm NUMERIC,             -- €/qm zum Bewertungszeitpunkt
    estimated_value NUMERIC,           -- = wohnflaeche_qm × price_per_qm
    source TEXT,                       -- 'immoscout_index' / 'manual' / 'gutachten' / 'sparkasse' / 'boris'
    source_url TEXT,                   -- Link zur Quelle (optional)
    notes TEXT)
    
    ZWECK: Lückenlose Dokumentation der Wertentwicklung jeder Immobilie.
    
    Quartalsweise automatisch befüllt via Weekly Scan (jede 1. Woche 
    des Quartals):
    - Tavily Search: "{Stadtteil} {Stadt} qm Preis {Quartal} {Jahr}"
    - Alternativ: ImmoScout24 Preisatlas, Boris NRW (Bodenrichtwerte), 
      Sparkassen-Immobilienpreise
    - Ergebnis wird in property_valuations gespeichert UND 
      properties.current_price_per_qm + current_value aktualisiert
    
    WICHTIG für die Gesamt-P&L:
    - Wertsteigerung = current_value - purchase_price
    - Historisch nachvollziehbar: "Im Q3 2024 war der qm-Preis 
      3.200€, jetzt ist er 3.500€ (+9.4%)"
    - Bei Verkauf: Letzte Bewertung vs. tatsächlicher Verkaufspreis 
      als Qualitätscheck der Schätzungen

31. infrastructure_health — Wöchentliche Infrastruktur-Logs
    (id, check_date TIMESTAMPTZ DEFAULT NOW(),
    server_disk_pct NUMERIC, server_ram_pct NUMERIC,
    ssl_days_remaining INTEGER,
    n8n_version_current TEXT, n8n_version_latest TEXT,
    n8n_update_available BOOLEAN DEFAULT FALSE,
    api_status JSONB,                 -- {anthropic: {status: 200, ms: 340}, ...}
    supabase_db_size_mb NUMERIC, supabase_storage_mb NUMERIC,
    workflow_errors_week INTEGER DEFAULT 0,
    agent_errors JSONB,
    api_cost_month NUMERIC,
    tailscale_online BOOLEAN,
    overall_status TEXT DEFAULT 'healthy', -- 'healthy'/'warning'/'critical'
    ai_analysis TEXT,                 -- nur wenn Alarme → Haiku-Analyse
    issues JSONB)

32. incident_log — Infrastruktur-Fehler mit Learnings
    (id, incident_date TIMESTAMPTZ DEFAULT NOW(),
    workflow_name TEXT NOT NULL,
    error_message TEXT,
    root_cause TEXT,
    fix_applied TEXT,
    prevention_measure TEXT,
    recurrence BOOLEAN DEFAULT FALSE,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMPTZ)

33. agent_performance — Monatliche Agent-Bewertungen (Performance Manager)
    (id, agent TEXT NOT NULL,
    review_date DATE,
    rule_compliance_score NUMERIC,    -- 0-100
    structure_score NUMERIC,
    actionability_score NUMERIC,
    cross_reference_score NUMERIC,
    overall_grade TEXT,               -- A/B/C/D/F
    strengths TEXT,
    weaknesses TEXT,
    improvement_actions JSONB,
    prompt_change_proposal JSONB,     -- {old_text, new_text, reason}
    user_feedback_positive_rate NUMERIC,
    user_feedback_count INTEGER)

34. country_inflation — Inflationsdaten pro Zielland (quartalsweise)
    (id, country_code TEXT NOT NULL,
    data_date DATE,
    inflation_rate_official NUMERIC,  -- offizielle Rate in %
    inflation_trend TEXT,             -- 'steigend'/'fallend'/'stabil'
    source TEXT,                      -- 'worldbank'/'tradingeconomics'/'tavily'
    notes TEXT)

35. market_intelligence — Markt-Signale aus externen Quellen
    (id, scan_date TIMESTAMPTZ DEFAULT NOW(),
    source TEXT,                      -- 'unusual_whales'/'kobeissi'/'watcher_guru'
    headline TEXT,
    snippet TEXT,
    relevance_tags JSONB,             -- ["crypto","macro","fed","portfolio"]
    portfolio_relevant BOOLEAN DEFAULT FALSE)

--- FIX #4: Tabelle savings_goals fehlte im Original-Schema ---
36. savings_goals — Sparziele (referenziert von exit_prerequisites + Weekly Report)
    (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,               -- 'GeoArbitrage Fund', 'Notreserve' etc.
    description TEXT,
    target_amount NUMERIC NOT NULL,   -- Zielbetrag in EUR
    current_amount NUMERIC DEFAULT 0,
    currency TEXT DEFAULT 'EUR',
    target_date DATE,
    start_date DATE DEFAULT CURRENT_DATE,
    category TEXT CHECK (category IN
      ('emergency','investment','geoarbitrage','tax_reserve','property','other')),
    auto_update BOOLEAN DEFAULT TRUE, -- aus budget-Einträgen automatisch berechnen?
    linked_budget_category TEXT,      -- Mapping auf budget.category
    status TEXT DEFAULT 'active' CHECK (status IN ('active','reached','paused','archived')),
    reached_at TIMESTAMPTZ,
    notes TEXT)

    ⚠️ KEIN GENERATED COLUMN für monthly_required und progress_pct:
    PostgreSQL erlaubt in GENERATED STORED Columns NUR immutable
    Functions. CURRENT_DATE ist STABLE, AGE() ist STABLE → SQL Error.
    Außerdem: monthly_required mit CURRENT_DATE würde nur bei
    INSERT/UPDATE berechnet, NICHT täglich — der Kommentar "bleiben
    immer automatisch korrekt" wäre irreführend.

    LÖSUNG: View statt Generated Columns:
    ```sql
    CREATE OR REPLACE VIEW savings_goals_computed AS
    SELECT *,
      CASE
        WHEN target_date IS NOT NULL
          AND target_date > CURRENT_DATE
          AND target_amount > current_amount
        THEN (target_amount - current_amount) /
             NULLIF(
               EXTRACT(YEAR FROM AGE(target_date, CURRENT_DATE)) * 12
               + EXTRACT(MONTH FROM AGE(target_date, CURRENT_DATE)),
               0
             )
        ELSE NULL
      END AS monthly_required,
      CASE
        WHEN target_amount > 0
        THEN LEAST((current_amount / target_amount * 100), 100)
        ELSE 0
      END AS progress_pct
    FROM savings_goals;
    ```
    Diese View liefert IMMER aktuelle Werte — bei jedem SELECT,
    nicht nur bei INSERT/UPDATE. Das Dashboard und die Agenten
    lesen aus savings_goals_computed statt direkt aus savings_goals.

--- FIX #5: Tabelle monthly_reports fehlte im Original-Schema ---
37. monthly_reports — Weekly/Monthly Intelligence Briefs (Sprint 6.2)
    (id UUID, created_at TIMESTAMPTZ,
    scan_date DATE NOT NULL,
    report_type TEXT DEFAULT 'weekly' CHECK (report_type IN ('weekly','monthly')),
    narrative TEXT,                   -- Der 4-Absatz CFO-Brief
    stress_test_results JSONB,        -- {2008: {before, after, drawdown_pct}, covid: {...}}
    correlation_scores JSONB,         -- {currency, geography, asset_class, ...}
    actions JSONB,                    -- [{priority, action, deadline}, ...]
    countries_scanned TEXT[],
    alerts_triggered JSONB,
    cost_eur NUMERIC DEFAULT 0,
    delivery_status TEXT DEFAULT 'pending' CHECK (delivery_status IN
      ('pending','sent','failed')))

--- NEU: Tabelle macro_indicators — Gold-Preis + EZB-Leitzins ---
38. macro_indicators — Makroökonomische Kennzahlen (wöchentlich)
    (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_date DATE NOT NULL,

    -- Gold (Yahoo Finance GC=F Ticker, USD/oz → konvertiert in EUR/oz)
    gold_price_usd NUMERIC,           -- Preis USD/oz (Gold Futures GC=F)
    gold_price_eur NUMERIC,           -- Preis EUR/oz (aus fx_rates umgerechnet)
    gold_change_1w NUMERIC,           -- Veränderung vs. Vorwoche in %
    gold_change_1m NUMERIC,           -- Veränderung vs. Vormonat in %
    gold_change_3m NUMERIC,           -- Veränderung vs. Vorquartal in %
    gold_trend TEXT,                  -- 'steigend' (>+2%/Mo) / 'fallend' (<-2%/Mo) / 'stabil'
    gold_source TEXT DEFAULT 'yahoo_gc_f',

    -- EZB Leitzinsen (ECB Data Portal API — offiziell, kostenlos, kein Key)
    ecb_deposit_rate NUMERIC,         -- Einlagezins in % (relevantester Referenzzins)
    ecb_main_rate NUMERIC,            -- Hauptrefinanzierungssatz in %
    ecb_marginal_rate NUMERIC,        -- Spitzenrefinanzierungssatz in %
    ecb_rate_changed BOOLEAN DEFAULT FALSE, -- Hat sich der Satz geändert vs. letztem Eintrag?
    ecb_change_basis_points INTEGER,  -- Änderung in Basispunkten (z.B. -25 = -0.25pp)
    ecb_last_change_date DATE,        -- Datum der letzten Zinsänderung
    ecb_next_meeting_date DATE,       -- Nächstes EZB-Ratstreffen (aus Kalender)
    ecb_source TEXT DEFAULT 'ecb_api',
    notes TEXT)

    ZWECK: Agenten lesen Makrodaten aus dieser Tabelle statt APIs selbst aufzurufen.
    Zentrale Datenhaltung, wöchentlich aktualisiert vom Weekly Scan (A12/A13).

    RELEVANZ PRO AGENT:
    - Wealth Manager:  Gold (Safe Haven, Inflationsschutz, Portfoliokorrelation),
                       EZB (Safe Withdrawal Rate, Monte-Carlo-Annahmen, Anleihen)
    - Immobilien:      EZB (Anschlussfinanzierung, neue Kredite, Zinsrisiko)
    - Tax Architect:   Gold (§23 EStG 12-Monats-Haltefrist), EZB (Schuldenstruktur)
    - Validator (Stress-Test): Gold-Trend + EZB als Makro-Risikosignale

Bitte erstelle auch:
- Row Level Security (RLS) Policies

  FIX (RLS): Verwende NICHT `FOR ALL USING (true)`. Das ist nur sicher
  solange es exakt 1 User gibt. Verwende stattdessen die spezifische User-UUID:
  
  CREATE POLICY "Only owner" ON decisions
    FOR ALL USING (auth.uid() = 'DEINE-USER-UUID-HIER'::uuid);
  
  Diese Policy für JEDE Tabelle wiederholen. Die UUID findest du in Supabase:
  Authentication → Users → Dein User → UUID kopieren.
  
  Das SQL-Script 01_schema_additions_and_fixes.sql enthält einen DO-Block
  der alle Tabellen automatisch mit der korrekten Policy versieht.

- Sinnvolle Indexe (auf agent, category, status, event_date)
- Initiale Calendar Events für deutsche Steuertermine 2026

Kommentiere das SQL ausführlich auf Deutsch.
```

**Manuelle Schritte:**

> ⚠️ **PFLICHT-CHECKLISTE — alle 4 Punkte abhaken bevor Sprint 2 gestartet wird:**
> - [ ] 1. Haupt-Schema (aus diesem Blueprint) im SQL Editor ausführen
> - [ ] 2. `01_schema_additions_and_fixes.sql` ausführen ← **DARF NICHT ÜBERSPRUNGEN WERDEN**
> - [ ] 3. API-Keys in `.env` eingetragen
> - [ ] 4. RLS-Test bestanden (Schritt unten)
>
> **Warum kritisch:** Wird `01_schema_additions_and_fixes.sql` nicht ausgeführt, fehlt die
> `chat_history.embedding`-Spalte. Sprint 2 (episodisches Gedächtnis) bricht dann **still
> und ohne Fehlermeldung** ab — alle Konversations-Embeddings werden einfach nicht
> gespeichert und die Memory-Funktion funktioniert nicht.

- Supabase Account erstellen: https://supabase.com
- Neues Projekt anlegen (Free Tier, Region: Frankfurt)
- SQL-Script im SQL Editor ausführen (Haupt-Schema aus diesem Blueprint)
- **Danach sofort:** `01_schema_additions_and_fixes.sql` ausführen
  (fehlende Tabellen savings_goals, monthly_reports + chat_history embedding + RLS)
- API-Keys notieren (anon key + service role key + URL)
- **FIX #11:** Management Token erstellen für Infrastructure Health Check:
  https://supabase.com/dashboard/account/tokens → "Generate token"
  In .env eintragen als `SUPABASE_MANAGEMENT_TOKEN=sbp_...`

**SICHERHEITSKRITISCH (sofort nach Projekt-Erstellung):**
- Authentication → Providers → Email → "Enable Email Signup" → **AUS**
  (Verhindert dass sich Fremde einen Account erstellen können)
- Einen einzigen User-Account anlegen (deine Email + starkes Passwort)
- 2FA aktivieren für diesen Account
- RLS-Policies auf JEDER Tabelle mit sensiblen Daten auf deine
  User-UUID einschränken (nicht `USING (true)` sondern
  `USING (auth.uid() = 'DEINE-UUID')`)
  → Der DO-Block in `01_schema_additions_and_fixes.sql` erledigt das automatisch

  Konkretes SQL-Beispiel (für jede Tabelle mit sensiblen Daten wiederholen):
  ```sql
  -- RLS: Nur DEIN spezifischer User-Account hat Zugang
  ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Only owner" ON decisions
    FOR ALL USING (auth.uid() = 'DEINE-USER-UUID-HIER');

  -- Für JEDE Tabelle mit sensiblen Daten wiederholen:
  -- decisions, properties, portfolio_holdings, budget,
  -- wealth_snapshots, agent_logs, chat_history, etc.

  -- WICHTIG: Supabase Signup DEAKTIVIEREN
  -- Dashboard → Authentication → Providers → Email → "Enable Email Signup" → AUS
  -- Ohne das kann sich jeder registrieren und potenziell Daten lesen!
  ```
- Service Role Key NIEMALS im Frontend verwenden — 
  nur in n8n .env Datei auf dem VPS

**FIX #6 — Supabase Keep-Alive einrichten:**
Supabase Free Tier pausiert Projekte nach 7 Tagen Inaktivität.
Der Keep-Alive Cron wird von `setup.sh` automatisch eingerichtet.
Manuell prüfen ob er läuft: `crontab -l | grep keepalive`

**Ergebnis:** Vollständige Datenbank mit allen 38 Tabellen (35 Original + 3 Additions: savings_goals, monthly_reports, macro_indicators), Indexen, Views und der Vektor-Suchfunktion. Signup deaktiviert, nur dein Account existiert.

---

#### 1.3 — Erster Agent: CFO + Tax Architect in n8n

**Was passiert:** Du baust den ersten funktionierenden Workflow — der CFO nimmt eine Frage entgegen, entscheidet ob der Tax Architect gebraucht wird, ruft ihn auf, und liefert eine Antwort.

**Workflow-Erstellung mit MCP (empfohlen ab n8n 2.14):**

Wenn du die MCP-Integration (Sprint 1.1) eingerichtet hast, kann
Claude Code Workflows direkt auf deiner n8n-Instanz erstellen:

```
Bisheriger Weg:
  Claude Code generiert → JSON-Datei → manueller Import in n8n → Credentials verknüpfen

NEU (mit MCP):
  Claude Code erstellt Workflow direkt auf n8n-Instanz via MCP →
  Review im n8n Editor → Credentials verknüpfen → Publish

WICHTIG — Review-Step vor Publish:
  Claude Code erzeugt manchmal zu viele Code Nodes ohne Kommentare
  und schwer lesbare Expressions. Jeden Workflow im n8n Editor prüfen
  bevor er published wird.
```

Ergänze in jedem Claude Code Prompt für Workflow-Erstellung (Sprint 1.3–1.5):
```
Nutze den n8n MCP Server um den Workflow direkt auf meiner n8n-Instanz
zu erstellen. Erstelle den Workflow als Draft — ich publishe nach Review.
```

**Claude Code Prompt:**
```
Ich möchte in n8n (self-hosted) einen Multi-Agent-Workflow bauen.
Bitte erstelle mir die detaillierte Schritt-für-Schritt-Anleitung
(inkl. Node-Konfigurationen als JSON, die ich importieren kann) für:

WORKFLOW 1: "CFO Orchestrator" (Main Workflow)

DUAL-TRIGGER ARCHITEKTUR:
Der Workflow hat ZWEI Eingänge — die Kernlogik danach ist identisch.

- Trigger A: MCP Server Trigger (für interaktive Beratung aus Claude)
  → Exponiert den CFO als MCP-Tool namens "geoarbitrage_cfo"
  → Tool-Beschreibung: "Frag das GeoArbitrage Advisory Team.
    Für Steuer-, Immobilien-, Vermögens-, Immigration- und
    Strukturierungsfragen."
  → Input: {message: "...", session_id: "auto-generated"}
  → Sicherheit: Nur über Tailscale VPN erreichbar + Bearer Token

- Trigger B: Webhook (POST, für Telegram-Bot)
  → empfängt JSON: {message: "...", session_id: "..."}
  → Telegram Secret Token + Absender-Whitelist Verifikation (wie bisher)

- Node "Merge": Vereinigt beide Trigger-Outputs in einheitliches Format
  → {message, session_id, source: "mcp"|"telegram"}

Ab hier IDENTISCHER Flow für beide Kanäle:

- Node 1: HTTP Request → Supabase (lade relevanten Context: letzte 5
  chat_history Einträge für diese session_id, offene decisions,
  properties, budget aktueller Monat)
  ⚠️ BUG FIX #16 — Leeres Array bei erstem Aufruf:
  Beim ersten Chat gibt es keine chat_history → Supabase liefert [].
  n8n stoppt den Workflow wenn ein Node leere Daten ausgibt!
  FIX 1: Node "Supabase: Context laden" → Settings → "Always Output Data" = AN
  FIX 2: Der folgende Code Node MUSS $input.all() statt $input.first() nutzen,
  mit try/catch um leere Arrays abzufangen:
  ```javascript
  const items = $input.all();
  const context = items.length > 0 ? items[0].json : { chat_history: [], decisions: [] };
  ```
  Dies gilt für ALLE Supabase-Lese-Nodes in allen Workflows!
- Node 2: AI Agent Node (Claude Haiku 4.5 via Anthropic API)
  System Prompt: CFO Orchestrator (Intent Classification)
  Input: User-Message + Context
  Output: JSON {agents_needed: ["tax"], routing_order: "sequential",
  urgency: "normal", is_data_entry: false}
- Node 3: IF-Bedingung: Ist es ein Dateneintrag?
  → JA: Direkt in budget/portfolio Tabelle schreiben, Bestätigung senden
  → NEIN: Weiter zu Agent-Routing
- Node 4: Execute Sub-Workflow "Tax Architect" (wenn in agents_needed)
  ⚠️ BUG FIX #32: Node-Typ MUSS "Execute Workflow" sein (NICHT den veralteten
  "Execute Sub-Workflow" verwenden!). Konfiguration:
    Source: Database
    Workflow: By ID → Tax Architect Workflow-ID
    Mode: Run once with all items
    Wait For Sub-Workflow Completion: AN
    Inputs: question = {{ $json.user_message }}, session_id, context
  ⚠️ BUG FIX #23 — Interface-Vertrag CFO → Sub-Workflows:
  Der "Validator vorbereiten" Node MUSS dieselben Feldnamen verwenden
  die der Sub-Workflow erwartet. Aktueller Vertrag:
    CFO sendet: user_message (primär) + agent_response, original_question
    Sub-Workflows erwarten: question/user_message, recommendation/agent_response
  → Doppelte Fallbacks in Sub-Workflows als Sicherheitsnetz einbauen
- Node 5: Execute Sub-Workflow "Validator"
- Node 6: AI Agent Node (Claude Haiku) → Response Assembly
  Fasst alle Ergebnisse zusammen, erstellt ggf. Decision Brief
  ⚠️ BUG FIX #26 — Validator-Output-Felder: Response Assembly muss alle
  möglichen Output-Feldnamen des Validators abfangen:
  validated_response || response || overall_assessment
  ⚠️ BUG FIX #38 — Node-Referenzen: `$('NodeName')` MUSS den exakten
  Node-Namen in n8n verwenden! Beispiel: Wenn der Tax Architect Sub-Workflow-
  Aufruf "Call 'Tax Architect (Sub-Workflow)'" heißt, dann:
    const taxOutput = $("Call 'Tax Architect (Sub-Workflow)'").first().json;
  NICHT: $('Tax Architect ausführen') — alter Name existiert nicht mehr!
- Node 7: HTTP Request → Supabase (schreibe chat_history + agent_logs)
- Node 8: Response Router (Switch Node, basierend auf source-Feld):
  → IF source = "mcp": Respond to MCP (Ergebnis geht zurück an Claude)
  → IF source = "telegram": Respond to Webhook (Antwort an Telegram Bot)

MCP-CLIENT-KONFIGURATION (einmalig in Claude Code):
Nach dem Workflow-Deploy die MCP-Verbindung einrichten:

  claude mcp add geoarbitrage-cfo \
    --transport sse \
    --url https://HOSTNAME.TAILNET.ts.net/mcp/CFO_WORKFLOW_ID \
    --header "Authorization: Bearer DEIN_MCP_TOKEN"

Danach hat Claude Code ein Tool "geoarbitrage_cfo" im Werkzeuggürtel.
Test: In Claude Code einfach fragen "Frag den CFO: Was ist mein
aktueller Exit-Readiness-Score?" — Claude sollte automatisch das
Tool aufrufen.

WORKFLOW 2: "Tax Architect" (Sub-Workflow)
⚠️ BUG FIX #33: Trigger-Node MUSS "When Executed by Another Workflow" sein
  (NICHT den veralteten "Workflow Input" Node verwenden!). Modus: "Accept all data"
- Input: {question: "...", user_message: "...", context: {...}, session_id: "..."}
- Node 1: HTTP Request → Supabase pgvector
  (match_knowledge Funktion aufrufen, filter_bereiche='{tax,shared}', top 5 Ergebnisse)
  ⚠️ filter_bereiche ist ein TEXT-Array — immer BEIDE Bereiche mitgeben:
  Primärbereich des Agenten + 'shared' (Mandantenprofil + Output-Standards)
- Node 2: AI Agent Node (Claude Sonnet 4.6 via Anthropic API)
  System Prompt: [Ich liefere den vollständigen Tax Architect Prompt separat]
  Input: User-Frage + Context + RAG-Ergebnisse
  Tools:
  - Web Search (via SerpAPI oder Tavily HTTP Request)
  - Calculator (Code Node für Berechnungen)
  ⚠️ BUG FIX #34: Feldname-Fallback im "Build Request" Node:
    question = input.question || input.user_message || 'Keine Frage übergeben'
    context = input.context || input.chat_history || {}
  ⚠️ BUG FIX #35: max_tokens = 8192 (NICHT 4096 — Output wird bei komplexen
    Analysen abgeschnitten). Tax Architect gibt Markdown/Fließtext zurück, KEIN JSON.
  → Parse-Node: Fließtext direkt als agent_response + empfehlung + response durchreichen.
    Confidence aus Emoji extrahieren (🟢=hoch/🟡=mittel/🔴=niedrig).
    KEIN JSON-Parse auf Tax Architect Output!
  Output: Fließtext mit Empfehlung, Optionen, Confidence-Emoji,
  betroffene Bereiche, Quellen, Eskalationsbedarf
- Return: Output an Main Workflow

WORKFLOW 3: "Validator" (Sub-Workflow)
⚠️ BUG FIX #33: Trigger-Node MUSS "When Executed by Another Workflow" sein
  (NICHT den veralteten "Workflow Input" Node!). Modus: "Accept all data"
- Input: Agent-Empfehlung als JSON
  ⚠️ BUG FIX #23/#34: Input-Felder mit Fallback lesen:
  recommendation = input.agent_response || input.recommendation
  question = input.original_question || input.question || input.user_message
- Node 1: AI Agent Node (Claude Sonnet 4.6)
  ⚠️ BUG FIX #21: Body Content Type = Raw (NICHT JSON!)
  System Prompt: Validator-Protokoll (Faktenprüfung)
  Tool: Web Search (zur Verifikation von Paragraphen und Steuersätzen)
  ⚠️ BUG FIX #24/#36: max_tokens = 8192 (NICHT 4096/2048 — bei ~4675
  Input-Tokens bleibt bei 4096/4200 kaum Raum für Output → leere Arrays
  in checked_claims, stress_test)
  Output: {status: "validated/partial/failed/unverified",
  corrections: [...], notes: "..."}
- Parse Node: JSON aus Anthropic-Antwort extrahieren
  ⚠️ BUG FIX #25: NICHT Regex verwenden! Stattdessen:
  indexOf('{') / lastIndexOf('}') + Markdown-Backtick-Cleaning vor Parse
  ⚠️ BUG FIX #39: Im Fallback NICHT substring(0, 500) verwenden!
  Vollständigen Text durchreichen — abgeschnittene Responses verfälschen
  das Validierungsergebnis.
- Return: Validierungsergebnis

Bitte erstelle für jeden Workflow:
1. Eine n8n-kompatible JSON-Datei die ich importieren kann
2. Die exakte Konfiguration jedes Nodes
3. Die Credential-Platzhalter die ich ausfüllen muss
4. Einen Test-Befehl (curl) um den Webhook zu testen

Für den System Prompt des Tax Architect verwende folgendes:
[HIER DEN VOLLSTÄNDIGEN TAX ARCHITECT PROMPT AUS DEM AGENT-TEAM-DOKUMENT EINFÜGEN]
```

**Hinweis:** Den vollständigen Tax Architect System Prompt findest du im
Dokument "geo-arbitrage-ai-team-v2.md" unter Agent #1. Kopiere den gesamten
Prompt-Block und füge ihn in den Claude Code Prompt ein.

> ⚠️ **WICHTIG — Dieser Agent ist ein Proof-of-Concept:**
> Der Tax Architect wird in **Sprint 3** vollständig auf RAG umgestellt
> (Kern-Prompt ~700 Tokens + RAG-Chunks statt ~6.000 Token Full-Prompt).
> **Keine Zeit in Prompt-Feintuning investieren** — der Sprint-1-Agent
> dient nur dazu, den Workflow-Aufbau und die API-Integration zu testen.
> Der finale Agent kommt aus `knowledge_base/core-prompts/agent-01-tax-architect.md`.

**Manuelle Schritte:**
- Anthropic API Key erstellen: https://console.anthropic.com
- Tavily API Key erstellen: https://tavily.com (Free Tier)
- In n8n: Credentials anlegen (Anthropic, Supabase, Tavily)
- Workflows importieren und Credentials verknüpfen

**Test (FIX #3 — korrekte URL via Tailscale MagicDNS):**
```bash
# n8n ist NUR über Tailscale erreichbar — NICHT über n8n.deinedomain.de
# Ersetze HOSTNAME.TAILNET.ts.net mit deiner tatsächlichen Tailscale-URL
# (findest du unter https://login.tailscale.com/admin/machines)
curl -X POST https://HOSTNAME.TAILNET.ts.net/webhook/cfo \
  -H "Content-Type: application/json" \
  -d '{"message": "Was passiert steuerlich wenn ich nach Dubai ziehe und meine Immobilie in Düsseldorf behalte?", "session_id": "test-001"}'
```

**Ergebnis:** Du kannst dem System Steuerfragen stellen und bekommst eine strukturierte Antwort mit Quellenangaben und Confidence Score.

---

#### 1.4 — Infrastructure Health Check (Wöchentlicher Monitoring-Workflow)

**Was passiert:** Du baust einen automatisierten Workflow der die gesamte Infrastruktur überwacht — Server, APIs, Datenbank, Zertifikate, Workflows. Kein LLM nötig für 95% der Checks. Nur bei Fehlern wird AI für die Analyse hinzugezogen.

**Claude Code Prompt:**
```
Erstelle einen n8n Cron-Workflow "Infrastructure Health Check":

Trigger: Cron (jeden Montag, 06:00 CET)

=== SCHICHT 1: Automatische Checks (kein LLM) ===

CHECK 1 — SERVER-GESUNDHEIT:
   Bash Node (Execute Command):
   ⚠️ BUG FIX #28: Dieser Node ist in n8n 2.0+ standardmäßig DEAKTIVIERT!
   Voraussetzung: `NODES_EXCLUDE=[]` in docker-compose.yml environment setzen
   und Container neu starten. Ohne das ist der Node in der Suche unsichtbar.
   - Disk Usage: df -h / | awk '{print $5}' → parse Prozent
     ALERT wenn >80%
   - RAM Usage: free -m | grep Mem | awk '{print $3/$2 * 100}'
     ALERT wenn >85%
   - Docker Container Status: docker ps --format '{{.Names}} {{.Status}}'
     ALERT wenn ein Container nicht "Up" ist
   - Uptime: uptime → Tage seit letztem Reboot
   - Load Average: cat /proc/loadavg → 5min Average
     ALERT wenn > 2.0 (CPX22 hat 2 vCPUs)

CHECK 2 — SSL-ZERTIFIKATE:
   Bash Node:
   # Dashboard SSL wird von Vercel verwaltet — kein manueller Check nötig
   - echo | openssl s_client -servername webhook.deinedomain.de
     -connect webhook.deinedomain.de:443 2>/dev/null |
     openssl x509 -noout -enddate
   - Parse: Tage bis Ablauf
     ALERT wenn <14 Tage
     INFO wenn <30 Tage

CHECK 3 — N8N VERSION:
   HTTP Request zu GitHub API:
   https://api.github.com/repos/n8n-io/n8n/releases/latest
   - Parse: tag_name → latest_version
   - Vergleiche mit aktueller n8n Version
     (Bash: docker exec n8n n8n --version)
   - INFO wenn neue Minor-Version verfügbar
   - WARNUNG wenn aktuelle Version >3 Monate alt
   - KRITISCH wenn Major-Version-Differenz > 0
     (z.B. installiert 2.x, latest 3.x → Breaking Changes möglich)
   - Erweiterte Versionslogik:
     const [curMajor, curMinor] = currentVersion.split('.').map(Number);
     const [latMajor, latMinor] = latestVersion.split('.').map(Number);
     if (latMajor > curMajor) → KRITISCH: Major-Update verfügbar
     else if (latMinor - curMinor > 2) → WARNUNG: Mehrere Minor-Updates

CHECK 4 — API-ENDPUNKTE PING (alle externen APIs):
   Für jeden Endpunkt einen HTTP Request mit Timeout 10s:
   a) Anthropic: POST https://api.anthropic.com/v1/messages 
      (mit minimalem Request, max_tokens=1)
   b) Voyage AI: POST https://api.voyageai.com/v1/embeddings
      (mit Test-Input)
   c) GDELT: GET https://api.gdeltproject.org/api/v1/dash_stabilitytimeline/dash_stabilitytimeline?LOC=GM&VAR=instability&OUTPUT=csv&TIMERES=day&SMOOTH=5
   d) CoinGecko: GET https://api.coingecko.com/api/v3/ping
      Header: x-cg-demo-api-key: {COINGECKO_API_KEY}
      (API Key IMMER als Header, NICHT als URL-Parameter — URL-Parameter
      landen in Server-Logs, Browser-History und Referer-Headers)
   e) Yahoo Finance: GET https://query1.finance.yahoo.com/v8/finance/chart/VWCE.DE?interval=1d&range=1d
   f) ExchangeRate: GET https://open.er-api.com/v6/latest/EUR
   g) Tavily: POST https://api.tavily.com/search (mit Test-Query)
   h) ACLED: GET https://acleddata.com/api/acled/read?limit=1
      Header: Authorization: Bearer {aus ACLED OAuth2 Token-Call}
      (Token holen via POST https://acleddata.com/oauth/token)
   
   Pro Endpunkt: Status Code + Response Time loggen.
   ALERT wenn Status != 200 oder Timeout
   WARNUNG wenn Response Time >5s

CHECK 5 — SUPABASE FREE TIER LIMITS:
   L8 FIX: Konkrete Implementierung mit Supabase Management API + SQL-Fallback.

   a) Datenbank-Größe via PostgreSQL-Query (zuverlässiger als Management API,
      kein gesonderter Management Token nötig — Service Role Key reicht):
      Supabase RPC / direkter SQL Call:
      SELECT pg_database_size(current_database()) / 1024 / 1024 AS size_mb;
      ALERT wenn size_mb > 400  (Free Tier Limit: 500MB)

   b) Storage-Nutzung via Supabase Management API:
      GET https://api.supabase.com/v1/projects/{PROJECT_REF}/storage/stats
      Header: Authorization: Bearer {SUPABASE_MANAGEMENT_TOKEN}
      Parse: total_bytes → in MB
      ALERT wenn > 800MB  (Free Tier Limit: 1GB)
      PROJECT_REF = letzter Teil der SUPABASE_URL (z.B. "abcdefghijkl" aus
      https://abcdefghijkl.supabase.co)

   c) Auth-User-Count via Supabase Management API:
      GET https://api.supabase.com/v1/projects/{PROJECT_REF}/auth/users?page=1&per_page=10
      Header: Authorization: Bearer {SUPABASE_MANAGEMENT_TOKEN}
      Parse: total (Gesamtzahl der User-Accounts)
      ALERT wenn total > 1  (Sicherheitswarnung — nur dein Account erlaubt!)

CHECK 6 — WORKFLOW ERROR LOGS:
   Supabase Query: 
   SELECT agent, COUNT(*) as errors, 
     array_agg(DISTINCT output_summary) as error_messages
   FROM agent_logs 
   WHERE created_at > NOW() - INTERVAL '7 days'
   AND (validation_status = 'failed' 
     OR confidence_score < 40)
   GROUP BY agent
   HAVING COUNT(*) > 2
   
   → Zeigt Agenten die in der letzten Woche wiederholt 
   Probleme hatten
   ALERT wenn ein Agent >5 Fehler in einer Woche hat

CHECK 7 — N8N WORKFLOW EXECUTION LOGS:
   n8n API (intern): GET /executions?status=error&limit=20
   - Zähle fehlgeschlagene Workflow-Runs der letzten Woche
   - Parse Error Messages
   ALERT wenn >5 fehlgeschlagene Runs
   WARNUNG wenn >2

CHECK 8 — TAILSCALE STATUS:
   Bash Node: tailscale status --json
   - Parse: Ist der Node "online"?
   - Letzte Verbindung wann?
   ALERT wenn offline

CHECK 9 — API-KOSTEN-STATUS:
   Supabase Query:
   SELECT SUM(cost_eur) as total_cost 
   FROM agent_logs 
   WHERE created_at > date_trunc('month', NOW())
   
   - Berechne: Prozent des Monatsbudgets (20€) verbraucht
   WARNUNG wenn >75%
   ALERT wenn >90%

=== SCHICHT 2: Fehleranalyse (nur bei Alarmen, Haiku) ===

Wenn Schicht 1 mindestens einen ALERT produziert:

   Haiku Call:
   System Prompt: "Du bist ein DevOps-Ingenieur. Analysiere 
   die folgenden Infrastructure Health Check Ergebnisse. 
   Identifiziere die Ursache jedes Problems und schlage einen 
   konkreten Fix vor (als Shell-Befehl oder Konfigurationsänderung). 
   Priorisiere: Was muss SOFORT gefixt werden vs. was kann warten."
   
   Input: Alle Check-Ergebnisse mit Alarm-Flags
   
   Output: {
     critical_issues: [{issue, cause, fix_command, urgency}],
     warnings: [{issue, recommendation}],
     system_health_score: 1-10
   }

=== SCHICHT 3: Logging & Alerting ===

1. Supabase Insert in neue Tabelle "infrastructure_health":
   (check_date, server_disk_pct, server_ram_pct, 
   ssl_days_remaining, n8n_version_current, n8n_version_latest, 
   n8n_update_available BOOLEAN, 
   api_status JSONB,  -- {anthropic: {status: 200, ms: 340}, ...}
   supabase_db_size_mb, supabase_storage_mb,
   workflow_errors_week INTEGER,
   agent_errors JSONB,
   api_cost_month NUMERIC,
   tailscale_online BOOLEAN,
   overall_status TEXT,  -- 'healthy', 'warning', 'critical'
   ai_analysis TEXT,     -- nur wenn Alarme → Haiku-Analyse
   issues JSONB)

2. Telegram Alert:
   - Wenn overall_status = 'critical':
     "🔴 INFRASTRUCTURE ALERT: [Problem]. Fix: [Empfehlung]. 
     Bitte innerhalb von 24h handeln."
   - Wenn overall_status = 'warning':
     "🟡 Infrastructure Check: [Anzahl] Warnungen. 
     [Zusammenfassung]. Details im Dashboard."
   - Wenn overall_status = 'healthy':
     KEINE Nachricht (stille Bestätigung, nur im Log)
   
   AUSNAHME: n8n Update verfügbar → 
   1x/Monat Info: "ℹ️ n8n [Version] verfügbar. 
   Aktuell: [Version]. Update empfohlen am nächsten Wartungstag."

3. Dashboard Integration:
   Im Scan Tab einen Abschnitt "System Health" 
   hinzufügen der den letzten Health Check Status zeigt:
   🟢 Healthy / 🟡 Warnings / 🔴 Critical
   + Letzte 4 Wochen als Mini-Trend

=== INCIDENT LEARNING (in Performance Review integriert) ===

Wenn ein Workflow diese Woche fehlgeschlagen ist:
1. Speichere den Fehler mit Kontext in einer Tabelle 
   "incident_log":
   (incident_date, workflow_name, error_message, 
   root_cause, fix_applied, prevention_measure, 
   recurrence BOOLEAN)

2. Der Quarterly Quality Check bekommt im 
   monatlichen Review die incident_log Daten als Input:
   "Welche Workflows sind fehlgeschlagen? Gibt es Muster? 
   Welche Infrastruktur-Probleme sollten präventiv adressiert 
   werden?"

3. Über Zeit entsteht eine Knowledge Base von Problemen 
   und Fixes — das System lernt aus eigenen Fehlern.

Erstelle den vollständigen Workflow mit allen Nodes.
Kosten: 0€ (kein LLM wenn alles OK, ~0.01€ Haiku wenn Alarm)
```

**Neue Supabase-Tabellen:**

```sql
-- Infrastructure Health Logs
CREATE TABLE infrastructure_health (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    check_date TIMESTAMPTZ DEFAULT NOW(),
    server_disk_pct NUMERIC,
    server_ram_pct NUMERIC,
    ssl_days_remaining INTEGER,
    n8n_version_current TEXT,
    n8n_version_latest TEXT,
    n8n_update_available BOOLEAN DEFAULT FALSE,
    api_status JSONB,
    supabase_db_size_mb NUMERIC,
    supabase_storage_mb NUMERIC,
    workflow_errors_week INTEGER DEFAULT 0,
    agent_errors JSONB,
    api_cost_month NUMERIC,
    tailscale_online BOOLEAN,
    overall_status TEXT DEFAULT 'healthy',
    ai_analysis TEXT,
    issues JSONB
);

-- Incident Learning Log
CREATE TABLE incident_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_date TIMESTAMPTZ DEFAULT NOW(),
    workflow_name TEXT NOT NULL,
    error_message TEXT,
    root_cause TEXT,
    fix_applied TEXT,
    prevention_measure TEXT,
    recurrence BOOLEAN DEFAULT FALSE,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMPTZ
);
```

**Ergebnis:** Jeden Montag wird die gesamte Infrastruktur automatisch geprüft. Du wirst nur kontaktiert wenn etwas nicht stimmt. Über Zeit lernt das System aus eigenen Fehlern.

#### 1.5 — Automatisches Backup (Wöchentlich)

**Was passiert:** Deine Supabase-Daten haben automatische Cloud-Backups, aber die n8n-Workflows und Konfigurationen auf dem VPS nicht. Wenn die Festplatte stirbt, wären alle Workflows weg. Dieses Backup sichert alles wöchentlich.

**Claude Code Prompt:**
```
Erstelle ein Backup-Script (backup.sh) und einen Cron-Job:

Zeitplan: Jeden Sonntag 03:00 Uhr

Schritte:
1. n8n Workflows exportieren:
   docker exec n8n n8n export:workflow --all \
     --output=/backups/workflows_$(date +%Y%m%d).json

2. n8n Credentials exportieren (verschlüsselt):
   docker exec n8n n8n export:credentials --all \
     --output=/backups/credentials_$(date +%Y%m%d).json

3. .env Datei sichern:
   # BACKUP_PASSPHRASE bewusst NICHT ins Backup (Zirkularschluss)
   grep -v '^BACKUP_PASSPHRASE=' /opt/geoarbitrage/.env > /backups/env_$(date +%Y%m%d)

4. Nginx-Konfiguration sichern:
   cp -r /etc/nginx/sites-available/ /backups/nginx_$(date +%Y%m%d)/

5. FIX #8 — Verschlüsseltes Archiv erstellen (AES-256-CBC):
   WICHTIG: tar -czf allein ist NUR Kompression, KEINE Verschlüsselung!
   Das Backup enthält den N8N_ENCRYPTION_KEY → muss verschlüsselt sein.
   BACKUP_PASSPHRASE muss in .env gesetzt und separat gesichert sein.

   source /opt/geoarbitrage/.env
   tar -czf - /backups/ | \
     openssl enc -aes-256-cbc -pbkdf2 -iter 600000 \
       -pass env:BACKUP_PASSPHRASE \
       -out /backups/backup_$(date +%Y%m%d).tar.gz.enc

6. Alte Backups löschen (behalte letzte 4 Wochen):
   find /backups/ -name "backup_*.tar.gz.enc" -mtime +28 -delete

7. Off-Site Backup (PFLICHT — kostenlos via GitHub):
   Backups auf demselben Server schützen NICHT vor Festplatten-Tod
   oder Server-Verlust. Lösung: Private GitHub Repo als Off-Site.

   a) Einmalig einrichten:
      mkdir -p /opt/geoarbitrage/backup-repo
      cd /opt/geoarbitrage/backup-repo
      git init
      git remote add origin git@github.com:DEIN-USER/geoarbitrage-backup.git
      # SSH Deploy Key (read/write) im Repo hinterlegen:
      ssh-keygen -t ed25519 -f /root/.ssh/backup_deploy_key -N ""
      # → Public Key in GitHub Repo → Settings → Deploy Keys eintragen

   b) Im backup.sh nach der Verschlüsselung ergänzen:
      # Verschlüsseltes Backup in Git Repo pushen
      cp /backups/backup_$(date +%Y%m%d).tar.gz.enc \
         /opt/geoarbitrage/backup-repo/
      cd /opt/geoarbitrage/backup-repo
      git add -A
      GIT_SSH_COMMAND="ssh -i /root/.ssh/backup_deploy_key" \
        git commit -m "backup $(date +%Y%m%d)" && \
        git push origin main 2>/dev/null || true
      # Alte Backups im Repo entfernen (behalte letzte 4):
      ls -1t *.tar.gz.enc | tail -n +5 | xargs -r rm
      git add -A && git commit -m "cleanup" && \
        GIT_SSH_COMMAND="ssh -i /root/.ssh/backup_deploy_key" \
        git push origin main 2>/dev/null || true

   Kosten: 0€ (GitHub Free erlaubt private Repos bis 500MB,
   verschlüsselte Backups sind ~5-10MB pro Woche).

   SICHERHEIT: Das Backup ist AES-256-CBC verschlüsselt.
   Selbst wenn jemand Zugriff auf das Git Repo bekommt,
   sind die Inhalte ohne BACKUP_PASSPHRASE wertlos.

8. Restore-Script (restore.sh) — Vollständiger Wiederherstellungsprozess:

   Das Restore-Script MUSS auf einem frischen VPS funktionieren.
   Erstelle restore.sh mit folgenden Schritten:

   a) BACKUP_PASSPHRASE manuell eingeben (nicht im Script!):
      read -s -p "Backup Passphrase: " BACKUP_PASSPHRASE
      export BACKUP_PASSPHRASE

   b) Backup entschlüsseln:
      openssl enc -d -aes-256-cbc -pbkdf2 -iter 600000 \
        -pass env:BACKUP_PASSPHRASE \
        -in backup_DATUM.tar.gz.enc | tar -xzf -

   c) .env wiederherstellen:
      cp env_DATUM /opt/geoarbitrage/.env
      chmod 600 /opt/geoarbitrage/.env

   d) Nginx-Konfiguration wiederherstellen:
      cp -r nginx_DATUM/* /etc/nginx/sites-available/
      nginx -t && systemctl reload nginx

   e) Docker Compose starten (n8n + PostgreSQL):
      cd /opt/geoarbitrage && docker compose up -d

   f) Warten bis n8n gesund ist:
      echo "Warte auf n8n..."
      until docker exec n8n wget -q --spider http://localhost:5678/healthz 2>/dev/null; do
        sleep 5
      done
      echo "n8n ist bereit."

   g) Workflows importieren:
      docker exec -i n8n n8n import:workflow --input=/dev/stdin \
        < workflows_DATUM.json

   h) Credentials importieren:
      docker exec -i n8n n8n import:credentials --input=/dev/stdin \
        < credentials_DATUM.json

   i) Workflows publishen (n8n 2.x — ohne Publish reagieren Workflows
      NICHT auf Webhook-Triggers):
      echo "Publishing all workflows..."
      N8N_API_KEY=$(grep N8N_API_KEY /opt/geoarbitrage/.env | cut -d= -f2)
      WORKFLOWS=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" \
        http://localhost:5678/api/v1/workflows | jq -r '.data[].id')
      for WF_ID in $WORKFLOWS; do
        curl -s -X POST -H "X-N8N-API-KEY: $N8N_API_KEY" \
          http://localhost:5678/api/v1/workflows/$WF_ID/activate
      done
      echo "Alle Workflows aktiviert."

   j) Verifikation:
      echo "=== Restore Verifikation ==="
      docker ps --format 'table {{.Names}}\t{{.Status}}'
      curl -s -o /dev/null -w "n8n Status: %{http_code}\n" \
        http://localhost:5678/healthz
      echo "Workflows:"
      docker exec n8n n8n list:workflow 2>/dev/null | wc -l
      echo "Restore abgeschlossen."

   RESTORE-TEST (monatlich empfohlen):
   Einmal im Monat das neueste Backup auf dem lokalen Rechner
   entschlüsseln und prüfen ob die JSON-Dateien valide sind:
   read -s -p "Passphrase: " BACKUP_PASSPHRASE && export BACKUP_PASSPHRASE
   openssl enc -d -aes-256-cbc -pbkdf2 -iter 600000 \
     -pass env:BACKUP_PASSPHRASE \
     -in backup_DATUM.tar.gz.enc | tar -tzf -
   unset BACKUP_PASSPHRASE
   → Muss Dateiliste zeigen, kein "bad decrypt" Fehler.

WICHTIG: Credentials-Export enthält verschlüsselte API-Keys.
Der Encryption Key liegt in der n8n .env (N8N_ENCRYPTION_KEY).
Dieser Key MUSS im Backup enthalten sein, sonst können die
Credentials nicht wiederhergestellt werden.

BACKUP_PASSPHRASE separat sichern:
- NICHT nur auf dem Server (wäre Zirkelschluss)
- Empfehlung: Passwort-Manager (1Password, Bitwarden)
  ODER ausgedruckt in einem Tresor/Safe
```

**Ergebnis:** Jeden Sonntag werden alle n8n-Workflows, Credentials und Konfigurationen gesichert. Bei einem VPS-Ausfall kannst du in <1 Stunde alles wiederherstellen.

#### 1.6 — Recovery-Ziele (RPO/RTO) + Hetzner Snapshots + Restore-Drill

**Warum das wichtig ist:** Ein Backup ohne definierte Wiederherstellungszeit und regelmäßige Tests ist nur eine Hoffnung. Du musst WISSEN, wie schnell du wieder online bist — und das vorher einmal durchgespielt haben.

##### Recovery-Ziele (verbindlich für dieses System)

| Metrik | Ziel | Bedeutung |
|--------|------|-----------|
| **RPO** (Recovery Point Objective) | **≤ 24 Stunden** | Maximaler Datenverlust bei Totalausfall = 1 Tag (Backup läuft täglich). Supabase-Daten haben eigene Cloud-Backups (Point-in-Time Recovery im Pro Plan, tägliche Snapshots im Free Tier) |
| **RTO** (Recovery Time Objective) | **≤ 2 Stunden** | Maximale Ausfallzeit bis System wieder funktioniert. Beinhaltet: neuen VPS starten, Backup einspielen, Healthcheck bestätigen |
| **Backup-Frequenz VPS** | **Täglich 03:00 Uhr** | Nicht nur wöchentlich — für 24h RPO muss das Backup täglich laufen |
| **Backup-Frequenz Hetzner Snapshot** | **Täglich automatisch** | Kompletter Server-Snapshot als zusätzliche Absicherung (unabhängig vom Script-Backup) |
| **Restore-Drill** | **Monatlich** | Einmal pro Monat wird das Backup auf einem temporären VPS oder lokal wiederhergestellt und verifiziert |

##### Hetzner Snapshots aktivieren (PFLICHT)

Hetzner Snapshots sichern den gesamten VPS-Zustand (OS, Docker, Daten, Konfiguration) auf Image-Ebene. Bei Totalausfall: neuen VPS aus Snapshot starten → sofort alles wieder da.

**Einrichtung (einmalig, ~5 Minuten):**

1. Hetzner Cloud Console → Dein Server → "Backups" Tab
2. "Backups aktivieren" — Kosten: 20% des Server-Preises = **~1,90€/Mo** für CPX22
3. Hetzner erstellt automatisch tägliche Snapshots (max. 7 werden behalten)
4. Alternativ: Manuellen Snapshot vor jedem Update erstellen (kostenlos, max 2GB)

**Wiederherstellung aus Hetzner Snapshot:**
1. Hetzner Console → "Neuen Server erstellen"
2. Image-Quelle: "Snapshots" → Gewünschtes Datum wählen
3. Gleichen Server-Typ (CPX22) wählen → Erstellen
4. Neue IP-Adresse in Tailscale und DNS aktualisieren
5. Fertig — kompletter Server ist wiederhergestellt

**Kosten:** ~1,90€/Monat (laufend, 20% des Serverpreises) oder 0€ (nur manuelle Snapshots vor Updates)

##### Backup-Frequenz ändern: Wöchentlich → Täglich

Das bestehende backup.sh (Sprint 1.5) muss täglich statt wöchentlich laufen,
damit das RPO von 24h eingehalten wird:

```
# Alt (wöchentlich):
0 3 * * 0 /opt/geoarbitrage/backup.sh

# Neu (täglich):
0 3 * * * /opt/geoarbitrage/backup.sh
```

Ändern mit: `crontab -e` → Zeile anpassen.

##### Monatlicher Restore-Drill (Pflicht-Checkliste)

Einmal pro Monat (z.B. am 1. Sonntag) führst du folgenden Test durch.
Dauer: ~30 Minuten. Dokumentiere Ergebnis in einer einfachen Textdatei.

```
=== RESTORE-DRILL CHECKLISTE ===
Datum: ___________
Backup-Datei: backup_YYYYMMDD.tar.gz.enc

[ ] 1. Neuestes Backup von GitHub/Server auf lokalen Rechner kopieren
      ⚠️ Lesson Learned (Sprint 1.6):
      - scp braucht expliziten SSH-Key: scp -i ~/.ssh/id_ed25519
        (Password-Login ist deaktiviert → Hetzner Root-Passwort geht nicht!)
      - Ziel-Pfad MUSS vollständigen Dateinamen enthalten:
        RICHTIG: scp ... root@IP:/pfad ~/backup_DATUM.tar.gz.enc
        FALSCH:  scp ... root@IP:/pfad ~/Desktop/ (existiert nicht in WSL)
[ ] 2. Entschlüsseln (Passphrase NICHT als Argument übergeben!):
      read -s -p "Passphrase: " BACKUP_PASSPHRASE && export BACKUP_PASSPHRASE
      ⚠️ Lesson Learned: Erst read -s ausführen und Passphrase eingeben.
      DANN openssl-Befehl SEPARAT eingeben. Mehrzeilige Befehle NICHT
      zusammen einfügen — Text kann ins Passphrase-Feld rutschen → "bad decrypt".
      openssl enc -d -aes-256-cbc -pbkdf2 -iter 600000 \
        -pass env:BACKUP_PASSPHRASE \
        -in backup_YYYYMMDD.tar.gz.enc | tar -tzf -
      unset BACKUP_PASSPHRASE
      → MUSS Dateiliste zeigen (workflows, credentials, env, nginx)
      → DARF NICHT "bad decrypt" oder "error" zeigen
[ ] 3. Stichprobe: Eine JSON-Datei öffnen, prüfen ob valides JSON
[ ] 4. Prüfen: .env Datei enthält alle erwarteten Keys
      (N8N_ENCRYPTION_KEY, SUPABASE_*, ANTHROPIC_API_KEY, etc.)
[ ] 5. Ergebnis dokumentieren:
      - Erfolgreich: "Restore-Drill OK, alle Dateien intakt"
      - Fehlgeschlagen: "[Fehler beschreiben]" → SOFORT fixen

OPTIONAL (alle 3 Monate — Full Restore Test):
[ ] 6. Temporären Hetzner VPS erstellen (CPX22, wird nach Test gelöscht)
[ ] 7. restore.sh auf frischem VPS ausführen
[ ] 8. Prüfen: n8n erreichbar, Workflows vorhanden, Credentials funktionieren
[ ] 9. VPS löschen (Kosten: ~0,01€ für 30 Min Nutzung)
```

**Ergebnis:** Du hast ein definiertes RPO (24h) und RTO (2h), tägliche Snapshots auf zwei Ebenen (Hetzner + Script), und monatliche Verifikation dass dein Backup tatsächlich funktioniert.

---

### SPRINT 1 — Bug Fix Log (Post-Implementierung)

Die folgenden Bugs wurden bei der Sprint-1-Implementierung gefunden und gefixt.
Alle Korrekturen sind in die jeweiligen Blueprint-Abschnitte eingearbeitet.

| # | Bug | Root Cause | Fix | Status |
|---|-----|-----------|-----|--------|
| BUG FIX #14 | Anthropic API Auth falsch in Workflow-JSONs | `Authorization: Bearer sk-ant-...` statt `x-api-key` | Alle 3 Workflow-JSONs: Authentication → Header Auth, Header `x-api-key`, Value nur Key (kein Bearer) | ✅ Gefixt |
| BUG FIX #15 | `$env.X` in Code Nodes blockiert | `N8N_BLOCK_ENV_ACCESS_IN_NODE=true` blockiert auch `$env` | In docker-compose.yml auf `false` geändert | ✅ Gefixt |
| BUG FIX #16 | Supabase Context Node stoppt bei leerem Array | Erster Aufruf → keine chat_history → leeres Array → Workflow stoppt | Node: "Always Output Data" AN + Code Node: `$input.all()` statt `.first()` mit try/catch | ✅ Gefixt |
| BUG FIX #17 | SUPABASE_URL/SERVICE_ROLE_KEY nicht im Container | Variablen in .env aber nicht in docker-compose.yml environment | Variablen in docker-compose.yml unter n8n environment ergänzt | ✅ Gefixt |
| BUG FIX #18 | Port 5678 öffentlich exposed | `"5678:5678"` statt `"127.0.0.1:5678:5678"` | Port-Binding auf VPS geändert. Verifiziert: `curl http://YOUR_SERVER_IP:5678` → Connection refused | ✅ Gefixt |
| BUG FIX #19 | MODEL_SONNET/MODEL_HAIKU fehlten in .env | Variablen nicht angelegt | In .env ergänzt + in docker-compose.yml durchgereicht | ✅ Gefixt |
| BUG FIX #20 | Credential ID fest verdrahtet in Workflow-JSONs | Alte Credential-ID hardcodiert, nach Neuanlage nicht mehr gültig | In allen 3 Workflows: Credential-Dropdown neu auswählen → n8n schreibt neue ID | ✅ Gefixt |
| BUG FIX #21 | HTTP Body Type falsch (JSON statt Raw) | n8n verarbeitet/validiert JSON-Body-Typ, zerstört dynamische Expressions → Anthropic bekommt kein valides JSON | Alle 3 Anthropic Nodes: Body Content Type JSON → **Raw**, Content Type: `application/json` | ✅ Gefixt |
| BUG FIX #22 | Doppeltes Body-Feld im Validator | Beim Wechsel JSON→Raw blieb altes Body-Feld stehen | Altes Body-Feld manuell gelöscht, nur ein Body mit `{{ $json.payload }}` | ✅ Gefixt |
| BUG FIX #23 | Field-Namen Mismatch CFO↔Validator | CFO sendet `agent_response`/`original_question`, Validator erwartet `recommendation`/`question` | Doppelter Fallback: `input.agent_response \|\| input.recommendation` | ✅ Gefixt |
| BUG FIX #24 | Validator max_tokens zu niedrig (2048) | Tax Architect gibt bis 4096 Tokens zurück → Validator-Antwort abgeschnitten → JSON-Parse fehlschlägt | max_tokens: 2048 → 4096 → **8192** (BUG #36: 4096 reicht bei ~4675 Input-Tokens nicht) | ✅ Gefixt |
| BUG FIX #25 | Validator JSON Parse zu fragil (Regex) | Regex `/\{[\s\S]*\}/` versagt bei §-Zeichen, verschachtelten Strings | Robusteres Parsing: `indexOf('{')`/`lastIndexOf('}')` + Markdown-Backtick-Cleaning | ✅ Gefixt |
| BUG FIX #26 | Response Assembly kennt Validator-Output-Format nicht | Validator gibt `overall_assessment` zurück, Assembly sucht `validated_response`/`response` | Fallback-Kette: `validated_response \|\| response \|\| overall_assessment` | ✅ Gefixt |
| BUG FIX #27 | Nginx Timeout zu niedrig (60s Default) | Tax Architect + Validator = 60-90s → 504 Gateway Timeout | `proxy_read_timeout 120s` → später auf **300s** erhöht (BUG #31, >120s nötig) | ✅ Gefixt |
| BUG FIX #28 | Execute Command Node nicht sichtbar in n8n 2.0+ | n8n 2.0 deaktiviert den Node aus Sicherheitsgründen | `NODES_EXCLUDE=[]` in docker-compose.yml environment ergänzt | ✅ Gefixt |
| BUG FIX #29 | Node-Name Mismatch: `$('API Cost Check')` → "Referenced node doesn't exist" | Supabase Node hatte Standard-Namen, Code referenzierte benutzerdefinierten Namen | Node in n8n auf exakten Namen "API Cost Check" umbenannt. REGEL: `$('NodeName')` Referenzen IMMER gegen tatsächliche Node-Namen prüfen | ✅ Gefixt |
| BUG FIX #30 | Telegram "chat not found" (400 Error) | `TELEGRAM_CHAT_ID` nicht in .env → `{{ $env.TELEGRAM_CHAT_ID }}` löste zu leer auf | Chat ID über getUpdates ermittelt und in .env + docker-compose.yml eingetragen | ✅ Gefixt |

**Sprint 2.1 Bug Fixes (während Validator & Tax Architect Integration):**

| # | Bug | Root Cause | Fix | Status |
|---|-----|-----------|-----|--------|
| BUG FIX #31 | Nginx Timeout immer noch zu niedrig (120s → 504) | Tax Architect + Validator brauchen zusammen >2 Minuten | `proxy_read_timeout 300s` + `proxy_send_timeout 300s` in nginx.conf | ✅ Gefixt |
| BUG FIX #32 | "Execute Sub-Workflow" Node veraltet (Tax Architect) | Node "out of date", keine Workflow Inputs konfiguriert → Tax Architect bekam keine Daten | Node löschen, neu als "Execute Workflow": Source=Database, Workflow=By ID, Mode=Run once with all items, Wait=AN, Inputs: question={{ $json.user_message }} | ✅ Gefixt |
| BUG FIX #33 | "Workflow Input" Node veraltet (Sub-Workflows) | Veralteter Trigger-Node → Daten kamen nicht korrekt an | Ersetzen durch "When Executed by Another Workflow" → "Accept all data" | ✅ Gefixt |
| BUG FIX #34 | Feldname-Mismatch: question vs. user_message | CFO übergibt `user_message`, Tax Architect liest `question` → "Keine Frage übergeben" | Doppelter Fallback: `input.question \|\| input.user_message \|\| 'Keine Frage übergeben'`, context: `input.context \|\| input.chat_history \|\| {}` | ✅ Gefixt |
| BUG FIX #35 | Tax Architect max_tokens zu niedrig (4096) + JSON-Parse auf Fließtext | Output abgeschnitten. Tax Architect gibt Markdown/Fließtext zurück, kein JSON → Parse-Node versuchte JSON zu parsen → Fallback mit substring(0, 500) | max_tokens: **8192**. Parse-Node: Kein JSON-Parse mehr, Fließtext direkt als agent_response durchreichen. Confidence aus Emoji extrahieren (🟢/🟡/🔴) | ✅ Gefixt |
| BUG FIX #36 | Validator max_tokens zu niedrig (4200) | Bei ~4675 Input-Tokens kaum Raum für Output → leere Arrays in checked_claims, stress_test | max_tokens: **8192** im "Build Validator Request" Node | ✅ Gefixt |
| BUG FIX #37 | CFO Routing Parse: Regex statt indexOf | `rawContent.match(/\{[\s\S]*\}/)` schlägt bei komplexen Antworten fehl → Fallback auf Tax Architect ohne echtes Routing | `indexOf('{')`/`lastIndexOf('}')` + `JSON.parse(contentText.slice(start, end + 1))` | ✅ Gefixt |
| BUG FIX #38 | Response Assembly: Node-Name falsch | Code referenzierte `$('Tax Architect ausführen')` — Node heißt aber `Call 'Tax Architect (Sub-Workflow)'` | Node-Referenz auf exakten Namen angepasst | ✅ Gefixt |
| BUG FIX #39 | Validator Parse: Truncating auf 500 Zeichen | Im Fallback: `overall_assessment: rawContent.substring(0, 500)` → Response abgeschnitten | `substring(0, 500)` entfernt — vollständiger Text wird durchgereicht | ✅ Gefixt |
| BUG FIX #40 | Kern-Prompts: Generiert statt aus knowledge_base | Alle 3 System Prompts (CFO, Tax Architect, Validator) waren von Claude selbst generiert — nicht die finalen Versionen aus `knowledge_base/core-prompts/` | Alle 3 Prompts manuell durch finale Versionen aus `.md` Dateien ersetzt. **Neue Arbeitsregel:** Wenn Blueprint auf bestehende Datei verweist → IMMER erst fragen ob Inhalt vorliegt, NIEMALS selbst generieren | ✅ Gefixt |

**Code-Audit Fixes (Post-Bug-Fixes, vor Sprint 2):**

| # | Problem | Stelle | Fix | Schwere |
|---|---------|--------|-----|---------|
| Audit-1 | `body.message` ohne Optional Chaining → TypeError wenn body null | Telegram Parse Message Node | `body?.message \|\| body?.edited_message` | MITTEL |
| Audit-2 | Telegram URL `{TELEGRAM_BOT_TOKEN}` — keine n8n Expression | sendTelegram Helper | `{{ $env.TELEGRAM_BOT_TOKEN }}` statt `{TELEGRAM_BOT_TOKEN}` | MITTEL |
| Audit-3 | 6 Env-Variablen in Workflows genutzt aber NICHT in docker-compose durchgereicht | docker-compose.yml Referenz | ANTHROPIC_API_KEY, TAVILY_API_KEY, VOYAGE_API_KEY, TELEGRAM_BOT_TOKEN, TELEGRAM_SECRET_TOKEN, TELEGRAM_ALLOWED_CHAT_ID ergänzt | KRITISCH |
| Audit-4 | ECB Parse: `sortedKeys[length - 2]` crasht bei <2 Datenpunkten | ECB Code Node | Length-Guard mit Early Return ergänzt | NIEDRIG |
| Audit-5 | EZB Meeting-Kalender: `undefined` wenn alle Termine vorbei | EZB Meeting Code Node | Fallback-String statt `undefined` | NIEDRIG |
| Audit-6 | COUNTRY_CODE in GDELT-URL ohne Input-Validierung | OSINT-Datenquellen Schicht A | Validierungshinweis: nur `/^[A-Z]{2}$/` zulassen | NIEDRIG |

**Auswirkungen auf folgende Sprints:**
- **Sprint 2.1 (Validator):** BUG #14 betrifft auch den Validator-Workflow → gleiche Header-Auth-Konfiguration verwenden
- **Sprint 2.2 (Chat Memory):** BUG #16 betrifft alle Supabase-Lese-Nodes → "Always Output Data" Pattern in allen neuen Nodes anwenden
- ~~**Sprint 2 Start:** BUG #18 (Port 5678) muss zu Beginn von Sprint 2 gefixt werden~~ ✅ Erledigt
- **Sprint 4+ (Neue Agenten):** BUG #14 (x-api-key) + BUG #16 (leeres Array) + BUG #17 (env durchreichen) gelten für ALLE zukünftigen Workflows
- **Sprint 4+ (Anthropic HTTP Nodes):** BUG #20 (Credential-Dropdown neu auswählen) + BUG #21 (Body Type = Raw, NICHT JSON) bei jedem neuen Anthropic API Call Node beachten
- **Sprint 4+ (Sub-Workflow-Interfaces):** BUG #23 (Feldnamen-Mismatch) → Interface-Vertrag zwischen CFO und Sub-Workflows dokumentieren und einhalten. Doppelte Fallbacks als Sicherheitsnetz.
- **Sprint 4+ (Token-Limits):** BUG #24/#35/#36 → max_tokens für jeden neuen Agenten an dessen erwartete Antwortlänge anpassen. Minimum **8192** für komplexe Analysen. NICHT pauschal 2048 oder 4096
- **Sprint 4+ (JSON-Parsing):** BUG #25/#37 → In allen Parse-Nodes `indexOf/lastIndexOf` statt Regex für JSON-Extraktion verwenden. Gilt auch für CFO Routing Node!
- **Allgemein:** Neue Umgebungsvariablen IMMER an zwei Stellen eintragen: .env UND docker-compose.yml
- **Infrastruktur:** BUG #27/#31 → Nginx-Timeout auf **300s** gesetzt. Bei Hinzufügen weiterer sequentieller Agent-Calls ggf. weiter erhöhen
- **n8n 2.0+ Nodes:** BUG #28/#32/#33 → Execute Command Node erfordert `NODES_EXCLUDE=[]`. "Execute Sub-Workflow" und "Workflow Input" Nodes sind veraltet → stattdessen "Execute Workflow" und "When Executed by Another Workflow" verwenden
- **Code Node `$('...')` Referenzen:** BUG #29/#38 → Node-Namen in Code IMMER gegen tatsächliche Node-Benennung in n8n verifizieren. Tippfehler oder Standard-Namen führen zu "Referenced node doesn't exist"
- **Neue $env.X Variablen:** BUG #30 → Auch `TELEGRAM_CHAT_ID` muss in .env UND docker-compose.yml stehen
- **Feldnamen-Fallbacks:** BUG #34 → In ALLEN Sub-Workflows doppelte Fallbacks für Input-Feldnamen: `input.question || input.user_message`, `input.context || input.chat_history`
- **Token-Limits (erweitert):** BUG #35/#36 → max_tokens für Tax Architect UND Validator = **8192**. Nicht 4096 — bei komplexen Inputs bleibt sonst kein Raum für Output
- **Tax Architect Output:** BUG #35 → Tax Architect gibt Fließtext zurück, KEIN JSON. Parse-Node darf NICHT JSON-parsen. Confidence aus Emoji (🟢/🟡/🔴) extrahieren
- **Parse-Fallbacks:** BUG #39 → NIEMALS `substring(0, N)` in Fallbacks verwenden — vollständigen Text durchreichen
- **Kern-Prompts:** BUG #40 → System Prompts IMMER aus `knowledge_base/core-prompts/` laden. Wenn Blueprint auf bestehende Datei verweist → IMMER erst fragen ob Inhalt vorliegt, NIEMALS selbst generieren

---

### SPRINT 2: Quality Layer + Memory (Woche 3-4)
**Ziel:** Antworten werden validiert UND stress-getestet (Validator mit integriertem Devil's Advocate), Chat History wird gespeichert und abrufbar.

> ✅ **SPRINT 2 VORAUSSETZUNG — BUG FIX #18 (Port 5678): ERLEDIGT**
> Port-Binding auf VPS auf `"127.0.0.1:5678:5678"` geändert.
> Verifiziert: `curl http://YOUR_SERVER_IP:5678` → Connection refused.

#### 2.1 — Validator & Stress-Tester Sub-Workflow (ehem. Validator + Devil's Advocate)

> **Architektur-Änderung:** Der Devil's Advocate wurde in den Validator
> integriert. Statt 2 separater LLM-Calls (Validator + DA) gibt es jetzt
> 1 Call der beides abdeckt: Faktenprüfung + Risiko-Analyse.
> Kern-Prompt: `knowledge_base/core-prompts/agent-09-validator.md`
> Zusätzliche RAG-Chunks: `quality/validierungs-checkliste.md` + `quality/devils-advocate-angriffsvektoren.md`

**Claude Code Prompt:**
```
Erstelle einen n8n Sub-Workflow "Validator & Stress-Tester" mit folgender Logik:

- Input: Agent-Empfehlung (JSON) + User-Frage + RAG-Chunks die der
  Fachagent erhalten hat
- Node 1: AI Agent Node (Claude Sonnet 4.6)
  ⚠️ Sprint 1 Bug Fixes beachten (alle betreffen diesen Node):
  - BUG FIX #14: x-api-key Header, NICHT Bearer
  - BUG FIX #21: Body Content Type = Raw (NICHT JSON!)
  - BUG FIX #23: Input-Felder mit Fallback lesen (agent_response || recommendation)
  - BUG FIX #24/#36: max_tokens = 8192 (nicht 4096/2048)
  - BUG FIX #25: JSON-Parse via indexOf/lastIndexOf, NICHT Regex
  System Prompt: Validator & Stress-Tester Kern-Prompt
  [AUS knowledge_base/core-prompts/agent-09-validator.md]
  ⚠️ BUG FIX #40: System Prompts IMMER aus knowledge_base/core-prompts/ laden,
  NIEMALS selbst generieren! Wenn Blueprint auf bestehende Datei verweist →
  IMMER erst fragen ob Inhalt vorliegt.
  Zusätzlicher Context: Validierungs-Checkliste + DA-Angriffsvektoren
  [AUS knowledge_base/quality/]
  Input: Empfehlung + Context
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
- Bei einfachen Fragen: überspringen (spart 1 Sonnet-Call)

Erstelle auch die bedingte Logik (IF-Node) für diese Entscheidung.
```

#### 2.2 — Chat Memory + Episodic Retrieval

**Claude Code Prompt:**
```
Erweitere den CFO Orchestrator Workflow um ein vollständiges Memory-System:

WORKING MEMORY (bereits vorhanden):
- Letzte 10 Messages aus chat_history für aktuelle session_id

EPISODIC MEMORY (neu):
- Bei jeder neuen Anfrage: Erstelle ein Embedding der User-Nachricht 
  (Voyage AI voyage-4-lite via HTTP Request)
- Suche in chat_history nach den 3 ähnlichsten vergangenen Konversationen 
  (Cosine Similarity via pgvector)
- Füge relevante vergangene Konversationen zum Context hinzu

FIX #7 — VORAUSSETZUNG: Die chat_history Tabelle braucht eine
embedding-Spalte. Diese ist im Haupt-Schema (Sprint 1.2) nicht enthalten
und wird durch das Additions-Script hinzugefügt. Vor Sprint 2.2 muss
in Supabase SQL Editor ausgeführt worden sein:

  ALTER TABLE chat_history
    ADD COLUMN IF NOT EXISTS embedding vector(1024),
    ADD COLUMN IF NOT EXISTS embedding_model TEXT DEFAULT 'voyage-4-lite';

  CREATE INDEX IF NOT EXISTS idx_chat_history_embedding
    ON chat_history USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);

Das Script 01_schema_additions_and_fixes.sql (aus dem Fix-Paket) erledigt das.

Erstelle:
1. Einen n8n-Node der das Embedding generiert (HTTP Request zu Voyage AI API)
   Endpunkt: POST https://api.voyageai.com/v1/embeddings
   Body: {"input": ["User-Nachricht"], "model": "voyage-4-lite", "input_type": "query"}
   Header: Authorization: Bearer VOYAGE_API_KEY
2. Einen n8n-Node der die Similarity Search in Supabase ausführt
   ⚠️ BUG FIX #16 beachten: Node Settings → "Always Output Data" = AN,
   und im nachfolgenden Code Node $input.all() statt .first() verwenden!
   (Bei neuen Usern gibt es noch keine Embeddings → leeres Array)
3. Die Supabase SQL-Funktion match_chat_history(embedding, threshold, limit)
   (bereits im Additions-Script enthalten)
4. Die Integration in den Context Assembly Schritt des CFO Workflows

Für die Embeddings brauche ich auch:
- Einen separaten Workflow der nach jeder Konversation den Chat-Eintrag 
  mit Embedding in chat_history speichert
  (Embedding-Modell für Dokumente: voyage-4-lite mit input_type: "document")
```

#### 2.3 — Agent Logging + Kosten-Tracking

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
- tokens_in und tokens_out (aus der Anthropic API Response: usage.input_tokens, usage.output_tokens)
- cost_eur (berechnet mit modellspezifischem Pricing in USD, dann × EUR/USD-Kurs):

  ```javascript
  // BUG FIX: Preise für claude-haiku-4-5 waren falsch (0.25$/1.25$ = Haiku 3).
  // Aktuelle Preise Stand 2025 — vor Sprint-Start in Anthropic Console verifizieren.
  const PRICING_USD = {
    'claude-haiku-4-5-20251001': { input: 0.80 / 1_000_000, output: 4.00 / 1_000_000 },
    'claude-sonnet-4-6':         { input: 3.00 / 1_000_000, output: 15.00 / 1_000_000 },
  };
  const EUR_USD = 1.08; // aus fx_rates Tabelle lesen oder fest hinterlegen
  const model = agentLog.model; // aus dem Agent-Log-Eintrag lesen
  const p = PRICING_USD[model] || PRICING_USD['claude-sonnet-4-6'];
  const cost_eur = ((tokens_in * p.input) + (tokens_out * p.output)) / EUR_USD;
  ```
- execution_time_ms

Erstelle auch einen einfachen Kosten-Aggregations-View in Supabase:
SELECT 
  DATE_TRUNC('month', created_at) as month,
  SUM(cost_eur) as total_cost,
  COUNT(*) as total_calls,
  SUM(tokens_in + tokens_out) as total_tokens
FROM agent_logs
GROUP BY 1
ORDER BY 1 DESC;
```

**Ergebnis Sprint 2:** Antworten werden geprüft, Risiken bewertet, alle Konversationen gespeichert, Kosten getrackt.

---

### SPRINT 3: RAG + Knowledge Base (Woche 5-6)
**Ziel:** Agenten zitieren echte Gesetzestexte statt zu halluzinieren.

#### 3.1 — Embedding-Pipeline aufbauen

**Claude Code Prompt:**
```
Baue eine Embedding-Pipeline die Dokumente in die Supabase 
knowledge_base Tabelle lädt. Ich brauche:

1. Ein Python-Script (ingest_documents.py) das:
   - PDF-Dateien einliest (pypdf oder pdfplumber)
     # L3 FIX: PyPDF2 ist seit 2022 unmaintained — pypdf verwenden
     # pip install pypdf pdfplumber
   - Den Text in Chunks von ~500 Tokens aufteilt 
     (mit 50 Token Overlap)
   - Für jeden Chunk ein Embedding generiert 
     (Voyage AI voyage-4-lite, input_type: "document")
   - Den Chunk + Embedding + Metadaten in Supabase speichert
   
   Voyage AI API Call:
   POST https://api.voyageai.com/v1/embeddings
   Headers: Authorization: Bearer $VOYAGE_API_KEY
   Body: {"input": ["chunk text"], "model": "voyage-4-lite", "input_type": "document"}
   
   HINWEIS: voyage-4-lite gibt 1024-dimensionale Vektoren zurück.
   Die knowledge_base Tabelle verwendet vector(1024).

   Input-Parameter:
   - --file: Pfad zur PDF-Datei
   - --bereich: Wissensbereich (tax, immobilien, corporate, etc.) → Spalte 'bereich'
   - --source_type: law, dba, bfh_ruling, program_guide, article → Spalte 'source_type'
   - --source_name: z.B. "§2 AStG" oder "DBA DE-UAE" → Spalte 'source_name'

   HINWEIS Schema: Das Script speichert PDFs in dieselbe knowledge_base Tabelle
   wie die MD-Chunks. chunk_id wird auto-generiert aus Dateiname + Chunk-Index
   (z.B. "astg/§2-chunk-003"), title aus source_name + Chunk-Nummer,
   relevante_agenten aus --bereich (Mapping: tax → ["Tax Architect", "CFO"] etc.).

2. Ein Batch-Script (ingest_all.sh) das eine Liste von Dokumenten 
   nacheinander verarbeitet

3. Eine Anleitung wo ich die relevanten Gesetzestexte als PDF 
   herunterladen kann:
   - AStG (Volltext)
   - Relevante EStG-Paragraphen (§7, §21, §23, §32d, §49)
   - DBA Deutschland-UAE
   - DBA Deutschland-Zypern
   - DBA Deutschland-Portugal
   - DBA Deutschland-Malta
   - DBA Deutschland-Estland

Wichtig: Das Script muss Rate Limiting beachten (max 300 RPM 
bei Voyage AI Free Tier) und Fortschritt anzeigen.
Voyage AI Free Tier: Erste 200 Millionen Tokens kostenlos — 
mehr als ausreichend für den gesamten KB-Aufbau.
```

#### 3.2 — RAG-Tool in n8n integrieren

**Claude Code Prompt:**
```
Erstelle ein wiederverwendbares RAG-Tool als n8n Sub-Workflow:

Input: {query: "...", agent: "tax", top_k: 5, threshold: 0.7}

Schritte:
1. Embedding der Query generieren (Voyage AI API, model: voyage-4-lite, input_type: "query")
2. Supabase RPC Call: match_knowledge(embedding, threshold, top_k, bereiche)
   Signatur: match_knowledge(query_embedding, match_threshold, match_count, filter_bereiche)
   Beispiel Tax Architect: filter_bereiche = '{tax,shared}'
   Beispiel Wealth Manager: filter_bereiche = '{wealth,shared}'
   ⚠️ Immer BEIDE Bereiche: Fachbereich + 'shared' (Mandantenprofil ist immer relevant)
   Vollständiges Bereichs-Mapping: knowledge_base/RAG-INTEGRATION.md → Abschnitt 3
3. Ergebnisse formatieren als Context-String:
   "RELEVANTE RECHTSGRUNDLAGEN:\n[Source 1]: Content...\n[Source 2]: ..."
4. Return: Formatierter Context-String

Dieser Sub-Workflow wird von JEDEM Spezialisten-Agent aufgerufen 
bevor der LLM-Call stattfindet.

Zeige mir auch wie ich den RAG-Context in den AI Agent Node 
des Tax Architect einbaue (als Teil des User-Prompts oder als 
Tool-Ergebnis).
```

**Ergebnis Sprint 3:** Wenn du fragst "Was passiert mit meiner AfA nach Wegzug?", zitiert der Agent §49 Abs. 1 Nr. 6 EStG aus der tatsächlichen Knowledge Base.

---

### SPRINT 4: Alle Agenten aufbauen (Woche 7-10)
**Ziel:** Alle 8 Kern-Agenten + 2 QA-Agenten sind als Sub-Workflows implementiert.

> ⚠️ **PFLICHT-CHECKLISTE für JEDEN neuen Agenten-Workflow (aus Sprint 1 Bug Fixes):**
> - [ ] Anthropic Auth: `x-api-key` Header (BUG #14), NICHT `Authorization: Bearer`
> - [ ] HTTP Body Type: **Raw** + `application/json` (BUG #21), NICHT JSON-Typ
> - [ ] Credential-Dropdown nach Import/Neuanlage aktiv neu auswählen (BUG #20)
> - [ ] max_tokens an Agent-Komplexität anpassen, mind. **8192** (BUG #24/#35/#36)
> - [ ] Supabase Lese-Nodes: "Always Output Data" = AN (BUG #16)
> - [ ] JSON-Parse: `indexOf/lastIndexOf` statt Regex (BUG #25/#37)
> - [ ] Input-Felder: Doppelte Fallbacks für Feldnamen: question/user_message, context/chat_history (BUG #23/#34)
> - [ ] Neue Env-Variablen an beiden Stellen eintragen: .env + docker-compose.yml (BUG #17)
> - [ ] Nginx-Timeout prüfen wenn Agent-Chain länger als 300s werden könnte (BUG #27/#31)
> - [ ] Node-Typ: "Execute Workflow" (nicht "Execute Sub-Workflow") + "When Executed by Another Workflow" (nicht "Workflow Input") (BUG #32/#33)
> - [ ] Parse-Fallbacks: KEIN substring(0, N) — vollständigen Text durchreichen (BUG #39)
> - [ ] System Prompts aus `knowledge_base/core-prompts/` laden, NICHT selbst generieren (BUG #40)
> - [ ] `$('NodeName')` Referenzen gegen aktuelle Node-Namen in n8n verifizieren (BUG #29/#38)
> - [ ] `$('NodeName')` Referenzen in Code gegen tatsächliche Node-Namen prüfen (BUG #29)
> - [ ] Execute Command Nodes brauchen `NODES_EXCLUDE=[]` (BUG #28)

#### 4.1 — Agenten nacheinander aufbauen

Für jeden Agent den gleichen Prozess wiederholen. Beginne mit den wichtigsten:

**Reihenfolge:**
1. ✅ Tax Architect (Sprint 1 erledigt)
2. Immobilien-Spezialist
3. Corporate Structure Agent
4. Wealth Manager
5. Immigration Agent
6. Insurance Agent
7. Relocation Agent

**Claude Code Prompt (Vorlage, für jeden Agent anpassen):**
```
Erstelle einen n8n Sub-Workflow für den Agenten 
"[AGENT-NAME]" nach folgendem Muster:

Input: {question, context, session_id}

Schritte:
1. RAG Query (Sub-Workflow "RAG Tool" mit agent="[AGENT-ID]")
2. AI Agent Node:
   - Modell: [Claude Sonnet 4.6 ODER Haiku 4.5 — siehe Modell-Routing]
   - System Prompt: [VOLLSTÄNDIGEN PROMPT AUS AGENT-TEAM-DOKUMENT EINFÜGEN]
   - Tools: AGENTEN-SPEZIFISCH (siehe unten)
   - Output: Strukturiertes JSON

Output: {empfehlung, optionen, confidence, affects, sources, 
escalation_needed, escalation_reason}

AGENTEN-SPEZIFISCHE TOOLS:

Tax Architect:
  - Web Search (Tavily)
  - Steuerrechner (Code Node: ESt-Tarif, GewSt, KSt, Soli, SV, 
    Exit Tax §6 AStG)
  - Wechselkurs-API (ExchangeRate: open.er-api.com/v6/latest/EUR)
  - DB Query READ: properties, budget, portfolio_holdings, 
    portfolio_lots (Krypto-Haltefristen), target_countries, fx_rates,
    macro_indicators (neuester Eintrag):
    → gold_price_eur + gold_trend: für §23 EStG Haltefrist-Bewertung
      bei Gold-Assets und Timing-Empfehlung (Verkauf vor/nach 12 Monaten)
    → ecb_deposit_rate: für Timing-Analyse Schuldenabbau vs. risikofreie Anlage
      (Wenn EZB-Zins > Kreditzins: Anlage sinnvoller als Sondertilgung)

Immobilien-Spezialist:
  - Web Search (Tavily)
  - Cashflow-Simulator (Code Node: 15-Jahres-Modell mit:
    Annuitätenberechnung (Zins + Tilgung separat!), AfA, 
    Mietsteigerung, Instandhaltung, Steuervorteil, 
    Equity-Aufbau durch Tilgung, Wertsteigerung — 
    4 Strukturvarianten parallel: Privat/vGmbH/GbR/Stiftung.
    Output unterscheidet: Cashflow vor Steuer, Cashflow nach 
    Tilgung, und Vermögenszuwachs = Tilgung + Cashflow)
  - Finanzierungs-/AfA-Rechner (Code Node: Annuität mit 
    Zins/Tilgungs-Split, Restschuld nach X Jahren, 
    AfA-Rest, Ehegattenschaukel-Reset, Anschlussfinanzierung)
  - DB Query READ: properties, property_valuations (historische 
    qm-Preise + Wertentwicklung), budget, decisions,
    macro_indicators (neuester Eintrag):
    → ecb_deposit_rate + ecb_main_rate: Benchmark für Kreditkonditionen,
      Anschlussfinanzierungs-Timing, Zinsbindungs-Strategie
    → ecb_rate_changed + ecb_change_basis_points: Sofortige Warnung
      wenn EZB-Zins steigt und Zinsbindungsende < 24 Monate
    → ecb_next_meeting_date: In Finanzierungsempfehlungen aufnehmen
      ("Vor der EZB-Sitzung am {datum} entscheiden")

Corporate Structure:
  - Web Search (Tavily)
  - DB Query READ: jurisdiction_costs, target_countries, decisions
  - Calculator (Code Node: Gründungskosten-Vergleich, Transfer 
    Pricing Arm's-Length-Berechnung)

Immigration:
  - Web Search (Tavily)
  - 183-Tage-Rechner (Code Node: Verschiedene Zählmethoden pro Land)
  - DB Query READ: residence_tracker, target_countries, 
    passport_rankings, calendar_events

Wealth Manager:
  - Web Search (Tavily)
  - Monte-Carlo-Simulator (Code Node: 1000 Simulationen, 
    inflationsbereinigt, mit Entnahme-Szenario)
  - Stress-Test-Simulator (Code Node: Wendet historische 
    Krisen-Drawdowns auf aktuelles Portfolio an. Input: 
    Portfolio-Daten + Szenario-ID. Output: Vermögensverlust 
    absolut/prozentual, Max Drawdown, Recovery-Dauer.
    Szenarien: 2008 Finanzkrise, COVID 2020, Krypto-Winter 2022, 
    Zinswende 2022, Stagflation 1970er, Custom)
  - Korrelations-Checker (Code Node: Berechnet Klumpenrisiko 
    über 5 Dimensionen — Währung, Geografie, Asset-Klasse, 
    Liquidität, Einkommens-Korrelation. Input: Alle Holdings + 
    Properties. Output: Diversifikations-Score 1-10, Warnungen)
  - FIRE-Rechner (Code Node: Jahre bis FI, Coast FIRE, 
    benötigte Sparrate)
  - Kurshistorien (Yahoo Finance API: historische Preise 
    für Performance- und Risiko-Berechnung)
  - Wechselkurs-API (ExchangeRate-API)
  - DB Query READ: portfolio_holdings, portfolio_lots, 
    wealth_snapshots, budget, fx_rates, properties (für 
    Gesamt-Exposure inkl. Immobilien),
    country_stability (Geopolitik als Portfolio-Faktor!),
    macro_indicators (neuester Eintrag + letzte 12 Einträge für Trendanalyse):
    → gold_price_eur + gold_trend + gold_change_3m:
      Safe-Haven-Anteil im Portfolio bewerten,
      Inflationsschutz quantifizieren (reale Rendite = nominale - Inflation),
      Stress-Test: Gold-Korrelation zu Aktien in Krisenszenarien
    → ecb_deposit_rate + Verlauf:
      Safe Withdrawal Rate kalibrieren (historisch: 4% bei ~2% Zinsen),
      Monte-Carlo-Renditeannahmen anpassen,
      Anleihen-Attraktivität bewerten (Zinsen > 3% → Anleihen relevant)

Insurance:
  - Web Search (Tavily)
  - Coverage-Gap-Checker (Code Node: Aktuelle Policen vs. 
    Pflichtversicherungen im Zielland)
  - DB Query READ: insurance_coverage, target_countries, properties

Relocation:
  - Web Search (Tavily)
  - DB Query READ: target_countries, city_cost_of_living, 
    calendar_events, residence_tracker
  - Zeitzonen-Rechner (Code Node: UTC Offset, Überlappung mit CET)

Validator & Stress-Tester (Stress-Test-Anteil, zusätzlich zu Web Search):
  - DB Query READ: country_stability, monthly_scan_results
    (OSINT-Daten als Faktengrundlage für Risikobewertung),
    fx_rates (Währungstrends),
    macro_indicators (neuester Eintrag):
    → gold_trend = 'steigend' + ecb_rate_changed = TRUE (Zinssenkung):
      Klassisches Krisenmuster — in Risikoanalyse priorisieren
    → ecb_deposit_rate hoch + properties mit Zinsbindungsende:
      Zinswende-Risiko explizit als Showstopper flaggen
    → gold_change_3m > +15%: Safe-Haven-Flucht — Geopolitik prüfen

Quarterly Quality Check (ehem. Performance Manager):
  - DB Query READ: agent_logs, user_feedback, coverage_gaps, knowledge_chunks
  - Kein LLM-Call — nur Datensammlung + Telegram-Report

Modell-Routing-Tabelle (FIX #12 — exakte API-Strings für März 2026):

> **Architektur-Änderung:** 9 statt 11 Agenten. Devil's Advocate in
> Validator integriert. Performance Manager durch Quarterly Check ersetzt.

| Agent                      | Modell-API-String              | Begründung |
|----------------------------|-------------------------------|------------|
| Tax Architect              | claude-sonnet-4-6             | Komplexe Rechtsanalyse, Zahlenbeispiele |
| Immobilien-Spezialist      | claude-sonnet-4-6             | Multi-Varianten-Vergleich, 15J-Modellierung |
| Corporate Structure        | claude-sonnet-4-6             | Strukturen, Transfer Pricing, Substanz |
| Wealth Manager             | claude-sonnet-4-6             | Stress-Tests, Korrelationsanalyse |
| Immigration                | claude-haiku-4-5-20251001     | Faktenwissen, gut definierte Regeln |
| Insurance                  | claude-haiku-4-5-20251001     | Strukturierte Coverage-Analyse |
| Relocation                 | claude-haiku-4-5-20251001     | Faktenwissen, Scoring-Matrix |
| Validator & Stress-Tester  | claude-sonnet-4-6             | Faktenprüfung + Risikobewertung (ehem. Validator + DA kombiniert) |
| CFO (Routing)        | claude-haiku-4-5-20251001     | Intent Classification, einfaches Routing |

HINWEIS: Diese Strings direkt in die Anthropic API HTTP Request Nodes
eintragen (Feld "model"). Als n8n-Umgebungsvariablen zentral verwalten:
  MODEL_SONNET=claude-sonnet-4-6
  MODEL_HAIKU=claude-haiku-4-5-20251001

⚠️ BUG FIX #14 — Anthropic API Authentication (KRITISCH):
Die Anthropic API nutzt NICHT das übliche "Authorization: Bearer" Schema!
FALSCH: Authorization: Bearer YOUR_ANTHROPIC_KEY
RICHTIG: x-api-key: YOUR_ANTHROPIC_KEY

In n8n HTTP Request Nodes für Anthropic:
  - Authentication: Generic Credential Type → Header Auth
  - Header Name: x-api-key
  - Header Value: {{$env.ANTHROPIC_API_KEY}} (KEIN "Bearer" Prefix!)
  - Zusätzlicher Header: anthropic-version: 2023-06-01

⚠️ BUG FIX #20 — Credential-ID nach Neuanlage (KRITISCH):
Workflow-JSONs enthalten die Credential-ID als festen Wert.
Nach Löschen/Neuanlegen eines Credentials ist die alte ID ungültig!
FIX: In jedem Workflow den Credential-Dropdown einmal neu auswählen
→ n8n schreibt die aktuelle ID in den Workflow.
REGEL: Nach jedem Credential-Wechsel ALLE betroffenen Workflows prüfen!

⚠️ BUG FIX #21 — HTTP Body Type MUSS "Raw" sein (KRITISCH):
n8n's JSON Body Type verarbeitet/validiert den Body vor dem Senden.
Bei dynamischen Expressions ({{ $json.payload }}) zerstört das
die JSON-Struktur → Anthropic Error "model: Field required".
FIX: In ALLEN Anthropic API Call Nodes:
  - Body Content Type: Raw (NICHT JSON!)
  - Content Type: application/json
  - Body: {{ $json.payload }}
Bei "Raw" sendet n8n den String 1:1 ohne Manipulation.

Dies betrifft ALLE Workflow-JSONs die Anthropic API aufrufen:
  1. CFO Orchestrator (Intent Classification)
  2. Tax Architect (Sub-Workflow)
  3. Validator (Sub-Workflow)
  4. Alle zukünftigen Agenten-Workflows (Sprint 4+)
```

#### 4.2 — CFO Routing für alle Agenten erweitern

**Claude Code Prompt:**
```
Erweitere den CFO Orchestrator Workflow so, dass er basierend auf 
dem Intent Classification Ergebnis die richtigen Sub-Workflows 
aufruft:

agents_needed kann enthalten: tax, immo, corporate, immigration, 
wealth, insurance, relocation

Für jedes Element in agents_needed:
- Rufe den entsprechenden Sub-Workflow auf (Execute Workflow Node)
- Übergib: question + context + vorherige Agent-Ergebnisse
- Sammle alle Ergebnisse

Routing-Logik:
- "sequential": Agenten werden nacheinander aufgerufen, 
  jeder sieht die Ergebnisse der vorherigen
- "parallel": Agenten werden unabhängig aufgerufen 
  (z.B. bei Vergleichsfragen)

Erstelle die Switch/Router-Logik mit n8n IF-Nodes und 
Execute Workflow Nodes.
```

**Ergebnis Sprint 4:** Das volle 9-Agenten-System funktioniert.

---

### SPRINT 5: Dashboard + Telegram (Woche 11-12)
**Ziel:** Professionelles Dashboard und Telegram als primärer Input-Kanal.

#### 5.1 — Next.js Dashboard deployen

**Claude Code Prompt:**
```
Ich habe einen React-Dashboard-Prototyp (JSX-Datei mit Tailwind, 
Recharts, alle Daten als Mock). Bitte konvertiere diesen in ein 
vollständiges Next.js Projekt:

1. Next.js App Router Setup mit TypeScript
2. Supabase Client Integration (@supabase/supabase-js)
3. Ersetze alle Mock-Daten durch Supabase Queries:
   - KPIs: Berechne aus budget + wealth_snapshots Tabellen
   - Milestones: Lese aus milestones Tabelle
   - Properties: Lese aus properties Tabelle
   - Portfolio: Lese aus portfolio_holdings Tabelle
   - Calendar: Lese aus calendar_events Tabelle
   - Weekly Scan: Lese aus agent_logs + letzte monthly_scan_results
4. Realtime Subscription für Live-Updates (Supabase Realtime)
5. Deployment-Config für Vercel (vercel.json)
6. Environment Variables: NEXT_PUBLIC_SUPABASE_URL, 
   NEXT_PUBLIC_SUPABASE_ANON_KEY

Hier ist der aktuelle React-Prototyp:
[DASHBOARD-V2.JSX INHALT HIER EINFÜGEN]

Bitte erstelle die vollständige Ordnerstruktur und alle Dateien.
```

**Manuelle Schritte:**
- Vercel Account erstellen: https://vercel.com
- GitHub Repo erstellen und Code pushen
- Vercel mit GitHub verbinden, Auto-Deploy einrichten
- Environment Variables in Vercel setzen:
  ✅ NEXT_PUBLIC_SUPABASE_URL (öffentlich OK)
  ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY (öffentlich OK — RLS schützt)
  ❌ SUPABASE_SERVICE_ROLE_KEY → NICHT setzen! Dashboard braucht ihn nicht.
     Dieser Key gibt vollen DB-Zugang ohne RLS. Er gehört NUR in die 
     .env Datei auf dem VPS für n8n-Workflows.

**SICHERHEITS-CHECK nach Deployment:**
1. Vercel-URL öffnen → Rechtsklick → Seitenquelltext
2. Suche nach "service_role" → Darf NICHT vorkommen
3. Suche nach "eyJhb" → Nur der Anon Key darf erscheinen (1x)
4. Login-Seite testen → Ohne Login dürfen KEINE Daten sichtbar sein
5. vercel.json muss Security Headers enthalten (HSTS, X-Frame-Options, 
   X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
   → Siehe Security Architecture Dokument, Lücke 3

#### 5.2 — Telegram Integration

**Claude Code Prompt:**
```
Erstelle einen n8n Workflow für die Telegram Bot Integration.

VORAB EINMALIG (manuell, nicht automatisierbar):
1. Telegram öffnen → @BotFather → /newbot → Name vergeben → Token notieren
2. Starte eine Konversation mit deinem neuen Bot
3. Deine Chat-ID ermitteln:
   GET https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/getUpdates
   → chat.id aus der Antwort → in .env als TELEGRAM_ALLOWED_CHAT_ID eintragen
4. Webhook registrieren (einmalig nach VPS-Setup):
   POST https://api.telegram.org/bot{TOKEN}/setWebhook
   Body: {"url": "https://webhook.deinedomain.de/webhook/telegram",
          "secret_token": "{TELEGRAM_SECRET_TOKEN}"}

WORKFLOW: "Telegram Bot"

Node 1: Telegram Trigger (n8n nativer Node — einfachste Option)
  ODER: Webhook Trigger auf /webhook/telegram + manuelle Signatur-Prüfung
  Empfehlung: n8n Telegram Trigger Node (kein Nginx-Config-Aufwand)

  Sicherheit (wenn manueller Webhook):
  Header: X-Telegram-Bot-Api-Secret-Token muss dem TELEGRAM_SECRET_TOKEN entsprechen

  Node 1 im Telegram-Workflow: Secret Token Verifikation
  ```javascript
  // BUG FIX: n8n Code Nodes verwenden $env.X, NICHT process.env.X
  const headerToken = $input.first().headers['x-telegram-bot-api-secret-token'];
  if (!headerToken || headerToken !== $env.TELEGRAM_SECRET_TOKEN) {
    throw new Error('Invalid Telegram secret token — rejected');
  }
  ```

  Node 2: Absender-Verifikation (Chat-ID Whitelist)
  ```javascript
  const msg = $input.first().json?.body?.message;
  if (!msg || !msg.chat) {
    throw new Error('No message object — ignoring non-message event');
  }
  const chatId = String(msg.chat.id);
  const allowedId = $env.TELEGRAM_ALLOWED_CHAT_ID;
  if (chatId !== allowedId) {
    throw new Error(`Unauthorized chat_id: ${chatId}`);
  }
  ```

Node 2: Parse Message
  // BUG FIX: Null-Check — Telegram sendet auch callback_query, channel_post etc.
  // ohne message-Feld; ohne Guard crasht der Node mit TypeError
  const body = $input.first().body;
  const msg  = body?.message || body?.edited_message;
  if (!msg || !msg.chat) {
    // Kein antwortfähiges Event — still ignorieren
    return [];
  }
  const chatId = msg.chat.id.toString();
  const text   = msg.text || '';
  const msgId  = msg.message_id;

Node 3: Absender-Verifikation (Chat-ID Whitelist)
  // BUG FIX: $env statt process.env
  IF chatId !== $env.TELEGRAM_ALLOWED_CHAT_ID → ignorieren (kein Reply)

Node 4: Intent Detection (Claude Haiku)
  "Ist diese Nachricht ein Dateneintrag, eine Konfiguration oder eine Frage?"
  Beispiele Dateneintrag: "Gehalt 4200€", "Miete Bilk 850€"
  Beispiele Konfiguration: "Füge Singapur als Zielland hinzu", "Zeige meine Zielländer"
  Beispiele Frage: "Soll ich die Sondertilgung machen?"
  Output: {type: "data_entry" | "config" | "question", parsed_data: {...}}

- IF data_entry:
  - Node 5a: Parse Dateneintrag (Haiku): Kategorie, Betrag, Währung, Monat
  - Node 5b: Supabase Insert (budget oder portfolio_holdings)
  - Node 5c: Telegram Reply: "✅ Gehalt März verbucht: 4.200€. Sparquote: 43%"
    POST https://api.telegram.org/bot{TOKEN}/sendMessage
    Body: {chat_id: CHAT_ID, text: "...", reply_to_message_id: msgId}

- IF config:
  - Node 5d: Parse Konfiguration (Haiku): Aktion, Land, Rolle, Priorität
  - Supabase Update/Insert je nach Aktion
  - Telegram Reply mit Bestätigung

- IF question:
  - Node 6a: Execute Sub-Workflow "CFO Orchestrator"
  - Node 6b: Kürze Antwort für Telegram (Haiku, max 4096 Zeichen)
    Telegram unterstützt Markdown (parse_mode: "Markdown")
  - Node 6c: Telegram sendMessage
  - Node 6d: Falls Brief lang → zweite Nachricht: "📊 Details im Dashboard"
  - Node 6e: Nach 30s Delay: "War das hilfreich? 👍 oder 👎"

- IF feedback (Message == "👍" oder "👎"):
  - Supabase Insert user_feedback
  - IF 👎 → Follow-Up: "Was war das Problem?"
  - IF 👍 → "✅ Danke!"

HELPER-FUNKTION sendTelegram (für alle Workflows):
  POST https://api.telegram.org/bot{{ $env.TELEGRAM_BOT_TOKEN }}/sendMessage
  Headers: Content-Type: application/json
  Body: {
    chat_id: $env.TELEGRAM_ALLOWED_CHAT_ID,   // BUG FIX: $env statt process.env
    text: message,
    parse_mode: "Markdown"   // *fett*, _kursiv_, `code` unterstützt
  }

In .env ergänzen:
  TELEGRAM_BOT_TOKEN=DEIN_BOT_TOKEN      (von @BotFather, Format: 123456:ABC-DEF...)
  TELEGRAM_SECRET_TOKEN=ZUFAELLIGER_STRING  (selbst generiert, min. 32 Zeichen)
  TELEGRAM_ALLOWED_CHAT_ID=DEINE_CHAT_ID (aus getUpdates ermittelt)
```

**Manuelle Schritte:**
- @BotFather in Telegram → /newbot → Token notieren
- getUpdates aufrufen → Chat-ID ermitteln
- Webhook registrieren (nach VPS-Setup, einmalig)
- Token + Chat-ID in .env eintragen

**Ergebnis:** Telegram-Bot empfängt Fragen, Dateneingaben und Konfigurationen. Antwortet mit Markdown-Formatierung. Vorteil gegenüber alternativen Lösungen: kein Business-Account nötig, keine App-Überprüfung, keine 24h-Limits.

#### 5.3 — Proaktive Alerts via Telegram

**Claude Code Prompt:**
```
Erstelle einen n8n Utility-Workflow "Send Alert":

Dieser Workflow wird von anderen Workflows aufgerufen (via Execute 
Workflow) um proaktive Nachrichten an den User zu senden.

Input: {message: "...", urgency: "red|yellow|green", category: "..."}

Schritte:
1. Formatiere die Nachricht für Telegram:
   - 🔴 bei urgency "red" (z.B. "🔴 DRINGEND: ESt-Vorauszahlung 
     in 7 Tagen fällig!")
   - 🟡 bei urgency "yellow" (z.B. "🟡 HINWEIS: Spekulationsfrist 
     ETW Bilk endet in 6 Monaten")
   - 🟢 bei urgency "green" (z.B. "🟢 Weekly Scan: Keine 
     relevanten Änderungen")

2. Sende via Telegram Bot API (gleiche API wie der 
   Telegram Bot aus 5.2)

3. Logge den Alert in die agent_logs Tabelle

Dieser Workflow wird aufgerufen von:
- Weekly Scan (Scan-Ergebnisse + Fristen-Warnungen)
- Weekly Report (Wochenbericht-Zusammenfassung)
- Calendar Check (Deadlines die sich nähern)

Erstelle auch einen separaten Cron-Workflow "Weekly Deadline Check":
- Trigger: Cron (Montags, 08:00 CET)
- Supabase Query: calendar_events WHERE event_date 
  BETWEEN NOW() AND NOW() + 14 days AND status = 'upcoming'
- Für jeden Treffer: Execute "Send Alert" mit passender urgency
- Supabase Query: actions WHERE deadline < NOW() AND status != 'done'
- Für überfällige Actions: Execute "Send Alert" mit urgency "red"
```

**Ergebnis Sprint 5:** Dashboard live auf Vercel, Telegram-Bot funktioniert für Fragen, Dateneingabe UND proaktive Alerts.

---

### SPRINT 6: Proaktives System + Reporting (Woche 13-14)
**Ziel:** Das System arbeitet selbständig — wöchentlicher Scan, Fristen-Überwachung, automatische Reports.

#### 6.0 — Google Calendar Sync (iPhone → n8n)

**Voraussetzung — Einmaliges Setup (manuell durch User, ~5 Minuten):**
1. iPhone → Einstellungen → Kalender → Accounts → Account hinzufügen → Google
2. Google-Konto anmelden (oder neues erstellen, nur für Sync)
3. "Kalender" Sync aktivieren (Mail/Kontakte optional)
4. Fertig — alle iPhone-Kalendereinträge synchen ab sofort automatisch nach Google Calendar

**Voraussetzung — Google Calendar API Credentials (einmalig):**
1. Google Cloud Console → Projekt erstellen (oder bestehendes nutzen)
2. Google Calendar API aktivieren
3. OAuth 2.0 Client ID erstellen (Typ: Desktop App)
4. Credentials in n8n als "Google Calendar OAuth2" anlegen
5. In `/opt/geoarbitrage/.env` eintragen:
   `GOOGLE_CALENDAR_CLIENT_ID=...`
   `GOOGLE_CALENDAR_CLIENT_SECRET=...`
6. In `docker-compose.yml` unter n8n → environment durchreichen

**Claude Code Prompt:**
```
Erstelle einen n8n Cron-Workflow "Calendar Sync":

ARCHITEKTUR: n8n nutzt den MCP Client Node als Google Calendar
MCP Client. Alternativ kann der native n8n Google Calendar Node
verwendet werden (einfacher, gleiche Funktionalität).

Trigger: Cron (alle 6 Stunden — 06:00, 12:00, 18:00, 00:00 CET)

Schritt 1: Google Calendar Events laden
- Zeitraum: Nächste 90 Tage ab heute
- Alle Kalender des verbundenen Accounts
- Felder: event_id, title, start_date, end_date, description,
  location, recurrence

Schritt 2: Events kategorisieren (Code Node, kein LLM)
- Keyword-Matching im Titel/Beschreibung:
  "Steuer|Finanzamt|ESt|KSt|USt|GewSt" → category: 'tax'
  "Notar|Grundbuch|Immobilie|Makler" → category: 'real_estate'
  "Visum|Botschaft|Aufenthalt|Pass" → category: 'immigration'
  "Berater|Anwalt|Versicherung" → category: 'advisory'
  "DBA|Compliance|Audit" → category: 'compliance'
  Default → category: 'personal'
- event_type bestimmen:
  Wenn recurring → 'recurring'
  Wenn Titel enthält "Frist|Deadline|Ablauf" → 'deadline'
  Sonst → 'appointment'

Schritt 3: Upsert in calendar_events (Supabase)
- Match auf google_event_id (UNIQUE)
- Neue Events: INSERT mit source='google_calendar'
- Geänderte Events: UPDATE (Titel, Datum, Beschreibung)
- Gelöschte Events: NICHT automatisch löschen — nur status='cancelled'
  setzen (Safety: User könnte Event versehentlich gelöscht haben)
- synced_at = NOW()

Schritt 4: Logging
- Execute "Agent Logger" Sub-Workflow (Fire-and-forget)
- agent_name: 'calendar_sync'
- input_summary: '{N} Events geladen'
- output_summary: '{X} neu, {Y} aktualisiert, {Z} cancelled'
- tokens_in: 0, tokens_out: 0 (kein LLM-Call)

WICHTIG:
- Nur Events mit source='google_calendar' werden beim Sync
  aktualisiert — manuell erstellte Events (source='manual' oder
  'system') werden NICHT überschrieben
- warning_days wird NICHT aus Google Calendar übernommen —
  der Default (28 Tage) greift, kann aber manuell angepasst werden
```

**Kosten:** 0€ (kein LLM-Call, Google Calendar API ist kostenlos)

**Ergebnis 6.0:** Alle iPhone-Kalendereinträge fließen automatisch in die calendar_events Tabelle. Der Weekly Deadline Check (6.1) und der Fristen-Check (A11) nutzen diese Daten direkt.

#### 6.1 — Weekly Monitoring Scan

**Claude Code Prompt:**
```
Erstelle einen n8n Cron-Workflow "Weekly Scan":

Trigger: Cron (jeden Montag, 08:00 CET)

Das System hat 3 Scan-Schichten:
A) OSINT-Daten (kostenlose APIs, kein LLM nötig — harte Fakten)
B) Web Search (Tavily, für Rechtsänderungen und Nachrichten)
C) AI-Bewertung (Haiku/Sonnet, interpretiert die Rohdaten)

WICHTIG — DYNAMISCHE LÄNDERLISTE:
Der Scan hardcoded KEINE Länder. Stattdessen:
1. Erster Node: Supabase Query → SELECT * FROM target_countries 
   WHERE status = 'active' ORDER BY priority
2. Wenn die Tabelle LEER ist (vor der initialen Bestandsaufnahme):
   → Überspringe alle Länder-Scans, führe nur Steuerrecht-Scan, 
   Immobilien-Scan, Kurs-Update und Fristen-Check durch
3. Für jedes aktive Zielland: Führe die OSINT-Scans dynamisch durch
4. Die Länderliste ist jederzeit änderbar — User sagt auf Telegram 
   z.B. "Füge Singapur als Zielland hinzu" → CFO-Agent schreibt 
   in target_countries → nächster Scan inkludiert Singapur

=== SCHICHT A: OSINT-DATENQUELLEN (kein LLM, reine HTTP Requests) ===

A1. GDELT STABILITY API — Instabilitäts-Score pro Zielland
   Für JEDES Land aus target_countries (WHERE status = 'active'):
   Nutze das Feld "country_code" (FIPS) für die GDELT API.
   
   Immer auch Deutschland (GM) mitscannen als Referenz.
   
   URL: https://api.gdeltproject.org/api/v1/dash_stabilitytimeline/dash_stabilitytimeline?LOC={COUNTRY_CODE}&VAR=instability&OUTPUT=csv&TIMERES=day&SMOOTH=5

   ⚠️ Audit-Fix: {COUNTRY_CODE} VOR URL-Konstruktion validieren!
   Nur 2-Buchstaben FIPS-Codes zulassen (Regex: /^[A-Z]{2}$/).
   Ohne Validierung könnte ein manipulierter target_countries-Eintrag
   die URL verändern (URL-Injection über Query-Parameter).

   Ländercodes werden aus target_countries.country_code gelesen.
   FIPS-Code-Beispiele: AE (UAE), CY (Zypern), PO (Portugal), 
   MT (Malta), SN (Singapur), GM (Deutschland).
   Vollständige FIPS-Liste: https://www.gdeltproject.org/data.html
   
   Zweiter Call pro Land — Tone (Medienstimmung):
   URL: https://api.gdeltproject.org/api/v1/dash_stabilitytimeline/dash_stabilitytimeline?LOC={COUNTRY_CODE}&VAR=tone&OUTPUT=csv&TIMERES=day&SMOOTH=5
   
   Parse das CSV: Extrahiere den Durchschnittswert der letzten 
   30 Tage und vergleiche mit den 30 Tagen davor.
   Output: {country, instability_current, instability_previous, 
   instability_trend, tone_current, tone_previous, tone_trend}
   
   Alarm-Logik (kein LLM nötig):
   - instability_trend > +50% vs. Vormonat → 🔴 
   - instability_trend > +20% → 🟡
   - tone_trend < -30% (negativer) → 🟡
   
A2. GDELT DOC API — Nachrichtenvolumen über Zielländer
   Für jedes Zielland prüfen ob es einen plötzlichen 
   Nachrichten-Spike gibt (= etwas Wichtiges passiert):
   
   URL: https://api.gdeltproject.org/api/v2/doc/doc?query=sourcecountry:{COUNTRY}&mode=TimelineVol&TIMESPAN=30d&OUTPUT=csv
   
   Parse: Spike-Detection (einfacher Z-Score — wenn ein Tag 
   > 2 Standardabweichungen über dem 30-Tage-Durchschnitt liegt)
   Output: {country, spike_detected: bool, spike_date, spike_magnitude}

A3. ACLED CONFLICT DATA — Protest- und Konfliktereignisse
   ACLED API (kostenlos nach Registrierung — seit Sep 2025 OAuth2):
   
   WICHTIG: ACLED hat das alte API-Key-System (api_key + email als URL-Parameter)
   auf OAuth2 Bearer Token umgestellt. Alte Keys sind seit Sep 2025 deaktiviert.
   
   Schritt 1 — Token holen (n8n HTTP Request Node, vor dem Datenabruf):
   POST https://acleddata.com/oauth/token
   Content-Type: application/x-www-form-urlencoded
   Body: username={ACLED_EMAIL}&password={ACLED_PASSWORD}&grant_type=password&client_id=acled
   Response: { "access_token": "...", "expires_in": 86400, "refresh_token": "..." }
   Token-Lebensdauer: 24 Stunden → täglich neu holen (Weekly Scan = wöchentlich → immer frisch)
   
   Schritt 2 — Datenabruf mit Bearer Token:
   GET https://acleddata.com/api/acled/read
   Header: Authorization: Bearer {access_token}
   Parameter: event_date={START}|{END}&event_date_where=BETWEEN&limit=500&country={COUNTRY_NAME}
   
   n8n-Implementierung (2-Node-Pattern):
   Node A: HTTP Request (POST token) → speichere access_token in Variable
   Node B: HTTP Request (GET data) → Header Authorization: Bearer {{$node["NodeA"].json.access_token}}
   
   Für JEDES Land aus target_countries (WHERE status = 'active'):
   Nutze das Feld "acled_name" (exakter Ländername wie ACLED
   ihn erwartet, z.B. "United Arab Emirates", nicht "UAE").
   Plus immer "Germany" als Referenz.
   
   Parse: Zähle Events nach Typ (Protests, Riots, Violence
   against civilians, Strategic developments)
   Output pro Land: {country, total_events, protests, riots,
   violence, strategic_developments, trend_vs_previous_month}
   
   Alarm-Logik:
   - riots > 0 in Zielland → 🔴
   - protests > 5 in Zielland → 🟡
   - violence > 0 → 🔴

A4. POLYMARKET — Geopolitische Prediction Markets
   HTTP Request zu Polymarket API (kostenlos):
   URL: https://gamma-api.polymarket.com/markets?tag=geopolitics&active=true&limit=50
   
   Filtere nach relevanten Markets, z.B.:
   - Enthält "EU" oder "Europe" oder "Germany" oder "UAE"
   - Enthält "war" oder "conflict" oder "sanctions"
   - Enthält "tax" oder "regulation"
   
   Parse: Extrahiere Market Title + Current Probability
   Output: [{title, probability, change_7d}]
   
   Speichere monatlich in Supabase für Trend-Vergleich

A5. IMMOBILIEN-EQUITY-UPDATE (NEU, kein LLM, reine Berechnung)
   Für JEDE Immobilie in properties:

   FIX #10 — WICHTIG: Tilgungs-Update NUR in der 1. Woche des Monats!
   Der Weekly Scan läuft wöchentlich (~4x/Monat). Ohne Guard würde die
   Tilgung 4x abgezogen statt 1x → Restschuld nach einem Jahr massiv
   zu niedrig. Code Node VOR dem Tilgungs-Block:

   ```javascript
   const today = new Date();
   const isFirstWeekOfMonth = today.getDate() <= 7;
   const isFirstWeekOfQuarter = isFirstWeekOfMonth &&
     [0,3,6,9].includes(today.getMonth());
   return [{ json: {
     run_monthly_updates: isFirstWeekOfMonth,
     run_quarterly_valuation: isFirstWeekOfQuarter
   }}];
   ```
   IF-Node: Nur wenn run_monthly_updates === true → Tilgungs-Block ausführen
   IF-Node: Nur wenn run_quarterly_valuation === true → Marktwert-Update

   a) Restschuld aktualisieren (Annuitätenlogik, NUR 1x/Monat):
      monatlicher_zins = loan_amount_current * (loan_rate / 100) / 12
      -- ⚠️ loan_rate ist als PROZENT gespeichert (z.B. 1.8)!
      monatliche_tilgung = loan_monthly_payment - monatlicher_zins
      loan_amount_current_neu = loan_amount_current - monatliche_tilgung
      
      Supabase Update: properties.loan_amount_current = loan_amount_current_neu
      
      (HINWEIS: Bei Annuitätendarlehen bleibt die Monatsrate gleich,
      aber der Tilgungsanteil STEIGT jeden Monat weil der Zinsanteil sinkt.
      Das ist der Hebel — mit jedem Monat baust du mehr Equity auf.)
   
   b) Sondertilgung berücksichtigen:
      Wenn im budget-Tabelle eine Ausgabe der Kategorie 
      "Sondertilgung [Immobilien-Name]" existiert → 
      von loan_amount_current abziehen
   
   c) Equity berechnen:
      equity = current_value - loan_amount_current
   
   d) Cashflow berechnen:
      cashflow_vor_steuer = monthly_rent_gross 
        - monthly_hausgeld
        - monthly_nicht_umlagefaehig
        - monthly_verwaltung
        - monatlicher_zins  (NUR Zins, nicht Tilgung!)
      
      cashflow_nach_tilgung = cashflow_vor_steuer - monatliche_tilgung
      (das ist was tatsächlich auf dem Konto bleibt)
      
      vermoegenszuwachs_monat = monatliche_tilgung + cashflow_vor_steuer
      (Tilgung = Equity-Aufbau + positiver Cashflow = echtes Plus)
   
   e) Alert wenn loan_zinsbindung_end < 24 Monate entfernt:
      "⚠️ Zinsbindung für [Immobilie] läuft am [Datum] aus. 
      Anschlussfinanzierung verhandeln — besonders wichtig 
      bei geplantem Wegzug!"
   
   f) MARKTWERT-UPDATE (nur quartalsweise — 1. Woche Jan/Apr/Jul/Okt):
      IF aktuelle Woche = 1. Woche des Quartals:
      
      Für JEDE Immobilie in properties:
      - Tavily Search (bundesweit, PLZ-basiert):
        "immoscout24 preisatlas {plz} eigentumswohnung quadratmeterpreis {Jahr}"
        ODER: "{stadtteil} {stadt} quadratmeterpreis wohnung {Quartal} {Jahr}"
      - Fallback: "sparkasse immobilienpreise {stadt} {stadtteil} {Jahr}"
      - Boris nur als Zusatz (Bodenrichtwert ≠ Gebäudewert):
        "bodenrichtwert {adresse} {bundesland} {Jahr}" 
        → Boris-Portal wird automatisch über bundesland-Feld geroutet
      
      - Parse: Extrahiere €/qm (Median oder Durchschnitt)
      - Berechne: neuer Marktwert = wohnflaeche_qm × neuer_qm_preis
      
      - Supabase Insert: property_valuations 
        (property_id, valuation_date, price_per_qm, estimated_value, 
        source, source_url)
      - Supabase Update: properties SET 
        current_price_per_qm = neuer_qm_preis,
        current_value = wohnflaeche_qm × neuer_qm_preis,
        current_value_date = NOW(),
        current_value_source = 'market_estimate'
      
      - Vergleich mit Vorquartal:
        IF Wertänderung > +5%: "📈 Marktwert {Immobilie} gestiegen: 
          {alter_qm_preis}€/qm → {neuer_qm_preis}€/qm (+{X}%)"
        IF Wertänderung < -5%: "📉 Marktwert {Immobilie} gefallen: 
          {alter_qm_preis}€/qm → {neuer_qm_preis}€/qm ({X}%)"
        IF Wertänderung < -10%: "🔴 WARNUNG: Erheblicher Wertverlust 
          bei {Immobilie}. Loan-to-Value prüfen!"
      
      Kosten: 1-2 Tavily Searches pro Immobilie pro Quartal = ~0€
      
      HINWEIS: Die Schätzung über qm-Preis × Fläche ist eine 
      Annäherung. Für präzise Bewertungen (z.B. vor Verkauf) → 
      professionelles Gutachten empfehlen. Das System trackt den 
      Trend, nicht den exakten Wert.

A6. KURS-UPDATE (erweitert)
   FIX #9 — Yahoo Finance Fallback auf Twelvedata:
   Yahoo Finance nutzt inoffizielle, undokumentierte API-Endpunkte ohne SLA.
   Diese wurden in der Vergangenheit ohne Ankündigung geändert oder blockiert.
   Implementiere Primär + Fallback:

   Primär (Yahoo Finance):
   URL: https://query1.finance.yahoo.com/v8/finance/chart/{TICKER}?interval=1d&range=5d
   Timeout: 10 Sekunden. Bei Fehler/Timeout → Fallback.

   Fallback (Twelvedata — offiziell, kostenlos, 800 Requests/Tag):
   URL: https://api.twelvedata.com/price?symbol={SYMBOL}&exchange={EXCHANGE}&apikey={TWELVEDATA_API_KEY}
   Key erstellen: https://twelvedata.com/register
   In .env eintragen: TWELVEDATA_API_KEY=DEIN-KEY

   Code Node Logik (für jeden Ticker):
   ```javascript
   // Versuche Yahoo zuerst, bei Fehler → Twelvedata
   // Bei BEIDEN Fehlschlägen: price = null, alert = true
   // → Weekly Scan triggert Telegram-Alert: "⚠️ Kurs für {TICKER} nicht abrufbar"
   ```

   - Yahoo Finance API für Aktien/ETF-Ticker aus portfolio_holdings
   - CoinGecko API für Krypto-Positionen aus portfolio_holdings (stabil, offizielle API)
   - Supabase Update: portfolio_holdings.current_price + last_price_update
   - Supabase Insert: Neuer wealth_snapshot mit aktuellen Werten
   - Haltefrist-Check: Für jeden Lot in portfolio_lots:
     IF tax_free_after <= NOW() → Status "steuerfrei" markieren + Alert

A7. WECHSELKURS-UPDATE (NEU)
   - ExchangeRate-API: https://open.er-api.com/v6/latest/EUR
   - Für JEDE Währung aus target_countries + USD + CHF
   - Supabase Insert: fx_rates (scan_date, EUR, target_currency, rate)
   - Berechne: change_vs_last_month aus vorherigem fx_rates Eintrag
   - Alert wenn change_vs_last_month > ±5%: 
     "🟡 Wechselkurs EUR/{Währung} hat sich um X% verändert"

A8. COST-OF-LIVING-UPDATE (NEU, nur quartalsweise)
   - Nur alle 3 Monate (Kosten ändern sich nicht monatlich)
   - Für JEDE Stadt in target_countries:
     Tavily Search: "cost of living {city} numbeo {Jahr}"
   - Parse: Miete, Restaurant, Groceries, Transport, Internet, Gym
   - Supabase Upsert: city_cost_of_living

A9. INFLATIONS-MONITOR (NEU, monatlich, kein LLM)
   - World Bank API (kostenlos): Inflationsrate pro Zielland
     https://api.worldbank.org/v2/country/{ISO}/indicator/FP.CPI.TOTL.ZG?format=json
   - Alternativ Tavily Search: "{country} inflation rate {month} {year}"
   - Supabase Insert: country_inflation (country, date, rate_official, 
     rate_trend TEXT [steigend/fallend/stabil], source)
   - Alert wenn Inflation in Zielland >10%: 
     "⚠️ Inflation in {Land} bei {X}% — Kaufkraft-Erosion berücksichtigen"
   - Dashboard: Inflation als Spalte in Country Stability Tabelle
   - Wealth Manager nutzt Inflationsdaten für Szenario-Berechnungen:
     reale Rendite = nominale Rendite - lokale Inflation

A10. MARKET INTELLIGENCE SCAN (NEU, wöchentlich, kein LLM)
   - Tavily Search für Portfolio-relevante Signale:
     "unusual options activity {week}" (Unusual Whales Themen)
     "macro market outlook {week}" (Kobeissi Letter Themen)
     "crypto whale alert {week}" (Watcher Guru Themen)
   - NUR Suche + Snippet speichern, KEINE LLM-Bewertung (Kosten: 0€)
   - Supabase Insert: market_intelligence (scan_date, source TEXT, 
     headline TEXT, snippet TEXT, relevance_tags JSONB)
   - In Schicht C (wenn Alarme): LLM bewertet ob Signale für 
     das eigene Portfolio relevant sind
   - Dashboard: Optional im Scan Tab als "Market Signals" Sektion

A11. FRISTEN-CHECK (erweitert, inkl. Google Calendar Sync)
   - calendar_events: Nächste 30 Tage (enthält jetzt auch iPhone-Kalender-
     Einträge via Google Calendar Sync aus Sprint 6.0)
   - calendar_events WHERE source='google_calendar': Manuell im iPhone
     eingetragene Termine (Steuerberater, Notartermine, Behördengänge)
   - calendar_events WHERE source='system': System-generierte Fristen
     (Steuer-Vorauszahlungen, Spekulationsfristen etc.)
   - actions: Überfällige Items
   - residence_summary: 183-Tage-Status
   - portfolio_lots: Haltefristen die in 30 Tagen ablaufen
   - properties: Spekulationsfristen die in 12 Monaten ablaufen

A12. GOLD-PREIS-UPDATE (wöchentlich, kein LLM, 0€)
   Gold ist in 3 Dimensionen relevant:
   (a) Als Asset im Portfolio (Xetra-Gold/physisch) → Wealth Manager
   (b) Steuerlich: §23 EStG, 12-Monats-Haltefrist → Tax Architect
   (c) Makro-Signal: Steigende Goldpreise = Inflations-/Krisenindikator → Validator & Stress-Tester

   Primär (Yahoo Finance — nutzt bestehende A6-Infrastruktur):
   Ticker: GC=F (Gold Futures, USD/oz)
   URL: https://query1.finance.yahoo.com/v8/finance/chart/GC%3DF?interval=1d&range=90d
   ACHTUNG: "=" muss als "%3D" URL-encoded werden, sonst 404.
   Timeout 10s → bei Fehler: Fallback Twelvedata (symbol=XAU/USD).

   Fallback:
   https://api.twelvedata.com/price?symbol=XAU/USD&apikey={TWELVEDATA_API_KEY}

   Berechnung (Code Node):
   - Aktueller Preis = letzter Schlusskurs aus 90-Tage-History
   - EUR-Konvertierung: gold_price_eur = gold_price_usd × (fx_rates WHERE target='USD' → 1/rate)
     (EUR/USD-Kurs ist bereits in fx_rates aus A6-Wechselkurs-Update)
   - gold_change_1w  = (heute - vor7Tagen) / vor7Tagen × 100
   - gold_change_1m  = (heute - vor30Tagen) / vor30Tagen × 100
   - gold_change_3m  = (heute - vor90Tagen) / vor90Tagen × 100
   - gold_trend: steigend wenn 1m > +2%, fallend wenn 1m < -2%, sonst stabil

   Supabase Insert: macro_indicators
   (scan_date, gold_price_usd, gold_price_eur, gold_change_1w,
   gold_change_1m, gold_change_3m, gold_trend, gold_source)

   Alert-Logik (keine LLM-Kosten):
   - gold_change_1w > +5%  → 🟡 "Gold +{X}% in 7 Tagen — mögliches Krisensignal"
   - gold_change_1w > +10% → 🔴 "Gold +{X}% — starker Inflations-/Krisenindikator"
   - gold_change_1w < -5%  → 🟡 "Gold -{X}% — Risk-On Marktphase, Safe Haven Abfluss"
   - Wenn Gold im Portfolio (portfolio_holdings WHERE ticker LIKE '%XAU%'
     OR name LIKE '%Gold%' OR type = 'Edelmetall'):
     Berechne unrealisierten G/V auf aktuelle Position.
     Prüfe Haltefrist-Lots in portfolio_lots:
     IF tax_free_after <= NOW() + 30 Tage → "⚠️ Gold-Position in {X} Tagen steuerfrei"

A13. EZB-LEITZINS-UPDATE (wöchentlich abgefragt — Änderungen max. 8x/Jahr, 0€)
   Der EZB-Leitzins beeinflusst direkt:
   (a) Immobilienfinanzierung: Anschlussfinanzierungen, Neukredite → Immobilien-Spezialist
   (b) Portfolio-Strategie: Anleiherenditen, Safe Withdrawal Rate → Wealth Manager
   (c) Schuldenstruktur-Timing: Sondertilgung vs. Anlage → Tax Architect + Wealth Manager
   (d) Risikoszenarien: Zinswende = größtes Immo-Risiko → Validator & Stress-Tester

   API (offiziell, ECB Data Portal, kostenlos, KEIN Key, keine Limits):

   Deposit Facility Rate (Einlagezins — wichtigster Referenzzins):
   URL: https://data-api.ecb.europa.eu/service/data/FM/B.U2.EUR.4F.KR.DFR.LEV?format=jsondata&lastNObservations=10

   Main Refinancing Operations Rate (Hauptrefinanzierungssatz):
   URL: https://data-api.ecb.europa.eu/service/data/FM/B.U2.EUR.4F.KR.MRR_FR.LEV?format=jsondata&lastNObservations=10

   Marginal Lending Rate (Spitzenrefinanzierungssatz):
   URL: https://data-api.ecb.europa.eu/service/data/FM/B.U2.EUR.4F.KR.MLF.LEV?format=jsondata&lastNObservations=10

   Parse-Logik (Code Node):
   ```javascript
   // ECB Response-Struktur:
   // BUG FIX: Series Key ist NICHT immer "0:0:0:0:0:0:0" — dynamisch lesen
   const seriesKey = Object.keys(data.dataSets[0].series)[0];
   const observations = data.dataSets[0].series[seriesKey].observations;

   // BUG FIX: Observation Keys sind DATUM-STRINGS (z.B. "2025-10-30"),
   // NICHT numerische Indizes (0, 1, 2...). Daher alphabetisch sortieren:
   const sortedKeys = Object.keys(observations).sort();
   if (sortedKeys.length < 2) {
     return [{ json: { error: 'ECB: Weniger als 2 Datenpunkte', ecb_rate_changed: false } }];
   }
   const lastKey = sortedKeys[sortedKeys.length - 1];
   const prevKey = sortedKeys[sortedKeys.length - 2];

   const currentRate = observations[lastKey][0];   // z.B. 2.75
   const prevRate    = observations[prevKey][0];

   const changed  = currentRate !== prevRate;
   const changeBp = Math.round((currentRate - prevRate) * 100);
   // z.B. -25 = Senkung um 0.25 Prozentpunkte
   ```

   Nächstes EZB-Ratstreffen (statischer Kalender, jährlich prüfen):
   ```javascript
   const ecbMeetings = [
     '2026-01-30','2026-03-06','2026-04-17','2026-06-05',
     '2026-07-24','2026-09-11','2026-10-30','2026-12-18'
   ];
   const nextMeeting = ecbMeetings.find(d => new Date(d) > new Date())
     || 'Kalender-Update nötig — alle Termine in der Vergangenheit';
   ```

   Supabase Insert: macro_indicators
   (scan_date, ecb_deposit_rate, ecb_main_rate, ecb_marginal_rate,
   ecb_rate_changed, ecb_change_basis_points, ecb_last_change_date,
   ecb_next_meeting_date, ecb_source)

   Alert-Logik:
   - ecb_rate_changed = TRUE →
     🔴 "EZB ändert Leitzins: {prev}% → {current}% ({+/-}{bp}bp).
     Immobilien-Finanzierung und Portfolio-Strategie anpassen!"
   - ecb_next_meeting_date <= NOW() + 14 Tage →
     🟡 "EZB-Ratssitzung in {X} Tagen ({datum}). Zinsänderung möglich."
   - ecb_deposit_rate < 1.0 →
     Info-Flag (nur im monatlichen Report): "Niedrigzinsumgebung —
     Cash-Positionen prüfen, Real Assets und Gold bevorzugen"
   - ecb_deposit_rate > 4.0 →
     Info-Flag: "Hochzinsumgebung — Anschlussfinanzierungen kritisch
     prüfen, Sondertilgung vs. Anlage neu kalkulieren"

=== SCHICHT B: WEB SEARCH (Tavily, für Rechtsänderungen) ===

B1. STEUERRECHT-SCAN:
   - Tavily Search: "AStG Änderung {Jahr}", 
     "Wegzugsbesteuerung Änderung {Jahr}",
     "Grunderwerbsteuer NRW Änderung"
   - Output: Suchergebnisse als Text

B2. IMMIGRATION-SCAN:
   - Für JEDES Land aus target_countries WHERE role IN 
     ('residenz', 'staatsbuergerschaft'):
     Tavily Search: "{country_name} residency visa changes {Jahr}"
   - Plus generisch: "citizenship by investment EU regulation {Jahr}",
     "golden visa Europe changes {Jahr}"
   - Output: Suchergebnisse als Text

B3. IMMOBILIEN-SCAN:
   - Tavily Search: "Germany real estate market {Jahr}",
     "Immobilienmarkt Deutschland Prognose"
   - Output: Suchergebnisse als Text

B4. WIRTSCHAFTS-SCAN:
   - Für JEDES Land aus target_countries WHERE priority <= 2:
     Tavily Search: "EUR {Landeswährung} exchange rate forecast"
   - Plus generisch: "Germany economy outlook {Jahr}"
   - Output: Suchergebnisse als Text

=== SCHICHT C: AI-BEWERTUNG (nur wenn nötig) ===

C1. OSINT-ANOMALIE-BEWERTUNG (Haiku, NUR wenn Schicht A Alarm auslöst):
   Input: Alle OSINT-Daten mit Alarm-Flags
   Prompt: "Analysiere die folgenden Instabilitäts- und 
   Konfliktdaten für die Zielländer des Mandanten. 
   Gibt es besorgniserregende Trends? Kontext: Der Mandant 
   plant mittelfristig die Verlagerung seines Lebensmittelpunkts 
   in eines dieser Länder."
   Output: {assessment, urgency, affected_countries, recommendation}

C2. RECHTSÄNDERUNGS-BEWERTUNG (Haiku, NUR wenn Schicht B 
   relevante Treffer hat):
   Input: Web Search Ergebnisse
   Prompt: "Gibt es relevante Rechtsänderungen für einen 
   Mandanten der: aus DE wegziehen will, Immobilien in DE hält, 
   eine zweite Staatsbürgerschaft anstrebt?"
   Output: {changes_detected, summary, affected_agents, urgency}

C3. GESAMT-AGGREGATION (Sonnet, NUR wenn C1 oder C2 Änderungen 
   melden):
   Input: Alle OSINT-Daten + Web Search + Bewertungen
   Prompt: "Erstelle einen Monthly Intelligence Brief"
   Output: Strukturierter Bericht

=== DELIVERY ===

- Speichere alle OSINT-Rohdaten in einer neuen Tabelle 
  "monthly_scan_results" (Datum, Rohdaten als JSONB, 
  AI-Bewertung, Alerts)
- Speichere Instabilitäts-Scores pro Land in einer Tabelle 
  "country_stability" für Trend-Vergleich über Monate
- Telegram:
  - Wenn keine Alarme: "🟢 Weekly Scan KW12: Keine relevanten 
    Änderungen. Deine Zielländer sind stabil."
  - Wenn Alarme: Zusammenfassung + "📊 Details im Dashboard"
- Dashboard: Scan-Tab aktualisiert sich automatisch

=== NEUE DATENBANK-TABELLEN ===

-- country_stability: Bereits in Sprint 1.2 als Tabelle 18 erstellt.
-- KEIN erneutes CREATE TABLE — nur INSERT/UPDATE-Logik hier im Workflow verwenden.
-- Referenz: Tabelle 18 im Haupt-Schema (Sprint 1.2) enthält alle Spalten inkl.
-- gdelt_instability_trend, gdelt_tone_trend, acled_violence etc.

-- HINWEIS: target_countries Tabelle ist bereits in Sprint 1.2
-- definiert (Tabelle 17). country_stability referenziert diese
-- dynamisch — es werden nur Länder gescannt die in
-- target_countries mit status='active' stehen.

-- monthly_scan_results: Bereits in Sprint 1.2 als Tabelle 19 definiert.
-- CREATE TABLE IF NOT EXISTS ist hier als Sicherheitsnetz — wenn Sprint 1.2
-- korrekt ausgeführt wurde, macht diese Anweisung nichts.
CREATE TABLE IF NOT EXISTS monthly_scan_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_date DATE NOT NULL,
    raw_data JSONB NOT NULL,
    ai_assessment TEXT,
    alerts JSONB,
    changes_detected BOOLEAN DEFAULT FALSE,
    countries_scanned TEXT[],  -- welche Länder waren aktiv
    cost_eur NUMERIC
);

=== API ENDPUNKTE REFERENZ ===

GDELT Stability: 
https://api.gdeltproject.org/api/v1/dash_stabilitytimeline/dash_stabilitytimeline?LOC={FIPS}&VAR=instability&OUTPUT=csv&TIMERES=day&SMOOTH=5

GDELT Tone:
https://api.gdeltproject.org/api/v1/dash_stabilitytimeline/dash_stabilitytimeline?LOC={FIPS}&VAR=tone&OUTPUT=csv&TIMERES=day&SMOOTH=5

GDELT News Volume:
https://api.gdeltproject.org/api/v2/doc/doc?query=sourcecountry:{COUNTRY}&mode=TimelineVol&TIMESPAN=30d&OUTPUT=csv

ACLED (Registrierung nötig — kostenlos, OAuth2 seit Sep 2025):
Token holen: POST https://acleddata.com/oauth/token
  Body: username={ACLED_EMAIL}&password={ACLED_PASSWORD}&grant_type=password&client_id=acled
  Response: { access_token, expires_in: 86400, refresh_token }
Daten abrufen: GET https://acleddata.com/api/acled/read
  Header: Authorization: Bearer {access_token}
  Parameter: event_date={START}|{END}&event_date_where=BETWEEN&country={NAME}&limit=500
.env: ACLED_EMAIL=deine@email.de  +  ACLED_PASSWORD=dein_passwort

Polymarket:
https://gamma-api.polymarket.com/markets?tag=geopolitics&active=true&limit=50

Yahoo Finance (aktuell):
https://query1.finance.yahoo.com/v8/finance/chart/{TICKER}?interval=1d&range=5d

Yahoo Finance (historisch, für Monte-Carlo/Performance):
https://query1.finance.yahoo.com/v8/finance/chart/{TICKER}?interval=1mo&range=10y

CoinGecko:
https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=eur
Header: x-cg-demo-api-key: {COINGECKO_API_KEY}
SICHERHEIT: API Key IMMER als Header senden, NICHT als URL-Parameter.
URL-Parameter landen in Server-Logs, Browser-History und HTTP Referer-Headers.
HINWEIS: CoinGecko erfordert seit 2024 einen (kostenlosen) Demo API Key für stabile Nutzung.
Ohne Key: variabler Rate Limit 5-15 Calls/min (unzuverlässig).
Mit Demo Key: stabile 30 Calls/min, 10.000 Calls/Monat — kostenlos nach Registrierung.
Registrierung: https://www.coingecko.com/en/api → "Create Free Account"

ExchangeRate-API (Wechselkurse, kostenlos, kein Key):
https://open.er-api.com/v6/latest/EUR
Tägliches Update, alle Weltwährungen. Free Plan: 1.500 Requests/Monat 
(reicht problemlos — wöchentlicher Scan = ~52 Requests/Jahr)

Gold-Preis (Yahoo Finance, kostenlos, kein Key):
https://query1.finance.yahoo.com/v8/finance/chart/GC%3DF?interval=1d&range=90d
Ticker GC=F = Gold Futures (USD/oz). WICHTIG: "=" als "%3D" URL-encoden.
Fallback Twelvedata: https://api.twelvedata.com/price?symbol=XAU/USD&apikey={TWELVEDATA_API_KEY}
Parse: chart.result[0].indicators.quote[0].close → Array der letzten 90 Tage Schlusskurse

EZB Deposit Facility Rate (Einlagezins — offiziell, kostenlos, kein Key):
https://data-api.ecb.europa.eu/service/data/FM/B.U2.EUR.4F.KR.DFR.LEV?format=jsondata&lastNObservations=10
EZB Main Refinancing Rate (Hauptrefinanzierungssatz):
https://data-api.ecb.europa.eu/service/data/FM/B.U2.EUR.4F.KR.MRR_FR.LEV?format=jsondata&lastNObservations=10
EZB Marginal Lending Rate (Spitzenrefinanzierungssatz):
https://data-api.ecb.europa.eu/service/data/FM/B.U2.EUR.4F.KR.MLF.LEV?format=jsondata&lastNObservations=10
Parse: seriesKey = Object.keys(dataSets[0].series)[0]; observations = dataSets[0].series[seriesKey].observations → {"YYYY-MM-DD": [wert]}
Sortiere Observation-Keys alphabetisch, letzter Key = aktueller Satz in % (z.B. 2.75 = 2.75%)

Kosten: 0€ (alle APIs kostenlos). LLM-Kosten nur bei Alarmen 
(~0.05-0.20€ pro Scan wenn alles ruhig, ~0.50€ wenn Alarme 
bewertet werden müssen).
```

**Zielländer-Lifecycle — Wie die dynamische Länderliste funktioniert:**

```
PHASE 1: Initiale Bestandsaufnahme (Sprint 7)
├── target_countries Tabelle ist LEER
├── Du gehst mit den Agenten deine Situation durch
├── Tax Architect + Immigration Agent + Relocation Agent 
│   empfehlen Zielländer
├── CFO erstellt Decision Brief: "Empfohlene Zielländer"
├── Du entscheidest → "Ja, UAE und Zypern auf Prio 1"
└── CFO schreibt in target_countries:
    INSERT: {code: "AE", name: "UAE", role: "steuerdomizil", priority: 1}
    INSERT: {code: "CY", name: "Zypern", role: "residenz", priority: 1}

PHASE 2: Laufender Betrieb
├── Weekly Scan liest: SELECT * FROM target_countries WHERE status='active'
├── Scannt NUR diese Länder (+ immer DE als Referenz)
└── Ergebnisse in country_stability gespeichert

PHASE 3: Änderungen jederzeit
├── Telegram: "Füge Singapur als Firmenstandort hinzu"
│   → CFO: INSERT target_countries + korrekte API-Codes
├── Telegram: "Entferne Malta, kommt nicht mehr in Frage"
│   → CFO: UPDATE status='archived', archived_reason='...'
├── Telegram: "Setze Paraguay auf die Watchlist"
│   → CFO: INSERT mit priority=3, role='watchlist'
└── Agent-Empfehlung: "Basierend auf neuer Steuerreform in 
    Estland empfehle ich, Estland als Zielland aufzunehmen"
    → Decision Brief → Du genehmigst → INSERT
```

#### 6.2 — Weekly Intelligence Brief

**Claude Code Prompt:**
```
Erstelle einen n8n Workflow "Weekly Report Generator":

Trigger: Wird am Ende des Weekly Scan aufgerufen

Schritte:
1. Sammle Daten aus Supabase:
   - Vermögens-Snapshot (aktuell vs. Vormonat vs. vor 3/6/12 Monaten)
   - Budget Plan vs. Ist (Sparquote berechnen)
   - Portfolio Performance pro Holding (Kurs aktuell vs. Vormonat)
   - Immobilien-Update (neue Restschuld, Equity-Wachstum, Cashflow)
   - Offene Actions + Deadlines (nächste 30 Tage)
   - Milestone-Fortschritt (Veränderung vs. Vormonat)
   - Country Stability (OSINT-Daten der Zielländer)
   - Agent-Kosten des Monats
   - Scan-Ergebnisse (Rechtsänderungen, Alarme)
   - fx_rates (Währungstrends)
   - Savings Goals Fortschritt

2. Stress-Test Snapshot (Code Node, kein LLM):
   Wende 2 Szenarien (2008 + COVID) auf aktuelles Portfolio an.
   Speichere Ergebnis: "Bei 2008-Szenario: Vermögen von X auf Y"

3. Korrelations-Check (Code Node, kein LLM):
   Berechne Klumpenrisiko-Scores (Währung, Geografie, Liquidität)
   Flagge wenn eine Dimension >60%

4. Sonnet Call: "Erstelle den Weekly Intelligence Brief"
   
   System Prompt (Auto Commentary, inspiriert von BlackRock Aladdin):
   "Du bist der Personal CFO. Schreibe einen wöchentlichen 
   Portfolio-Narrativ in 4 Absätzen. Ton: Wie ein persönlicher 
   CFO beim Frühstücks-Briefing — klar, direkt, keine unnötige 
   Fachsprache.
   
   HINWEIS: Unterscheide zwischen wöchentlichem Update (kurz, 
   nur Veränderungen) und dem ausführlichen Monatsbericht 
   (erste Woche des Monats — mit vollständiger Szenario-Analyse, 
   Stress-Test, Sparquote, und Milestone-Review).
   
   Absatz 1 — WAS IST PASSIERT:
   Nettovermögen [X] (±[Y]% vs. Vormonat). Haupttreiber: 
   [Asset-Klasse]. Immobilien-Equity +[Z] durch Tilgung.
   
   Absatz 2 — KONTEXT:
   Portfolio-Performance vs. Zielrendite. Sparquote [X]%.
   Klumpenrisiko-Status. OSINT: Zielländer stabil/Veränderung.
   Stress-Test: Bei [Krise] wäre Vermögen [X] (−[Y]%).
   
   Absatz 3 — HANDLUNGSBEDARF:
   1-3 priorisierte Aktionen. Fristen die anstehen. 
   Rechtsänderungen die Aktion erfordern (aus Scan).
   
   Absatz 4 — AUSBLICK:
   Exit-Readiness [X]% (±[Y]pp). Nächste Meilensteine.
   GeoArbitrage-Roadmap Status. Szenario-Vergleich Update."
   
   Input: ALLE gesammelten Daten aus Schritt 1-3

5. Telegram Delivery:
   - Kurzversion (max 500 Zeichen): Absatz 1 gekürzt + 
     "📊 Vollständiger Brief im Dashboard"
   - Falls ALARME (Rechtsänderung, OSINT, Budget-Überschreitung):
     Separater Alert SOFORT, nicht auf Monthly Report warten

6. Dashboard: Vollständiger Brief im Scan Tab speichern
   Supabase Insert: monthly_reports (scan_date, narrative TEXT, 
   stress_test_results JSONB, correlation_scores JSONB, 
   actions JSONB)
```

**Ergebnis Sprint 6:** Das System scannt wöchentlich automatisch nach Änderungen, aktualisiert Kurse, und generiert einen Report.

#### 6.3 — Quartalsweiser Quality Review (ehem. Performance Manager)

> **Architektur-Änderung:** Der automatische monatliche Performance Manager
> (ehemals Agent #11) wurde durch einen quartalsweisen manuellen Review
> ersetzt. Begründung: Bei ~80 Anfragen/Monat im Personal Use liefert ein
> vollautomatischer Agent wenig Mehrwert gegenüber manuellem Stichproben-Check.
> Die Datensammlung bleibt automatisiert — nur die Bewertung ist manuell.

**Claude Code Prompt:**
```
Erstelle einen n8n Cron-Workflow "Quarterly Quality Check":

Trigger: Cron (1. Dienstag im Januar, April, Juli, Oktober — 10:00 CET)

Schritte (KEIN LLM — nur Datensammlung + Telegram-Report):

1. DATEN SAMMELN (pro Agent):
   - Supabase Query: agent_logs WHERE letztes Quartal, GROUP BY agent
   - Berechne pro Agent:
     * Anzahl Calls
     * Durchschnittlicher Confidence Score
     * Validator Pass/Correction/Fail Rate
     * Escalation Rate
     * Durchschnittliche Tokens und Kosten pro Call

2. USER FEEDBACK:
   - Supabase Query: user_feedback WHERE letztes Quartal, GROUP BY agent
     * Positive Rate (👍 / gesamt) pro Agent
     * Trend vs. Vorquartal

3. COVERAGE GAPS:
   - Supabase Query: coverage_gaps WHERE letztes Quartal
     * Häufungen identifizieren (≥3 Gaps zum selben Thema)

4. KNOWLEDGE STALENESS CHECK:
   - Supabase Query: knowledge_chunks WHERE updated_at älter als
     Staleness-Schwelle (tax: 6 Monate, immigration: 6, rest: 12)
   - Liste veralteter Chunks erstellen

5. TELEGRAM REPORT (kein LLM, nur Daten-Zusammenfassung):
   - "📊 Quarterly Quality Report Q[X] 2026"
   - Top/Bottom Agent nach Confidence Score
   - Anzahl Coverage Gaps + Häufungen
   - Veraltete Knowledge Chunks (Liste)
   - "→ Review im Dashboard, Prompt-Anpassungen manuell in
     knowledge_base/core-prompts/ vornehmen"
```

**Kosten pro Quarterly Review:** ~0€ (kein LLM-Call, nur DB-Queries + Telegram)

**Manueller Review-Prozess (durch den Mandanten):**
1. Telegram-Report lesen
2. Bei Auffälligkeiten: 2-3 Stichproben-Outputs in agent_logs prüfen
3. Knowledge Chunks aktualisieren (MD-Datei editieren → Re-Embedding triggern)
4. Kern-Prompts anpassen wenn nötig (in `knowledge_base/core-prompts/`)

---

### SPRINT 7: Optimierung + Initiales Setup (laufend)
**Ziel:** System mit echten Daten befüllen, erste vollständige Analyse durchführen.

#### 7.1 — Initiale Daten einpflegen

**Via Telegram an den Bot (oder direkt in Supabase):**

```
Immobilien:
"Immobilie hinzufügen: ETW Düsseldorf Bilk, Kaufdatum [DATUM], 
Kaufpreis [BETRAG], aktueller Wert [BETRAG], Miete [BETRAG]/Monat, 
Kredit [BETRAG] zu [ZINS]%, Privatbesitz, AfA linear 2%"

Portfolio:
"Portfolio: 42x VWCE zu 108.50€, 85x EIMI zu 28.40€, 
0.12 BTC zu 52.000€, 1.8 ETH zu 2.800€"

Budget:
"Gehalt netto: 4.200€, Miete: 950€, Versicherungen: 380€, 
Lifestyle-Budget: 800€, ETF-Sparplan: 500€, Krypto: 200€, 
Notreserve: 300€, GeoArbitrage Fund: 400€"
```

#### 7.2 — Erste vollständige System-Analyse

**Frage über Telegram:**
```
"Bitte analysiere meine Gesamtsituation für das GeoArbitrage-Projekt:
- Angestellt, ~100k brutto, Immobilie in Düsseldorf
- Ziel: Steuerdomizil mittelfristig verlagern (UAE oder Zypern)
- Immobilienportfolio ausbauen (Hebel + Steuervorteile)
- Zweite Staatsbürgerschaft erwerben
- Welche Schritte muss ich in welcher Reihenfolge gehen?"
```

Diese Frage aktiviert den vollen Agent-Flow: CFO routet an Tax + Immo + Immigration + Corporate → Validator & Stress-Tester → Decision Brief.

#### 7.3 — Knowledge Base erweitern (laufend)

**Claude Code Prompt:**
```
Erstelle ein Script das folgende frei verfügbare Rechtstexte 
herunterlädt und in die Knowledge Base ingested:

1. AStG von gesetze-im-internet.de
2. EStG (relevante Paragraphen) von gesetze-im-internet.de
3. GrEStG von gesetze-im-internet.de
4. DBA-Texte vom BMF (soweit als PDF verfügbar)

Das Script soll:
- Die Webseiten fetchen
- Den relevanten Text extrahieren
- In Chunks aufteilen
- Embeddings generieren
- In Supabase speichern

Verwende BeautifulSoup für Web Scraping und die bestehende 
ingest_documents.py Pipeline.
```

---

## Referenz: Vollständige Agenten-System-Prompts

Die **schlanken Kern-Prompts** für alle 9 Agenten befinden sich in
**`knowledge_base/core-prompts/`**. Das Detailwissen ist in die
RAG-basierte Knowledge Base ausgelagert (**`knowledge_base/`**).

Die ursprünglichen vollständigen Agenten-Definitionen sind weiterhin als
Referenz in **"geo-arbitrage-ai-team-v2.md"** verfügbar, werden aber
NICHT mehr direkt als System Prompts verwendet.

> **Prompt-Architektur (NEU):** Jeder Agent bekommt:
> 1. Kern-Prompt (~500-700 Tokens) aus `core-prompts/`
> 2. Mandantenprofil (~200 Tokens) aus `shared/mandantenprofil.md` — IMMER
> 3. Output-Standards (~200 Tokens) aus `shared/output-format-standards.md` — IMMER
> 4. RAG-Chunks (~800-1200 Tokens) aus Knowledge Base — NUR relevante
>
> Gesamt: ~1.700 Tokens statt vorher ~6.000-8.000 Tokens

Kurzreferenz — welcher Prompt wo:

| Agent | Modell | Kern-Prompt |
|-------|--------|-------------|
| CFO Orchestrator | Haiku 4.5 | `core-prompts/agent-08-cfo.md` |
| Tax Architect | Sonnet 4.6 | `core-prompts/agent-01-tax-architect.md` |
| Immobilien-Spezialist | Sonnet 4.6 | `core-prompts/agent-02-immobilien.md` |
| Corporate Structure | Sonnet 4.6 | `core-prompts/agent-03-corporate.md` |
| Immigration Agent | Haiku 4.5 | `core-prompts/agent-04-immigration.md` |
| Wealth Manager | Sonnet 4.6 | `core-prompts/agent-05-wealth.md` |
| Insurance Agent | Haiku 4.5 | `core-prompts/agent-06-insurance.md` |
| Relocation Agent | Haiku 4.5 | `core-prompts/agent-07-relocation.md` |
| Validator & Stress-Tester | Sonnet 4.6 | `core-prompts/agent-09-validator.md` |

> **Änderungen gegenüber v2:**
> - Devil's Advocate in Validator integriert (1 statt 2 QC-Calls pro Anfrage)
> - Performance Manager entfernt (quartalsweiser manueller Review)
> - 11 → 9 Agenten, ~50% weniger API-Kosten

---

## Referenz: Datenbank-Schema

Das Basis-Schema wird in Sprint 1.2 erstellt. Die Erweiterung für die
RAG Knowledge Base (Tabelle `knowledge_chunks` + pgvector + RPC Function)
ist in `knowledge_base/RAG-INTEGRATION.md` dokumentiert und wird in Sprint 2.2 erstellt.

---

## Referenz: Dashboard

Der Dashboard-Prototyp befindet sich in der Datei **"dashboard-v2.jsx"** 
und wird in Sprint 5.1 in ein Next.js-Projekt konvertiert.

Module (6 Tabs):
1. **Überblick:** KPIs (inkl. kompakter Exit-Readiness-Score in KPI-Row),
   Vermögensentwicklung (mit Zeitraum-Switcher + Zielpfad), Asset Allocation
   (mit Prozent-Angaben), Milestone-Kompaktansicht, Fristen (sortiert nach
   Urgency), Exit-Readiness Gauge
2. **Strategie:** Alle strategischen Meilensteine aufklappbar MIT integrierten
   aktiven To-Dos pro Milestone (vormals separater "Projects"-Tab — zusammengeführt),
   Dependency Map, Exit-Readiness Gauge. Tasks zeigen Owner (Agent/Mandant) und
   Status (done/in_progress/open).
3. **Budget:** Plan vs. Ist (gruppiert nach Einkommen/Ausgaben/Invest),
   Overbudget-Alert-Banner, Ziel-Budgets mit Fortschritt
4. **Immobilien:** Portfolio-KPIs, Objekt-Details (5 Kompakt-KPIs inkl.
   Rendite p.a. + Spekulationsfrist), Cashflow standardmäßig aufgeklappt,
   Agent-Empfehlungen, Telegram-Hinweis bei "Immobilie hinzufügen"
5. **Portfolio:** Aktien/ETF/Krypto-Positionen, Performance,
   Wegzugs-Relevanz, Gesamtvermögens-Kontext (mit Prozent-Angaben)
6. **Weekly Scan:** Scan-Ergebnisse, OSINT Country Stability
   (Mobile: Card-Layout, Deutschland als Heimatland markiert),
   Agent-Aktivität, Kosten

---

## Wartung & Key-Rotation (halbjährlich)

Alle Secrets werden beim Setup einmalig gesetzt. Halbjährliche
Rotation (Januar + Juli) reduziert Risiko bei kompromittierten Keys.

**Checklist (9 Keys):**

1. ANTHROPIC_API_KEY → Neue Key in Console, in .env ersetzen, restart, alte Key löschen
2. SUPABASE_SERVICE_ROLE_KEY → Kann im Free Tier NICHT rotiert werden ohne Projekt-Neuanlage
3. BACKUP_PASSPHRASE → Neue Passphrase, alte Passphrase für alte Backups aufbewahren!
4. N8N_ENCRYPTION_KEY → WARNUNG: Rotation = alle Credentials ungültig! NUR bei Verdacht
5. SSH-Key → Optional, bei Verdacht auf Kompromittierung
6. N8N_API_KEY → Neuen Key in n8n Editor, in .env ersetzen, MCP-Verbindung testen
7. N8N_MCP_ACCESS_TOKEN → Instance-Level MCP deaktivieren → re-aktivieren → neuen Token
8. VOYAGE_API_KEY → Neuen Key im Dashboard, in .env ersetzen, Re-Embedding testen
9. TELEGRAM_BOT_TOKEN → Nur bei Kompromittierung (BotFather → /revoke → neuen Token)

Dokumentiere jede Rotation im Passwort-Manager mit Datum.

---

## Kosten-Zusammenfassung

### Einmalig (Setup)

| Posten | Kosten |
|--------|--------|
| Hetzner CPX22 VPS (1. Monat) | 9,51€ |
| Hetzner Cloud Backup (1. Monat) | 1,90€ |
| Claude API (intensive Phase, ~50 Anfragen) | ~10-15€ |
| Voyage AI Embeddings (KB-Aufbau) | 0€ (Free Tier: 200M Tokens) |
| Domain (optional) | ~10€/Jahr |
| **Gesamt Setup** | **~30-35€** |

### Laufend (pro Monat)

| Posten | Kosten | Anmerkung |
|--------|--------|-----------|
| Hetzner CPX22 VPS | 9,51€ | 2 vCPU AMD EPYC, 4 GB RAM, 80 GB NVMe — Preis nach April-2026-Anpassung |
| Hetzner Cloud Backup | ~1,90€ | 20% Aufschlag auf den Serverpreis, 7 Tage Retention |
| Claude API (Agenten + Weekly Scan) | ~2,50-3,50€ | Sonnet 4.6 ($3/$15 pro MTok) + Haiku 4.5 ($1/$5), reduziert durch RAG (~70% weniger Input-Tokens) + DA-Konsolidierung (1 statt 2 QC-Calls) |
| Weekly Scan OSINT (GDELT, ACLED, Polymarket) | 0€ | Free APIs |
| Voyage AI Embeddings (RAG-Queries) | 0€ | Free Tier: 200M Tokens, ~1.600 Tokens/Mo bei 80 Anfragen |
| Supabase (inkl. pgvector) | 0€ | Free Tier |
| Tavily | 0€ | Free Tier, ~180/1000 Searches bei wöchentlichem Scan |
| Twelvedata (Aktien-Kurs Fallback) | 0€ | Free Tier: 800 Req/Tag |
| Vercel | 0€ | Free Tier |
| Yahoo Finance / CoinGecko | 0€ | Free APIs |
| Telegram Bot API | 0€ | Vollständig kostenlos, kein Limit |
| **Gesamt pro Monat** | **~13,90-14,90€** | Preisstand April 2026 nach Hetzner-Anpassung (CPX22 stieg um ca. 30-37%) |

---

## Checkliste: Alle Accounts die du brauchst

Erstelle diese Accounts BEVOR du mit Sprint 1 startest:

> **Reihenfolge beachten:**
> 1. Hetzner + SSH-Key + Server bestellen (brauchst IP für DNS)
> 2. Domain kaufen → DNS A-Record auf Server-IP setzen (braucht bis zu 24-48h Propagation, Cloudflare meist 5-30 Min)
> 3. ACLED Account → Braucht 1-2 Tage für E-Mail-Aktivierung
> 4. Alle anderen Accounts (Reihenfolge egal)
> 5. Telegram Bot als letztes (Chat-ID ermitteln per @userinfobot)
>
> **Tipp:** Alle Zugangsdaten SOFORT in einen Passwort-Manager eintragen (z.B. Bitwarden — kostenlos). API Keys werden oft nur 1x angezeigt!

### Pre-Flight: Infrastruktur (nach VPS-Erstellung)

- [ ] **Hetzner Snapshots aktivieren** — Cloud Console → Server → Backups → Aktivieren (~1,90€/Mo, 20% des Serverpreises). Tägliche automatische Snapshots als Disaster-Recovery-Basis.
- [ ] **Key-Rotation-Checklist** — Halbjährliche Rotation dokumentiert in **security-architecture.md**, Abschnitt "Key-Rotation-Checklist"

### Accounts

- [ ] **Hetzner Cloud** — https://www.hetzner.com/cloud (VPS bestellen)
- [ ] **Tailscale** — https://tailscale.com (VPN + MagicDNS HTTPS aktivieren, kostenlos)
- [ ] **Supabase** — https://supabase.com (Free Tier Projekt)
- [ ] **Anthropic** — https://console.anthropic.com (Claude API Key)
- [ ] **CoinGecko** — https://www.coingecko.com/en/api (Demo API Key, kostenlos — für Krypto-Kurse)
- [ ] **Voyage AI** — https://dash.voyageai.com (Embedding API, Free Tier: 200M Tokens)
- [ ] **Tavily** — https://tavily.com (Web Search API, Free Tier)
- [ ] **Twelvedata** — https://twelvedata.com/register (Aktien-API Fallback, Free Tier: 800 Req/Tag) ← FIX #9
- [ ] **ACLED** — https://acleddata.com/register (Konfliktdaten, kostenlos — OAuth2 seit Sep 2025: E-Mail + Passwort in .env, kein statischer Key)
- [ ] **Vercel** — https://vercel.com (Dashboard Hosting)
- [ ] **GitHub** — https://github.com (Code Repository)
- [ ] **Telegram** — https://t.me/BotFather (Bot erstellen, Token + Chat-ID notieren)
- [ ] **Domain** — z.B. via Cloudflare (optional aber empfohlen)

---

## Glossar (Kurzreferenz)

| Begriff | Bedeutung |
|---------|-----------|
| **VPS** | Virtual Private Server — ein gemieteter Server in der Cloud (wie Hetzner CPX22) |
| **SSH** | Secure Shell — verschlüsselte Verbindung zu deinem Server (statt Passwort: Key-basiert) |
| **Docker** | Software die Apps in isolierten "Containern" ausführt — n8n läuft in einem Container |
| **n8n** | Workflow-Automatisierungstool — das "Gehirn" das deine AI-Agenten orchestriert |
| **Nginx** | Webserver der als "Türsteher" vor n8n steht — leitet nur erlaubte Anfragen weiter |
| **Tailscale** | VPN das ein privates Netzwerk zwischen deinen Geräten erstellt — n8n ist NUR darüber erreichbar |
| **Supabase** | Gehostete PostgreSQL-Datenbank mit Auth und API — dein Datenspeicher |
| **pgvector** | PostgreSQL-Erweiterung für Vektor-Suche — ermöglicht die RAG Knowledge Base |
| **RAG** | Retrieval-Augmented Generation — Fachwissen wird per Similarity Search geladen statt immer mitgeschickt |
| **API Key** | Ein "Passwort" das einer App Zugang zu einem Dienst gibt — nie öffentlich teilen! |
| **Webhook** | Eine URL die auf eingehende Nachrichten wartet — Telegram schickt Nachrichten an deinen Webhook |
| **MCP** | Model Context Protocol — Steckdose zwischen Claude und externen Tools (n8n, Gmail, etc.) |
| **MCP Server Trigger** | n8n-Node der einen Workflow als MCP-Tool für Claude exponiert |
| **DNS** | Domain Name System — übersetzt "webhook.deinedomain.de" in eine IP-Adresse |
| **SSL/HTTPS** | Verschlüsselte Verbindung — das "Schloss" im Browser |
| **UFW** | Uncomplicated Firewall — regelt welche Ports auf dem Server offen sind |
| **RLS** | Row Level Security — Supabase-Feature das sicherstellt dass nur DU deine Daten siehst |
| **.env** | Datei mit geheimen Konfigurationsvariablen (API Keys, Passwörter) — nie in Git commiten! |
| **fail2ban** | Sperrt IP-Adressen die zu oft falsche Login-Versuche machen |
| **Cron** | Zeitgesteuerter Task — z.B. "jeden Sonntag um 3:00 Backup machen" |
| **LLM** | Large Language Model — das AI-Modell (Claude Sonnet/Haiku) das die Agenten antreibt |
| **Embedding** | Mathematische Darstellung von Text als Zahlenvektor — ermöglicht Similarity Search |

---

## Projekt-Dateien (Referenz)

Dieses Projekt besteht aus 4 Dateien/Ordnern:

1. **Dieses Dokument** (`geo-arbitrage-implementation-blueprint.md`)
   Das zentrale Dokument — enthält ALLES: Architektur, Sprint-Plan,
   Security-Maßnahmen, Setup-Anleitung, Kosten, Glossar.
2. **knowledge_base/** — RAG-basierte Knowledge Base
   - `core-prompts/` — 9 schlanke Kern-Prompts (~500-700 Tokens)
   - `tax/` (21), `immobilien/` (15), `corporate/` (14), `immigration/` (13),
     `wealth/` (15), `insurance/` (10), `relocation/` (10) — Fachwissen-Chunks
   - `cfo/` (7) — CFO-Methodik & Prozesse (Cashflow, Steuerkalender, Roadmap, etc.)
   - `shared/` — 3 agentenübergreifende Chunks (Mandantenprofil, Output-Standards, Eskalationsmatrix)
   - `quality/` — 5 QC-Chunks (Validierungs-Checkliste, DA-Angriffsvektoren, Halluzinations-Trigger, Cross-Agent-Matrix, Worst-Case-Szenarien)
   - **Gesamt: 104 Chunks** (Stand März 2026)
   - `RAG-INTEGRATION.md` — Gesamtkonzept, n8n-Workflow, SQL-Schema, Migrationsplan
3. **geo-arbitrage-ai-team-v2.md** — Vollständige Agenten-Definitionen
   (Referenzdokument — operative Prompts jetzt in `knowledge_base/core-prompts/`)
4. **dashboard-v2.jsx** — Dashboard-Prototyp (React/Tailwind/Recharts)

> **Konsolidierung (März 2026):** Die ehemals separaten Dateien
> `security-architecture.md` und `setup-guide-einsteiger.md` wurden
> in dieses Blueprint integriert. Alle Security-Maßnahmen stehen jetzt
> direkt in den Sprint-Abschnitten wo sie implementiert werden.
> Setup-Anleitungen, SSH-Key-Guide und Glossar sind ebenfalls enthalten.
