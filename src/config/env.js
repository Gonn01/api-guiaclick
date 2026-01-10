import dotenv from "dotenv";

// Allows overriding env file path (useful for CI/serverless)
dotenv.config({ path: process.env.ENV_FILE || ".env" });

export const PORT = Number(process.env.PORT || 3000);

export const DATABASE_URL = process.env.DATABASE_URL;

// JWT (your app login)
export const JWT_SECRET = process.env.JWT_SECRET;

// Supabase JWT (optional)
export const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

// Algolia (optional)
export const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
export const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY;
export const ALGOLIA_INDEX_NAME = process.env.ALGOLIA_INDEX_NAME;
