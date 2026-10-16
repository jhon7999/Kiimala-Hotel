import { defineConfig } from "drizzle-kit";

const url = process.env.DATABASE_URL;
export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  ...(url ? { dbCredentials: { url } } : { driver: "pglite", dbCredentials: { url: process.env.PGLITE_DIR ?? ".data/pglite" } }),
});
