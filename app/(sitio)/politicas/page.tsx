import type { Metadata } from "next";
import Link from "next/link";
import { PaginaHero, Prosa, Seccion } from "@/components/ui";
import { FOTO } from "@/data/fotos";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Políticas del hotel",
  description: "Check-in, check-out, reservas, cancelaciones, convivencia y cuidado del entorno en Kiimala Villas & Hotel.",
};

export default function Politicas() {
  return (
    <>
      <PaginaHero kicker="Información" titulo="Políticas del hotel" foto={FOTO.corredor} />
      <Seccion>
        <Prosa>
          <p>Estas políticas nos ayudan a que tu estadía sea tranquila para todos. Si tienes dudas, escríbenos antes de reservar.</p>

          <h2>Llegada y salida</h2>
          <ul>
            <li>Hora de ingreso (check-in): {SITE.checkIn}</li>
            <li>Hora de salida (check-out): {SITE.checkOut}</li>
            <li>Si llegas antes o te quieres quedar más tarde, consúltanos: lo coordinamos según disponibilidad.</li>
          </ul>

          <h2>Reservas y tarifas</h2>
          <ul>
            <li>Las tarifas se cotizan por persona y por noche, según la habitación, el plan de alimentación y la temporada.</li>
            <li>Las fechas de puentes festivos, Semana Santa, receso escolar y fin de año tienen tarifas distintas.</li>
            <li>Una reserva queda confirmada cuando recepción te lo comunica por escrito.</li>
          </ul>

          <h2>Cancelaciones y cambios</h2>
          <p>Las condiciones de cancelación y cambio de fechas dependen de la temporada y del plan elegido. Te las informamos antes de confirmar la reserva.</p>

          <h2>Convivencia</h2>
          <ul>
            <li>Respeta el descanso de los demás huéspedes, especialmente en la noche.</li>
            <li>Cuida las zonas comunes, la piscina y la playa.</li>
            <li>Los menores de edad deben estar acompañados por un adulto responsable.</li>
            <li>Consulta con nosotros si viajas con mascotas, antes de reservar.</li>
          </ul>

          <h2>Cuidado del entorno</h2>
          <p>Estamos junto al mar y entre palmeras. Ayúdanos a mantenerlo limpio: no dejes residuos en la playa y usa los puntos de reciclaje.</p>

          <h2>Tus datos</h2>
          <p>Cómo tratamos tus datos personales está en la <Link href="/privacidad">política de privacidad</Link>.</p>
        </Prosa>
      </Seccion>
    </>
  );
}
