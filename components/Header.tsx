"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { NAV, enlaceReserva } from "@/lib/site";

export default function Header() {
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

  const esconder = oculto && !abierto;
  return (
    <header className={`fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-500 sm:px-6 ${esconder ? "-translate-y-full" : "translate-y-0"}`}>
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 py-2 shadow-lg shadow-black/10 transition-colors duration-500 ${
          scrolled ? "border border-arena bg-hueso/95 text-tinta backdrop-blur-md" : "vidrio bg-black/25 text-hueso"
        }`}
      >
        <Link href="/" aria-label="Kiimala Villas & Hotel, inicio" onClick={() => setAbierto(false)}>
          <Image src={scrolled ? "/marca/logo-tinta.png" : "/marca/logo-hueso.png"} alt="Kiimala Villas & Hotel" width={140} height={42} className="h-9 w-auto" priority />
        </Link>
        <nav className="hidden items-center gap-6 text-sm tracking-wide lg:flex" aria-label="Principal">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="opacity-90 transition hover:text-terracota-osc hover:opacity-100">{n.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href={enlaceReserva({})} className="hidden rounded-full bg-terracota-osc px-5 py-2 text-sm font-medium text-white transition hover:brightness-110 sm:block">Reservar</Link>
          <button className="rounded-full p-2 lg:hidden" aria-expanded={abierto} aria-controls="menu-movil" aria-label="Menú" onClick={() => setAbierto((v) => !v)}>
            <span className="block h-0.5 w-6 bg-current" /><span className="mt-1.5 block h-0.5 w-6 bg-current" /><span className="mt-1.5 block h-0.5 w-6 bg-current" />
          </button>
        </div>
      </div>
      {abierto && (
        <nav id="menu-movil" aria-label="Menú móvil" className="mx-auto mt-2 max-w-6xl rounded-3xl bg-tinta/95 p-5 text-hueso lg:hidden">
          <ul className="space-y-3 text-lg">
            {NAV.map((n) => (
              <li key={n.href}><Link href={n.href} onClick={() => setAbierto(false)}>{n.label}</Link></li>
            ))}
            <li><Link href="/contacto" onClick={() => setAbierto(false)}>Contacto</Link></li>
            <li><Link href={enlaceReserva({})} onClick={() => setAbierto(false)} className="inline-block rounded-full bg-terracota-osc px-5 py-2 text-white">Reservar</Link></li>
          </ul>
        </nav>
      )}
    </header>
  );
}
