import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, leerSesion } from "@/lib/auth";
import { inicioDe, puedeVer } from "@/lib/modulos";

// Todo /admin (salvo /admin/login) exige sesión; cada rol solo entra a sus módulos.
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();
  const sesion = await leerSesion(req.cookies.get(COOKIE)?.value);
  if (!sesion) return NextResponse.redirect(new URL("/admin/login", req.url));
  if (!puedeVer(sesion.rol, pathname)) return NextResponse.redirect(new URL(inicioDe(sesion.rol), req.url));
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
