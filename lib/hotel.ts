import { and, asc, count, desc, eq, gt, inArray, lt, or, sql } from "drizzle-orm";
import { bloqueos, getDb, habitaciones, reservas, tareasLimpieza, type Db } from "./db";
import { hoyCO, sumarDias } from "./fechas";

export type Hab = typeof habitaciones.$inferSelect;
export type Reserva = typeof reservas.$inferSelect;
export type Bloqueo = typeof bloqueos.$inferSelect;

const ACTIVAS = ["confirmada", "en_casa"] as const;

export async function listarHabitaciones(soloActivas = true, db?: Db) {
  const d = db ?? (await getDb());
  const q = d.select().from(habitaciones);
  return (soloActivas ? q.where(eq(habitaciones.activa, true)) : q).orderBy(asc(habitaciones.orden), asc(habitaciones.id));
}

/**
 * Reservas activas que ocupan alguna noche de [desde, hasta). La noche de salida queda libre.
 * Un huésped "en casa" que aún no hizo check-out sigue ocupando hasta hoy aunque su fecha de salida ya pasó.
 */
function cruzaRango(desde: string, hasta: string) {
  const manana = sumarDias(hoyCO(), 1);
  return and(
    inArray(reservas.estado, [...ACTIVAS]),
    lt(reservas.entrada, hasta),
    or(
      gt(reservas.salida, desde),
      and(eq(reservas.estado, "en_casa"), sql`${manana}::date > ${desde}::date`),
    ),
  );
}

export async function reservasEnRango(desde: string, hasta: string, db?: Db) {
  const d = db ?? (await getDb());
  return d.select().from(reservas).where(cruzaRango(desde, hasta)).orderBy(asc(reservas.entrada));
}

export async function bloqueosEnRango(desde: string, hasta: string, db?: Db) {
  const d = db ?? (await getDb());
  return d.select().from(bloqueos).where(and(lt(bloqueos.desde, hasta), gt(bloqueos.hasta, desde)));
}

/** Habitaciones activas libres durante todas las noches de [entrada, salida). */
export async function disponibles(entrada: string, salida: string, db?: Db) {
  const d = db ?? (await getDb());
  const [habs, res, blq] = await Promise.all([listarHabitaciones(true, d), reservasEnRango(entrada, salida, d), bloqueosEnRango(entrada, salida, d)]);
  const ocupadas = new Set([...res.map((r) => r.habitacionId), ...blq.map((b) => b.habitacionId)]);
  return habs.filter((h) => !ocupadas.has(h.id));
}

/**
 * Sugiere la mejor combinación de habitaciones libres para N personas:
 * pocas habitaciones y poco cupo sobrante (mochila 0/1, mínimo de habitaciones por capacidad exacta).
 */
export function sugerirCombinacion(libres: Hab[], personas: number): Hab[] | null {
  if (personas < 1 || libres.reduce((a, h) => a + h.capacidad, 0) < personas) return null;
  const max = personas + 8;
  const dp: (number[] | null)[] = Array(max + 1).fill(null);
  dp[0] = [];
  libres.forEach((h, i) => {
    for (let c = max; c >= h.capacidad; c--) {
      const prev = dp[c - h.capacidad];
      if (prev && (!dp[c] || prev.length + 1 < dp[c]!.length)) dp[c] = [...prev, i];
    }
  });
  let mejor: number[] | null = null;
  let costo = Infinity;
  for (let c = personas; c <= max; c++) {
    const s = dp[c];
    if (!s) continue;
    const k = s.length * 3 + (c - personas); // pocas habitaciones pesan más que 1 cupo sobrante
    if (k < costo) { costo = k; mejor = s; }
  }
  return mejor ? mejor.map((i) => libres[i]) : null;
}

export async function resumenHoy(db?: Db) {
  const d = db ?? (await getDb());
  const hoy = hoyCO();
  const manana = sumarDias(hoy, 1);
  const [habs, ocupadasHoy, llegadas, salidas, tareas] = await Promise.all([
    listarHabitaciones(true, d),
    reservasEnRango(hoy, manana, d),
    d.select().from(reservas).where(and(eq(reservas.estado, "confirmada"), eq(reservas.entrada, hoy))).orderBy(asc(reservas.id)),
    d.select().from(reservas).where(and(eq(reservas.estado, "en_casa"), lt(reservas.salida, manana))).orderBy(asc(reservas.id)),
    d.select({ n: count() }).from(tareasLimpieza).where(inArray(tareasLimpieza.estado, ["pendiente", "en_proceso"])),
  ]);
  const bloqueadas = new Set((await bloqueosEnRango(hoy, manana, d)).map((b) => b.habitacionId));
  const ocupadasIds = new Set(ocupadasHoy.map((r) => r.habitacionId));
  const capacidadTotal = habs.reduce((a, h) => a + h.capacidad, 0);
  const enCasa = ocupadasHoy.filter((r) => r.estado === "en_casa");
  return {
    hoy,
    totalHabs: habs.length,
    ocupadas: ocupadasIds.size,
    libres: habs.filter((h) => !ocupadasIds.has(h.id) && !bloqueadas.has(h.id)).length,
    bloqueadas: bloqueadas.size,
    ocupacionPct: habs.length ? Math.round((ocupadasIds.size / habs.length) * 100) : 0,
    personasEnCasa: enCasa.reduce((a, r) => a + r.personas, 0),
    capacidadTotal,
    llegadas,
    salidas,
    tareasPendientes: tareas[0]?.n ?? 0,
    sucias: habs.filter((h) => h.limpieza !== "limpia").length,
  };
}

/** Datos mínimos para el sondeo en vivo (sonidos y avisos). */
export async function pulso(db?: Db) {
  const d = db ?? (await getDb());
  const [r, t, p] = await Promise.all([
    d.select({ id: sql<number>`coalesce(max(${reservas.id}), 0)` }).from(reservas),
    d.select({ id: sql<number>`coalesce(max(${tareasLimpieza.id}), 0)` }).from(tareasLimpieza),
    d.select({ n: count() }).from(tareasLimpieza).where(eq(tareasLimpieza.estado, "pendiente")),
  ]);
  return { ultimaReserva: Number(r[0].id), ultimaTarea: Number(t[0].id), tareasPendientes: p[0].n };
}

export async function tareasActivas(db?: Db) {
  const d = db ?? (await getDb());
  return d
    .select({ t: tareasLimpieza, h: habitaciones })
    .from(tareasLimpieza)
    .innerJoin(habitaciones, eq(habitaciones.id, tareasLimpieza.habitacionId))
    .where(inArray(tareasLimpieza.estado, ["pendiente", "en_proceso", "lista"]))
    .orderBy(desc(tareasLimpieza.creada));
}

export type EstadoHoy = "libre" | "ocupada" | "llega" | "bloqueada";

/** Estado de cada habitación hoy, para el mapa del inicio y la página de habitaciones. */
export async function estadoHabitacionesHoy(db?: Db) {
  const d = db ?? (await getDb());
  const hoy = hoyCO();
  const manana = sumarDias(hoy, 1);
  const [habs, res, blq] = await Promise.all([listarHabitaciones(false, d), reservasEnRango(hoy, manana, d), bloqueosEnRango(hoy, manana, d)]);
  return habs.map((h) => {
    const r = res.find((x) => x.habitacionId === h.id);
    const b = blq.find((x) => x.habitacionId === h.id);
    const estado: EstadoHoy = !h.activa || b ? "bloqueada" : r ? (r.estado === "en_casa" ? "ocupada" : r.entrada === hoy ? "llega" : "ocupada") : "libre";
    return { hab: h, estado, reserva: r ?? null, bloqueo: b ?? null };
  });
}
