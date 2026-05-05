import { env } from './env';

// For now, we'll use Supabase's PostgreSQL directly
// If you need a separate database connection, add it here

export const dbConfig = {
  connectionString: env.DATABASE_URL,
  ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};

// You can add connection pooling here if needed
// export const pool = new Pool(dbConfig);