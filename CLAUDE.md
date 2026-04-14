# GeoArbitrage HQ -- Bug & Learnings Tracker

## Goldene Regeln (aus Sprint 1-7 gelernt)

### Deploy-Reihenfolge (IMMER!)
1. `n8n import:workflow --input=file.json`
2. `n8n publish:workflow --id=X`
3. `docker compose up -d` (NICHT `restart`! Restart laedt keine neuen env vars)

### n8n Updates & Security
- Bei BSI/CVE-Warnungen: **SOFORT** patchen, nicht warten
- Update-Ablauf: `docker-compose.yml` Image-Tag aendern -> `docker compose pull n8n` -> `docker compose up -d`
- Nach jedem Update: Version verifizieren (`docker compose exec n8n n8n --version`) + Health Check (`curl http://127.0.0.1:5678/healthz`)
- Altes Image nach erfolgreichem Update entfernen: `docker image rm docker.n8n.io/n8nio/n8n:ALTE_VERSION`
- n8n Editor ist NUR ueber Tailscale VPN erreichbar -- NIEMALS Port 5678 oeffentlich exponieren
- Webhook-Exposure: Nginx erlaubt NUR `/webhook/telegram` oeffentlich, alles andere `return 444`
- **Post-Patch IoC-Checkliste**: User-Accounts, API-Keys, Workflows, Container-Dateien, Prozesse, Netzwerk-Verbindungen pruefen

### Supabase
- Schema IMMER zuerst pruefen bevor Inserts gebaut werden (Spalten, Typen, Constraints!)
- REST API hat **Default-Limit 1000 Rows** -- bei Audits immer `Range: 0-9999` Header oder Pagination nutzen
- Batch-Inserts: Alle Objekte MUESSEN identische Keys haben (PGRST102 Fehler sonst)
- `target_countries.priority` hat Check-Constraint: Wert muss >= 1 sein
- Spalte heisst `relevante_agenten` (nicht `relevant_agenten`), kein `embedding_model`
- **Dashboard-Feldnamen != Supabase-Feldnamen!** Mapping IMMER in hooks.ts, siehe "Dashboard Field Mapping Audit"
- Berechnete Felder (equity, cashflow etc.) existieren NICHT in Supabase -- werden im Frontend berechnet
- **Budget-Typen**: `income`, `expense`, `investment`, `reserve` -- NICHT `invest`! (Bug #E2E-1)

### Webhook-Feldnamen
- CFO Webhook sendet `user_message`, NICHT `message`
- In JEDEM Node IMMER Fallback-Kette: `body.user_message || body.message || ''`
- Voyage Embedding, Intent Classification, Chat speichern -- alle muessen beide Feldnamen abfangen

### Dateien auf dem Server editieren
- **NIEMALS** `sed` fuer Multi-Line-Inserts in docker-compose.yml -> erzeugt `\n` literal statt Newline
- IMMER Python-Script oder direkte Datei-Schreibung verwenden

### n8n API Key
- N8N_API_KEY env var wird in n8n 2.14+ **ignoriert**
- API Key MUSS ueber n8n UI erstellt werden (Settings -> n8n API)
- Der echte Key ist ein JWT-Token (267 Zeichen), gespeichert in `user_api_keys` Tabelle in Postgres
- .env muss den echten JWT enthalten, nicht einen Platzhalter

### API-Aufrufe
- Yahoo Finance: IMMER `User-Agent: Mozilla/5.0` Header setzen
- Voyage AI Free Tier: Max ~280 RPM, bei Batch-Ingest 8-15s Pause zwischen Batches
- GDELT v2: Rate Limits bei vielen Calls -- im Weekly Scan (1x/Woche) kein Problem
- Twelvedata Free Tier: NUR US-Ticker (AAPL, SPY, XAU/USD). EU-ETFs (VWCE.DE) brauchen Paid Plan -> Yahoo Finance ist Primary
- ACLED: Base-URL ist `https://acleddata.com/api/acled/` (NICHT api.acleddata.com -- alte Subdomain ist tot!)
- ACLED: OAuth2 Token via `POST https://acleddata.com/oauth/token` (username/password/grant_type=password/client_id=acled)

### Knowledge Base Ingest
- PDF-Ingest: `ingest_documents.py` (braucht pdfplumber/pypdf)
- Markdown-Ingest: `ingest_markdown.py` (splittet an ## Headings -- bei fehlenden Headings nur 1-2 Chunks!)
- Fuer Texte ohne Headings: Token-basiertes Chunking verwenden (2000 chars, 200 overlap)
- DBA-Texte: Auf gesetze-im-internet.de oft nur Stubs ("nicht zu ermitteln") -- **doppelbesteuerung.eu** hat Volltexte als HTML
- DBA-PDFs vom BMF: Manche sind Bild-PDFs (Scan) ohne extrahierbaren Text -> HTML-Quelle nutzen

### Webhook-Tests
- IMMER `--max-time 600` / `timeout: 600000`
- Bei Timeout: ERST n8n Executions pruefen, NICHT sofort retry (kostet LLM-Geld)

## Sprint 5-6 Bugs (alle gefixt)
- **#5-1**: n8n import deaktiviert Workflows -> publish + restart noetig
- **#6-1**: GDELT v1 API 404 -> migriert auf v2 DOC API (Sprint 7)
- **#6-2**: Yahoo Finance leere Response -> User-Agent Header
- **#6-3**: n8n Owner-Reset nach recreate -> Owner vollstaendig ausfuellen
- **#6-4**: sed Multi-Line Injection -> Python statt sed
- **#6-5**: OAuth redirect_uri_mismatch -> EDITOR_BASE_URL ohne :5678
- **#6-6**: Google OAuth Testnutzer -> unter Zielgruppe hinzufuegen

## Sprint 7 Learnings

### Learning #7-1: Supabase REST API Pagination
- Default-Limit ist 1000 Rows. Ohne Pagination fehlen Daten bei Audits!
- Fix: `Range: 0-9999` Header oder `offset/limit` Parameter nutzen
- Hat zu falschem KB-Audit gefuehrt (1000 statt 1912 Chunks gezaehlt)

### Learning #7-2: Cloudflare Flexible SSL fuer Webhooks
- Cloudflare Proxied Mode + Flexible SSL = Cloudflare terminiert SSL, verbindet zu Origin via HTTP (Port 80)
- Nginx braucht KEINEN SSL-Block fuer Cloudflare-Domains -- einfach Port 80 Server-Block reicht
- `$http_cf_connecting_ip` fuer echte Client-IP statt `$remote_addr` (bekommt sonst Cloudflare-IP)

### Learning #7-3: n8n API Key ist JWT, nicht statischer String
- Der in der UI erstellte Key ist ein JWT-Token (~267 Zeichen)
- Muss exakt so in .env stehen -- ein Platzhalter-Hash funktioniert nicht
- Key ueberlebt `docker compose up -d` (gespeichert in Postgres, nicht im Container)

### Learning #7-4: Workflow-JSON braucht ID fuer Import
- `n8n import:workflow` schlaegt fehl wenn keine `"id"` im Root-Objekt des JSON steht
- Fix: `"id": "WorkflowName01"` als erstes Feld ins JSON einfuegen

### Learning #7-5: Vercel + Cloudflare Domain Setup
- Vercel braucht A-Record auf `216.198.79.1` (nicht CNAME auf vercel.app)
- Cloudflare Proxy (orange Wolke) verursacht "Invalid Configuration" in Vercel -- ignorieren
- Vercel erstellt automatisch www-Redirect -> in Vercel auf "Connect to environment" umstellen, sonst ERR_NAME_NOT_RESOLVED
- Cloudflare SSL muss auf **Full** stehen (nicht Flexible)
- Cloudflare Access: One-Time PIN schickt Code an JEDE Email, blockt aber Login wenn Email nicht in Policy
- Domain-Verifizierung: Proxy kurz auf DNS-only, Vercel verifizieren lassen, dann Proxy wieder an

## Sprint 7 Aenderungen (komplett)
- [x] ACLED Credentials in .env + docker-compose.yml
- [x] GDELT v1 -> v2 DOC API (TimelineTone + TimelineVol)
- [x] Polymarket Datum-Filter (endDate + createdAt)
- [x] Beispieldaten: 7 target_countries, 1 property, 5 holdings, 10 budget, 1 snapshot, 3 goals
- [x] Knowledge Base: GrEStG (14), DBA Portugal (31), DBA Georgien (33) ingested
- [x] CFO Agent Flow Test: 5 Agenten, Confidence 80%, 48.670 Zeichen
- [x] YOUR_DOMAIN.com: Cloudflare DNS + Nginx + Vercel + Cloudflare Access
- [x] Dashboard: YOUR_DOMAIN.com mit Cloudflare Access Login (One-Time PIN, nur YOUR_EMAIL@example.com)
- [x] Telegram Webhook: webhook.YOUR_DOMAIN.com (Cloudflare SSL)
- [x] n8n API Key: Echter JWT in .env korrigiert (aus user_api_keys Tabelle)
- [x] Alle 11 APIs getestet und funktionsfaehig
- [x] Port 8443 Legacy-Block entfernt (nginx + docker-compose.yml)
- [x] Infrastructure Health Check Workflow geloescht

## Security Hardening (April 2026)
- [x] CSP Header in vercel.json (connect-src nur *.supabase.co, frame-ancestors 'none')
- [x] X-DNS-Prefetch-Control: off in vercel.json
- [x] poweredByHeader: false in next.config.js (versteckt Next.js-Fingerprint)
- [x] Dedicated Server-User `geoarbitrage` statt root (docker-Gruppe, Ownership /opt/geoarbitrage/, Crontab migriert)
- [x] Supabase Auth einrichten + anon-Policies auf authenticated umstellen (April 2026)
- [x] **n8n 2.14.0 -> 2.14.1** Security-Patch (BSI-Warnung, 12 CVEs, 08.04.2026)
- [x] **ufw Firewall** aktiviert: deny incoming, allow 22/80/443 only
- [x] Altes Docker Image `n8n:2.14.0` entfernt

### n8n Security Patch (08.04.2026)
- **Anlass**: BSI-Warnung -- 12 CVEs (11x Critical CVSS 9.4-10.0, 1x High)
- **Betroffene Version**: n8n 2.14.0 (2 von 12 CVEs relevant: CVE-2026-33660, CVE-2026-33696)
- **Gepatchte Version**: n8n 2.14.1
- **Exposure-Bewertung**: NIEDRIG -- n8n Editor nur ueber Tailscale VPN erreichbar, einziger oeffentlicher Pfad ist `/webhook/telegram` via Cloudflare
- **IoC-Check**: Keine Kompromittierung festgestellt (keine fremden User/Workflows/Dateien/Prozesse/Verbindungen)
- **Massnahmen**: Image-Update, Container-Recreate, ufw-Firewall, altes Image entfernt

### ufw Firewall (ab 08.04.2026)
- **Status**: Aktiv, startet automatisch bei Reboot
- **Default**: deny incoming, allow outgoing
- **Regeln**: 22/tcp (SSH), 80/tcp (HTTP Cloudflare+Tailscale), 443/tcp (HTTPS Tailscale n8n)
- **Tailscale**: Hat eigene Regeln auf `tailscale0` Interface (Port 22, 5678)
- **Pruefen**: `sudo ufw status verbose`

### Supabase Auth + RLS (April 2026)
- **Email Provider**: Aktiviert, Signup DEAKTIVIERT (nur bestehender User kann sich anmelden)
- **User**: `YOUR_EMAIL@example.com` (UUID: `YOUR_USER_UUID`)
- **Auth-Paket**: `@supabase/ssr` (Cookie-basierte Sessions, SSR-kompatibel)
- **Middleware**: `dashboard/src/middleware.ts` -- schuetzt alle Routes, Redirect auf `/login`
- **Login-Seite**: `dashboard/src/app/login/page.tsx` -- Email + Passwort, "Passwort vergessen"
- **Auth Callback**: `dashboard/src/app/auth/callback/route.ts` -- PKCE Code Exchange + Open-Redirect-Schutz
- **Passwort-Reset**: `dashboard/src/app/auth/reset-password/page.tsx` -- Neues Passwort setzen nach Reset-Email
- **RLS-Policies**: Alle sensitiven Tabellen auf `auth.uid() = UUID` (15 Tabellen)
- **knowledge_base/knowledge_gaps**: `authenticated_read` + `owner_write` + `service_role_all`
- **n8n Workflows**: Nutzen weiterhin `service_role` Key (RLS-Bypass, nicht betroffen)
- **SQL**: `sql/06_auth_rls_hardening.sql` (RLS-Hardening Script)
- **Site URL**: `https://YOUR_DOMAIN.com` (in Supabase Auth URL Configuration)
- **Redirect URLs**: `https://YOUR_DOMAIN.com/auth/callback` + `http://localhost:3000/auth/callback`
- **Erster Login**: Passwort per "Passwort vergessen" Button auf Login-Seite setzen (Reset-Email)

### SSH-Zugang (ab April 2026)
- **User**: `geoarbitrage` (NICHT mehr root)
- **Befehl**: `ssh geoarbitrage@YOUR_TAILSCALE_HOSTNAME` (Tailscale SSH)
- **Docker**: User ist in docker-Gruppe, docker compose/exec funktioniert ohne sudo
- **root bleibt als Fallback** erreichbar, soll aber nicht mehr standardmaessig genutzt werden
- **ACHTUNG**: `geoarbitrage` hat KEIN sudo-Passwort -- fuer Firewall-Aenderungen, Systemd, etc. `ssh root@YOUR_TAILSCALE_HOSTNAME` nutzen

## Dashboard Field Mapping Audit (April 2026)

### Goldene Regel: Dashboard <-> Supabase Feldnamen
- Supabase-Tabellen haben **deutsche/lange Feldnamen** (z.B. `loan_amount_current`, `monthly_rent_gross`)
- Dashboard erwartet **kurze/englische Feldnamen** (z.B. `loan`, `rent_gross`)
- **IMMER** Mapping in den hooks.ts Hooks machen, NICHT im page.tsx
- **VOR jedem neuen Dashboard-Feature**: `curl .../rest/v1/tabelle?select=*&limit=1` -> echte Feldnamen pruefen!

### Properties -- Berechnete Felder (in hooks.ts)
Supabase `properties` hat NUR Rohdaten. Folgende Felder werden im Frontend berechnet:
| Berechnetes Feld | Formel |
|---|---|
| `equity` | `current_value - loan_amount_current` |
| `monthly_interest` | `loan_amount_current x (loan_rate / 100) / 12` |
| `monthly_principal` | `loan_monthly_payment - monthly_interest` |
| `cashflow_before_debt` | `monthly_rent_gross - monthly_hausgeld - monthly_nicht_umlagefaehig - monthly_interest` |
| `cashflow_after_debt` | `cashflow_before_debt - monthly_principal` |
| `wealth_growth_monthly` | `monthly_principal + cashflow_after_debt` |

### Properties -- Feldname-Mapping (DB -> Dashboard)
| Supabase-Feld | Dashboard-Feld |
|---|---|
| `current_value` | `value` |
| `loan_amount_current` | `loan`, `remaining_loan` |
| `monthly_rent_gross` | `rent_gross` |
| `monthly_hausgeld` | `hausgeld` |
| `monthly_nicht_umlagefaehig` | `non_recoverable` |
| `loan_monthly_payment` | `monthly_payment` |
| `loan_bank` | `bank` |
| `loan_zinsbindung_end` | `fixed_rate_end` |
| `current_value_date` | `last_valuation_date` |

### Wealth Snapshots -- Feldname-Mapping
| Supabase-Feld | Dashboard-Feld |
|---|---|
| `nettovermoegen` | war falsch als `total_net_worth` referenziert -- gefixt |

### Savings Goals -- Feldname-Mapping (in hooks.ts)
| Supabase-Feld | Dashboard-Feld |
|---|---|
| `current_amount` | `current` |
| `target_amount` | `target` |
- **Kein `priority`-Feld** -- sortiert nach `created_at`

### Portfolio Holdings -- Feldname-Mapping (in hooks.ts)
| Supabase-Feld | Dashboard-Feld |
|---|---|
| `sparplan_monthly` | `sparplan` |
- `value`, `cost`, `pl`, `plPct`, `color` werden berechnet

### Tabellen ohne Mapping-Probleme
- **budget**: Feldnamen stimmen ueberein
- **calendar_events**: `urgency` wird im Frontend aus `event_date` berechnet
- **exit_prerequisites**: `met`, `weight`, `label` korrekt
- **milestones**: Noch keine Daten, Felder nicht verifiziert
- **monthly_scan_results**: Noch keine Daten, Code hat defensive Fallbacks

## Dashboard Mobile Bugs (April 2026 -- alle gefixt)

### Bug #M-1: SectionHeader Buttons Overflow auf Mobile
- **Problem**: "6M" Button rutschte aus dem Container bei "VERMOEGENSENTWICKLUNG"
- **Ursache**: `tracking-widest` + langer Titel + keine Overflow-Kontrolle
- **Fix**: `text-[10px] sm:text-sm` + `tracking-wide sm:tracking-widest` + `whitespace-nowrap`
- **Regel**: Bei langen deutschen Titeln IMMER responsive Font-Groesse + Tracking verwenden

### Bug #M-2: Properties zeigten 0 EUR ueberall
- **Problem**: Eigenkapital, Cashflow, Tilgung, Vermoegensaufbau alle 0 EUR
- **Ursache**: Dashboard las `p.equity`, `p.monthly_principal` etc. -- diese Felder existieren NICHT in Supabase
- **Fix**: `useProperties` Hook berechnet jetzt alle abgeleiteten Felder aus Rohdaten
- **Regel**: Supabase hat NUR Rohdaten. Alle Berechnungen MUESSEN im Frontend (hooks.ts) passieren!

### Bug #M-3: Vermoegensentwicklung Chart zeigte 0 EUR
- **Problem**: Chart las `s.total_net_worth` -- Feld existiert nicht
- **Ursache**: Supabase-Feld heisst `nettovermoegen`
- **Fix**: Fallback-Kette `s.nettovermoegen || s.total_net_worth || s.total`

### Bug #M-4: Savings Goals zeigten 0 EUR
- **Problem**: `g.current` und `g.target` waren undefined
- **Ursache**: Supabase-Felder heissen `current_amount` und `target_amount`
- **Fix**: Mapping in `useSavingsGoals` Hook

### Bug #M-5: Sparplan/Mo zeigte 0 EUR
- **Problem**: `h.sparplan` war undefined
- **Ursache**: Supabase-Feld heisst `sparplan_monthly`
- **Fix**: Mapping in `usePortfolio` Hook

## E2E Test (April 2026) -- Ergebnisse & Fixes

### Testumfang
- 10 Testbloecke, 7 Phasen, ~70 Minuten, Kosten ~$0.34
- Infrastruktur, APIs, RAG, Dashboard, CFO Multi-Agent, Telegram, Edge Cases, Auth/RLS, Datenintegritaet

### Bug #E2E-1: Budget KPI "Investiert" zeigte 0 EUR (GEFIXT)
- **Problem**: `useBudget()` Hook filterte nach `type === "invest"`, aber DB nutzt `"investment"` und `"reserve"`
- **Ursache**: Typ-String Mismatch zwischen DB-Schema und Frontend-Code
- **Fix**: `hooks.ts` Zeile 68: `b.type === "investment" || b.type === "reserve"`
- **Fix**: `page.tsx` Zeile 329: Budget Plan vs. Ist Gruppen um `investment` und `reserve` erweitert
- **Regel**: Budget-Typen in der DB sind: `income`, `expense`, `investment`, `reserve` -- NICHT `invest`!

### Bug #E2E-2: Sparquote zeigte 0% (GEFIXT)
- **Problem**: Sparquote = invest / income -- da invest=0 war auch Sparquote=0
- **Ursache**: Gleicher Typ-Mismatch wie #E2E-1
- **Fix**: Durch #E2E-1 mitgeloest

### Bug #E2E-3: Chat History Embeddings fehlten (GEFIXT)
- **Problem**: Episodic Memory funktionierte nicht -- `embedding` Spalte war NULL fuer alle Chat-Eintraege
- **Ursache 1**: Voyage Embedding Node im CFO Workflow las `body.message` statt `body.user_message`
- **Ursache 2**: "Chat speichern" Node hatte PGRST102 Fehler -- Batch-Insert mit unterschiedlichen Keys (User hatte `embedding`+`embedding_model`, Assistant nicht)
- **Fix 1**: Voyage Node Body: Fallback-Kette `body.user_message || body.message || ''`
- **Fix 2**: Authorization Header kanonisiert: `={{ 'Bearer ' + $env.VOYAGE_API_KEY }}`
- **Fix 3**: Chat speichern: BEIDE Rows haben jetzt `embedding` + `embedding_model` Keys (Assistant mit `null`)
- **Regel**: Webhook sendet `user_message`, nicht `message` -- IMMER Fallback-Kette nutzen!
- **Regel**: Supabase Batch-Inserts: ALLE Objekte im Array MUESSEN identische Keys haben, auch wenn Werte `null` sind!

### Bug #E2E-4: Wealth Manager 4x in agent_logs (GEFIXT)
- **Problem**: SplitInBatches-Loop rief Logger mehrfach fuer denselben Agenten auf
- **Ursache**: Fehlende Deduplizierung im Logger: Agent vorbereiten Node
- **Fix**: Dedup-Logik mit `$getWorkflowStaticData('global')` -- trackt geloggte Agenten pro Execution-ID
- **Regel**: Bei SplitInBatches Loops IMMER pruefen ob Fire-and-Forget Nodes mehrfach getriggert werden

### Bug #E2E-5: Budget "gehalt" Duplikat (GEFIXT)
- **Problem**: Gehalt erschien 2x in Budget Plan vs. Ist
- **Ursache**: Beispieldaten hatten 2 identische Eintraege
- **Fix**: Doppelten Eintrag per Supabase REST API geloescht (ID: <specific-row-id>)

### Bug #E2E-6: Telegram /budget Kategorie "sonstiges" (GEFIXT)
- **Problem**: `/budget April 2026 500 Lebensmittel` erstellte Kategorie "sonstiges" statt "Lebensmittel"
- **Ursache 1**: `/budget` Befehl wurde nicht als `data_entry` Intent erkannt (Regex matchte nur Woerter wie `gehalt`, `miete`)
- **Ursache 2**: Haiku Parse-Prompt hatte feste Kategorie-Liste -- Freitext-Kategorien wurden auf "sonstiges" gemappt
- **Ursache 3**: Type-Mapping nutzte `invest` statt `investment`/`reserve`
- **Fix 1**: Slash-Command-Erkennung: `/budget` -> data_entry Intent
- **Fix 2**: Haiku Prompt akzeptiert jetzt Freitext-Kategorien, nutzt User-Wording
- **Fix 3**: Type-Mapping korrigiert: `investment`/`reserve` statt `invest`
- **Regel**: Telegram Intent-Erkennung MUSS Slash-Commands abdecken! Bei neuen Commands: Regex in "Validieren & Parsen" erweitern

### Learning #E2E-7: ACLED API URL
- **Problem**: `api.acleddata.com` loest nicht mehr auf (DNS NXDOMAIN)
- **Status**: KEIN BUG im Workflow -- der nutzt bereits die korrekte URL `acleddata.com/api/acled/`
- **Regel**: ACLED API Base-URL ist `https://acleddata.com/api/acled/` (NICHT `api.acleddata.com`)
- **OAuth**: `https://acleddata.com/oauth/token` (POST mit username/password/grant_type/client_id)

### Learning #E2E-8: RAG Similarity fuer Gesetzestexte
- AStG-Chunks (57 Stueck) haben korrekte `relevante_agenten` (Tax Architect, CFO)
- Similarity-Scores fuer direkte Gesetzesfragen liegen bei ~0.33 (Voyage voyage-4-lite)
- Ursache: PDF-Boilerplate (Ministerium-Header, Seitenzahlen) verwuessert Embeddings
- Threshold 0.3 ist korrekt gesetzt -- findet relevante Chunks trotzdem
- **TODO**: Bei Re-Ingest Boilerplate-Zeilen aus PDFs entfernen fuer bessere Embeddings

### Bestandene Tests (alle PASS)
- SSH, Docker (3 Container), Webhook-Domain, n8n UI, Dashboard Login
- Yahoo Finance, GDELT v2, ACLED (korrekte URL), Polymarket, Voyage AI, Anthropic, Telegram Bot
- RAG E2E: 1976 Chunks, 1024-dim Embeddings, match_knowledge() RPC
- RLS: 12 Tabellen blockieren Anon-Zugriff korrekt
- CFO Multi-Agent: 4 Agenten, 80% Confidence, 6.5 Min, hochqualitative Response
- Telegram Whitelist: Fremde Chat-IDs werden blockiert
- Edge Cases: Leere Fragen/Sessions graceful behandelt
- Datenintegritaet: 7 Laender, 1 Property, 5 Holdings, 9 Budget, 3 Goals, 16 Calendar Events

### Dashboard Field Mapping -- Budget-Typen (NEU!)
| DB `type` | Bedeutung | Dashboard-Gruppe |
|---|---|---|
| `income` | Einkommen (Gehalt, Miete etc.) | Einkommen |
| `expense` | Ausgaben (Miete, Versicherung etc.) | Ausgaben |
| `investment` | Investitionen (ETF, Krypto etc.) | Investitionen |
| `reserve` | Ruecklagen (Notreserve etc.) | Ruecklagen |

## Offene TODO fuer naechste Sprints
- [ ] Beispieldaten durch echte User-Daten ersetzen (Immobilie, Portfolio, Budget)
- [ ] Milestones-Tabelle befuellen (aktuell leer -- Exit Score 0%)
- [ ] Exit Prerequisites befuellen (aktuell leer -- Exit Readiness 0%)
- [ ] monthly_scan_results: Weekly Scan manuell ausfuehren fuer erste Daten
- [ ] AStG-Chunks Re-Ingest: PDF-Boilerplate entfernen fuer bessere RAG-Qualitaet
- [ ] Weekly Report Workflow testen (bisher wegen Kosten uebersprungen, ~$2-3)

---

# GeoArbitrage HQ -- Claude Code Context

## Projekt-Ueberblick
Dieses Projekt ist ein AI-gestuetztes Virtual Family Office ("GeoArbitrage HQ").
9 spezialisierte AI-Agenten, orchestriert durch n8n, mit RAG-basierter Knowledge Base
(pgvector + Voyage AI), Telegram als Input-Kanal und Next.js Dashboard.

## n8n Instance
- URL: https://YOUR_TAILSCALE_HOSTNAME (NUR ueber Tailscale VPN erreichbar)
- Version: 2.14+
- MCP (Claude Code CLI): `n8n-mcp` Community-Paket (npx n8n-mcp)
- MCP (Claude Desktop): Instance-level MCP im n8n Editor aktivieren
- API Key: In /opt/geoarbitrage/.env -> N8N_API_KEY (NICHT hier eintragen!)

## Tech-Stack
- **Orchestrator**: n8n 2.14+ (Docker auf Hetzner CX22)
- **DB**: Supabase Free Tier (PostgreSQL + pgvector)
- **LLM**: Claude Sonnet 4.6 (Sonnet-Agenten) + Claude Haiku 4.5 (Haiku-Agenten)
- **Embeddings**: Voyage AI voyage-4-lite (1024 Dimensionen)
- **Frontend**: Next.js / Vercel
- **Calendar**: iPhone Kalender -> iCloud -> Google Calendar -> n8n (MCP Client Node / Google Calendar Node)
- **VPN**: Tailscale (n8n nie ohne VPN erreichbar!)

## Modell-Routing
| Variable | Wert |
|----------|------|
| MODEL_SONNET | claude-sonnet-4-6 |
| MODEL_HAIKU | claude-haiku-4-5-20251001 |

## Regeln fuer Workflow-Erstellung
- Workflows als **Draft** erstellen, NICHT automatisch aktivieren
- Nach Import/Restore: Workflows manuell **"Publish"** klicken (n8n 2.x Pflicht!)
- Code Nodes: Immer mit Kommentaren versehen
- Expressions: Mehrzeilig formatieren fuer Lesbarkeit
- Credentials: Platzhalter verwenden, nie hardcoden
- Node-Benennung: Deutsch, beschreibend (z.B. "Supabase: Context laden")
- **Node-Referenzen**: Wenn Code `$('NodeName')` nutzt, MUSS der Node exakt so heissen (BUG #29)
- Error Handling: Jeden HTTP Request Node mit Error-Branch versehen
- Kein Port 5678 direkt ansprechen -- immer ueber Tailscale URL
- **Execute Command Node**: Braucht `NODES_EXCLUDE=[]` in docker-compose.yml (n8n 2.0+ deaktiviert ihn per Default)

## Sprint 1 Bug Fixes (PFLICHT bei neuen Workflows)

### Anthropic API Call Nodes
- **Auth**: Header `x-api-key: KEY` verwenden, NICHT `Authorization: Bearer KEY`!
  In n8n: Generic Credential Type -> Header Auth, Header Name: `x-api-key`
- **Body Type**: IMMER "Raw" verwenden, NICHT "JSON"! (n8n zerstoert dynamische Expressions bei JSON-Typ)
  Content Type: `application/json`, Body: `{{ $json.payload }}`
- **Credentials**: Nach Loeschen/Neuanlegen eines Credentials -> Dropdown in ALLEN betroffenen Workflows neu auswaehlen
- **max_tokens**: Pro Agent an erwartete Antwortlaenge anpassen (mind. **8192** fuer komplexe Analysen -- 4096 reicht bei grossem Input nicht)

### Supabase Lese-Nodes
- Immer "Always Output Data" = AN setzen
- Im nachfolgenden Code Node: `$input.all()` statt `.first()` + try/catch fuer leere Arrays

### Sub-Workflow Interfaces
- CFO -> Sub-Workflows: Doppelte Fallbacks fuer Feldnamen einbauen
  (`input.agent_response || input.recommendation`)
- Response Assembly: Alle moeglichen Output-Feldnamen abfangen
  (`validated_response || response || overall_assessment`)
- JSON aus Anthropic-Antwort extrahieren: `indexOf('{')`/`lastIndexOf('}')`, NICHT Regex

### Infrastruktur
- **Umgebungsvariablen**: Jede neue Variable an ZWEI Stellen eintragen:
  1. `/opt/geoarbitrage/.env`
  2. `docker-compose.yml` unter n8n -> environment
  Aktuell durchgereicht: DB_*, N8N_*, WEBHOOK_URL, SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY, MODEL_*, ANTHROPIC_API_KEY, TAVILY_API_KEY,
  VOYAGE_API_KEY, TELEGRAM_BOT_TOKEN, TELEGRAM_SECRET_TOKEN,
  TELEGRAM_ALLOWED_CHAT_ID, TELEGRAM_CHAT_ID, NODES_EXCLUDE
- **N8N_BLOCK_ENV_ACCESS_IN_NODE**: MUSS `false` sein (sonst ist $env.X blockiert)
- **Nginx**: `proxy_read_timeout 300s` + `proxy_send_timeout 300s` (fuer Agent-Chains, 120s reicht nicht)
- **n8n Expressions**: `{{ $env.VAR }}` verwenden, NICHT `{VAR}` (letzteres interpoliert nicht)

### Sprint 2.1 Bug Fixes (PFLICHT bei allen Workflows)

#### Veraltete n8n Nodes
- **Execute Sub-Workflow** Node ist veraltet -> IMMER "Execute Workflow" verwenden
  (Source: Database, Workflow: By ID, Mode: Run once with all items, Wait: AN)
- **Workflow Input** Node ist veraltet -> IMMER "When Executed by Another Workflow" verwenden (Modus: "Accept all data")

#### Feldnamen-Fallbacks (Sub-Workflows)
- In ALLEN Sub-Workflows doppelte Fallbacks fuer Input-Felder:
  `question = input.question || input.user_message || 'Keine Frage uebergeben'`
  `context = input.context || input.chat_history || {}`

#### Tax Architect Output-Format
- Tax Architect gibt **Fliesstext/Markdown** zurueck, KEIN JSON
- Parse-Node: Fliesstext direkt als agent_response durchreichen, NICHT JSON-parsen
- Confidence aus Emoji extrahieren: green=hoch / yellow=mittel / red=niedrig

#### CFO Routing Parse
- JSON-Extraktion im "CFO: Routing entscheiden" Node: `indexOf('{')`/`lastIndexOf('}')` + `slice()`, NICHT Regex `match()`

#### Response Assembly
- `$('NodeName')` MUSS den exakten aktuellen Node-Namen verwenden (BUG #29/#38)
- Validator-Output Fallback-Kette: `validated_response || response || overall_assessment`

#### Parse-Fallbacks
- NIEMALS `substring(0, N)` in Fallbacks -- vollstaendigen Text durchreichen

#### Kern-Prompts (KRITISCH)
- System Prompts IMMER aus `knowledge_base/core-prompts/` laden
- Wenn Blueprint auf bestehende Datei verweist -> IMMER erst fragen ob Inhalt vorliegt
- NIEMALS Prompts selbst generieren -- nur die finalen optimierten Versionen verwenden

### Sprint 2.2 Bug Fixes (Chat Memory + Episodic Retrieval)

#### Episodic Memory Integration (BUG A -- Sprint 2.2)
- CFO Intent Classification MUSS Ergebnisse aus `$('Supabase: Episodic Search')` lesen
- Episodic Context wird in den Prompt eingefuegt: "Aehnliche fruehere Konversationen"
- Filter: Nur Ergebnisse mit `similarity > 0.75` und vorhandenem `content`
- Bei neuen Usern: Leeres Array ist OK (Always Output Data = AN auf Episodic Search Node)

#### Embedding Passthrough (BUG B -- Sprint 2.2)
- `user_embedding` MUSS durch den gesamten Flow gereicht werden:
  Intent Classification -> Routing -> Tax Architect -> Validator vorbereiten -> Response Assembly -> Chat speichern
- Chat speichern: User-Nachricht wird MIT Embedding gespeichert (`embedding` + `embedding_model` Spalten)
- Assistant-Nachricht wird OHNE Embedding gespeichert (nur User-Nachrichten werden durchsucht)

#### SQL-Voraussetzung (ERLEDIGT 2026-04-04)
- `sql/02_sprint_2_2_chat_memory.sql` im Supabase SQL Editor ausgefuehrt
- Erstellt: `embedding` Spalte, HNSW-Index, `match_chat_history()` RPC-Funktion
- GRANT EXECUTE auf `anon`, `authenticated`, `service_role` gesetzt (PGRST102 Fix)
- `NOTIFY pgrst, 'reload schema'` nach Funktions-Erstellung ausfuehren!

#### Voyage AI Embedding Node
- Endpunkt: `POST https://api.voyageai.com/v1/embeddings`
- Auth: `Authorization: Bearer VOYAGE_API_KEY`
- Body Type: Raw JSON, Modell: `voyage-4-lite`, input_type: `query`
- Response: `$json.data[0].embedding` (Array mit 1024 Floats)

### Sprint 2.3 Bug Fixes (Agent Logging + Kosten-Tracking)

#### Agent Logger Utility-Workflow
- Logger wird als **Sub-Workflow** per "Execute Workflow" Node aufgerufen
- Wait: **AUS** (Fire-and-forget, blockiert nicht den Hauptflow)
- Logger erwartet: session_id, agent_name, model, input_summary, output_summary, tokens_in, tokens_out, execution_time_ms
- Optional: confidence_score, validation_status, escalated, error_message

#### Kosten-Berechnung (Preise Stand April 2026)
- **Haiku 4.5**: $1.00 Input / $5.00 Output pro MTok
- **Sonnet 4.6**: $3.00 Input / $15.00 Output pro MTok
- EUR/USD Kurs: 1.08 (fest hinterlegt)
- Formel: `cost_eur = ((tokens_in * p.input) + (tokens_out * p.output)) / EUR_USD`

#### Token-Extraktion
- `usage.input_tokens` und `usage.output_tokens` aus der Anthropic API Response extrahieren
- Sub-Workflows MUESSEN `usage` Objekt im Return-Wert zurueckgeben
- Ohne usage-Daten: tokens = 0 (kein Fehler, aber unvollstaendiges Logging)

#### Confidence-Extraktion
- Aus Agent-Output Emojis: green=hoch / yellow=mittel / red=niedrig (gleich wie Sprint 2.1)
- Validator-Status: checkmark=approved / cross=rejected / warning=warning

#### SQL-Voraussetzung
- `sql/03_sprint_2_3_agent_logs.sql` im Supabase SQL Editor ausfuehren
- Erstellt: `agent_logs` Tabelle, Indices, `v_agent_costs_monthly` View, `v_agent_costs_by_agent` View
- RLS Policies: service_role = all, authenticated = read-only
- `NOTIFY pgrst, 'reload schema'` ist im Script enthalten

#### Token-Felder in Sub-Workflows (BUG -- Sprint 2.3)
- Tax Architect + Validator geben `tokens_in`/`tokens_out` als **Top-Level-Felder** zurueck
- NICHT unter `usage.input_tokens` verschachtelt!
- Logger-Code MUSS `agentOutput?.tokens_in` verwenden, NICHT `agentOutput?.usage?.input_tokens`

### Sprint 2.3 Deploy Bug Fixes (PFLICHT bei neuen Supabase HTTP Nodes)

#### Supabase HTTP Request Body Type (BUG #S23-1)
- **IMMER** `contentType: "raw"` + `rawContentType: "application/json"` verwenden
- NIEMALS `specifyBody: "json"` + `jsonBody` -- n8n zerstoert dynamische Expressions
- Gilt fuer ALLE Supabase REST API Nodes, nicht nur Anthropic!

#### Supabase Auth ohne Credentials (BUG #S23-2)
- NIEMALS `authentication: "genericCredentialType"` auf Supabase HTTP Nodes setzen
- Stattdessen: Headers direkt senden (apikey + Authorization)
- `genericCredentialType` ohne verknuepfte Credential-ID -> Node crashed

#### Supabase Authorization Header Pflicht (BUG #S23-3)
- JEDER Supabase HTTP Request Node braucht BEIDE Headers:
  1. `apikey: {{ $env.SUPABASE_SERVICE_ROLE_KEY }}`
  2. `Authorization: {{ "Bearer " + $env.SUPABASE_SERVICE_ROLE_KEY }}`
- Nur `apikey` allein reicht NICHT -- RLS-Policies greifen ohne Authorization-Header

#### String-Literale in Expressions (BUG #S23-4 -- KRITISCH)
- In n8n Expressions MUESSEN String-Literale in Anfuehrungszeichen stehen
- RICHTIG: `={{ "Bearer " + $env.KEY }}` oder `={{ 'Bearer ' + $env.KEY }}`
- FALSCH: `={{ Bearer + $env.KEY }}` -- `Bearer` wird als undefined Variable behandelt
- Python-Manipulation von JSON verliert einfache Quotes (`'`) -> IMMER doppelte Quotes (`"`) in Python-Scripts verwenden
- **Verifikation nach jedem CLI-Import:** Exportieren + Expressions pruefen!

#### n8n CLI Import Workflow-Status (BUG #S23-5)
- `n8n import:workflow` setzt Workflows auf **INACTIVE** + **UNPUBLISHED**
- Nach JEDEM CLI-Import: Workflow im n8n Editor oeffnen -> **Publish** klicken
- `activeVersionId` im JSON setzen reicht NICHT zum Publishen
- "When Executed by Another Workflow" Trigger muss auf **"Accept all data"** stehen (nicht "Define using fields below" mit leerem Schema)

#### Sprint 4.2 Bugs (ALLE gefixt, hier dokumentiert fuer Praevention)

##### BUG #4.2-1: user_message Feldname (KRITISCH)
- Webhook kann `message` ODER `user_message` senden -- IMMER beide pruefen
- Fix: `webhookData.message || webhookData.user_message || ''`
- **Regel**: Bei JEDEM Webhook-Input IMMER Fallback-Kette fuer Feldnamen

##### BUG #4.2-2: Sub-Workflow Return (KRITISCH)
- Agent Sub-Workflows geben den Output des LETZTEN Nodes zurueck
- Logger ist letzter Node -> CFO bekommt Logger-Daten statt Agent-Antwort
- Fix: Logger-Prep Nodes geben `agent_response` als zusaetzliches Feld durch
- **Regel**: Jeder Sub-Workflow Logger-Prep MUSS `agent_response` im Return haben

##### BUG #4.2-3: Intent Classification Routing-Regeln
- Haiku Intent Classification kannte nur "tax" als Agent-Typ
- Fix: Prompt mit allen 7 Agenten-Typen + Routing-Regeln erweitert
- **Regel**: Bei jedem neuen Agenten AUCH den CFO Intent Classification Prompt aktualisieren

##### BUG #4.2-4: Deploy-Reihenfolge (KRITISCH)
- `n8n import:workflow` erstellt Draft, NICHT die aktive Version
- Import -> Restart OHNE Publish = alte Version laeuft weiter (STILLER FEHLER!)
- Fix: Deploy-Script `scripts/deploy_workflow.sh` erzwingt Import -> Publish -> Restart
- **Regel**: IMMER `deploy_workflow.sh` nutzen, NIEMALS manuell import+restart

##### BUG #4.2-5: Connection-Rename im Patch-Script
- Mehrere Rename-Durchlaeufe ueberschreiben sich gegenseitig
- Fix: Ein einziger RENAMES-Dict + single-pass Connection-Update
- **Regel**: Node-Renames immer in EINEM Durchlauf mit RENAMES-Dict

##### BUG #4.2-6: mode="each" inkompatibel mit executeWorkflow v1.2
- `mode: "each"` Parameter existiert NICHT in n8n executeWorkflow typeVersion 1.2
- Verursacht stillen Fehler (leere Response)
- Fix: Parameter entfernt, Sprint 4.2 MVP nutzt Single-Agent Routing
- **Regel**: Fuer Multi-Agent (Sprint 4.3) alternative Loesung noetig (SplitInBatches oder Code-Loop)

### Sprint 3.1 Embedding-Pipeline (PFLICHT bei Knowledge Base Operationen)

#### Ingest-Script Deployment
- Script laeuft auf dem **Hetzner-Server** (NICHT lokal)
- Python3 + pip3 muessen installiert sein: `apt install python3 python3-pip`
- Abhaengigkeiten: `pip3 install -r /opt/geoarbitrage/scripts/requirements.txt`
- PDFs liegen in `/opt/geoarbitrage/documents/`
- Scripts liegen in `/opt/geoarbitrage/scripts/`

#### Voyage AI Embedding-Aufrufe
- Modell: `voyage-4-lite` (1024 Dimensionen)
- Fuer Dokument-Ingest: `input_type: "document"`
- Fuer Query (Suche): `input_type: "query"` (UNTERSCHIED BEACHTEN!)
- Rate Limit: max 280 RPM (Safety-Margin unter Free-Tier-Limit von 300)
- Free Tier: 200M Tokens -- mehr als ausreichend

#### knowledge_base Tabelle
- Schema: `sql/04_sprint_3_1_knowledge_base.sql`
- Upsert via `chunk_id` (UNIQUE Constraint) -- Re-Ingest ueberschreibt bestehende Chunks
- `match_knowledge()` RPC: Immer `filter_bereiche` mit Fachbereich + 'shared' uebergeben
- Similarity Threshold: 0.7 als Startwert (in Sprint 3.2 tunen)

#### Chunk-IDs
- Format: `{slug}/chunk-{index:03d}` (z.B. `astg/chunk-001`)
- Werden auto-generiert aus `--source_name` Parameter
- MUESSEN unique sein (Supabase-Constraint)

#### Knowledge Gap Detection (Selbstlernendes System)
- Validator gibt am Ende JEDER Validierung einen `KNOWLEDGE_GAPS_DETECTED:` Block aus
- Gap Reporter (Fire-and-forget Branch) parst diesen Block und loggt in `knowledge_gaps` Tabelle
- Duplikat-Check via `find_similar_gaps()` RPC (Threshold 0.85) -- gleicher Gap wird nicht doppelt geloggt
- Gap-Prioritaeten: critical (veraltete Infos) > high (fehlende Gesetze/DBA) > medium (Urteile) > low (Artikel)
- `v_knowledge_gaps_open` View zeigt offene Gaps nach Prioritaet
- `v_knowledge_gaps_frequency` View zeigt Haeufigkeit pro Bereich (fuer Quartals-Review)
- Schema: `sql/05_sprint_3_1_knowledge_gaps.sql`

### Sprint 3.2 RAG-Tool Integration (PFLICHT bei RAG-Operationen)

#### Similarity Threshold
- Default-Threshold: **0.3** (NICHT 0.7!)
- Voyage AI voyage-4-lite gibt bei langen Gesetzestexten niedrige Similarity-Scores (~0.4)
- Threshold 0.7 liefert 0 Ergebnisse -- 0.3 findet passende Chunks

#### Credential-IDs nach CLI-Import (BUG -- Sprint 3.2)
- `n8n import:workflow` uebernimmt Credential-IDs aus dem JSON -- Platzhalter wie `VOYAGE_CREDENTIAL_ID` fuehren zu Runtime-Fehlern
- Nach JEDEM CLI-Import: Im n8n Editor die Credential-Dropdowns in HTTP Request Nodes pruefen und ggf. neu auswaehlen
- Voyage AI Credential ID: `YOUR_VOYAGE_CREDENTIAL_ID` (Header Auth: Authorization -> Bearer KEY)

#### RAG-Tool Sub-Workflow (ID: RAGToolSubWorkflow01)
- Wird vom CFO Orchestrator per "Execute Workflow" aufgerufen (Wait: AN)
- Input: `{ query, agent, top_k, threshold }`
- Output: `{ rag_context, rag_results, rag_count, rag_top_similarity, query_embedding }`
- Bereichs-Mapping: agent -> filter_bereiche (z.B. "tax" -> ["tax", "shared"])

#### Gap Reporter (Fire-and-Forget Branch)
- Laeuft nach dem Validator parallel zum Hauptflow
- Parsed `KNOWLEDGE_GAPS_DETECTED:` Block aus Validator-Output
- Inserted Gaps in `knowledge_gaps` Tabelle via Supabase REST API
- onError: continueRegularOutput (Gap-Logging darf Hauptflow nicht blockieren)

### Google Calendar Sync (Sprint 6.0 -- iPhone -> n8n)

#### Architektur
- **Flow:** iPhone Kalender -> iCloud Sync -> Google Calendar -> n8n Cron-Workflow -> calendar_events (Supabase)
- **Sync-Frequenz:** Alle 6 Stunden per Cron (06:00, 12:00, 18:00, 00:00 CET)
- **Kosten:** 0 EUR (kein LLM-Call, Google Calendar API kostenlos)

#### calendar_events Source-Felder
- `source='google_calendar'` -- Vom iPhone-Kalender via Google Calendar Sync
- `source='system'` -- System-generierte Fristen (Steuer-Vorauszahlungen etc.)
- `source='manual'` -- Direkt in Supabase oder via Telegram eingetragen
- `google_event_id` -- Unique Key fuer Sync-Duplikat-Check (nur bei source='google_calendar')

#### Regeln
- Nur Events mit `source='google_calendar'` werden beim Sync aktualisiert
- Manuell erstellte Events werden NICHT vom Sync ueberschrieben
- Geloeschte Google-Events werden auf `status='cancelled'` gesetzt, NICHT geloescht
- Keyword-basierte Kategorisierung (Steuer/Immobilie/Visum etc.) im Code Node, kein LLM

#### Voraussetzungen (einmalig, manuell)
1. iPhone: Google-Konto als Kalender-Account hinzufuegen
2. Google Cloud: Calendar API aktivieren + OAuth 2.0 Credentials
3. n8n: Google Calendar OAuth2 Credential anlegen
4. `.env` + `docker-compose.yml`: GOOGLE_CALENDAR_CLIENT_ID/SECRET eintragen

### Timeout-Regeln (PFLICHT bei allen Tests und Deployments)

#### Timeout-Kette (Stand Sprint 3.2)
| Schicht | Einstellung | Wert |
|---------|-------------|------|
| nginx | proxy_read_timeout | **600s (10 Min)** |
| nginx | proxy_send_timeout | **600s (10 Min)** |
| nginx | proxy_connect_timeout | 10s |
| n8n global | N8N_DEFAULT_EXECUTION_TIMEOUT | Unbegrenzt |
| n8n workflow | executionTimeout | Unbegrenzt |

#### Warum 600s?
- Ein vollstaendiger Agent-Flow (Intent + RAG + Agent + Validator) macht **4 LLM-Calls**
- Jeder Call braucht 30-90s (abhaengig von Prompt-Laenge und Output)
- Worst Case: 4 x 90s = 360s + Overhead = ~400s
- 600s gibt genuegend Puffer fuer zukuenftige Multi-Agent-Flows

#### Test-Befehle (IMMER so verwenden)
- **Auf dem Server**: `/opt/geoarbitrage/scripts/test_webhook.sh "Deine Frage"`
- **Per SSH**: `ssh geoarbitrage@YOUR_TAILSCALE_HOSTNAME '/opt/geoarbitrage/scripts/test_webhook.sh "Frage"'`
- **Manuell per curl** (nur wenn Test-Script nicht verfuegbar):
  ```bash
  curl -sS -X POST "https://YOUR_TAILSCALE_HOSTNAME/webhook/cfo" \
    -H "Content-Type: application/json" \
    -d '{"user_message": "...", "session_id": "test-xxx"}' \
    --max-time 600
  ```
- **NIEMALS** `--max-time` unter 600 setzen oder weglassen!
- **Claude Code Bash timeout**: Bei Webhook-Tests IMMER `timeout: 600000` (10 Min) setzen

#### Bei Timeout-Verdacht
1. NICHT sofort nochmal senden (kostet doppelt LLM-Kosten!)
2. Erst im n8n Editor -> Executions pruefen ob die Execution noch laeuft oder mit Fehler beendet wurde
3. Wenn noch laeuft: Warten. Wenn Fehler: Fehler analysieren, dann erst retry.

### Sprint 4.1 Agenten-Workflows (Immobilien-Spezialist)

#### Workflow-Architektur (wiederverwendbares Pattern fuer alle Agenten)
Jeder Agent-Workflow folgt dem gleichen 6-Node-Pattern:
1. `When Executed by Another Workflow` (Trigger, Accept all data)
2. `Build AI Request` (Code: Input parsen, System-Prompt + RAG-Context, Anthropic Payload)
3. `Anthropic: [Agent] API Call` (HTTP Request: Sonnet/Haiku, Raw Body, x-api-key)
4. `Parse & Format Output` (Code: Response + Tokens + Confidence extrahieren)
5. `Logger: [Agent] vorbereiten` (Code: Logger-Input aufbereiten)
6. `Execute Workflow: Agent Logger` (Execute Workflow: Fire-and-forget, Wait AUS)

#### Deployed Agents
| Agent | Workflow-ID | Modell | Status |
|-------|-------------|--------|--------|
| Tax Architect | WNR9OmS2JjleNwJg | claude-sonnet-4-6 | Published (Sprint 1) |
| Immobilien-Spezialist | ImmobilienSpezialist01 | claude-sonnet-4-6 | Published (Sprint 4.1) |
| Gesellschaftsrechtler | CorporateStructure01 | claude-sonnet-4-6 | Published (Sprint 4.1) |
| Immigration-Spezialist | ImmigrationSpezialist01 | claude-haiku-4-5-20251001 | Published (Sprint 4.1) |
| Wealth Manager | WealthManager01 | claude-sonnet-4-6 | Published (Sprint 4.1) |
| Versicherungs-Analyst | InsuranceAnalyst01 | claude-haiku-4-5-20251001 | Published (Sprint 4.1) |
| Relocation-Analyst | RelocationAnalyst01 | claude-haiku-4-5-20251001 | Published (Sprint 4.1) |

#### Build-Script Pattern (PFLICHT fuer neue Agenten)
- Jeder Agent hat ein Build-Script: `scripts/create_[agent]_workflow.py`
- Script laedt System-Prompt aus `knowledge_base/core-prompts/` (BUG #40)
- Script hat **integrierten Bug-Check** der alle 14 bekannten Bugs automatisch prueft
- Script generiert JSON das direkt per `n8n import:workflow` importiert werden kann
- **Nach jedem CLI-Import**: Credential-Dropdown im Editor neu auswaehlen + Publish!

#### Immocation-Tools Integration (Sprint 4.1)
- **Kalkulator-Formeln** im System-Prompt von agent-02-immobilien.md eingebettet:
  Bruttomietrendite, Nettomietrendite, Kaufpreisfaktor, EK-Rendite, Cashflow,
  Tilgungsplan (Annuitaet), AfA, Break-Even, Vermoegenszuwachs
- **Bierdeckel-Bewertung** (15%-Kappungsgrenze Paragraph558 BGB) im System-Prompt
- **Besichtigungscheckliste** (17 Chunks) in knowledge_base ingestiert (bereich: immobilien)
- **Kaufvertrag-Pruefung** (13 Chunks) in knowledge_base ingestiert (bereich: immobilien)
- **JS-Referenz**: `scripts/immobilien_kalkulator.js` (standalone, mit Tests)

#### Markdown-Ingest-Pipeline (NEU -- Sprint 4.1)
- Script: `scripts/ingest_markdown.py`
- Splittet Markdown an ## Headings in Chunks
- Nutzt Voyage AI voyage-4-lite Embeddings (gleich wie PDF-Pipeline)
- Upsert via chunk_id in Supabase knowledge_base
- Usage: `python3 ingest_markdown.py --file /pfad.md --bereich immobilien --source_type checklist --source_name "Name"`
- Rate Limit: 3s Pause zwischen Batches (Voyage Free Tier)

#### Knowledge Base Stand (nach Sprint 4.1)
| Quelle | Chunks | Bereich |
|--------|--------|---------|
| AStG | 57 | tax |
| EStG | 825 | tax |
| DBA-UAE | 92 | tax |
| DBA-Estland | 12 | tax |
| DBA-Zypern | 14 | tax |
| Besichtigungscheckliste | 17 | immobilien |
| Kaufvertrag-Pruefung | 13 | immobilien |
| **Gesamt** | **1030** | |

### Sprint 4.2 CFO Multi-Agent Routing

#### Dynamisches Routing
- CFO Orchestrator: "Agent ausfuehren (dynamisch)" Node mit Expression `={{ $json.workflow_id }}`
- Intent Classification: Per-Agent Routing-Regeln im Haiku-Prompt
- AGENT_MAP in "RAG Input vorbereiten (CFO)": Mappt agents_needed auf Workflow-IDs
- Sub-Workflow Return Fix: Logger Prep Nodes geben `agent_response` durch (nicht nur Logger-Felder)
- user_message Bug Fix: `webhookData.message || webhookData.user_message` (Fallback fuer beide Feldnamen)

#### Deploy-Reihenfolge (PFLICHT bei CFO-Aenderungen)
1. `n8n import:workflow` -- Importiert als Draft, deaktiviert Workflow
2. `n8n publish:workflow --id=YOUR_CFO_WORKFLOW_ID` -- Published die Draft-Version
3. `docker compose restart n8n` -- Laedt die published Version, registriert Webhooks
- **NIEMALS** Reihenfolge aendern! Import -> Restart OHNE Publish = alte Version laeuft

### Code-Qualitaet (aus Audit)
- **Optional Chaining**: Bei allen `.json.X` oder `.body.X` Zugriffen `?.` verwenden
- **Array-Bounds**: Vor `array[length - N]` immer `length >= N` pruefen
- **URL-Parameter**: Dynamische Werte in URLs validieren (z.B. Laendercodes: `/^[A-Z]{2}$/`)

## Sprint 4.3 Bug Fixes (PFLICHT bei neuen Workflows)

### BUG #4.3-1: n8n Publish PFLICHT (KRITISCH!)
- Nach `n8n import:workflow` MUSS `n8n publish:workflow --id=<ID>` aufgerufen werden
- Ohne Publish: Workflow ist "draft" und wird beim Restart NICHT aktiviert (Webhook tot!)
- Sub-Workflows ohne Webhook funktionieren auch als Draft, aber Main-Workflows mit Webhook NICHT
- Deploy-Reihenfolge: Import -> Publish -> Restart (IMMER!)
- Das deploy_workflow.sh Script macht das automatisch

### BUG #4.3-2: SplitInBatches V3 Output-Reihenfolge
- Output 0 = "done" (NICHT "loop"!)
- Output 1 = "loop" (NICHT "done"!)
- FALSCH: `Output 0 -> Processing, Output 1 -> Done`
- RICHTIG: `Output 0 -> Consolidation (done), Output 1 -> Processing (loop)`
- Loop-Back: Letzter Node im Loop -> SplitInBatches Input (gleicher Index 0)

### BUG #4.3-3: RAG-Context nie im Agent-Prompt
- `Build AI Request` Nodes in ALLEN Agenten muessen `ragContext` in die User-Message einfuegen
- FALSCH: `content: Frage: ${question}\n\nMandanten-Kontext: ...`
- RICHTIG: `content: Frage: ${question}\n\n${ragContext ? 'RELEVANTE RECHTSGRUNDLAGEN:\n' + ragContext : ''}\n\nMandanten-Kontext: ...`
- Betrifft ALLE 7 Agent Sub-Workflows!

### BUG #4.3-4: Agent-Metadaten im SplitInBatches-Loop verloren
- `$("RAG Input vorbereiten (CFO)")` gibt im Loop IMMER den ERSTEN Agent zurueck
- Fix: RAG Tool Sub-Workflow muss `_agent_key`, `_workflow_id`, `_agent_name`, `_agent_model` als Passthrough durchreichen
- `RAG Context vorbereiten` im CFO liest Agent-Info aus RAG Tool Output (nicht aus RAG Input!)

### BUG #4.3-5: Respond to Webhook braucht Dual-Path Fallback
- Conditional Validator hat 2 Pfade: mit Validator und ohne (direkt)
- `Respond to Webhook` darf NICHT nur `$('Response Assembly')` referenzieren
- Muss try/catch mit Fallback auf `$('Response Assembly (direkt)')` verwenden
- Sonst: ExpressionError "Node 'Response Assembly' hasn't been executed"

### BUG #4.3-6: SplitInBatches typeVersion
- n8n 2.14 hat SplitInBatches V1, V2, V3
- typeVersion muss exakt `3` sein (NICHT `3.1`, das gibt es nicht!)
- Falsche typeVersion -> Workflow aktiviert sich nicht (silent fail, kein Error-Log!)

## Wichtige Dateien
- `geo-arbitrage-implementation-blueprint.md` -- Sprint-Plan + Architektur (Hauptdokument)
- `knowledge_base/core-prompts/` -- 9 Agenten-Prompts
- `knowledge_base/RAG-INTEGRATION.md` -- RAG-Konzept, SQL-Schema, Workflow
- `sql/02_sprint_2_2_chat_memory.sql` -- Schema fuer Chat Memory + Episodic Retrieval
- `sql/03_sprint_2_3_agent_logs.sql` -- Schema fuer Agent Logging + Kosten-Tracking
- `workflows/sprint_2_3_agent_logger.json` -- Logger Utility-Workflow (n8n Import)
- `workflows/sprint_2_3_logger_integration.md` -- Integrations-Anleitung fuer CFO Orchestrator
- `sql/04_sprint_3_1_knowledge_base.sql` -- Schema fuer Knowledge Base + match_knowledge RPC
- `scripts/ingest_documents.py` -- Embedding-Pipeline (PDF -> Chunks -> Voyage AI -> Supabase)
- `scripts/ingest_all.sh` -- Batch-Script fuer alle Gesetzestexte
- `scripts/requirements.txt` -- Python-Abhaengigkeiten fuer Ingest-Script
- `scripts/SPRINT_3_1_GESETZESTEXTE.md` -- Download-Anleitung fuer Gesetzestexte
- `sql/05_sprint_3_1_knowledge_gaps.sql` -- Schema fuer Knowledge Gap Detection
- `workflows/sprint_3_1_gap_reporter.md` -- Gap Reporter Integration Guide
- `dashboard-v2.jsx` -- Dashboard-Prototyp (wird in Sprint 5 zu Next.js migriert)
- `scripts/create_immobilien_workflow.py` -- Build-Script Immobilien-Spezialist (mit Bug-Check)
- `scripts/create_corporate_workflow.py` -- Build-Script Gesellschaftsrechtler (Sonnet 4.6)
- `scripts/create_immigration_workflow.py` -- Build-Script Immigration-Spezialist (Haiku 4.5)
- `scripts/create_wealth_workflow.py` -- Build-Script Wealth Manager (Sonnet 4.6)
- `scripts/create_insurance_workflow.py` -- Build-Script Versicherungs-Analyst (Haiku 4.5)
- `scripts/create_relocation_workflow.py` -- Build-Script Relocation-Analyst (Haiku 4.5)
- `scripts/immobilien_kalkulator.js` -- JS-Referenz: Kalkulator + Bierdeckel (immocation)
- `scripts/ingest_markdown.py` -- Markdown-Ingest-Pipeline (Chunks -> Voyage AI -> Supabase)
- `workflows/sprint_4_1_immobilien.json` -- Immobilien-Spezialist Workflow (n8n Import)
- `workflows/sprint_4_1_corporate.json` -- Gesellschaftsrechtler Workflow (n8n Import)
- `workflows/sprint_4_1_immigration.json` -- Immigration-Spezialist Workflow (n8n Import)
- `workflows/sprint_4_1_wealth.json` -- Wealth Manager Workflow (n8n Import)
- `workflows/sprint_4_1_insurance.json` -- Versicherungs-Analyst Workflow (n8n Import)
- `workflows/sprint_4_1_relocation.json` -- Relocation-Analyst Workflow (n8n Import)
- `scripts/patch_cfo_routing.py` -- CFO Routing Patch Script (Sprint 4.2)
- `scripts/deploy_workflow.sh` -- Deploy-Script: Import -> Publish -> Restart (BUG #4.2-4 Praevention)
- `scripts/test_all_agents.py` -- Agent-Tests (5 Agenten, Anthropic API direkt)
- `workflows/sprint_4_2_cfo_routing_backup.json` -- CFO Backup vor Routing-Patch
- `workflows/sprint_4_2_cfo_patched.json` -- CFO mit Multi-Agent Routing
- `workflows/sprint_4_3_cfo_multi_agent.json` -- CFO mit Multi-Agent + SplitInBatches + Conditional Validator
- `scripts/patch_conditional_validator.py` -- Conditional Validator Patch (IF confidence < 0.85)
- `scripts/patch_multi_agent.py` -- Multi-Agent SplitInBatches Patch (VERALTET, siehe fix_multi_agent_final.py)
- `scripts/fix_multi_agent_final.py` -- Multi-Agent Final Fix (korrekte V3 Outputs)
- `scripts/fix_rag_in_agents.py` -- RAG-Context in alle Agent-Prompts einfuegen (BUG #4.3-3)
- `scripts/fix_rag_passthrough.py` -- Agent-Metadaten durch RAG Tool durchreichen (BUG #4.3-4)
- `scripts/fix_cfo_rag_context.py` -- CFO RAG Context liest aus RAG Tool Passthrough
- `scripts/fix_respond_node.py` -- Respond to Webhook Dual-Path Fallback (BUG #4.3-5)
- `scripts/fix_single_agent_fallback.py` -- Fallback auf Single-Agent (Debugging)
- `scripts/ingest_all_domains.py` -- Batch-Ingest fuer alle 7 Knowledge-Base-Bereiche
- `scripts/test_rag_search.py` -- Direkter RAG-Such-Test (Voyage + Supabase)
- `documents/immocation_checkliste_besichtigung.md` -- Besichtigungscheckliste (ingestiert)
- `documents/immocation_checkliste_kaufvertrag.md` -- Kaufvertrag-Pruefung (ingestiert)

### Sprint 5 -- Dashboard + Telegram

#### Dashboard (Next.js)
- Ordner: `dashboard/` (Next.js 14 + TypeScript + Tailwind + Recharts + Supabase)
- Deploy: Vercel (ENV: `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- **NIEMALS** `SUPABASE_SERVICE_ROLE_KEY` in Vercel setzen!
- **Auth**: Supabase Auth (Email/Password, kein Signup, RLS auf 15 Tabellen) -- Details siehe Root CLAUDE.md "Supabase Auth + RLS"

#### Telegram Bot (n8n)
- Workflow-ID: `TelegramBot01`
- Webhook: `https://webhook.YOUR_DOMAIN.com/webhook/telegram` (Cloudflare SSL)
- SSL: Cloudflare terminiert SSL, nginx Port 80 (Port 8443 Legacy entfernt in Sprint 7)
- Secret Token: Verifiziert im Header `X-Telegram-Bot-Api-Secret-Token`
- Chat-ID Whitelist: `YOUR_TELEGRAM_CHAT_ID`
- Intents: data_entry -> Haiku parst -> budget, config -> Haiku -> update, question -> CFO, feedback -> log

#### Proactive Alerts
- Send Alert: `SendAlert01` -- Utility fuer formatierte Telegram-Alerts (red/yellow/green)
- Weekly Deadline Check: `WeeklyDeadlineCheck01` -- Cron Mo 08:00, prueft calendar_events + actions

#### Sprint 5 Bugs (CRITICAL -- alle gefixt)
| Bug | Problem | Fix |
|-----|---------|-----|
| #5-1 | n8n import:workflow deaktiviert Workflows IMMER | publish + restart aktiviert sie wieder. Kein Workaround -- so designed. |
| #5-2 | N8N_API_KEY env var funktioniert nicht in 2.14 | API Key muss ueber n8n UI erstellt werden (Settings -> API). Env var wird ignoriert. |
| #5-3 | Telegram UTF-8 Emoji in curl | charset=utf-8 Header setzen bei direkten API-Calls |
| #5-4 | Supabase budget: Spalte `cat` existiert nicht | Richtig: `category`. Workflow-Insert MUSS exakt Tabellen-Schema matchen! |
| #5-5 | Supabase budget: `description`/`source` Spalten fehlen | Stattdessen `notes` verwenden. VOR jedem Insert: Schema pruefen! |
| #5-6 | Supabase budget: `month` ist DATE, nicht STRING | Format: `YYYY-MM-01` (erster Tag des Monats), nicht `YYYY-MM` |
| #5-7 | Tailscale Funnel braucht Admin-Freigabe | Loesung: nginx Port 8443 mit Self-signed Cert statt Funnel |
| #5-8 | docker compose restart laedt KEINE neuen env vars | MUSS `docker compose up -d` verwenden (recreate) |
| #5-9 | Telegram Webhook braucht oeffentliche URL | Tailscale-URL nicht erreichbar fuer Telegram. Loesung: Public IP + Self-signed Cert |

#### Sprint 5 Learnings
- **Supabase Schema IMMER zuerst pruefen** vor Workflow-Erstellung (`curl /rest/v1/` -> definitions)
- **Telegram Webhook**: Self-signed Cert + `certificate` Parameter in setWebhook = funktioniert zuverlaessig
- **nginx Dual-Server**: Port 443 (Tailscale only) + Port 8443 (Public, nur /webhook/telegram) = sicher
- **n8n CLI vs API**: CLI kann import/export/publish, aber NICHT activate. UI oder API (mit UI-Key) noetig.
- **Vercel**: ENV vars VOR erstem Deploy setzen. Nachtraeglich -> Redeploy noetig.

#### Neue Dateien Sprint 5
- `dashboard/` -- Next.js Dashboard Projekt
- `scripts/create_telegram_bot_workflow.py` -- Telegram Bot Build-Script
- `scripts/create_send_alert_workflow.py` -- Send Alert Build-Script
- `scripts/create_weekly_deadline_check.py` -- Weekly Deadline Check Build-Script
- `workflows/sprint_5_2_telegram_bot.json` -- Telegram Bot Workflow
- `workflows/sprint_5_3_send_alert.json` -- Send Alert Workflow
- `workflows/sprint_5_3_weekly_deadline_check.json` -- Weekly Deadline Check

## Sicherheits-Regeln (nicht verhandelbar)
- n8n NIEMALS auf oeffentlicher IP exponieren
- Alle API-Keys nur in /opt/geoarbitrage/.env
- Supabase Service Role Key NIEMALS im Frontend
- Telegram Webhook MUSS Secret Token verifizieren
- Anthropic API Spending Limit: 20 EUR/Monat

## Security Hardening (Stand April 2026)

### Dashboard Security Headers (vercel.json)
- Strict-Transport-Security: 2 Jahre + includeSubDomains + preload
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera/microphone/geolocation deaktiviert
- **Content-Security-Policy**: default-src 'self', connect-src nur *.supabase.co, frame-ancestors 'none'
- **X-DNS-Prefetch-Control**: off (verhindert DNS-Leaks)
- **poweredByHeader**: false in next.config.js (versteckt Next.js-Fingerprint)

### CSP-Regeln bei Dashboard-Aenderungen
- Neue externe Quellen (Fonts, Analytics, CDN) MUESSEN in der CSP whitelist ergaenzt werden
- `unsafe-inline` + `unsafe-eval` sind fuer Recharts SVG-Rendering noetig -- bei Migration auf andere Chart-Library ueberpruefen
- `connect-src` erlaubt nur `'self'` + `https://*.supabase.co` + `wss://*.supabase.co` (Realtime)

### SSH-Zugang (ab April 2026)
- **User**: `geoarbitrage` (NICHT mehr root)
- **Befehl**: `ssh geoarbitrage@YOUR_TAILSCALE_HOSTNAME` (Tailscale SSH)
- **Docker**: User ist in docker-Gruppe, docker compose/exec funktioniert ohne sudo
- **Dateien**: /opt/geoarbitrage/ gehoert User `geoarbitrage`
- **Crontab**: Backup-Cron laeuft unter User `geoarbitrage`
- deploy_workflow.sh, settings.local.json: Alle auf `geoarbitrage@` umgestellt

### Erledigt (April 2026)
- [x] Supabase Auth einrichten + anon-Policies auf authenticated umstellen
- [x] RLS-Policies auf 15 sensitiven Tabellen (auth.uid() = UUID)
- [x] Dashboard Field Mapping Audit (alle Feldname-Mappings in hooks.ts korrigiert)
- [x] Mobile Bugs #M-1 bis #M-5 gefixt

### Sprint 7 Learnings (Details in Root CLAUDE.md)
- **#7-1**: Supabase REST API Default-Limit 1000 Rows -- IMMER paginieren
- **#7-2**: Cloudflare Flexible SSL -- nginx braucht keinen SSL-Block fuer Cloudflare-Domains
- **#7-3**: n8n API Key ist JWT (~267 Zeichen), nicht statischer String
- **#7-4**: Workflow-JSON braucht `"id"` Feld fuer Import
- **#7-5**: Vercel + Cloudflare -- A-Record auf 216.198.79.1, SSL auf Full

### Sprint 7 Aenderungen
- [x] GDELT v1 -> v2 DOC API
- [x] Polymarket Datum-Filter
- [x] Knowledge Base: GrEStG, DBA Portugal, DBA Georgien ingested
- [x] YOUR_DOMAIN.com: Cloudflare DNS + Nginx + Vercel + Cloudflare Access
- [x] Telegram Webhook: webhook.YOUR_DOMAIN.com (Cloudflare SSL)
- [x] Alle 11 APIs getestet und funktionsfaehig

### Hinweis: Dashboard Field Mapping
Alle Feldname-Mappings (Supabase -> Dashboard) und berechneten Felder sind im Root CLAUDE.md unter "Dashboard Field Mapping Audit" dokumentiert. VOR jedem neuen Dashboard-Feature dort nachschlagen!
