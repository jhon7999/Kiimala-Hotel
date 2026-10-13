import { TESTIMONIOS } from "@/data/testimonios";
import { Seccion, Titulo } from "./ui";

export default function Testimonios() {
  if (!TESTIMONIOS.length) return null;
  return (
    <Seccion fondo="arena">
      <Titulo kicker="Huéspedes" titulo="Lo que dicen de Kiimala" />
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {TESTIMONIOS.map((t) => (
          <figure key={t.autor + t.texto.slice(0, 12)} className="vidrio-solido rounded-3xl p-8">
            <span className="font-serif text-6xl leading-none text-terracota-osc" aria-hidden>“</span>
            <blockquote className="font-serif text-2xl italic leading-snug">{t.texto}</blockquote>
            <figcaption className="mt-5 text-sm opacity-70">{t.autor} · {t.fuente}</figcaption>
          </figure>
        ))}
      </div>
    </Seccion>
  );
}
