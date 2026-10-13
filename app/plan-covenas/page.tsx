import type { Metadata } from "next";
import { Boton, Foto, Kicker, PaginaHero, Seccion, Titulo } from "@/components/ui";
import { PLANES, TEMPORADAS } from "@/data/planes";
import { FOTO } from "@/data/fotos";
import { SITE, enlaceReserva } from "@/lib/site";

export const metadata: Metadata = {
  title: "Plan Coveñas",
  description: "Planes de hospedaje en Coveñas con Kiimala: solo alojamiento, desayuno y cena, alimentación completa o paquete con transporte desde Medellín.",
};

export default function PlanCovenas() {
  return (
    <>
      <PaginaHero kicker="Plan Coveñas" titulo="Tu escapada al Caribe, resuelta" texto="Elige cómo quieres vivir Kiimala: solo hospedaje o con todo incluido." foto={FOTO.piscinaInfinita} />

      <Seccion>
        <Titulo kicker="Planes" titulo="Cuatro formas de disfrutar" />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {PLANES.map((p) => (
            <article key={p.id} className="vidrio-solido flex flex-col rounded-3xl p-8">
              <h3 className="text-3xl">{p.nombre}</h3>
              <p className="mt-2 opacity-80">{p.resumen}</p>
              <ul className="mt-5 space-y-1.5">
                {p.incluye.map((i) => <li key={i} className="flex justify-center gap-2"><span className="text-terracota-osc" aria-hidden>✦</span>{i}</li>)}
              </ul>
              {p.nota && <p className="mt-5 text-sm font-medium text-palma">{p.nota}</p>}
            </article>
          ))}
        </div>
      </Seccion>

      <Seccion fondo="arena">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <Titulo kicker="Con transporte" titulo="Sales de Medellín, llegas a la playa" texto="Con Destidnos, nuestra agencia aliada, viajas en bus ida y regreso, con seguro de viaje y hospedaje en Kiimala. Tú solo empacas." />
            <ul className="mt-6 space-y-2">
              <li className="flex justify-center gap-2"><span className="text-terracota-osc" aria-hidden>✦</span>Salidas programadas por calendario (semana, fin de semana y puentes).</li>
              <li className="flex justify-center gap-2"><span className="text-terracota-osc" aria-hidden>✦</span>Habitación Múltiple, Triple o Doble.</li>
              <li className="flex justify-center gap-2"><span className="text-terracota-osc" aria-hidden>✦</span>Plan de alimentación a tu elección.</li>
            </ul>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Boton href={SITE.destidnos}>Ver salidas en Destidnos</Boton>
              <Boton href="/contacto" variante="borde">Preguntar por fechas</Boton>
            </div>
          </div>
          <Foto src={FOTO.playaTuristas} alt="Huéspedes en la playa de Kiimala" className="aspect-[4/5] rounded-[2rem]" />
        </div>
      </Seccion>

      <Seccion>
        <Titulo kicker="Temporadas" titulo="Las tarifas cambian según la fecha" texto="Para darte el valor exacto, confirmamos con tus fechas y el número de personas." />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPORADAS.map((t) => (
            <div key={t.nombre} className="rounded-3xl border border-arena p-6">
              <Kicker>Temporada</Kicker>
              <h3 className="mt-2 text-2xl">{t.nombre}</h3>
              <p className="mt-1 text-sm opacity-75">{t.detalle}</p>
            </div>
          ))}
        </div>
        <div className="mt-10"><Boton href={enlaceReserva({})}>Quiero reservar</Boton></div>
      </Seccion>
    </>
  );
}
