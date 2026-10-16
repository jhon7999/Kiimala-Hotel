import { SignJWT, jwtVerify } from "jose";
import type { Rol } from "./db/schema";

export const COOKIE = "kiimala_sesion";
export type Sesion = { id: number; nombre: string; usuario: string; rol: Rol };

const clave = () => {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) {
    if (process.env.NODE_ENV === "production") throw new Error("SESSION_SECRET (mín. 32 caracteres) requerido");
    return new TextEncoder().encode("clave-solo-para-desarrollo-local-no-usar-en-produccion");
  }
  return new TextEncoder().encode(s);
};

export const firmarSesion = (s: Sesion) =>
  new SignJWT({ ...s }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("12h").sign(clave());

export async function leerSesion(token?: string): Promise<Sesion | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, clave());
    return { id: Number(payload.id), nombre: String(payload.nombre), usuario: String(payload.usuario), rol: payload.rol as Rol };
  } catch {
    return null;
  }
}
