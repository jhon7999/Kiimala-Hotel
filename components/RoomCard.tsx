import Link from "next/link";
import type { Habitacion } from "@/data/habitaciones";
import { pesos } from "@/lib/site";
import { Foto } from "./ui";

export default function RoomCard({ h }: { h: Habitacion }) {
  return (
    <Link href={`/habitaciones/${h.slug}`} className="group relative block overflow-hidden rounded-[2rem]">
      <Foto src={h.fotos[0]} alt={h.nombre} className="aspect-[4/5] md:aspect-[3/4]" sizes="(min-width: 768px) 33vw, 100vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="vidrio absolute inset-x-4 bottom-4 rounded-2xl bg-black/30 p-5 text-center text-hueso">
        <p className="text-xs uppercase tracking-widest text-arena">{h.personas}</p>
        <h3 className="mt-1 text-3xl">{h.nombre}</h3>
        <p className="mt-2 text-sm opacity-90">{h.resumen}</p>
        <p className="mt-3 text-sm font-medium">
          {h.desde ? `Desde ${pesos(h.desde)} por persona / noche` : "Consulta tarifa"}
          <span aria-hidden className="ml-1 transition-all group-hover:ml-2">→</span>
        </p>
      </div>
    </Link>
  );
}
