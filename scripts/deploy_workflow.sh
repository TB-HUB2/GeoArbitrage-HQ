#!/bin/bash
# ============================================================
# GeoArbitrage HQ — Workflow Deploy Script
# Erzwingt korrekte Reihenfolge: Import → Publish → Restart
# BUG #4.2-4: Import→Restart OHNE Publish = alte Version laeuft!
#
# Usage:
#   ./scripts/deploy_workflow.sh <json-datei> [workflow-id]
#   ./scripts/deploy_workflow.sh workflows/sprint_4_2_cfo_patched.json LPiNFZkUSGnxfscp
#
# Wenn workflow-id nicht angegeben, wird sie aus dem JSON extrahiert.
# ============================================================
set -euo pipefail

JSON_FILE="${1:?Fehler: JSON-Datei als erstes Argument angeben}"
CONTAINER="geoarbitrage-n8n-1"

if [ ! -f "$JSON_FILE" ]; then
  echo "FEHLER: Datei nicht gefunden: $JSON_FILE"
  exit 1
fi

# Workflow-ID aus JSON extrahieren oder als Argument nehmen
if [ -n "${2:-}" ]; then
  WF_ID="$2"
else
  WF_ID=$(python3 -c "import json; d=json.load(open('$JSON_FILE')); print(d[0]['id'] if isinstance(d,list) else d['id'])" 2>/dev/null)
  if [ -z "$WF_ID" ]; then
    echo "FEHLER: Workflow-ID konnte nicht aus JSON extrahiert werden. Als 2. Argument angeben."
    exit 1
  fi
fi

echo "============================================================"
echo "  GeoArbitrage HQ — Workflow Deploy"
echo "  Datei:       $JSON_FILE"
echo "  Workflow-ID: $WF_ID"
echo "============================================================"

# Schritt 1: JSON validieren
echo ""
echo "[1/4] JSON validieren..."
python3 -c "import json; json.load(open('$JSON_FILE'))" || { echo "FEHLER: Ungueltige JSON-Datei!"; exit 1; }
echo "  OK"

# Schritt 2: Import
echo ""
echo "[2/4] Workflow importieren (via SCP + docker cp + n8n import)..."
REMOTE_FILE="/tmp/deploy_$(basename $JSON_FILE)"
scp "$JSON_FILE" YOUR_USER@YOUR_TAILSCALE_HOSTNAME:"$REMOTE_FILE"
ssh YOUR_USER@YOUR_TAILSCALE_HOSTNAME "docker cp $REMOTE_FILE $CONTAINER:/tmp/deploy.json && docker exec $CONTAINER n8n import:workflow --input=/tmp/deploy.json 2>&1"
echo "  Import OK"

# Schritt 3: Publish (PFLICHT vor Restart!)
echo ""
echo "[3/4] Workflow publishen..."
ssh YOUR_USER@YOUR_TAILSCALE_HOSTNAME "docker exec $CONTAINER n8n publish:workflow --id=$WF_ID 2>&1 | head -1"
echo "  Publish OK"

# Schritt 4: Restart n8n
echo ""
echo "[4/4] n8n neustarten..."
ssh YOUR_USER@YOUR_TAILSCALE_HOSTNAME "cd /opt/geoarbitrage && docker compose restart n8n 2>&1 | tail -1"
echo "  Warte auf Health-Check..."
sleep 8
HEALTH=$(ssh YOUR_USER@YOUR_TAILSCALE_HOSTNAME "docker exec $CONTAINER wget -q -O- http://localhost:5678/healthz 2>/dev/null" || echo "FAIL")
if echo "$HEALTH" | grep -q '"ok"'; then
  echo "  n8n ist healthy"
else
  echo "  WARNUNG: Health-Check fehlgeschlagen! ($HEALTH)"
  exit 1
fi

echo ""
echo "============================================================"
echo "  DEPLOY ERFOLGREICH"
echo "  Workflow $WF_ID ist importiert, published und aktiv."
echo "============================================================"
