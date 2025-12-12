// Database types matching your Supabase schema

export interface Account {
  id: number;
  created_at: string;
  user_id: string;
}

export interface CravingLevel {
  id: number;
  user_id: string;
  date: string;
  level: number;
}

export type AccountInsert = Omit<Account, 'id' | 'created_at'>;
export type CravingLevelInsert = Omit<CravingLevel, 'id'>;
