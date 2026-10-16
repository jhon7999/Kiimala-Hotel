import Link from "next/link";
import Icono from "@/components/admin/Icono";
import Tablero from "@/components/admin/Tablero";
import { esFecha, fechaLarga, hoyCO, sumarDias } from "@/lib/fechas";
import { bloqueosEnRango, listarHabitaciones, reservasEnRango } from "@/lib/hotel";

export const metadata = { title: "Calendario" };

const OPCIONES = [7, 14, 21, 30];

export default async function Calendario({ searchParams }: { searchParams: Promise<{ desde?: string; dias?: string }> }) {
  const sp = await searchParams;
  const hoy = hoyCO();
  const desde = esFecha(sp.desde) ? sp.desde : hoy;
  const dias = OPCIONES.includes(Number(sp.dias)) ? Number(sp.dias) : 14;
  const hasta = sumarDias(desde, dias);
  const [habs, res, blq] = await Promise.all([listarHabitaciones(true), reservasEnRango(desde, hasta), bloqueosEnRango(desde, hasta)]);
  const q = (d: string, n = dias) => `/admin/calendario?desde=${d}&dias=${n}`;

  return (
    <div className="mx-auto max-w-[110rem] space-y-4">
      <div className="sube flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-4xl lg:text-5xl">Calendario</h1>
          <p className="text-sm text-[color:var(--a-suave)]">{fechaLarga(desde)} → {fechaLarga(sumarDias(hasta, -1))}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href={q(sumarDias(desde, -dias))} className="btn btn-sm" aria-label="Periodo anterior"><Icono n="left" className="size-4" /></Link>
          <Link href={q(hoy)} className="btn btn-sm">Hoy</Link>
          <Link href={q(sumarDias(desde, dias))} className="btn btn-sm" aria-label="Periodo siguiente"><Icono n="right" className="size-4" /></Link>
          <span className="mx-1 hidden h-5 w-px bg-white/15 sm:block" />
          {OPCIONES.map((n) => (
            <Link key={n} href={q(desde, n)} aria-current={n === dias ? "true" : undefined} className={`btn btn-sm ${n === dias ? "btn-p" : ""}`}>{n} días</Link>
          ))}
        </div>
      </div>

      <ul className="sube flex flex-wrap gap-x-4 gap-y-1 text-xs text-[color:var(--a-suave)]" style={{ ["--i" as string]: 1 }} aria-label="Leyenda">
        <li className="flex items-center gap-1.5"><span className="size-3 rounded bg-[#e7d9c2]" /> Reservada</li>
        <li className="flex items-center gap-1.5"><span className="size-3 rounded bg-[#a5532b]" /> En casa</li>
        <li className="flex items-center gap-1.5"><span className="cal-bloqueo size-3 rounded" /> Bloqueada</li>
        <li className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-amber-300" /> Por limpiar</li>
        <li>Toca un espacio vacío para reservar.</li>
      </ul>

      <div className="sube" style={{ ["--i" as string]: 2 }}>
        <Tablero
          habs={habs.map((h) => ({ id: h.id, nombre: h.nombre, torre: h.torre, capacidad: h.capacidad, limpieza: h.limpieza }))}
          reservas={res.map((r) => ({ id: r.id, hab: r.habitacionId, e: r.entrada, s: r.salida, estado: r.estado, huesped: r.huesped, personas: r.personas }))}
          bloqueos={blq.map((b) => ({ id: b.id, hab: b.habitacionId, d: b.desde, h: b.hasta, motivo: b.motivo }))}
          desde={desde}
          dias={dias}
          hoy={hoy}
        />
      </div>
    </div>
  );
}
