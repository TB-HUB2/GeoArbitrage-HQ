-- ============================================================
-- 03: Chat Memory + Episodic Retrieval
-- Chat history with vector embeddings for episodic memory
-- ============================================================

-- 1. Chat History table
CREATE TABLE IF NOT EXISTS chat_history (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      TEXT NOT NULL,
  role            TEXT NOT NULL,                 -- 'user' or 'assistant'
  content         TEXT NOT NULL,
  source          TEXT DEFAULT 'mcp',            -- 'mcp' or 'telegram'
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  embedding       vector(1024),                  -- Voyage AI voyage-4-lite
  embedding_model TEXT DEFAULT 'voyage-4-lite'
);

-- 2. Indices
CREATE INDEX IF NOT EXISTS idx_chat_history_session ON chat_history (session_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_created ON chat_history (created_at DESC);

-- 3. HNSW index for similarity search on chat_history
CREATE INDEX IF NOT EXISTS idx_chat_history_embedding
  ON chat_history USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- 4. RPC function: match_chat_history()
-- Finds similar past user messages via cosine similarity
CREATE OR REPLACE FUNCTION match_chat_history(
  query_embedding vector(1024),
  match_threshold FLOAT DEFAULT 0.75,
  match_count     INT   DEFAULT 3
)
RETURNS TABLE (
  id         UUID,
  content    TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ,
  similarity FLOAT
)
LANGUAGE SQL STABLE AS $$
  SELECT
    id,
    content,
    session_id,
    created_at,
    1 - (embedding <=> query_embedding) AS similarity
  FROM chat_history
  WHERE embedding IS NOT NULL
    AND role = 'user'
    AND 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;

-- 5. Grants
GRANT EXECUTE ON FUNCTION match_chat_history(vector(1024), FLOAT, INT) TO anon;
GRANT EXECUTE ON FUNCTION match_chat_history(vector(1024), FLOAT, INT) TO authenticated;
GRANT EXECUTE ON FUNCTION match_chat_history(vector(1024), FLOAT, INT) TO service_role;

-- 6. Schema reload
NOTIFY pgrst, 'reload schema';
