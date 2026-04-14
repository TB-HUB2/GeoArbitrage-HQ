-- ============================================================
-- 08: Seed Data — Fictional example data for testing
-- All data is generic/fictional. No personal information.
-- ============================================================

-- 1. Target Countries (public information, no personal data)
INSERT INTO target_countries (name, code, priority, status, tax_rate, cost_of_living, safety_score, internet_speed, timezone_offset, notes) VALUES
  ('Portugal',               'PT', 1, 'active',   20.0, 1200, 82, 120, 0,   'NHR regime available. EU member state.'),
  ('Georgia',                'GE', 2, 'research',  1.0,  700, 65,  80, 4,   'Territorial taxation. Low cost of living.'),
  ('United Arab Emirates',   'AE', 3, 'research',  0.0, 2500, 90, 200, 4,   'No personal income tax. High cost of living.')
ON CONFLICT DO NOTHING;

-- 2. Example Property (fictional)
INSERT INTO properties (name, address, city, country, current_value, current_value_date, loan_amount_current, loan_rate, loan_monthly_payment, loan_bank, loan_zinsbindung_end, monthly_rent_gross, monthly_hausgeld, monthly_nicht_umlagefaehig, status, notes) VALUES
  ('Beispiel-Wohnung Musterstadt', 'Musterstrasse 42', 'Musterstadt', 'DE', 250000, '2026-01-15', 180000, 2.1, 850, 'Musterbank AG', '2035-06-30', 950, 280, 80, 'active', 'Fictional example property for testing.')
ON CONFLICT DO NOTHING;

-- 3. Portfolio Holdings (generic ETFs)
INSERT INTO portfolio_holdings (name, type, isin, ticker, shares, avg_price, current_price, sparplan_monthly, broker, notes) VALUES
  ('Vanguard FTSE All-World',  'ETF',       'IE00BK5BQT80', 'VWCE', 50,   98.50, 112.30, 500, 'Example Broker', 'Global equity ETF'),
  ('iShares Core MSCI World',  'ETF',       'IE00B4L5Y983', 'IWDA', 30,  72.00,  81.50, 200, 'Example Broker', 'Developed markets ETF'),
  ('Xetra-Gold',               'ETC',       'DE000A0S9GB0', 'XGLD', 10,  55.00,  68.20,   0, 'Example Broker', 'Physical gold ETC')
ON CONFLICT DO NOTHING;

-- 4. Budget entries (generic categories, month = 2026-04-01)
INSERT INTO budget (month, category, type, amount_plan, amount_actual, notes) VALUES
  ('2026-04-01', 'gehalt',          'income',     4500, 4500, 'Monthly salary'),
  ('2026-04-01', 'mieteinnahmen',   'income',      950,  950, 'Rental income from property'),
  ('2026-04-01', 'miete',           'expense',    1200, 1200, 'Rent for primary residence'),
  ('2026-04-01', 'etf_sparplan',    'investment',  700,  700, 'ETF savings plan'),
  ('2026-04-01', 'notreserve',      'reserve',     300,  300, 'Emergency fund contribution')
ON CONFLICT DO NOTHING;

-- 5. Wealth Snapshot
INSERT INTO wealth_snapshots (snapshot_date, nettovermoegen, immobilien_wert, portfolio_wert, cash, schulden, notes) VALUES
  ('2026-04-01', 120000, 250000, 15000, 25000, 180000, 'Example snapshot for testing')
ON CONFLICT DO NOTHING;

-- 6. Savings Goals
INSERT INTO savings_goals (name, target_amount, current_amount, deadline, notes) VALUES
  ('Emergency Fund',    15000,  8500, '2026-12-31', '6 months of expenses'),
  ('Relocation Budget', 30000, 12000, '2027-06-30', 'Moving costs + buffer for geo-arbitrage')
ON CONFLICT DO NOTHING;

-- 7. Calendar Events
INSERT INTO calendar_events (title, description, event_date, category, status, source) VALUES
  ('Tax Declaration Deadline',      'Annual tax return due',                   '2026-07-31 23:59:00+02', 'steuer',    'active', 'manual'),
  ('Property Insurance Renewal',    'Annual insurance renewal for Musterstadt','2026-09-01 10:00:00+02', 'immobilie', 'active', 'manual'),
  ('Visa Research: Portugal D7',    'Research D7 passive income visa',         '2026-05-15 14:00:00+02', 'visum',     'active', 'manual')
ON CONFLICT DO NOTHING;

-- 8. Exit Prerequisites
INSERT INTO exit_prerequisites (label, met, weight, category, notes) VALUES
  ('6 months emergency fund saved',    false, 2, 'financial', 'Target: 15,000 EUR'),
  ('Tax advisor consulted on exit',    false, 3, 'legal',     'Need specialist for Wegzugsbesteuerung')
ON CONFLICT DO NOTHING;

-- Schema reload
NOTIFY pgrst, 'reload schema';
