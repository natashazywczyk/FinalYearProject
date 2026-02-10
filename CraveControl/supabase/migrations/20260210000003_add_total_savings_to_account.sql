-- Add total_savings column to account table
ALTER TABLE public.account
ADD COLUMN total_savings NUMERIC(10, 2) DEFAULT 0 NOT NULL;
