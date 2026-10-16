import type { Rol } from "./db/schema";

// Un solo registro decide qué ve cada rol: menú, proxy y páginas usan esta misma fuente.
export type Modulo = { href: string; label: string; icono: string; roles: Rol[] };

export const MODULOS: Modulo[] = [
  { href: "/admin", label: "Inicio", icono: "home", roles: ["admin", "recepcion", "ventas"] },
  { href: "/admin/calendario", label: "Calendario", icono: "calendar", roles: ["admin", "recepcion", "ventas"] },
  { href: "/admin/reservas", label: "Reservas", icono: "ticket", roles: ["admin", "recepcion", "ventas"] },
  { href: "/admin/limpieza", label: "Limpieza", icono: "sparkles", roles: ["admin", "recepcion", "limpieza"] },
  { href: "/admin/habitaciones", label: "Habitaciones", icono: "bed", roles: ["admin", "recepcion"] },
  { href: "/admin/usuarios", label: "Usuarios", icono: "users", roles: ["admin"] },
  { href: "/admin/integraciones", label: "Integraciones", icono: "plug", roles: ["admin"] },
];

export const modulosDe = (rol: Rol) => MODULOS.filter((m) => m.roles.includes(rol));
export const inicioDe = (rol: Rol) => (rol === "limpieza" ? "/admin/limpieza" : "/admin");

export function puedeVer(rol: Rol, ruta: string) {
  const m = [...MODULOS].sort((a, b) => b.href.length - a.href.length).find((x) => ruta === x.href || ruta.startsWith(x.href + "/"));
  return !m || m.roles.includes(rol);
}
