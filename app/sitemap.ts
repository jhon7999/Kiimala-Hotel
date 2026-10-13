import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { HABITACIONES } from "@/data/habitaciones";

const RUTAS = ["", "/habitaciones", "/plan-covenas", "/tours-opcionales", "/alrededores", "/quienes-somos", "/ubicacion", "/contacto", "/politicas", "/privacidad"];

export default function sitemap(): MetadataRoute.Sitemap {
  const urls = [...RUTAS, ...HABITACIONES.map((h) => `/habitaciones/${h.slug}`)];
  return urls.map((u) => ({ url: `${SITE.url}${u}`, changeFrequency: "monthly", priority: u === "" ? 1 : 0.7 }));
}
