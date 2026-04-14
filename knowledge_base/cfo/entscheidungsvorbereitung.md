# Entscheidungsvorbereitung & Decision Briefs
*Wissensstand: März 2026*
*Chunk-ID: cfo/entscheidungsvorbereitung*
*Relevante Agenten: CFO, Validator*

## Decision Brief — Vollständiges Template

```
DECISION BRIEF: [Thema]
Datum: [TT.MM.JJJJ]
Erstellt durch: CFO Orchestrator
Beteiligte Agenten: [Liste]

DRINGLICHKEIT: [🔴 Sofort / 🟡 Diesen Monat / 🟢 Kann warten]
Begründung Dringlichkeit: [Frist, Marktlage, oder strategischer Grund]

PROBLEM:
[1-2 Sätze: Was ist die Frage / das Problem / die Entscheidung?]

KONTEXT:
[Relevante Fakten: Vermögenslage, steuerliche Situation, Timeline, bisherige Entscheidungen]

OPTIONEN:
| Option | Pro | Contra | Kosten (einmalig) | Kosten (laufend/Jahr) | Timeline | Reversibel? |
|--------|-----|--------|--------------------|-----------------------|----------|-------------|
| A: ... | ... | ...    | ...                | ...                   | ...      | Score 1-10  |
| B: ... | ... | ...    | ...                | ...                   | ...      | Score 1-10  |
| C: ... | ... | ...    | ...                | ...                   | ...      | Score 1-10  |

EMPFEHLUNG CFO:
Option [X], weil: [Begründung mit Bezug auf Mandantenprofil und -ziele]

RISIKEN (Top 3):
1. [Risiko + Eintrittswahrscheinlichkeit + Mitigation]
2. [...]
3. [...]

BETROFFENE BEREICHE:
[AFFECTS: TAX / IMMOBILIEN / CORPORATE / IMMIGRATION / WEALTH / INSURANCE / RELOCATION]

NÄCHSTER SCHRITT:
- Action: [Was genau tun]
- Verantwortlich: [Mandant / StB / Anwalt / Agent]
- Frist: [Datum]
- Eskalation nötig: [Ja/Nein → wenn ja: menschlicher Experte Typ]
```

## Priorisierungs-Framework

Dringlichkeit bestimmen nach 3 Kriterien:

| Kriterium | 🔴 Sofort | 🟡 Diesen Monat | 🟢 Kann warten |
|-----------|-----------|-----------------|----------------|
| Frist | <1 Woche | <4 Wochen | >4 Wochen |
| Finanzielle Tragweite | >50k EUR oder irreversibel | 5-50k EUR | <5k EUR |
| Opportunitätskosten bei Verzögerung | Hoch (Markt, Programm läuft aus) | Mittel | Gering |

Bei Gleichzeitigkeit mehrerer Entscheidungen: Priorisiere nach Reversibilität — irreversible Entscheidungen zuerst gründlich prüfen.

## Szenario-Simulation über 7 Bereiche

Bei JEDER strategischen Entscheidung: Auswirkung auf ALLE 7 Fachbereiche durchspielen.

Beispiel "Wegzug nach UAE":

| Bereich | Auswirkung | Agent |
|---------|------------|-------|
| Tax | 0% ESt, aber §2 AStG 10 Jahre, §6 AStG auf GmbH-Anteile | Tax Architect |
| Immobilien | DE-Immobilien bleiben §49 EStG-pflichtig, Finanzierung prüfen | Immobilien |
| Corporate | Free Zone vs. Mainland, Substance Requirements | Corporate |
| Immigration | Residency Visa, 183-Tage, Emirates ID | Immigration |
| Wealth | Depot-Migration, Quellensteuer-Änderung, DAC8 | Wealth |
| Insurance | KV-Wechsel, PI mit UAE-Deckung, Transition-Gap | Insurance |
| Relocation | Hitze, Kosten, Timezone, Golf, Community | Relocation |

## Monte Carlo Parameter

Für finanzielle Langzeitplanung — 3 Szenarien modellieren:

| Parameter | Pessimistisch | Realistisch | Optimistisch |
|-----------|--------------|-------------|--------------|
| Aktienrendite p.a. | 3% | 7% | 10% |
| Immobilienwertsteigerung p.a. | 0% | 2% | 4% |
| Inflation p.a. | 4% | 2.5% | 1.5% |
| AI-Revenue Wachstum p.a. | -20% | +15% | +40% |
| EUR/USD Entwicklung | EUR +10% | Stabil | EUR -10% |

Projektionszeiträume: 5 / 10 / 15 / 20 Jahre

## Reversibilitäts-Rubrik

| Score | Bedeutung | Beispiele | Konsequenz |
|-------|-----------|-----------|------------|
| 1-2 | Trivial umkehrbar | ETF-Kauf, Sparplan-Anpassung | Keine Sonderprüfung |
| 3-4 | Leicht umkehrbar mit Kosten | Versicherungswechsel, Broker-Wechsel | Kosten der Umkehr beziffern |
| 5-6 | Aufwändig umkehrbar | Immobilien-Strukturwechsel, Depot-Transfer | Decision Brief + 1 Woche Bedenkzeit |
| 7-8 | Schwer umkehrbar | Firmengründung im Ausland, GmbH-Einbringung | Menschliche Validierung + 48h Bedenkzeit |
| 9-10 | Praktisch irreversibel | CBI-Antrag, Abmeldung DE, §6 AStG ausgelöst | Compliance Gate: StB + Anwalt + 1 Woche |

**Regel:** Ab Score ≥7 → menschliche Validierung PFLICHT, Mandant muss explizit bestätigen.
