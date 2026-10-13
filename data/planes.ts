// Planes de alojamiento. Sin precios de paquetes: los define Destidnos y cambian por temporada.
export type Plan = { id: string; nombre: string; resumen: string; incluye: string[]; nota?: string };

export const PLANES: Plan[] = [
  {
    id: "solo-alojamiento",
    nombre: "Solo alojamiento",
    resumen: "Llegas por tu cuenta y disfrutas del hotel a tu ritmo.",
    incluye: ["Habitación a tu elección", "Piscina, playa y zonas sociales"],
    nota: "Desde $160.000 por persona y noche en temporada normal.",
  },
  {
    id: "desayuno-cena",
    nombre: "Desayuno y cena",
    resumen: "Empiezas el día con desayuno y cierras con una cena frente a la brisa.",
    incluye: ["Alojamiento", "Desayuno", "Cena", "Piscina, playa y zonas sociales"],
  },
  {
    id: "alimentacion-completa",
    nombre: "Alimentación completa",
    resumen: "Todo resuelto para que solo te ocupes de descansar.",
    incluye: ["Alojamiento", "Desayuno, almuerzo y cena", "Piscina, playa y zonas sociales"],
  },
  {
    id: "con-transporte",
    nombre: "Plan con transporte desde Medellín",
    resumen: "Viaja en bus ida y regreso con nuestra agencia aliada Destidnos, con hospedaje y alimentación en Kiimala.",
    incluye: ["Transporte ida y regreso desde Medellín", "Hospedaje en Kiimala", "Alimentación según el plan", "Seguro de viaje"],
    nota: "Salidas programadas según calendario. Valores por persona según temporada y tipo de habitación.",
  },
];

export const TEMPORADAS = [
  { nombre: "Semana", detalle: "Lunes a jueves. La tarifa más cómoda del año." },
  { nombre: "Fin de semana", detalle: "Viernes a domingo." },
  { nombre: "Puentes festivos", detalle: "Fines de semana largos con lunes festivo." },
  { nombre: "Semana Santa y receso escolar", detalle: "Alta demanda: reserva con anticipación." },
  { nombre: "Fin de año", detalle: "Del 23 de diciembre al 11 de enero." },
];
