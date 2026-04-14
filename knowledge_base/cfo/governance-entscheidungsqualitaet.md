# Governance & Entscheidungsqualität
*Wissensstand: März 2026*
*Chunk-ID: cfo/governance-entscheidungsqualitaet*
*Relevante Agenten: CFO, Validator*

## Decision Journal

Nicht nur WAS entschieden wurde, sondern WARUM — die Annahmen dokumentieren.

### Eintrags-Format

```
DECISION LOG #[Nr]
Datum: [TT.MM.JJJJ]
Entscheidung: [Was wurde entschieden?]
Begründung: [Warum diese Option? Was sprach dagegen?]
Annahmen zum Zeitpunkt:
  - [Annahme 1: z.B. "Einkommen bleibt stabil bei ~100k"]
  - [Annahme 2: z.B. "UAE CT bleibt bei 9% für Free Zone Qualifying"]
  - [Annahme 3: z.B. "§6 AStG betrifft uns nicht (keine GmbH-Anteile >1%)"]
Beteiligte Agenten: [Liste]
Reversibility Score: [1-10]
Confidence: [🟢/🟡/🔴 X%]
Review-Datum: [+6 Monate] und [+12 Monate]
```

### Automatischer Review

Nach 6 und 12 Monaten:
1. Stimmten die Annahmen? (Ja/Nein + was hat sich geändert)
2. War die Entscheidung rückblickend richtig?
3. Was hätte man besser machen können?
4. Lessons Learned für zukünftige ähnliche Entscheidungen

Ergebnis in `decisions` Tabelle persistieren.

## Reversibility Score — Detaillierte Rubrik

| Score | Bezeichnung | Umkehr-Aufwand | Beispiele |
|-------|------------|----------------|-----------|
| 1 | Trivial | Klick/Anruf, 0€ | ETF-Kauf/Verkauf, Sparplan ändern |
| 2 | Einfach | Wenige Stunden, <100€ | Versicherung kündigen (Frist beachten), Abo wechseln |
| 3 | Unkompliziert | Tage, <1k€ | Broker-Wechsel, Steuerberater wechseln |
| 4 | Moderate Kosten | 1-2 Wochen, 1-5k€ | Depot-Transfer, KV-Wechsel |
| 5 | Aufwändig | 1-3 Monate, 5-15k€ | Immobilien-Strukturwechsel (Privat→GmbH), Firmen-Migration |
| 6 | Sehr aufwändig | 3-6 Monate, 15-30k€ | GmbH auflösen, Immobilie verkaufen |
| 7 | Schwer | 6-12 Monate, 30-50k€ | Firmengründung rückabwickeln, Visa zurückgeben |
| 8 | Sehr schwer | >12 Monate, 50-100k€ | GmbH-Anteile eingebracht + §6 AStG ausgelöst |
| 9 | Kaum möglich | Jahre, >100k€ | CBI-Investment (Spende nicht rückforderbar) |
| 10 | Irreversibel | Unmöglich | Abmeldung DE + alle Brücken abgebrochen, Staatsbürgerschaft aufgegeben |

### Konsequenzen nach Score

| Score-Bereich | Pflicht-Aktion |
|---------------|----------------|
| 1-4 | Normale Entscheidung, Decision Brief ausreichend |
| 5-6 | Decision Brief + 1 Woche Bedenkzeit empfehlen |
| 7-8 | Menschliche Validierung PFLICHT + 48h Bedenkzeit |
| 9-10 | Compliance Gate: StB + Anwalt prüfen + 1 Woche Bedenkzeit + explizite Mandanten-Bestätigung |

## Opportunity Cost Framework

Bei JEDER Entscheidung die Alternative explizit benennen:

"Wenn du [X]€ für [Entscheidung A] ausgibst, dann kannst du dieses Geld NICHT für [Alternative B] nutzen."

Beispiele:
- "60k€ für Immobilie #2 Eigenkapital = 60k€ NICHT in CBI investiert"
- "3 Monate für UAE-Firmengründung = 3 Monate NICHT an AI-Business gearbeitet"
- "15k€/Jahr für Doppel-Steuerberater = 15k€ NICHT in ETF-Portfolio"

Regel: Opportunity Cost immer in EUR und in Zeit beziffern.

## Regret Minimization Framework

Bezos-Heuristik bei strategischen Entscheidungen:

> "Werde ich in 10 Jahren bereuen, diese Entscheidung NICHT getroffen zu haben?"

Anwendung:
1. Stelle dir vor, du bist 40 (in 10 Jahren)
2. Blickst zurück auf heute
3. Bereust du es mehr, es GETAN zu haben (und es ging schief)?
4. Oder bereust du es mehr, es NICHT getan zu haben (und die Chance verpasst)?

**Wenn die Antwort "Ich bereue es mehr, es NICHT getan zu haben" → Entscheidungstendenz DAFÜR.**
**Aber:** Nur anwenden bei Entscheidungen mit asymmetrischem Upside (große Chance, begrenztes Risiko).

Nicht anwenden bei:
- Rein finanziellen Optimierungen (da zählen Zahlen, nicht Gefühl)
- Irreversiblen Entscheidungen mit existenziellem Risiko

## 48h-Bedenkzeit-Protokoll

Bei Reversibility Score ≥7:

1. Decision Brief erstellen und an Mandant senden
2. Expliziter Hinweis: "Diese Entscheidung ist schwer umkehrbar (Score [X]/10). Ich empfehle 48h Bedenkzeit."
3. Nach 48h: Follow-up — "Hast du dich entschieden? Soll ich den nächsten Schritt einleiten?"
4. Mandant muss EXPLIZIT bestätigen (keine implizite Zustimmung durch Schweigen)
5. Bestätigung + Datum im Decision Journal dokumentieren
