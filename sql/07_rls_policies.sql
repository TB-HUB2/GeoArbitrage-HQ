-- ============================================================
-- 07: Auth + RLS Hardening
-- Restricts all sensitive tables to the authenticated owner
--
-- SETUP: Replace YOUR_USER_UUID below with your actual Supabase
-- user UUID. Find it in Supabase Dashboard -> Authentication -> Users.
-- ============================================================

-- ============================================================
-- IMPORTANT: Set your user UUID here before running this script!
-- Example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
-- ============================================================

DO $$
DECLARE
  -- REPLACE WITH YOUR USER UUID (Supabase -> Authentication -> Users)
  owner_uuid UUID := '00000000-0000-0000-0000-000000000000';
  tbl TEXT;
  sensitive_tables TEXT[] := ARRAY[
    'budget',
    'portfolio_holdings',
    'portfolio_lots',
    'wealth_snapshots',
    'calendar_events',
    'chat_history',
    'properties',
    'savings_goals',
    'agent_logs',
    'decisions',
    'monthly_reports',
    'monthly_scan_results',
    'exit_prerequisites',
    'milestones',
    'target_countries'
  ];
BEGIN
  -- Validate that the UUID has been changed from the placeholder
  IF owner_uuid = '00000000-0000-0000-0000-000000000000' THEN
    RAISE EXCEPTION 'ERROR: You must replace the placeholder UUID with your actual Supabase user UUID! Find it in Supabase Dashboard -> Authentication -> Users.';
  END IF;

  FOREACH tbl IN ARRAY sensitive_tables LOOP
    -- Only process tables that exist
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = tbl) THEN
      -- Enable RLS (idempotent)
      EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', tbl);

      -- Drop old policies (all common names)
      EXECUTE format('DROP POLICY IF EXISTS "anon_read" ON %I', tbl);
      EXECUTE format('DROP POLICY IF EXISTS "authenticated_read" ON %I', tbl);
      EXECUTE format('DROP POLICY IF EXISTS "service_role_all" ON %I', tbl);
      EXECUTE format('DROP POLICY IF EXISTS "owner_access" ON %I', tbl);
      EXECUTE format('DROP POLICY IF EXISTS "Only owner" ON %I', tbl);

      -- New policy: only the owner (authenticated + auth.uid() match)
      EXECUTE format(
        'CREATE POLICY "owner_access" ON %I FOR ALL TO authenticated USING (auth.uid() = %L::uuid) WITH CHECK (auth.uid() = %L::uuid)',
        tbl, owner_uuid, owner_uuid
      );

      -- service_role keeps full access (for n8n workflows)
      EXECUTE format(
        'CREATE POLICY "service_role_all" ON %I FOR ALL TO service_role USING (true) WITH CHECK (true)',
        tbl
      );

      RAISE NOTICE 'RLS hardened: %', tbl;
    ELSE
      RAISE NOTICE 'Table not found (skipped): %', tbl;
    END IF;
  END LOOP;
END $$;

-- Knowledge Base: readable by all authenticated users (for RAG search)
-- but only owner can write
DO $$
DECLARE
  -- REPLACE WITH YOUR USER UUID (same as above)
  owner_uuid UUID := '00000000-0000-0000-0000-000000000000';
BEGIN
  -- Skip validation here since the first block already validated
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'knowledge_base') THEN
    ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "anon_read" ON knowledge_base;
    DROP POLICY IF EXISTS "authenticated_read" ON knowledge_base;
    DROP POLICY IF EXISTS "service_role_all" ON knowledge_base;
    DROP POLICY IF EXISTS "owner_access" ON knowledge_base;
    DROP POLICY IF EXISTS "owner_write" ON knowledge_base;

    -- Authenticated can read (for RAG search)
    CREATE POLICY "authenticated_read" ON knowledge_base
      FOR SELECT TO authenticated USING (true);

    -- Only owner can write
    CREATE POLICY "owner_write" ON knowledge_base
      FOR ALL TO authenticated
      USING (auth.uid() = owner_uuid)
      WITH CHECK (auth.uid() = owner_uuid);

    -- service_role for n8n ingest
    CREATE POLICY "service_role_all" ON knowledge_base
      FOR ALL TO service_role USING (true) WITH CHECK (true);

    RAISE NOTICE 'RLS hardened: knowledge_base (read: all authenticated, write: owner only)';
  END IF;
END $$;

-- Knowledge Gaps: same as Knowledge Base
DO $$
DECLARE
  -- REPLACE WITH YOUR USER UUID (same as above)
  owner_uuid UUID := '00000000-0000-0000-0000-000000000000';
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'knowledge_gaps') THEN
    ALTER TABLE knowledge_gaps ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "anon_read" ON knowledge_gaps;
    DROP POLICY IF EXISTS "authenticated_read" ON knowledge_gaps;
    DROP POLICY IF EXISTS "service_role_all" ON knowledge_gaps;
    DROP POLICY IF EXISTS "owner_access" ON knowledge_gaps;
    DROP POLICY IF EXISTS "owner_write" ON knowledge_gaps;

    CREATE POLICY "authenticated_read" ON knowledge_gaps
      FOR SELECT TO authenticated USING (true);

    CREATE POLICY "owner_write" ON knowledge_gaps
      FOR ALL TO authenticated
      USING (auth.uid() = owner_uuid)
      WITH CHECK (auth.uid() = owner_uuid);

    CREATE POLICY "service_role_all" ON knowledge_gaps
      FOR ALL TO service_role USING (true) WITH CHECK (true);

    RAISE NOTICE 'RLS hardened: knowledge_gaps';
  END IF;
END $$;

-- Schema reload
NOTIFY pgrst, 'reload schema';
