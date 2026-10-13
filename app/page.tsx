import Link from "next/link";
import Hero from "@/components/Hero";
import RoomCard from "@/components/RoomCard";
import Testimonios from "@/components/Testimonios";
import { Boton, Foto, Seccion, Titulo } from "@/components/ui";
import { HABITACIONES } from "@/data/habitaciones";
import { MAPA_EMBED, MAPA_ENLACE } from "@/lib/mapa";
import { FOTO } from "@/data/fotos";

const ALREDEDOR = [
  { t: "Piscina", f: FOTO.piscinaCabanas, c: "md:col-span-2 md:row-span-2 aspect-square md:aspect-auto" },
  { t: "Playa", f: FOTO.playaPalapas, c: "aspect-[4/5]" },
  { t: "Terraza y bar", f: FOTO.pergola, c: "aspect-[4/5]" },
  { t: "Cenas bajo las luces", f: FOTO.playaNoche, c: "aspect-[4/5]" },
  { t: "Senderos entre palmeras", f: FOTO.senderoCabanas, c: "aspect-[4/5]" },
];

export default function Inicio() {
  return (
    <>
      <Hero />

      <Seccion>
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <Titulo
              kicker="Bienvenido"
              titulo="Hay lugares que parecen sacados de un sueño"
              texto="Kiimala Villas & Hotel está en Coveñas, a pocos pasos del mar. Cabañas blancas, piscina entre palmeras, cenas bajo luces cálidas y un equipo que te hace sentir en casa."
            />
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Boton href="/quienes-somos" variante="borde">Quiénes somos</Boton>
              <Boton href="/ubicacion" variante="borde">Cómo llegar</Boton>
            </div>
          </div>
          <Foto src={FOTO.piscinaAerea} alt="Vista de la piscina y la playa de Kiimala" zoom="inicio" className="mx-auto aspect-[4/3] w-full max-w-xl rounded-[2rem]" />
        </div>
      </Seccion>

      <Seccion fondo="arena">
        <Titulo kicker="Alrededor del hotel" titulo="Todo a pasos de tu habitación" />
        <div className="mt-10 grid auto-rows-fr grid-cols-2 gap-4 md:grid-cols-4">
          {ALREDEDOR.map((a) => (
            <figure key={a.t} className={`relative overflow-hidden rounded-3xl ${a.c}`}>
              <Foto src={a.f} alt={a.t} className="absolute inset-0" sizes="(min-width: 768px) 25vw, 50vw" />
              <figcaption className="vidrio absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/30 px-4 py-1.5 text-sm text-hueso">{a.t}</figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-8"><Boton href="/alrededores" variante="borde">Ver galería completa</Boton></div>
      </Seccion>

      <Seccion>
        <Titulo kicker="Habitaciones" titulo="Elige tu rincón" texto="Tres tipos de habitación, pensados para parejas, grupos y familias." />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {HABITACIONES.map((h) => <RoomCard key={h.slug} h={h} />)}
        </div>
      </Seccion>

      <section className="relative overflow-hidden bg-tinta px-6 py-24 text-hueso md:py-36">
        <Foto src={FOTO.cenaPlaya} alt="Cena romántica en la playa de Kiimala" className="absolute inset-0 opacity-60" sizes="100vw" posicion="50% 82%" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2">
          <div className="vidrio rounded-3xl bg-black/30 p-8">
            <h2 className="text-4xl md:text-5xl">El plan perfecto es estar aquí, juntos</h2>
            <p className="mt-4 opacity-90">Hospedaje, alimentación y, si quieres, transporte desde Medellín con nuestra agencia aliada.</p>
            <div className="mt-6"><Boton href="/plan-covenas">Conoce el plan Coveñas</Boton></div>
          </div>
          <div className="vidrio rounded-3xl bg-black/30 p-3">
            <iframe title="Ubicación y reseñas de Kiimala en Google Maps" src={MAPA_EMBED} className="h-[320px] w-full rounded-2xl border-0" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
            <p className="px-2 pb-1 pt-3 text-center text-sm"><a href={MAPA_ENLACE} target="_blank" rel="noopener noreferrer" className="underline">Ver ubicación y reseñas en Google</a></p>
          </div>
        </div>
      </section>

      <Testimonios />

      <Seccion fondo="palma">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl">Sol, playa y buena vibra</h2>
          <p className="mx-auto mt-4 max-w-xl opacity-80">Cuéntanos tus fechas y te confirmamos disponibilidad y tarifa.</p>
          <div className="mt-8"><Boton href="/contacto" variante="claro">Reservar mi estadía</Boton></div>
          <p className="mt-6 text-sm opacity-70">¿Prefieres ver más? Síguenos en <Link href="https://www.instagram.com/kiimalahotel/" className="underline">@kiimalahotel</Link></p>
        </div>
      </Seccion>
    </>
  );
}
