import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE, leerSesion } from "@/lib/auth";
import { pulso } from "@/lib/hotel";

export const dynamic = "force-dynamic";

// Sondeo del panel (sonidos y avisos). Solo con sesión; devuelve contadores, nunca datos de huéspedes.
export async function GET() {
  const s = await leerSesion((await cookies()).get(COOKIE)?.value);
  if (!s) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  return NextResponse.json(await pulso(), { headers: { "Cache-Control": "no-store" } });
}
