import type { Metadata } from "next";
import { Foto, PaginaHero, Seccion, Titulo } from "@/components/ui";
import { FOTO } from "@/data/fotos";

export const metadata: Metadata = {
  title: "Alrededores y galería",
  description: "Piscina, playa, terrazas, senderos y cenas nocturnas: conoce los espacios de Kiimala Villas & Hotel en Coveñas.",
};

const GRUPOS = [
  { titulo: "Piscina", fotos: [[FOTO.piscinaInfinita, "Piscina infinita con palmeras"], [FOTO.piscinaCabanas, "Piscina y cabañas blancas"], [FOTO.piscinaChorros, "Chorros de agua de la piscina"], [FOTO.piscinaSocial, "Zona social de la piscina"], [FOTO.piscinaElevada, "Piscina vista desde arriba"], [FOTO.piscinaPalmas, "Piscina entre palmeras"]] },
  { titulo: "Playa", fotos: [[FOTO.playaPalapas, "Playa con palapas"], [FOTO.playaTuristas, "Huéspedes en la playa"], [FOTO.piscinaAerea, "Piscina y playa desde lo alto"], [FOTO.senderoPlaya, "Sendero hacia la playa"], [FOTO.perro, "Un perro amigable en la arena"]] },
  { titulo: "Terrazas, bar y sabores", fotos: [[FOTO.pergola, "Terraza con pérgola y mesas"], [FOTO.pergolaTurista, "Terraza junto a la piscina"], [FOTO.bar, "Bar de cocos"], [FOTO.pinas, "Piñas y cocos"], [FOTO.desayuno, "Desayuno con fruta y café"]] },
  { titulo: "Noche en Kiimala", fotos: [[FOTO.playaNoche, "Mesa romántica con luces en la playa"], [FOTO.cenaPlaya, "Cena frente al mar"], [FOTO.fogata, "Fogata nocturna"], [FOTO.atardecer, "Atardecer en el Golfo"]] },
  { titulo: "Villas y senderos", fotos: [[FOTO.fachada, "Fachada blanca entre palmeras"], [FOTO.senderoCabanas, "Sendero entre cabañas"], [FOTO.corredor, "Corredor exterior"], [FOTO.pasillo, "Pasillo de las cabañas"], [FOTO.edificio, "Edificio de habitaciones"], [FOTO.calleBlanca, "Camino blanco entre palmeras"]] },
] as const;

export default function Alrededores() {
  return (
    <>
      <PaginaHero kicker="Alrededores" titulo="Mira cómo se vive Kiimala" foto={FOTO.piscinaChorros} />
      {GRUPOS.map((g, gi) => (
        <Seccion key={g.titulo} fondo={gi % 2 ? "arena" : "hueso"} className="!py-14 md:!py-20">
          <Titulo titulo={g.titulo} />
          <div className="mt-8 columns-2 gap-4 md:columns-3 [&>*]:mb-4">
            {g.fotos.map(([src, alt], i) => (
              <Foto key={src} src={src} alt={alt} zoom="galeria" className={`${i % 3 === 0 ? "aspect-[3/4]" : "aspect-[4/5]"} break-inside-avoid rounded-3xl`} sizes="(min-width: 768px) 33vw, 50vw" />
            ))}
          </div>
        </Seccion>
      ))}
    </>
  );
}
