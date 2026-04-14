# Cross-Agent-Konsistenz-Matrix — Widersprüche erkennen
*Wissensstand: März 2026*
*Chunk-ID: quality/cross-agent-konsistenz-matrix*
*Relevante Agenten: Validator, CFO-Agent*

## Zweck

Wenn mehrere Agenten zu einer Frage antworten, können deren Empfehlungen sich widersprechen. Der Validator muss echte Widersprüche (Fehler) von legitimen Kostenabwägungen (verschiedene Perspektiven) unterscheiden.

## Dependency-Matrix: Welche Agenten MÜSSEN konsistent sein?

| Wenn Agent X empfiehlt... | MUSS konsistent sein mit Agent Y wegen... |
|--------------------------|------------------------------------------|
| **Tax:** "vGmbH optimal für Immobilien" | **Immobilien:** Strukturvergleich muss vGmbH als Option zeigen |
| **Tax:** "Wegzug nach UAE steueroptimal" | **Immigration:** UAE-Residenz muss erreichbar sein (Visa, Timeline) |
| **Tax:** "Wegzug nach UAE steueroptimal" | **Insurance:** KV-Transition muss lückenlos sein |
| **Tax:** "Wegzug nach UAE steueroptimal" | **Relocation:** UAE muss lifestyle-fit sein (Hitze, Golf, Zeitzone) |
| **Corporate:** "US LLC für Revenue" | **Tax:** §7 AStG Hinzurechnung wenn noch in DE ansässig! |
| **Corporate:** "Georgien VZP für IT-Business" | **Tax:** 5% Dividendensteuer bei Ausschüttung erwähnt? |
| **Immigration:** "Paraguay Residenz in 2 Wochen" | **Tax:** Paraguay hat KEIN DBA mit DE → Doppelbesteuerungsrisiko |
| **Wealth:** "Depot bei IBKR Irland" | **Tax:** Quellensteuer-Situation bei Wegzug korrekt? |
| **Relocation:** "Tiflis als Favorit" | **Relocation eigene Analyse:** Golf NICHT möglich → Dealbreaker? |
| **Insurance:** "PKV Anwartschaft kündigen" | **Insurance eigene Analyse:** Vorerkrankungen vorhanden → FEHLER |

## Widerspruchs-Typen

### Typ 1: Echter Widerspruch (FEHLER → zurückweisen)

**Beispiel:** Tax Agent sagt "Georgien VZP = 0% Steuer". Immigration Agent sagt "Georgien VZP hat seit 2022 verschärfte Substanz-Requirements mit lokalen Mitarbeitern".

**Prüfung:** Stimmt beides? → Ja, aber Tax Agent hat die KOSTEN der Substanz unterschlagen. → Widerspruch in der Gesamtbewertung.

**Aktion:** ⚠️ TEILWEISE VALIDIERT: "Tax-Aussage korrekt (0% CIT auf IT-Export), aber Substanz-Kosten (~5-10k€/Jahr seit 2022 Verschärfung) müssen einkalkuliert werden. Effektive Steuerlast = 0% CIT + 5% Dividendensteuer + Substanz-Kosten."

### Typ 2: Kosten-Abwägung (KEIN Fehler → zusammenführen)

**Beispiel:** Tax Agent sagt "UAE spart 25k€/Jahr Steuern". Insurance Agent sagt "UAE KV kostet 20k€ mehr als DE". Relocation Agent sagt "Lebenshaltungskosten +10k€/Jahr".

**Prüfung:** Kein Widerspruch — verschiedene Kostendimensionen. → CFO muss Netto-Vorteil berechnen: 25k Steuerersparnis - 20k KV - 10k Lebenshaltung = **-5k€/Jahr NETTO-VERLUST**.

**Aktion:** ✅ VALIDIERT: "Alle Agenten korrekt. Aber: Netto-Vorteil UAE ist NEGATIV bei aktueller Einkommenssituation. Empfehlung: UAE lohnt sich erst ab ~150k€ Einkommen. → CFO-Briefing empfohlen."

### Typ 3: Zeitlicher Widerspruch (PRÜFEN → sequenzieren)

**Beispiel:** Corporate Agent empfiehlt "US LLC JETZT gründen". Tax Agent warnt "§7 AStG greift solange in DE ansässig".

**Prüfung:** Beides korrekt, aber TIMING entscheidend. US LLC gründen = OK. Revenue über US LLC laufen lassen WÄHREND in DE = §7 AStG Risiko.

**Aktion:** ⚠️ TEILWEISE VALIDIERT: "Gründung OK, aber Revenue-Routing erst NACH Wegzug. Empfehlung: US LLC jetzt gründen (Banking-Zugang sichern), Revenue erst nach Abmeldung DE über LLC leiten."

## Annahmen-Konsistenz prüfen

Alle Agenten MÜSSEN die gleichen Grundannahmen verwenden:

| Annahme | Quelle | Wo definiert |
|---------|--------|-------------|
| Bruttoeinkommen | Mandantenprofil | shared/mandantenprofil.md |
| Familienstand | Mandantenprofil | shared/mandantenprofil.md |
| Risikoprofil | Mandantenprofil | shared/mandantenprofil.md |
| Zeithorizont Wegzug | Aktuelle Planung | decisions Tabelle |
| Zielland-Präferenz | Aktuelle Bewertung | CFO Roadmap |
| Immobilienbestand | properties Tabelle | Supabase |
| Portfolio-Wert | portfolio_holdings | Supabase |

**Wenn Agent A von "Single" ausgeht aber Agent B von "verheiratet" → SOFORT flaggen!**

**Prüfmethode:** In jedem Agent-Output nach explizit oder implizit verwendeten Annahmen suchen. Vergleichen mit Mandantenprofil. Abweichung = 🔴.

## Prüf-Workflow bei Multi-Agent-Antworten

```
1. Empfänge alle Agent-Outputs
2. Für JEDEN Output: Halluzinations-Trigger-Check (→ halluzinations-trigger-katalog.md)
3. Für JEDEN Output: Staleness-Check (→ validierungs-checkliste.md)
4. Zwischen ALLEN Outputs: Dependency-Matrix prüfen (diese Datei)
5. Zwischen ALLEN Outputs: Annahmen-Konsistenz prüfen
6. Für die GESAMT-Empfehlung: Worst-Case + Hidden Costs berechnen (→ worst-case-szenarien.md)
7. Ergebnis: Validierungs-Report mit Status pro Agent + Gesamt-Assessment
```

## Template: Validierungs-Report

```
VALIDIERUNGS-REPORT
Datum: [TT.MM.JJJJ]
Geprüfte Agenten: [Liste]
Anfrage: [Original-Frage des Mandanten]

TEIL 1 — FAKTENPRÜFUNG:
| Agent | Status | Kernaussage | Prüfung | Ergebnis |
|-------|--------|------------|---------|---------|
| Tax   | ✅/⚠️/❌ | "..." | Quelle: § ... | Korrekt/Fehler/Veraltet |

TEIL 2 — KONSISTENZ:
| Widerspruch | Typ | Auflösung |
|------------|-----|-----------|
| Tax ↔ Immigration | Echt/Kosten/Zeitlich | [Empfehlung] |

TEIL 3 — STRESS-TEST:
🔴 SHOWSTOPPER: [wenn vorhanden]
🟡 SIGNIFIKANTE RISIKEN: [Liste]
🟢 AKZEPTABLE RISIKEN: [Liste]
💡 BLINDE FLECKEN: [was kein Agent erwähnt hat]

GESAMT-BEWERTUNG: ✅/⚠️/❌
EMPFEHLUNG: [Umsetzen / Nachbessern / Eskalieren]
```
