-- Add unique constraint to craving_level to ensure one entry per user per day
ALTER TABLE public.craving_level
ADD CONSTRAINT craving_level_user_date_unique UNIQUE (user_id, date);
