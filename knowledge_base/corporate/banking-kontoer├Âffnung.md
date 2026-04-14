# Banking: Kontoeröffnung & Payment Processing pro Struktur
*Wissensstand: März 2026*
*Chunk-ID: corporate/banking-kontoeröffnung*
*Relevante Agenten: Corporate-Agent, Relocation-Agent*

## Neo-Banks für internationale Strukturen [VERIFY: Akzeptanzregeln ändern sich]

| Bank | Akzeptierte Strukturen | Eröffnungszeit | Dokumente | Kosten/Monat | Stärke |
|------|----------------------|---------------|----------|-------------|--------|
| Mercury (US) | US LLC, US Corp | 1-3 Tage | EIN, Articles, Pass, Adressnachweis | 0 USD (Free) | Stripe-Integration, API, SWIFT |
| Relay (US) | US LLC, US Corp | 1-5 Tage | EIN, Articles, Pass | 0 USD | Multi-Account, Team-Features |
| Wise Business | UK Ltd, EU-Firmen, US LLC | 1-3 Tage | Registration Docs, Director ID | ~5€ | Multi-Währung, günstige FX |
| Airwallex | AU/UK/EU/SG-Firmen | 3-7 Tage | Registration Docs, UBO | Variiert | Multi-Währung, China-Payments |
| Revolut Business | EU-Firmen, UK Ltd | 1-3 Tage | Registration Docs, UBO | 25-100€ | Multi-Währung, Karten |

### Traditionelle Banken

| Bank | Jurisdiktion | Akzeptierte Strukturen | Eröffnungszeit | Mindest-Einlage |
|------|-------------|----------------------|---------------|----------------|
| Emirates NBD | UAE | UAE Free Zone/Mainland LLC | 2-4 Wochen | 5.000-50.000 AED |
| Mashreq | UAE | UAE Free Zone/Mainland | 1-3 Wochen | 10.000 AED |
| Bank of Cyprus | Zypern | Zypern Ltd | 2-6 Wochen | 5.000€ |
| Hellenic Bank | Zypern | Zypern Ltd, EU-Firmen | 3-6 Wochen | 5.000€ |
| BOV (Bank of Valletta) | Malta | Malta Ltd | 4-8 Wochen (!) | 1.000€ |
| TBC Bank | Georgien | Georgien LLC/VZP | 1-3 Tage | 0 GEL |
| Bank of Georgia | Georgien | Georgien LLC | 1-3 Tage | 0 GEL |

## Häufige Ablehnungsgründe & Remedies

| Ablehnungsgrund | Häufigkeit | Remedy |
|----------------|-----------|--------|
| "Offshore-Struktur ohne Substanz" | Sehr häufig | Substanz-Nachweis: Büro, Mitarbeiter, Board Minutes |
| "Krypto-/Tech-Business" → Enhanced Due Diligence | Häufig | Business Plan, AML-Policy, Compliance-Dokumente vorlegen |
| "FATF Grey List Land" (El Salvador, etc.) | Häufig | Alternative Jurisdiktion wählen ODER spezialisierten Banker |
| "Foreign-Owned LLC ohne US-Nexus" | Mittel | Mercury/Relay statt Traditionsbank; EIN + Form 5472 nachweisen |
| "Director nicht im Land ansässig" | Mittel | Nominee Director engagieren (→ Compliance-Chunk) |
| "Kein persönliches Erscheinen" | Selten (steigend) | Termin vor Ort einplanen; Power of Attorney nur als Backup |

**Tipp:** Immer 2 Banken parallel beantragen. Wenn Bank A ablehnt, verlierst du keine 4-6 Wochen.

## Payment Processing — PE-Implikationen

| Processor | Jurisdiktion | PE-Risiko? | Hinweis |
|-----------|-------------|-----------|---------|
| Stripe (Atlas) | US (Delaware) | PE in US nur bei US-Kunden | Für Non-US-Revenue: kein PE |
| Stripe (Europe) | IE/NL | PE in EU wenn EU-Kunden | Standard für EU-Business |
| PayPal Business | Kontositz-abhängig | Gering | Weniger Kontrolle, höhere Gebühren |
| Wise (Payments) | UK/EU | Gering | Kein eigentlicher Processor |
| LemonSqueezy | US | PE wie Stripe Atlas | SaaS-fokussiert |

**Faustregel:** Payment Processor Jurisdiktion ≠ automatisch PE. Aber: Regelmäßige, automatisierte Vertragsabschlüsse über Server in Land X → PE-Risiko in Land X. → Tax Architect konsultieren bei >50k€/Jahr Revenue über einen Processor.

## Kontoeröffnung: Schritt-für-Schritt (allgemein)

### 1. Vorbereitung (1-2 Wochen vorher)
- [ ] Firmendokumente zusammenstellen: Certificate of Incorporation, Memorandum/Articles, UBO-Erklärung
- [ ] Apostille/Beglaubigung falls nötig (manche Banken verlangen apostillierte Dokumente)
- [ ] Business Plan (1-2 Seiten): Geschäftsmodell, erwarteter Umsatz, Hauptkunden, Geldflüsse
- [ ] AML/KYC-Dokumente: Pass (alle Directors/UBOs), Adressnachweis (<3 Monate), Steuernummer
- [ ] Bankempfehlung (Reference Letter) von bestehender Bank (optional aber hilfreich)

### 2. Antrag (variiert 1 Tag bis 8 Wochen)
- Neo-Bank (Mercury, Wise): Online-Antrag, 1-3 Tage
- Traditionelle Bank: Termin in Filiale, 2-8 Wochen
- Enhanced Due Diligence (Krypto/Tech): +2-4 Wochen extra

### 3. Aktivierung
- [ ] Ersteinzahlung tätigen (Mindest-Einlage beachten)
- [ ] Online-Banking einrichten + 2FA aktivieren
- [ ] Testüberweisung senden (DE → Neue Bank, 100€)
- [ ] SWIFT/IBAN an Kunden/Partner kommunizieren
- [ ] Daueraufträge einrichten (Gehalt, Miete, Versicherungen)

### 4. Laufend
- [ ] Regelmäßige Transaktionen (mindestens monatlich) → verhindert "dormant account" Kündigung
- [ ] Kontoauszüge archivieren (für Steuer + Audit)
- [ ] AML-Review-Anfragen der Bank prompt beantworten (Verzögerung = Kontosperre!)
