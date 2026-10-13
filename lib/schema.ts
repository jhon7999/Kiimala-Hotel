import { SITE } from "./site";
import { HABITACIONES } from "@/data/habitaciones";

export function hotelLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: SITE.nombre,
    url: SITE.url,
    image: `${SITE.url}/fotos/kiimala-piscina-infinita-palmeras-cielo-azul.jpg`,
    description: "Hotel y villas en Coveñas, Sucre, con piscina, playa y habitaciones cómodas.",
    sameAs: [SITE.instagram],
    address: { "@type": "PostalAddress", addressLocality: SITE.ciudad, addressRegion: SITE.region, addressCountry: SITE.pais },
    geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
    checkinTime: "15:00",
    checkoutTime: "12:00",
    priceRange: `Desde $${SITE.tarifaDesde.toLocaleString("es-CO")} COP`,
    amenityFeature: ["Piscina", "Acceso a la playa", "Aire acondicionado", "Restaurante"].map((name) => ({
      "@type": "LocationFeatureSpecification", name, value: true,
    })),
    containsPlace: HABITACIONES.map((h) => ({ "@type": "HotelRoom", name: h.nombre, description: h.resumen })),
  };
}
