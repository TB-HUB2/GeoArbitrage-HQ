# Umsatzsteuer International — USt, VAT, GST im grenzüberschreitenden Kontext
*Wissensstand: März 2026*
*Chunk-ID: tax/umsatzsteuer-international*
*Relevante Agenten: Tax Architect, Compliance-Assistent*

## Reverse-Charge-Verfahren (§ 13b UStG)

Das **Reverse-Charge-Verfahren** (Steuerschuldumkehr) ist das zentrale Instrument bei grenzüberschreitenden B2B-Dienstleistungen innerhalb und außerhalb der EU.

**Grundprinzip:** Nicht der leistende Unternehmer (Rechnungssteller), sondern der **Leistungsempfänger** schuldet die Umsatzsteuer.

**Anwendungsbereiche (§ 13b UStG):**
- Sonstige Leistungen von Unternehmern außerhalb Deutschlands an deutsche Unternehmer (§ 13b Abs. 1 UStG)
- Bauleistungen (§ 13b Abs. 2 Nr. 4 UStG)
- Bestimmte Reinigungsleistungen
- Lieferungen von Gas, Elektrizität etc.

**Für Geo-Arbitrageure relevant:**
- Ausländischer Berater/SaaS-Anbieter stellt Rechnung an deutschen Unternehmer
- Rechnung ohne MwSt mit Hinweis "Reverse Charge / § 13b UStG"
- Deutscher Empfänger bucht selbst die MwSt (19%) als Vorsteuer und Umsatzsteuer
- Ergebnis: Cash-flow-neutral für deutschen Empfänger (Vorsteuer = Umsatzsteuer)

**B2C (Business-to-Consumer):** Kein Reverse Charge. Ausländischer Anbieter muss ggf. selbst USt registrieren.

## USt-Registrierung im Ausland

**Pflicht zur Registrierung besteht bei:**
1. Überschreiten von Lieferschwellen (innergemeinschaftlicher Fernverkauf)
2. Lagerung von Waren im Ausland (z.B. Amazon FBA)
3. Erbringung digitaler Dienstleistungen an Endverbraucher (B2C) ohne OSS

**Registrierungsschwellen (EU-Einheitsschwelle seit 2021):**
- EU-weite Schwelle: **10.000 EUR** für grenzüberschreitende B2C-Umsätze in andere EU-Staaten
- Über 10.000 EUR: OSS-Registrierung oder Einzelregistrierung in jedem Zielland

## One-Stop-Shop (OSS) — EU-Vereinfachung

Seit 01.07.2021 können EU-Unternehmer die **OSS-Regelung** nutzen:

**Funktionsweise:**
- Registrierung in nur einem EU-Mitgliedstaat (dem Ansässigkeitsstaat)
- Meldung und Zahlung aller B2C-Umsätze aus anderen EU-Ländern über eine einzige OSS-Erklärung
- Deutsche Unternehmer: OSS-Registrierung beim Bundeszentralamt für Steuern (BZSt)
- Quartalsweise Meldung

**Anwendungsbereich OSS:**
- Elektronisch erbrachte Dienstleistungen (Digital Services)
- Telekommunikation, Rundfunk, TV
- Innergemeinschaftlicher Fernverkauf von Waren

**IOSS (Import One-Stop-Shop):** Für Einfuhr von Waren mit Sachwert ≤ 150 EUR aus Drittländern.

## Digital Services VAT — Besonderheiten

**Digitale Dienstleistungen (§ 3a Abs. 5 UStG):** Elektronisch erbrachte Dienstleistungen (SaaS, Apps, Software-Downloads, Online-Kurse, Streaming) unterliegen besonderen USt-Regeln:

**B2C Digital Services:**
- Steuerpflichtig im Land des **Endkunden** (nicht des Lieferanten)
- EU-Anbieter: OSS Pflicht ab 10.000 EUR
- Drittlands-Anbieter (z.B. UAE, UK post-Brexit): Pflicht zur EU-VAT-Registrierung (oder OSSEU) wenn B2C in EU

**B2B Digital Services:**
- Reverse Charge: Empfänger schuldet VAT in seinem Land
- Kein Registrierungserfordernis des Lieferanten im Empfängerland

## VAT in wichtigen Zielländern

| Land | VAT-Satz (Standard) | Besonderheiten |
|---|---|---|
| UAE | 5% VAT | Seit 2018, B2B-Dienstleistungen für Export: 0% |
| Zypern | 19% VAT | EU-Mitglied, OSS anwendbar |
| Portugal | 23% VAT (Festland) / 16% (Azoren) | EU-Mitglied |
| UK | 20% VAT | Post-Brexit eigenes System, Making Tax Digital |
| Georgien | 18% VAT | VZP: 0% VAT auf IT-Export |
| Paraguay | 10% IVA | Auf paraguayische Leistungen/Waren |
| Schweiz | 8,1% MWST | Registrierungspflicht ab 100.000 CHF Umsatz weltweit |
| Singapur | 9% GST (seit 2024) | B2C Digital: Registrierungspflicht für Ausländer |

## Kleinunternehmerregelung (§ 19 UStG)

- Jahresumsatz bis 25.000 EUR (ab 01.01.2025 erhöht von 22.000 EUR): Befreiung von der USt-Pflicht
- Rechnungen ohne MwSt
- Keine Vorsteuerabzugsberechtigung
- **Neu ab 2025:** EU-Kleinunternehmerregelung: Kleinunternehmer können die Steuerbefreiung auch in anderen EU-Ländern nutzen (max. 100.000 EUR EU-weiter Umsatz)

## Umsatzsteuer nach Wegzug aus Deutschland

**Wegzug ins Ausland — deutsche USt-Pflicht:**
- Unternehmer, der Deutschland verlässt, bleibt für seine deutschen Kunden/Leistungsempfänger umsatzsteuerrechtlich relevant
- Verlegt der Unternehmer seinen Sitz ins Ausland, Deregistrierung beim deutschen Finanzamt erforderlich
- Deutsche Kunden erhalten Rechnungen ohne deutsche USt (Reverse Charge oder steuerfreie Ausfuhrleistung)

**USt-Nummer:** Bei Verlassen von Deutschland und keinerlei deutschem Nexus mehr → Entzug der deutschen USt-IdNr.

## Equalization Levy und Digitalsteuer

Verschiedene Länder haben eigene Digitalsteuern eingeführt:
- **Indien:** Equalization Levy (6% auf B2B-Zahlungen an ausländische E-Commerce-Plattformen)
- **Frankreich:** GAFA-Steuer (3% auf digitale Werbung und digitale Marktplätze)
- **UK:** Digital Services Tax (2% auf UK-Umsätze digitaler Plattformen)

**OECD Pillar One:** Soll langfristig nationale Digitalsteuern ersetzen; Einigung noch nicht vollständig umgesetzt (Stand März 2026).

## Praxis-Checkliste für digitale Unternehmer nach Wegzug

- [ ] Deregistrierung beim deutschen Finanzamt als umsatzsteuerpflichtiger Unternehmer
- [ ] USt-Registrierung im neuen Ansässigkeitsland (falls relevant)
- [ ] OSS-Prüfung für EU-B2C-Kunden aus neuem Ansässigkeitsland
- [ ] Rechnungsstellung auf neues Unternehmen umstellen
- [ ] Reverse-Charge-Hinweise auf Rechnungen an EU-Unternehmerkunden
- [ ] VAT-Registrierung in UK/Singapur prüfen bei B2C-Umsätzen dort
