"use server";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { and, eq, gt, inArray, lt, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { exigirRol } from "@/lib/dal";
import { bloqueos, getDb, habitaciones, historial, reservas, ROLES, tareasLimpieza, tokensApi, usuarios, type Rol } from "@/lib/db";
import { esFecha, hoyCO, noches } from "@/lib/fechas";
import { disponibles, sugerirCombinacion } from "@/lib/hotel";
import { hashToken } from "@/lib/tokens";

export type Estado = { ok?: boolean; error?: string; token?: string; aviso?: string };

const texto = (v: FormDataEntryValue | null, max = 200) => String(v ?? "").trim().slice(0, max);
const entero = (v: FormDataEntryValue | null) => {
  const n = Math.round(Number(String(v ?? "0").replace(/[^\d.-]/g, "")));
  return Number.isFinite(n) ? n : 0;
};
const refrescar = () => revalidatePath("/admin", "layout");

async function anotar(usuario: string, accion: string, detalle = "") {
  const db = await getDb();
  await db.insert(historial).values({ usuario, accion, detalle: detalle.slice(0, 500) });
}

/* ───────── Reservas ───────── */

export async function crearReserva(_prev: Estado, form: FormData): Promise<Estado> {
  const s = await exigirRol("admin", "recepcion", "ventas");
  const huesped = texto(form.get("huesped"), 120);
  const telefono = texto(form.get("telefono"), 30);
  const personas = entero(form.get("personas"));
  const entrada = texto(form.get("entrada"), 10);
  const salida = texto(form.get("salida"), 10);
  const canal = ["whatsapp", "directo", "agencia", "otro"].includes(texto(form.get("canal"))) ? texto(form.get("canal")) : "whatsapp";
  const total = Math.max(0, entero(form.get("total")));
  const abonado = Math.max(0, entero(form.get("abonado")));
  const notas = texto(form.get("notas"), 500);
  const ids = [...new Set(texto(form.get("habitaciones"), 300).split(",").map((x) => Number(x)).filter((x) => Number.isInteger(x) && x > 0))];

  if (!huesped) return { error: "Escribe el nombre del huésped." };
  if (!esFecha(entrada) || !esFecha(salida)) return { error: "Elige las fechas de entrada y salida." };
  if (noches(entrada, salida) < 1) return { error: "La salida debe ser después de la entrada." };
  if (entrada < hoyCO()) return { error: "La entrada no puede estar en el pasado." };
  if (personas < 1) return { error: "Indica cuántas personas son." };
  if (!ids.length) return { error: "Elige al menos una habitación." };
  if (abonado > total && total > 0) return { error: "El abono no puede ser mayor que el total." };

  const db = await getDb();
  let primero = 0;
  try {
    await db.transaction(async (tx) => {
      // Bloqueo de las filas de habitación: dos recepcionistas no pueden vender la misma habitación a la vez.
      const habs = await tx.select().from(habitaciones).where(inArray(habitaciones.id, ids)).for("update");
      if (habs.length !== ids.length || habs.some((h) => !h.activa)) throw new Error("Alguna habitación no existe o está desactivada.");
      const capacidad = habs.reduce((a, h) => a + h.capacidad, 0);
      if (capacidad < personas) throw new Error(`Las habitaciones elegidas solo caben ${capacidad} personas.`);

      const choque = await tx
        .select({ n: reservas.codigo, h: reservas.habitacionId })
        .from(reservas)
        .where(and(inArray(reservas.habitacionId, ids), inArray(reservas.estado, ["confirmada", "en_casa"]), lt(reservas.entrada, salida), gt(reservas.salida, entrada)));
      const bloq = await tx.select({ h: bloqueos.habitacionId }).from(bloqueos).where(and(inArray(bloqueos.habitacionId, ids), lt(bloqueos.desde, salida), gt(bloqueos.hasta, entrada)));
      if (choque.length || bloq.length) {
        const nombres = habs.filter((h) => [...choque, ...bloq].some((c) => c.h === h.id)).map((h) => h.nombre);
        throw new Error(`Ya no está libre: ${nombres.join(", ")}. Otra reserva o bloqueo se cruza con esas fechas.`);
      }

      const base = randomBytes(4).toString("hex").toUpperCase().slice(0, 5);
      const grupo = ids.length > 1 ? `KM-${base}` : null;
      let restante = personas;
      let totalRestante = total;
      let abonoRestante = abonado;
      for (let i = 0; i < habs.length; i++) {
        const h = habs[i];
        const ultima = i === habs.length - 1;
        const p = ultima ? restante : Math.min(h.capacidad, restante);
        restante -= p;
        // el total y el abono se reparten en la primera habitación del grupo (un solo recibo)
        const t = i === 0 ? totalRestante : 0;
        const a = i === 0 ? abonoRestante : 0;
        const [fila] = await tx
          .insert(reservas)
          .values({
            codigo: ids.length > 1 ? `KM-${base}-${i + 1}` : `KM-${base}`,
            habitacionId: h.id, entrada, salida, huesped, telefono, personas: Math.max(1, p), canal, total: t, abonado: a, notas, grupo, creadoPor: s.usuario,
          })
          .returning({ id: reservas.id });
        if (i === 0) primero = fila.id;
        totalRestante = 0;
        abonoRestante = 0;
      }
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo crear la reserva." };
  }
  await anotar(s.usuario, "reserva_creada", `#${primero} ${entrada}→${salida} (${ids.length} hab.)`);
  refrescar();
  redirect(`/admin/reservas/${primero}`);
}

export async function accionReserva(id: number, accion: "checkin" | "checkout" | "cancelar" | "reactivar"): Promise<Estado> {
  const s = await exigirRol("admin", "recepcion");
  const db = await getDb();
  const [r] = await db.select().from(reservas).where(eq(reservas.id, id));
  if (!r) return { error: "La reserva no existe." };
  // si es un grupo, la acción aplica a todas las habitaciones del grupo
  const grupo = r.grupo ? await db.select().from(reservas).where(eq(reservas.grupo, r.grupo)) : [r];
  const idsGrupo = grupo.map((x) => x.id);
  const ahora = new Date();

  if (accion === "checkin") {
    if (r.estado !== "confirmada") return { error: "Solo se puede hacer check-in a una reserva confirmada." };
    if (r.entrada > hoyCO()) return { error: "Todavía no es la fecha de entrada." };
    await db.update(reservas).set({ estado: "en_casa", checkInAt: ahora }).where(inArray(reservas.id, idsGrupo));
  } else if (accion === "checkout") {
    if (r.estado !== "en_casa") return { error: "Solo se puede hacer check-out a un huésped que está en casa." };
    await db.transaction(async (tx) => {
      await tx.update(reservas).set({ estado: "finalizada", checkOutAt: ahora }).where(inArray(reservas.id, idsGrupo));
      for (const x of grupo) {
        await tx.update(habitaciones).set({ limpieza: "sucia" }).where(eq(habitaciones.id, x.habitacionId));
        const abierta = await tx.select({ id: tareasLimpieza.id }).from(tareasLimpieza).where(and(eq(tareasLimpieza.habitacionId, x.habitacionId), ne(tareasLimpieza.estado, "lista")));
        if (!abierta.length) await tx.insert(tareasLimpieza).values({ habitacionId: x.habitacionId, motivo: "Salida de huésped", pedidoPor: s.usuario });
      }
    });
  } else if (accion === "cancelar") {
    if (r.estado !== "confirmada") return { error: "Solo se puede cancelar una reserva que aún no hizo check-in." };
    await db.update(reservas).set({ estado: "cancelada" }).where(inArray(reservas.id, idsGrupo));
  } else if (accion === "reactivar") {
    if (r.estado !== "cancelada") return { error: "La reserva no está cancelada." };
    await db.update(reservas).set({ estado: "confirmada" }).where(inArray(reservas.id, idsGrupo));
  }
  await anotar(s.usuario, `reserva_${accion}`, `#${id}`);
  refrescar();
  return { ok: true };
}

export async function registrarAbono(id: number, monto: number): Promise<Estado> {
  const s = await exigirRol("admin", "recepcion");
  if (!Number.isFinite(monto) || monto <= 0) return { error: "Escribe un valor mayor que cero." };
  const db = await getDb();
  const [r] = await db.select().from(reservas).where(eq(reservas.id, id));
  if (!r) return { error: "La reserva no existe." };
  const nuevo = r.abonado + Math.round(monto);
  if (r.total > 0 && nuevo > r.total) return { error: "El abono supera el total de la reserva." };
  await db.update(reservas).set({ abonado: nuevo }).where(eq(reservas.id, id));
  await anotar(s.usuario, "abono", `#${id} +${Math.round(monto)}`);
  refrescar();
  return { ok: true };
}

/* ───────── Bloqueos de habitación ───────── */

export async function bloquearHabitacion(_prev: Estado, form: FormData): Promise<Estado> {
  const s = await exigirRol("admin", "recepcion");
  const habitacionId = entero(form.get("habitacionId"));
  const desde = texto(form.get("desde"), 10);
  const hasta = texto(form.get("hasta"), 10);
  const motivo = texto(form.get("motivo"), 120) || "Mantenimiento";
  if (!habitacionId || !esFecha(desde) || !esFecha(hasta) || noches(desde, hasta) < 1) return { error: "Revisa la habitación y las fechas." };
  const db = await getDb();
  const choque = await db.select({ id: reservas.id }).from(reservas).where(and(eq(reservas.habitacionId, habitacionId), inArray(reservas.estado, ["confirmada", "en_casa"]), lt(reservas.entrada, hasta), gt(reservas.salida, desde)));
  if (choque.length) return { error: "Esa habitación tiene una reserva en esas fechas." };
  await db.insert(bloqueos).values({ habitacionId, desde, hasta, motivo });
  await anotar(s.usuario, "bloqueo", `hab ${habitacionId} ${desde}→${hasta} ${motivo}`);
  refrescar();
  return { ok: true };
}

export async function quitarBloqueo(id: number): Promise<Estado> {
  const s = await exigirRol("admin", "recepcion");
  const db = await getDb();
  await db.delete(bloqueos).where(eq(bloqueos.id, id));
  await anotar(s.usuario, "bloqueo_quitado", `#${id}`);
  refrescar();
  return { ok: true };
}

/* ───────── Limpieza ───────── */

export async function solicitarLimpieza(habitacionId: number, motivo = "Solicitud de recepción"): Promise<Estado> {
  const s = await exigirRol("admin", "recepcion");
  const db = await getDb();
  const abierta = await db.select({ id: tareasLimpieza.id }).from(tareasLimpieza).where(and(eq(tareasLimpieza.habitacionId, habitacionId), ne(tareasLimpieza.estado, "lista")));
  if (abierta.length) return { error: "Esa habitación ya tiene una limpieza pendiente." };
  await db.transaction(async (tx) => {
    await tx.update(habitaciones).set({ limpieza: "sucia" }).where(eq(habitaciones.id, habitacionId));
    await tx.insert(tareasLimpieza).values({ habitacionId, motivo: motivo.slice(0, 120), pedidoPor: s.usuario });
  });
  await anotar(s.usuario, "limpieza_solicitada", `hab ${habitacionId}`);
  refrescar();
  return { ok: true };
}

/** pendiente → en proceso → lista (al terminar, la habitación queda limpia). */
export async function avanzarTarea(id: number): Promise<Estado> {
  const s = await exigirRol("admin", "recepcion", "limpieza");
  const db = await getDb();
  const [t] = await db.select().from(tareasLimpieza).where(eq(tareasLimpieza.id, id));
  if (!t) return { error: "La tarea no existe." };
  if (t.estado === "pendiente") {
    await db.transaction(async (tx) => {
      await tx.update(tareasLimpieza).set({ estado: "en_proceso", tomadaPor: s.nombre, iniciada: new Date() }).where(eq(tareasLimpieza.id, id));
      await tx.update(habitaciones).set({ limpieza: "en_limpieza" }).where(eq(habitaciones.id, t.habitacionId));
    });
  } else if (t.estado === "en_proceso") {
    await db.transaction(async (tx) => {
      await tx.update(tareasLimpieza).set({ estado: "lista", terminada: new Date() }).where(eq(tareasLimpieza.id, id));
      await tx.update(habitaciones).set({ limpieza: "limpia" }).where(eq(habitaciones.id, t.habitacionId));
    });
  } else {
    return { error: "Esa limpieza ya está terminada." };
  }
  await anotar(s.usuario, "limpieza_avance", `tarea ${id}`);
  refrescar();
  return { ok: true };
}

/* ───────── Habitaciones ───────── */

export async function editarHabitacion(_prev: Estado, form: FormData): Promise<Estado> {
  const s = await exigirRol("admin", "recepcion");
  const id = entero(form.get("id"));
  const capacidad = entero(form.get("capacidad"));
  if (!id || capacidad < 1 || capacidad > 20) return { error: "La capacidad debe estar entre 1 y 20." };
  const db = await getDb();
  await db.update(habitaciones).set({ capacidad, camas: texto(form.get("camas"), 200), notas: texto(form.get("notas"), 300), activa: form.get("activa") === "on" }).where(eq(habitaciones.id, id));
  await anotar(s.usuario, "habitacion_editada", `#${id}`);
  refrescar();
  return { ok: true };
}

/* ───────── Usuarios (solo admin) ───────── */

export async function crearUsuario(_prev: Estado, form: FormData): Promise<Estado> {
  const s = await exigirRol("admin");
  const nombre = texto(form.get("nombre"), 80);
  const usuario = texto(form.get("usuario"), 40).toLowerCase().replace(/[^a-z0-9._-]/g, "");
  const clave = String(form.get("clave") ?? "");
  const rol = texto(form.get("rol")) as Rol;
  if (!nombre || usuario.length < 3) return { error: "Escribe el nombre y un usuario de al menos 3 caracteres." };
  if (clave.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres." };
  if (!ROLES.includes(rol)) return { error: "Rol no válido." };
  const db = await getDb();
  const [ya] = await db.select({ id: usuarios.id }).from(usuarios).where(eq(usuarios.usuario, usuario));
  if (ya) return { error: "Ese usuario ya existe." };
  await db.insert(usuarios).values({ nombre, usuario, rol, claveHash: await bcrypt.hash(clave, 10) });
  await anotar(s.usuario, "usuario_creado", `${usuario} (${rol})`);
  refrescar();
  return { ok: true };
}

export async function cambiarClaveUsuario(_prev: Estado, form: FormData): Promise<Estado> {
  const s = await exigirRol("admin");
  const id = entero(form.get("id"));
  const clave = String(form.get("clave") ?? "");
  if (clave.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres." };
  const db = await getDb();
  await db.update(usuarios).set({ claveHash: await bcrypt.hash(clave, 10), fallos: 0, bloqueadoHasta: null }).where(eq(usuarios.id, id));
  await anotar(s.usuario, "clave_cambiada", `#${id}`);
  return { ok: true, aviso: "Contraseña actualizada." };
}

export async function activarUsuario(id: number, activo: boolean): Promise<Estado> {
  const s = await exigirRol("admin");
  if (id === s.id && !activo) return { error: "No puedes desactivar tu propio usuario." };
  const db = await getDb();
  await db.update(usuarios).set({ activo }).where(eq(usuarios.id, id));
  await anotar(s.usuario, activo ? "usuario_activado" : "usuario_desactivado", `#${id}`);
  refrescar();
  return { ok: true };
}

/* ───────── Tokens de API (Destidnos, etc.) ───────── */

export async function crearTokenApi(_prev: Estado, form: FormData): Promise<Estado> {
  const s = await exigirRol("admin");
  const nombre = texto(form.get("nombre"), 60);
  if (!nombre) return { error: "Ponle un nombre al token (por ejemplo, Destidnos)." };
  const token = `kmk_${randomBytes(24).toString("base64url")}`;
  const db = await getDb();
  await db.insert(tokensApi).values({ nombre, tokenHash: hashToken(token) });
  await anotar(s.usuario, "token_creado", nombre);
  refrescar();
  return { ok: true, token }; // se muestra una sola vez; en la base solo queda el hash
}

export async function revocarTokenApi(id: number): Promise<Estado> {
  const s = await exigirRol("admin");
  const db = await getDb();
  await db.update(tokensApi).set({ activo: false }).where(eq(tokensApi.id, id));
  await anotar(s.usuario, "token_revocado", `#${id}`);
  refrescar();
  return { ok: true };
}

/* ───────── Consulta de disponibilidad (formulario de nueva reserva) ───────── */

export type Libre = { id: number; nombre: string; torre: string; capacidad: number; camas: string; vip: boolean };
export type Consulta = { libres: Libre[]; sugerencia: number[]; error?: string };

export async function consultarDisponibilidad(entrada: string, salida: string, personas: number): Promise<Consulta> {
  await exigirRol("admin", "recepcion", "ventas");
  if (!esFecha(entrada) || !esFecha(salida) || noches(entrada, salida) < 1) return { libres: [], sugerencia: [], error: "Revisa las fechas." };
  const libres = await disponibles(entrada, salida);
  const sug = sugerirCombinacion(libres, Math.max(1, Math.round(personas) || 1));
  return {
    libres: libres.map((h) => ({ id: h.id, nombre: h.nombre, torre: h.torre, capacidad: h.capacidad, camas: h.camas, vip: h.vip })),
    sugerencia: sug ? sug.map((h) => h.id) : [],
  };
}
