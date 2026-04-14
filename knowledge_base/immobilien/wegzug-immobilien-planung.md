# Wegzug & Immobilien — Verkaufs-Timing, §6 AStG & Steuerplanung
*Wissensstand: März 2026*
*Chunk-ID: immobilien/wegzug-immobilien-planung*
*Relevante Agenten: Immobilien-Agent, Tax-Agent, CFO-Agent*

## Das Kernproblem

Bei Wegzug aus DE bleiben deutsche Immobilien steuerpflichtig (§49 Abs. 1 Nr. 6 EStG). Die Frage ist: **Wann verkaufen — vor, während oder nach dem Wegzug?** Die Antwort hängt von Spekulationsfrist, Struktur und persönlicher Steuerquote ab.

## Szenario-Matrix: Verkaufs-Timing

### Privatbesitz (§23 EStG, 10-Jahre-Frist)

| Timing | Spekulationsfrist (10J) abgelaufen? | Steuerpflicht | Steuersatz | Empfehlung |
|--------|-------------------------------------|-------------|-----------|------------|
| **Vor Wegzug, <10J** | Nein | Voller Gewinn steuerpflichtig (§23) | Persönlicher Satz (bis 45%) | ❌ Vermeiden wenn möglich |
| **Vor Wegzug, >10J** | Ja | **Steuerfrei!** | 0% | ✅ Optimal wenn Frist abgelaufen |
| **Nach Wegzug, <10J** | Nein | Steuerpflichtig (§49 + §23) | Beschränkter Satz (ohne Progressionsvorbehalt!) | ⚠️ Möglich, oft günstiger als vor Wegzug |
| **Nach Wegzug, >10J** | Ja | **Steuerfrei** | 0% | ✅ Optimal — auch nach Wegzug gilt 10J-Frist |

**Taktik:** Spekulationsfrist abwarten → dann verkaufen (egal ob vor oder nach Wegzug). Wenn Frist noch nicht abgelaufen: Nach Wegzug verkaufen kann günstiger sein (niedrigerer Steuersatz durch fehlenden Progressionsvorbehalt).

### GmbH-Besitz (§6 AStG + KSt)

| Timing | §6 AStG relevant? | KSt auf Verkauf | Empfehlung |
|--------|-------------------|----------------|------------|
| **Immobilie IN GmbH, Mandant zieht weg** | §6 AStG greift auf **GmbH-Anteile** (nicht auf Immobilie!) | GmbH verkauft Immobilie → KSt 15,825% + GewSt | ⚠️ §6 AStG Bewertung der Anteile nötig |
| **Immobilie vor Wegzug aus GmbH entnehmen** | Entnahme = Veräußerung zum Teilwert → vGA + GrESt | Doppelbelastung! | ❌ Meist ungünstig |
| **GmbH-Anteile vor Wegzug verkaufen** | Kein §6 AStG (kein Wegzug, Anteile veräußert) | §17 EStG: 60% Teileinkünfte × pers. Satz | ⚠️ Nur wenn Käufer vorhanden |

**Kern-Erkenntnis:** Bei GmbH-Struktur löst der WEGZUG die §6 AStG Wegzugssteuer auf die GmbH-ANTEILE aus (nicht auf die Immobilie selbst). Die 7-Jahres-Ratenzahlung wird fällig.

## §6 AStG bei GmbH mit Immobilien — Berechnungsbeispiel

**Ausgangslage:**
- GmbH mit 2 Mietimmobilien (Marktwert 800.000€)
- Stammkapital: 25.000€
- Thesaurierte Gewinne: 150.000€
- Marktwert GmbH-Anteile (Ertragswertverfahren): 600.000€ [VERIFY: Gutachten nötig]
- Historische Anschaffungskosten Anteile: 25.000€

**§6 AStG Berechnung:**
```
Unrealisierter Gewinn = 600.000€ - 25.000€ = 575.000€
Wegzugssteuer (ca. 26,375% Abgeltung): ~151.700€
Ratenzahlung: 7 gleiche Jahresraten = ~21.670€/Jahr
```

**Achtung:** Die Raten sind zinsfrei, aber sofort fällig ab Wegzugsjahr. Rückkehr innerhalb 7 Jahren → Steuerfestsetzung wird auf Antrag rückgängig gemacht.

## Steuerplanung: Beschränkte Steuerpflicht (§49 EStG)

### Was bleibt in DE steuerpflichtig nach Wegzug?

| Einkunftsart | § EStG | Weiterhin in DE? | Steuersatz |
|-------------|--------|-----------------|-----------|
| Mieteinnahmen (V&V) | §49 Abs. 1 Nr. 6 | **Ja** | Beschränkter Tarif (§50) |
| Veräußerungsgewinn <10J | §49 Abs. 1 Nr. 2f | **Ja** | Beschränkter Tarif |
| Veräußerungsgewinn >10J | — | **Nein** (steuerfrei) | 0% |
| GmbH-Dividenden | §49 Abs. 1 Nr. 5a | **Ja** (KapSt 25%) | DBA-Satz (z.B. 5% UAE) |
| Gewerbliche Immobilien-Einkünfte | §49 Abs. 1 Nr. 2a | **Ja** | Beschränkter Tarif |

### Steuer-Vorteil der beschränkten Steuerpflicht

**Vor Wegzug (unbeschränkt, Progressionsvorbehalt):**
- Mieteinnahmen 20.000€ + Gehalt 80.000€ → Grenzsteuersatz ~42%
- Steuer auf Mieteinnahmen: ~8.400€

**Nach Wegzug (beschränkt, KEIN Progressionsvorbehalt):**
- Mieteinnahmen 20.000€ isoliert → Grenzsteuersatz ~25%
- Steuer auf Mieteinnahmen: ~3.500€ (nach Grundfreibetrag-Anrechnung [VERIFY: gilt bei §50?])
- **Ersparnis: ~4.900€/Jahr** allein durch Wegzug!

## AfA-Verlustverrechnung nach Wegzug

**Problem:** Nach Wegzug können AfA-Verluste aus Immobilien nur noch mit ANDEREN DE-Einkünften verrechnet werden — nicht mit ausländischem Einkommen.

**Vor Wegzug:** AfA-Verlust aus Immobilie mindert Gehalt (horizontaler Verlustausgleich) → hohe Steuerersparnis bei hohem Gehalt.

**Nach Wegzug:** AfA-Verlust nur noch gegen Mieteinnahmen aus DE-Immobilien → oft kein Vorteil wenn Mieteinnahmen > AfA.

**Taktik:**
1. **Hohe AfA-Jahre VOR Wegzug maximieren** (z.B. §7 Abs. 5a degressive AfA im ersten Jahr)
2. **Anschaffungsnahe Herstellungskosten** VOR Wegzug realisieren (15%-Regel nutzen solange Verlustverrechnung gegen Gehalt funktioniert)
3. **Nach Wegzug:** AfA läuft weiter, mindert aber nur DE-Immobilien-Einkünfte

## Zustellbevollmächtigter (§123 AO) — Pflicht nach Wegzug

Nach Abmeldung aus DE MUSS ein Zustellbevollmächtigter in DE benannt werden:
- Empfängt Steuerbescheide, Finanzamt-Korrespondenz, Fristensendungen
- Typisch: Steuerberater oder Eltern
- **ACHTUNG:** Ohne Zustellbevollmächtigten → öffentliche Zustellung → verpasste Fristen → Bestandskraft!
- Kosten: Im StB-Honorar inkludiert oder ~100-200€/Jahr separat

## Entscheidungsbaum: Immobilien bei Wegzug

```
Frage 1: Spekulationsfrist (10J) abgelaufen?
├── JA → Verkauf steuerfrei (vor ODER nach Wegzug)
│       → Entscheidung: Halten (Cashflow) oder Verkaufen (Liquidität)
└── NEIN → Weiter zu Frage 2

Frage 2: Immobilie in GmbH oder Privatbesitz?
├── PRIVATBESITZ:
│   ├── Cashflow positiv? → Halten, nach Spekulationsfrist verkaufen
│   └── Cashflow negativ? → Verkaufen, Verlust steuerlich nutzen VOR Wegzug
└── GmbH:
    ├── §6 AStG Wegzugssteuer berechnen (7 Jahresraten)
    ├── GmbH behalten → Raten zahlen, Immobilien in GmbH lassen
    └── GmbH-Anteile VOR Wegzug verkaufen? → §17 EStG, Teileinkünfteverfahren

Frage 3: Finanzierung gesichert nach Wegzug?
├── JA (15-20J Zinsbindung) → Halten unproblematisch
└── NEIN (kurze Zinsbindung) → Anschlussfinanzierung als Nicht-Resident SEHR schwierig!
    → Strategie: VOR Wegzug langfristige Zinsbindung abschließen
```
