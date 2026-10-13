import type { Metadata } from "next";
import { Suspense } from "react";
import { PaginaHero, Seccion } from "@/components/ui";
import ContactoResumen from "@/components/ContactoResumen";
import { FOTO } from "@/data/fotos";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto y reservas",
  description: "Escríbenos para reservar en Kiimala Villas & Hotel, Coveñas. Te confirmamos disponibilidad y tarifa.",
};

export default function Contacto() {
  return (
    <>
      <PaginaHero kicker="Contacto" titulo="Hablemos de tu estadía" texto="Cuéntanos fechas y personas; te confirmamos disponibilidad y tarifa." foto={FOTO.pergolaTurista} />
      <Seccion>
        <div className="grid gap-10 md:grid-cols-2">
          <Suspense fallback={<div className="min-h-40" />}>
            <ContactoResumen />
          </Suspense>
          <div className="vidrio-solido h-fit rounded-3xl p-8">
            <h2 className="text-3xl">Canales</h2>
            <ul className="mt-4 space-y-3">
              <li>
                <span className="text-xs uppercase tracking-widest text-terracota-osc">Instagram</span><br />
                <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="underline">{SITE.instagramUsuario}</a>
              </li>
              <li>
                <span className="text-xs uppercase tracking-widest text-terracota-osc">Agencia aliada</span><br />
                <a href={SITE.destidnos} target="_blank" rel="noopener noreferrer" className="underline">destidnos.com</a>
              </li>
              <li className="text-sm opacity-75">Estamos activando nuestro canal de reservas por WhatsApp. Mientras tanto, escríbenos por Instagram.</li>
            </ul>
          </div>
        </div>
      </Seccion>
    </>
  );
}
