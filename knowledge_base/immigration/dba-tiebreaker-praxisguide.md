# DBA Tie-Breaker (Art. 4) — Praxis-Guide
*Wissensstand: März 2026*
*Chunk-ID: immigration/dba-tiebreaker-praxisguide*
*Relevante Agenten: Immigration-Agent, Tax-Agent*

## Das Problem: Doppelte steuerliche Ansässigkeit

Wenn du in ZWEI Ländern als steuerlich ansässig giltst (z.B. 183+ Tage in beiden durch Visa-Stacking oder Übergangsjahr), bestimmt das DBA (Doppelbesteuerungsabkommen) Art. 4 die **eine** Ansässigkeit.

## Art. 4 DBA — Tie-Breaker-Kaskade

Die Prüfung erfolgt **stufenweise** — sobald eine Stufe eine klare Zuordnung ergibt, STOP:

```
Stufe 1: STÄNDIGE WOHNSTÄTTE (permanent home)
├── In welchem Land hast du eine Wohnung, die dir DAUERHAFT zur Verfügung steht?
├── Mietwohnung ODER Eigentum ODER dauerhaft verfügbare Unterkunft
├── Hotel/Airbnb zählen NICHT (nicht dauerhaft)
├── → Nur in Land A Wohnung? → Ansässig in Land A. STOP.
└── → In BEIDEN Ländern? → Weiter zu Stufe 2.

Stufe 2: MITTELPUNKT DER LEBENSINTERESSEN (center of vital interests)
├── Wo sind deine persönlichen UND wirtschaftlichen Beziehungen enger?
├── Persönlich: Familie, Partner, Freunde, Vereine, soziale Bindungen
├── Wirtschaftlich: Arbeit, Geschäft, Investments, Bankkonten, Immobilien
├── → Eindeutig in Land A? → Ansässig in Land A. STOP.
└── → Nicht eindeutig? → Weiter zu Stufe 3.

Stufe 3: GEWÖHNLICHER AUFENTHALT (habitual abode)
├── In welchem Land hältst du dich HÄUFIGER auf?
├── Alle Aufenthalte zählen (nicht nur 183-Tage-Regel)
├── → Mehr Tage in Land A? → Ansässig in Land A. STOP.
└── → Gleich viele Tage? → Weiter zu Stufe 4.

Stufe 4: STAATSANGEHÖRIGKEIT (nationality)
├── → Staatsangehörigkeit von Land A? → Ansässig in Land A. STOP.
└── → Keine oder beide? → Weiter zu Stufe 5.

Stufe 5: VERSTÄNDIGUNGSVERFAHREN (mutual agreement)
└── Finanzämter beider Länder verhandeln → Kann JAHRE dauern. VERMEIDEN!
```

## Fallbeispiel: Mandant im Übergangsjahr

**Szenario:** Deutscher, lebt bis Juni in DE, zieht im Juli nach UAE (Golden Visa). In DE verbleibt vermietete Immobilie.

| Stufe | Prüfung | Ergebnis |
|-------|---------|---------|
| 1. Ständige Wohnstätte | DE: Ja (Immobilie, aber vermietet → NICHT als eigene Wohnung verfügbar). UAE: Ja (Mietwohnung ab Juli) | **Nur UAE** (DE-Wohnung vermietet = nicht verfügbar) |
| **Ergebnis** | → Ansässig in UAE ab Umzugsdatum | STOP bei Stufe 1 |

**Achtung:** Wenn DE-Wohnung NICHT vermietet wäre (leersteht, möbliert, jederzeit nutzbar) → Stufe 1 = BEIDE → Stufe 2 nötig!

## Fallbeispiel: Visa-Stacking PT + UAE

**Szenario:** Portuguese Golden Visa (Wohnung in Lissabon) + UAE Golden Visa (Wohnung in Dubai). Verbringt 120 Tage PT, 180 Tage UAE, 65 Tage Reisen.

| Stufe | Prüfung | Ergebnis |
|-------|---------|---------|
| 1. Ständige Wohnstätte | PT: Ja (Eigentum). UAE: Ja (Mietwohnung) | Beide → weiter |
| 2. Mittelpunkt Lebensinteressen | Wirtschaftlich: AI-Business operiert aus UAE (Free Zone), Banking UAE, Kunden global. Persönlich: Freunde in PT, Golf in UAE, Familie in DE | Wirtschaftlich = UAE dominant → **UAE** |
| **Ergebnis** | → Ansässig in UAE | STOP bei Stufe 2 |

## Dokumentation: "Center of Vital Interests" beweisen

Wenn es auf Stufe 2 ankommt, brauchst du DOKUMENTATION:

### Wirtschaftliche Bindungen (für Wunsch-Land sammeln)
- [ ] Firmen-Registrierung im Wunsch-Land (Certificate of Incorporation)
- [ ] Geschäftskonto im Wunsch-Land (Kontoauszüge mit regelmäßiger Aktivität)
- [ ] Kundenverträge die vom Wunsch-Land aus bedient werden
- [ ] Steuererklärung im Wunsch-Land eingereicht
- [ ] Büro-Mietvertrag / Coworking-Mitgliedschaft im Wunsch-Land

### Persönliche Bindungen
- [ ] Mietvertrag / Eigentum im Wunsch-Land
- [ ] Lokale Mitgliedschaften (Golf-Club, Fitness, Vereine)
- [ ] Lokale Arzt-/Zahnarztregistrierung
- [ ] Führerschein im Wunsch-Land (wenn möglich)
- [ ] Bankkonten für persönliche Ausgaben im Wunsch-Land
- [ ] Soziale Aktivitäten (Meetups, Expat-Gruppen, datierbare Belege)

**Goldene Regel:** Je MEHR Belege für das Wunsch-Land, desto stärker die Position. Finanzämter bewerten die "Gesamtumstände".

## Länder OHNE DBA mit Deutschland — Doppelbesteuerungsrisiko!

| Land | DBA mit DE? | Risiko | Mitigation |
|------|-----------|--------|-----------|
| Paraguay | **Nein** | Hoch — potenziell Doppelbesteuerung | Paraguay hat Territorial Tax → in Praxis geringes Risiko für Auslandseinkommen |
| El Salvador | **Nein** | Mittel | Territorial Tax → ähnlich wie Paraguay |
| Georgien | **Nein** (nur Investitionsschutzabkommen) | Mittel-Hoch | VZP 0% CIT hilft, aber persönliche ESt unklar [VERIFY] |
| Andorra | **Nein** (in Verhandlung seit 2015) [VERIFY] | Mittel | 10% Flat Tax, unilaterale Anrechnung möglich |
| Vanuatu | **Nein** | Niedrig | 0% ESt in Vanuatu → kein Doppelbesteuerungskonflikt |
| UAE | **Ja** (seit 2011) | Niedrig | DBA klärt Ansässigkeit |
| Portugal | **Ja** | Niedrig | Standard-DBA |
| Zypern | **Ja** | Niedrig | Standard-DBA |
| Malta | **Ja** | Niedrig | Standard-DBA |
| Thailand | **Ja** | Niedrig | Standard-DBA (aber komplex wegen Remittance-Reform) |

**Bei Ländern OHNE DBA:** Unilaterale Anrechnung (§34c EStG) oft möglich — DE rechnet ausländische Steuer auf DE-Steuerschuld an. Aber: Erfordert Nachweis der gezahlten ausländischen Steuer.

## Strategische Empfehlung

1. **IMMER DBA-Land bevorzugen** wenn steuerlich ähnlich attraktiv → Rechtssicherheit
2. **Bei Nicht-DBA-Ländern:** Territorial Tax = geringes Risiko (kein Auslandseinkommen besteuert) → Doppelbesteuerung in Praxis selten
3. **Wegzugsjahr:** BESONDERS kritisch — halbes Jahr DE + halbes Jahr Zielland → Tie-Breaker genau prüfen
4. **Steuerliche Ansässigkeitsbescheinigung (CoR)** im Zielland SOFORT beantragen → offizielles Dokument für DE-Finanzamt
5. **Nie beide Wohnungen "verfügbar" halten** — DE-Wohnung vermieten oder aufgeben, sonst Stufe 1 = "beide"
