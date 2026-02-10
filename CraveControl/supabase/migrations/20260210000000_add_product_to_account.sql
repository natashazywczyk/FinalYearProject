-- Add product fields to account table
ALTER TABLE public.account
ADD COLUMN product_type TEXT,
ADD COLUMN product_brand TEXT,
ADD COLUMN product_name TEXT,
ADD COLUMN product_price TEXT,
ADD COLUMN product_image_url TEXT;
