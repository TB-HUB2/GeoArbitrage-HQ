# Gewerbesteuer (GewStG) & Körperschaftsteuer (KStG) — Mechanik
*Wissensstand: März 2026*
*Chunk-ID: tax/gewerbesteuer-koerperschaftsteuer*
*Relevante Agenten: Tax Architect, Corporate-Agent, Immobilien-Agent*

## TEIL 1: Gewerbesteuer (GewStG)

### Wann greift GewSt?

| Tätigkeit | GewSt-pflichtig? | Begründung |
|-----------|-----------------|------------|
| Angestellter (§19 EStG) | Nein | Kein Gewerbebetrieb |
| Freiberufler (§18 EStG) | Nein | Katalogberuf oder ähnlich |
| Gewerbetreibender (§15 EStG) | **Ja** | Selbständig, nachhaltig, Gewinnerzielungsabsicht |
| GmbH (jede Tätigkeit) | **Ja** (immer!) | §2 Abs. 2 GewStG: Kapitalgesellschaft = immer Gewerbebetrieb |
| vGmbH (vermögensverwaltend) | **Nein** (Ausnahme!) | Rein vermögensverwaltend = keine GewSt (aber Vorsicht: Infizierung!) |
| GmbH & Co. KG | **Ja** (gewerblich geprägt) | §15 Abs. 3 Nr. 2 EStG |

**AI-Consulting:** Wenn als Freiberufler (§18) → KEINE GewSt. Wenn als GmbH → GewSt. Wenn als Einzelunternehmer mit Softwareverkauf → GewSt.

### GewSt-Berechnung

```
Gewerbeertrag (= Gewinn aus Gewerbebetrieb)
  + Hinzurechnungen (§8 GewStG)
  - Kürzungen (§9 GewStG)
  - Freibetrag: 24.500€ (nur Einzelunternehmen + Personengesellschaften, NICHT GmbH!)
= Gewerbesteuermessbetrag × Steuermesszahl (3,5%)
× Hebesatz der Gemeinde (200-900%, typisch 300-500%)
= Gewerbesteuer
```

### Hinzurechnungen (§8 GewStG) — Was wird zum Gewinn ADDIERT?

| Posten | Hinzurechnung | Beispiel |
|--------|-------------|---------|
| Zinsen auf Schulden | 25% des Betrags | Immobilien-Kredit-Zinsen |
| Mieten/Pachten (Immobilien) | 12,5% der Aufwendungen | Büro-Miete |
| Mieten (beweglich, z.B. Leasing) | 5% der Aufwendungen | Auto-Leasing, Equipment |
| Lizenzgebühren | 6,25% der Aufwendungen | Software-Lizenzen, IP |

**Freibetrag auf Summe der Hinzurechnungen:** 200.000€ (ab 2025) [VERIFY]
→ Für Mandant mit <200k€ Hinzurechnungssumme: Effekt = Null

### Kürzungen (§9 GewStG) — Was wird ABGEZOGEN?

| Posten | Kürzung | Besonders relevant |
|--------|---------|-------------------|
| 1,2% des Einheitswerts eigener Grundstücke | §9 Nr. 1 S. 1 | Eigene Immobilien |
| **Erweiterte Kürzung** bei rein vermögensverwaltend | §9 Nr. 1 S. 2 | vGmbH! → GewSt = 0% |
| Gewinnanteile an Personengesellschaften | §9 Nr. 2 | KG-Beteiligungen |
| Ausländische Betriebsstättengewinne | §9 Nr. 3 | Bei DBA-Freistellung |

**Erweiterte Kürzung (§9 Nr. 1 S. 2):** KRITISCH für vermögensverwaltende GmbH. Wenn AUSSCHLIESSLICH eigener Grundbesitz verwaltet wird → GewSt = 0€. ABER: Jede gewerbliche "Infizierung" (z.B. eine einzige gewerbliche Leistung) → erweiterte Kürzung verloren! [AFFECTS: IMMOBILIEN]

### GewSt-Anrechnung auf ESt (§35 EStG)

Für Personenunternehmen (Einzelunternehmer, GbR, KG): GewSt wird auf die persönliche ESt angerechnet.
- Anrechnungsfaktor: **4,0 × Steuermessbetrag**
- Bei Hebesatz ≤ 400%: GewSt wird vollständig durch §35 kompensiert → effektiv GewSt = 0€!
- Bei Hebesatz > 400%: Differenz bleibt als echte Zusatzbelastung

**Beispiel:** Gewerbeertrag 50k€, Hebesatz 420%:
- GewSt-Messbetrag: (50k - 24.5k Freibetrag) × 3,5% = 893€
- GewSt: 893€ × 420% = 3.749€
- §35 Anrechnung auf ESt: 4,0 × 893€ = 3.571€
- Netto-GewSt-Belastung: 3.749€ - 3.571€ = **178€** (vernachlässigbar)

## TEIL 2: Körperschaftsteuer (KStG)

### KSt-Satz

| Position | Satz | Berechnung |
|----------|------|-----------|
| Körperschaftsteuer | 15,0% | Auf zu versteuerndes Einkommen |
| Solidaritätszuschlag | 5,5% auf KSt | = 0,825% |
| **Effektiver KSt-Satz** | **15,825%** | |
| + Gewerbesteuer (GmbH, z.B. Hebesatz 400%) | ~14,0% | |
| **Gesamtbelastung auf Unternehmensebene** | **~29,8%** | Bei Hebesatz 400% |

### Ausschüttung vs. Thesaurierung

| Strategie | Steuer auf Unternehmensebene | Steuer bei Ausschüttung | Gesamtbelastung |
|-----------|---------------------------|-----------------------|----------------|
| **Thesaurierung** | ~29,8% (KSt + GewSt) | 0% (kein Zufluss) | **~29,8%** |
| **Ausschüttung + Abgeltung** | ~29,8% | 25% + SolZ auf Brutto-Dividende | **~48,3%** |
| **Ausschüttung + Teileinkünfte** | ~29,8% | 60% × persönl. Steuersatz (z.B. 42%) | **~45,5%** |

**Konsequenz:** GmbH-Thesaurierung ist steueroptimal für Vermögensaufbau. Ausschüttung nur wenn Liquidität benötigt.

**Bei Wegzug:** Thesaurierte Gewinne in der GmbH bleiben in DE. Erst bei Ausschüttung an den (nun im Ausland lebenden) Gesellschafter → DBA-Quellensteuer-Regeln greifen. UAE-DBA: 5% Quellensteuer auf Dividenden.

### Verdeckte Gewinnausschüttung (vGA, §8 Abs. 3 KStG)

**Definition:** Wenn GmbH ihrem Gesellschafter Vorteile gewährt, die ein ordentlicher Geschäftsleiter einem Nicht-Gesellschafter nicht gewährt hätte.

| Typische vGA-Fälle | Konsequenz |
|--------------------|-----------|
| Überhöhtes Gehalt an Gesellschafter-GF | Differenz = vGA → KSt + KapSt |
| Mietvorteil (GmbH vermietet unter Markt an GF) | Differenz = vGA |
| Darlehen ohne/unter Marktzins an GF | Zinsdifferenz = vGA |
| Privatnutzung Firmen-Kfz ohne 1%-Regelung | Nutzungswert = vGA |
| Übernahme privater Kosten durch GmbH | Voller Betrag = vGA |

**Konsequenz einer vGA:**
1. GmbH: vGA wird dem Gewinn HINZUGERECHNET → höhere KSt + GewSt
2. Gesellschafter: vGA wird als Kapitalertrag besteuert (25% + SolZ)
3. Doppelbelastung: ~48% Gesamtsteuer auf den vGA-Betrag

**Prävention:** Alle Verträge zwischen GmbH und Gesellschafter am Fremdvergleich ausrichten. Schriftlich. Marktübliche Konditionen. Dokumentieren!

### Verdeckte Einlage

**Definition:** Gesellschafter überführt Wirtschaftsgut in die GmbH UNTER Marktwert (oder unentgeltlich).

- Steuerfolge GmbH: Kein steuerpflichtiger Ertrag (Einlage erhöht steuerliches Einlagekonto)
- Steuerfolge Gesellschafter: Veräußerung zum Teilwert → Aufdeckung stiller Reserven beim Gesellschafter
- **Relevant bei:** Einbringung von Immobilien oder IP in GmbH-Struktur [AFFECTS: IMMOBILIEN, CORPORATE]
