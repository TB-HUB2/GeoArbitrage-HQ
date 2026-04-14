#!/opt/geoarbitrage/venv/bin/python3
"""
Sprint 3.1 — Embedding-Pipeline: PDF-Dokumente in Supabase knowledge_base laden.

Liest PDFs, splittet in ~500-Token-Chunks (50 Token Overlap),
generiert Voyage AI Embeddings (voyage-4-lite, 1024 Dimensionen),
speichert alles in Supabase knowledge_base Tabelle.

Usage:
  python ingest_documents.py --file /pfad/zur/datei.pdf \
    --bereich tax --source_type law --source_name "AStG"

  python ingest_documents.py --file /pfad/zur/datei.pdf \
    --bereich tax --source_type dba --source_name "DBA DE-UAE"

Env-Variablen (aus /opt/geoarbitrage/.env):
  VOYAGE_API_KEY          — Voyage AI API Key
  SUPABASE_URL            — z.B. https://YOUR_PROJECT.supabase.co
  SUPABASE_SERVICE_ROLE_KEY — Service Role Key (fuer Insert)
"""

import argparse
import json
import os
import re
import sys
import time
import unicodedata
from pathlib import Path

try:
    import requests
except ImportError:
    print("FEHLER: 'requests' nicht installiert. Bitte: pip install requests")
    sys.exit(1)

try:
    import pdfplumber
except ImportError:
    try:
        from pypdf import PdfReader
        USE_PDFPLUMBER = False
    except ImportError:
        print("FEHLER: Weder 'pdfplumber' noch 'pypdf' installiert.")
        print("Bitte: pip install pdfplumber pypdf")
        sys.exit(1)
    else:
        USE_PDFPLUMBER = False
else:
    USE_PDFPLUMBER = True


# --- Konfiguration ---

VOYAGE_API_URL = "https://api.voyageai.com/v1/embeddings"
VOYAGE_MODEL = "voyage-4-lite"
VOYAGE_DIMENSIONS = 1024
VOYAGE_RPM_LIMIT = 280  # Etwas unter 300 RPM fuer Sicherheit

CHUNK_TARGET_TOKENS = 500
CHUNK_OVERLAP_TOKENS = 50
APPROX_CHARS_PER_TOKEN = 4  # Deutsch: ~4 Zeichen pro Token

# Bereichs-Mapping: bereich -> relevante_agenten
BEREICH_AGENTEN_MAP = {
    "tax": ["Tax Architect", "CFO"],
    "immobilien": ["Immobilien-Spezialist", "CFO"],
    "corporate": ["Gesellschaftsrechtler", "CFO"],
    "immigration": ["Immigration-Spezialist", "CFO"],
    "wealth": ["Wealth Manager", "CFO"],
    "insurance": ["Versicherungs-Analyst", "CFO"],
    "relocation": ["Relocation-Analyst", "CFO"],
    "cfo": ["CFO"],
    "shared": ["CFO", "Tax Architect", "Immobilien-Spezialist",
               "Gesellschaftsrechtler", "Immigration-Spezialist",
               "Wealth Manager", "Versicherungs-Analyst", "Relocation-Analyst"],
    "quality": ["Validator", "CFO"],
}


def load_env_file(path="/opt/geoarbitrage/.env"):
    """Laedt .env Datei falls vorhanden (fuer Server-Deployment)."""
    if not os.path.exists(path):
        return
    with open(path) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" in line:
                key, _, value = line.partition("=")
                key = key.strip()
                value = value.strip().strip("'\"")
                if key and key not in os.environ:
                    os.environ[key] = value


def get_env(name):
    """Holt Env-Variable, bricht ab wenn nicht gesetzt."""
    val = os.environ.get(name)
    if not val:
        print(f"FEHLER: Umgebungsvariable {name} nicht gesetzt!")
        print(f"Setze sie in /opt/geoarbitrage/.env oder exportiere sie.")
        sys.exit(1)
    return val


def extract_text_from_pdf(filepath):
    """Extrahiert Text aus PDF mit pdfplumber (bevorzugt) oder pypdf."""
    filepath = Path(filepath)
    if not filepath.exists():
        print(f"FEHLER: Datei nicht gefunden: {filepath}")
        sys.exit(1)

    pages_text = []
    if USE_PDFPLUMBER:
        with pdfplumber.open(filepath) as pdf:
            for i, page in enumerate(pdf.pages):
                text = page.extract_text() or ""
                pages_text.append(text)
                if (i + 1) % 10 == 0:
                    print(f"  Seite {i + 1}/{len(pdf.pages)} gelesen...")
    else:
        reader = PdfReader(str(filepath))
        for i, page in enumerate(reader.pages):
            text = page.extract_text() or ""
            pages_text.append(text)
            if (i + 1) % 10 == 0:
                print(f"  Seite {i + 1}/{len(reader.pages)} gelesen...")

    full_text = "\n\n".join(pages_text)

    # Bereinigung
    full_text = unicodedata.normalize("NFKC", full_text)
    full_text = re.sub(r"\n{3,}", "\n\n", full_text)       # Max 2 Zeilenumbrueche
    full_text = re.sub(r"[ \t]{2,}", " ", full_text)        # Mehrfach-Spaces
    full_text = re.sub(r"-\n(\w)", r"\1", full_text)        # Silbentrennung reparieren

    return full_text


def estimate_tokens(text):
    """Schaetzt Token-Anzahl (~4 Zeichen pro Token fuer Deutsch)."""
    return len(text) // APPROX_CHARS_PER_TOKEN


def chunk_text(text, target_tokens=CHUNK_TARGET_TOKENS, overlap_tokens=CHUNK_OVERLAP_TOKENS):
    """
    Splittet Text in Chunks von ~target_tokens mit overlap_tokens Ueberlappung.
    Versucht an Absatzgrenzen zu splitten.
    """
    target_chars = target_tokens * APPROX_CHARS_PER_TOKEN
    overlap_chars = overlap_tokens * APPROX_CHARS_PER_TOKEN

    # Splits an Absaetzen
    paragraphs = re.split(r"\n\n+", text)
    paragraphs = [p.strip() for p in paragraphs if p.strip()]

    chunks = []
    current_chunk = ""

    for para in paragraphs:
        # Wenn der Absatz allein schon zu gross ist, hart splitten
        if len(para) > target_chars * 1.5:
            # Erst aktuellen Chunk abschliessen
            if current_chunk:
                chunks.append(current_chunk.strip())
                # Overlap: Ende des letzten Chunks
                current_chunk = current_chunk[-overlap_chars:] if len(current_chunk) > overlap_chars else ""

            # Grossen Absatz in Satz-Stuecke splitten
            sentences = re.split(r"(?<=[.!?])\s+", para)
            for sent in sentences:
                if len(current_chunk) + len(sent) + 1 > target_chars:
                    if current_chunk:
                        chunks.append(current_chunk.strip())
                        current_chunk = current_chunk[-overlap_chars:] if len(current_chunk) > overlap_chars else ""
                current_chunk += " " + sent if current_chunk else sent
            continue

        # Absatz passt noch rein?
        if len(current_chunk) + len(para) + 2 > target_chars and current_chunk:
            chunks.append(current_chunk.strip())
            # Overlap: Ende des letzten Chunks
            current_chunk = current_chunk[-overlap_chars:] if len(current_chunk) > overlap_chars else ""

        current_chunk += "\n\n" + para if current_chunk else para

    # Letzten Chunk nicht vergessen
    if current_chunk.strip():
        chunks.append(current_chunk.strip())

    return chunks


def generate_chunk_id(source_name, index):
    """Generiert chunk_id aus source_name + Index."""
    # Normalisieren: Sonderzeichen ersetzen, lowercase
    slug = source_name.lower()
    slug = re.sub(r"[§]+", "p", slug)           # § -> p (fuer Paragraph)
    slug = re.sub(r"[^a-z0-9\-]+", "-", slug)   # Nur a-z, 0-9, -
    slug = re.sub(r"-{2,}", "-", slug)           # Doppel-Bindestriche
    slug = slug.strip("-")
    return f"{slug}/chunk-{index:03d}"


def get_embeddings(texts, api_key):
    """
    Generiert Embeddings fuer eine Liste von Texten via Voyage AI.
    Respektiert Rate Limiting.
    """
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    embeddings = []
    batch_size = 8  # Voyage AI erlaubt bis zu 128, aber wir bleiben konservativ

    for i in range(0, len(texts), batch_size):
        batch = texts[i:i + batch_size]

        payload = {
            "input": batch,
            "model": VOYAGE_MODEL,
            "input_type": "document",
        }

        # Rate Limiting: min. 200ms zwischen Requests
        time.sleep(60 / VOYAGE_RPM_LIMIT)

        try:
            resp = requests.post(VOYAGE_API_URL, headers=headers, json=payload, timeout=30)
            resp.raise_for_status()
        except requests.exceptions.HTTPError as e:
            print(f"\n  FEHLER bei Voyage AI API: {e}")
            print(f"  Response: {resp.text[:500]}")
            if resp.status_code == 429:
                print("  Rate Limit erreicht! Warte 60 Sekunden...")
                time.sleep(60)
                # Retry
                resp = requests.post(VOYAGE_API_URL, headers=headers, json=payload, timeout=30)
                resp.raise_for_status()
            else:
                sys.exit(1)
        except requests.exceptions.RequestException as e:
            print(f"\n  FEHLER bei Voyage AI API: {e}")
            sys.exit(1)

        data = resp.json()
        for item in data.get("data", []):
            embeddings.append(item["embedding"])

        total_tokens = data.get("usage", {}).get("total_tokens", 0)
        print(f"  Batch {i // batch_size + 1}: {len(batch)} Chunks, {total_tokens} Tokens embedded")

    return embeddings


def upsert_to_supabase(chunks_data, supabase_url, supabase_key):
    """Speichert Chunks mit Embeddings in Supabase knowledge_base."""
    url = f"{supabase_url}/rest/v1/knowledge_base"
    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates",  # Upsert on chunk_id
    }

    # Batch-Insert (max 50 pro Request wegen Payload-Groesse)
    batch_size = 10
    inserted = 0

    for i in range(0, len(chunks_data), batch_size):
        batch = chunks_data[i:i + batch_size]

        try:
            resp = requests.post(url, headers=headers, json=batch, timeout=30)
            resp.raise_for_status()
            inserted += len(batch)
            print(f"  Supabase: {inserted}/{len(chunks_data)} Chunks gespeichert")
        except requests.exceptions.HTTPError as e:
            print(f"\n  FEHLER bei Supabase Upsert: {e}")
            print(f"  Response: {resp.text[:500]}")
            # Bei Conflict (409) trotzdem weitermachen
            if resp.status_code == 409:
                print("  -> Duplikate uebersprungen (chunk_id existiert)")
                inserted += len(batch)
            else:
                sys.exit(1)

    return inserted


def main():
    parser = argparse.ArgumentParser(
        description="PDF-Dokumente in Supabase knowledge_base embedden und speichern."
    )
    parser.add_argument("--file", required=True, help="Pfad zur PDF-Datei")
    parser.add_argument("--bereich", required=True,
                        choices=list(BEREICH_AGENTEN_MAP.keys()),
                        help="Wissensbereich (tax, immobilien, corporate, ...)")
    parser.add_argument("--source_type", required=True,
                        choices=["law", "dba", "bfh_ruling", "program_guide", "article"],
                        help="Dokumenttyp")
    parser.add_argument("--source_name", required=True,
                        help='Quellname, z.B. "AStG" oder "DBA DE-UAE"')
    parser.add_argument("--dry-run", action="store_true",
                        help="Nur Chunks anzeigen, nicht embedden/speichern")
    parser.add_argument("--env-file", default="/opt/geoarbitrage/.env",
                        help="Pfad zur .env Datei (Default: /opt/geoarbitrage/.env)")

    args = parser.parse_args()

    print("=" * 60)
    print(f"Sprint 3.1 — Embedding-Pipeline")
    print(f"=" * 60)
    print(f"Datei:       {args.file}")
    print(f"Bereich:     {args.bereich}")
    print(f"Source Type: {args.source_type}")
    print(f"Source Name: {args.source_name}")
    print(f"Dry Run:     {args.dry_run}")
    print()

    # 1. Env laden
    load_env_file(args.env_file)

    if not args.dry_run:
        voyage_key = get_env("VOYAGE_API_KEY")
        supabase_url = get_env("SUPABASE_URL")
        supabase_key = get_env("SUPABASE_SERVICE_ROLE_KEY")

    # 2. PDF lesen
    print("[1/4] PDF lesen...")
    text = extract_text_from_pdf(args.file)
    total_chars = len(text)
    total_tokens_est = estimate_tokens(text)
    print(f"  -> {total_chars} Zeichen, ~{total_tokens_est} Tokens")

    if total_tokens_est < 10:
        print("FEHLER: Zu wenig Text extrahiert. PDF evtl. gescannt (Bild-PDF)?")
        sys.exit(1)

    # 3. Chunken
    print("\n[2/4] Text in Chunks aufteilen...")
    chunks = chunk_text(text)
    print(f"  -> {len(chunks)} Chunks erstellt")

    for i, chunk in enumerate(chunks):
        tok = estimate_tokens(chunk)
        cid = generate_chunk_id(args.source_name, i + 1)
        print(f"     Chunk {i + 1:3d}: {tok:4d} Tokens | {cid}")

    if args.dry_run:
        print("\n[DRY RUN] Keine Embeddings/Speicherung. Fertig.")
        return

    # 4. Embeddings generieren
    print(f"\n[3/4] Embeddings generieren (Voyage AI {VOYAGE_MODEL})...")
    embeddings = get_embeddings(chunks, voyage_key)

    if len(embeddings) != len(chunks):
        print(f"FEHLER: {len(embeddings)} Embeddings fuer {len(chunks)} Chunks!")
        sys.exit(1)

    # 5. Daten fuer Supabase vorbereiten
    print(f"\n[4/4] In Supabase speichern...")
    agenten = BEREICH_AGENTEN_MAP.get(args.bereich, ["CFO"])

    chunks_data = []
    for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
        chunk_id = generate_chunk_id(args.source_name, i + 1)
        title = f"{args.source_name} — Teil {i + 1}"
        token_count = estimate_tokens(chunk)

        chunks_data.append({
            "chunk_id": chunk_id,
            "title": title,
            "content": chunk,
            "bereich": args.bereich,
            "relevante_agenten": agenten,
            "source_type": args.source_type,
            "source_name": args.source_name,
            "embedding": embedding,
            "token_count": token_count,
            "verification_status": "unverified",
        })

    inserted = upsert_to_supabase(chunks_data, supabase_url, supabase_key)

    # Zusammenfassung
    print()
    print("=" * 60)
    print("FERTIG!")
    print(f"  Datei:        {args.file}")
    print(f"  Chunks:       {len(chunks)}")
    print(f"  Gespeichert:  {inserted}")
    print(f"  Bereich:      {args.bereich}")
    print(f"  Source:       {args.source_name} ({args.source_type})")
    total_tokens_chunks = sum(estimate_tokens(c) for c in chunks)
    print(f"  Total Tokens: ~{total_tokens_chunks}")
    print("=" * 60)


if __name__ == "__main__":
    main()
