import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { env } from "$env/dynamic/private";

const filename = env.DATABASE_URL?.startsWith("file:")
  ? env.DATABASE_URL.replace("file:", "")
  : "dev.sqlite";

const sqlite = new Database(filename);
export const db = drizzle(sqlite);
