import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import AccionesReserva from "@/components/admin/AccionesReserva";
import Icono from "@/components/admin/Icono";
import { verificarSesion } from "@/lib/dal";
import { getDb, habitaciones, reservas } from "@/lib/db";
import { cop, fechaLarga, hoyCO, noches } from "@/lib/fechas";

export const metadata = { title: "Reserva" };

const CHIP: Record<string, [string, string]> = {
  confirmada: ["chip-reservada", "Reservada"],
  en_casa: ["chip-ocupada", "En casa"],
  finalizada: ["chip-libre", "Finalizada"],
  cancelada: ["chip-cancelada", "Cancelada"],
};

export default async function DetalleReserva({ params }: { params: Promise<{ id: string }> }) {
  const s = await verificarSesion();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const db = await getDb();
  const [base] = await db.select().from(reservas).where(eq(reservas.id, id));
  if (!base) notFound();
  const grupo = base.grupo ? await db.select({ r: reservas, h: habitaciones }).from(reservas).innerJoin(habitaciones, eq(habitaciones.id, reservas.habitacionId)).where(eq(reservas.grupo, base.grupo)) : null;
  const [unica] = grupo ? [] : await db.select({ r: reservas, h: habitaciones }).from(reservas).innerJoin(habitaciones, eq(habitaciones.id, reservas.habitacionId)).where(eq(reservas.id, id));
  const filas = grupo ?? [unica];
  const total = filas.reduce((a, x) => a + x.r.total, 0);
  const abonado = filas.reduce((a, x) => a + x.r.abonado, 0);
  const saldo = total - abonado;
  const [cls, txt] = CHIP[base.estado] ?? ["chip-reservada", base.estado];
  const operador = s.rol === "admin" || s.rol === "recepcion";
  const tel = base.telefono.replace(/\D/g, "");
  const n = noches(base.entrada, base.salida);

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="sube">
        <Link href="/admin/reservas" className="text-sm text-[color:var(--a-suave)] hover:text-white">← Reservas</Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-4xl lg:text-5xl">{base.huesped}</h1>
          <span className={`chip ${cls}`}>{txt}</span>
        </div>
        <p className="text-sm text-[color:var(--a-suave)]">Código {base.grupo ?? base.codigo} · canal {base.canal}</p>
      </div>

      <section className="cristal sube grid gap-5 p-5 sm:grid-cols-2" style={{ ["--i" as string]: 1 }}>
        <div>
          <p className="etiqueta">Estadía</p>
          <p className="text-lg">{fechaLarga(base.entrada)} → {fechaLarga(base.salida)}</p>
          <p className="text-sm text-[color:var(--a-suave)]">{n} {n === 1 ? "noche" : "noches"} · {filas.reduce((a, x) => a + x.r.personas, 0)} personas</p>
          {base.notas && <p className="mt-3 text-sm"><span className="etiqueta">Notas</span>{base.notas}</p>}
        </div>
        <div>
          <p className="etiqueta">Habitaciones</p>
          <ul className="space-y-1">
            {filas.map((x) => (
              <li key={x.r.id} className="flex items-center justify-between gap-2 text-sm">
                <span>{x.h.nombre} <span className="text-[color:var(--a-suave)]">· {x.r.personas} pers.</span></span>
                <span className="text-xs text-[color:var(--a-suave)]">{x.h.camas.split("·")[0]}</span>
              </li>
            ))}
          </ul>
          {tel && (
            <a href={`https://wa.me/${tel}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm mt-4"><Icono n="phone" className="size-4" /> Escribir por WhatsApp</a>
          )}
        </div>
      </section>

      <section className="cristal sube p-5" style={{ ["--i" as string]: 2 }}>
        <div className="grid gap-4 sm:grid-cols-3">
          <div><p className="etiqueta">Total</p><p className="font-serif text-3xl">{cop(total)}</p></div>
          <div><p className="etiqueta">Abonado</p><p className="font-serif text-3xl">{cop(abonado)}</p></div>
          <div><p className="etiqueta">Saldo</p><p className={`font-serif text-3xl ${saldo > 0 ? "text-amber-300" : "text-emerald-300"}`}>{total > 0 ? cop(saldo) : "—"}</p></div>
        </div>
        <div className="mt-5 border-t border-white/10 pt-5">
          <AccionesReserva id={base.id} estado={base.estado} puedeIngresar={base.entrada <= hoyCO()} saldo={saldo} total={total} operador={operador} />
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href={`/admin/reservas/${base.id}/recibo`} className="btn btn-sm"><Icono n="print" className="size-4" /> Recibo imprimible</Link>
        </div>
      </section>
    </div>
  );
}
