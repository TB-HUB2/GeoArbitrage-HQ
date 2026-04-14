# Progressionsvorbehalt (§32b EStG) — Mechanik & Berechnungsbeispiel
*Wissensstand: März 2026*
*Chunk-ID: tax/progressionsvorbehalt-§32b*
*Relevante Agenten: Tax Architect, Immobilien-Agent, CFO-Agent*

## Was ist der Progressionsvorbehalt?

**Problem:** Deutschland stellt bestimmte Einkünfte per DBA steuerfrei (Freistellungsmethode). ABER: Diese freigestellten Einkünfte erhöhen trotzdem den **Steuersatz** auf die verbleibenden steuerpflichtigen Einkünfte in DE.

**Grundlage:** §32b Abs. 1 EStG — gilt NUR bei **unbeschränkter** Steuerpflicht (Wohnsitz/gewöhnlicher Aufenthalt in DE).

**Nach Wegzug:** Progressionsvorbehalt entfällt! Beschränkt Steuerpflichtige (§1 Abs. 4 EStG) unterliegen NICHT dem Progressionsvorbehalt — ein steuerlicher VORTEIL des Wegzugs.

## Mechanik

```
Schritt 1: Berechne zvE INKL. freigestellter Einkünfte
  → "Fiktives Welteinkommen" = steuerpflichtige + freigestellte Einkünfte

Schritt 2: Berechne Steuersatz auf fiktives Welteinkommen
  → Höherer Satz wegen Progression

Schritt 3: Wende diesen HÖHEREN Satz nur auf die STEUERPFLICHTIGEN Einkünfte an
  → Mehr Steuer als ohne Progressionsvorbehalt
```

## Berechnungsbeispiel: Mandant mit Auslands-Mieteinnahmen

**Ausgangslage (noch in DE wohnhaft):**
- Gehalt DE: 80.000€ (§19 EStG, steuerpflichtig)
- Mieteinnahmen Portugal: 15.000€ (per DBA DE-PT freigestellt, Freistellungsmethode)
- zvE ohne Progressionsvorbehalt: 80.000€

### OHNE Progressionsvorbehalt (theoretisch)

| zvE | ESt (Tarif §32a) |
|-----|-------------------|
| 80.000€ | ~22.000€ |
| **Effektiver Steuersatz** | **~27,5%** |

### MIT Progressionsvorbehalt (§32b — tatsächlich)

| Schritt | Berechnung |
|---------|-----------|
| Fiktives Welteinkommen | 80.000€ + 15.000€ = **95.000€** |
| Steuersatz auf 95.000€ | ~33,5% (höhere Progressionsstufe) |
| Angewandt auf steuerpflichtiges zvE | 80.000€ × 33,5% = **~26.800€** |
| **Mehrbelastung durch Progressionsvorbehalt** | **~4.800€** |

**Das bedeutet:** Die 15.000€ Portugal-Miete sind in DE zwar steuerfrei, ABER sie kosten trotzdem ~4.800€ an höherer Steuer auf das Gehalt. Effektiv werden die "freigestellten" Einkünfte mit ~32% indirekt besteuert.

## Wann greift Progressionsvorbehalt?

| Einkunftsart | Progressionsvorbehalt? | Grund |
|-------------|----------------------|-------|
| Per DBA freigestellte ausländische Einkünfte | **Ja** | §32b Abs. 1 Nr. 3 |
| Lohnersatzleistungen (ALG I, Elterngeld, Krankengeld) | **Ja** | §32b Abs. 1 Nr. 1 |
| Ausländische Einkünfte bei §1 Abs. 3 EStG (Antrag) | **Ja** | |
| Per DBA ANGERECHNETE Einkünfte | **Nein** | Anrechnung ≠ Freistellung |
| Abgeltungssteuer-pflichtige Erträge (§32d) | **Nein** | Separater Tarif |

## Relevanz für Mandanten-Szenarien

### Szenario 1: Vor Wegzug — DE-Gehalt + PT-Mieteinnahmen
- Portugal-Mieteinnahmen per DBA DE-PT freigestellt (Freistellungsmethode)
- **Progressionsvorbehalt greift** → Gehalt wird höher besteuert
- Empfehlung: In Steuererklärung Anlage AUS ausfüllen!

### Szenario 2: Nach Wegzug — Beschränkte Steuerpflicht
- Nur noch DE-Immobilien-Einkünfte steuerpflichtig (§49)
- **Progressionsvorbehalt entfällt** → Isolierter DE-Steuersatz (meist niedriger)
- Beispiel: 20.000€ DE-Mieteinnahmen → ESt nur ~2.000€ (eff. ~10%)
- VORTEIL des Wegzugs: Niedrigerer Steuersatz auf DE-Einkünfte!

### Szenario 3: Immobilien in vGmbH nach Wegzug
- GmbH zahlt KSt (15,825%) statt ESt mit Progressionsvorbehalt
- Kein Progressionsvorbehalt bei Kapitalgesellschaften (KSt hat Flat Rate)
- Ausschüttung an Nicht-Residenten → DBA-Quellensteuer (z.B. 5% UAE, 15% Standard)

## Strategische Implikationen

1. **Vor Wegzug:** Progressionsvorbehalt erhöht DE-Steuer auf Gehalt. Mieteinnahmen aus DBA-Freistellungsländern sind "nicht wirklich frei".
2. **Nach Wegzug:** Progressionsvorbehalt entfällt → DE-Immobilien-Einkünfte werden isoliert (niedrig) besteuert. **Das ist ein quantifizierbarer Wegzugs-Vorteil.**
3. **Taktik:** Wenn möglich, hohe ausländische Einkünfte in die Zeit NACH Wegzug verschieben (z.B. Dividendenausschüttung erst nach Abmeldung).

## Interaktion mit anderen Regelungen

| Regelung | Zusammenspiel mit §32b |
|----------|----------------------|
| §2 AStG (erweiterte beschränkte Steuerpflicht) | Progressionsvorbehalt greift AUCH bei §2 AStG |
| §6 AStG (Wegzugssteuer) | Kein Zusammenhang — §6 AStG ist einmalige Steuer auf Anteile |
| DBA-Anrechnungsmethode | Kein Progressionsvorbehalt (Anrechnung statt Freistellung) |
| §34c EStG (unilaterale Anrechnung) | Kein Progressionsvorbehalt |
| InvStG (Teilfreistellung) | Teilfreistellung reduziert Progressionsvorbehalt-Basis |
