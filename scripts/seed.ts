/**
 * Datos iniciales.
 *   npm run seed        → habitaciones reales + usuarios y reservas FICTICIAS de demostración.
 *   npm run seed:prod   → solo habitaciones reales y el administrador (ADMIN_USUARIO / ADMIN_CLAVE del entorno).
 * Las contraseñas de demostración se generan al azar y se guardan en .data/credenciales-demo.txt (no va a git).
 * Nunca se cargan datos reales de huéspedes aquí.
 */
import { randomBytes } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { bloqueos, getDb, habitaciones, reservas, tareasLimpieza, usuarios, type Rol } from "../lib/db";
import { hoyCO, sumarDias } from "../lib/fechas";
import { INVENTARIO } from "../lib/inventario";

const prod = process.argv.includes("--prod");

async function main() {
  const db = await getDb();

  // 1) Habitaciones reales (idempotente por nombre)
  let orden = 0;
  for (const h of INVENTARIO) {
    orden++;
    await db
      .insert(habitaciones)
      .values({ torre: h.torre, numero: h.numero, nombre: `${h.torre} ${h.numero}`, capacidad: h.capacidad, camas: h.camas, vip: !!h.vip, orden })
      .onConflictDoNothing();
  }
  console.log(`Habitaciones: ${INVENTARIO.length} (capacidad ${INVENTARIO.reduce((a, h) => a + h.capacidad, 0)} personas)`);

  const nuevoUsuario = async (nombre: string, usuario: string, rol: Rol, clave: string) => {
    const [ya] = await db.select({ id: usuarios.id }).from(usuarios).where(eq(usuarios.usuario, usuario));
    if (ya) return false;
    await db.insert(usuarios).values({ nombre, usuario, rol, claveHash: await bcrypt.hash(clave, 10) });
    return true;
  };

  if (prod) {
    const u = process.env.ADMIN_USUARIO?.toLowerCase();
    const c = process.env.ADMIN_CLAVE;
    if (!u || !c || c.length < 8) throw new Error("Define ADMIN_USUARIO y ADMIN_CLAVE (mín. 8 caracteres) en el entorno.");
    console.log((await nuevoUsuario("Administrador", u, "admin", c)) ? `Administrador creado: ${u}` : `El usuario ${u} ya existía.`);
    return;
  }

  // 2) Demostración: usuarios con contraseñas aleatorias
  const clave = () => randomBytes(6).toString("base64url");
  const demo: [string, string, Rol, string][] = [
    ["Administración (demo)", "admin", "admin", clave()],
    ["Recepción (demo)", "recepcion", "recepcion", clave()],
    ["Ventas (demo)", "ventas", "ventas", clave()],
    ["Limpieza (demo)", "limpieza", "limpieza", clave()],
  ];
  const lineas: string[] = [];
  for (const [n, u, r, c] of demo) if (await nuevoUsuario(n, u, r, c)) lineas.push(`${u} / ${c}  (${r})`);
  if (lineas.length) {
    mkdirSync(".data", { recursive: true });
    writeFileSync(".data/credenciales-demo.txt", lineas.join("\n") + "\n");
    console.log("Usuarios de demostración creados. Contraseñas en .data/credenciales-demo.txt");
  }

  // 3) Reservas FICTICIAS (solo si no hay ninguna)
  const hay = await db.select({ id: reservas.id }).from(reservas).limit(1);
  if (hay.length) return;
  const habs = await db.select().from(habitaciones);
  const por = (nombre: string) => habs.find((h) => h.nombre === nombre)!;
  const hoy = hoyCO();
  const d = (n: number) => sumarDias(hoy, n);
  type R = [string, number, number, string, number, "confirmada" | "en_casa" | "finalizada", string, number, number];
  const filas: R[] = [
    // [habitación, entrada(+d), salida(+d), huésped ficticio, personas, estado, canal, total, abonado]
    ["Cisnes 101", -1, 2, "Familia Demo Uno", 6, "en_casa", "whatsapp", 1800000, 900000],
    ["Cisnes 104", -2, 1, "Huésped Demo Dos", 4, "en_casa", "directo", 1200000, 1200000],
    ["Garzas 1", -1, 0, "Huésped Demo Tres", 4, "en_casa", "whatsapp", 900000, 450000],
    ["Garzas 5", 0, 3, "Grupo Demo Cuatro", 5, "confirmada", "agencia", 1500000, 500000],
    ["Cóndor 101", 0, 2, "Pareja Demo Cinco", 2, "confirmada", "whatsapp", 800000, 400000],
    ["Cisnes 201", 1, 4, "Huésped Demo Seis", 4, "confirmada", "whatsapp", 1260000, 0],
    ["Cisnes 301", 2, 5, "Grupo Demo Siete", 8, "confirmada", "agencia", 2400000, 1200000],
    ["Garzas 8", 3, 6, "Huésped Demo Ocho", 4, "confirmada", "directo", 1100000, 300000],
    ["Garzas 9", 4, 6, "Pareja Demo Nueve", 2, "confirmada", "whatsapp", 520000, 0],
    ["Cisnes 302", 5, 9, "Familia Demo Diez", 7, "confirmada", "whatsapp", 2700000, 900000],
    ["Cisnes 103", 6, 9, "Grupo Demo Once", 6, "confirmada", "agencia", 1900000, 0],
    ["Garzas 2", 7, 10, "Huésped Demo Doce", 4, "confirmada", "directo", 960000, 0],
    ["Cóndor 103", 8, 11, "Huésped Demo Trece", 4, "confirmada", "whatsapp", 1150000, 0],
    ["Cisnes 202", -6, -3, "Huésped Demo Catorce", 4, "finalizada", "whatsapp", 1000000, 1000000],
  ];
  let n = 0;
  for (const [hab, e, s, huesped, personas, estado, canal, total, abonado] of filas) {
    n++;
    await db.insert(reservas).values({
      codigo: `KM-DEMO${String(n).padStart(2, "0")}`, habitacionId: por(hab).id, entrada: d(e), salida: d(s), huesped, personas, estado, canal, total, abonado,
      creadoPor: "seed", checkInAt: estado === "en_casa" || estado === "finalizada" ? new Date() : null,
    });
  }
  // Habitación en mantenimiento y dos limpiezas de ejemplo
  await db.insert(bloqueos).values({ habitacionId: por("Garzas 6").id, desde: d(-1), hasta: d(3), motivo: "Mantenimiento de aire acondicionado" });
  for (const nombre of ["Cisnes 202", "Cisnes 102"]) {
    await db.update(habitaciones).set({ limpieza: "sucia" }).where(eq(habitaciones.id, por(nombre).id));
    await db.insert(tareasLimpieza).values({ habitacionId: por(nombre).id, motivo: nombre === "Cisnes 202" ? "Salida de huésped" : "Solicitud de recepción", pedidoPor: "seed" });
  }
  console.log(`Reservas de demostración: ${filas.length}`);
}

main().then(() => process.exit(0), (e) => { console.error(e); process.exit(1); });
