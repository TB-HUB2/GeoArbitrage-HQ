# Immobilien-Marktanalyse: Methodik und Kennzahlen
*Wissensstand: März 2026*
*Chunk-ID: immobilien/marktanalyse-methodik*
*Relevante Agenten: Immobilien-Spezialist, Finanz-Spezialist*

## Kaufpreisfaktor (Vervielfältiger)

Der **Kaufpreisfaktor** (auch: Vervielfältiger, KGV der Immobilie) ist das zentrale Schnellbewertungsmaß:

```
Kaufpreisfaktor = Kaufpreis / Jahresnettokaltmiete
```

**Interpretation:**
- Faktor 20 = 5,0 % Bruttomietrendite
- Faktor 25 = 4,0 % Bruttomietrendite
- Faktor 30 = 3,3 % Bruttomietrendite
- Faktor 35+ = unter 2,9 % (typisch A-Städte / Spitzenlagen)

**Marktübliche Spannen (Deutschland, März 2026):**
- A-Städte (München, Hamburg, Frankfurt, Berlin): Faktor 25–35 (je nach Teilmarkt und aktueller Zinskorrektur)
- B-Städte (Hannover, Nürnberg, Dresden, Leipzig): Faktor 20–28
- C/D-Städte und ländliche Lagen: Faktor 12–20

**Hinweis:** Nach dem Zinsanstieg 2022–2023 haben Kaufpreisfaktoren in vielen Märkten korrigiert. Aktuelle Faktoren immer mit aktuellen Marktquellen verifizieren.

---

## Brutto- vs. Nettomietrendite

### Bruttomietrendite

```
Bruttomietrendite = Jahresnettokaltmiete / Kaufpreis × 100
```

Schnelle Näherung, berücksichtigt keine Kaufnebenkosten und keine laufenden Kosten.

### Nettomietrendite (Nettorendite)

```
Nettomietrendite = (Jahresnettokaltmiete − nicht umlegbare Kosten) / (Kaufpreis + Kaufnebenkosten) × 100
```

**Kaufnebenkosten (Ankaufskosten):**
- Grunderwerbsteuer: 3,5–6,5 % (je nach Bundesland)
- Notarkosten + Grundbucheintragung: ca. 1,5–2 %
- Maklergebühren: 0–3,57 % (nach Maklerprovisionaufteilung)
- Gesamt Nebenkosten: typisch 8–12 %

**Nicht umlegbare Kosten:**
- Instandhaltungsrücklage (nicht umlagefähig nach BetrKV)
- Hausverwaltungsgebühren Sondereigentum
- Leerstandskosten
- Steuerberatung

**Praxisregel:** Nettomietrendite liegt typisch 1–2 Prozentpunkte unter Bruttomietrendite.

---

## Cashflow-Modellierung

Vollständige Analyse auf Monatsbasis:

### Einnahmen
- Nettokaltmiete (Ist-Miete)
- Ggf. Betriebskostenvorauszahlungen (durchlaufend, irrelevant für Cashflow)

### Ausgaben (nicht umlegbar)
- **Zins + Tilgung** (Annuität)
- Hausverwaltung: ~5 % Nettokaltmiete
- **Instandhaltungsrücklage:** Faustformel Peters'sche Formel oder pauschale 1–1,5 €/qm/Monat (Altbau: 2 €+)
- **Leerstandsquote:** Puffer 5–8 % der Jahresnettomiete
- Nicht umlegbare Betriebskosten (Grundsteuer bei Leerstand, Versicherungsanteile)
- WEG-Hausgeld: Anteil nicht umlegbar (Rücklage, Verwaltung)

### Steuerwirkung
- Steuerliche Einkünfte = Mieteinnahmen − AfA − Zinsen − Werbungskosten
- Bei negativem steuerlichem Ergebnis: Steuererstattung (Verrechnung mit anderen Einkunftsarten)
- Nach-Steuer-Cashflow berücksichtigt Steuererstattung oder -nachzahlung

**Cashflow-Formel:**
```
Cashflow = Mieteinnahmen − Annuität − Verwaltung − Instandhaltung − Leerstand − nicht umlegbare Kosten ± Steuereffekt
```

---

## Mietsteigerungsannahmen

In der Cashflow-Projektion über 10–20 Jahre:
- Historische Mietsteigerung DE: ca. 2–3 % p.a. (Städte höher, Peripherie niedriger)
- **Mietpreisbremse** in angespannten Märkten begrenzt Neuvermietungsmieten (§556d BGB)
- **§558 BGB (Vergleichsmietenerhöhung):** max. 20 % in 3 Jahren (15 % in angespannten Märkten)
- **Indexmiete (§557b BGB):** Miete koppelt automatisch an VPI-Index (keine Kappungsgrenze, aber nur bei ausdrücklicher Vereinbarung)
- **Staffelmiete (§557a BGB):** Vorab festgelegte Steigerungen

---

## Standortanalyse

### Makrolage
- Bevölkerungsentwicklung (Statistisches Bundesamt, Prognos-Studie)
- Wirtschaftliche Entwicklung (BIP, Arbeitslosenquote)
- Infrastruktur (Bahnanbindung, Autobahn, Flughafen)
- Hochschulstandort (stabile Nachfrage)

### Mikrolage
- ÖPNV-Anbindung
- Versorgungsinfrastruktur (Supermarkt, Arzt, Schule)
- Sozialstruktur des Quartiers
- Lärmbelastung, Umgebungsbebauung
- Sanierungsgebiete oder Aufwertungstrends

### Marktpositionierung
- Mietpreisspiegel (lokaler Mietspiegel, qualifizierter Mietspiegel)
- Verhältnis Ist-Miete zu ortsüblicher Vergleichsmiete (Mieterhöhungspotenzial)
- Leerstandsquote im Mikromarkt

---

## Marktwert-Tracking: Datenquellen

| Quelle | Datentyp | Nutzung |
|---|---|---|
| **ImmoScout24** | Angebots-/Kaufpreise, Mietpreise | Aktuelles Marktgeschehen, Inserate |
| **Sparkasse Immobilienmarktbericht** | Regionaler Marktbericht | Jährliche Überblicke nach PLZ |
| **Homeday Preisatlas** | Automatisiertes Wertgutachten | Schnellbewertung per Adresse |
| **BORIS** (Bodenrichtwert-IS) | Bodenrichtwerte je Bundesland | Grundlage für Kaufpreisaufteilung, BewG |
| **Gutachterausschüsse** | Kaufpreissammlungen, Marktberichte | Belastbarste Datenbasis, oft kostenpflichtig |
| **empirica-systeme** | Transaktionsdaten | Professionelle Analysen |
| **vdp-Immobilienpreisindex** | Aggregierter Preisindex | Trendanalyse |

### BORIS – Bodenrichtwert-Informationssystem
- Länderspezifisch (z.B. BORIS-BW, BORIS NRW, BORIS-plus Hamburg)
- Kostenlos zugänglich
- Bodenrichtwert je qm Grundstücksfläche nach Nutzungsart und Lage
- Maßgeblich für steuerliche Kaufpreisaufteilung (Nachweis gegenüber FA)

---

## qm-Preis als Näherungswert

Beim schnellen Marktvergleich gilt der **Preis je Quadratmeter Wohnfläche** als einfachste Kennzahl.

**Vorsicht:** qm-Preis allein ist unzureichend ohne Kontext:
- Altbau vs. Neubau (stark unterschiedlich)
- Ausstattungsstand
- Grundrissqualität (kompakter Grundriss = höherer qm-Preis erzielbar)
- Etage, Lage im Gebäude

**Besser:** qm-Preis + Kaufpreisfaktor + Leerstandsrisiko + Sanierungsstau = vollständiges Bild.
