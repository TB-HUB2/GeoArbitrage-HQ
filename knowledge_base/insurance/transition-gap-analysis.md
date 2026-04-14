# Transition-Gap-Analyse & Versicherungswechsel bei Wegzug
*Wissensstand: März 2026*
*Chunk-ID: insurance/transition-gap-analysis*
*Relevante Agenten: Insurance-Agent, CFO-Agent, Relocation-Agent*

## Das Kernproblem

Beim Wegzug aus Deutschland enden viele Versicherungen automatisch oder müssen gekündigt werden. Zwischen DE-Ende und Zielland-Start entsteht eine **Deckungslücke** (Transition Gap).

**Regel:** KEIN Tag ohne Krankenversicherung. KEIN Tag ohne Haftpflicht. KEIN Tag ohne PI/E&O (bei laufendem Business).

## Transition-Gap berechnen

```
Abmeldung DE:        [Datum A]
Ende GKV/PKV:        [Datum A oder Monatsende]
Ende dt. Haftpflicht: [oft Jahresende oder Monat nach Kündigung]
Ende dt. BU:          [Prüfen: Auslandsklausel]
Ende dt. Rechtsschutz: [Prüfen: internationale Geltung]

Start int. KV:        [Datum B]
Start Zielland-KV:    [Datum C — kann Wochen nach Ankunft sein!]
Start int. Haftpflicht: [Datum D]

LÜCKE = MAX(Datum B, C, D) - Datum A
```

**Typische Lücken:**
- KV: 0-14 Tage (wenn rechtzeitig beantragt)
- Haftpflicht: 0-30 Tage (oft vergessen!)
- BU: Oft keine Lücke (DE-Police kann fortlaufen)
- Rechtsschutz: Bis zu 3 Monate (Kündigungsfrist + neue Police)

## Brücken-Optionen

### KV-Brücke (0-90 Tage)
| Option | Dauer | Kosten | Deckung |
|--------|-------|--------|---------|
| EHIC (in EU-Ländern) | Bis GKV-Ende | 0€ | Notfall-Standard des Aufenthaldslands |
| Reise-KV (Hanse Merkur, DR-WALTER) | Bis 365 Tage | 30-80 EUR/Monat | Notfall + Rücktransport |
| Int. KV Startdatum = Wegzugstag | Ab Tag 0 | Reguläre Prämie | Vollschutz |
| PKV-Nachversicherungsfrist | 1 Monat | PKV-Prämie | Voller PKV-Schutz |

**Empfehlung:** Internationale KV so beantragen, dass Startdatum = Abmeldedatum. Reise-KV nur als Backup falls Gesundheitsprüfung verzögert.

### Haftpflicht-Brücke
- Deutsche PHV: Prüfen ob **weltweite Geltung** vereinbart ist (oft nur EU/Schengen)
- Falls ja: PHV kann weiterlaufen bis Jahresende → keine Lücke
- Falls nein: Internationale PHV (Hiscox, Allianz Global) ab Wegzugstag aktivieren

### BU/Income Protection-Brücke
- Deutsche BU: Meist **Fortführung möglich** bei EU/EWR-Aufenthalt
- Prüf-Checkliste: (1) Dienstort-Klausel im Vertrag? (2) Weltweite Leistung oder EU-beschränkt? (3) Meldepflicht bei Adressänderung?
- Bei Drittstaaten (UAE, Thailand, Paraguay): Fortführung oft NICHT garantiert → Income Protection als Alternative

## PKV-Anwartschaft — Wirtschaftlichkeitsrechnung

### Kleine Anwartschaft
```
Kosten: ~50 EUR/Monat = 600 EUR/Jahr
Nach 5 Jahren Ausland: 3.000 EUR gezahlt
Vorteil bei Rückkehr: Keine erneute Gesundheitsprüfung, Alterungsrückstellungen erhalten
Wert: Ersparte Gesundheitsprüfung (bei Vorerkrankungen: unbezahlbar)
```

### Große Anwartschaft
```
Kosten: ~200 EUR/Monat = 2.400 EUR/Jahr
Nach 5 Jahren Ausland: 12.000 EUR gezahlt
Vorteil bei Rückkehr: Sofort voller Versicherungsschutz im alten Tarif
Wert: Sofortiger Schutz + alter Tarif (bei Tarifschließungen: sehr wertvoll)
```

### Empfehlung nach Rückkehrwahrscheinlichkeit
| Rückkehr-Wahrscheinlichkeit | Empfehlung | Begründung |
|------------------------------|-----------|------------|
| >70% innerhalb 3 Jahre | Große Anwartschaft | Voller Schutz ab Tag 1 bei Rückkehr |
| 30-70% innerhalb 5 Jahre | Kleine Anwartschaft | Kosten-effizient, Gesundheitsschutz erhalten |
| <30% oder >5 Jahre Ausland | Kündigung | Kosten für Anwartschaft > Nutzen, Neueinstieg bei Rückkehr |
| Vorerkrankungen vorhanden | Kleine Anwartschaft IMMER | Gesundheitsprüfung bei Neueinstieg = Risiko |

## Checkliste Versicherungswechsel bei Wegzug

### 3 Monate vorher
- [ ] Internationale KV beantragen (Gesundheitsprüfung → 2-4 Wochen)
- [ ] PKV-Anwartschaft beantragen (oder Kündigung zum Wegzugsdatum)
- [ ] Bestehende Policen auf Auslandsklauseln prüfen (BU, PHV, Rechtsschutz, Unfall)
- [ ] PI/E&O: Internationale Police beantragen (Hiscox, CFC)
- [ ] Umbrella-Police evaluieren (bei Vermögen > 500k)

### 1 Monat vorher
- [ ] Bestätigung internationale KV — Startdatum = Wegzugstag
- [ ] GKV/PKV Kündigung einreichen mit Wegzugsnachweis
- [ ] Dt. Haftpflicht: Fortführung klären ODER internationale Alternative aktivieren
- [ ] Gebäudeversicherung Immobilien: Adressänderung melden (NICHT kündigen!)
- [ ] Mietausfall/Vermieter-Rechtsschutz: Auf Nicht-Resident-Tauglichkeit prüfen
- [ ] Kfz-Versicherung: Abmeldung oder Überführung planen

### Wegzugstag
- [ ] GKV/PKV endet → Internationale KV aktiv
- [ ] Reise-KV als Backup für erste 2 Wochen (falls int. KV noch nicht bestätigt)
- [ ] EHIC mitnehmen (gilt bis Ende der GKV-Mitgliedschaft)
- [ ] Alle Policen-Nummern + Notfall-Hotlines digital speichern (Cloud + lokal)

### 1 Monat nachher
- [ ] Zielland-KV registrieren (wenn Pflicht: UAE, Andorra)
- [ ] Zielland-Haftpflicht prüfen (wenn lokale Anforderungen)
- [ ] Alle offenen Erstattungsansprüche bei DE-Versicherern einreichen
- [ ] Bestätigung Anwartschaft PKV (schriftlich aufbewahren)

## Kosten-Übersicht Transition

| Position | Einmalig | Laufend/Monat |
|----------|----------|-------------|
| Internationale KV | 0 (Abschluss kostenfrei) | 150-500 EUR |
| PKV-Anwartschaft (klein) | 0 | 50 EUR |
| Reise-KV (Backup, 1 Monat) | 50 EUR | — |
| Int. Haftpflicht (Jahrespolice) | 200-400 EUR | — |
| PI/E&O international | 800-2.500 EUR/Jahr | — |
| Equipment Insurance | 300-800 EUR/Jahr | — |
| **Gesamt Transition-Kosten** | **~1.350-3.750 EUR** | **+200-550 EUR/Monat laufend** |
