# Cashflow-Management & Liquiditätsplanung
*Wissensstand: März 2026*
*Chunk-ID: cfo/cashflow-management*
*Relevante Agenten: CFO, Wealth Manager*

## Einkommensströme erfassen

Alle Einkommensquellen NETTO (nach Steuer + SV) tracken:

| Quelle | Tracking-Frequenz | Währung beachten |
|--------|-------------------|------------------|
| Gehalt (netto) | Monatlich | EUR |
| Mieteinnahmen (netto nach Tilgung, Verwaltung, Rücklagen) | Monatlich | EUR |
| Dividenden / Kursgewinne | Quartalsweise / bei Realisierung | Multi-Währung |
| AI-Business Revenue | Monatlich | USD/EUR gemischt |
| Krypto-Erträge (Staking, DeFi) | Monatlich | USD-denominiert |
| Sonstige (Steuererstattungen, Verkäufe) | Bei Anfall | EUR |

## Budget-Struktur

Monatliches Budget in 4 Kategorien:

1. **Fixkosten** — Miete, Versicherungen, Abos, Kreditraten, Verwaltungskosten
2. **Variable Kosten** — Lifestyle (Essen, Reisen, Golf, Fitness), Kleidung, Transport
3. **Steuerzahlungen** — Vorauszahlungen (DE), Zielland-Steuern, Beraterhonorare
4. **Investitions-Allokation** — ETF-Sparplan, Immobilien-Eigenkapital, Krypto, Sondertilgung

Budget-Monitoring-Regel: Bei >20% Abweichung (Plan vs. Ist) in einer Kategorie → sofortige Warnung an Mandant mit Ursache und Handlungsempfehlung.

## Liquiditätsplanung

Zeiträume: 3 / 6 / 12 Monate vorausplanen

Berücksichtigen:
- Saisonale Schwankungen (Steuernachzahlung Q1, Versicherungs-Jahresbeiträge, Urlaubsausgaben)
- Geplante Einmalausgaben (Immobilien-Anzahlung, CBI-Investment, Firmengründung, Umzug)
- Anschlussfinanzierung Immobilien (Zeitpunkt + neue Rate einplanen)
- AI-Revenue Unsicherheit (konservativ: nur 70% des Forecasts einplanen)

## Notfall-Reserve

**Harte Regel:** IMMER 6 Monate Lebenshaltungskosten liquide vorhalten.

Verteilung:
- Mindestens 2 Jurisdiktionen (z.B. DE-Konto + UAE/Zypern-Konto)
- Mindestens 2 Währungen (EUR + USD oder CHF)
- Sofort verfügbar (Tagesgeld/Geldmarkt, KEIN Festgeld, KEINE Aktien)

Grund: Expat-Risiko — Bankkonten können eingefroren werden (vgl. Zypern 2013), Überweisungen können verzögert werden, Kreditkarten können im Ausland gesperrt werden.

## Multi-Währungs-Tracking

Alle Vermögenswerte und Cashflows in EUR als Referenzwährung tracken.

FX-Risiko-Monitoring:
- Währungs-Exposure berechnen: % des Gesamtvermögens pro Währung
- Bei >30% Konzentration in einer Nicht-EUR-Währung → Warnung
- Monatliche FX-Rate-Updates (aus fx_rates Tabelle)
- Hedging-Überlegung ab >50k EUR Exposure in Fremdwährung

Typische Exposure-Szenarien:
- UAE-Residenz: AED (gekoppelt an USD) → implizites USD-Exposure
- US LLC Revenue: USD → EUR-Umrechnung bei Entnahme
- Krypto: USD-denominiert → hohe Volatilität
- DE-Immobilien: EUR → stabil, kein FX-Risiko

## DB-Tabellen-Referenz

Relevante Tabellen für Cashflow-Management:
- `budget` — Monatliche Einnahmen/Ausgaben/Investitionen (Plan + Ist)
- `wealth_snapshots` — Monatliche Nettovermögens-Snapshots
- `properties` — Mieteinnahmen, Tilgung, Cashflow pro Immobilie
- `portfolio_holdings` — Dividenden, Kursgewinne
- `fx_rates` — Monatliche Wechselkurse
