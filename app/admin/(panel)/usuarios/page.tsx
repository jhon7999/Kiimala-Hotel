import { asc, desc } from "drizzle-orm";
import { BotonActivar, FormClave, FormNuevoUsuario } from "@/components/admin/FormsUsuario";
import { verificarSesion } from "@/lib/dal";
import { getDb, historial, usuarios } from "@/lib/db";

export const metadata = { title: "Usuarios" };

const ROL: Record<string, string> = { admin: "Administrador", recepcion: "Recepción", ventas: "Ventas", limpieza: "Limpieza" };

export default async function Usuarios() {
  const yo = await verificarSesion();
  const db = await getDb();
  const [lista, hist] = await Promise.all([
    db.select({ id: usuarios.id, nombre: usuarios.nombre, usuario: usuarios.usuario, rol: usuarios.rol, activo: usuarios.activo }).from(usuarios).orderBy(asc(usuarios.id)),
    db.select().from(historial).orderBy(desc(historial.id)).limit(15),
  ]);
  const fmt = new Intl.DateTimeFormat("es-CO", { dateStyle: "short", timeStyle: "short", timeZone: "America/Bogota" });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="sube text-4xl lg:text-5xl">Usuarios</h1>

      <section className="cristal sube space-y-4 p-5" style={{ ["--i" as string]: 1 }} aria-labelledby="nuevo">
        <h2 id="nuevo" className="text-2xl">Agregar usuario</h2>
        <FormNuevoUsuario />
      </section>

      <section className="cristal sube p-5" style={{ ["--i" as string]: 2 }} aria-labelledby="lista">
        <h2 id="lista" className="mb-3 text-2xl">Equipo</h2>
        <ul className="divide-y divide-white/10">
          {lista.map((u) => (
            <li key={u.id} className="space-y-2 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{u.nombre} {u.id === yo.id && <span className="text-xs text-[color:var(--a-suave)]">(tú)</span>}</p>
                  <p className="text-xs text-[color:var(--a-suave)]">{u.usuario} · {ROL[u.rol]}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`chip ${u.activo ? "chip-libre" : "chip-cancelada"}`}>{u.activo ? "Activo" : "Inactivo"}</span>
                  {u.id !== yo.id && <BotonActivar id={u.id} activo={u.activo} />}
                </div>
              </div>
              <FormClave id={u.id} />
            </li>
          ))}
        </ul>
      </section>

      <section className="cristal sube p-5" style={{ ["--i" as string]: 3 }} aria-labelledby="hist">
        <h2 id="hist" className="mb-3 text-2xl">Últimos movimientos</h2>
        <ul className="space-y-1 text-sm">
          {hist.map((h) => (
            <li key={h.id} className="flex flex-wrap gap-x-3 text-[color:var(--a-suave)]"><span className="tabular-nums">{fmt.format(h.fecha)}</span><span className="text-white">{h.usuario}</span><span>{h.accion}</span><span>{h.detalle}</span></li>
          ))}
        </ul>
      </section>
    </div>
  );
}
