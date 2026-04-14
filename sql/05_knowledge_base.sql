-- ============================================================
-- 05: Knowledge Base + Embedding Pipeline
-- RAG-enabled knowledge store with vector similarity search
-- ============================================================

-- 1. Knowledge Base table
CREATE TABLE IF NOT EXISTS knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Chunk identification
  chunk_id TEXT UNIQUE NOT NULL,           -- e.g. "tax/wegzugssteuer-§6-astg" or "astg/chunk-003"
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  bereich TEXT NOT NULL,                   -- e.g. "tax", "immobilien", "shared"
  relevante_agenten TEXT[] NOT NULL,       -- e.g. {"Tax Architect", "CFO"}

  -- Source metadata
  source_type TEXT,                        -- 'md_chunk', 'law', 'dba', 'bfh_ruling', 'article'
  source_name TEXT,                        -- e.g. "§2 AStG" or "DBA DE-UAE"
  last_verified DATE,
  verification_status TEXT DEFAULT 'unverified',

  -- Embedding + metadata
  embedding vector(1024),                  -- Voyage AI voyage-4-lite
  token_count INTEGER,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. HNSW index for similarity search
CREATE INDEX IF NOT EXISTS idx_knowledge_base_embedding ON knowledge_base
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- 3. Additional indices
CREATE INDEX IF NOT EXISTS idx_knowledge_base_bereich ON knowledge_base (bereich);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_source_type ON knowledge_base (source_type);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_chunk_id ON knowledge_base (chunk_id);

-- 4. RLS
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
CREATE POLICY "service_role_all" ON knowledge_base
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "authenticated_read" ON knowledge_base
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "anon_read" ON knowledge_base
  FOR SELECT
  TO anon
  USING (true);

-- 6. RPC function for similarity search
CREATE OR REPLACE FUNCTION match_knowledge(
  query_embedding  vector(1024),
  match_threshold  FLOAT   DEFAULT 0.7,
  match_count      INT     DEFAULT 5,
  filter_bereiche  TEXT[]  DEFAULT NULL
)
RETURNS TABLE (
  chunk_id    TEXT,
  title       TEXT,
  content     TEXT,
  bereich     TEXT,
  source_name TEXT,
  source_type TEXT,
  similarity  FLOAT
)
LANGUAGE SQL STABLE AS $$
  SELECT
    chunk_id,
    title,
    content,
    bereich,
    source_name,
    source_type,
    1 - (embedding <=> query_embedding) AS similarity
  FROM knowledge_base
  WHERE (filter_bereiche IS NULL OR bereich = ANY(filter_bereiche))
    AND embedding IS NOT NULL
    AND 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;

-- 7. Grants for RPC function
GRANT EXECUTE ON FUNCTION match_knowledge(vector(1024), FLOAT, INT, TEXT[]) TO anon;
GRANT EXECUTE ON FUNCTION match_knowledge(vector(1024), FLOAT, INT, TEXT[]) TO authenticated;
GRANT EXECUTE ON FUNCTION match_knowledge(vector(1024), FLOAT, INT, TEXT[]) TO service_role;

-- 8. Stats view
CREATE OR REPLACE VIEW v_knowledge_base_stats AS
SELECT
  bereich,
  source_type,
  COUNT(*) AS chunk_count,
  SUM(token_count) AS total_tokens,
  COUNT(*) FILTER (WHERE embedding IS NOT NULL) AS embedded_count,
  COUNT(*) FILTER (WHERE embedding IS NULL) AS pending_count
FROM knowledge_base
GROUP BY bereich, source_type
ORDER BY bereich, source_type;

-- 9. Schema reload
NOTIFY pgrst, 'reload schema';
