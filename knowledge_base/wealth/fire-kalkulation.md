# FIRE-Kalkulation — Financial Independence, Retire Early
*Wissensstand: März 2026*
*Chunk-ID: wealth/fire-kalkulation*
*Relevante Agenten: CFO-Agent, Wealth-Agent, Relocation-Agent*

## Das FIRE-Grundprinzip

**Financial Independence (FI) = Zustand, in dem passives Vermögenswachstum die Lebenshaltungskosten deckt — unabhängig von aktivem Einkommen.**

## Die 4%-Regel (Trinity Study)

**Grundlage:** Die Trinity Study (1998) und Folgestudien zeigen: Bei einem Portfolio aus 50–75% Aktien / 25–50% Anleihen ist eine jährliche Entnahme von **4% des Startwertes** über 30 Jahre mit >95% Wahrscheinlichkeit erfolgreich.

**FIRE-Zahl = Jahresausgaben × 25**

Beispiele:
- 2.500 EUR/Monat = 30.000 EUR/Jahr → FIRE-Zahl: **750.000 EUR**
- 4.000 EUR/Monat = 48.000 EUR/Jahr → FIRE-Zahl: **1.200.000 EUR**
- 7.000 EUR/Monat = 84.000 EUR/Jahr → FIRE-Zahl: **2.100.000 EUR**

**Geo-Arbitrage-Vorteil:** Durch niedrigere Ausgaben im Zielland sinkt die FIRE-Zahl drastisch.
- DE-Ausgaben: 5.000 EUR/Monat → FIRE-Zahl: 1.500.000 EUR
- UAE-Ausgaben: 3.000 EUR/Monat → FIRE-Zahl: 900.000 EUR (-40%)

## CAPE-Adjustierte SWR

Das Shiller-CAPE (Cyclically Adjusted Price-to-Earnings Ratio) zeigt, ob Märkte teuer oder günstig sind. Bei hohem CAPE (>30) sollte SWR auf 3,0–3,5% reduziert werden, bei niedrigem CAPE (<15) kann SWR auf 4,5–5% erhöht werden.

CAPE aktuell (März 2026): ~28–32 (USA) → Konservativerer SWR von 3,5% empfohlen.

**CAPE-adjustierte FIRE-Zahl bei 3,5% SWR:**
- 30.000 EUR/Jahr → **857.000 EUR**
- 48.000 EUR/Jahr → **1.371.000 EUR**

## Coast FIRE

**Definition:** Genug Kapital angespart, sodass ohne weitere Beiträge durch Zinseszins bis zum Rentenalter die FIRE-Zahl erreicht wird.

**Formel:**
```
Coast FIRE = FIRE-Zahl / (1 + r)^n
```
- r = Rendite p.a. (real, nach Inflation, z.B. 7%)
- n = Jahre bis Rentenalter

**Beispiel:** FIRE-Zahl 1.000.000 EUR, 30 Jahre bis Rente, 7% Rendite:
Coast FIRE = 1.000.000 / (1,07)^30 = **131.000 EUR**

Mit 131.000 EUR angelegt kann man aufhören zu sparen — das Geld wächst von selbst auf 1 Mio. EUR bis zur Rente.

## Barista FIRE

**Definition:** Teilweise FI — genug Kapital für die Grundbedürfnisse aus Portfolio, aber noch etwas Teilzeitarbeit nötig für Extras/Krankenversicherung.

Typisches Modell:
- Portfolio deckt 60–70% der Ausgaben (z.B. 2.000 EUR/Monat)
- Kleinere Tätigkeit (Freelance, Teilzeit, Consulting) deckt Rest
- Deutlich früher erreichbar als volle FI, mehr Flexibilität, soziale Kontakte

**Geo-Arbitrage + Barista FIRE:** Mit minimalem Einkommen (5.000–10.000 EUR/Jahr) aus Remote-Arbeit + kleinem Portfolio → sehr früh umsetzbar in Niedrigkostländern.

## Safe Withdrawal Rate (SWR) — Methoden im Vergleich

### Variable Percentage Withdrawal (VPW)
- Entnahmerate variiert mit Portfolio-Performance
- Gutes Jahr: mehr entnehmen; schlechtes Jahr: weniger
- Kein Risiko des "Portfolio-Ruins", aber Einkommensschwankungen
- Formel basiert auf Restlebenserwartung und Zielrendite

### Guardrails-Methode (Kitces/Guyton-Klinger)
- Startet mit bestimmtem SWR (z.B. 5%)
- **Upper Rail:** Wenn Portfolio um >20% gestiegen → Entnahme um 10% erhöhen
- **Lower Rail:** Wenn Portfolio um >20% gesunken → Entnahme um 10% kürzen
- Verhindert Ruin, erlaubt Teilhabe an guten Märkten
- Psychologisch herausfordernd bei Kürzungen

### Klassische 4%-Regel (inflationsangepasst)
- Jährliche Entnahme steigt mit Inflation
- Einfach, aber inflexibel bei Drawdowns
- Bei 40–60+ Jahren Horizont: SWR eher 3,5%

## Monte-Carlo-Simulation

**Methodik:** Simuliert 10.000+ Szenarien mit zufälligen Renditesequenzen basierend auf historischen Mittelwert und Standardabweichung. Zeigt Erfolgswahrscheinlichkeit für verschiedene SWRs.

**Interpretation:**
- 95% Erfolgswahrscheinlichkeit = In 9.500 von 10.000 Szenarien kein Portfolioruin
- 80% = zu riskant für die meisten FIRE-Anwender
- 99% = sehr konservativ, viel "überschüssiges" Kapital am Lebensende

**Empfohlene Tools:** FIRECalc.com, cFIREsim.com, Portfolio Visualizer

## Break-Even-Analyse beim Wegzug

**Fragestellung:** Ab welchem Zeitpunkt lohnt sich der Wegzug finanziell?

**Faktoren:**
- Einmalige Wegzugskosten: 10.000–30.000 EUR
- Steuerliche Umstellungskosten (Steuerberater, Strukturierung): 3.000–10.000 EUR
- Jährliche Einsparungen: Steuer, Lebenshaltungskosten, KV
- Break-Even = Einmalige Kosten / Jährliche Einsparungen

**Beispiel:**
- Wegzugskosten: 20.000 EUR
- Jährliche Ersparnis Steuer: 15.000 EUR, Lebenshaltung: 10.000 EUR = 25.000 EUR/Jahr
- Break-Even: 20.000 / 25.000 = **0,8 Jahre** (< 1 Jahr!)

Fazit: Bei signifikantem Einkommen/Vermögen lohnt sich Geo-Arbitrage finanziell fast immer innerhalb von 1–3 Jahren.
