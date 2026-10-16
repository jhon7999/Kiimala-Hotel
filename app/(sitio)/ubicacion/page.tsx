import type { Metadata } from "next";
import { Boton, PaginaHero, Seccion, Titulo } from "@/components/ui";
import { FOTO } from "@/data/fotos";
import { MAPA_EMBED, MAPA_ENLACE } from "@/lib/mapa";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ubicación y cómo llegar",
  description: "Kiimala Villas & Hotel está en Coveñas, Sucre, en el Golfo de Morrosquillo. Cómo llegar desde Medellín, Montería, Cartagena y Tolú.",
};

const RUTAS = [
  { de: "Desde Medellín", t: "Por carretera, aproximadamente 8 horas. Con Destidnos puedes viajar en bus ida y regreso." },
  { de: "Desde Montería", t: "Es el aeropuerto más cercano con vuelos nacionales; desde allí se llega por carretera." },
  { de: "Desde Cartagena", t: "Por carretera por la costa, con parada opcional en Tolú." },
  { de: "Desde Tolú", t: "Muy cerca: Tolú y Coveñas son vecinos sobre el mismo golfo." },
];

export default function Ubicacion() {
    return (
    <>
      <PaginaHero kicker="Ubicación" titulo="Coveñas, Golfo de Morrosquillo" foto={FOTO.senderoPlaya} />
      <Seccion>
        <Titulo titulo="Cómo llegar" texto="Coveñas, en el departamento de Sucre, es uno de los destinos de playa más accesibles del Caribe colombiano. Los tiempos son aproximados y dependen del tráfico y la temporada." />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {RUTAS.map((r) => (
            <div key={r.de} className="rounded-3xl border border-arena p-6">
              <h3 className="text-2xl">{r.de}</h3>
              <p className="mt-1 opacity-80">{r.t}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm opacity-70">Te enviamos la ubicación exacta y las indicaciones finales al confirmar tu reserva.</p>
      </Seccion>
      <Seccion fondo="arena" className="!py-14">
        <div className="overflow-hidden rounded-3xl">
          <iframe
            title="Mapa de Kiimala Villas y Hotel"
            src={MAPA_EMBED}
            className="h-[420px] w-full border-0"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <p className="mt-4 text-sm opacity-70">{SITE.direccion}</p>
        <div className="mt-6"><Boton href={MAPA_ENLACE} variante="borde">Abrir en Google Maps</Boton> <Boton href="/contacto">Pregúntanos cómo llegar</Boton></div>
      </Seccion>
    </>
  );
}
