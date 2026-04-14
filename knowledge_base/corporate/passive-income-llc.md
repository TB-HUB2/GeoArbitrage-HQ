# Passive Income LLC – Separate Gesellschaft für Kapitalanlagen und ETF-Reinvestition
*Wissensstand: März 2026*
*Chunk-ID: corporate/passive-income-llc*
*Relevante Agenten: CFO-Agent, Tax-Agent, Wealth-Agent*

## Konzept: Separate LLC für passives Einkommen

Das Modell sieht eine eigenständige LLC (typischerweise US-amerikanisch) vor, die ausschließlich Kapitalanlagen (ETFs, Aktien, Anleihen, REITs) hält und reinvestiert. Ziel: Trennung zwischen operativem Unternehmensgewinn und Kapitalanlage-Rendite; steueroptimiertes Thesaurieren.

## US LLC (Wyoming oder New Mexico)

### Vorteile Wyoming LLC
- **Wyoming:** Geringe Gründungskosten (~100 USD), keine State Income Tax, starker Asset-Protection-Gesetzgebung, anonyme Ownership möglich
- **New Mexico:** Noch günstigere Gründungskosten (~50 USD), ebenfalls guter Datenschutz, keine jährliche Reportpflicht für Mitglieder

### Steuerliche Einordnung: Disregarded Entity
Eine **Single-Member LLC** (ein Gesellschafter) wird vom US-Steuerrecht standardmäßig als **"Disregarded Entity"** behandelt – sie ist für US-Steuerzwecke nicht existent, die Besteuerung erfolgt direkt beim Gesellschafter. **Für Nicht-US-Personen (z.B. Deutsche nach Wegzug):** Keine US-Steuerpflicht auf Auslandseinkünfte der LLC, solange kein "effectively connected income" mit USA. Die LLC zahlt in den USA keine Federal Income Tax.

**Konsequenz:** Die Besteuerung folgt dem **Steuerdomizil des Gesellschafters**. Nach Wegzug aus Deutschland und Begründung einer Steuerresidenz in einem Niedrigsteuerland (UAE, Georgien, etc.) kann die LLC nahezu steuerfrei thesaurieren.

## Kontostruktur: Mercury / Relay → IBKR

### Bankkonten
- **Mercury:** US-Bankkonto für die LLC (Silicon Valley Bank-Alternative), einfache Online-Eröffnung für US LLCs auch mit ausländischem Inhaber, gute API-Anbindung
- **Relay:** Alternative zu Mercury, ähnliche Features, gute Buchhaltungsintegration (QuickBooks, Xero)

### Wertpapierdepot: Interactive Brokers (IBKR)
- **Interactive Brokers** gilt als die erste Wahl für US LLCs mit internationalem Inhaber
- LLC kann als legal entity ein IBKR-Konto eröffnen
- Zugang zu weltweiten Märkten, ETFs (inkl. US-amerikanische ETFs wie Vanguard VOO, iShares CUSA), Anleihen
- **ACHTUNG:** EU-ansässige Personen haben keinen Zugang zu US-amerikanischen ETFs (PRIIPs-Verordnung). Nach Wegzug aus EU entfällt diese Einschränkung
- Günstige Transaktionskosten, automatische Sparplan-Funktion ("Fractional Shares")

### Typischer Geldfluss
```
Operative Gesellschaft (UAE / Georgien)
    → Dividende / Management Fee
LLC (WY/NM) [Mercury-Konto]
    → Einzahlung
IBKR-Depot der LLC
    → ETF-Sparplan (z.B. monatlich VOO/VTI)
    → Thesaurierung (kein Verkauf = keine Realisierung)
```

## Steuerliche Voraussetzung: NUR nach DE-Wegzug sinnvoll

Solange der Gesellschafter in Deutschland unbeschränkt steuerpflichtig ist:

### § 7 AStG – Hinzurechnungsbesteuerung
Eine ausländische Gesellschaft, die von deutschen unbeschränkt Steuerpflichtigen beherrscht wird (>50% Beteiligung) und **passive Einkünfte** erzielt (Kapitalerträge, Zinsen, Lizenzgebühren), unterliegt der **deutschen Hinzurechnungsbesteuerung** – die Einkünfte werden dem deutschen Gesellschafter direkt zugerechnet und in Deutschland versteuert, auch wenn keine Ausschüttung erfolgt.

**Fazit:** Eine US Passive LLC für ETF-Investitionen macht für einen deutschen Steuerresidenten **keinen Sinn** – § 7 AStG würde Erträge direkt in Deutschland besteuern. Das Modell entfaltet seine Wirkung erst nach vollzogenem Wegzug und Aufgabe der deutschen unbeschränkten Steuerpflicht.

### 10-Jahres-Frist § 2 AStG (erweiterte beschränkte Steuerpflicht)
Für 10 Jahre nach Wegzug können bestimmte deutsche Einkünfte weiterhin in Deutschland besteuert werden. Kapitalerträge aus LLC (keine deutschen Quellen) sind grundsätzlich nicht betroffen – aber bei DE-Aktien oder DE-Immobilien in der LLC: Einzelfallprüfung.

## Praktische Checkliste

- [ ] Wegzug aus Deutschland vollständig vollzogen (Abmeldung, Wohnsitz aufgegeben)
- [ ] Neue Steuerresidenz begründet (183-Tage-Regel oder Domizilbescheinigung)
- [ ] Wyoming/New Mexico LLC gegründet (Registered Agent ~100 USD/Jahr)
- [ ] EIN (US-Steuernummer) beantragt (Form SS-4, auch ohne SSN möglich)
- [ ] Mercury / Relay Geschäftskonto eröffnet
- [ ] IBKR-Depot auf LLC eröffnet
- [ ] US-Steuererklärung: Form 5472 + 1120 (Proforma) jährlich erforderlich für Foreign-Owned Disregarded Entity
- [ ] Lokale Steuerberatung im Wohnsitzland: Behandlung der LLC-Einkünfte prüfen
