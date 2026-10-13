import { FOTO } from "./fotos";

// confirmar: cuáles ofrece Kiimala/Destidnos, operadores y precios. No se publican precios hasta tenerlos.
export type Tour = { slug: string; nombre: string; resumen: string; foto: string };

export const TOURS: Tour[] = [
  { slug: "islas-san-bernardo", nombre: "Islas de San Bernardo", resumen: "Un día de mar turquesa, arena blanca y snorkel por el archipiélago más cercano.", foto: FOTO.piscinaAerea },
  { slug: "tolu", nombre: "Recorrido por Tolú", resumen: "Malecón, gastronomía local y el ambiente costero del Golfo de Morrosquillo.", foto: FOTO.senderoPlaya },
  { slug: "cienaga-caimanera", nombre: "Ciénaga La Caimanera", resumen: "Paseo en lancha entre manglares y aves, ideal para la tarde.", foto: FOTO.atardecer },
  { slug: "atardecer-playa", nombre: "Atardecer y fogata en la playa", resumen: "Cierra el día con el cielo del Golfo, música tranquila y fogata.", foto: FOTO.fogata },
  { slug: "cena-playa", nombre: "Cena romántica frente al mar", resumen: "Mesa para dos en la arena, con luces cálidas y brisa.", foto: FOTO.cenaPlaya },
];
