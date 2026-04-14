-- ============================================================
-- 06: Knowledge Gap Detection — Self-learning System
-- Logs detected knowledge gaps for continuous improvement
-- ============================================================

-- 1. Knowledge Gaps table
CREATE TABLE IF NOT EXISTS knowledge_gaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- What was asked?
  session_id TEXT,
  user_query TEXT NOT NULL,
  query_embedding vector(1024),

  -- What is missing?
  detected_gap TEXT NOT NULL,
  gap_category TEXT NOT NULL,               -- 'missing_law', 'missing_dba', 'missing_ruling',
                                            -- 'outdated_info', 'missing_topic', 'insufficient_depth'
  affected_bereich TEXT,
  closest_agent TEXT,

  -- RAG context: what did the search return?
  rag_top_similarity FLOAT,
  rag_results_count INTEGER DEFAULT 0,
  rag_query_used TEXT,

  -- Recommended action
  recommended_action TEXT NOT NULL,         -- 'add_kb_chunk', 'update_kb_chunk', 'add_law_pdf',
                                            -- 'add_dba_pdf', 'extend_agent', 'new_agent',
                                            -- 'human_expert'
  recommended_source TEXT,
  priority TEXT DEFAULT 'medium',           -- 'critical', 'high', 'medium', 'low'

  -- Resolution
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT,                         -- 'auto_ingest', 'manual_kb_update', 'new_agent',
                                            -- 'human_expert', 'deemed_irrelevant'
  resolution_notes TEXT,
  resolution_chunk_id TEXT
);

-- 2. Indices
CREATE INDEX IF NOT EXISTS idx_knowledge_gaps_created ON knowledge_gaps (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_knowledge_gaps_category ON knowledge_gaps (gap_category);
CREATE INDEX IF NOT EXISTS idx_knowledge_gaps_bereich ON knowledge_gaps (affected_bereich);
CREATE INDEX IF NOT EXISTS idx_knowledge_gaps_resolved ON knowledge_gaps (resolved);
CREATE INDEX IF NOT EXISTS idx_knowledge_gaps_priority ON knowledge_gaps (priority);

-- 3. HNSW index for gap clustering
CREATE INDEX IF NOT EXISTS idx_knowledge_gaps_embedding ON knowledge_gaps
  USING hnsw (query_embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- 4. RLS
ALTER TABLE knowledge_gaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all" ON knowledge_gaps
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_read" ON knowledge_gaps
  FOR SELECT TO authenticated USING (true);

-- 5. View: open gaps by priority
CREATE OR REPLACE VIEW v_knowledge_gaps_open AS
SELECT
  id, created_at, gap_category, affected_bereich,
  detected_gap, recommended_action, recommended_source, priority,
  rag_top_similarity, rag_results_count
FROM knowledge_gaps
WHERE resolved = FALSE
ORDER BY
  CASE priority
    WHEN 'critical' THEN 1
    WHEN 'high' THEN 2
    WHEN 'medium' THEN 3
    WHEN 'low' THEN 4
  END,
  created_at DESC;

-- 6. View: gap frequency per domain (for quarterly review)
CREATE OR REPLACE VIEW v_knowledge_gaps_frequency AS
SELECT
  affected_bereich,
  gap_category,
  COUNT(*) AS gap_count,
  COUNT(*) FILTER (WHERE resolved = FALSE) AS open_count,
  COUNT(*) FILTER (WHERE resolved = TRUE) AS resolved_count,
  ROUND(AVG(rag_top_similarity)::numeric, 3) AS avg_similarity,
  MAX(created_at) AS last_seen
FROM knowledge_gaps
GROUP BY affected_bereich, gap_category
ORDER BY gap_count DESC;

-- 7. View: monthly gap trends
CREATE OR REPLACE VIEW v_knowledge_gaps_monthly AS
SELECT
  DATE_TRUNC('month', created_at) AS month,
  COUNT(*) AS total_gaps,
  COUNT(*) FILTER (WHERE resolved = TRUE) AS resolved_gaps,
  COUNT(*) FILTER (WHERE priority IN ('critical', 'high')) AS high_priority_gaps,
  ROUND(AVG(rag_top_similarity)::numeric, 3) AS avg_similarity
FROM knowledge_gaps
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- 8. RPC: find similar open gaps (prevents duplicates)
CREATE OR REPLACE FUNCTION find_similar_gaps(
  gap_embedding vector(1024),
  similarity_threshold FLOAT DEFAULT 0.85,
  max_results INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  detected_gap TEXT,
  gap_category TEXT,
  affected_bereich TEXT,
  created_at TIMESTAMPTZ,
  similarity FLOAT
)
LANGUAGE SQL STABLE AS $$
  SELECT
    id, detected_gap, gap_category, affected_bereich, created_at,
    1 - (query_embedding <=> gap_embedding) AS similarity
  FROM knowledge_gaps
  WHERE resolved = FALSE
    AND query_embedding IS NOT NULL
    AND 1 - (query_embedding <=> gap_embedding) > similarity_threshold
  ORDER BY query_embedding <=> gap_embedding
  LIMIT max_results;
$$;

GRANT EXECUTE ON FUNCTION find_similar_gaps(vector(1024), FLOAT, INT) TO service_role;

-- 9. RPC: mark gap as resolved
CREATE OR REPLACE FUNCTION resolve_knowledge_gap(
  gap_id UUID,
  resolution TEXT,
  notes TEXT DEFAULT NULL,
  chunk_id TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE SQL AS $$
  UPDATE knowledge_gaps SET
    resolved = TRUE,
    resolved_at = NOW(),
    resolved_by = resolution,
    resolution_notes = notes,
    resolution_chunk_id = chunk_id
  WHERE id = gap_id;
$$;

GRANT EXECUTE ON FUNCTION resolve_knowledge_gap(UUID, TEXT, TEXT, TEXT) TO service_role;

-- 10. Schema reload
NOTIFY pgrst, 'reload schema';
