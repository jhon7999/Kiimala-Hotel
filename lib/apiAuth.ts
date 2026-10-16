import { and, eq } from "drizzle-orm";
import { getDb, tokensApi } from "./db";
import { hashToken } from "./tokens";

// Límite sencillo por token (en memoria de la instancia). Para tráfico alto, pasar a un almacén compartido.
const ventana = new Map<number, { n: number; desde: number }>();
const MAX_POR_MINUTO = 60;

export type ResultadoApi = { ok: true; id: number; nombre: string } | { ok: false; status: 401 | 429; error: string };

/** Valida "Authorization: Bearer kmk_…" contra el hash guardado. */
export async function autenticarApi(req: Request): Promise<ResultadoApi> {
  const cab = req.headers.get("authorization") ?? "";
  const token = cab.startsWith("Bearer ") ? cab.slice(7).trim() : "";
  if (!token.startsWith("kmk_") || token.length > 100) return { ok: false, status: 401, error: "Token inválido" };
  const db = await getDb();
  const [t] = await db.select().from(tokensApi).where(and(eq(tokensApi.tokenHash, hashToken(token)), eq(tokensApi.activo, true)));
  if (!t) return { ok: false, status: 401, error: "Token inválido" };

  const ahora = Date.now();
  const w = ventana.get(t.id);
  if (!w || ahora - w.desde > 60_000) ventana.set(t.id, { n: 1, desde: ahora });
  else if (++w.n > MAX_POR_MINUTO) return { ok: false, status: 429, error: "Demasiadas consultas por minuto" };

  if (!t.ultimoUso || ahora - t.ultimoUso.getTime() > 60_000) await db.update(tokensApi).set({ ultimoUso: new Date() }).where(eq(tokensApi.id, t.id));
  return { ok: true, id: t.id, nombre: t.nombre };
}
