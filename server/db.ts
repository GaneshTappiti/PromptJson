import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString);
export const db = drizzle(sql);
