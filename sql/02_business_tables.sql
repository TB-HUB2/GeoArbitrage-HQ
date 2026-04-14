-- ============================================================
-- 02: Business Tables
-- All core tables for the GeoArbitrage HQ application
-- ============================================================

-- 1. Target Countries — countries being evaluated for geo-arbitrage
CREATE TABLE IF NOT EXISTS target_countries (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  code              TEXT NOT NULL,              -- ISO 3166-1 alpha-2 (e.g. 'PT', 'GE')
  priority          INTEGER NOT NULL CHECK (priority >= 1),
  status            TEXT DEFAULT 'research',    -- 'research', 'active', 'eliminated', 'target'
  tax_rate          NUMERIC,                    -- effective tax rate (%)
  cost_of_living    NUMERIC,                    -- monthly cost index or EUR amount
  safety_score      NUMERIC,                    -- 0-100 scale
  internet_speed    NUMERIC,                    -- avg Mbps
  timezone_offset   NUMERIC,                    -- hours from UTC
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Properties — real estate assets
CREATE TABLE IF NOT EXISTS properties (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                      TEXT NOT NULL,
  address                   TEXT,
  city                      TEXT,
  country                   TEXT,
  current_value             NUMERIC,            -- current market value (EUR)
  current_value_date        DATE,               -- date of last valuation
  loan_amount_current       NUMERIC DEFAULT 0,  -- remaining loan balance
  loan_rate                 NUMERIC DEFAULT 0,  -- annual interest rate (%)
  loan_monthly_payment      NUMERIC DEFAULT 0,  -- monthly annuity payment
  loan_bank                 TEXT,
  loan_zinsbindung_end      DATE,               -- fixed rate period end date
  monthly_rent_gross        NUMERIC DEFAULT 0,  -- gross monthly rent
  monthly_hausgeld          NUMERIC DEFAULT 0,  -- monthly Hausgeld (condo fee)
  monthly_nicht_umlagefaehig NUMERIC DEFAULT 0, -- non-recoverable portion of Hausgeld
  status                    TEXT DEFAULT 'active', -- 'active', 'sold', 'planned'
  notes                     TEXT,
  created_at                TIMESTAMPTZ DEFAULT NOW(),
  updated_at                TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Portfolio Holdings — investment portfolio positions
CREATE TABLE IF NOT EXISTS portfolio_holdings (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  type              TEXT NOT NULL,              -- 'ETF', 'ETC', 'Aktie', 'Krypto', 'P2P', 'Edelmetall'
  isin              TEXT,
  ticker            TEXT,
  shares            NUMERIC DEFAULT 0,
  avg_price         NUMERIC DEFAULT 0,          -- average purchase price per share
  current_price     NUMERIC DEFAULT 0,
  sparplan_monthly  NUMERIC DEFAULT 0,          -- monthly savings plan amount
  broker            TEXT,
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Portfolio Lots — individual purchase lots for tax tracking
CREATE TABLE IF NOT EXISTS portfolio_lots (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  holding_id  UUID NOT NULL REFERENCES portfolio_holdings(id) ON DELETE CASCADE,
  buy_date    DATE NOT NULL,
  shares      NUMERIC NOT NULL,
  price       NUMERIC NOT NULL,                 -- price per share at purchase
  fees        NUMERIC DEFAULT 0,
  notes       TEXT
);

-- 5. Budget — monthly income/expense/investment/reserve planning and tracking
CREATE TABLE IF NOT EXISTS budget (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month         DATE NOT NULL,                  -- always first day: YYYY-MM-01
  category      TEXT NOT NULL,                  -- e.g. 'gehalt', 'miete', 'etf_sparplan'
  type          TEXT NOT NULL CHECK (type IN ('income', 'expense', 'investment', 'reserve')),
  amount_plan   NUMERIC DEFAULT 0,
  amount_actual NUMERIC DEFAULT 0,
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Wealth Snapshots — periodic net worth snapshots
CREATE TABLE IF NOT EXISTS wealth_snapshots (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date   DATE NOT NULL,
  nettovermoegen  NUMERIC DEFAULT 0,            -- total net worth
  immobilien_wert NUMERIC DEFAULT 0,            -- real estate value
  portfolio_wert  NUMERIC DEFAULT 0,            -- portfolio value
  cash            NUMERIC DEFAULT 0,
  schulden        NUMERIC DEFAULT 0,            -- total debt
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Calendar Events — deadlines, appointments, reminders
CREATE TABLE IF NOT EXISTS calendar_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  description     TEXT,
  event_date      TIMESTAMPTZ NOT NULL,
  category        TEXT,                         -- 'steuer', 'immobilie', 'visum', 'allgemein'
  urgency         TEXT,                         -- computed in frontend from event_date
  status          TEXT DEFAULT 'active',        -- 'active', 'completed', 'cancelled'
  source          TEXT DEFAULT 'manual',        -- 'google_calendar', 'system', 'manual'
  google_event_id TEXT UNIQUE,                  -- for sync deduplication
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Savings Goals — financial targets
CREATE TABLE IF NOT EXISTS savings_goals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  target_amount   NUMERIC NOT NULL,
  current_amount  NUMERIC DEFAULT 0,
  deadline        DATE,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Exit Prerequisites — checklist items for geo-arbitrage exit readiness
CREATE TABLE IF NOT EXISTS exit_prerequisites (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label     TEXT NOT NULL,
  met       BOOLEAN DEFAULT FALSE,
  weight    NUMERIC DEFAULT 1,                  -- relative importance weight
  category  TEXT,                               -- e.g. 'legal', 'financial', 'personal'
  notes     TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Milestones — major project milestones
CREATE TABLE IF NOT EXISTS milestones (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT,
  target_date DATE,
  status      TEXT DEFAULT 'pending',           -- 'pending', 'in_progress', 'completed'
  priority    INTEGER DEFAULT 1,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Monthly Scan Results — automated country risk monitoring
CREATE TABLE IF NOT EXISTS monthly_scan_results (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_date     DATE NOT NULL,
  country_code  TEXT NOT NULL,                  -- ISO 3166-1 alpha-2
  risk_category TEXT NOT NULL,                  -- e.g. 'political', 'economic', 'security'
  risk_level    TEXT,                           -- 'low', 'medium', 'high', 'critical'
  summary       TEXT,
  source        TEXT,                           -- 'GDELT', 'ACLED', 'Polymarket'
  raw_data      JSONB,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Decisions — decision log for major choices
CREATE TABLE IF NOT EXISTS decisions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title               TEXT NOT NULL,
  description         TEXT,
  decision_date       DATE,
  reversibility_score INTEGER CHECK (reversibility_score BETWEEN 1 AND 10),
  status              TEXT DEFAULT 'pending',   -- 'pending', 'decided', 'executed', 'reversed'
  outcome             TEXT,
  notes               TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Monthly Reports — generated monthly summary reports
CREATE TABLE IF NOT EXISTS monthly_reports (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_month  DATE NOT NULL,                  -- always YYYY-MM-01
  content       TEXT,
  summary       TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for common queries
CREATE INDEX IF NOT EXISTS idx_target_countries_code ON target_countries (code);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties (status);
CREATE INDEX IF NOT EXISTS idx_portfolio_holdings_type ON portfolio_holdings (type);
CREATE INDEX IF NOT EXISTS idx_budget_month ON budget (month);
CREATE INDEX IF NOT EXISTS idx_budget_type ON budget (type);
CREATE INDEX IF NOT EXISTS idx_wealth_snapshots_date ON wealth_snapshots (snapshot_date DESC);
CREATE INDEX IF NOT EXISTS idx_calendar_events_date ON calendar_events (event_date);
CREATE INDEX IF NOT EXISTS idx_calendar_events_source ON calendar_events (source);
CREATE INDEX IF NOT EXISTS idx_monthly_scan_results_date ON monthly_scan_results (scan_date DESC);
CREATE INDEX IF NOT EXISTS idx_monthly_scan_results_country ON monthly_scan_results (country_code);

-- Schema reload
NOTIFY pgrst, 'reload schema';
