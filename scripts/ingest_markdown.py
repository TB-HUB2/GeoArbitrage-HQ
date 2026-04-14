#!/usr/bin/env python3
"""
Markdown-Dokumente in Supabase knowledge_base ingestieren.
Gleiche Pipeline wie ingest_documents.py, aber fuer .md statt .pdf.

Chunks werden an Markdown-Headings (## oder ###) gesplittet.

Usage:
  python3 ingest_markdown.py --file /pfad/datei.md \
    --bereich immobilien --source_type checklist --source_name "Besichtigungscheckliste"

Env-Variablen (aus /opt/geoarbitrage/.env):
  VOYAGE_API_KEY
  SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY
"""

import argparse
import json
import os
import re
import sys
import time
from pathlib import Path

try:
    import requests
except ImportError:
    print("FEHLER: 'requests' nicht installiert.")
    sys.exit(1)

# .env laden
def load_env(env_path="/opt/geoarbitrage/.env"):
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    os.environ.setdefault(key.strip(), val.strip().strip('"').strip("'"))

load_env()

VOYAGE_API_KEY = os.environ.get("VOYAGE_API_KEY", "")
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

if not all([VOYAGE_API_KEY, SUPABASE_URL, SUPABASE_KEY]):
    print("FEHLER: VOYAGE_API_KEY, SUPABASE_URL oder SUPABASE_SERVICE_ROLE_KEY fehlt!")
    sys.exit(1)


def read_markdown(filepath):
    """Liest Markdown-Datei und gibt Text zurueck."""
    with open(filepath, "r", encoding="utf-8") as f:
        return f.read()


def split_by_headings(text, source_name):
    """Splittet Markdown an ## Headings in Chunks."""
    # Titel (# Heading) als Kontext behalten
    lines = text.split("\n")
    title = ""
    for line in lines:
        if line.startswith("# ") and not line.startswith("## "):
            title = line.lstrip("# ").strip()
            break

    # An ## oder ### splitten
    chunks = []
    current_heading = title
    current_content = []

    for line in lines:
        if re.match(r"^#{2,3}\s", line):
            # Vorherigen Chunk speichern
            if current_content:
                content = "\n".join(current_content).strip()
                if len(content) > 50:  # Mindestlaenge
                    chunks.append({
                        "heading": current_heading,
                        "content": content
                    })
            current_heading = line.lstrip("#").strip()
            current_content = [line]
        else:
            current_content.append(line)

    # Letzten Chunk
    if current_content:
        content = "\n".join(current_content).strip()
        if len(content) > 50:
            chunks.append({
                "heading": current_heading,
                "content": content
            })

    # Chunk-IDs generieren
    slug = re.sub(r"[^a-z0-9]+", "-", source_name.lower()).strip("-")
    for i, chunk in enumerate(chunks):
        chunk["chunk_id"] = f"{slug}/chunk-{i+1:03d}"
        chunk["title"] = f"{source_name} — {chunk['heading']}"

    return chunks


def get_embeddings(texts, input_type="document"):
    """Voyage AI Embeddings generieren."""
    url = "https://api.voyageai.com/v1/embeddings"
    headers = {
        "Authorization": f"Bearer {VOYAGE_API_KEY}",
        "Content-Type": "application/json"
    }
    body = {
        "input": texts,
        "model": "voyage-4-lite",
        "input_type": input_type
    }
    resp = requests.post(url, headers=headers, json=body, timeout=30)
    resp.raise_for_status()
    data = resp.json()
    return [item["embedding"] for item in data["data"]]


def upsert_chunks(chunks, bereich, source_type, source_name):
    """Chunks mit Embeddings in Supabase upserten."""
    url = f"{SUPABASE_URL}/rest/v1/knowledge_base"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }

    # Embeddings in Batches (max 10 pro Voyage-Call)
    batch_size = 10
    total = len(chunks)
    success = 0

    for i in range(0, total, batch_size):
        batch = chunks[i:i+batch_size]
        texts = [c["content"] for c in batch]

        print(f"  Embedding Batch {i//batch_size + 1}/{(total + batch_size - 1)//batch_size} ({len(texts)} Chunks)...")
        embeddings = get_embeddings(texts, input_type="document")

        rows = []
        for j, chunk in enumerate(batch):
            rows.append({
                "chunk_id": chunk["chunk_id"],
                "title": chunk["title"],
                "content": chunk["content"],
                "embedding": embeddings[j],
                "bereich": bereich,
                "source_type": source_type,
                "source_name": source_name,
                "relevante_agenten": ["Immobilien-Spezialist"],
                "token_count": len(chunk["content"].split())
            })

        resp = requests.post(url, headers=headers, json=rows, timeout=30)
        if resp.status_code in (200, 201):
            success += len(batch)
            print(f"  -> {len(batch)} Chunks gespeichert")
        else:
            print(f"  FEHLER: {resp.status_code} — {resp.text[:200]}")

        # Rate Limit (Voyage Free Tier: 300 RPM — grosszuegig warten)
        if i + batch_size < total:
            time.sleep(3)

    return success


def main():
    parser = argparse.ArgumentParser(description="Markdown in Knowledge Base ingestieren")
    parser.add_argument("--file", required=True, help="Pfad zur Markdown-Datei")
    parser.add_argument("--bereich", required=True, help="Fachbereich (z.B. immobilien)")
    parser.add_argument("--source_type", required=True, help="Typ (z.B. checklist, guide)")
    parser.add_argument("--source_name", required=True, help="Name der Quelle")
    args = parser.parse_args()

    filepath = Path(args.file)
    if not filepath.exists():
        print(f"FEHLER: Datei nicht gefunden: {filepath}")
        sys.exit(1)

    print(f"=== Markdown Ingest: {args.source_name} ===")
    print(f"Datei: {filepath}")
    print(f"Bereich: {args.bereich}")

    # 1. Lesen
    text = read_markdown(filepath)
    print(f"Text gelesen: {len(text)} Zeichen")

    # 2. Chunken
    chunks = split_by_headings(text, args.source_name)
    print(f"Chunks erstellt: {len(chunks)}")
    for c in chunks:
        print(f"  - {c['chunk_id']}: {c['title'][:60]}... ({len(c['content'])} Zeichen)")

    # 3. Embeddings + Upsert
    success = upsert_chunks(chunks, args.bereich, args.source_type, args.source_name)
    print(f"\n=== FERTIG: {success}/{len(chunks)} Chunks ingestiert ===")


if __name__ == "__main__":
    main()
