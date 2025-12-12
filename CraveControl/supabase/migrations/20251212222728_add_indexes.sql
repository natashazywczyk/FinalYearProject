-- Add indexes on foreign key columns for better query performance
CREATE INDEX IF NOT EXISTS idx_account_user_id ON public.account(user_id);
CREATE INDEX IF NOT EXISTS idx_craving_level_user_id ON public.craving_level(user_id);
CREATE INDEX IF NOT EXISTS idx_craving_level_date ON public.craving_level(date);
