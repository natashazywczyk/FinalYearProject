-- Returns aggregated disposal habit counts per age group,
-- bypassing RLS so all authenticated and anon callers can see community stats.
CREATE OR REPLACE FUNCTION get_disposal_habit_stats()
RETURNS TABLE(age_group text, always bigint, sometimes bigint, rarely bigint)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT
    age_group,
    COUNT(*) FILTER (WHERE disposal_habit = 'always')    AS always,
    COUNT(*) FILTER (WHERE disposal_habit = 'sometimes') AS sometimes,
    COUNT(*) FILTER (WHERE disposal_habit = 'rarely')    AS rarely
  FROM public.account
  WHERE disposal_habit IS NOT NULL
    AND age_group IS NOT NULL
  GROUP BY age_group;
$$;

GRANT EXECUTE ON FUNCTION get_disposal_habit_stats() TO anon, authenticated;
