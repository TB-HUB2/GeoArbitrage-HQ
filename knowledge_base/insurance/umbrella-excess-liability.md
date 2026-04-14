# Umbrella / Excess Liability Insurance
*Wissensstand: März 2026*
*Chunk-ID: insurance/umbrella-excess-liability*
*Relevante Agenten: Insurance-Agent, Corporate-Agent*

## Was ist Umbrella Insurance?

Eine übergeordnete Haftpflichtpolice, die ÜBER bestehende Einzelpolicen (Private Haftpflicht, Kfz-Haftpflicht, Vermieter-Haftpflicht, PI/E&O) hinaus zahlt, wenn deren Limits erschöpft sind.

## Wann ist Umbrella nötig?

| Kriterium | Umbrella empfohlen? |
|-----------|-------------------|
| Nettovermögen > 500k EUR | Ja |
| Immobilienbesitz + Vermietung | Ja (Verkehrssicherungspflicht) |
| Geschäftsführer ausländischer GmbH | Ja (persönliche D&O-Lücken) |
| AI-Business mit B2B-Kunden > 100k EUR/Projekt | Ja |
| Häufige internationale Reisen | Ja (Haftpflicht variiert pro Land) |
| Nur Angestellter ohne Vermögen | Nein (Einzelpolicen ausreichend) |

**Faustregel:** Umbrella-Deckungssumme ≥ Nettovermögen. Bei 500k EUR Vermögen → mindestens 1M EUR Umbrella.

## Layering-Logik

```
Schadenfall: 800.000 EUR

Schicht 1: Private Haftpflicht → zahlt bis 500.000 EUR (Limit erschöpft)
Schicht 2: Umbrella → zahlt die verbleibenden 300.000 EUR
```

**Umbrella greift nur NACH Erschöpfung der Primärpolice.** Deshalb: Primärpolicen (PHV, Kfz, Vermieter) müssen angemessene Grundlimits haben.

## Kosten

| Deckungssumme | Typische Jahresprämie | Hinweis |
|---------------|----------------------|---------|
| 1M EUR | 200-400 EUR/Jahr | Standard für Einzelperson |
| 2M EUR | 350-600 EUR/Jahr | Empfohlen bei Immobilienbesitz |
| 5M EUR | 600-1.200 EUR/Jahr | Für HNW-Individuals |

**Kosten-Leistungs-Verhältnis:** Umbrella ist eine der günstigsten Versicherungen relativ zur Deckungssumme.

## Anbieter

| Anbieter | Stärke | International? |
|----------|--------|---------------|
| Hiscox | Tech/AI-fokussiert, gute Expat-Coverage | Ja (UK-basiert, global) |
| AIG Private Client | HNW-Spezialist | Ja |
| Chubb | Premium-Anbieter, höchste Limits | Ja |
| Allianz Global | Breites Netzwerk | Ja (EU-fokussiert) |
| Zurich | Solide Standardprodukte | Ja |

## AI-spezifische Umbrella-Szenarien

| Szenario | Primärpolice | Umbrella greift wenn... |
|----------|-------------|------------------------|
| AI-Halluzination verursacht Kundenverlust | PI/E&O | PI-Limit (z.B. 1M) nicht ausreicht |
| DSGVO-Verstoß durch Training Data | Cyber | Cyber-Limit + Bußgeld übersteigt Police |
| Vermieter-Haftpflicht (Personenschaden) | Haus-/Grundbesitzerhaftpflicht | Schwerer Unfall, Schaden > 5M EUR |
| D&O-Anspruch gegen GmbH-GF | D&O | D&O-Limit ausgeschöpft |

## Wichtige Ausschlüsse

- **Vorsätzliche Handlungen** — Umbrella deckt NIE Vorsatz
- **Vertragliche Haftung** — Nur gesetzliche Haftpflicht, nicht vertragliche Zusagen
- **Eigene Schäden** — Umbrella ist NUR Drittschaden-Deckung
- **Berufsspezifische Fehler** — Erfordert PI/E&O als Primärpolice

## Bei Wegzug

- Deutsche Umbrella-Policen gelten oft nur EU/Schengen → prüfen!
- Internationale Umbrella (Hiscox, AIG, Chubb) bieten weltweite Deckung
- Empfehlung: VOR Wegzug auf internationale Police umstellen
