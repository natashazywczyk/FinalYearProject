-- Create account table
CREATE TABLE IF NOT EXISTS public.account (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE
);

-- Create craving_level table
CREATE TABLE IF NOT EXISTS public.craving_level (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  level SMALLINT NOT NULL CHECK (level >= 0 AND level <= 10)
);

-- Enable Row Level Security
ALTER TABLE public.account ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.craving_level ENABLE ROW LEVEL SECURITY;

-- Account policies
CREATE POLICY "Users can insert their own account"
  ON public.account
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own account"
  ON public.account
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Craving level policies
CREATE POLICY "Users can insert their own craving levels"
  ON public.craving_level
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own craving levels"
  ON public.craving_level
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own craving levels"
  ON public.craving_level
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own craving levels"
  ON public.craving_level
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
