# Besteuerung digitaler Einkünfte — AI, SaaS, Consulting
*Wissensstand: März 2026*
*Chunk-ID: tax/besteuerung-digitaler-einkuenfte*
*Relevante Agenten: Tax Architect, Struktur-Berater, Krypto-Spezialist*

## Wo entstehen digitale Einkünfte steuerlich?

Die zentrale Frage für digitale Unternehmer ist: **Wo ist die steuerliche Quelle der Einkünfte?** Dies bestimmt, welcher Staat Besteuerungsrecht hat.

**Maßgebliche Anknüpfungspunkte:**
1. **Ansässigkeit des Leistenden:** Wo ist das Unternehmen steuerlich ansässig?
2. **Ort der Leistungserbringung:** Wo wird die Dienstleistung tatsächlich erbracht?
3. **Ort des Kunden:** Wo ist der Kunde ansässig?
4. **Betriebsstätte:** Hat der Leistende eine Betriebsstätte im Kundenstaat?

---

## AI-Consulting und IT-Beratung: Einordnung

**AI-Consulting-Einkünfte** (z.B. Implementierung von KI-Systemen, Prozessoptimierung, Training von Modellen):

**Einordnung nach deutschem EStG:**
- Selbstständig tätige Personen: §18 EStG (freiberufliche oder gewerbliche Einkünfte)
- GmbH: §15 EStG (gewerbliche Einkünfte auf GmbH-Ebene)

**DBA-Einordnung:**
- Art. 7 OECD-MA: **Unternehmensgewinne** → Besteuerung im Ansässigkeitsstaat des Unternehmens
- Ausnahme: Wenn im Kundenstaat eine **Betriebsstätte** (Art. 5 OECD-MA) besteht
- Betriebsstätte entsteht: Festes Büro im Kundenstaat, oder Dienstleistungen über 183 Tage im Kundenstaat, oder Abhängiger Vertreter

**Konsequenz:** AI-Consulting aus dem Ausland an deutsche Kunden → DBA-Freistellung der Einkünfte im Ausland (soweit DBA besteht), kein Besteuerungsrecht Deutschlands, solange keine deutsche Betriebsstätte.

---

## SaaS-Revenue: Lizenzgebühren vs. Dienstleistungen

Die steuerrechtliche Einordnung von SaaS-Einkünften ist entscheidend für die Quellensteuer-Frage.

**Lizenzgebühren (Royalties):**
- DBA Art. 12 OECD-MA: Quellensteuer im Kundenstaat möglich (typisch 0–15%)
- Wenn SaaS als Überlassung von Software = Lizenzgebühr → Quellensteuer droht
- Viele Länder erheben Quellensteuer auf "Software as License" für ausländische Anbieter

**Dienstleistungseinkünfte:**
- DBA Art. 7 OECD-MA: Nur Betriebsstätte im Kundenstaat löst Quellensteuer aus
- Wenn SaaS als Dienstleistung (Server, Hosting, Support) = Unternehmensgewinn → keine Quellensteuer ohne Betriebsstätte
- OECD-Tendenz: SaaS zunehmend als Dienstleistung, nicht als Lizenz eingestuft

**Praxistipp:** Vertragsgestaltung und Rechnungsstellung können die Einordnung beeinflussen. "Service Agreement" statt "Software License Agreement" bevorzugt, wenn Quellensteuer vermieden werden soll.

---

## Quellensteuer auf digitale Dienstleistungen nach Ländern

Quellensteuer fällt an, wenn ein Land auf Zahlungen für digitale Leistungen an ausländische Empfänger Steuer erhebt. Relevant beim Empfang von Zahlungen:

| Land (Kundenstaat) | Quellensteuer auf digitale Services | DBA-Reduktion möglich |
|---|---|---|
| Deutschland | 15,825% (Körperschaftsteuer + SolZ) auf Lizenzen für Drittstaaten | Ja, bei bestehendem DBA |
| Indien | 10–20% auf Software/Services (Eq. Levy zusätzlich) | Teilweise |
| USA | 30% FDAP auf Lizenzgebühren (ohne DBA) | Ja, DBA D-USA: 0% |
| Brasilien | 15–25% auf Software-Lizenzen | Partiell |
| China | 10% auf Lizenzen/Royalties | DBA-Reduktion auf 6–10% |
| UAE | 0% | — |
| UK | 0–20% (Lizenz abhängig von Typ) | DBA D-UK |

---

## Equalization Levy (Indien)

Indien erhebt den **Equalization Levy** auf:
- 6% auf B2B-Zahlungen für Online-Werbedienstleistungen durch ausländische Anbieter
- 2% auf E-Commerce-Umsätze ausländischer Anbieter an indische Verbraucher (seit 2020)

Dies betrifft auch deutsche/europäische AI- und SaaS-Unternehmen mit indischen Kunden.

---

## OECD Pillar One — Zuweisungsregeln für digitale Unternehmen

**Pillar One (Amount A)** soll das Besteuerungsrecht für den Residualgewinn großer digitaler Unternehmen teilweise dem **Marktland** (Kundenstaat) zuweisen — unabhängig von physischer Präsenz.

**Anwendungsbereich:** Unternehmen mit weltweitem Umsatz > 20 Mrd. EUR und Profitabilität > 10%

**Status (März 2026):** Multilaterales Abkommen noch nicht vollständig ratifiziert. Viele Länder haben Implementierung verschoben in Erwartung der finalen OECD-Lösung. Einzelne Länder haben eigene Digitalsteuern beibehalten (Frankreich, UK, Indien).

**Relevanz für Geo-Arbitrageure:** Pillar One betrifft Kleinunternehmer und mittelständische digitale Unternehmen **nicht** (20-Mrd.-Schwelle). Relevant nur für sehr große Konzerne.

---

## Einordnung nach Einkunftsart (Deutschland)

| Tätigkeit | Einkunftsart | Besonderheit |
|---|---|---|
| AI-Consulting (Freiberufler) | § 18 EStG | Kein Gewerbe, wenn wissenschaftlich/beratend |
| SaaS-Produkt (GmbH) | § 15 EStG (GmbH-Ebene) | Körperschaftsteuer 15% + GewSt |
| Online-Kurs / Info-Produkt | § 18 oder § 15 EStG | Hängt von Systematik ab |
| Affiliate Marketing | § 15 EStG (gewerblich) | Häufig gewerblich eingestuft |
| YouTube / Creator-Einkommen | § 18 oder § 15 EStG | Bei regelmäßiger Tätigkeit gewerblich |
| App-Store-Einnahmen | § 15 EStG | Lizenzgebühren oder Dienstleistung |

---

## Betriebsstättenrisiko für digitale Nomaden

Das größte Risiko für digitale Unternehmer, die von verschiedenen Ländern aus arbeiten:

**Home Office als Betriebsstätte:**
- Wenn ein Unternehmer dauerhaft von seinem Wohnsitz aus für die ausländische Gesellschaft arbeitet, kann dies eine Betriebsstätte im Wohnsitzland begründen
- Art. 5 Abs. 1 OECD-MA: "feste Einrichtung, durch die die Geschäftstätigkeit eines Unternehmens ganz oder teilweise ausgeübt wird"
- **OECD Commentary:** Home Office kann Betriebsstätte sein, wenn dauerhaft und unternehmenstypisch genutzt

**Verhinderung:**
- Nicht dauerhaft von einem Wohnsitz in einem hochsteuerlichen Land arbeiten
- Rotierendes Nomadentum kann Betriebsstätten-Permanenz unterbrechen
- Klare Trennung: Entscheidungen werden im Land der Gesellschaft getroffen

**Abhängiger Vertreter (Art. 5 Abs. 5 OECD-MA):**
- Person, die regelmäßig im Namen der Gesellschaft Verträge abschließt = Betriebsstätte
- Kritisch bei GmbH-Gesellschafter-Geschäftsführern, die im Ausland wohnen

---

## Geistiges Eigentum (IP) — Steuerliche Optimierung

**IP-Box-Regime:**
- Zypern: 2,5% effektiver Steuersatz auf IP-Einkünfte
- Irland: 6,25% auf KAD (Knowledge Development Box)
- Niederlande: 9% Innovation Box
- Luxemburg, Malta: ähnliche Regime

**IP-Verlagerung und Nexus-Prinzip (OECD BEPS Action 5):**
- IP-Einkünfte dürfen nur im Land begünstigt besteuert werden, in dem das IP tatsächlich entwickelt wurde (modified nexus approach)
- Reine IP-Holding-Gesellschaften ohne eigene F&E-Tätigkeit profitieren nicht von IP-Box-Regimen
