import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "./schema";

export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

const g = globalThis as unknown as { __kiimalaDb?: Promise<Db> };

/**
 * Producción: Postgres vía DATABASE_URL.
 * Desarrollo local sin DATABASE_URL: Postgres embebido (PGlite) en .data/ — datos solo de prueba.
 */
export function getDb(): Promise<Db> {
  g.__kiimalaDb ??= (async () => {
    const url = process.env.DATABASE_URL;
    if (url) {
      const { default: postgres } = await import("postgres");
      const { drizzle } = await import("drizzle-orm/postgres-js");
      return drizzle(postgres(url, { max: 5, prepare: false }), { schema }) as unknown as Db;
    }
    if (process.env.VERCEL) throw new Error("Falta DATABASE_URL en el despliegue (Vercel)");
    const { mkdirSync } = await import("node:fs");
    const dir = process.env.PGLITE_DIR ?? ".data/pglite";
    mkdirSync((await import("node:path")).dirname(dir), { recursive: true });
    const { PGlite } = await import("@electric-sql/pglite");
    const { drizzle } = await import("drizzle-orm/pglite");
    return drizzle(new PGlite(dir), { schema }) as unknown as Db;
  })();
  return g.__kiimalaDb;
}

export * from "./schema";
