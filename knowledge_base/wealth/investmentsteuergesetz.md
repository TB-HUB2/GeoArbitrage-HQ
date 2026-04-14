# Investmentsteuergesetz (InvStG) — Besteuerung von Fonds
*Wissensstand: März 2026*
*Chunk-ID: wealth/investmentsteuergesetz*
*Relevante Agenten: CFO-Agent, Tax-Agent, Wealth-Agent*

## Grundlagen des InvStG (seit Reform 2018)

Das Investmentsteuergesetz regelt die Besteuerung von Investmentfonds in Deutschland. Seit der Reform 2018 gilt ein transparentes Besteuerungssystem auf Anlegerebene.

## Vorabpauschale

Die Vorabpauschale ist eine jährliche Mindestbesteuerung auf thesaurierende Fonds-Erträge, auch wenn keine Ausschüttung erfolgt.

**Berechnung:**
```
Vorabpauschale = Basiszins × Fondswert (1.1.) × 70%
```
- Basiszins: wird jährlich vom Bundesfinanzministerium festgelegt (angelehnt an langfristige Bundesanleihen)
- Basiszins 2025: 2,53% | Basiszins 2026: ca. 2,1–2,4% (vorläufig)
- Mindestens 0 EUR (kein negativer Wert)
- Die Vorabpauschale wird am 1. Januar des Folgejahres fällig (Abgeltungsteuer + Soli + KiSt)
- Broker buchen automatisch ab (Konto muss gedeckt sein!)

**Beispiel:** Fondswert 100.000 EUR, Basiszins 2,53%
→ Vorabpauschale = 100.000 × 2,53% × 70% = 1.771 EUR
→ Steuer (26,375% AbgSt inkl. Soli) = ~467 EUR

Bei Verkauf des Fonds wird die gezahlte Vorabpauschale auf den Veräußerungsgewinn angerechnet (keine Doppelbesteuerung).

## Teilfreistellung

Bestimmte Erträge aus Investmentfonds sind teilweise steuerfrei:

| Fondstyp | Teilfreistellung (Privatanleger) |
|---|---|
| Aktienfonds (mind. 51% Aktien) | 30% |
| Mischfonds (mind. 25% Aktien) | 15% |
| Immobilienfonds (mind. 51% Immobilien) | 60% |
| Ausland-Immobilienfonds (mind. 51%, davon 51% Ausland) | 80% |
| Sonstige Fonds | 0% |

**Effektiver Steuersatz Aktienfonds:** 26,375% × 70% = **18,46%**

## Thesaurierend vs. Ausschüttend

| Kriterium | Thesaurierend | Ausschüttend |
|---|---|---|
| Laufende Besteuerung | Vorabpauschale (meist gering) | Abgeltungsteuer auf Ausschüttungen |
| Zinseszins | Optimiert (reinvestiert) | Manuelles Reinvestieren nötig |
| Cashflow-Bedarf | Nein | Ja (passives Einkommen) |
| FIRE-Phase (Entnahme) | Eher schlechter | Komfortabler |
| Aufbauphase | Bevorzugt | Nachrangig |

**Empfehlung Aufbauphase:** Thesaurierend, da Vorabpauschale oft deutlich unter tatsächlichem Wertzuwachs liegt → Steuerstundungseffekt.

## Altbestand vor 2009

Fonds/Aktien, die **vor dem 1. Januar 2009** angeschafft wurden, gelten als steuerlicher "Altbestand". Bis Ende 2017 waren diese vollständig steuerfrei. Ab 2018 gilt: Kursgewinne über einem persönlichen Freibetrag von **100.000 EUR pro Person** sind steuerpflichtig. Dieser Freibetrag ist auf Lebenszeit begrenzt und nicht übertragbar. Dokumentation der Anschaffungskosten kritisch.

## Auswirkung des Wegzugs aus Deutschland

**Wegzugsbesteuerung (§6 AStG):** Bei Aufgabe des deutschen Wohnsitzes gilt für bestimmte Kapitalanlagen eine **fiktive Veräußerung**. Dies betrifft insbesondere:
- Anteile an Kapitalgesellschaften ≥1% (§17 EStG)
- Nicht aber typische ETF-/Fonds-Anteile im Privatvermögen direkt

**Für Fonds-Anleger relevant:**
- Zum Wegzugszeitpunkt werden aufgelaufene Vorabpauschalen fällig
- Bei Wohnsitzwechsel in Niedrigsteuerland: Steuerklärung im Wegzugsjahr sorgfältig planen
- Nach Wegzug: keine deutsche Besteuerung mehr auf Kursgewinne (nur noch Quellensteuern je nach Fondsdomizil)
- Abkommensrecht prüfen: Deutsches Besteuerungsrecht erlischt meist mit Wegzug

**Tipp:** Vor Wegzug prüfen, ob Realisierung von Verlusten (Tax-Loss-Harvesting) sinnvoll, um stille Lasten abzubauen.

## Sparerpauschbetrag
Ab 2023: **1.000 EUR/Person** (2.000 EUR Eheleute). Gilt für alle Kapitalerträge. Bei optimiertem Depot: günstige ausschüttende Fonds gezielt für Ausschöpfung nutzen.
