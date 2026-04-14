# Portfolio Stress-Testing — Historische Krisen-Szenarien
*Wissensstand: März 2026*
*Chunk-ID: wealth/portfolio-stress-testing*
*Relevante Agenten: CFO-Agent, Wealth-Agent*

## Warum Stress-Testing?

Ein Portfolio, das historische Extremereignisse nicht überlebt hätte, ist zu riskant — unabhängig von erwarteten Renditen. Stress-Testing identifiziert Schwachstellen bevor sie teuer werden.

## Historische Krisen-Szenarien

### Finanzkrise 2008–2009
- **Aktien (MSCI World):** -55% Peak-to-Trough (Oktober 2007 – März 2009)
- **US-Immobilien:** -30% bis -50% in stark betroffenen Märkten
- **Anleihen (Staatsanleihen AAA):** +20% (Flucht in Sicherheit)
- **Gold:** -30% initial (Liquidationssog), dann +25% Erholung
- **Krypto:** Noch nicht relevant (Bitcoin erst 2009 geboren)
- **Erholungsdauer Aktien:** Ca. 5,5 Jahre (bis neues Allzeithoch, MSCI World)
- **Lehre:** Staatsanleihen und Gold als echte Diversifikatoren bestätigt

### COVID-Crash 2020
- **Aktien (MSCI World):** -34% in nur 33 Tagen (Rekordschnellster Crash)
- **Krypto (BTC):** -50% in wenigen Tagen (März 2020)
- **Gold:** -12% initial (Liquidationssog), dann +25% bis August 2020
- **Anleihen:** Kurzfristige Volatilität, dann Rally
- **Erholungsdauer Aktien:** Ca. 5 Monate (V-förmige Erholung, ungewöhnlich schnell)
- **Lehre:** Liquiditätspuffer entscheidend — wer in der Delle nachkaufen konnte, profitierte enorm

### Krypto-Winter 2022
- **Bitcoin:** -75% (November 2021 – November 2022)
- **Ethereum:** -80%
- **Altcoins:** -85% bis -99%
- **LUNA/Terra:** -99,9% (Totalausfall Stablecoin-System)
- **FTX-Kollaps November 2022:** Contagion-Effekt, Vertrauensverlust
- **DeFi-Protokolle:** Zahlreiche Insolvenzen (Celsius, Voyager, BlockFi)
- **Erholungsdauer:** BTC/ETH erholten sich bis 2023/2024 auf neue Allzeithochs
- **Lehre:** Self-Custody critical — "Not your keys, not your coins". Krypto max. 5–10% des Portfolios

### Zinswende 2022–2023
- **Anleihen (10-jährige Bundesanleihen):** -20% bis -25% (historisch einmalig)
- **US-Treasuries (lange Laufzeiten):** -40% bis -50%
- **REITs:** -30% bis -40% (zinssensibler Sektor)
- **Tech-Aktien (wachstumsorientiert):** -50% bis -80% (NASDAQ: -35%)
- **Value-Aktien:** Relative Outperformance (-10% bis -15%)
- **Ursache:** FED-Zinserhöhungen von 0% auf 5,25% innerhalb 18 Monaten
- **Lehre:** Lange Anleihen in Niedrigzinsphase = erhebliches Durationsrisiko

### Stagflation 1970er (USA)
- **Aktien (real, inflationsbereinigt):** -50% über die gesamte Dekade
- **Anleihen (real):** Stark negativ (Inflation frisst Kupons auf)
- **Gold:** +2.400% nominal (von 35 USD auf 850 USD/oz bis 1980)
- **Rohstoffe:** Stark positiv
- **Immobilien:** Positiv nominal, gemischt real
- **Lehre:** Stagflation ist das worst-case-Szenario für 60/40-Portfolios. Real Assets essentiell.

## Maximum Drawdown (MDD) berechnen

```
MDD = (Tiefstwert - Höchstwert) / Höchstwert × 100%
```

**Interpretation:**
- MDD -20%: "Korrektur", normal für Aktien
- MDD -30% bis -40%: Bärenmarkt, psychologisch schwer
- MDD -50%: Extreme Belastung, viele Anleger kapitulieren

**Erholungsformel:** Ein MDD von -50% benötigt eine Rendite von +100% für Rückkehr zum Ausgangsniveau!

| MDD | Nötige Erholung |
|---|---|
| -10% | +11% |
| -20% | +25% |
| -30% | +43% |
| -50% | +100% |
| -75% | +300% |

## Erholungsdauern historisch

| Krise | Drawdown | Erholungsdauer (Aktien) |
|---|---|---|
| Große Depression 1929 | -86% | 25 Jahre (!) |
| Dotcom 2000-03 | -50% | 7 Jahre |
| Finanzkrise 2008 | -55% | 5,5 Jahre |
| COVID 2020 | -34% | 5 Monate |
| Stagflation 1970er | -50% real | Jahrzehnt |

## Stress-Test deines Portfolios

**Checkfragen:**
1. Kann ich einen -55%-Drawdown meines Aktienanteils ertragen ohne zu verkaufen?
2. Habe ich genug Cash-Puffer (1–2 Jahre Ausgaben) um keine Notverkäufe zu tätigen?
3. Was passiert wenn mein Krypto-Anteil auf 0 geht? (Extremszenario)
4. Was passiert wenn Inflation auf 10%+ p.a. steigt? (Real Assets Anteil?)
5. Was passiert wenn mein Wohnsitzland Kapitalverkehrskontrollen einführt?

**Simulationstools:**
- Portfolio Visualizer (portfoliovisualizer.com): Monte Carlo, historische Backtests
- FIRECalc: Speziell für Entnahmephasen-Simulation
- IBKR Risk Navigator: Für aktives Depot-Risikomanagement
