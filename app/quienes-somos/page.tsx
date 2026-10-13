import type { Metadata } from "next";
import { Boton, Foto, PaginaHero, Seccion, Titulo } from "@/components/ui";
import { FOTO } from "@/data/fotos";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Quiénes somos",
  description: "Conoce al equipo y la historia de Kiimala Villas & Hotel, un refugio frente al mar en Coveñas.",
};

const VALORES = [
  { t: "Calidez", d: "Aquí no eres un número de habitación. Te recibimos como en casa." },
  { t: "Naturaleza", d: "Palmeras, brisa y mar. El hotel está pensado para que lo natural sea protagonista." },
  { t: "Buena vibra", d: "Sol, playa y gente amable. Lo demás lo ponemos nosotros." },
];

export default function QuienesSomos() {
  return (
    <>
      <PaginaHero kicker="Quiénes somos" titulo="Un refugio para el alma" foto={FOTO.fachada} />
      <Seccion>
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <Titulo
              kicker="Nuestra casa"
              titulo="Hecho para desconectarse"
              texto="Kiimala Villas & Hotel nació frente al mar de Coveñas con una idea sencilla: que quien llegue pueda descansar de verdad. Cabañas blancas, una piscina rodeada de palmeras, cenas bajo luces cálidas y el Golfo de Morrosquillo a pocos pasos."
            />
            <p className="mt-4 text-lg opacity-80">Muchos de nuestros huéspedes nos dicen que quieren volver. Para nosotros, esa es la mejor reseña.</p>
          </div>
          <Foto src={FOTO.equipo} alt="Parte del equipo de Kiimala" className="aspect-[4/5] rounded-[2rem]" />
        </div>
      </Seccion>

      <Seccion fondo="arena">
        <Titulo kicker="Lo que nos mueve" titulo="Tres ideas simples" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {VALORES.map((v) => (
            <div key={v.t} className="vidrio-solido rounded-3xl p-8">
              <h3 className="text-3xl">{v.t}</h3>
              <p className="mt-2 opacity-80">{v.d}</p>
            </div>
          ))}
        </div>
      </Seccion>

      <Seccion>
        <div className="grid items-center gap-12 md:grid-cols-2">
          <Foto src={FOTO.playaNoche} alt="Mesa en la playa con luces cálidas" className="aspect-[4/3] rounded-[2rem]" />
          <div>
            <Titulo kicker="Aliados" titulo="Viaja con nosotros desde Medellín" texto="Trabajamos de la mano con Destidnos, agencia de viajes aliada, para quienes quieren llegar con transporte y plan completo." />
            <div className="mt-6 flex flex-wrap gap-3">
              <Boton href="/plan-covenas">Plan Coveñas</Boton>
              <Boton href={SITE.destidnos} variante="borde">Conocer Destidnos</Boton>
            </div>
          </div>
        </div>
      </Seccion>
    </>
  );
}
