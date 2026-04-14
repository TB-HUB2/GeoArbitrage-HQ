# Krypto-Steuerrecht Deutschland
*Wissensstand: März 2026*
*Chunk-ID: tax/krypto-steuerrecht-de*
*Relevante Agenten: Tax Architect, Krypto-Spezialist*

## Grundsatz: § 23 EStG — Private Veräußerungsgeschäfte

Kryptowährungen (Bitcoin, Ethereum, etc.) gelten nach herrschender Meinung und BMF-Schreiben vom 10. Mai 2022 als **sonstige Wirtschaftsgüter** i.S.d. § 23 Abs. 1 S. 1 Nr. 2 EStG. Gewinne aus der Veräußerung unterliegen als private Veräußerungsgeschäfte der Einkommensteuer.

**1-Jahres-Haltefrist (§ 23 Abs. 1 S. 1 Nr. 2 EStG):**
- Wird eine Kryptowährung **länger als 1 Jahr** gehalten, ist der Veräußerungsgewinn **steuerfrei**
- Haltedauer unter 1 Jahr: Gewinn ist steuerpflichtig mit dem persönlichen Einkommensteuersatz (bis 45% + SolZ)
- Freigrenze: 1.000 EUR/Jahr für sonstige Veräußerungsgeschäfte (§ 23 Abs. 3 S. 5 EStG, erhöht von 600 EUR ab 2024)

**Achtung (frühere Rechtslage):** Es gab Diskussionen über eine verlängerte Haltefrist (10 Jahre) bei Kryptowährungen, die zur Einkommensgenerierung genutzt wurden (Lending, Staking). Das BMF-Schreiben 2022 hat klargestellt, dass Staking die Haltefrist **nicht verlängert** — sie bleibt bei 1 Jahr.

## Krypto-zu-Krypto: Jeder Tausch ist steuerpflichtig

**Kritischer Punkt:** Der Tausch einer Kryptowährung gegen eine andere Kryptowährung (z.B. BTC gegen ETH, ETH gegen USDC) ist ein **steuerpflichtiger Realisierungsvorgang**, nicht erst der Tausch in Fiat-Währung.

**Praxis:**
- Jede Swap-Transaktion = Veräußerung der Ausgangswährung zum aktuellen Marktpreis
- Einstandspreis (AK) der Ausgangswährung wird gegen aktuellen Marktpreis (EK = Anschaffungskosten neue Währung) gestellt
- Gewinn/Verlust = Marktpreis zum Tauschdatum minus ursprünglicher Anschaffungspreis
- FIFO-Methode (First In, First Out) ist steuerrechtlich geboten

**Tracking-Pflicht:** Lückenlose Aufzeichnung aller Transaktionen mit Zeitstempel, Kurs und Mengen ist steuerrechtlich zwingend. Tools: Cointracking, Koinly, CryptoTax.

## Mining: Gewerbliche Einkünfte oder sonstige Einkünfte?

**Gewerbliches Mining (§ 15 EStG):**
- Professionelles Mining mit eigener Hardware, dauerhaft und mit Gewinnerzielungsabsicht
- Einnahmen = Marktwert der erhaltenen Coins zum Zeitpunkt des Empfangs
- Coins gelten als Betriebsvermögen → Veräußerungsgewinne immer steuerpflichtig (keine 1-Jahres-Frist)
- Gewerbesteuer kann anfallen

**Nicht-gewerbliches (privates) Mining:**
- Gelegentliches, kleines Mining ohne klare Gewinnerzielungsabsicht
- Einordnung als sonstige Einkünfte (§ 22 Nr. 3 EStG): Einnahmen = Marktwert bei Empfang, steuerpflichtig
- Nach Empfang beginnt 1-Jahres-Haltefrist für spätere Veräußerung

## Staking Rewards (BMF-Schreiben Mai 2022)

Das BMF-Schreiben vom 10.05.2022 hat zur Besteuerung von Staking-Rewards Stellung genommen:

**Wichtigste Aussagen:**
- **Staking-Rewards = sonstige Einkünfte (§ 22 Nr. 3 EStG):** Einnahmen bei Zufluss zum Marktwert steuerpflichtig
- **Haltefrist nicht verlängert:** Die 1-Jahres-Haltefrist für erhaltene Staking-Coins beginnt mit dem Zeitpunkt des Erhalts und beträgt weiterhin 1 Jahr (keine 10-Jahres-Verlängerung)
- **Validator vs. Delegator:** Beide Formen behandelt das BMF gleich
- **Liquidity Mining, Yield Farming:** Ähnliche Behandlung; Erträge als sonstige Einkünfte bei Zufluss
- **Hard Forks und Airdrops:** Erhalt meist steuerneutral, aber Anschaffungskosten = 0 EUR → spätere Veräußerung voll steuerpflichtig

## DeFi (Decentralized Finance)

**Lending/Borrowing:** Hinterlegung als Collateral ist kein steuerpflichtiger Tausch, aber Zinseinkünfte sind sofort steuerpflichtig. Rückgabe = Rückgabe gegen eigene Coins, steuerneutral wenn kein Tausch.

**Liquidity Pools (LP-Token):**
- Einlage in Liquidity Pool = Tauschvorgang (steuerpflichtig): Krypto gegen LP-Token
- Rücknahme aus LP = erneuter Tauschvorgang: LP-Token gegen ursprüngliche Kryptos
- Impermanent Loss: steuerlich komplex, Beratung erforderlich

**Wrapping (z.B. ETH → WETH):** Streitig ob Tauschvorgang; herrschende Meinung: Tauschvorgang mit Realisierung.

## NFTs (Non-Fungible Tokens)

- NFTs gelten ebenfalls als sonstige Wirtschaftsgüter
- 1-Jahres-Haltefrist bei privatem Bereich
- Handel als Gewerbe bei professionellen Tradern: keine Haltefrist, Gewerbesteuer
- Royalties bei NFT-Erstellern: Einnahmen aus Verwertungsrechten → §§ 18 oder 22 EStG

## Verlustverrechnung

**§ 20 Abs. 6 S. 5 EStG (Verlustverrechnungsbeschränkung Kapitalvermögen):**
- Verluste aus privaten Kapitalanlagen (Aktien etc.) können nur mit Gewinnen aus Kapitalvermögen verrechnet werden
- **Kryptowährungen sind kein Kapitalvermögen** (§ 20 EStG), sondern sonstige Wirtschaftsgüter (§ 23 EStG) → andere Verlustverrechnungstopf

**§ 23 EStG Verlustverrechnung:**
- Verluste aus privaten Veräußerungsgeschäften (§ 23) können nur mit Gewinnen aus § 23 verrechnet werden
- Verrechnung mit Arbeitslohn, Unternehmensgewinnen etc. nicht möglich
- Verlustvortrag in Folgejahre unbegrenzt möglich (kein Verlustrücktrag)
- Innerhalb des § 23-Topfes können Krypto-Verluste mit Krypto-Gewinnen, aber auch mit Gewinnen aus anderen § 23-Geschäften (z.B. Grundstücksveräußerungen, Edelmetalle) verrechnet werden

## DAC8 — EU-Meldepflicht ab 01.01.2026

Die EU-Richtlinie **DAC8** (Directive on Administrative Cooperation 8, 2023/2226) tritt ab **01.01.2026** in Kraft:

- **Automatischer Datenaustausch:** Krypto-Asset-Dienstleister (CEX: Coinbase, Kraken, Binance EU etc.) müssen Transaktions- und Kontodaten ihrer EU-Nutzer an die Steuerbehörden des Ansässigkeitsstaates melden
- **Meldepflichtige Daten:** Transaktionen, Bestände, Einnahmen, Kapitalgewinne
- Basiert auf dem **OECD CARF (Cryptoasset Reporting Framework)**
- Betrifft: alle Krypto-Dienstleister mit EU-Nexus oder EU-Kunden
- DEX (dezentrale Börsen) und Self-Custody Wallets: (noch) nicht direkt betroffen, aber Kontoprovider die DeFi-Infrastruktur betreiben könnten betroffen sein

**Konsequenz:** Ab 2026 haben deutsche Finanzbehörden automatisch Zugang zu Krypto-Transaktionsdaten — Nachverfolgung von Krypto-Einkünften wird deutlich einfacher.

## Kryptowährungen nach Wegzug aus Deutschland

- Wegzug: GmbH-Anteile an Krypto-Unternehmen können § 6 AStG triggern
- Private Krypto-Bestände: kein § 6 AStG (nicht Kapitalgesellschaftsanteile ≥ 1%)
- Aber: § 2 AStG kann bei Wegzug in Niedrigsteuerland die 1-Jahres-Frist für während der deutschen Steuerpflicht gehaltene Coins eliminieren (wenn Veräußerung nach Wegzug)
- Krypto-Mining-Gewerbe: Wegzugsbesteuerung nach § 16 Abs. 3a EStG (Betriebsaufgabe) möglich
