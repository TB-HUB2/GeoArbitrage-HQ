# Roadmap-Engine & Szenario-Vergleiche
*Wissensstand: März 2026*
*Chunk-ID: cfo/roadmap-szenario-engine*
*Relevante Agenten: CFO, Tax Architect, Relocation*

## Multi-Pfad-Planung

Bei JEDER strategischen Entscheidung (Wegzugsland, Firmenstruktur, CBI) automatisch 2-3 Szenarien parallel modellieren:

| Pfad | Beschreibung |
|------|-------------|
| **Pfad A (Status Quo)** | In DE bleiben, Portfolio normal wachsen lassen, kein Wegzug |
| **Pfad B (Zielland X)** | Wegzug nach Land X — Steuerersparnis vs. Setup-Kosten vs. Lebensqualität |
| **Pfad C (Zielland Y)** | Alternatives Zielland zum Vergleich — oft mit anderem Risikoprofil |

## Pro-Pfad-Berechnung

Für jeden Pfad über 5 / 10 / 15 Jahre berechnen:

| Dimension | Berechnung | Quelle |
|-----------|------------|--------|
| Gesamtkosten (einmalig) | Setup: CBI + Firmengründung + Umzug + Probeaufenthalt | Agents |
| Gesamtkosten (laufend/Jahr) | Doppel-StB + Versicherung + Compliance + Flüge DE | Agents |
| Steuerersparnis kumuliert | (DE-Steuerlast - Zielland-Steuerlast) × Jahre | Tax Architect |
| Nettovermögen (inflationsbereinigt) | Startkapital + Sparrate + Rendite - Steuern - Kosten | Wealth Manager |
| Break-Even-Zeitpunkt | Steuerersparnis kumuliert = Einmalkosten + (Mehrkosten × Jahre) | Berechnung |
| Lebensqualitäts-Score | Sicherheit, Klima, Infrastruktur, Lifestyle-Fit | Relocation |
| Risiko-Score | Validator Stress-Test + OSINT-Daten | Validator |
| Reversibilitäts-Score | Wie einfach kann man den Pfad abbrechen? (1-10) | CFO |

## Gesamtkostenbudget GeoArbitrage

Typische Kostenblöcke für einen Wegzug (alle Pfade):

| Kostenblock | Bandbreite | Anmerkung |
|-------------|-----------|-----------|
| CBI / Golden Visa | 0-200k EUR | Grenada ~150k, Dominica ~200k, UAE Visa ~1-5k |
| Firmengründung Ausland | 2-15k EUR | UAE Free Zone ~5-10k, US LLC ~500, Zypern Ltd ~3-5k |
| Doppel-Steuerberater (pro Jahr) | 5-15k EUR | DE + Zielland, höher im Wegzugsjahr |
| Versicherungswechsel (einmalig) | 2-5k EUR | KV-Übergang, PI-Neuabschluss |
| Umzug + Einrichtung | 5-20k EUR | Abhängig von Zielland und Lifestyle |
| Probeaufenthalt (1-3 Monate) | 3-10k EUR | Miete + Lebenshaltung + Flüge |
| Laufende Compliance (pro Jahr) | 3-8k EUR | Buchhaltung, Audits, Registered Agent |
| Flüge DE (pro Jahr) | 2-6k EUR | 4-8 Trips DE für Familie/Geschäft |
| **Gesamtbudget Phase 1-4** | **50-200k EUR** | **Je nach Pfad und Zielland** |

## Break-Even-Formel

```
Break-Even (Jahre) = Einmalkosten / (Jährliche Steuerersparnis - Jährliche Mehrkosten)
```

Beispiel:
- Einmalkosten UAE-Pfad: 30k EUR
- Jährliche Steuerersparnis: 25k EUR (von ~42% auf ~10% effektiv)
- Jährliche Mehrkosten: 8k EUR (Doppel-StB, Flüge, Compliance)
- Break-Even: 30k / (25k - 8k) = **1.8 Jahre**

## Szenario-Vergleichstabelle

Output-Format für den Mandanten:

```
| Dimension | Pfad A: DE bleiben | Pfad B: UAE | Pfad C: Georgien |
|-----------|--------------------|-------------|------------------|
| Einmalkosten | 0€ | 35k€ | 8k€ |
| Laufende Mehrkosten/Jahr | 0€ | 12k€ | 5k€ |
| Steuerersparnis/Jahr | 0€ | 25k€ | 18k€ |
| Break-Even | — | 2.7 Jahre | 0.6 Jahre |
| NW nach 10 Jahren | X€ | Y€ | Z€ |
| Lebensqualität | 7/10 | 8/10 | 6/10 |
| Risiko-Score | Niedrig | Mittel | Niedrig |
| Reversibilität | — | 5/10 | 8/10 |
| Empfehlung CFO | Baseline | Favorit | Alternative |
```

## Gantt-Logik

Welche Schritte parallel, welche sequentiell?

**Parallelisierbar:**
- CBI-Antrag + Firmengründung (verschiedene Prozesse)
- Immobilien-Strukturierung + Portfolio-Rebalancing
- Probeaufenthalt + Versicherungswechsel-Recherche

**Sequentiell (Abhängigkeiten):**
1. Steuerplan MUSS vor Firmenstruktur stehen (Struktur hängt vom Steuerplan ab)
2. Firmenstruktur MUSS vor Bankkonto stehen (Bank braucht Firmendokumente)
3. Visa/Residenz MUSS vor Abmeldung DE stehen (Zielland-Aufenthalt gesichert)
4. Bankkonto DE MUSS vor Abmeldung stehen (nach Abmeldung schwieriger)
5. Abmeldung DE MUSS letzter Schritt sein (alle Voraussetzungen erfüllt)

**Kritischer Pfad:** Der längste sequentielle Strang bestimmt die Gesamtdauer. Typisch: CBI (4-6 Monate) oder Firmengründung + Banking (3-4 Monate).

## Update-Regel

Szenario-Berechnung wird NEU durchlaufen bei:
- Steuerreform in Zielland (z.B. UAE CT-Änderung)
- Signifikante Vermögensänderung (>10%)
- Neues Zielland in Betracht
- Lebensveränderung (Partnerschaft, Kind, Jobwechsel)
- Quartals-Review (mindestens 4x/Jahr)
