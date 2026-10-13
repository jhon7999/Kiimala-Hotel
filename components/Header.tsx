"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Redes from "./Redes";
import { NAV, SITE, enlaceReserva } from "@/lib/site";

const ENLACES = [...NAV, { href: "/contacto", label: "Contacto" }];

export default function Header() {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false); // ya bajó de la portada: fondo sólido y texto oscuro
  const [oculto, setOculto] = useState(false); // se esconde al bajar, vuelve al subir
  const ultimo = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      if (Math.abs(y - ultimo.current) > 8) {
        setOculto(y > ultimo.current && y > 240);
        ultimo.current = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cierra al cambiar de página; con el menú abierto se bloquea el scroll y Esc lo cierra.
  useEffect(() => setAbierto(false), [pathname]);
  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [abierto]);

  const claro = scrolled && !abierto; // barra clara con texto oscuro
  const esconder = oculto && !abierto;
  const linea = "block h-0.5 w-6 rounded bg-current transition-all duration-300";

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-500 sm:px-6 ${esconder ? "-translate-y-full" : "translate-y-0"}`}>
        <div
          className={`mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 py-2 shadow-lg shadow-black/10 transition-colors duration-500 ${
            claro ? "border border-arena bg-hueso/95 text-tinta backdrop-blur-md" : "vidrio bg-black/25 text-hueso"
          }`}
        >
          <Link href="/" aria-label="Kiimala Villas & Hotel, inicio">
            <Image src={claro ? "/marca/logo-tinta.png" : "/marca/logo-hueso.png"} alt="Kiimala Villas & Hotel" width={140} height={42} className="h-9 w-auto" priority />
          </Link>
          <nav className="hidden items-center gap-6 text-sm tracking-wide lg:flex" aria-label="Principal">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className={`transition hover:text-terracota-osc ${pathname === n.href ? "opacity-100" : "opacity-90"}`}>{n.label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link href={enlaceReserva({})} className="hidden rounded-full bg-terracota-osc px-5 py-2 text-sm font-medium text-white transition hover:brightness-110 sm:block">Reservar</Link>
            <button
              className="relative flex size-11 flex-col items-center justify-center gap-1.5 rounded-full lg:hidden"
              aria-expanded={abierto}
              aria-controls="menu-movil"
              aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setAbierto((v) => !v)}
            >
              <span className={`${linea} ${abierto ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`${linea} ${abierto ? "opacity-0" : ""}`} />
              <span className={`${linea} ${abierto ? "-translate-y-2 -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Menú móvil a pantalla completa */}
      <div
        id="menu-movil"
        aria-hidden={!abierto}
        inert={!abierto}
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center bg-palma/97 px-8 pb-6 pt-24 text-center text-hueso backdrop-blur-xl transition-all duration-500 lg:hidden ${
          abierto ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav aria-label="Menú móvil">
          <ul className="space-y-1">
            {ENLACES.map((n, k) => {
              const activo = pathname === n.href;
              return (
                <li key={n.href} className={`transition-all duration-500 ${abierto ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`} style={{ transitionDelay: abierto ? `${120 + k * 55}ms` : "0ms" }}>
                  <Link href={n.href} className={`block py-2.5 font-serif text-4xl transition ${activo ? "italic text-arena" : "hover:text-arena"}`}>
                    {n.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className={`mt-8 flex w-full max-w-xs flex-col items-center gap-6 transition-all duration-500 ${abierto ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`} style={{ transitionDelay: abierto ? "560ms" : "0ms" }}>
          <Link href={enlaceReserva({})} className="w-full rounded-full bg-terracota-osc px-8 py-4 text-lg font-medium text-white shadow-lg shadow-black/20">Reservar</Link>
          <Redes />
          <p className="text-xs tracking-widest text-arena/80">{SITE.ciudad.toUpperCase()} · {SITE.region.toUpperCase()}</p>
        </div>
      </div>
    </>
  );
}
