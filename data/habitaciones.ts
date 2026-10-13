import { FOTO } from "./fotos";

export type Habitacion = {
  slug: string;
  nombre: string;
  personas: string;
  resumen: string;
  descripcion: string;
  incluye: string[];
  fotos: string[];
  desde?: number; // pp/noche, solo alojamiento, temporada normal
  tarifaNota: string;
  confirmar?: string; // dato pendiente de validar con recepción
};

// Tarifa confirmada por el hotel (20-sep-2026): $160.000 pp/noche, solo alojamiento, temporada normal,
// habitación Múltiple. Triple y Doble: tarifa de particulares aún sin confirmar -> "consultar".
export const HABITACIONES: Habitacion[] = [
  {
    slug: "multiple",
    nombre: "Habitación Múltiple",
    personas: "Grupos y familias",
    resumen: "Espaciosa, con varias camas, pensada para ir en grupo, en familia o con amigos.",
    descripcion:
      "Una habitación amplia y luminosa con camas cómodas, aire acondicionado y todo lo necesario para compartir. A pocos pasos de la piscina y de la playa, es la favorita de quienes viajan en grupo y quieren estar juntos sin dejar de tener su espacio.",
    incluye: ["Aire acondicionado", "Camas con ropa de cama blanca", "Baño privado", "Acceso a piscina y playa", "Zona social y terrazas"],
    fotos: [FOTO.habMultiple1, FOTO.habMultiple2, FOTO.habNoche],
    desde: 160000,
    tarifaNota: "Tarifa por persona y noche, solo alojamiento, temporada normal. En puentes y temporada alta cambia.",
    confirmar: "Capacidad exacta (número máximo de personas) y servicios incluidos por habitación.",
  },
  {
    slug: "triple",
    nombre: "Habitación Triple",
    personas: "3 personas",
    resumen: "Cómoda para tres, con cama doble y cama adicional en un ambiente sereno y fresco.",
    descripcion:
      "Pensada para tres personas: una cama amplia, una cama adicional y un rincón de descanso con sala. Decoración natural en tonos claros, inspirada en el trópico, a un paso de la piscina.",
    incluye: ["Aire acondicionado", "Cama doble y cama adicional", "Baño privado", "Acceso a piscina y playa", "Zona social y terrazas"],
    fotos: [FOTO.habSala, FOTO.camaBlanca, FOTO.camaDetalle],
    tarifaNota: "Consulta la tarifa para tus fechas.",
    confirmar: "Distribución de camas y tarifa de particulares.",
  },
  {
    slug: "doble",
    nombre: "Habitación Doble",
    personas: "2 personas",
    resumen: "Íntima y acogedora para dos, con detalles artesanales y luz cálida.",
    descripcion:
      "El plan perfecto para parejas: cama cómoda, decoración boho con mandalas artesanales y luces cálidas por la noche. Una habitación tranquila, a pocos pasos de la piscina y del mar.",
    incluye: ["Aire acondicionado", "Cama doble", "Baño privado", "Acceso a piscina y playa", "Zona social y terrazas"],
    fotos: [FOTO.habGris, FOTO.habDoble, FOTO.boho],
    tarifaNota: "Consulta la tarifa para tus fechas.",
    confirmar: "Tarifa de particulares y tipo de cama.",
  },
];

export const habitacionPorSlug = (slug: string) => HABITACIONES.find((h) => h.slug === slug);
