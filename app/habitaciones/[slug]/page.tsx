import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import RoomCard from "@/components/RoomCard";
import { Boton, Foto, PaginaHero, Seccion, Titulo } from "@/components/ui";
import { HABITACIONES, habitacionPorSlug } from "@/data/habitaciones";
import { SITE, enlaceReserva, pesos } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return HABITACIONES.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const h = habitacionPorSlug((await params).slug);
  if (!h) return {};
  return { title: h.nombre, description: `${h.resumen} Kiimala Villas & Hotel, Coveñas.`, openGraph: { images: [h.fotos[0]] } };
}

export default async function HabitacionPage({ params }: Props) {
  const h = habitacionPorSlug((await params).slug);
  if (!h) notFound();
  const otras = HABITACIONES.filter((x) => x.slug !== h.slug);

  const ld = {
    "@context": "https://schema.org",
    "@type": "HotelRoom",
    name: h.nombre,
    description: h.descripcion,
    image: h.fotos.map((f) => `${SITE.url}${f}`),
    containedInPlace: { "@type": "Hotel", name: SITE.nombre, url: SITE.url },
  };

  return (
    <>
      <JsonLd data={ld} />
      <PaginaHero kicker={h.personas} titulo={h.nombre} texto={h.resumen} foto={h.fotos[0]} />
      <Seccion>
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr]">
          <div>
            <Titulo titulo="Tu espacio en Kiimala" texto={h.descripcion} />
            <h3 className="mt-10 text-2xl">Incluye</h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {h.incluye.map((i) => (
                <li key={i} className="flex gap-2"><span className="text-terracota-osc" aria-hidden>✦</span>{i}</li>
              ))}
            </ul>
          </div>
          <aside className="vidrio-solido h-fit rounded-3xl p-8">
            <p className="text-xs uppercase tracking-widest text-terracota-osc">Tarifa</p>
            <p className="mt-2 font-serif text-4xl">{h.desde ? `Desde ${pesos(h.desde)}` : "Consúltala"}</p>
            <p className="mt-2 text-sm opacity-75">{h.tarifaNota}</p>
            <div className="mt-6"><Boton href={enlaceReserva({ hab: h.nombre })}>Reservar esta habitación</Boton></div>
          </aside>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {h.fotos.map((f, i) => (
            <Foto key={f} src={f} alt={`${h.nombre}, foto ${i + 1}`} className="aspect-[4/5] rounded-3xl" sizes="(min-width: 640px) 33vw, 100vw" />
          ))}
        </div>
      </Seccion>

      <Seccion fondo="arena">
        <Titulo titulo="Otras habitaciones" />
        <div className="mt-8 grid gap-6 md:grid-cols-2">{otras.map((o) => <RoomCard key={o.slug} h={o} />)}</div>
      </Seccion>
    </>
  );
}
