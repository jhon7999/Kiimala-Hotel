// Fechas como texto "YYYY-MM-DD" (sin zona horaria). "Hoy" = hora de Colombia.
export const hoyCO = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date());

const aUTC = (s: string) => Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10));
export const sumarDias = (s: string, n: number) => new Date(aUTC(s) + n * 864e5).toISOString().slice(0, 10);
export const noches = (entrada: string, salida: string) => Math.round((aUTC(salida) - aUTC(entrada)) / 864e5);
export const esFecha = (s: unknown): s is string => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(aUTC(s));
export const rango = (desde: string, dias: number) => Array.from({ length: dias }, (_, i) => sumarDias(desde, i));

const DIAS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
export const diaSemana = (s: string) => DIAS[new Date(aUTC(s)).getUTCDay()];
export const diaMes = (s: string) => +s.slice(8, 10);
export const mesCorto = (s: string) => MESES[+s.slice(5, 7) - 1];
export const fechaLarga = (s: string) => `${diaSemana(s)} ${diaMes(s)} ${mesCorto(s)}`;
export const cop = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
