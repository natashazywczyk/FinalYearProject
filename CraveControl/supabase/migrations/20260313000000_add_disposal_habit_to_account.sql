-- Add disposal_habit field to account table
-- Values: 'always', 'sometimes', 'rarely'
ALTER TABLE public.account
ADD COLUMN disposal_habit TEXT CHECK (disposal_habit IN ('always', 'sometimes', 'rarely'));
