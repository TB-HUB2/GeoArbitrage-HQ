# Reporting, Monitoring & Auto Commentary
*Wissensstand: März 2026*
*Chunk-ID: cfo/reporting-auto-commentary*
*Relevante Agenten: CFO*

## Monatlicher Status-Report

Wird am Monatsende automatisch generiert. Enthält:

### 1. Budget-Abweichung
```
| Kategorie | Plan | Ist | Abweichung | Status |
|-----------|------|-----|------------|--------|
| Einkommen | X€   | Y€  | ±Z%        | OK/WARN |
| Fixkosten | X€   | Y€  | ±Z%        | OK/WARN |
| Variable  | X€   | Y€  | ±Z%        | OK/WARN |
| Investitionen | X€ | Y€ | ±Z%       | OK/WARN |
| Sparquote | X%   | Y%  | ±Zpp       | OK/WARN |
```
Regel: >20% Abweichung in einer Kategorie → Warnung mit Ursache.

### 2. Vermögensentwicklung
- Nettovermögen: X€ (Vormonat: Y€, Veränderung: ±Z€ / ±W%)
- Aufschlüsselung: Immobilien-Equity, Portfolio, Krypto, Cash, Sonstiges
- FIRE-Quote: Passive Income / Monatliche Ausgaben = X% (Ziel: 100%)

### 3. Offene Action Items
- [Action] — Verantwortlich: [Wer] — Frist: [Datum] — Status: [Offen/Überfällig]

### 4. Nächste Meilensteine & Fristen
- [Meilenstein/Frist] — Datum — Verbleibend: X Tage — Status

### 5. Risiko-Register (Top 3 aktive Risiken)
- [Risiko] — Wahrscheinlichkeit: H/M/L — Impact: H/M/L — Mitigation

## Quartals-Review

Einmal pro Quartal — strategische Überprüfung:

1. **Strategie on track?** — Sind die GeoArbitrage-Meilensteine im Plan?
2. **Umfeld-Änderungen** — Neue Gesetze, Programmänderungen, Marktentwicklungen?
3. **Agent-Performance** — Coverage Gaps aufgetreten? Welche Themen kamen häufig?
4. **Knowledge Staleness** — Welche KB-Chunks sind >6 Monate alt (Tax/Immigration) bzw. >12 Monate (andere)?
5. **Kosten-Review** — API-Kosten, Berater-Kosten, System-Kosten → noch im Budget?

## Jahres-Simulation

Zum Jahresende — Gesamtprognose aktualisieren:

1. **Vermögensentwicklung** — Ist vs. Prognose vom Vorjahr, neue Prognose 5/10/15 Jahre
2. **Steuerlast-Vergleich** — Effektive Steuerquote DE vs. Zielland-Szenarien
3. **FIRE-Fortschritt** — Wo steht der Mandant auf dem Weg zur finanziellen Unabhängigkeit?
4. **Roadmap-Update** — Pfade A/B/C neu bewerten, ggf. neue Pfade, Break-Even aktualisieren
5. **Exit-Readiness** — Gewichtete Checkliste: Wie bereit ist der Mandant für den Wegzug?

## Auto Commentary — BlackRock Aladdin-Stil

Monatliches Narrativ-Briefing (3-4 Absätze, persönlicher Ton):

### Absatz 1 — Was ist passiert
"Dein Nettovermögen ist im [Monat] um [X]€ ([Y]%) [gestiegen/gefallen]. Haupttreiber: [Asset-Klasse] mit [±Z]%. [Besonderes Ereignis wenn relevant.]"

### Absatz 2 — Kontext
"Die Entwicklung liegt [über/unter/im Bereich] deiner Zielrendite von [X]% p.a. Deine Immobilien-Equity wächst planmäßig durch Tilgung (+[X]€/Mo). [Markt-Kontext wenn relevant.] Deine Sparquote lag bei [X]% ([über/unter] dem Ziel von [Y]%)."

### Absatz 3 — Handlungsbedarf
"Konkret empfehle ich diesen Monat: [1-3 priorisierte Aktionen]. [Keine Aktion erfordert sofortige Reaktion / Aktion X ist zeitkritisch wegen Frist am TT.MM.]"

### Absatz 4 — Ausblick
"Nächsten Monat steht an: [Frist/Event/Meilenstein]. Dein GeoArbitrage-Projekt ist zu [X]% Exit-Ready (Veränderung: [±Ypp] vs. Vormonat)."

### Ton-Vorgabe
Wie ein persönlicher CFO der dir beim Frühstück einen 2-Minuten-Briefing gibt. Klar, direkt, keine Fachsprache wo nicht nötig. Motivierend aber ehrlich.

### Input-Mapping (DB-Tabellen)
| Datenquelle | Tabelle | Verwendung |
|-------------|---------|------------|
| Vermögen | wealth_snapshots | Vormonat vs. aktuell |
| Portfolio | portfolio_holdings | Performance, Dividenden |
| Immobilien | properties | Tilgung, Cashflow, Equity |
| Budget | budget | Sparquote, Abweichungen |
| Scan-Ergebnisse | monthly_scan_results | Umfeld-Änderungen |
| Meilensteine | milestones | Fortschritt, Exit-Readiness |
| Fristen | calendar_events | Nächste Deadlines |
| Länderstabilität | country_stability | OSINT-Lage Zielländer |

### Delivery
- **Telegram:** Gekürzt auf max 4096 Zeichen, Absätze 1+3 priorisiert, mit "Details im Dashboard"
- **Dashboard (Scan Tab):** Vollständiger Text mit allen 4 Absätzen + Daten-Tabellen
