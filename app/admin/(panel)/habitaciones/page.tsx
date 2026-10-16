import { gte } from "drizzle-orm";
import { BotonQuitarBloqueo, FormBloquear, FormEditarHabitacion } from "@/components/admin/FormsHabitacion";
import { getDb, bloqueos } from "@/lib/db";
import { fechaLarga, hoyCO } from "@/lib/fechas";
import { estadoHabitacionesHoy } from "@/lib/hotel";

export const metadata = { title: "Habitaciones" };

const CHIP = { libre: "chip-libre", ocupada: "chip-ocupada", llega: "chip-reservada", bloqueada: "chip-bloqueada" } as const;
const TXT = { libre: "Libre hoy", ocupada: "Ocupada", llega: "Llega hoy", bloqueada: "Bloqueada / inactiva" } as const;

export default async function Habitaciones() {
  const hoy = hoyCO();
  const db = await getDb();
  const [mapa, blq] = await Promise.all([estadoHabitacionesHoy(), db.select().from(bloqueos).where(gte(bloqueos.hasta, hoy)).orderBy(bloqueos.desde)]);
  const torres = [...new Set(mapa.map((m) => m.hab.torre))];
  const nombre = new Map(mapa.map((m) => [m.hab.id, m.hab.nombre]));
  const capTotal = mapa.filter((m) => m.hab.activa).reduce((a, m) => a + m.hab.capacidad, 0);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="sube">
        <h1 className="text-4xl lg:text-5xl">Habitaciones</h1>
        <p className="text-sm text-[color:var(--a-suave)]">{mapa.length} habitaciones · capacidad total {capTotal} personas</p>
      </div>

      <section className="cristal sube space-y-4 p-5" style={{ ["--i" as string]: 1 }} aria-labelledby="bloqueos">
        <h2 id="bloqueos" className="text-2xl">Bloquear una habitación</h2>
        <FormBloquear habs={mapa.filter((m) => m.hab.activa).map((m) => ({ id: m.hab.id, nombre: m.hab.nombre }))} hoy={hoy} />
        {blq.length > 0 && (
          <ul className="divide-y divide-white/10 border-t border-white/10 pt-2">
            {blq.map((b) => (
              <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                <span><strong>{nombre.get(b.habitacionId)}</strong> · {fechaLarga(b.desde)} → {fechaLarga(b.hasta)} · <span className="text-[color:var(--a-suave)]">{b.motivo}</span></span>
                <BotonQuitarBloqueo id={b.id} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {torres.map((t, k) => (
        <section key={t} className="sube space-y-3" style={{ ["--i" as string]: k + 2 }} aria-label={`Torre ${t}`}>
          <h2 className="text-3xl">Torre {t}</h2>
          <ul className="grid gap-3 md:grid-cols-2">
            {mapa.filter((m) => m.hab.torre === t).map((m) => (
              <li key={m.hab.id} id={`h${m.hab.id}`} className="cristal p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-serif text-2xl leading-none">{m.hab.nombre}{m.hab.vip && <span className="ml-2 text-xs text-amber-300">VIP</span>}</p>
                    <p className="mt-1 text-xs text-[color:var(--a-suave)]">{m.hab.capacidad} personas · {m.hab.camas}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className={`chip ${CHIP[m.estado]}`}>{TXT[m.estado]}</span>
                    {m.hab.limpieza !== "limpia" && <span className={`chip ${m.hab.limpieza === "sucia" ? "chip-sucia" : "chip-limpiando"}`}>{m.hab.limpieza === "sucia" ? "Por limpiar" : "Limpiando"}</span>}
                  </div>
                </div>
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm text-[color:var(--a-suave)] hover:text-white">Editar</summary>
                  <FormEditarHabitacion h={{ id: m.hab.id, capacidad: m.hab.capacidad, camas: m.hab.camas, notas: m.hab.notas, activa: m.hab.activa }} />
                </details>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
