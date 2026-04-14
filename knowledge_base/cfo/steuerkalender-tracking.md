# Steuerkalender & Fristen-Tracking
*Wissensstand: März 2026*
*Chunk-ID: cfo/steuerkalender-tracking*
*Relevante Agenten: CFO, Tax Architect*

## Deutsche Steuer-Vorauszahlungen

Quartalsweise fällig — IMMER 4 Wochen vorher warnen:

| Termin | Steuerart | Hinweis |
|--------|-----------|---------|
| 10. März | ESt, KSt, GewSt | Zusammen mit Soli |
| 10. Juni | ESt, KSt, GewSt | |
| 10. September | ESt, KSt, GewSt | |
| 10. Dezember | ESt, KSt, GewSt | Vor Jahresende! |

USt-Voranmeldung: Monatlich oder quartalsweise (je nach Umsatz), Frist: 10. des Folgemonats.

## Steuererklärungsfristen

- **Mit Steuerberater:** 28./29. Februar des Zweitfolgejahres (z.B. für VZ 2025 → 28.02.2027)
- **Ohne Steuerberater:** 31. Juli des Folgejahres
- **Zielland-Fristen:** Länderspezifisch — bei Wegzug BEIDE Fristen tracken (DE + Zielland)
- **Wegzugsjahr:** Besonders komplex — anteilige Steuererklärung DE + erste Erklärung Zielland

## Antragsfristen

| Antrag | Frist | Vorlauf |
|--------|-------|---------|
| DBA-Erstattung Quellensteuer | Variiert (oft 3-4 Jahre rückwirkend) | 8 Wochen vor Ablauf |
| Vorabbefreiung Quellensteuer | Vor Dividendenzahlung | 4-6 Wochen |
| KfW-Förderantrag | Vor Baubeginn / Kaufvertrag | 4 Wochen |
| Kirchensteuer-Austritt | Vor Wegzug | 4 Wochen (Standesamt-Termin) |
| §6 AStG Ratenzahlung-Antrag | Nach Wegzug | Sofort nach Steuerbescheid |

## Spekulationsfristen-Tracking

Pro Immobilie individuell tracken:

| Feld | Quelle |
|------|--------|
| Kaufdatum | properties.purchase_date |
| Spekulationsfrist-Ende | Kaufdatum + 10 Jahre |
| Verbleibende Monate | Berechnung |
| Status | Offen / Abgelaufen |

**Regel:** Vor Ablauf der Spekulationsfrist NICHT verkaufen (§23 EStG). Nach Ablauf: Veräußerungsgewinn steuerfrei (bei Privatbesitz).

**Bei Wegzug:** Spekulationsfrist läuft weiter! DE-Immobilien bleiben auch nach Wegzug der 10-Jahres-Frist unterworfen (§49 Abs. 1 Nr. 2f EStG).

## 183-Tage-Tracking

**Kritisch für steuerliche Ansässigkeit.** Pro Jurisdiktion pro Kalenderjahr tracken.

Datenquelle: `residence_tracker` Tabelle

Methodik:
- Jeder Aufenthaltstag zählt (An- und Abreisetag = je 1 Tag, länderspezifisch prüfen)
- Dashboard-KPI: Tage in DE / Tage in Zielland / Tage in Drittländern
- Bei >150 Tagen in einer Jurisdiktion → Gelbe Warnung
- Bei >170 Tagen → Rote Warnung ("183-Tage-Grenze in Gefahr")

**DBA-Tie-Breaker beachten:** 183 Tage allein bestimmen NICHT die steuerliche Ansässigkeit — DBA Art. 4 Tie-Breaker-Regeln (ständige Wohnstätte, Mittelpunkt der Lebensinteressen, gewöhnlicher Aufenthalt) sind entscheidend. → Tax Architect für Detailanalyse konsultieren.

## Krypto-Haltefristen

| Situation | Frist | Steuerfolge |
|-----------|-------|-------------|
| Kauf → Verkauf in DE | 1 Jahr (§23 EStG) | Nach 1 Jahr: steuerfrei |
| Staking Rewards | Ab Zulauf 1 Jahr | Haltefrist beginnt ab Reward-Zulauf |
| Krypto-zu-Krypto Tausch | Realisierungsvorgang! | Neue Haltefrist beginnt |
| DAC8 ab 01.01.2026 | — | Automatische Meldung aller Transaktionen |

**Wegzugs-Timing:** Krypto-Positionen mit unrealisierten Gewinnen VOR Ablauf der 1-Jahres-Frist — Timing des Wegzugs relativ zu DAC8 (2026) ist KRITISCH. → Tax Architect konsultieren.

## Datenquellen für calendar_events

Die `calendar_events` Tabelle wird aus drei Quellen befüllt:

| Quelle | source-Feld | Beschreibung |
|--------|-------------|--------------|
| **iPhone Kalender** | `google_calendar` | Manuell eingetragene Termine (Steuerberater, Notartermine, Behördengänge). Flow: iPhone → iCloud → Google Calendar → n8n MCP Client Node → Supabase |
| **System-generiert** | `system` | Automatisch erzeugte Fristen (Steuer-Vorauszahlungen, Spekulationsfristen, DBA-Antragsfristen) |
| **Manuell** | `manual` | Direkt in Supabase oder via Telegram eingetragene Events |

**iPhone → Google Calendar Sync (einmalige Einrichtung):**
1. iPhone → Einstellungen → Kalender → Accounts → Google-Konto hinzufügen
2. Kalender-Sync aktivieren — fertig, alle Einträge synchen automatisch
3. n8n Cron-Workflow "Calendar Sync" (Sprint 6.0) liest alle 6 Stunden per Google Calendar API
4. Events werden per `google_event_id` dedupliziert (Upsert)

**Tipp:** Steuer-Fristen im iPhone-Kalender mit Keyword im Titel versehen (z.B. "ESt Vorauszahlung Q2") — das System kategorisiert automatisch per Keyword-Matching.

## Automatische Warnungen

Der CFO generiert proaktive Warnungen:
- **4 Wochen vor Frist:** Erinnerung + was zu tun ist
- **1 Woche vor Frist:** Dringende Warnung + Eskalation wenn noch nicht erledigt
- **Frist überschritten:** Sofort-Alert + Schadensbegrenzung prüfen
