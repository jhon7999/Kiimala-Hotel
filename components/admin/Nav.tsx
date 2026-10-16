"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cerrarSesion } from "@/app/admin/login/actions";
import Icono from "./Icono";

export type ItemNav = { href: string; label: string; icono: string };
type Props = { items: ItemNav[]; nombre: string; rol: string; pendientesLimpieza: number };

const activa = (path: string, href: string) => (href === "/admin" ? path === "/admin" : path === href || path.startsWith(href + "/"));
const insignia = (href: string, n: number) => (href === "/admin/limpieza" && n > 0 ? n : 0);

function Cierre({ className = "" }: { className?: string }) {
  return (
    <form action={cerrarSesion}>
      <button className={`btn btn-sm w-full ${className}`}><Icono n="logout" className="size-4" /> Cerrar sesión</button>
    </form>
  );
}

export function BarraLateral({ items, nombre, rol, pendientesLimpieza }: Props) {
  const path = usePathname();
  return (
    <aside className="no-imprimir fixed inset-y-0 left-0 z-40 hidden w-64 flex-col p-4 lg:flex">
      <div className="cristal flex h-full flex-col p-4">
        <Link href="/admin" className="px-2 pt-1" aria-label="Kiimala, inicio del panel">
          <Image src="/marca/logo-hueso.png" alt="Kiimala Villas & Hotel" width={150} height={45} className="h-10 w-auto" priority />
        </Link>
        <nav aria-label="Panel" className="mt-6 flex-1 space-y-1">
          {items.map((m) => {
            const on = activa(path, m.href);
            const n = insignia(m.href, pendientesLimpieza);
            return (
              <Link
                key={m.href}
                href={m.href}
                aria-current={on ? "page" : undefined}
                className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${on ? "bg-white/12 text-white" : "text-[color:var(--a-suave)] hover:bg-white/8 hover:text-white"}`}
              >
                <span aria-hidden className={`absolute left-0 top-1/2 w-[3px] -translate-y-1/2 rounded bg-gradient-to-b from-[#e7d9c2] to-[#c97b4a] transition-all duration-200 ${on ? "h-6" : "h-0"}`} />
                <Icono n={m.icono} />
                {m.label}
                {n > 0 && <span className="latido ml-auto rounded-full bg-amber-400 px-2 py-0.5 text-xs font-semibold text-black">{n}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
          <div className="px-1">
            <p className="truncate text-sm font-medium">{nombre}</p>
            <p className="text-xs capitalize text-[color:var(--a-suave)]">{rol}</p>
          </div>
          <Cierre />
        </div>
      </div>
    </aside>
  );
}

/** Barra inferior para celular: 4 accesos + "Más". */
export function BarraInferior({ items, nombre, rol, pendientesLimpieza }: Props) {
  const path = usePathname();
  const [mas, setMas] = useState(false);
  const principales = items.slice(0, items.length > 5 ? 4 : items.length);
  const resto = items.slice(principales.length);
  return (
    <>
      {mas && (
        <div className="no-imprimir fixed inset-0 z-50 flex items-end bg-black/60 lg:hidden" onClick={() => setMas(false)}>
          <div role="dialog" aria-label="Más opciones" className="cristal mb-24 w-full space-y-1 rounded-b-none p-4 mx-3" onClick={(e) => e.stopPropagation()}>
            {resto.map((m) => (
              <Link key={m.href} href={m.href} onClick={() => setMas(false)} className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-white/10">
                <Icono n={m.icono} /> {m.label}
              </Link>
            ))}
            <div className="border-t border-white/10 pt-3">
              <p className="px-1 pb-2 text-sm">{nombre} · <span className="capitalize text-[color:var(--a-suave)]">{rol}</span></p>
              <Cierre />
            </div>
          </div>
        </div>
      )}
      <nav aria-label="Navegación" className="no-imprimir cristal fixed inset-x-3 bottom-3 z-50 flex items-stretch justify-around rounded-2xl px-1 py-1 lg:hidden" style={{ paddingBottom: "max(0.25rem, env(safe-area-inset-bottom))" }}>
        {principales.map((m) => {
          const on = activa(path, m.href);
          const n = insignia(m.href, pendientesLimpieza);
          return (
            <Link key={m.href} href={m.href} aria-current={on ? "page" : undefined} className={`relative flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[11px] ${on ? "bg-white/14 text-white" : "text-[color:var(--a-suave)]"}`}>
              <Icono n={m.icono} className="size-[22px]" />
              <span className="truncate">{m.label}</span>
              {n > 0 && <span className="latido absolute right-3 top-1 rounded-full bg-amber-400 px-1.5 text-[10px] font-bold text-black">{n}</span>}
            </Link>
          );
        })}
        <button onClick={() => setMas((v) => !v)} aria-expanded={mas} className="flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[11px] text-[color:var(--a-suave)]">
          <Icono n="users" className="size-[22px]" />
          <span>Más</span>
        </button>
      </nav>
    </>
  );
}
