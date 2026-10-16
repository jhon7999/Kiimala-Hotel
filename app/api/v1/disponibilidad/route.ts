import { NextResponse } from "next/server";
import { autenticarApi } from "@/lib/apiAuth";
import { esFecha, hoyCO, noches } from "@/lib/fechas";
import { disponibles, sugerirCombinacion } from "@/lib/hotel";

export const dynamic = "force-dynamic";
const sin = { "Cache-Control": "no-store" };

/**
 * GET /api/v1/disponibilidad?entrada=YYYY-MM-DD&salida=YYYY-MM-DD&personas=N
 * Solo disponibilidad: nunca devuelve datos de huéspedes ni de reservas.
 */
export async function GET(req: Request) {
  const auth = await autenticarApi(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status, headers: sin });

  const u = new URL(req.url);
  const entrada = u.searchParams.get("entrada");
  const salida = u.searchParams.get("salida");
  const personas = Math.max(0, Math.round(Number(u.searchParams.get("personas") ?? "0")) || 0);
  if (!esFecha(entrada) || !esFecha(salida)) return NextResponse.json({ error: "Usa entrada y salida con formato YYYY-MM-DD" }, { status: 400, headers: sin });
  if (noches(entrada, salida) < 1 || noches(entrada, salida) > 60) return NextResponse.json({ error: "La salida debe ser posterior a la entrada (máx. 60 noches)" }, { status: 400, headers: sin });
  if (entrada < hoyCO()) return NextResponse.json({ error: "La entrada no puede estar en el pasado" }, { status: 400, headers: sin });

  const libres = await disponibles(entrada, salida);
  const capacidadLibre = libres.reduce((a, h) => a + h.capacidad, 0);
  const sug = personas > 0 ? sugerirCombinacion(libres, personas) : null;
  const forma = (h: (typeof libres)[number]) => ({ id: h.id, nombre: h.nombre, torre: h.torre, capacidad: h.capacidad, camas: h.camas, vip: h.vip });

  return NextResponse.json(
    {
      entrada,
      salida,
      noches: noches(entrada, salida),
      personas: personas || null,
      habitaciones_libres: libres.length,
      capacidad_libre: capacidadLibre,
      alcanza: personas > 0 ? capacidadLibre >= personas : null,
      habitaciones: libres.map(forma),
      sugerencia: sug ? { habitaciones: sug.map(forma), capacidad: sug.reduce((a, h) => a + h.capacidad, 0) } : null,
    },
    { headers: sin },
  );
}
