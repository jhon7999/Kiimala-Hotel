import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Lightbox from "@/components/Lightbox";
import JsonLd from "@/components/JsonLd";
import { hotelLd } from "@/lib/schema";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-cormorant" });
const sans = Jost({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-jost" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.nombre} · Hotel frente al mar en Coveñas`, template: `%s · ${SITE.nombre}` },
  description:
    "Hotel y villas en Coveñas, Sucre: piscina, playa, habitaciones cómodas y buena vibra. Sol, playa y un refugio para el alma.",
  openGraph: { type: "website", locale: "es_CO", siteName: SITE.nombre, title: `${SITE.nombre} · Hotel frente al mar en Coveñas`, images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Piscina de Kiimala Villas & Hotel entre palmeras" }] },
  twitter: { card: "summary_large_image", images: ["/og.jpg"] },
  alternates: { canonical: "./" },
};
export const viewport: Viewport = { themeColor: "#1F3D2E" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <JsonLd data={hotelLd()} />
        <Header />
        <main>{children}</main>
        <Footer />
        <Lightbox />
      </body>
    </html>
  );
}
