# Einkommensteuerrecht (EStG) — Grundlagen
*Wissensstand: März 2026*
*Chunk-ID: tax/estg-grundlagen*
*Relevante Agenten: Tax Architect, CFO-Agent*

## Die 7 Einkunftsarten (§2 Abs. 1 EStG)

| # | Einkunftsart | § EStG | Typisch für Mandant | Beispiel |
|---|-------------|--------|--------------------| ---------|
| 1 | Land-/Forstwirtschaft | §13 | Nein | Landwirt |
| 2 | Gewerbebetrieb | §15 | Ggf. (AI-Business als Gewerbe?) | GmbH-Gewinne, Online-Shop |
| 3 | Selbständige Arbeit | §18 | **Ja** (AI-Consulting) | Freiberufler, Berater, Programmierer |
| 4 | Nichtselbständige Arbeit | §19 | **Ja** (Angestellter) | Gehalt, Boni, Sachbezüge |
| 5 | Kapitalvermögen | §20 | **Ja** (ETFs, Dividenden) | Zinsen, Dividenden, Kursgewinne |
| 6 | Vermietung & Verpachtung | §21 | **Ja** (Immobilie) | Mieteinnahmen |
| 7 | Sonstige Einkünfte | §22 | **Ja** (Krypto <1J, Renten) | Private Veräußerungsgeschäfte (§23), Renten |

**Für den Mandant relevant:** §18 (AI-Consulting), §19 (Gehalt), §20 (ETF-Erträge), §21 (Miete), §22/§23 (Krypto <1 Jahr)

## Unbeschränkte vs. Beschränkte Steuerpflicht

| Status | Wann | Umfang | § |
|--------|------|--------|---|
| **Unbeschränkt** | Wohnsitz (§8 AO) ODER gewöhnlicher Aufenthalt (§9 AO) in DE | **Welteinkommen** | §1 Abs. 1 EStG |
| **Beschränkt** | Kein Wohnsitz/Aufenthalt, aber DE-Einkünfte | Nur inländische Einkünfte (§49 EStG) | §1 Abs. 4 EStG |
| **Erweitert beschränkt** | Ex-Resident, <10 Jahre weg, Niedrigsteuerland | Erweiterte inländische Einkünfte | §2 AStG |

**Bei Wegzug:** Wechsel von unbeschränkt → beschränkt (oder erweitert beschränkt). DE-Immobilien bleiben §49 Abs. 1 Nr. 6 (V&V) in DE steuerpflichtig.

## Einkommensteuer-Berechnung (vereinfacht)

```
Bruttoeinkommen (alle Einkunftsarten)
  - Werbungskosten (§9) / Betriebsausgaben (§4)
  - Sonderausgaben (§10): Vorsorge, Riester, Rürup, Kirchensteuer
  - Außergewöhnliche Belastungen (§33)
= Zu versteuerndes Einkommen (zvE)
  → Tarif anwenden (§32a EStG)
= Einkommensteuer
  + Solidaritätszuschlag (5.5% auf ESt, Freigrenze ~17.500€ zvE)
  + Kirchensteuer (8-9% auf ESt, falls Mitglied)
= Gesamte Einkommensteuerlast
```

## Steuertarif 2026 (§32a EStG) [VERIFY: Jährliche Anpassung]

| zvE | Grenzsteuersatz | Effektiver Satz (Durchschnitt) |
|-----|----------------|-------------------------------|
| 0 - ~11.800€ | 0% (Grundfreibetrag) | 0% |
| ~11.800 - ~17.400€ | 14-24% (linear steigend) | ~5-10% |
| ~17.400 - ~67.000€ | 24-42% (linear steigend) | ~15-25% |
| ~67.000 - ~277.800€ | 42% (Spitzensteuersatz) | ~30-38% |
| >~277.800€ | 45% ("Reichensteuer") | ~38-42% |

**Beispiel Mandant (100k zvE):**
- ESt: ~33.000€ (eff. ~33%)
- SolZ: ~1.100€ (5.5% auf ESt, abzgl. Freibetrag)
- KiSt: 0€ (Austritt vor Wegzug!)
- **Gesamt ESt-Last: ~34.100€** (~34% effektiv)

## Abgeltungssteuer (§32d EStG)

Kapitalerträge (§20 EStG) werden pauschal besteuert:
- **25% Abgeltungssteuer** + 5.5% SolZ + ggf. KiSt = **~26.375%** effektiv
- **Teilfreistellung** bei Aktienfonds-ETFs: 30% der Erträge steuerfrei → effektiv ~18.5%
- **Günstigerprüfung** (§32d Abs. 6): Wenn persönlicher Steuersatz <25% → Veranlagungsoption günstiger

**Bei Wegzug:** Abgeltungssteuer entfällt im Zielland (andere Besteuerung). In DE weiterhin auf DE-Bankkonten-Erträge (beschränkte Steuerpflicht).

## Verlustverrechnungsregeln (Überblick)

| Verlust-Typ | Verrechenbar mit | Nicht verrechenbar mit | § |
|------------|-----------------|----------------------|---|
| Gewerblich (§15) | Andere gewerbliche Einkünfte, beschränkt mit anderen Einkunftsarten | — | §10d |
| V&V (§21) | Allen Einkunftsarten (horizontal + vertikal) | — | §10d |
| Kapital (§20) | NUR andere Kapitalerträge (§20) | Nicht mit Arbeit, Gewerblich, V&V | §20 Abs. 6 |
| Private Veräußerung (§23) | NUR andere §23-Geschäfte (Krypto, Gold etc.) | Nicht mit ETF-Gewinnen (§20) | §23 Abs. 3 |
| KG-Verluste (§15a) | NUR bis Höhe der Einlage | Kein Verlustvortrag über Einlage hinaus | §15a |

**Verlustvortrag (§10d EStG):**
- Verlustrücktrag: 1 Jahr zurück, max. 10 Mio EUR (seit 2024) [VERIFY]
- Verlustvortrag: Unbegrenzt in Folgejahre, aber: 60%-Regel ab 1 Mio EUR (nur 60% des Gesamtbetrags der Einkünfte verrechenbar)

## Für den Tax Architect besonders relevant

1. **§18 vs. §15:** AI-Consulting = freiberuflich (§18) ODER gewerblich (§15)? → Entscheidet über GewSt-Pflicht!
   - Freiberuflich: Keine GewSt, aber enge Definition (§18 Abs. 1 Nr. 1: katalogmäßige Berufe)
   - Gewerblich: GewSt-pflichtig, aber §35 Anrechnung mildert
   - **AI-Consulting:** Wahrscheinlich §18 (beratende Tätigkeit), ABER: wenn Software verkauft wird → §15 (Gewerbebetrieb)

2. **Zusammenveranlagung (§26):** Bei Ehepartnern Splitting-Vorteil. Fällt bei Wegzug weg wenn beide ausreisen. Relevant bei Ehegattenschaukel (Immobilien).

3. **Progressionsvorbehalt (§32b):** → Eigener Chunk mit Berechnungsbeispiel
