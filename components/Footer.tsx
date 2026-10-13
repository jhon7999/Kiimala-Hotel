import Image from "next/image";
import Link from "next/link";
import { NAV, SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-palma text-hueso">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-3">
        <div>
          <Image src="/marca/logo-hueso.png" alt="Kiimala Villas & Hotel" width={180} height={54} className="h-12 w-auto" />
          <p className="mt-4 font-serif text-2xl italic text-arena">{SITE.eslogan}.</p>
          <p className="mt-2 text-sm opacity-80">{SITE.direccion}</p>
        </div>
        <div>
          <h2 className="text-lg text-arena">Explora</h2>
          <ul className="mt-3 space-y-1 text-sm">
            {NAV.map((n) => <li key={n.href}><Link href={n.href} className="hover:text-arena">{n.label}</Link></li>)}
            <li><Link href="/contacto" className="hover:text-arena">Contacto</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg text-arena">Información</h2>
          <ul className="mt-3 space-y-1 text-sm">
            <li><Link href="/politicas" className="hover:text-arena">Políticas del hotel</Link></li>
            <li><Link href="/privacidad" className="hover:text-arena">Privacidad y datos personales</Link></li>
            <li><a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-arena">Instagram {SITE.instagramUsuario}</a></li>
            <li><a href={SITE.destidnos} target="_blank" rel="noopener noreferrer" className="hover:text-arena">Agencia aliada: Destidnos</a></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-white/10 px-6 py-5 text-center text-xs opacity-70">© {new Date().getFullYear()} {SITE.nombre}. Coveñas, Colombia.</p>
    </footer>
  );
}
