// Datos del sitio en un solo lugar. Lo marcado "confirmar" lo debe validar Jhon / recepción.
export const SITE = {
  nombre: "Kiimala Villas & Hotel",
  corto: "Kiimala",
  eslogan: "Un refugio para el alma",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://kiimala-web.vercel.app",
  // Aún sin número oficial: vacío = el botón de reserva lleva a /contacto.
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP ?? "").replace(/\D/g, ""),
  instagram: "https://www.instagram.com/kiimalahotel/",
  instagramUsuario: "@kiimalahotel",
  facebook: "https://www.facebook.com/p/Kiimala-Hotel-61576158310874/",
  destidnos: "https://destidnos.com",
  ciudad: "Coveñas",
  region: "Sucre",
  pais: "CO",
  // confirmar: dirección exacta y coordenadas del hotel
  direccion: "Coveñas, Sucre, Colombia",
  geo: { lat: 9.4478, lng: -75.6192 },
  checkIn: "3:00 p. m.", // confirmar
  checkOut: "12:00 m.", // confirmar
  tarifaDesde: 160000, // pp/noche, solo alojamiento, temporada normal (confirmada 20-sep-2026)
} as const;

export const pesos = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

export const NAV = [
  { href: "/habitaciones", label: "Habitaciones" },
  { href: "/plan-covenas", label: "Plan Coveñas" },
  { href: "/tours-opcionales", label: "Tours" },
  { href: "/alrededores", label: "Alrededores" },
  { href: "/quienes-somos", label: "Quiénes somos" },
  { href: "/ubicacion", label: "Ubicación" },
] as const;

export function enlaceReserva(p: { entrada?: string; salida?: string; hab?: string; personas?: string }) {
  const partes = [
    "Hola Kiimala, quiero reservar.",
    p.entrada && `Entrada: ${p.entrada}`,
    p.salida && `Salida: ${p.salida}`,
    p.hab && `Habitación: ${p.hab}`,
    p.personas && `Personas: ${p.personas}`,
  ].filter(Boolean);
  const texto = partes.join(" ");
  if (SITE.whatsapp) return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(texto)}`;
  const q = new URLSearchParams();
  Object.entries(p).forEach(([k, v]) => v && q.set(k, v));
  return `/contacto?${q.toString()}`;
}
