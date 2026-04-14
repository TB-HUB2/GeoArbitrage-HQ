# Inflation & Währungsstrategie für Geo-Arbitrage
*Wissensstand: März 2026*
*Chunk-ID: wealth/inflation-waehrungsstrategie*
*Relevante Agenten: CFO-Agent, Wealth-Agent, Relocation-Agent*

## Inflation in Zielländern tracken

Lebenshaltungskosten steigen nicht gleichmäßig — Inflation im Zielland ist entscheidend für die Kaufkraft des Portfolios und die Planbarkeit der Ausgaben.

**Aktuelle Inflationsraten ausgewählter Länder (März 2026, ca.):**
| Land | Inflation ca. | Währung | Währungsrisiko |
|---|---|---|---|
| Deutschland | 2,5% | EUR | Referenz |
| UAE | 3,2% | AED (USD-gepegged) | Sehr gering |
| Portugal | 2,8% | EUR | Kein |
| Zypern | 2,3% | EUR | Kein |
| Thailand | 1,5% | THB | Mittel |
| Georgien | 5,1% | GEL | Mittel |
| Paraguay | 4,8% | PYG | Erhöht |
| Andorra | 3,0% | EUR | Kein |
| Türkei | 40-60% | TRY | Sehr hoch! |

**Monitoring-Tools:**
- Trading Economics (tradingeconomics.com): Echtzeit-Inflationsdaten weltweit
- Numbeo (numbeo.com): Lebenshaltungskosten-Vergleich Städte
- IMF World Economic Outlook: Makroperspektive

## Inflation Hedging-Strategien

### Real Assets
Sachwerte steigen tendenziell mit der Inflation mit, da ihr innerer Wert durch Güter/Dienstleistungen definiert ist.
- **Immobilien:** Mieten steigen mit CPI (Consumer Price Index), Sachwert bleibt
- **Gold:** Klassisches Inflationshedge, besonders bei Hyperinflation
- **Rohstoffe:** Direkt inflationsbeeinflusst (Öl, Agrar → treiben oft Inflation selbst)
- **Infrastruktur-Investments:** Regulierte Preise, oft CPI-gebunden

### Inflation-Linked Bonds
Kupons und Nominalbetrag steigen mit dem Inflation-Index:
- **TIPS (US):** Nominalbetrag steigt mit CPI-U
- **Bundesanleihen inflationsindexiert (DBRi):** Seltenere Ausgaben, aber verfügbar
- **iShares Global Inflation Linked Govt Bond ETF:** Diversifizierter Zugang
- **Nachteil:** Bei niedrigerer Inflation als erwartet: Underperformance vs. normale Anleihen

### Aktien mit Pricing Power
Unternehmen, die Preiserhöhungen ohne Nachfrageeinbruch durchsetzen können:
- **Consumer Staples:** P&G, Nestle, Coca-Cola — Konsumenten zahlen mehr für Markenloyalität
- **Healthcare:** Medikamente, Diagnostik — preisunelastische Nachfrage
- **Technologie mit Netzwerkeffekten:** Hohe Wechselkosten = Pricing Power
- **Energie:** Öl/Gas-Unternehmen profitieren direkt
- Gemessen durch: Bruttomargen-Stabilität über Inflationszyklen

## Currency Revaluation Risk

**Risikoszenario:** Einnahmen in Hartwährung (EUR/USD), Wohnsitz in Weichwährung → Abwertung der Lokalwährung = alle lokalen Kosten werden günstiger (positiv!).

**Positives Rebalancing:** Georga 2022 — GEL wertete auf wegen Kapitalzuflüssen. Plötzlich stiegen die effektiven Kosten für EUR/USD-Einkommensempfänger.

**Schutzmaßnahmen:**
- Langfristige Fixkosten (Miete, Verträge) in Lokalwährung halten — profitiert von Abwertung
- Keine langfristigen Schulden in Lokalwährung (Umkehreffekt bei Aufwertung)
- Regelmäßig wechseln statt große Batches (Dollar-Cost-Averaging beim FX)

## Natürliches Hedging

**Definition:** Einnahmen und Ausgaben in derselben Währung — kein Wechselkursrisiko.

**Geo-Arbitrage-Anwendung:**
- Einkommen: EUR (freiberuflich für EU-Kunden) → Ausgaben in EUR-Land (Portugal, Zypern, Andorra) = perfektes natürliches Hedging
- Einkommen: USD (US-Kunden, Dollar-Assets) → Ausgaben in UAE (AED = USD-Peg) = fast perfektes Hedging
- Einkommen: EUR, Ausgaben: THB → aktives FX-Management nötig

**Multi-Currency-Strategie:**
- 40% Vermögen in EUR (europäische Assets)
- 40% Vermögen in USD (US-ETFs, Krypto)
- 10% Lokalwährung (laufende Ausgaben)
- 10% CHF/Gold (Wertspeicher, krisenresistent)

## Kaufkraftparität (Purchasing Power Parity — PPP)

PPP zeigt den "fairen" Wechselkurs basierend auf realen Güterpreisen. Abweichungen von PPP = Geo-Arbitrage-Opportunitäten.

**Beispiel:** 1 EUR kauft in DE Waren für 1 EUR.
Derselbe Warenkorb kostet in Portugal 0,75 EUR, in Georgien 0,40 EUR, in Thailand 0,35 EUR.

**Big Mac Index (Economist):** Vereinfachter PPP-Proxy.
- Big Mac in DE: ~5,50 EUR
- Big Mac in Thailand: ~1,40 EUR (Gegenwert)
→ THB ist ~75% günstiger als EUR in Kaufkraftbegriffen

**Praktische Implikation:** PPP-günstiges Land + Harte Währung = maximale Geo-Arbitrage.

## Kaufkraftrisiko im Ruhestand

Bei langen FIRE-Horizonten (30–50 Jahre) kann selbst moderate Inflation das reale Vermögen stark erodieren:
- 2% Inflation: Kaufkraft halbiert sich in 35 Jahren
- 4% Inflation: Kaufkraft halbiert sich in 18 Jahren
- 8% Inflation: Kaufkraft halbiert sich in 9 Jahren

**Konsequenz:** Real Assets und Aktien (historisch inflationsschlagende Anlageklassen) müssen dauerhaft im Portfolio bleiben, auch in der Entnahmephase.
