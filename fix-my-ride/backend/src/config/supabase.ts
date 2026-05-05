import { createClient } from '@supabase/supabase-js';
import { env } from './env';

export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY
);

export const supabaseAdmin = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

// Database types (generated from Supabase)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          phone: string | null;
          password_hash: string;
          user_type: 'driver' | 'mechanic' | 'admin';
          first_name: string | null;
          last_name: string | null;
          profile_photo_url: string | null;
          rating: number;
          total_ratings: number;
          is_verified: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          phone?: string | null;
          password_hash: string;
          user_type: 'driver' | 'mechanic' | 'admin';
          first_name?: string | null;
          last_name?: string | null;
          profile_photo_url?: string | null;
          rating?: number;
          total_ratings?: number;
          is_verified?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          phone?: string | null;
          password_hash?: string;
          user_type?: 'driver' | 'mechanic' | 'admin';
          first_name?: string | null;
          last_name?: string | null;
          profile_photo_url?: string | null;
          rating?: number;
          total_ratings?: number;
          is_verified?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      // Add other table types as needed...
    };
  };
};