# Jurisdiktions-Kostenmatrix — Gründung, Betrieb & Substanz
*Wissensstand: März 2026*
*Chunk-ID: corporate/jurisdiktions-kostenmatrix*
*Relevante Agenten: Corporate-Agent, CFO-Agent, Tax-Agent*

## Kostenvergleich pro Jurisdiktion [VERIFY: Kosten ändern sich jährlich]

### Gründungskosten (einmalig)

| Jurisdiktion | Rechtsform | Gründungskosten | Mindestkapital | Timeline | Hinweis |
|-------------|-----------|----------------|---------------|----------|---------|
| DE | GmbH | 3.000-5.000€ | 25.000€ (12.500€ bei Gründung) | 4-8 Wochen | Notar + Handelsregister |
| DE | UG (haftungsbeschränkt) | 500-1.500€ | 1€ (aber 25% Rücklage) | 4-6 Wochen | Günstig, aber Rücklagenpflicht |
| UAE (Free Zone) | FZE/FZ-LLC | 5.000-15.000€ | 0-50.000 AED je nach Zone | 1-3 Wochen | Schnell, aber Zonen-abhängig |
| UAE (Mainland) | LLC | 8.000-20.000€ | Kein Minimum seit 2021 | 2-4 Wochen | Local Sponsor nicht mehr nötig (seit 2021) |
| Zypern | Ltd | 2.500-5.000€ | 1.000€ typisch | 2-4 Wochen | EU-Mitglied, DBA-Netzwerk |
| Malta | Ltd | 3.000-6.000€ | 1.165€ (20% eingezahlt) | 3-5 Wochen | Refund-System komplex |
| Estland | OÜ | 1.000-2.500€ | 2.500€ (nicht sofort nötig) | 1-2 Wochen (e-Residency) | Schnell, aber Substanz-Risiko! |
| Irland | Ltd | 2.000-4.000€ | 1€ | 2-3 Wochen | 12.5% CT, IP-Box 6.25% |
| UK | Ltd | 500-1.500€ | 1 GBP | 1-2 Tage (online!) | Schnellste Gründung, aber Brexit |
| US (Wyoming) LLC | LLC | 400-800€ | 0 USD | 1-2 Wochen | Disregarded Entity möglich |
| US (New Mexico) LLC | LLC | 300-600€ | 0 USD | 1-2 Wochen | Maximale Anonymität |
| Georgien (VZP) | LLC | 500-1.500€ | 0 GEL | 1-2 Tage | Extrem schnell + günstig |
| Paraguay | SA/SRL | 1.000-3.000€ | Minimal | 2-4 Wochen | Territorial Tax, aber Banking schwierig |
| Andorra | SL | 3.000-6.000€ | 3.000€ | 3-6 Wochen | Residenz-Anforderung! |

### Laufende Jahreskosten

| Jurisdiktion | Buchhaltung | Audit-Pflicht | Registered Agent | Compliance | Substanz-Minimum | GESAMT/Jahr |
|-------------|-----------|-------------|----------------|-----------|-----------------|------------|
| DE GmbH | 2.000-5.000€ | Ab 12M€ Umsatz | — | IHK ~150€ | Büro inkl. | 2.500-5.500€ |
| UAE Free Zone | 1.500-4.000€ | Ja (ab 2023 CT) | — | Lizenz-Erneuerung 3-8k€ | Flexi-Desk ~3-6k€ | 6.000-15.000€ |
| Zypern Ltd | 2.000-4.000€ | Ja (immer) | Ja (~500€) | Levy 350€ | Büro ~3-6k€ | 6.000-11.000€ |
| Malta Ltd | 2.500-5.000€ | Ja (immer) | Ja (~600€) | ~500€ | Büro ~4-8k€ | 8.000-14.000€ |
| Estland OÜ | 500-2.000€ | Nur >Schwelle | — | Registrierungsgebühr | Virtuell möglich | 1.000-3.000€ |
| US LLC (WY) | 200-800€ | Nein | Registered Agent ~100€ | Form 5472 ~200€ | Keine (disregarded) | 500-1.200€ |
| Georgien VZP | 300-1.000€ | Nein (<Schwelle) | — | VZP-Erneuerung ~200€ | Lokal Mitarbeiter seit 2022! | 1.500-4.000€ |
| Irland Ltd | 2.000-4.000€ | Ab Schwelle | Ja (~400€) | CRO ~20€ | Büro + Director ~5-10k€ | 7.500-14.500€ |

### Substanz-Mindestkosten (was braucht man WIRKLICH?)

| Jurisdiktion | Büro | Personal | Board Meetings | Bankaktivität | Gesamt Substanz/Jahr |
|-------------|------|---------|---------------|-------------|-------------------|
| UAE Free Zone | Flexi-Desk 3-6k€ | Visa-Sponsor nötig | Nicht formal nötig | Aktiv | 5.000-10.000€ |
| Zypern | Büro 3-6k€ | 1 Mitarbeiter empf. (~15k€) | 4x/Jahr empf. | Aktiv + lokal | 20.000-25.000€ |
| Malta | Büro 4-8k€ | Director + Secretary (~8k€) | 4x/Jahr Pflicht | Aktiv | 15.000-20.000€ |
| Georgien VZP | Büro 1-2k€ | Seit 2022: lokaler MA (~3-6k€) | Nicht formal | Aktiv | 5.000-10.000€ |
| US LLC | KEINE (disregarded) | KEINE | KEINE | Aktiv (Mercury/Relay) | ~500€ |
| Irland | Büro 5-10k€ | Director (kann nominee) | 1x/Jahr AGM | Aktiv | 10.000-18.000€ |

**Faustregel:** Je niedriger die Steuer, desto höher die Substanz-Kosten. US LLC ist die Ausnahme (0% Steuer + 0 Substanz bei Disregarded Entity).

## Entscheidungsbaum: Welche Struktur für welches Szenario?

```
AI-Consulting, DACH-Kunden, Single, plant Wegzug:

Frage 1: Wo wirst du wohnen?
├── UAE → UAE Free Zone LLC (+ US LLC für Non-UAE-Kunden)
├── EU (PT/CY/MT) → Lokale Ltd (+ evtl. IP-Holding in Irland)
├── Georgien → Georgien VZP LLC (+ US LLC für Zahlungsabwicklung)
└── Paraguay/Andorra → Lokale Firma + US LLC

Frage 2: Brauchst du EU-Marktzugang?
├── JA → EU-Firma nötig (Zypern/Malta/Irland) für EU AI Act Compliance
└── NEIN → Außer-EU günstiger (UAE, Georgien, US LLC)

Frage 3: Wieviel Substanz-Aufwand akzeptabel?
├── Minimal → US LLC (disregarded) + lokale Firma im Wohnsitzland
├── Moderat → UAE Free Zone oder Georgien VZP
└── Full Substance → Zypern Ltd oder Irland Ltd (teurer, aber bullet-proof)
```
