import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, leerSesion, type Sesion } from "./auth";
import type { Rol } from "./db/schema";

/** Sesión obligatoria (segunda barrera además del proxy). */
export async function verificarSesion(): Promise<Sesion> {
  const s = await leerSesion((await cookies()).get(COOKIE)?.value);
  if (!s) redirect("/admin/login");
  return s;
}

/** Para Server Actions y rutas: exige sesión y uno de los roles. */
export async function exigirRol(...roles: Rol[]): Promise<Sesion> {
  const s = await verificarSesion();
  if (roles.length && !roles.includes(s.rol)) throw new Error("Sin permiso");
  return s;
}
