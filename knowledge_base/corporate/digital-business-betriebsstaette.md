# Digital Business: Betriebsstätten-Risiken & EU AI Act Compliance
*Wissensstand: März 2026*
*Chunk-ID: corporate/digital-business-betriebsstaette*
*Relevante Agenten: Corporate-Agent, Tax-Agent*

## Betriebsstätte (PE) bei Digitalem Business — Grundlagen

Art. 5 OECD-Musterabkommen: Eine Betriebsstätte ist eine "feste Geschäftseinrichtung, durch die die Geschäftstätigkeit eines Unternehmens ganz oder teilweise ausgeübt wird."

### Wann entsteht KEINE PE?

| Situation | PE? | Begründung |
|-----------|-----|------------|
| Server in Land X (gehostet, keine Kontrolle) | Nein | Kein eigener Server, nur Miet-Infrastruktur |
| Website auf AWS/Azure in Frankfurt | Nein | Cloud-Hosting ≠ feste Geschäftseinrichtung |
| SaaS-Produkt mit Kunden in Land X | Nein (i.d.R.) | Kein physischer Nexus, nur digitale Lieferung |
| Gelegentliche Geschäftsreise nach DE | Nein | Nicht "fest" und nicht "regelmäßig" |
| Kundenmeeting per Zoom | Nein | Keine physische Präsenz |

### Wann entsteht PE? (VORSICHT!)

| Situation | PE? | Begründung |
|-----------|-----|------------|
| Home-Office in DE als Geschäftsführer der Auslandsfirma | **JA** | Feste Einrichtung + Geschäftstätigkeit |
| Eigener Server in DE (selbst betrieben) | **JA** | Feste Geschäftseinrichtung (Art. 5 Abs. 1) |
| Mitarbeiter in DE der Verträge abschließt | **JA** | Dependent Agent PE (Art. 5 Abs. 5) |
| Regelmäßige DE-Aufenthalte >183 Tage | **JA** | Gewöhnlicher Aufenthalt → Ansässigkeit |
| Weisungen an Auslandsfirma aus DE-Büro | **JA** | Ort der geschäftlichen Oberleitung |

**Goldene Regel:** KEINE operative Tätigkeit für die Auslandsfirma von Deutschland aus. Kein Home-Office, keine Vertragsunterschriften, keine Kundenakquise aus DE.

## AI-Agenten als "Dependent Agent PE"

### Aktuelle Rechtslage (März 2026)
Die Frage, ob ein **autonomer AI-Agent** als "Dependent Agent" im Sinne von Art. 5 Abs. 5 OECD-MA gelten kann, ist **rechtlich ungeklärt**.

**OECD-Diskussion:**
- Art. 5 Abs. 5: PE wenn eine Person "gewöhnlich Verträge abschließt oder gewöhnlich die wesentliche Rolle beim Abschluss von Verträgen spielt"
- Schlüsselfrage: Ist ein AI-Agent eine "Person"? Nach aktuellem Recht: **Nein** (nur natürliche/juristische Personen)
- ABER: OECD Tax Policy Working Group diskutiert seit 2024 Erweiterung des PE-Konzepts auf algorithmische Entscheidungsträger [VERIFY: Status]

**Praktische Risiken:**
- AI-Agent der autonom Preise setzt, Verträge generiert und Kunden onboardet → KEIN PE nach heutigem Recht
- ABER: Wenn AI von Person in DE gesteuert/trainiert/überwacht wird → Person ist der Agent, NICHT die AI
- **Konservative Position:** AI-Agents so behandeln als wären sie PE-neutral, ABER die Person die sie steuert darf nicht aus DE operieren

### Mitigation
1. Training/Fine-Tuning der AI: NICHT von DE aus (vom Sitzort der Firma)
2. Monitoring/Logging: Vom Sitzort oder automatisiert
3. Vertragsabschlüsse: Wenn AI Verträge schließt → Firma im Sitzland ist Vertragspartei
4. Dokumentation: "AI operiert autonom basierend auf Parametern die am Sitzort definiert wurden"

## SaaS-Business: Wo entsteht die Steuerpflicht?

### B2B (Unternehmen als Kunden)
| Kunde in | Besteuerung | Grundlage | Registrierungspflicht |
|----------|-----------|-----------|----------------------|
| EU (nicht Sitzland) | Reverse Charge (0% USt) | Art. 196 MwStSystRL | Keine USt-Registrierung nötig |
| Sitzland der Firma | Lokale USt | Inlandsleistung | Normale USt-Pflicht |
| Nicht-EU | Keine USt | Leistungsort = Kundenland | Keine |
| USA | Keine USt (Sales Tax komplex) | B2B generell befreit | State-spezifisch prüfen |

### B2C (Endverbraucher als Kunden)
| Kunde in | Besteuerung | Grundlage | Registrierungspflicht |
|----------|-----------|-----------|----------------------|
| EU (nicht Sitzland) | OSS (One-Stop-Shop) | USt des Kundenlandes | OSS-Registrierung im Sitzland |
| Sitzland | Lokale USt | Inlandsleistung | Normale USt-Pflicht |
| Nicht-EU | Keine USt | Leistungsort = Kundenland | Keine |

**Für AI-Consulting (B2B, DACH-Kunden):** Reverse Charge → KEINE USt in DE → keine deutsche USt-Registrierung nötig, solange nur B2B.

## EU AI Act — Implikationen für Firmenstruktur

### Gestaffelte Einführung (Erinnerung)
- **02.02.2025:** Verbotene KI-Praktiken → in Kraft
- **02.08.2025:** GPAI-Pflichten (>10^25 FLOPs) → in Kraft
- **02.08.2026:** High-Risk AI-Systeme → Pflichten greifen

### Jurisdiktions-Wahl und AI Act

| Frage | Implikation |
|-------|-----------|
| Firma in EU, Kunden in EU | EU AI Act voll anwendbar |
| Firma AUSSERHALB EU, Kunden in EU | EU AI Act anwendbar auf den Output (extraterritorial!) |
| Firma AUSSERHALB EU, keine EU-Kunden | EU AI Act nicht anwendbar |

**Konsequenz:** Auch eine UAE- oder Georgien-Firma die AI-Produkte an EU-Kunden liefert, muss EU AI Act compliant sein. Die Firmenstruktur ÄNDERT NICHT die AI Act Pflicht, wenn EU-Kunden bedient werden.

### High-Risk Implikationen (ab 02.08.2026)
Wenn dein AI-Produkt als HIGH-RISK klassifiziert wird:
- Konformitätsbewertung erforderlich
- Quality Management System (QMS) Pflicht
- CE-Kennzeichnung
- Eintrag in EU-AI-Datenbank
- Laufende Post-Market-Überwachung
- **PI/E&O-Versicherung mit expliziter AI-Deckung empfohlen** → [AFFECTS: INSURANCE]

### Typisches AI-Consulting Szenario
"AI-Business baut Custom LLM-Lösungen für DACH-Unternehmen" → Meist **Limited Risk** oder **Minimal Risk** (keine direkte Klassifizierung als High-Risk). ABER: Wenn Kunde das System für High-Risk-Zwecke einsetzt (z.B. HR-Screening, Kreditvergabe) → Haftung kann auf Entwickler durchschlagen.

**Empfehlung:** Vertraglich absichern: "Kunde ist verantwortlich für regulatorische Einordnung des Einsatzzwecks." + PI-Versicherung mit AI-Klausel. → [AFFECTS: INSURANCE, CORPORATE]
