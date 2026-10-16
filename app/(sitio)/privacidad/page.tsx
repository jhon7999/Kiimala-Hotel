import type { Metadata } from "next";
import { PaginaHero, Prosa, Seccion } from "@/components/ui";
import { FOTO } from "@/data/fotos";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacidad y datos personales",
  description: "Política de tratamiento de datos personales de Kiimala Villas & Hotel, conforme a la Ley 1581 de 2012 (habeas data).",
};

export default function Privacidad() {
  return (
    <>
      <PaginaHero kicker="Información" titulo="Privacidad y datos personales" foto={FOTO.senderoCabanas} />
      <Seccion>
        <Prosa>
          <p>
            En {SITE.nombre} cuidamos tus datos. Esta política explica qué información usamos, para qué y cómo puedes ejercer tus derechos, según la Ley 1581 de 2012 y sus normas reglamentarias de Colombia (habeas data).
          </p>

          <h2>Responsable del tratamiento</h2>
          <p>{SITE.nombre}, {SITE.direccion}. Atendemos solicitudes sobre datos personales por nuestros canales oficiales (ver la página de contacto).</p>

          <h2>Qué datos tratamos</h2>
          <ul>
            <li>Datos de contacto y de reserva que tú nos entregas (nombre, teléfono, fechas, número de personas).</li>
            <li>Datos de registro de huéspedes necesarios para el alojamiento, cuando te hospedas.</li>
            <li>Datos técnicos básicos de navegación en este sitio. Este sitio no usa formularios que guarden tus datos personales.</li>
          </ul>

          <h2>Para qué los usamos</h2>
          <ul>
            <li>Atender tu solicitud de reserva y confirmar disponibilidad y tarifa.</li>
            <li>Gestionar tu estadía y comunicarnos contigo antes, durante y después.</li>
            <li>Cumplir obligaciones legales de registro de huéspedes.</li>
            <li>Mejorar nuestro servicio. No vendemos tus datos.</li>
          </ul>

          <h2>Autorización</h2>
          <p>Tratamos tus datos únicamente con tu autorización, que puedes darnos al compartirlos para reservar, salvo los casos en que la ley no la exige.</p>

          <h2>Tus derechos</h2>
          <ul>
            <li>Conocer, actualizar y rectificar tus datos.</li>
            <li>Solicitar prueba de la autorización otorgada.</li>
            <li>Ser informado del uso que se ha dado a tus datos.</li>
            <li>Revocar la autorización y solicitar la supresión de tus datos cuando proceda.</li>
            <li>Presentar quejas ante la Superintendencia de Industria y Comercio.</li>
          </ul>

          <h2>Cómo ejercerlos</h2>
          <p>Escríbenos por nuestro canal oficial ({SITE.instagramUsuario} en Instagram) indicando tu solicitud. Responderemos dentro de los plazos legales.</p>

          <h2>Seguridad y conservación</h2>
          <p>Aplicamos medidas razonables para proteger tu información y la conservamos solo el tiempo necesario para las finalidades descritas o el que exija la ley.</p>

          <h2>Cambios</h2>
          <p>Podemos actualizar esta política. La versión vigente es la publicada en esta página.</p>
        </Prosa>
      </Seccion>
    </>
  );
}
