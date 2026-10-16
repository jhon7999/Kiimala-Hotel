import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Lightbox from "@/components/Lightbox";
import JsonLd from "@/components/JsonLd";
import { hotelLd } from "@/lib/schema";

// Layout del sitio público (el panel /admin tiene el suyo).
export default function SitioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={hotelLd()} />
      <Header />
      <main>{children}</main>
      <Footer />
      <Lightbox />
    </>
  );
}
