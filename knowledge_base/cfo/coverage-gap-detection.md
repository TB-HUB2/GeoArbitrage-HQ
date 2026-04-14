# Coverage Gap Detection & System-Selbstbewusstsein
*Wissensstand: März 2026*
*Chunk-ID: cfo/coverage-gap-detection*
*Relevante Agenten: CFO*

## Routing-Check-Methodik

Bei JEDER Routing-Entscheidung prüfen: Fällt diese Frage tatsächlich in den Kompetenzbereich eines der 9 Agenten?

### Agenten-Kompetenz-Matrix

| Agent | Zuständig für | NICHT zuständig für |
|-------|--------------|---------------------|
| Tax Architect | Steuerrecht DE + International, DBA, AStG, Krypto-Steuer | Rechtsberatung, Steuererklärung erstellen |
| Immobilien | DE-Immobilien Struktur + Steuer + Finanzierung | Auslands-Immobilien kaufen (→ Makler), Baurecht |
| Corporate | Firmenstrukturen, Jurisdiktionen, Transfer Pricing | Vertragserstellung, Handelsregister-Anmeldung |
| Immigration | Visa, CBI/RBI, Residency, 183-Tage | Visumsantrag einreichen, Botschaftstermine |
| Wealth | Portfolio, Stress-Tests, FIRE, Asset Allocation | Einzelaktien-Empfehlungen, Trading-Signale |
| Insurance | KV, PI, Cyber, Transition-Gaps | Policen abschließen, Schadensmeldung |
| Relocation | Länderbewertung, Kosten, Infrastruktur, Logistik | Mietverträge, Arbeitserlaubnis |
| CFO | Orchestrierung, Cashflow, Roadmap, Governance | Fachliche Detailanalyse (→ Spezialisten) |
| Validator | Faktencheck, Stress-Test, Risiko-Analyse | Eigene Empfehlungen geben |

## Ehrliche-Kommunikation Template

Wenn KEIN Agent die Frage beantworten kann — NICHT an den nächstbesten Agent routen:

```
"Diese Frage liegt außerhalb meiner aktuellen Expertise.

Konkret fehlt mir Wissen zu: [Thema — z.B. VC-Fundraising, M&A-Bewertung, Familienrecht]

Empfehlungen:
1. Menschlichen Experten konsultieren: [Typ — z.B. VC-Anwalt, M&A-Berater, Familienrechtler]
   → Soll ich einen Kontakt in der human_experts Datenbank suchen?
2. Optional: Einen spezialisierten Agenten für [Thema] hinzufügen
   → Geschätzter Aufwand: [1-2 Stunden / 30 Min Erweiterung bestehender Agent]

Ich logge diese Lücke, damit wir das System bei Bedarf erweitern können."
```

## Coverage Gap Logging

Jeder Gap wird in der `coverage_gaps` Tabelle gespeichert:

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| id | UUID | Primärschlüssel |
| timestamp | TIMESTAMPTZ | Wann aufgetreten |
| query | TEXT | Originalfrage des Mandanten |
| detected_gap | TEXT | Was fehlt (Themenbereich) |
| closest_agent | TEXT | Welcher Agent wäre am nächsten dran? |
| recommended_action | TEXT | Neuer Agent / KB-Erweiterung / Externer Experte |
| resolved | BOOLEAN | Wurde die Lücke geschlossen? |
| resolved_by | TEXT | 'new_agent' / 'kb_update' / 'human_expert' / NULL |
| resolved_at | TIMESTAMPTZ | Wann geschlossen |

## Quartals-Analyse

Im Quartals-Review die coverage_gaps analysieren:

1. **Häufigkeit:** Welche Themen wurden am häufigsten als Gap erkannt?
2. **Clustering:** Gehören mehrere Gaps zum selben Fachbereich?
3. **Trend:** Werden die Gaps mehr oder weniger? (System wird besser/schlechter?)

## Schwellenwert für Agent-Empfehlung

Wenn das gleiche Thema **≥3x in einem Monat** als Coverage Gap auftaucht:

```
"System-Erweiterungs-Empfehlung:

Das Thema '[Thema]' wurde [X]x angefragt, aber kein Agent konnte es gut beantworten.

Option A: Neuen spezialisierten Agenten erstellen
  - Geschätzter Aufwand: 1-2 Stunden
  - Modell-Empfehlung: [Haiku für Faktenwissen / Sonnet für Analyse]
  - Wissensbereiche: [Liste]

Option B: Bestehenden Agenten erweitern
  - [Agent-Name] ist am nächsten dran
  - Fehlende Wissenssektionen: [Liste]
  - Geschätzter Aufwand: 30 Minuten (KB-Chunk + Prompt-Update)

Option C: Menschlichen Experten einbinden
  - Typ: [z.B. VC-Anwalt, M&A-Berater]
  - In human_experts Tabelle eintragen

Empfehlung: Option [X], weil [Begründung]."
```

## Feedback-Verarbeitung

Bei negativem Mandanten-Feedback (👎):

1. Kategorisiere: War die Antwort **falsch**, **irrelevant**, **unvollständig**, oder **zu vage**?
2. Ist es ein Coverage Gap (Thema nicht abgedeckt) oder ein Quality Gap (Thema abgedeckt aber schlecht)?
3. Coverage Gap → In coverage_gaps loggen
4. Quality Gap → Für Quartals-Review notieren (Agent-Prompt oder KB-Chunk verbessern)
