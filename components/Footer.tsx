import Image from "next/image";
import Link from "next/link";
import Redes from "./Redes";
import { NAV, SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-palma text-center text-hueso">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 py-16">
        <Image src="/marca/logo-hueso.png" alt="Kiimala Villas & Hotel" width={200} height={60} className="h-14 w-auto" />
        <p className="mt-4 font-serif text-3xl italic text-arena">{SITE.eslogan}.</p>
        <p className="mt-2 text-sm opacity-80">{SITE.direccion}</p>
        <Redes className="mt-6" />

        <nav aria-label="Pie de página" className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-arena">{n.label}</Link>
          ))}
          <Link href="/contacto" className="hover:text-arena">Contacto</Link>
        </nav>
        <nav aria-label="Información legal" className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm opacity-80">
          <Link href="/politicas" className="hover:text-arena">Políticas del hotel</Link>
          <Link href="/privacidad" className="hover:text-arena">Privacidad y datos personales</Link>
          <a href={SITE.destidnos} target="_blank" rel="noopener noreferrer" className="hover:text-arena">Agencia aliada: Destidnos</a>
        </nav>
      </div>
      <p className="border-t border-white/10 px-6 py-5 text-xs opacity-70">© {new Date().getFullYear()} {SITE.nombre}. Coveñas, Colombia.</p>
    </footer>
  );
}
