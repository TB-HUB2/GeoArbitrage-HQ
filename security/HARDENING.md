# Server-Hardening Anleitung

## 1. Dedizierter User (nicht root!)

### User erstellen
```bash
adduser geoarbitrage
usermod -aG docker geoarbitrage
chown -R geoarbitrage:geoarbitrage /opt/geoarbitrage/
```

### SSH mit User
```bash
ssh geoarbitrage@YOUR_TAILSCALE_HOSTNAME
```

## 2. ufw Firewall

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP (Cloudflare + Tailscale)
sudo ufw allow 443/tcp   # HTTPS (Tailscale n8n)
sudo ufw enable
```

### Pruefen
```bash
sudo ufw status verbose
```

## 3. n8n Security Patches

### Update-Prozedur
1. Hetzner Snapshot erstellen
2. Backup ausfuehren: `bash backup.sh`
3. docker-compose.yml: Image-Tag aendern (MIT PYTHON, kein sed!)
4. `docker compose pull n8n && docker compose up -d`
5. Health-Check: `curl http://localhost:5678/healthz`
6. Version pruefen: `docker compose exec n8n n8n --version`
7. Altes Image entfernen: `docker image rm <old-image>`
8. Bei Problemen: `docker compose down`, alte Version, `up -d`

### Bei BSI/CERT-Warnungen: SOFORT patchen!

### Post-Patch IoC-Checkliste
- User-Accounts in n8n pruefen (keine fremden User?)
- API Keys pruefen (keine unbekannten?)
- Workflows pruefen (keine fremden Workflows?)
- Container-Dateien pruefen: `docker exec n8n ls /tmp/`
- Laufende Prozesse: `docker exec n8n ps aux`
- Netzwerk-Verbindungen: `docker exec n8n netstat -tlnp` (oder `ss -tlnp`)

## 4. Supabase RLS-Hardening

Alle sensitiven Tabellen muessen RLS-Policies haben:
- `owner_access`: `auth.uid() = YOUR_USER_UUID` (ALL operations)
- `service_role_all`: service_role hat vollen Zugriff (fuer n8n)

Siehe `sql/07_rls_policies.sql` fuer das komplette Script.

## 5. NIEMALS
- Port 5678 oeffentlich exponieren
- Service Role Key im Browser/Frontend
- root als Standard-User
- `docker compose restart` (laedt keine neuen env vars!)
- `sed` fuer Multi-Line-Edits in Config-Dateien
- API Keys in Git committen
