# Workflow Architecture

## Overview

The GeoArbitrage HQ system runs 18 n8n workflows that form an AI-powered Virtual Family Office. Workflows handle everything from weekly OSINT scanning to multi-agent CFO conversations via Telegram.

---

## Workflow Patterns

### 1. Linear Pipeline (6-Node Agent Pattern)

Most workflows follow a linear chain of Code nodes:

```
Trigger -> Prepare Data -> Process -> Aggregate -> Deliver -> Log
```

Each node is a self-contained Code node (n8n-nodes-base.code) that uses `fetch()` for API calls and Supabase operations. No separate HTTP Request nodes are needed for Supabase -- everything runs inline via the REST API using `$env.SUPABASE_URL` and `$env.SUPABASE_SERVICE_ROLE_KEY`.

Example: **Weekly Report Generator** follows this exact pattern:
1. Trigger (executeWorkflowTrigger)
2. Collect all data from Supabase
3. Stress-test calculations (pure JS, no LLM)
4. Correlation check (pure JS)
5. Sonnet LLM call for narrative
6. Save to Supabase + format Telegram message
7. Fire-and-forget: Send Alert + Agent Logger (parallel)

### 2. Fan-Out / Fan-In (Parallel Data Collection)

The **Weekly Scan** workflow uses a fan-out pattern:

```
Trigger -> Timing Guards -> Load Countries -> Prepare Countries
    |-> A1: GDELT Stability
    |-> A2: GDELT News Volume
    |-> A3: ACLED Conflict Data
    |-> A4: Polymarket
    |-> A5: Immobilien Equity
    |-> A6: Kurs-Update (Yahoo/Twelvedata/CoinGecko)
    |-> A7: Wechselkurs-Update
    |-> A9: Inflations-Monitor
    |-> A10: Market Intelligence (Tavily)
    |-> A11: Fristen-Check
    |-> A12: Gold-Preis
    |-> A13: EZB-Leitzins
    |-> B1-B4: Web Search (Tavily)
    v
Aggregate Results -> Conditional LLM Assessment -> Telegram -> Logger
```

All 13 data nodes run in parallel from the "Prepare Countries" node. The "Aggregate" node collects all results using `$('NodeName').first().json`.

### 3. SplitInBatches Loop (Multi-Agent CFO)

The CFO Agent workflow processes multiple specialist agents sequentially:

```
Trigger -> Intent Classification -> Route
    -> SplitInBatches(agents)
        -> RAG Query per agent
        -> LLM Call per agent
        -> Collect response
    -> Merge all agent responses
    -> Synthesize final answer (Sonnet)
    -> Save chat + embedding
    -> Telegram reply
```

**Key learning**: When using SplitInBatches, fire-and-forget nodes (like the Agent Logger) inside the loop will trigger multiple times. Use `$getWorkflowStaticData('global')` to deduplicate.

### 4. Fire-and-Forget Logger

Almost every workflow ends with a parallel fork:

```
Main Output -> Send Alert (sub-workflow)
            -> Log Data Prepare -> Agent Logger (sub-workflow)
```

The Agent Logger sub-workflow (`SqxGbsNqoNfioAcC`) inserts a row into `agent_logs` with:
- `session_id`, `agent_name`, `model`
- `input_summary`, `output_summary`
- `tokens_in`, `tokens_out`, `cost_eur`

The logger has `onError: continueRegularOutput` so logging failures never break the main workflow.

### 5. Conditional LLM Calls (Cost Optimization)

LLM calls are gated behind conditions to minimize API costs:

- **OSINT Assessment (Haiku)**: Only runs when GDELT/ACLED detect red alarms
- **Legal Change Assessment (Haiku)**: Only runs when Tavily finds relevant search results
- **Weekly Report (Sonnet)**: Always runs but only on scheduled execution
- **Quarterly Quality**: No LLM at all -- pure data aggregation

---

## Import & Deploy Instructions

### Import a Workflow

```bash
n8n import:workflow --input=sprint6_weekly_scan.json
```

### Publish the Workflow

After import, workflows are deactivated by default. Publish them:

```bash
n8n publish:workflow --id=<WORKFLOW_ID>
```

The workflow ID is either in the JSON (`"id"` field) or assigned by n8n on import.

### Deploy Order (CRITICAL)

Always follow this sequence:

1. `n8n import:workflow --input=file.json`
2. `n8n publish:workflow --id=X`
3. `docker compose up -d` (NOT `restart` -- restart does not reload env vars)

### Credential Setup After Import

After importing, you must configure credentials in the n8n UI:

1. **Google Calendar OAuth2** (used by Calendar Sync)
   - Create OAuth2 credentials in Google Cloud Console
   - Add redirect URI matching your n8n editor URL
   - Configure in n8n Settings -> Credentials

2. **Environment Variables** (used by all workflows via `$env.*`)
   - `SUPABASE_URL` -- Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` -- Service role key (bypasses RLS)
   - `ANTHROPIC_API_KEY` -- For Claude API calls
   - `VOYAGE_API_KEY` -- For Voyage AI embeddings
   - `TAVILY_API_KEY` -- For web search
   - `TWELVEDATA_API_KEY` -- Stock price fallback
   - `COINGECKO_API_KEY` -- Crypto prices (optional, free tier works)
   - `ACLED_EMAIL` / `ACLED_PASSWORD` -- ACLED conflict data API
   - `MODEL_SONNET` -- Sonnet model ID (default: claude-sonnet-4-6)
   - `MODEL_HAIKU` -- Haiku model ID (default: claude-haiku-4-5-20251001)
   - `TELEGRAM_BOT_TOKEN` -- Telegram bot token
   - `TELEGRAM_CHAT_ID` -- Allowed Telegram chat ID

3. **n8n API Key** (for workflow management)
   - Must be created via n8n UI (Settings -> n8n API)
   - The key is a JWT token (~267 chars), not a static string
   - Store the actual JWT in your `.env` file

---

## Complete Workflow List (18 Workflows)

### Core Automation (4 included as templates)
| # | Workflow | Schedule | Purpose |
|---|----------|----------|---------|
| 1 | **Weekly Scan** | Mon 08:00 | OSINT + market data + deadline scanning across all target countries |
| 2 | **Weekly Report** | Called by Weekly Scan | Sonnet-powered portfolio narrative with stress tests |
| 3 | **Quarterly Quality** | 1st Tue of Jan/Apr/Jul/Oct | Agent performance, coverage gaps, knowledge staleness |
| 4 | **Calendar Sync** | Every 6 hours | Google Calendar -> Supabase sync with categorization |

### CFO Agent System (6 workflows)
| # | Workflow | Trigger | Purpose |
|---|----------|---------|---------|
| 5 | **CFO Main Router** | Telegram webhook | Intent classification + agent routing |
| 6 | **Tax Architect** | Sub-workflow | German/international tax analysis (AStG, DBA, GrEStG) |
| 7 | **Immigration Advisor** | Sub-workflow | Visa, residency, citizenship pathways |
| 8 | **Wealth Manager** | Sub-workflow | Portfolio, asset allocation, rebalancing |
| 9 | **Real Estate Analyst** | Sub-workflow | Property valuation, cashflow, Spekulationsfrist |
| 10 | **Risk Sentinel** | Sub-workflow | Country stability, geopolitical risk assessment |

### Infrastructure (4 workflows)
| # | Workflow | Trigger | Purpose |
|---|----------|---------|---------|
| 11 | **Send Alert** | Sub-workflow | Telegram message delivery with urgency formatting |
| 12 | **Agent Logger** | Sub-workflow | Centralized logging to `agent_logs` table |
| 13 | **Telegram Webhook Handler** | Webhook POST | Receives Telegram messages, routes to CFO |
| 14 | **Data Entry Handler** | Sub-workflow | Processes /budget, /holding commands from Telegram |

### Knowledge & Maintenance (4 workflows)
| # | Workflow | Trigger | Purpose |
|---|----------|---------|---------|
| 15 | **RAG Query** | Sub-workflow | Vector search via Voyage AI + Supabase match_knowledge() |
| 16 | **Chat History** | Sub-workflow | Save conversations with embeddings for episodic memory |
| 17 | **Knowledge Gap Tracker** | Sub-workflow | Logs unanswered questions for future KB expansion |
| 18 | **Feedback Collector** | Sub-workflow | Processes thumbs up/down from Telegram inline buttons |

---

## Key Technical Notes

- **Webhook security**: Only `/webhook/telegram` is publicly exposed via Nginx. All other endpoints are behind Tailscale VPN.
- **Supabase access**: Workflows use `service_role` key which bypasses RLS. Dashboard uses `anon` key with RLS policies.
- **Cost control**: Haiku is used for classification/assessment tasks. Sonnet is reserved for narrative generation. Most scan nodes use zero LLM calls (pure JS + APIs).
- **Error handling**: All external API calls use `AbortSignal.timeout()`. Sub-workflows have `onError: continueRegularOutput`.
- **Batch insert rule**: Supabase REST API requires all objects in a batch insert to have identical keys (PGRST102 error otherwise). Use `null` for missing values.
