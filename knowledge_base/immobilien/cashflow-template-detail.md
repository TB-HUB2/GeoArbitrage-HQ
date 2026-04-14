# Cashflow-Modellierung — Detailliertes Template & Berechnungsanleitung
*Wissensstand: März 2026*
*Chunk-ID: immobilien/cashflow-template-detail*
*Relevante Agenten: Immobilien-Agent, CFO-Agent*

## Cashflow-Template: Jährliche Berechnung

### Einnahmen-Seite

| Position | Berechnung | Beispiel (80qm, Düsseldorf) |
|----------|-----------|---------------------------|
| **Jahresnettokaltmiete** | Monatsmiete × 12 | 900€/Mo × 12 = 10.800€ |
| - Leerstandsrisiko | 3-5% der Jahresnettokaltmiete | -380€ (3.5%) |
| = **Effektive Mieteinnahmen** | | **10.420€** |

### Ausgaben-Seite (nicht umlagefähig)

| Position | Berechnung | Beispiel |
|----------|-----------|---------|
| Hausverwaltung (WEG) | 20-35€/Einheit/Monat | 25€ × 12 = 300€ |
| Sondereigentumsverwaltung | 4-8% der Nettomiete | 6% × 10.800 = 648€ |
| Instandhaltungsrücklage | 7-12€/qm/Jahr (Alter-abhängig) | 10€ × 80qm = 800€ |
| Nicht-umlagefähige NK | Grundsteuer (Eigentümeranteil), Bankgebühren | ~400€ |
| Versicherungen (Eigentümer) | Gebäude, Haftpflicht (anteilig) | ~200€ |
| **Summe Ausgaben** | | **2.348€** |

### Finanzierung

| Position | Berechnung | Beispiel (200k€ Kredit, 3.5%, 2% Tilgung) |
|----------|-----------|-------------------------------------------|
| Annuität | (Zinssatz + Tilgungssatz) × Darlehensbetrag | 5.5% × 200.000 = 11.000€/Jahr |
| davon Zinsen (Jahr 1) | Zinssatz × Restschuld | 3.5% × 200.000 = 7.000€ |
| davon Tilgung (Jahr 1) | Annuität - Zinsen | 11.000 - 7.000 = 4.000€ |

### Steuereffekt (Privatbesitz, unbeschränkt steuerpflichtig)

| Position | Berechnung | Beispiel |
|----------|-----------|---------|
| Mieteinnahmen | Effektive Mieteinnahmen | 10.420€ |
| - AfA | 2% × Gebäudeanteil Anschaffungskosten | 2% × 180.000 = 3.600€ |
| - Schuldzinsen | Nur Zinsanteil der Annuität | 7.000€ |
| - Werbungskosten | Verwaltung + nicht-umlagefähige NK | 1.348€ |
| = **Steuerliches Ergebnis** | | **-1.528€** (Verlust!) |
| × Grenzsteuersatz | Bei 100k Gehalt: ~42% | |
| = **Steuerersparnis** | Verlust × Grenzsteuersatz | **642€** |

### Cashflow-Zusammenfassung (Jahr 1)

| Position | Betrag |
|----------|--------|
| Effektive Mieteinnahmen | +10.420€ |
| - Ausgaben (Verwaltung, Instandhaltung etc.) | -2.348€ |
| - Annuität (Zins + Tilgung) | -11.000€ |
| + Steuerersparnis | +642€ |
| = **Cashflow nach Steuern** | **-2.286€/Jahr** = **-190€/Monat** |

**Interpretation:** Negativer Cashflow (-190€/Mo) = Mandant "zahlt drauf". ABER: Tilgung (4.000€/Jahr) baut Eigenkapital auf. Realer Vermögenszuwachs: 4.000€ - 2.286€ = **+1.714€/Jahr** netto.

## 15-Jahre-Projektion (vereinfacht)

### Annahmen
- Mietsteigerung: 2%/Jahr (Indexmietvertrag)
- Tilgung: Steigend (Annuität konstant, Zinsanteil sinkt)
- AfA: Konstant 3.600€/Jahr (linear)
- Zinsbindung: 15 Jahre fix
- Kein Verkauf (Hold-Strategie)
- Wertsteigerung Immobilie: 1.5%/Jahr (konservativ)

| Jahr | Miete | Cashflow (nach Steuer) | Restschuld | Equity | Immobilienwert |
|------|-------|----------------------|-----------|--------|---------------|
| 1 | 10.800€ | -2.286€ | 196.000€ | 54.000€ | 254.000€ |
| 3 | 11.237€ | -1.800€ | 187.500€ | 68.800€ | 261.700€ |
| 5 | 11.689€ | -1.300€ | 178.500€ | 84.700€ | 269.600€ |
| 7 | 12.155€ | -750€ | 169.000€ | 101.500€ | 277.800€ |
| 10 | 12.907€ | +200€ | 153.000€ | 129.000€ | 290.700€ |
| 15 | 14.261€ | +1.500€ | 125.000€ | 174.000€ | 312.000€ |

**Break-Even (Cashflow-positiv):** ~Jahr 9-10
**Equity nach 15 Jahren:** ~174.000€ (bei 50.000€ Eigenkapital-Einsatz = 3.5x Hebel)

## Strukturvergleich: Privatbesitz vs. vGmbH (gleiche Immobilie)

| Dimension | Privatbesitz | vGmbH |
|-----------|-------------|-------|
| AfA | 2-3% linear | 2-3% linear (gleich) |
| Verlustverrechnung | Mit ALLEN Einkunftsarten (§21) | Nur innerhalb GmbH |
| Steuersatz laufend | Grenzsteuersatz (bis 45%) | KSt 15,825% (+ ggf. GewSt) |
| Spekulationsfrist | 10 Jahre → dann steuerfrei | Keine (immer KSt auf Gewinn) |
| Thesaurierung | Nicht möglich | Ja → nur 15,825% Steuerlast |
| Ausschüttung | Direkt an Mandant (progressiv besteuert) | +25% KapSt → ~48% Gesamtlast |
| GrESt bei Erwerb | Normal (3.5-6.5%) | Normal |
| Empfehlung: 1 Immobilie | ✅ Privatbesitz (Verlustverrechnung!) | ❌ Zu aufwändig |
| Empfehlung: 3+ Immobilien | ⚠️ 3-Objekt-Grenze beachten | ✅ vGmbH wenn >3 Objekte oder Cashflow-positiv |
| Empfehlung: Bei Wegzug | ✅ Einfacher (kein §6 AStG) | ⚠️ §6 AStG auf GmbH-Anteile! |

## Sensitivitäts-Analyse: Was wenn Annahmen nicht stimmen?

| Parameter | Basis | Worst Case | Impact auf 15J-Equity |
|-----------|-------|-----------|----------------------|
| Mietsteigerung | 2%/Jahr | 0%/Jahr | -25.000€ Equity |
| Leerstand | 3.5% | 10% | -12.000€ Equity |
| Zinssatz Anschlussfinanzierung | 3.5% | 6.0% | -18.000€ Cashflow (ab J15) |
| Instandhaltungskosten | 10€/qm/J | 15€/qm/J | -6.000€ Equity |
| Immobilienwert | +1.5%/J | -1%/J (Crash) | -70.000€ Wert (aber Equity durch Tilgung) |

**Worst-Case kumuliert:** Equity nach 15J sinkt von 174k auf ~90k. Immer noch positiv dank Tilgung — Immobilien-Leverage funktioniert auch im Worst Case, nur schwächer.
