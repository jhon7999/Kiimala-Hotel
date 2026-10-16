"use server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, firmarSesion } from "@/lib/auth";
import { getDb, historial, usuarios } from "@/lib/db";
import { inicioDe } from "@/lib/modulos";

export type LoginEstado = { error?: string };

// Hash de relleno: evita que el tiempo de respuesta revele si el usuario existe.
const FALSO = bcrypt.hashSync("relleno-no-es-una-clave", 10);

export async function iniciarSesion(_prev: LoginEstado, form: FormData): Promise<LoginEstado> {
  const usuario = String(form.get("usuario") ?? "").trim().toLowerCase().slice(0, 60);
  const clave = String(form.get("clave") ?? "").slice(0, 200);
  if (!usuario || !clave) return { error: "Escribe tu usuario y contraseña." };

  let db;
  try {
    db = await getDb();
  } catch {
    return { error: "El sistema todavía no está conectado a su base de datos. Avisa al administrador." };
  }
  const [u] = await db.select().from(usuarios).where(eq(usuarios.usuario, usuario));
  const ahora = new Date();

  if (u?.bloqueadoHasta && u.bloqueadoHasta > ahora) {
    return { error: "Demasiados intentos. Espera unos minutos e inténtalo de nuevo." };
  }
  const ok = await bcrypt.compare(clave, u?.claveHash ?? FALSO);
  if (!u || !u.activo || !ok) {
    if (u) {
      const fallos = u.fallos + 1;
      await db
        .update(usuarios)
        .set({ fallos: fallos >= 5 ? 0 : fallos, bloqueadoHasta: fallos >= 5 ? new Date(Date.now() + 10 * 60_000) : null })
        .where(eq(usuarios.id, u.id));
    }
    return { error: "Usuario o contraseña incorrectos." };
  }

  await db.update(usuarios).set({ fallos: 0, bloqueadoHasta: null }).where(eq(usuarios.id, u.id));
  await db.insert(historial).values({ usuario: u.usuario, accion: "login", detalle: "" });
  const token = await firmarSesion({ id: u.id, nombre: u.nombre, usuario: u.usuario, rol: u.rol });
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 12 * 60 * 60,
  });
  redirect(inicioDe(u.rol));
}

export async function cerrarSesion() {
  (await cookies()).delete(COOKIE);
  redirect("/admin/login");
}
