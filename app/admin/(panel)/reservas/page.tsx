import Link from "next/link";
import { and, desc, eq, ilike, inArray, or } from "drizzle-orm";
import Icono from "@/components/admin/Icono";
import { getDb, habitaciones, reservas } from "@/lib/db";
import { cop, fechaLarga, hoyCO, noches } from "@/lib/fechas";

export const metadata = { title: "Reservas" };

const FILTROS = [
  { k: "activas", t: "Activas" },
  { k: "casa", t: "En casa" },
  { k: "hoy", t: "Llegan hoy" },
  { k: "finalizadas", t: "Finalizadas" },
  { k: "canceladas", t: "Canceladas" },
  { k: "todas", t: "Todas" },
];
const CHIP: Record<string, [string, string]> = {
  confirmada: ["chip-reservada", "Reservada"],
  en_casa: ["chip-ocupada", "En casa"],
  finalizada: ["chip-libre", "Finalizada"],
  cancelada: ["chip-cancelada", "Cancelada"],
};

export default async function Reservas({ searchParams }: { searchParams: Promise<{ f?: string; q?: string }> }) {
  const sp = await searchParams;
  const f = FILTROS.some((x) => x.k === sp.f) ? sp.f! : "activas";
  const q = (sp.q ?? "").trim().slice(0, 60);
  const hoy = hoyCO();
  const db = await getDb();

  const cond = [
    f === "activas" ? inArray(reservas.estado, ["confirmada", "en_casa"]) : undefined,
    f === "casa" ? eq(reservas.estado, "en_casa") : undefined,
    f === "hoy" ? and(eq(reservas.estado, "confirmada"), eq(reservas.entrada, hoy)) : undefined,
    f === "finalizadas" ? eq(reservas.estado, "finalizada") : undefined,
    f === "canceladas" ? eq(reservas.estado, "cancelada") : undefined,
    q ? or(ilike(reservas.huesped, `%${q}%`), ilike(reservas.codigo, `%${q}%`), ilike(reservas.telefono, `%${q}%`)) : undefined,
  ].filter(Boolean);

  const filas = await db
    .select({ r: reservas, h: habitaciones.nombre })
    .from(reservas)
    .innerJoin(habitaciones, eq(habitaciones.id, reservas.habitacionId))
    .where(cond.length ? and(...cond) : undefined)
    .orderBy(f === "finalizadas" || f === "canceladas" || f === "todas" ? desc(reservas.entrada) : reservas.entrada)
    .limit(200);

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="sube flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-4xl lg:text-5xl">Reservas</h1>
        <Link href="/admin/reservas/nueva" className="btn btn-p"><Icono n="plus" className="size-4" /> Nueva reserva</Link>
      </div>

      <div className="sube space-y-3" style={{ ["--i" as string]: 1 }}>
        <form className="flex gap-2" role="search">
          <input type="hidden" name="f" value={f} />
          <label htmlFor="q" className="sr-only">Buscar reserva</label>
          <input id="q" name="q" defaultValue={q} placeholder="Buscar por nombre, código o teléfono" className="campo" />
          <button className="btn">Buscar</button>
        </form>
        <div className="scroll-fino flex gap-2 overflow-x-auto pb-1">
          {FILTROS.map((x) => (
            <Link key={x.k} href={`/admin/reservas?f=${x.k}${q ? `&q=${encodeURIComponent(q)}` : ""}`} aria-current={x.k === f ? "true" : undefined} className={`btn btn-sm shrink-0 ${x.k === f ? "btn-p" : ""}`}>{x.t}</Link>
          ))}
        </div>
      </div>

      <ul className="sube space-y-2" style={{ ["--i" as string]: 2 }}>
        {filas.length === 0 && <li className="cristal p-6 text-center text-[color:var(--a-suave)]">No hay reservas con ese filtro.</li>}
        {filas.map(({ r, h }) => {
          const saldo = r.total - r.abonado;
          const [cls, txt] = CHIP[r.estado] ?? ["chip-reservada", r.estado];
          return (
            <li key={r.id}>
              <Link href={`/admin/reservas/${r.id}`} className="cristal flex flex-wrap items-center justify-between gap-x-4 gap-y-2 p-4 transition hover:bg-white/12">
                <div className="min-w-0">
                  <p className="truncate font-medium">{r.huesped}</p>
                  <p className="text-xs text-[color:var(--a-suave)]">{h} · {r.personas} pers. · {fechaLarga(r.entrada)} → {fechaLarga(r.salida)} ({noches(r.entrada, r.salida)}n)</p>
                </div>
                <div className="flex items-center gap-3">
                  {r.total > 0 && <span className={`text-xs ${saldo > 0 ? "text-amber-300" : "text-emerald-300"}`}>{saldo > 0 ? `Saldo ${cop(saldo)}` : "Pagada"}</span>}
                  <span className={`chip ${cls}`}>{txt}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
