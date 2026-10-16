import Link from "next/link";
import Contador from "@/components/admin/Contador";
import Icono from "@/components/admin/Icono";
import { verificarSesion } from "@/lib/dal";
import { fechaLarga } from "@/lib/fechas";
import { estadoHabitacionesHoy, resumenHoy } from "@/lib/hotel";

export const metadata = { title: "Inicio" };

const CHIP = { libre: "chip-libre", ocupada: "chip-ocupada", llega: "chip-reservada", bloqueada: "chip-bloqueada" } as const;
const TXT = { libre: "Libre", ocupada: "Ocupada", llega: "Llega hoy", bloqueada: "Bloqueada" } as const;

export default async function Inicio() {
  const s = await verificarSesion();
  const [r, mapa] = await Promise.all([resumenHoy(), estadoHabitacionesHoy()]);
  const hora = Number(new Intl.DateTimeFormat("es-CO", { hour: "numeric", hour12: false, timeZone: "America/Bogota" }).format(new Date()));
  const saludo = hora < 12 ? "Buenos días" : hora < 19 ? "Buenas tardes" : "Buenas noches";
  const nombresHab = new Map(mapa.map((m) => [m.hab.id, m.hab.nombre]));
  const torres = [...new Set(mapa.map((m) => m.hab.torre))];

  const tarjetas = [
    { t: "Ocupación hoy", v: r.ocupacionPct, suf: "%", sub: `${r.ocupadas} de ${r.totalHabs} habitaciones`, i: "bed" },
    { t: "Libres hoy", v: r.libres, suf: "", sub: r.bloqueadas ? `${r.bloqueadas} bloqueada(s)` : "listas para vender", i: "sparkles" },
    { t: "Personas en casa", v: r.personasEnCasa, suf: "", sub: `capacidad ${r.capacidadTotal}`, i: "users" },
    { t: "Limpiezas pendientes", v: r.tareasPendientes, suf: "", sub: `${r.sucias} habitación(es) por limpiar`, i: "sparkles", aviso: r.tareasPendientes > 0 },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="sube flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-[color:var(--a-suave)]">{fechaLarga(r.hoy)}</p>
          <h1 className="text-4xl lg:text-5xl">{saludo}, {s.nombre.split(" ")[0]}</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/reservas/nueva" className="btn btn-p"><Icono n="plus" className="size-4" /> Nueva reserva</Link>
          <Link href="/admin/calendario" className="btn"><Icono n="calendar" className="size-4" /> Calendario</Link>
        </div>
      </div>

      <section aria-label="Resumen" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tarjetas.map((c, k) => (
          <div key={c.t} className="cristal sube p-4 lg:p-5" style={{ ["--i" as string]: k + 1 }}>
            <div className="flex items-center justify-between text-[color:var(--a-suave)]">
              <p className="text-xs font-medium uppercase tracking-wider">{c.t}</p>
              <Icono n={c.i} className="size-4" />
            </div>
            <p className={`mt-2 font-serif text-5xl ${c.aviso ? "text-amber-300" : ""}`}><Contador valor={c.v} sufijo={c.suf} /></p>
            <p className="mt-1 text-xs text-[color:var(--a-suave)]">{c.sub}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="cristal sube p-5" style={{ ["--i" as string]: 5 }} aria-labelledby="llegadas">
          <h2 id="llegadas" className="text-2xl">Llegan hoy <span className="text-base text-[color:var(--a-suave)]">({r.llegadas.length})</span></h2>
          <ul className="mt-3 divide-y divide-white/10">
            {r.llegadas.length === 0 && <li className="py-3 text-sm text-[color:var(--a-suave)]">No hay llegadas pendientes.</li>}
            {r.llegadas.map((x) => (
              <li key={x.id}>
                <Link href={`/admin/reservas/${x.id}`} className="flex items-center justify-between gap-3 py-3 hover:text-white">
                  <span><span className="font-medium">{x.huesped}</span><br /><span className="text-xs text-[color:var(--a-suave)]">{nombresHab.get(x.habitacionId)} · {x.personas} pers.</span></span>
                  <span className="btn btn-sm btn-ok">Check-in</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="cristal sube p-5" style={{ ["--i" as string]: 6 }} aria-labelledby="salidas">
          <h2 id="salidas" className="text-2xl">Salen hoy <span className="text-base text-[color:var(--a-suave)]">({r.salidas.length})</span></h2>
          <ul className="mt-3 divide-y divide-white/10">
            {r.salidas.length === 0 && <li className="py-3 text-sm text-[color:var(--a-suave)]">No hay salidas pendientes.</li>}
            {r.salidas.map((x) => (
              <li key={x.id}>
                <Link href={`/admin/reservas/${x.id}`} className="flex items-center justify-between gap-3 py-3 hover:text-white">
                  <span><span className="font-medium">{x.huesped}</span><br /><span className="text-xs text-[color:var(--a-suave)]">{nombresHab.get(x.habitacionId)} · saldo {x.total - x.abonado > 0 ? "pendiente" : "al día"}</span></span>
                  <span className="btn btn-sm">Check-out</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="cristal sube p-5" style={{ ["--i" as string]: 7 }} aria-labelledby="mapa">
        <h2 id="mapa" className="text-2xl">Mapa del hotel</h2>
        <div className="mt-4 space-y-5">
          {torres.map((t) => (
            <div key={t}>
              <p className="etiqueta">Torre {t}</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                {mapa.filter((m) => m.hab.torre === t).map((m) => (
                  <Link key={m.hab.id} href={`/admin/habitaciones#h${m.hab.id}`} className="solido flex flex-col gap-1.5 p-3 transition hover:bg-white/10">
                    <span className="flex items-center justify-between">
                      <span className="font-medium">{m.hab.nombre}{m.hab.vip && <span className="ml-1 text-xs text-amber-300">VIP</span>}</span>
                      <span className="text-xs text-[color:var(--a-suave)]">{m.hab.capacidad} pers.</span>
                    </span>
                    <span className="flex flex-wrap gap-1">
                      <span className={`chip ${CHIP[m.estado]}`}>{TXT[m.estado]}</span>
                      {m.hab.limpieza !== "limpia" && <span className={`chip ${m.hab.limpieza === "sucia" ? "chip-sucia" : "chip-limpiando"}`}>{m.hab.limpieza === "sucia" ? "Por limpiar" : "Limpiando"}</span>}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
