# GeoArbitrage HQ -- Security Checklist

## Netzwerk & Zugang
- [ ] n8n Editor NUR ueber Tailscale VPN erreichbar (Port 5678 NICHT oeffentlich)
- [ ] ufw Firewall aktiv: deny incoming, allow 22/80/443
- [ ] SSH nur per Key-Auth (Passwort-Login deaktiviert)
- [ ] Dedizierter Server-User (nicht root) fuer Docker-Operationen
- [ ] Tailscale ACLs konfiguriert
- [ ] nginx blockt alle Pfade ausser /webhook/telegram (return 444)

## Supabase & Datenbank
- [ ] RLS auf ALLEN sensitiven Tabellen aktiviert
- [ ] Service Role Key NIEMALS im Frontend/Browser
- [ ] Anon Key nur fuer authentifizierte Zugriffe (RLS erzwingt auth.uid())
- [ ] Signup in Supabase Auth DEAKTIVIERT
- [ ] knowledge_base/knowledge_gaps: authenticated_read + owner_write

## API Keys & Secrets
- [ ] Alle Keys nur in /opt/geoarbitrage/.env
- [ ] .env NICHT in Git (in .gitignore)
- [ ] Anthropic API Spending Limit gesetzt (z.B. 20 EUR/Mo)
- [ ] Voyage AI: Free Tier Limits beachten (200M Tokens, ~280 RPM)
- [ ] n8n API Key ueber UI erstellt (nicht env var — wird in 2.14+ ignoriert)

## Telegram Bot
- [ ] Secret Token in Webhook verifiziert
- [ ] Chat-ID Whitelist aktiv (nur autorisierte User)
- [ ] Webhook HTTPS-only (Cloudflare SSL)

## Dashboard (Vercel)
- [ ] CSP Headers in vercel.json (connect-src nur *.supabase.co)
- [ ] X-Frame-Options: DENY
- [ ] HSTS mit includeSubDomains + preload
- [ ] poweredByHeader: false in next.config.js
- [ ] X-DNS-Prefetch-Control: off
- [ ] Permissions-Policy: camera/microphone/geolocation deaktiviert

## Cloudflare
- [ ] SSL-Modus: Full (NICHT Flexible fuer Vercel!)
- [ ] Proxy (orange Wolke) aktiv fuer Webhook-Domain
- [ ] Cloudflare Access fuer Dashboard (optional)

## Docker & n8n
- [ ] Alle Images auf spezifische Version gepinnt (NIEMALS :latest)
- [ ] restart: unless-stopped auf allen Containern
- [ ] N8N_BLOCK_ENV_ACCESS_IN_NODE=false (benoetigt fuer $env.*)
- [ ] Regelmaessige Updates (BSI/CVE-Warnungen SOFORT patchen!)
- [ ] Post-Patch IoC-Checkliste durchfuehren

## Backup
- [ ] Taegliches Backup (PostgreSQL Dump + Workflow Export)
- [ ] Backup-Retention: 7 Tage
- [ ] Hetzner Snapshot VOR Updates erstellen

## Monitoring
- [ ] n8n Health Check: curl http://localhost:5678/healthz
- [ ] n8n Version pruefen nach Updates
- [ ] Docker Container Status pruefen
- [ ] Agent-Kosten im Blick behalten (v_agent_costs_monthly View)
