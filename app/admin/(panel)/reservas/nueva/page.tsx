import Link from "next/link";
import FormReserva from "@/components/admin/FormReserva";
import { exigirRol } from "@/lib/dal";
import { esFecha, hoyCO } from "@/lib/fechas";

export const metadata = { title: "Nueva reserva" };

export default async function NuevaReserva({ searchParams }: { searchParams: Promise<{ entrada?: string; hab?: string }> }) {
  await exigirRol("admin", "recepcion", "ventas");
  const sp = await searchParams;
  const hoy = hoyCO();
  const entrada = esFecha(sp.entrada) && sp.entrada >= hoy ? sp.entrada : undefined;
  const hab = Number(sp.hab);
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="sube">
        <Link href="/admin/reservas" className="text-sm text-[color:var(--a-suave)] hover:text-white">← Reservas</Link>
        <h1 className="text-4xl lg:text-5xl">Nueva reserva</h1>
      </div>
      <div className="sube" style={{ ["--i" as string]: 1 }}>
        <FormReserva hoy={hoy} entradaInicial={entrada} habInicial={Number.isInteger(hab) && hab > 0 ? hab : undefined} />
      </div>
    </div>
  );
}
