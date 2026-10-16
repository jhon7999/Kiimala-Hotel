/**
 * Prueba de humo. Dos partes:
 *  1) Lógica de disponibilidad contra una base PGlite TEMPORAL (no toca .data/).
 *  2) Rutas HTTP del servidor ya levantado (npm run start -- -p 3100) firmando sesiones temporales por rol.
 * Uso:  SESSION_SECRET=<mismo valor que el servidor> npm run smoke
 */
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

process.env.PGLITE_DIR = join(mkdtempSync(join(tmpdir(), "kiimala-smoke-")), "db");
delete process.env.DATABASE_URL;

let fallos = 0;
const ok = (cond: boolean, msg: string) => { console.log(`${cond ? "  ✓" : "  ✗"} ${msg}`); if (!cond) fallos++; };

async function logica() {
  console.log("\nLógica de disponibilidad");
  const { execSync } = await import("node:child_process");
  execSync("npx drizzle-kit push --force", { stdio: "ignore", env: process.env });
  const { getDb, habitaciones, reservas } = await import("../lib/db");
  const { disponibles, sugerirCombinacion } = await import("../lib/hotel");
  const { INVENTARIO } = await import("../lib/inventario");
  const { hoyCO, sumarDias } = await import("../lib/fechas");
  const db = await getDb();

  let o = 0;
  for (const h of INVENTARIO) await db.insert(habitaciones).values({ torre: h.torre, numero: h.numero, nombre: `${h.torre} ${h.numero}`, capacidad: h.capacidad, camas: h.camas, vip: !!h.vip, orden: ++o });
  const habs = await db.select().from(habitaciones);
  ok(habs.length === 22, "22 habitaciones cargadas");
  ok(habs.reduce((a, h) => a + h.capacidad, 0) === 92, "capacidad total 92");

  const hoy = hoyCO();
  const e = sumarDias(hoy, 10), s = sumarDias(hoy, 13);
  ok((await disponibles(e, s)).length === 22, "sin reservas: las 22 libres");

  const c301 = habs.find((h) => h.nombre === "Cisnes 301")!;
  await db.insert(reservas).values({ codigo: "T1", habitacionId: c301.id, entrada: e, salida: s, huesped: "Prueba", personas: 8 });
  ok((await disponibles(e, s)).length === 21, "una reserva ocupa 1 habitación");
  ok((await disponibles(s, sumarDias(s, 2))).length === 22, "la noche de salida queda libre (entrada el día de salida)");
  ok((await disponibles(sumarDias(e, -2), sumarDias(e, 1))).length === 21, "una reserva que se cruza por el inicio también ocupa");
  await db.update(reservas).set({ estado: "cancelada" });
  ok((await disponibles(e, s)).length === 22, "reserva cancelada libera la habitación");

  const libres = await disponibles(e, s);
  const caso = (p: number) => sugerirCombinacion(libres, p);
  const cap = (x: ReturnType<typeof caso>) => x?.reduce((a, h) => a + h.capacidad, 0) ?? 0;
  ok(caso(2)?.length === 1 && cap(caso(2)) === 2, "2 personas → 1 habitación de 2");
  ok(caso(8)?.length === 1 && cap(caso(8)) === 8, "8 personas → Cisnes 301 (1 habitación)");
  ok(caso(10)!.length <= 2 && cap(caso(10)) >= 10 && cap(caso(10)) <= 11, "10 personas → máx. 2 habitaciones con poco sobrante");
  ok(cap(caso(40)) >= 40 && cap(caso(40)) <= 44, "40 personas → capacidad ajustada");
  ok(caso(93) === null, "93 personas → no alcanza");
}

async function http() {
  console.log("\nRutas HTTP");
  const base = process.env.SMOKE_BASE ?? "http://localhost:3100";
  const { firmarSesion } = await import("../lib/auth");
  const { COOKIE } = await import("../lib/auth");
  const cookie = async (rol: "admin" | "recepcion" | "ventas" | "limpieza") => `${COOKIE}=${await firmarSesion({ id: 1, nombre: "Prueba", usuario: "prueba", rol })}`;
  const ver = async (ruta: string, ck?: string) => {
    const r = await fetch(base + ruta, { redirect: "manual", headers: ck ? { cookie: ck } : {} });
    return r.status;
  };

  const admin = await cookie("admin");
  for (const r of ["/admin", "/admin/calendario", "/admin/calendario?dias=30", "/admin/reservas", "/admin/reservas/nueva", "/admin/limpieza", "/admin/habitaciones", "/admin/usuarios", "/admin/integraciones"])
    ok((await ver(r, admin)) === 200, `admin ve ${r}`);
  ok((await ver("/admin")) === 307, "sin sesión /admin redirige al login");
  ok((await ver("/admin/login")) === 200, "login es público");
  const limp = await cookie("limpieza");
  ok((await ver("/admin/limpieza", limp)) === 200, "limpieza ve /admin/limpieza");
  ok((await ver("/admin/reservas", limp)) === 307, "limpieza NO ve /admin/reservas");
  ok((await ver("/admin/usuarios", await cookie("recepcion"))) === 307, "recepción NO ve /admin/usuarios");
  ok((await ver("/admin/integraciones", await cookie("ventas"))) === 307, "ventas NO ve /admin/integraciones");
  ok((await ver("/api/admin/pulso", admin)) === 200, "pulso con sesión");
  ok((await ver("/api/admin/pulso")) === 401, "pulso sin sesión: 401");
  ok((await ver("/api/v1/disponibilidad?entrada=2030-01-01&salida=2030-01-03")) === 401, "API sin token: 401");
  const mal = await fetch(base + "/api/v1/disponibilidad?entrada=2030-01-01&salida=2030-01-03", { headers: { authorization: "Bearer kmk_falso" } });
  ok(mal.status === 401, "API con token falso: 401");
  for (const r of ["/", "/habitaciones", "/plan-covenas", "/tours-opcionales", "/alrededores", "/quienes-somos", "/ubicacion", "/contacto", "/politicas", "/privacidad", "/sitemap.xml", "/robots.txt", "/panel.webmanifest", "/sw.js", "/offline.html"])
    ok((await ver(r)) === 200, `público ${r}`);
}

(async () => {
  await logica();
  if (process.env.SKIP_HTTP !== "1") await http();
  console.log(fallos ? `\n${fallos} comprobación(es) fallaron` : "\nTodo en orden");
  process.exit(fallos ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
