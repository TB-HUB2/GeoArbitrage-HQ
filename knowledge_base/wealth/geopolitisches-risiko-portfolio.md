# Geopolitisches Risiko als Portfolio-Faktor
*Wissensstand: März 2026*
*Chunk-ID: wealth/geopolitisches-risiko-portfolio*
*Relevante Agenten: Wealth Manager, CFO-Agent, Relocation-Agent*

## Warum Geo-Risiko im Portfolio relevant ist

Für Geo-Arbitrage-Mandanten ist geopolitisches Risiko DOPPELT relevant:
1. **Portfolio-Risiko:** Aktien/Anleihen in instabilen Regionen können abstürzen
2. **Wohnsitz-Risiko:** Das Zielland selbst kann instabil werden → Vermögen UND Lebensmittelpunkt gefährdet

## Datenquellen für Geo-Risiko-Monitoring

### GDELT (Global Database of Events, Language, and Tone)
- **Was:** Weltweite Medien-Analyse, identifiziert Konflikte, Proteste, politische Spannungen
- **Metrik:** Instability Index (0-100, höher = instabiler)
- **Frequenz:** Täglich aktualisiert
- **Interpretation:**
  - 0-20: Stabil (DE, CH, skandinavische Länder)
  - 20-40: Moderat (UAE, Portugal, Zypern)
  - 40-60: Erhöht (Thailand, Georgien, Türkei)
  - 60-80: Hoch (Libanon, Myanmar)
  - 80-100: Krise (aktive Konfliktzonen)
- **Limit:** Medien-Bias — westliche Medien berichten mehr über manche Regionen

### ACLED (Armed Conflict Location & Event Data)
- **Was:** Datensatz aller gewaltsamen Konfliktereignisse weltweit
- **Metriken:** Anzahl Vorfälle, Opferzahlen, Konflikttyp (Protest, Gewalt, Terrorismus)
- **Frequenz:** Wöchentlich aktualisiert
- **Zugang:** Kostenlos, OAuth2 Registrierung (seit Sep 2025)
- **Interpretation für Portfolio:** Trend wichtiger als Niveau — steigende Konfliktzahlen = Frühwarnsignal

### Polymarket (Prediction Markets)
- **Was:** Crowd-Intelligence für geopolitische Wahrscheinlichkeiten
- **Beispiel:** "Will Russia-Ukraine conflict escalate in 2026?" → 25% [VERIFY]
- **Limit:** Liquidität variiert, Manipulation möglich, US-Fokus
- **Interpretation:** Als ERGÄNZUNG zu GDELT/ACLED, nicht als alleinige Quelle

## Portfolio-Impact-Matrix

### Wie Geo-Risiko das Portfolio beeinflusst

| Geo-Ereignis | Portfolio-Impact | Historisches Beispiel | Hedging-Strategie |
|-------------|-----------------|---------------------|-------------------|
| Krieg/Invasion | Aktien -20-50%, Rohstoffe +30%, Gold +15% | Ukraine 2022: EU-Aktien -15%, Gas +300% | Gold-Übergewichtung, Rohstoff-ETF |
| Staatsbankrott | Lokale Anleihen -80%, Währung -50%+ | Argentinien 2001, Libanon 2019 | Keine lokalen Anleihen in Risiko-Ländern |
| Sanktionen | Betroffene Assets eingefroren, Transfers blockiert | Russland 2022: SWIFT-Ausschluss | Multi-Jurisdiktion Banking, keine Konzentration |
| Banking-Krise | Einlagen >100k gefährdet, Kapitalverkehrskontrollen | Zypern 2013: 47.5% Bail-in >100k | Einlagen <100k pro Bank, Multi-Land |
| Politische Instabilität | Währungsabwertung, Kapitalflucht, Visa-Unsicherheit | Türkei 2018-2023: Lira -80% | Fremdwährungs-Assets, Exit-Plan |
| Pandemie/Grenzschließung | Reisebeschränkungen, Mietausfälle, Geschäftsunterbrechung | COVID 2020: Expats strandeten | Notfall-Reserve in 2 Jurisdiktionen |

## Exposure-Monitoring für Geo-Arbitrage-Portfolio

### Schritt 1: Geo-Exposure berechnen
Für JEDES Asset im Portfolio: Wo ist es domiziliert/gelagert?

```
Portfolio-Geo-Exposure Beispiel:
  DE: 45% (Immobilien DE, DE-Depot)
  USA: 25% (US-ETFs via IBKR, US LLC)
  UAE: 15% (UAE-Bankkonto, lokale Assets)
  EU sonstige: 10% (Zypern-Konto, Malta-Fonds)
  Krypto (jurisdiktionsfrei): 5%
```

### Schritt 2: Konzentrations-Check
- **Warnung bei >40% Exposure in einem einzelnen Land** (außer DE bei DE-Immobilien)
- **Warnung bei >60% Exposure in einer Geo-Region** (z.B. "EU insgesamt")
- **Ausnahme:** Krypto ist jurisdiktionsfrei (Self-Custody) → zählt nicht als Länder-Exposure

### Schritt 3: Risiko-Trigger definieren
| GDELT-Instability-Änderung | Aktion |
|---------------------------|--------|
| +5 Punkte in 1 Monat | Beobachten, keine Aktion |
| +10 Punkte in 1 Monat | Gelbe Warnung: Exposure in diesem Land prüfen |
| +20 Punkte in 1 Monat | Rote Warnung: Reduktion des Exposures erwägen |
| Absolut >60 | Sofortige Überprüfung: Vermögenswerte in diesem Land sichern/abziehen? |

## Hedging-Strategien für Geo-Risiko

### Gold als Hedge (5-15% des Portfolios)
- Krisenresistent: Gold steigt in fast jeder geopolitischen Krise
- Jurisdiktionsfrei bei physischem Besitz (Tresor, BullionVault)
- Xetra-Gold: Nach 12 Monaten steuerfrei (BFH IX R 33/17)

### Multi-Jurisdiktion-Banking
- Bankkonten in mindestens 3 Ländern (DE, Zielland, Drittland)
- Einlagen <100k EUR pro Bank (Einlagensicherung)
- Kein Land mit >40% der liquiden Mittel

### Krypto als "Exit-Asset"
- Self-Custody (Hardware Wallet) = vollständig jurisdiktionsfrei
- In Extremszenarien (Kapitalverkehrskontrollen, Bankenkrise): einziges übertragbares Vermögen
- Aber: Volatilität! Max 5-10% des Portfolios
- DAC8 ab 2026: Transparenz steigt → weniger "unsichtbar" als früher

### Portfolio-Versicherung (Tail Risk Hedging)
- Put-Optionen auf breite Indizes: Teuer (~2-3% p.a.) aber effektiv
- Nur sinnvoll ab >500k Portfolio
- Alternative: Inverse ETFs als kurzfristiger Hedge (NICHT als Dauerposition!)

## Integration mit Weekly Scan

Der Weekly Scan (n8n Workflow) prüft automatisch:
1. GDELT Instability Score für alle Zielländer
2. ACLED Konfliktereignisse der letzten 7 Tage
3. FX-Raten (Währungen der Zielländer)
4. Polymarket Geopolitik-Märkte (Top 5 relevante)

**Output:** Wenn Trigger-Schwellen überschritten → Telegram-Alert an Mandant + CFO-Agent aktualisiert Risiko-Register.

## Mandant-spezifische Geo-Risiko-Bewertung

Für Zielländer des Mandanten:

| Land | GDELT Q1/2026 [VERIFY] | Trend | Hauptrisiko | Portfolio-Impact |
|------|----------------------|-------|-------------|-----------------|
| UAE | ~25 (Moderat) | Stabil | Iran-Spannung, Ölpreis | Gering (diversifiziert) |
| Portugal | ~15 (Niedrig) | Stabil | Waldbrände, EU-Schulden | Sehr gering |
| Georgien | ~45 (Erhöht) | Steigend [VERIFY] | Russland-Nähe, innenpolitische Krise | Mittel (Visa-Risiko) |
| Thailand | ~35 (Moderat) | Schwankend | Politische Zyklen, Monarchie | Gering-Mittel |

**Empfehlung:** Kein Land mit GDELT >50 als primären Vermögensstandort nutzen. Georgien auf Beobachtungsliste → bei weiterem Anstieg: Vermögen abziehen, nur lokale Betriebsausgaben belassen.
