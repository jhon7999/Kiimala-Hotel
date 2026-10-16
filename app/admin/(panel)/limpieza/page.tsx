import SolicitarLimpieza from "@/components/admin/SolicitarLimpieza";
import TarjetaTarea from "@/components/admin/TarjetaTarea";
import { verificarSesion } from "@/lib/dal";
import { listarHabitaciones, tareasActivas } from "@/lib/hotel";

export const metadata = { title: "Limpieza" };

const hace = (d: Date) => {
  const m = Math.max(0, Math.round((Date.now() - d.getTime()) / 60000));
  return m < 1 ? "ahora" : m < 60 ? `hace ${m} min` : m < 1440 ? `hace ${Math.round(m / 60)} h` : `hace ${Math.round(m / 1440)} d`;
};

export default async function Limpieza() {
  const s = await verificarSesion();
  const [tareas, habs] = await Promise.all([tareasActivas(), listarHabitaciones(true)]);
  const reciente = Date.now() - 24 * 3600_000;
  const col = (e: string) => tareas.filter((x) => x.t.estado === e && (e !== "lista" || (x.t.terminada?.getTime() ?? 0) > reciente));
  const columnas = [
    { k: "pendiente", t: "Por limpiar", c: "chip-sucia" },
    { k: "en_proceso", t: "Limpiando", c: "chip-limpiando" },
    { k: "lista", t: "Listas (24 h)", c: "chip-libre" },
  ] as const;

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="sube">
        <h1 className="text-4xl lg:text-5xl">Limpieza</h1>
        <p className="text-sm text-[color:var(--a-suave)]">Al hacer check-out la habitación aparece aquí sola, y suena el aviso en este celular.</p>
      </div>
      {s.rol !== "limpieza" && <div className="sube" style={{ ["--i" as string]: 1 }}><SolicitarLimpieza habs={habs.map((h) => ({ id: h.id, nombre: h.nombre }))} /></div>}
      <div className="grid gap-4 lg:grid-cols-3">
        {columnas.map((c, k) => {
          const items = col(c.k);
          return (
            <section key={c.k} className="cristal sube p-4" style={{ ["--i" as string]: k + 2 }} aria-labelledby={`col-${c.k}`}>
              <h2 id={`col-${c.k}`} className="mb-3 flex items-center justify-between text-xl">
                {c.t} <span className={`chip ${c.c}`}>{items.length}</span>
              </h2>
              <ul className="space-y-3">
                {items.length === 0 && <li className="py-4 text-center text-sm text-[color:var(--a-suave)]">Nada por aquí.</li>}
                {items.map(({ t, h }) => (
                  <TarjetaTarea key={t.id} id={t.id} habitacion={h.nombre} torre={h.torre} motivo={t.motivo} estado={t.estado} tomadaPor={t.tomadaPor} hace={hace(t.terminada ?? t.iniciada ?? t.creada)} />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
