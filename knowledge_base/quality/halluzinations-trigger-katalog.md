# Halluzinations-Trigger-Katalog — Bekannte Fehlerquellen
*Wissensstand: März 2026 — Wird quartalsweise aktualisiert*
*Chunk-ID: quality/halluzinations-trigger-katalog*
*Relevante Agenten: Validator*

## Sofort-Abbruch-Trigger (🔴 KRITISCH)

Wenn die Empfehlung eines Fachagenten eine dieser Phrasen/Aussagen enthält, ist die Kernaussage FALSCH:

### Steuerrecht
| Trigger-Phrase | Warum falsch | Korrekt | Seit wann |
|---------------|-------------|---------|-----------|
| "§6 AStG: zinslose Stundung bis zur Veräußerung" | ATAD-UmsG seit 01.01.2022 | 7 Jahresraten, zinsfrei, auf Antrag | 01.01.2022 |
| "§6 AStG: unbefristete Stundung bei EU/EWR" | Alte Rechtslage (vor 2022) | 7 Jahresraten auch bei EU/EWR | 01.01.2022 |
| "Portugal NHR für neue Antragsteller" | NHR abgeschafft | IFICI-Nachfolger, nur Tech/R&D/AI | 01.01.2024 |
| "Thailand: Einkommen im Folgejahr einführen = steuerfrei" | Loophole geschlossen | Seit 01.01.2024 alle Remittierungen im Zulaufsjahr steuerpflichtig | 01.01.2024 |
| "UK Non-Dom Remittance Basis" für neue Residenten | Regime abgeschafft | FIG-Regime: 4 Jahre Befreiung für Neu-Residenten | 06.04.2025 |
| "Krypto-Gewinne nach 1 Jahr automatisch steuerfrei weltweit" | Nur in DE (§23 EStG) | Jurisdiktionsabhängig — in vielen Ländern KEINE Haltefrist | — |

### Immigration
| Trigger-Phrase | Warum falsch | Korrekt | Seit wann |
|---------------|-------------|---------|-----------|
| "Spanien Golden Visa Immobilien-Track" | Abgeschafft | Immobilien-Track seit 03.04.2025 nicht mehr verfügbar | 03.04.2025 |
| "Dominica CBI ab $100.000" | Preiserhöhung | Min. $200.000 seit 01.01.2022 | 01.01.2022 |
| "Grenada CBI: 3 Monate Bearbeitung" | Zu optimistisch | Real: 4-6 Monate (Due Diligence dauert länger) | — |
| "Irland Golden Visa" | Programm beendet | Seit 2023 nicht mehr verfügbar | 02.2023 |

### Immobilien
| Trigger-Phrase | Warum falsch | Korrekt | Seit wann |
|---------------|-------------|---------|-----------|
| "Degressive AfA" ohne §7 Abs. 5a Kontext | Existiert NUR für Neubauten ab 10/2023 | §7 Abs. 5a: 5% nur für Neubauten, Baubeginn 01.10.2023-30.09.2029 | 04.2024 |
| "GbR kann Immobilien im Grundbuch halten" ohne eGbR | MoPeG seit 2024 | Nur eingetragene GbR (eGbR) kann ins Grundbuch | 01.01.2024 |

### Corporate
| Trigger-Phrase | Warum falsch | Korrekt | Seit wann |
|---------------|-------------|---------|-----------|
| "ATAD III ist in Kraft" | Politisch blockiert | Seit 2023 im EU-Rat blockiert, kein Beschlusstermin | 2023 |
| "UAE: 0% Corporate Tax" (pauschal) | CT seit 2023 | 9% CT ab 375.000 AED; Free Zone: 0% nur für Qualifying Income | 01.06.2023 |
| "US LLC braucht keine US-Meldungen" | Form 5472 Pflicht! | Form 5472 (informatorisch), $25.000 Strafe bei Verstoß | — |

## Warnsignal-Trigger (🟡 PRÜFEN)

| Signal | Aktion |
|--------|--------|
| Confidence 🟢 90%+ bei Zielland-Programmstatus | Prüfen: Programme ändern sich häufig → wirklich 90%? |
| Konkrete EUR-Beträge ohne [VERIFY] | Prämien, Gebühren, Kosten ändern sich jährlich → [VERIFY] erzwingen |
| "Steuerfrei" ohne Jurisdiktions-Angabe | In welchem Land steuerfrei? DE? Zielland? Beides? → Klarstellung |
| Keine [AFFECTS:]-Tags bei Strukturempfehlung | Cross-Domain-Impact ignoriert → zurückweisen |
| Keine SV-Implikation genannt (Tax Agent) | Pflichtfeld — auch wenn "keine Auswirkung" → zurückweisen |
| BFH-Aktenzeichen ohne "BFH" + Senat + Nummer | Wahrscheinlich halluziniert → [VERIFY: Fundstelle unsicher] |
| "Grundsätzlich" oder "in der Regel" ohne Ausnahmen | Zu vage — welche Ausnahmen? → Nachschärfung verlangen |

## Domain-spezifische Halluzinations-Muster

### Tax Agent — Häufige Fehler
- Falsche §-Nummern (§6 AStG Abs. 3 statt Abs. 4 n.F.)
- Verwechslung Stundung (alt) vs. Ratenzahlung (neu)
- Progressionsvorbehalt vergessen bei DBA-Freistellung
- SV-Implikation komplett weggelassen

### Immobilien Agent — Häufige Fehler
- Degressive AfA auf Bestandsimmobilien anwenden (nur Neubau!)
- Spekulationsfrist bei GmbH-Immobilien erwähnen (gibt es nicht — GmbH hat keine Spekulationsfrist)
- KfW-Programme als "verfügbar" bezeichnen ohne [VERIFY] (ändern sich quartalsweise)

### Immigration Agent — Häufige Fehler
- Veraltete CBI-Preise (Dominica $100k, Grenada alte Preise)
- Offizielle Bearbeitungszeiten als realistisch darstellen (immer 1.5x Faktor)
- Visa-Programme als "aktiv" bezeichnen die eingestellt wurden

### Corporate Agent — Häufige Fehler
- Estland e-Residency als Substanz-Ersatz darstellen (ist es NICHT)
- US LLC "keine Steuerpflicht" ohne Hinweis auf Form 5472
- "Nominee Director = echte Geschäftsleitung" (Finanzamt sieht das anders)

### Wealth Agent — Häufige Fehler
- Vorabpauschale-Basiszins von letztem Jahr verwenden (ändert sich jährlich!)
- "ETF-Gewinne sind nach 1 Jahr steuerfrei" (FALSCH — nur Krypto/Gold, nicht ETFs in DE)
- InvStG Teilfreistellung falsch anwenden (30% Aktien, 15% Misch, 60% Immobilien)

## Aktualisierungspflicht

Dieser Katalog MUSS aktualisiert werden bei:
- Neuer Gesetzesänderung (sofort)
- Neues BFH-Urteil mit Praxisrelevanz (innerhalb 1 Monat)
- Programmänderung CBI/RBI (sofort)
- Quartalsweisem Review (mindestens 4x/Jahr)
