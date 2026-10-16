import type { Metadata } from "next";
import RoomCard from "@/components/RoomCard";
import { Boton, PaginaHero, Seccion } from "@/components/ui";
import { HABITACIONES } from "@/data/habitaciones";
import { FOTO } from "@/data/fotos";

export const metadata: Metadata = {
  title: "Habitaciones",
  description: "Habitaciones Múltiple, Triple y Doble en Kiimala, Coveñas: cómodas, con aire acondicionado y a pasos de la piscina y la playa.",
};

export default function Habitaciones() {
  return (
    <>
      <PaginaHero kicker="Habitaciones" titulo="Un lugar para cada plan" texto="Para dos, para tres o para toda la familia." foto={FOTO.fachada} />
      <Seccion>
        <div className="grid gap-6 md:grid-cols-3">
          {HABITACIONES.map((h) => <RoomCard key={h.slug} h={h} />)}
        </div>
        <div className="mt-14 rounded-3xl bg-arena/50 p-8 text-center">
          <p className="font-serif text-2xl">¿No sabes cuál elegir?</p>
          <p className="mt-2 opacity-80">Cuéntanos cuántos viajan y qué fechas tienes en mente.</p>
          <div className="mt-5"><Boton href="/contacto">Escríbenos</Boton></div>
        </div>
      </Seccion>
    </>
  );
}
