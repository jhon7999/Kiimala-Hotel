import Link from "next/link";
import { diaMes, diaSemana, mesCorto, rango, sumarDias } from "@/lib/fechas";

export type TabHab = { id: number; nombre: string; torre: string; capacidad: number; limpieza: string };
export type TabReserva = { id: number; hab: number; e: string; s: string; estado: string; huesped: string; personas: number };
export type TabBloqueo = { id: number; hab: number; d: string; h: string; motivo: string };

const BARRA: Record<string, string> = {
  en_casa: "bg-[#a5532b] text-white",
  confirmada: "bg-[#e7d9c2] text-[#1c1a15]",
  finalizada: "bg-white/20 text-white/80",
};
const ETIQUETA: Record<string, string> = { en_casa: "En casa", confirmada: "Reservada", finalizada: "Finalizada" };

/** Calendario tipo "tape chart": habitaciones en filas, noches en columnas. Server Component (sin JS en el cliente). */
export default function Tablero({ habs, reservas, bloqueos, desde, dias, hoy }: { habs: TabHab[]; reservas: TabReserva[]; bloqueos: TabBloqueo[]; desde: string; dias: number; hoy: string }) {
  const fechas = rango(desde, dias);
  const hasta = sumarDias(desde, dias);
  const colDe = (f: string) => Math.round((Date.UTC(+f.slice(0, 4), +f.slice(5, 7) - 1, +f.slice(8, 10)) - Date.UTC(+desde.slice(0, 4), +desde.slice(5, 7) - 1, +desde.slice(8, 10))) / 864e5);

  const torres = [...new Set(habs.map((h) => h.torre))];
  let fila = 2; // fila 1 = encabezado de fechas
  const celdas: React.ReactNode[] = [];

  for (const t of torres) {
    celdas.push(
      <div key={`t-${t}`} style={{ gridRow: fila, gridColumn: `1 / ${dias + 2}` }} className="sticky left-0 z-10 bg-black/25 px-3 py-1 text-xs font-medium uppercase tracking-widest text-[color:var(--a-suave)]">
        Torre {t}
      </div>,
    );
    fila++;
    for (const h of habs.filter((x) => x.torre === t)) {
      const r = fila;
      celdas.push(
        <div key={`n-${h.id}`} style={{ gridRow: r, gridColumn: 1 }} className="cal-celda sticky left-0 z-20 flex items-center justify-between gap-1 bg-[#15281d] px-3 py-2 text-sm">
          <span className="truncate font-medium">{h.nombre}</span>
          <span className="flex shrink-0 items-center gap-1 text-[11px] text-[color:var(--a-suave)]">
            {h.limpieza !== "limpia" && <span title="Por limpiar" className="size-2 rounded-full bg-amber-300" />}
            {h.capacidad}
          </span>
        </div>,
      );
      fechas.forEach((f, i) => {
        const dow = new Date(f + "T00:00:00Z").getUTCDay();
        celdas.push(
          <Link
            key={`c-${h.id}-${f}`}
            href={`/admin/reservas/nueva?entrada=${f}&hab=${h.id}`}
            aria-label={`Reservar ${h.nombre} el ${f}`}
            style={{ gridRow: r, gridColumn: i + 2 }}
            className={`cal-celda block min-h-11 transition hover:bg-white/10 ${f === hoy ? "cal-hoy" : dow === 5 || dow === 6 ? "cal-finde" : ""}`}
          />,
        );
      });
      for (const b of bloqueos.filter((x) => x.hab === h.id)) {
        const a = Math.max(colDe(b.d), 0);
        const z = Math.min(colDe(b.h), dias);
        if (z <= a) continue;
        celdas.push(
          <div key={`b-${b.id}`} style={{ gridRow: r, gridColumn: `${a + 2} / ${z + 2}` }} className="cal-bloqueo pointer-events-none z-[5] m-0.5 flex items-center overflow-hidden rounded-lg px-2 text-xs text-slate-200">
            <span className="truncate">{b.motivo}</span>
          </div>,
        );
      }
      for (const x of reservas.filter((y) => y.hab === h.id)) {
        const a = Math.max(colDe(x.e), 0);
        const z = Math.min(colDe(x.s), dias);
        if (z <= a) continue;
        celdas.push(
          <Link
            key={`r-${x.id}`}
            href={`/admin/reservas/${x.id}`}
            title={`${x.huesped} · ${ETIQUETA[x.estado] ?? x.estado}`}
            style={{ gridRow: r, gridColumn: `${a + 2} / ${z + 2}` }}
            className={`z-[6] m-0.5 flex items-center gap-1 overflow-hidden rounded-lg px-2 text-xs font-medium shadow-md transition hover:brightness-110 ${BARRA[x.estado] ?? BARRA.confirmada}`}
          >
            <span className="truncate">{x.huesped}</span>
            <span className="shrink-0 opacity-70">· {x.personas}</span>
          </Link>,
        );
      }
      fila++;
    }
  }

  return (
    <div className="cristal scroll-fino overflow-x-auto">
      <div className="grid min-w-max" style={{ gridTemplateColumns: `9.5rem repeat(${dias}, minmax(3rem, 1fr))` }}>
        <div style={{ gridRow: 1, gridColumn: 1 }} className="cal-celda sticky left-0 top-0 z-30 bg-[#15281d] px-3 py-2 text-xs uppercase tracking-wider text-[color:var(--a-suave)]">Habitación</div>
        {fechas.map((f, i) => (
          <div key={`h-${f}`} style={{ gridRow: 1, gridColumn: i + 2 }} className={`cal-celda px-1 py-2 text-center ${f === hoy ? "cal-hoy font-semibold" : ""}`}>
            <div className="text-[10px] uppercase text-[color:var(--a-suave)]">{diaSemana(f)}</div>
            <div className="text-sm">{diaMes(f)}</div>
            {(i === 0 || diaMes(f) === 1) && <div className="text-[10px] text-amber-200">{mesCorto(f)}</div>}
          </div>
        ))}
        {celdas}
      </div>
      <p className="sr-only">Calendario de {desde} a {hasta}.</p>
    </div>
  );
}
