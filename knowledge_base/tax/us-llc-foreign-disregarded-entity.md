# US LLC als Foreign Disregarded Entity (Check-the-Box)
*Wissensstand: März 2026*
*Chunk-ID: tax/us-llc-foreign-disregarded-entity*
*Relevante Agenten: Tax Architect, Struktur-Berater*

## Grundkonzept: Check-the-Box-Election

Das US-amerikanische Steuerrecht ermöglicht es durch die sog. **Check-the-Box-Regulations** (Treasury Regulations §§ 301.7701-1 bis 301.7701-3), die steuerliche Behandlung einer Limited Liability Company (LLC) zu wählen:

**Single-Member LLC (SMLLC) — Standardbehandlung:**
- Automatisch als **Disregarded Entity (DE)** behandelt
- Steuerlich transparent: Die LLC existiert für US-Steuerzwecke nicht; alle Einkünfte gelten als direkte Einkünfte des Eigentümers
- Kein Check-the-Box-Formular notwendig (ist die Default-Einstellung)

**Multi-Member LLC:**
- Standard: Partnership (steuerlich transparent)
- Wahlmöglich: Corporation (steuerlich eigenständig)

**Foreign Disregarded Entity (FDE):** Wenn der Eigentümer einer Single-Member LLC **kein US-Steuersubjekt** ist (z.B. eine ausländische Person oder ausländische Gesellschaft), ist die LLC aus US-Sicht eine **Foreign Disregarded Entity** — sie existiert für US-Steuerzwecke nicht.

## Funktionsweise für Ausländer ohne US-Nexus

**Idealstruktur (keine US-Steuerpflicht):**
1. Ausländischer Unternehmer (z.B. paraguayischer Steuerresidenter, UAE-Resident) gründet SMLLC in Wyoming/New Mexico
2. LLC erbringt Dienstleistungen ausschließlich an **nicht-US-Kunden** aus dem Ausland
3. LLC hat kein US-Büro, keine US-Angestellten, keine US-Betriebsstätte
4. Keine US-Einkommensteuer fällig (kein "Effectively Connected Income", kein FDAP from US Sources)
5. Im Ansässigkeitsstaat des Eigentümers (z.B. Paraguay): 0% auf Auslandseinkommen → Gesamtsteuer: **0%**

**ETBUS-Test (Engaged in Trade or Business in the United States):**
- Nur wenn die LLC in den USA aktiv Geschäfte betreibt, entsteht US-Steuerpflicht
- Kriterien: US-Büro, US-Mitarbeiter, US-Kunden die vor Ort bedient werden
- Bloßes Vorhandensein eines US-Bankkontos oder einer US-Adresse = kein ETBUS

## Form 5472 — Informationsmeldepflicht

**Pflicht:** Foreign-owned (ausländisch gehaltene) Single-Member LLCs müssen jährlich **Form 5472** beim IRS einreichen. Dies ist eine **Informationsmeldung**, keine Steuerformular.

- Meldet Transaktionen zwischen der LLC und dem ausländischen Eigentümer (z.B. Kapitaleinlagen, Ausschüttungen, Darlehen)
- Gleichzeitig: **Form 1120** (Körperschaftsteuerformular) muss als "Pro Forma" eingereicht werden — auch wenn keine Steuer geschuldet wird
- **Deadline:** 15. April (verlängerbar bis 15. Oktober)
- **Strafe bei Nichteinreichung:** 25.000 USD pro versäumtem Formular

**Tipp:** Professionelle US-CPA oder spezialisierte Steuerberatung für Form 5472 empfohlen; Kosten ca. 500–1.500 USD/Jahr.

## Vorteile der US LLC

**Bankzugang:**
- US-Geschäftskonto bei US-Banken eröffenbar (Mercury, Relay, Brex, Bank of America)
- Keine FATF-Greylist-Problematik
- Deutlich einfacher als Bankzugang für Gesellschaften aus Entwicklungsländern

**Haftungsschutz:**
- LLC bietet beschränkte Haftung (wie GmbH in Deutschland)
- Vermögen des Eigentümers von Verbindlichkeiten der LLC getrennt

**Payment Processing:**
- Stripe, PayPal, Square akzeptieren US LLC problemlos
- Merchant Services einfach einzurichten

**Reputation:**
- US-Gesellschaft wird von internationalen Kunden als seriös wahrgenommen
- US-Adresse/Registrierung erhöht Vertrauen

## Risiken und kritische Punkte

**§ 7 AStG (Hinzurechnungsbesteuerung für deutsche Gesellschafter):**
- Bei deutschen Steuerresidenten als LLC-Eigentümer: LLC ist steuerlich transparent, Einkünfte direkt zugerechnet
- Aber: LLC als Disregarded Entity = keine eigenständige Gesellschaft → § 7 AStG betrifft Kapitalgesellschaften, nicht transparente Einheiten
- Wenn LLC als Corporation besteuert wird (nach C-Election): dann § 7 AStG relevant
- **Achtung:** Bei Verbleib in Deutschland: Einkünfte direkt als deutsche Einkünfte behandelt

**Betriebsstättenrisiko:**
- Wenn der Eigentümer die LLC von einem festen Ort in Deutschland aus betreibt → Betriebsstätte in Deutschland (§ 12 AO)
- Dann: normale deutsche Besteuerung der LLC-Einkünfte

**E-2 Treaty Investor Visum:**
- Deutschland und USA haben einen Bilateral Investment Treaty (Freundschaftsvertrag, 1956)
- Dieser ermöglicht das **E-2 Treaty Investor Visum** für Deutsche in den USA
- Investition in US-Unternehmen (LLC oder Corporation), aktive Mitarbeit
- Kein Weg zu Green Card, aber Aufenthaltsgenehmigung für Unternehmer

## State-Vergleich: Wyoming vs. New Mexico vs. Delaware

### Wyoming LLC
- **Anonymität:** Kein öffentliches Register der Mitglieder/Manager
- **Keine State Income Tax**
- **Annual Report Fee:** 60 USD/Jahr (oder 0,0002 * Vermögenswerte in Wyoming, Minimum 60 USD)
- Starker Haftungsschutz (Charging Order Protection)
- **Beliebteste Wahl** für ausländische Eigentümer ohne US-Aktivität
- Registered Agent erforderlich: ca. 50–150 USD/Jahr

### New Mexico LLC
- **Keine Annual Report Pflicht** (einzigartig in den USA)
- **Kein öffentliches Mitgliederregister**
- Sehr günstig: Einmalige Gründungsgebühr ca. 50 USD, kein Jahresbericht, kein Jahresentgelt
- Registered Agent erforderlich
- Gesamtkosten: ~150–200 USD/Jahr (nur Registered Agent)
- Ideal für kostenminimierte Strukturen

### Delaware LLC
- **Standard für US-VC und institutionelle Investoren** — bevorzugt bei Fundraising
- Gut entwickeltes Gesellschaftsrecht (Court of Chancery)
- State Income Tax: 0% für nicht in Delaware tätige Unternehmen
- Annual Franchise Tax: ab 300 USD/Jahr
- Anonymität: eingeschränkter als Wyoming/New Mexico

**Empfehlung für Geo-Arbitrageure:** Wyoming oder New Mexico für einfache Service-Strukturen. Delaware wenn US-Investoren oder institutionelle Partner geplant.

## AMIGOS Act (Anmerkung)

Der **AMIGOS Act** (Anonymity in Multi-member LLC Goes to Owner Identification Statute — hypothetischer Name) — **Achtung:** Es gibt Bestrebungen im US-Kongress, die Transparenz von LLCs zu erhöhen. Der **Corporate Transparency Act (CTA)** ist seit 01.01.2024 in Kraft und verlangt die Meldung von "Beneficial Owners" an das FinCEN (Financial Crimes Enforcement Network). Nach gerichtlichen Auseinandersetzungen 2024/2025 ist der CTA-Stand unklar; als Tendenz sind mehr Transparenzanforderungen zu erwarten.

**FinCEN Beneficial Owner Reporting:**
- Betrifft: LLC mit <20 Mitarbeitern und <5 Mio. USD Jahresumsatz
- Meldung: Name, Adresse, Ausweisnummer der wirtschaftlich Berechtigten
- **Nicht öffentlich zugänglich** (nur Strafverfolgung/Behörden)
- Aber: Zugang für Behörden inklusive Finanzamt im Rahmen Amtshilfe
