import { NextResponse } from "next/server";
import { autenticarApi } from "@/lib/apiAuth";
import { listarHabitaciones } from "@/lib/hotel";

export const dynamic = "force-dynamic";

/** GET /api/v1/habitaciones — inventario del hotel (sin datos de huéspedes). */
export async function GET(req: Request) {
  const auth = await autenticarApi(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status, headers: { "Cache-Control": "no-store" } });
  const habs = await listarHabitaciones(true);
  return NextResponse.json(
    {
      total: habs.length,
      capacidad_total: habs.reduce((a, h) => a + h.capacidad, 0),
      habitaciones: habs.map((h) => ({ id: h.id, nombre: h.nombre, torre: h.torre, capacidad: h.capacidad, camas: h.camas, vip: h.vip })),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
