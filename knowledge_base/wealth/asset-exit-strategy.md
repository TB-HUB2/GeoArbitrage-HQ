# Asset Exit Strategy — Optimale Liquidierungsreihenfolge
*Wissensstand: März 2026*
*Chunk-ID: wealth/asset-exit-strategy*
*Relevante Agenten: CFO-Agent, Tax-Agent, Wealth-Agent*

## Grundprinzip der Exit-Optimierung

Das Ziel: Steuerpflichtige Realisierungsgewinne minimieren und steuerfreie Realisierungen maximieren. Die Reihenfolge der Liquidierung hat enormen Einfluss auf die Nettorendite.

## Timing-Matrix: "Biggest Bang for the Buck"

| Asset | Optimaler Zeitpunkt | Steuerlich | Handlungsbedarf |
|---|---|---|---|
| ETFs/Aktien (< 1 Jahr) | Warten bis 12+ Monate | 26,375% → niedriger | Geduld |
| ETFs/Aktien (> 1 Jahr, DE-Wohnsitz) | Vor oder nach Wegzug prüfen | 26,375% (DE) vs. 0% (CY/UAE) | Wegzug zuerst! |
| Krypto (< 12 Monate) | Warten bis 12 Monate | 100% steuerfrei danach | Warten |
| Krypto (> 12 Monate) | Ideal vor Wegzug bei DE-Wohnsitz... warte: **nach Wegzug** noch besser | 0% nach Wegzug in vielen Ländern | Nach Wegzug liquidieren |
| Gold physisch (< 12 Monate) | Warten | Steuerfrei nach 12 Monaten | Warten |
| Immobilien (< 10 Jahre) | Auf keinen Fall | Spekulationssteuer (ESt) | Halten oder Verluste realisieren |
| Immobilien (> 10 Jahre) | Jederzeit steueroptimiert | Steuerfrei! | Ideales Timing prüfen |

## ETFs und Aktien — Strategie vor Wegzug

### Tax-Loss-Harvesting vor Wegzug
**Ziel:** Verlustpositionen realisieren, um aufgelaufene Gewinne steuerlich zu verrechnen.

**Vorgehen:**
1. Verlustpositionen verkaufen (Steuerverlust realisieren)
2. Sofort ähnliche, aber nicht identische Position kaufen (Wash-Sale-Regelung in DE unklar, aber Vorsicht)
3. Verluste reduzieren zu zahlende Steuer auf Gewinne im selben Jahr

**Vor Wegzug besonders wertvoll:** Im letzten DE-Steuerjahr alle "schlechten" Positionen bereinigen.

### Wegzug zuerst — dann liquidieren
Wenn im Zielland (UAE, Zypern, Portugal IFICI) keine Kapitalertragsteuer anfällt:
- **Nicht** ETFs vor Wegzug verkaufen
- Wohnsitz ins Zielland verlegen
- **Dann** ETFs verkaufen → 0% Steuer

**Risiko:** Mindestaufenthaltsdauer im Zielland muss eingehalten werden (UAE 183+ Tage, Zypern 60/183 Tage).

## Immobilien — Spekulationsfrist 10 Jahre

### Selbstgenutzte Immobilien
- **Steuerfrei** bei Verkauf, wenn in den letzten 3 Jahren selbst bewohnt (unabhängig von 10-Jahres-Frist)
- Auszug für 3 Jahre vor Verkauf: Genug bei entsprechender Planung

### Vermietete Immobilien
- **Spekulationsfrist: 10 Jahre** (§23 EStG)
- Vor 10 Jahren: Kursgewinn = voll einkommensteuerpflichtig (bis 45% + Soli)
- Nach 10 Jahren: **vollständig steuerfrei**

**Strategie:**
- Immobilien unter 10 Jahren Haltedauer: Halten oder Verluste realisieren (wenn negativ)
- Immobilien knapp vor 10-Jahres-Frist: Geduld zahlt sich enorm aus
- GmbH-Strukturen: Kein privater 10-Jahres-Vorteil, Körperschaftsteuer auf Gewinne

### Immobilien-Einbringung in GmbH
Bei Wegzug: Immobilien in DE können in Immobilien-GmbH eingebracht werden. Vorteile: Körperschaftsteuer 15% (statt bis 45% ESt), Geschäftsführergehalt absetzbar, Gewinne thesaurierbar. Nachteil: 10-Jahres-Frist startet neu für GmbH-Anteile.

## ETFs — Abgeltungsteuer 26,375%

**Bestandteile:**
- 25% Abgeltungsteuer
- 5,5% Solidaritätszuschlag auf die Abgeltungsteuer
- → Gesamt: 26,375%
- + Kirchensteuer sofern kirchensteuerpflichtig (ca. 27,8% dann)

**Anrechnung:** Sparerpauschbetrag (1.000 EUR/Person) nutzen — günstige Positionen gezielt realisieren um Freibetrag auszuschöpfen.

**Verlustverrechnung:** Aktienverluste nur mit Aktiengewinnen verrechenbar (seit 2020 Sonderregel). Fondsverluste breiter verrechenbar.

## Krypto — 12 Monate Haltefrist

**Exakte Berechnung:**
- Kaufdatum: 1. März 2024
- Steuerfreier Verkauf ab: 2. März 2025
- Bei mehreren Käufen: FIFO-Methode (first in, first out)

**Staking-Erträge:** Erhaltene Tokens zum Erhaltszeitpunkt als Einkommen versteuern, dann neuer Anschaffungszeitpunkt. 12 Monate gelten ab Erhalt.

**Nach Wegzug aus DE in Null-Steuer-Land:**
- BTC/ETH mit langer Haltedauer → verkaufen nach Wegzug
- Staking-Rewards mit kurzer Haltedauer → einfach halten bis 12 Monate im neuen Land (ggf. dort auch steuerfrei)

## Gold — Steuerfreie Liquidierung

Physisches Gold und Xetra-Gold: 12 Monate Haltefrist, dann steuerfrei.
**Vorsicht:** Bei gewerblichem Goldhandel keine Steuerfreiheit (Einkommensteuer auf Gewinne).

Zeichen für Gewerblichkeit: Hohe Transaktionsfrequenz, professionelle Organisation, Marktmachertätigkeit.

## Liquidierungsreihenfolge im Rentenmodell (nach FIRE)

**Empfohlene Reihenfolge für laufende Entnahmen:**
1. Cash-Puffer (keine Steuer)
2. Ausschüttungen aus Fonds (automatisch, Steuer bereits einbehalten)
3. Steuerfreie Gewinne (nach Haltefrist)
4. Positionen mit geringem Gewinn (niedrige Steuerlast)
5. Zuletzt: Hochgewinn-Positionen (höchste Steuer — so lang wie möglich stunden)
