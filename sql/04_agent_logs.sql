-- ============================================================
-- 04: Agent Logging + Cost Tracking
-- Tracks all AI agent executions, tokens, and costs
-- ============================================================

-- 1. agent_logs table
CREATE TABLE IF NOT EXISTS agent_logs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id        TEXT NOT NULL,
  agent_name        TEXT NOT NULL,
  model             TEXT NOT NULL DEFAULT 'claude-sonnet-4-6',
  input_summary     TEXT,          -- first 200 chars of input
  output_summary    TEXT,          -- first 200 chars of output
  confidence_score  TEXT,          -- 'hoch', 'mittel', 'niedrig'
  validation_status TEXT,          -- 'approved', 'rejected', 'warning', NULL
  escalated         BOOLEAN DEFAULT FALSE,
  tokens_in         INTEGER DEFAULT 0,
  tokens_out        INTEGER DEFAULT 0,
  cost_eur          NUMERIC(10, 6) DEFAULT 0,
  execution_time_ms INTEGER DEFAULT 0,
  error_message     TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Indices for common queries
CREATE INDEX IF NOT EXISTS idx_agent_logs_session
  ON agent_logs (session_id);

CREATE INDEX IF NOT EXISTS idx_agent_logs_created
  ON agent_logs (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_agent_logs_agent
  ON agent_logs (agent_name);

-- 3. Monthly cost aggregation view
CREATE OR REPLACE VIEW v_agent_costs_monthly AS
SELECT
  DATE_TRUNC('month', created_at) AS month,
  SUM(cost_eur)                   AS total_cost_eur,
  COUNT(*)                        AS total_calls,
  SUM(tokens_in + tokens_out)     AS total_tokens,
  SUM(tokens_in)                  AS total_tokens_in,
  SUM(tokens_out)                 AS total_tokens_out,
  ROUND(AVG(execution_time_ms))   AS avg_execution_ms
FROM agent_logs
GROUP BY 1
ORDER BY 1 DESC;

-- 4. Per-agent cost aggregation view
CREATE OR REPLACE VIEW v_agent_costs_by_agent AS
SELECT
  agent_name,
  model,
  COUNT(*)                        AS total_calls,
  SUM(cost_eur)                   AS total_cost_eur,
  SUM(tokens_in + tokens_out)     AS total_tokens,
  ROUND(AVG(execution_time_ms))   AS avg_execution_ms,
  SUM(CASE WHEN escalated THEN 1 ELSE 0 END) AS escalation_count
FROM agent_logs
GROUP BY agent_name, model
ORDER BY total_cost_eur DESC;

-- 5. RLS Policies
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (n8n uses service role key)
CREATE POLICY "service_role_all" ON agent_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Authenticated can only read (dashboard)
CREATE POLICY "authenticated_read" ON agent_logs
  FOR SELECT
  TO authenticated
  USING (true);

-- 6. Grant access to views
GRANT SELECT ON v_agent_costs_monthly TO anon, authenticated, service_role;
GRANT SELECT ON v_agent_costs_by_agent TO anon, authenticated, service_role;

-- 7. Schema reload
NOTIFY pgrst, 'reload schema';
