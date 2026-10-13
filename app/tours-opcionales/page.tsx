import type { Metadata } from "next";
import { Boton, Foto, PaginaHero, Seccion, Titulo } from "@/components/ui";
import { TOURS } from "@/data/tours";
import { FOTO } from "@/data/fotos";

export const metadata: Metadata = {
  title: "Tours opcionales",
  description: "Tours y experiencias opcionales cerca de Kiimala, en Coveñas y el Golfo de Morrosquillo: islas, manglares, Tolú y cenas en la playa.",
};

export default function Tours() {
  return (
    <>
      <PaginaHero kicker="Tours opcionales" titulo="Más allá de la piscina" texto="Experiencias para sumar a tu estadía. Pregúntanos y las coordinamos." foto={FOTO.atardecer} />
      <Seccion>
        <Titulo titulo="Experiencias en Coveñas y el Golfo" texto="Cada tour se coordina según clima, temporada y número de personas. Consulta disponibilidad y valor al reservar." />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TOURS.map((t) => (
            <article key={t.slug} className="overflow-hidden rounded-3xl bg-white/60 ring-1 ring-arena">
              <Foto src={t.foto} alt={t.nombre} className="aspect-[4/3]" sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />
              <div className="p-6">
                <h3 className="text-2xl">{t.nombre}</h3>
                <p className="mt-2 text-sm opacity-80">{t.resumen}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-12 rounded-3xl bg-arena/50 p-8 text-center">
          <p className="font-serif text-2xl">¿Cuál te llama la atención?</p>
          <div className="mt-5"><Boton href="/contacto">Consultar tours</Boton></div>
        </div>
      </Seccion>
    </>
  );
}
