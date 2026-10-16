// Manifiesto de la app instalable (solo el panel, no el sitio público).
export const dynamic = "force-static";

export function GET() {
  const manifiesto = {
    name: "Kiimala · Panel del hotel",
    short_name: "Kiimala",
    description: "Reservas, disponibilidad y limpieza de Kiimala Villas & Hotel.",
    lang: "es-CO",
    start_url: "/admin",
    scope: "/admin",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0e1b14",
    theme_color: "#163020",
    icons: [
      { src: "/icons/panel-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/panel-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/panel-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
  return new Response(JSON.stringify(manifiesto), { headers: { "Content-Type": "application/manifest+json" } });
}
