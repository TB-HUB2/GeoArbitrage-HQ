# GeoArbitrage HQ -- Setup-Anleitung

## Voraussetzungen

### Accounts erstellen (alle kostenlos oder guenstig)

| Account | URL | Zweck | Kosten |
|---------|-----|-------|--------|
| Hetzner Cloud | hetzner.com/cloud | VPS fuer n8n | 4,51 EUR/Mo (CX22) |
| Supabase | supabase.com | Datenbank + Auth | Free Tier |
| Anthropic | console.anthropic.com | Claude API (LLM) | Pay-per-use (~2-3 EUR/Mo) |
| Voyage AI | dash.voyageai.com | Embeddings | Free Tier (200M Tokens) |
| Tailscale | tailscale.com | VPN (n8n-Zugang) | Free Tier |
| Cloudflare | cloudflare.com | DNS + SSL + Access | Free Tier |
| Vercel | vercel.com | Dashboard Hosting | Free Tier |
| Telegram | telegram.org | Bot API | Kostenlos |
| Google | console.cloud.google.com | Calendar API | Kostenlos |

### Tools installieren

1. **Node.js** (>= 20.x) — fuer Claude Code und Dashboard
2. **Claude Code** — `npm install -g @anthropic-ai/claude-code`
3. **Docker + Docker Compose** — auf dem Hetzner VPS
4. **Git** — Versionskontrolle
5. **Python 3** — fuer Ingest-Scripts (auf dem VPS)

## Schritt-fuer-Schritt Setup

### 1. Hetzner VPS bestellen

- Server-Typ: CX22 (2 vCPU, 4 GB RAM, 40 GB SSD)
- OS: Ubuntu 24.04
- Standort: Nuernberg oder Falkenstein
- SSH-Key hinzufuegen (nicht Passwort-Login!)

### 2. Tailscale installieren

Auf deinem lokalen Rechner UND auf dem VPS:

```bash
# Auf dem VPS
curl -fsSL https://tailscale.com/install.sh | sh
tailscale up
```

Danach erreichst du den VPS ueber `ssh USER@VPS_NAME` im Tailscale-Netz.

### 3. Docker auf dem VPS installieren

```bash
# Docker Engine
curl -fsSL https://get.docker.com | sh
# Docker Compose Plugin
apt install docker-compose-plugin
# User zur Docker-Gruppe hinzufuegen
usermod -aG docker $USER
```

### 4. Projekt-Verzeichnis erstellen

```bash
mkdir -p /opt/geoarbitrage
cd /opt/geoarbitrage
# .env, docker-compose.yml, nginx.conf aus template/infrastructure/ kopieren
```

### 5. Supabase einrichten

1. Neues Projekt erstellen auf supabase.com
2. SQL-Dateien aus `sql/` im SQL Editor ausfuehren (Reihenfolge beachten: 01, 02, 03...)
3. pgvector Extension aktivieren (wird in 01_extensions.sql gemacht)
4. Notiere dir:
   - Project URL: `https://YOUR_PROJECT.supabase.co`
   - Anon Key (fuer Dashboard)
   - Service Role Key (fuer n8n — NIEMALS im Frontend!)

### 6. API Keys besorgen

| Service | Wo? | Key-Name |
|---------|-----|----------|
| Anthropic | console.anthropic.com -> API Keys | ANTHROPIC_API_KEY |
| Voyage AI | dash.voyageai.com -> API Keys | VOYAGE_API_KEY |
| Telegram | @BotFather in Telegram -> /newbot | TELEGRAM_BOT_TOKEN |
| Tavily | tavily.com -> API Keys | TAVILY_API_KEY |
| Google Calendar | console.cloud.google.com -> Credentials | GOOGLE_CALENDAR_CLIENT_ID/SECRET |

### 7. Domain einrichten (Cloudflare)

1. Domain kaufen oder bestehende nutzen
2. In Cloudflare als Zone hinzufuegen
3. DNS-Eintraege:
   - `YOUR_DOMAIN.com` → A-Record auf `216.198.79.1` (Vercel)
   - `webhook.YOUR_DOMAIN.com` → A-Record auf Server-IP (Cloudflare Proxy AN)
4. SSL-Modus: **Full** (NICHT Flexible fuer Vercel!)

### 8. .env ausfuellen

```bash
cd /opt/geoarbitrage
cp .env.example .env
nano .env  # Alle YOUR_* Platzhalter ersetzen
```

### 9. n8n starten

```bash
docker compose up -d
# Logs pruefen:
docker compose logs -f n8n
# Health-Check:
curl http://localhost:5678/healthz
```

### 10. n8n API Key erstellen

Der API Key muss ueber die n8n UI erstellt werden (Settings -> n8n API).
Der generierte Key ist ein JWT-Token (~267 Zeichen).
Diesen Key in `.env` als `N8N_API_KEY` eintragen (optional, fuer CLI-Zugang).

**WICHTIG:** Die env var `N8N_API_KEY` wird in n8n 2.14+ IGNORIERT.
Der Key muss ueber die UI erstellt werden!

### 11. Dashboard deployen (Vercel)

```bash
cd dashboard
npm install
# .env.local erstellen:
cp .env.local.example .env.local
# Supabase URL + Anon Key eintragen
nano .env.local
# Lokal testen:
npm run dev
```

Dann auf Vercel deployen:
1. Vercel-Account mit GitHub verbinden
2. Projekt importieren
3. Environment Variables setzen:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

### 12. Supabase Auth einrichten

1. Authentication -> Providers -> Email aktivieren
2. **Signup deaktivieren** (nur bestehende User koennen sich anmelden)
3. User anlegen:
   - Supabase Dashboard -> Authentication -> Users -> Add User
   - Email + Passwort setzen
4. Site URL setzen: `https://YOUR_DOMAIN.com`
5. Redirect URLs: `https://YOUR_DOMAIN.com/auth/callback`

### 13. RLS-Policies aktivieren

```sql
-- In sql/07_rls_policies.sql:
-- Ersetze YOUR_USER_UUID mit der UUID deines Users
-- (findbar in Supabase -> Authentication -> Users)
```

### 14. Knowledge Base aufbauen

```bash
# Auf dem VPS:
cd /opt/geoarbitrage
pip3 install -r scripts/requirements.txt
# PDFs ingestieren:
python3 scripts/ingest_documents.py --file /pfad/zur/datei.pdf \
  --bereich tax --source_type law --source_name "AStG"
```

### 15. Telegram Webhook einrichten

```bash
# Bot-Token von @BotFather
# Webhook setzen:
curl -X POST "https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://webhook.YOUR_DOMAIN.com/webhook/telegram", "secret_token": "YOUR_SECRET_TOKEN"}'
```

## Sprint-Reihenfolge

Jetzt bist du bereit fuer die Sprints! Oeffne `SPRINT_GUIDE.md` und starte mit Sprint 1.

| Sprint | Dauer | Inhalt |
|--------|-------|--------|
| 1 | 2 Wochen | Foundation: Server, DB, erster Agent |
| 2 | 2 Wochen | Chat Memory, Agent Logging, RAG Pipeline |
| 3 | 2 Wochen | Knowledge Base, Embedding, Gap Detection |
| 4 | 2 Wochen | Alle 9 Agenten + Multi-Agent Routing |
| 5 | 2 Wochen | Dashboard + Telegram Bot |
| 6 | 2 Wochen | Weekly Scan + Calendar + Reports |
| 7 | 2 Wochen | APIs, Monitoring, Security Hardening |

## Sicherheitsregeln (nicht verhandelbar!)

- n8n NIEMALS auf oeffentlicher IP exponieren — NUR ueber Tailscale VPN
- Supabase Service Role Key NIEMALS im Frontend
- Alle API-Keys nur in `/opt/geoarbitrage/.env`
- Telegram Webhook MUSS Secret Token verifizieren
- Anthropic API Spending Limit setzen (z.B. 20 EUR/Monat)
- ufw Firewall aktivieren: `sudo ufw default deny incoming && sudo ufw allow 22/tcp && sudo ufw allow 80/tcp && sudo ufw allow 443/tcp && sudo ufw enable`
