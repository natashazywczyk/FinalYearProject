// Database types matching your Supabase schema

export interface Account {
  id: number;
  created_at: string;
  user_id: string;
  age_group?: string | null;
  product_type?: string | null;
  product_brand?: string | null;
  product_name?: string | null;
  product_price?: string | null;
  product_image_url?: string | null;
}

export interface CravingLevel {
  id: number;
  user_id: string;
  date: string;
  level: number;
}

export interface DailyPurchase {
  id: number;
  user_id: string;
  date: string;
  purchased: boolean;
  created_at: string;
}

export type AccountInsert = Omit<Account, 'id' | 'created_at'>;
export type CravingLevelInsert = Omit<CravingLevel, 'id'>;
export type DailyPurchaseInsert = Omit<DailyPurchase, 'id' | 'created_at'>;
