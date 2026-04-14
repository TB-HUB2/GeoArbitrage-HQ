# Depotstruktur & Broker-Wahl für Geo-Arbitrage
*Wissensstand: März 2026*
*Chunk-ID: wealth/depotstruktur-broker*
*Relevante Agenten: CFO-Agent, Wealth-Agent, Relocation-Agent*

## IBKR — Interactive Brokers (Empfehlung #1)

**Besonderheit für Expats:** IBKR ist die beste Wahl für Personen, die auswandern oder einen internationalen Lebensstil führen.

- **Entität:** IBKR Ireland (für EU-Kunden) oder IBKR Luxembourg — beide reguliert unter MiFID II
- **Multi-Currency:** Konten in 25+ Währungen, günstige Forex-Umrechnung (Interbank-Kurs + minimaler Aufschlag)
- **Migration bei Wegzug:** IBKR ermöglicht problemlose Kontomigration zwischen Entitäten (DE → IE → UK → etc.) ohne Depotübertrag — bestehende Positionen bleiben, Anschaffungskosten werden übernommen
- **Produkte:** Aktien, ETFs weltweit, Anleihen, Optionen, Futures, Forex, CFDs
- **Margin/Lombard:** Günstigste Margin-Zinsen unter großen Brokern (SOFR/LIBOR + 0,5–1,5%)
- **Kosten:** Ab 0 USD/Monat (IBKR Lite für US-Kunden), IBKR Pro: Kommissionen ab 1 EUR
- **Steuerbescheinigung:** Für DE-Kunden vollständige Steuerbescheinigung, nach Wegzug nur noch Formular für neues Wohnsitzland
- **Einlagensicherung:** SIPC (USA) 500k USD für US-Wertpapiere, EU-Entitäten: 20k EUR Cash + 100% Wertpapiere (segregierte Konten)

## Swissquote

- Schweizer Broker, reguliert FINMA
- Stärke: Schweizer Rechtssicherheit, Schweizer Franken-Konto, breite Produktpalette
- Geeignet für: Anleger mit Schweiz-Bezug oder CHF-Exposure
- Kosten: Etwas höher als IBKR, aber solide Plattform
- Keine Probleme bei Wegzug aus DE (nicht deutschem Recht unterworfen)

## Saxo Bank

- Dänischer Broker, EU-reguliert
- Multi-Asset, gute Benutzeroberfläche
- Geeignet für: Aktien, Anleihen, Forex, CFDs
- Kosten: Mittelfeld
- Kein Problem bei Internationalität

## Deutsche Broker — Kritisch bei Wegzug

### Trade Republic
- Nur für Personen mit deutschem Wohnsitz nutzbar
- Bei Wegzug: Konto muss geschlossen werden
- **Problem:** Kein Depotübertrag möglich! Positionen müssen verkauft werden → Steuerrealisierung
- Nicht geeignet für Expat-Planung

### Scalable Capital
- Ähnlich wie Trade Republic: Einschränkungen bei Nicht-DE-Residenten
- Neo-Broker nur für EU-Residenten mit DE-Wohnsitz verlässlich nutzbar
- Bei Wegzug: Konto-Kündigung oder Sperrung wahrscheinlich

### Comdirect / DKB / ING-DiBa
- Traditionelle Banken halten Depots für Nicht-Residenten häufig, aber mit Einschränkungen
- Keine Neuanlage möglich, Bestandsdepots teils geduldet
- Steuerliche Behandlung kompliziert nach Wegzug

## Depotübertrag bei Wegzug — Kritische Punkte

### Anschaffungskosten dokumentieren
Vor dem Wegzug unbedingt sicherstellen:
1. **Kompletter Kontoauszug** aller Positionen mit Einstandspreisen (Anschaffungskosten)
2. **Steuerliche Bescheinigungen** der letzten 7 Jahre aufbewahren
3. **Vorabpauschalen** vollständig dokumentieren (werden beim Verkauf angerechnet)
4. **FIFO-Methode** in DE: Bei Teilverkäufen gilt "first in, first out" — dokumentieren, welche Anteile zu welchem Preis gekauft wurden

### Übertrag zu internationalem Broker
- Depotübertrag von DE-Broker zu IBKR: Anschaffungskosten sollten mitübertragen werden
- In der Praxis: Deutsche Broker übertragen Anschaffungskosten nicht immer korrekt
- Lösung: Eigene Schattenführung mit Kaufdaten/Preisen (Excel, Portfolio Performance App)

### Fiktive Veräußerung
- Bei Wegzug aus DE gilt für Fondsanteile grundsätzlich keine fiktive Veräußerung (im Gegensatz zu §17 EStG-Anteilen)
- Aber: Im Wegzugsjahr wird eine letzte Vorabpauschale fällig
- Prüfen: Ob Teile des Portfolios unter §17 EStG fallen (≥1% an einer GmbH etc.)

## Empfohlene Depotstruktur für Geo-Arbitrage

| Broker | Funktion | Jurisdiktion |
|---|---|---|
| IBKR Ireland | Haupt-Wertpapierdepot | Irland/EU |
| Swissquote oder Saxo | Backup-Depot, CHF-Exposure | CH/DK |
| Lokaler Broker Zielland | Steueroptimierte lokale Investments | Zielland |

**Faustregel:** Nie mehr als 50% des liquiden Vermögens bei einem einzigen Broker.
