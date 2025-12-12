-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert their own account" ON public.account;
DROP POLICY IF EXISTS "Users can view their own account" ON public.account;
DROP POLICY IF EXISTS "Users can insert their own craving levels" ON public.craving_level;
DROP POLICY IF EXISTS "Users can view their own craving levels" ON public.craving_level;
DROP POLICY IF EXISTS "Users can update their own craving levels" ON public.craving_level;
DROP POLICY IF EXISTS "Users can delete their own craving levels" ON public.craving_level;

-- Create optimized policies using current_setting for better performance
-- Account policies
CREATE POLICY "Users can insert their own account"
  ON public.account
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid
  );

CREATE POLICY "Users can view their own account"
  ON public.account
  FOR SELECT
  TO authenticated
  USING (
    user_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid
  );

-- Craving level policies
CREATE POLICY "Users can insert their own craving levels"
  ON public.craving_level
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid
  );

CREATE POLICY "Users can view their own craving levels"
  ON public.craving_level
  FOR SELECT
  TO authenticated
  USING (
    user_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid
  );

CREATE POLICY "Users can update their own craving levels"
  ON public.craving_level
  FOR UPDATE
  TO authenticated
  USING (
    user_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid
  )
  WITH CHECK (
    user_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid
  );

CREATE POLICY "Users can delete their own craving levels"
  ON public.craving_level
  FOR DELETE
  TO authenticated
  USING (
    user_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid
  );
