# Worst-Case-Szenarien & Hidden-Cost-Analyse
*Wissensstand: März 2026*
*Chunk-ID: quality/worst-case-szenarien*
*Relevante Agenten: Validator, CFO-Agent*

## Szenario-Templates für Stress-Tests

### Szenario 1: Finanzkrise 2008-Style

| Dimension | Impact | Historischer Bezug |
|-----------|--------|-------------------|
| Aktien-Portfolio | -40 bis -55% | S&P 500: -57% (Okt 2007 → März 2009) |
| Immobilienwerte DE | -10 bis -20% | DE 2009: -5% (mild), Spanien/Irland: -40% |
| Krypto | -70 bis -90% | Krypto Winter 2022: BTC -75% |
| EUR/USD | Volatil (±15%) | EUR/USD 2008: 1.60 → 1.25 |
| Mieteinnahmen | -5 bis -15% (Leerstand) | Weniger Umzüge, längerer Leerstand |
| AI-Business Revenue | -20 bis -40% | Unternehmen kürzen Beratungsbudgets |
| Bankzugang | Einschränkungen möglich | Kreditlinien werden gestrichen |

**Mandant-spezifischer Impact:**
- Portfolio (angenommen 100k): -50k bis -55k
- Immobilie (angenommen 250k): -25k bis -50k Wert (aber Miete fließt weiter)
- AI-Revenue (angenommen 50k/J): -10k bis -20k
- **Gesamt-Vermögensverlust:** -85k bis -125k (temporär, Erholung 3-5 Jahre)

**Stress-Frage:** Kann der Mandant bei -125k Vermögensverlust + -20k Revenue-Rückgang weiterhin im Zielland leben? → Notfallreserve (6 Monate) ausreichend?

### Szenario 2: Politische Krise im Zielland

| Dimension | UAE | Georgien | Thailand | Portugal |
|-----------|-----|---------|----------|----------|
| Visa-Entzugsrisiko | Niedrig | Mittel-Hoch | Niedrig | Sehr niedrig |
| Bankkonto-Einfrierung | Niedrig | Mittel | Niedrig | Sehr niedrig |
| Kapitalverkehrskontrollen | Niedrig | Möglich | Möglich | Sehr niedrig (EU) |
| Evakuierung nötig? | Unwahrscheinlich | Möglich (Russland-Nähe) | Unwahrscheinlich | Nein |
| Kosten der Rückkehr nach DE | 15-25k€ | 15-25k€ | 20-30k€ | 15-20k€ |
| Zeitrahmen Rückkehr | 2-4 Wochen | 1-2 Wochen | 2-4 Wochen | 1-2 Wochen |
| Historischer Bezug | — | 2024 Proteste | 2014/2024 Coups | — |

**Stress-Frage:** Hat der Mandant einen Plan B für sofortige Rückkehr? Banking in DE noch aktiv? Versicherung deckt Evakuierung?

### Szenario 3: Persönliche Lebensveränderung

| Ereignis | Impact auf Geo-Arbitrage-Plan | Reversibilitäts-Kosten |
|----------|------------------------------|----------------------|
| Neue Partnerin (in DE) | Wegzugs-Plan ggf. obsolet oder verzögert | 0-5k€ (nur Planänderung) |
| Kind geboren | Visa-Situation komplex, Schul-System prüfen | 10-20k€ (Umstrukturierung) |
| Elternteil pflegebedürftig | Rückkehr-Druck, Flugzeit-Kriterium wird hart | 15-25k€ (temporäre/dauerhafte Rückkehr) |
| Chronische Erkrankung | KV-Situation kritisch, Rückkehr nach DE nötig? | PKV-Anwartschaft = Rettungsanker |
| Burnout/Depression | Therapie-Zugang im Zielland? Isolation verschärft? | 5-15k€ (Therapie + ggf. Rückkehr) |
| Job-/Revenue-Verlust (>6 Mo) | Notfallreserve aufgebraucht, Wegzug ggf. nicht leistbar | Rückkehr: 15-25k€ |

**Stress-Frage:** Welches Lebensereignis hat die höchste Wahrscheinlichkeit (5-Jahres-Horizont) UND den größten Impact? → Dieses priorisieren in der Risikoanalyse.

### Szenario 4: Regulatorische Wende

| Änderung | Wahrscheinlichkeit (5J) | Impact | Historischer Bezug |
|----------|----------------------|--------|-------------------|
| Zielland führt Einkommensteuer ein | Mittel (UAE: niedrig, andere: mittel) | Steuer-Vorteil fällt weg | UAE CT 2023 (0%→9%) |
| EU schließt Golden Visa | Hoch (Trend eindeutig) | RBI-Route blockiert | Spanien 2025, Portugal 2023, Irland 2023 |
| ATAD III wird doch beschlossen | Mittel | Shell-Companies werden bestraft | Blockiert seit 2023, aber EU-Druck steigt |
| DAC8 wird auf Nicht-EU ausgeweitet (CARF) | Hoch | Krypto-Transparenz auch außerhalb EU | OECD CARF: 75 Länder committed |
| §2 AStG Nachlauf wird auf 15 Jahre erhöht | Niedrig-Mittel | Verlängerte DE-Steuerpflicht | Politisch diskutiert, aber kein Entwurf |
| DE führt Exit Tax auf Immobilien ein (nicht nur GmbH-Anteile) | Niedrig | Immobilien bei Wegzug besteuert | Bisher NUR auf GmbH-Anteile (§6 AStG) |

**Stress-Frage:** Welche regulatorische Änderung würde den GESAMTEN Plan kippen? → Ist der Plan robust genug um auch bei Steuererhöhung im Zielland sinnvoll zu sein (Lebensqualität allein rechtfertigt Wegzug)?

## Hidden-Cost-Kalkulator

### Kosten die JEDER Geo-Arbitrage-Plan hat (aber oft vergessen werden)

| Kostenkategorie | Einmalig | Laufend/Jahr | Quelle |
|----------------|---------|-------------|--------|
| **Doppel-Steuerberater** (DE + Zielland) | 500-1.500€ (Erstberatung) | 5.000-15.000€ | Abhängig von Komplexität |
| **Anwalt** (Firmengründung, Visa, Verträge) | 3.000-10.000€ | 1.000-3.000€ (laufende Beratung) | Jurisdiktionsabhängig |
| **Flüge nach DE** (Familie, Geschäft, Behörden) | — | 2.000-6.000€ (4-8 Trips) | Entfernungsabhängig |
| **Bürokratie-Zeitaufwand** | 100-200 Stunden | 30-50 Stunden/Jahr | Opportunitätskosten! |
| **Opportunitätskosten** (Karriere in DE aufgeben) | — | 10.000-30.000€ (entgangenes Gehaltswachstum) | Schwer quantifizierbar |
| **Psychische Kosten** (Isolation, Kulturschock) | — | Nicht quantifizierbar | Real aber immateriell |
| **Fehlerkorrektur-Kosten** (Struktur auflösen) | 5.000-30.000€ | — | Bei Rückkehr oder Planänderung |
| **Netzwerk-Verlust** | — | Nicht quantifizierbar | Geschäftskontakte, Freundschaften |

### Beispiel: Gesamt-Hidden-Costs für UAE-Wegzug (Jahr 1)

| Position | Kosten |
|----------|--------|
| Firmengründung (Free Zone) + Anwalt | 12.000€ |
| Visum + Emirates ID | 3.000€ |
| Umzug + Einrichtung | 15.000€ |
| Doppel-Steuerberater (Wegzugsjahr!) | 8.000€ |
| Flüge DE (4x im ersten Jahr) | 3.000€ |
| Bürokratie-Zeit (150h × 50€/h) | 7.500€ |
| Probeaufenthalt (1 Monat vorher) | 5.000€ |
| **Gesamt Hidden Costs Jahr 1** | **53.500€** |
| Steuerersparnis Jahr 1 (bei 100k) | ~25.000€ |
| **Netto Jahr 1** | **-28.500€** (Hidden Costs > Steuerersparnis!) |

**Erkenntnis:** Im ersten Jahr sind die Hidden Costs HÖHER als die Steuerersparnis. Break-Even typisch erst in **Jahr 2-3**. Dem Mandanten KLAR kommunizieren: "Du sparst nicht ab Tag 1."

## Annahmen-Fragilitäts-Ranking

Für jede Empfehlung: Welche Annahmen sind am fragilsten?

| Annahme | Fragilität | Wenn falsch, Impact | Mitigation |
|---------|-----------|--------------------| -----------|
| "Einkommen bleibt bei 100k+" | HOCH (AI-Markt volatil) | Wegzugs-Plan nicht finanzierbar | Notfall-Reserve 6 Mo, Rückkehr-Plan |
| "Remote Work bleibt akzeptiert" | MITTEL (Return-to-Office Trend) | Kunden verlangen Präsenz → Rückkehr | Hybrid-Kunden diversifizieren |
| "Steuerregime bleibt stabil" | MITTEL (historisch: 10-15J Zyklen) | Steuer-Vorteil fällt weg | Plan muss auch ohne Steuer-Vorteil Sinn machen (Lifestyle) |
| "Mandant bleibt gesund" | NIEDRIG-MITTEL (30 Jahre alt) | KV-Situation kritisch | PKV-Anwartschaft, int. KV VOR Wegzug |
| "Kein Partner/Kind in 5 Jahren" | MITTEL (30J, Single) | Visa-Situation komplex, Schulen nötig | Flexible Struktur (EU-Option offenhalten) |
| "DE-Immobilien-Wert stabil" | NIEDRIG (langfristig stabil in DE) | Equity sinkt, LTV steigt | Langfristige Finanzierung, kein Overleverage |

**Regel:** Wenn die TOP-2 fragilsten Annahmen BEIDE gleichzeitig falsch sind → ist der Plan noch tragfähig? Wenn NEIN → Plan überarbeiten.
