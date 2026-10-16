// Inventario real de habitaciones de Kiimala (pasado por Laura/Jhon, 2026-10-14). Camas en metros.
// Capacidad total ≈ 92 personas. Ver Memoria-Jhon/10-agencia-viajes/kiimala/inventario-habitaciones.md
export type HabSemilla = { torre: string; numero: string; capacidad: number; camas: string; vip?: boolean };

const G = "Garzas";
const C = "Cisnes";
const D = "Cóndor";

export const INVENTARIO: HabSemilla[] = [
  // Torre Garzas
  ...["1", "2", "3", "4"].map((n) => ({ torre: G, numero: n, capacidad: 4, camas: "1 cama doble 1.40 · 1 camarote de 2 niveles (1.00 c/u)" })),
  ...["5", "6", "7"].map((n) => ({ torre: G, numero: n, capacidad: 5, camas: "1 camarote (1.40 / 1.00) · 1 camarote de 2 niveles (1.00 c/u)" })),
  { torre: G, numero: "8", capacidad: 4, camas: "2 camas dobles 1.40" },
  { torre: G, numero: "9", capacidad: 2, camas: "1 cama doble 1.40" },
  // Torre Cisnes
  { torre: C, numero: "101", capacidad: 6, camas: "2 camas dobles 1.40 · 1 camarote de 2 niveles (1.00 c/u)" },
  { torre: C, numero: "102", capacidad: 2, camas: "1 cama doble 1.40" },
  { torre: C, numero: "103", capacidad: 6, camas: "1 cama doble 1.40 · 1 cama 1.20 · 1 camarote de 2 niveles (1.00 c/u)" },
  { torre: C, numero: "104", capacidad: 4, camas: "2 camas dobles 1.40" },
  { torre: C, numero: "201", capacidad: 4, camas: "2 camas dobles 1.40" },
  { torre: C, numero: "202", capacidad: 4, camas: "2 camas dobles 1.40" },
  { torre: C, numero: "203", capacidad: 2, camas: "1 cama doble 1.40" },
  { torre: C, numero: "204", capacidad: 4, camas: "2 camas dobles 1.40" },
  { torre: C, numero: "301", capacidad: 8, camas: "4 camas dobles 1.40" },
  { torre: C, numero: "302", capacidad: 7, camas: "2 camas dobles 1.40 · 1 camarote (1.40 / 1.00)" },
  // Torre Cóndor
  { torre: D, numero: "101", capacidad: 2, camas: "1 cama doble 1.40", vip: true },
  { torre: D, numero: "102", capacidad: 2, camas: "1 cama doble 1.40" },
  { torre: D, numero: "103", capacidad: 4, camas: "2 camas dobles 1.40" },
];
