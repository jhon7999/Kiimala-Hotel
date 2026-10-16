import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import BotonImprimir from "@/components/admin/BotonImprimir";
import { exigirRol } from "@/lib/dal";
import { getDb, habitaciones, reservas } from "@/lib/db";
import { cop, fechaLarga, noches } from "@/lib/fechas";

export const metadata = { title: "Recibo" };

export default async function Recibo({ params }: { params: Promise<{ id: string }> }) {
  await exigirRol("admin", "recepcion");
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const db = await getDb();
  const [base] = await db.select().from(reservas).where(eq(reservas.id, id));
  if (!base) notFound();
  const filas = await db
    .select({ r: reservas, h: habitaciones })
    .from(reservas)
    .innerJoin(habitaciones, eq(habitaciones.id, reservas.habitacionId))
    .where(base.grupo ? eq(reservas.grupo, base.grupo) : eq(reservas.id, id));
  const total = filas.reduce((a, x) => a + x.r.total, 0);
  const abonado = filas.reduce((a, x) => a + x.r.abonado, 0);
  const n = noches(base.entrada, base.salida);
  const emitido = new Intl.DateTimeFormat("es-CO", { dateStyle: "long", timeStyle: "short", timeZone: "America/Bogota" }).format(new Date());

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="no-imprimir flex items-center justify-between gap-2">
        <Link href={`/admin/reservas/${id}`} className="text-sm text-[color:var(--a-suave)] hover:text-white">← Volver a la reserva</Link>
        <BotonImprimir />
      </div>
      <article className="recibo cristal p-8" style={{ background: "rgb(255 255 255 / 0.95)", color: "#1c1a15" }}>
        <header className="flex items-start justify-between gap-4 border-b border-black/10 pb-5">
          <Image src="/marca/logo-tinta.png" alt="Kiimala Villas & Hotel" width={170} height={51} className="h-12 w-auto" />
          <div className="text-right text-sm">
            <p className="font-semibold">Recibo de reserva</p>
            <p>N.º {base.grupo ?? base.codigo}</p>
            <p className="text-xs opacity-70">{emitido}</p>
          </div>
        </header>
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="text-xs uppercase tracking-wider opacity-60">Huésped</dt><dd className="font-medium">{base.huesped}</dd></div>
          <div><dt className="text-xs uppercase tracking-wider opacity-60">Estadía</dt><dd>{fechaLarga(base.entrada)} → {fechaLarga(base.salida)} ({n} {n === 1 ? "noche" : "noches"})</dd></div>
        </dl>
        <table className="mt-5 w-full text-sm">
          <thead><tr className="border-b border-black/15 text-left text-xs uppercase tracking-wider opacity-60"><th className="py-2">Habitación</th><th>Personas</th></tr></thead>
          <tbody>
            {filas.map((x) => (<tr key={x.r.id} className="border-b border-black/5"><td className="py-2">{x.h.nombre}</td><td>{x.r.personas}</td></tr>))}
          </tbody>
        </table>
        <div className="mt-5 space-y-1 text-right text-sm">
          <p>Total: <strong>{cop(total)}</strong></p>
          <p>Abonado: {cop(abonado)}</p>
          <p className="text-base">Saldo: <strong>{cop(total - abonado)}</strong></p>
        </div>
        <p className="mt-8 border-t border-black/10 pt-4 text-xs opacity-70">
          Este recibo es un comprobante de reserva y pagos recibidos. No reemplaza la factura electrónica.
        </p>
      </article>
    </div>
  );
}
