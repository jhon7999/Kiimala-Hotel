"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import BookingBar from "./BookingBar";
import { Boton, Kicker } from "./ui";
import { FOTO } from "@/data/fotos";

// Fotos del fondo y de la rueda: la misma lista, en el mismo orden.
// Solo fotos de 1400 px de ancho o más: las de menor resolución se ven borrosas a pantalla completa.
const FOTOS = [
  { src: FOTO.playaPalapas, alt: "Playa con palapas frente a Kiimala" },
  { src: FOTO.piscinaInfinita, alt: "Piscina infinita rodeada de palmeras" },
  { src: FOTO.playaNoche, alt: "Mesa con luces cálidas en la playa" },
  { src: FOTO.piscinaPalmas, alt: "Piscina entre palmeras" },
  { src: FOTO.piscinaCabanas, alt: "Piscina y cabañas blancas entre palmeras" },
  { src: FOTO.atardecer, alt: "Atardecer en el Golfo de Morrosquillo" },
  { src: FOTO.calleBlanca, alt: "Camino blanco entre palmeras y cabañas" },
];
const N = FOTOS.length;
const PASO = 360 / N; // grados entre foto y foto en la rueda
const CADA_MS = 5500;

export default function Hero() {
  // La rueda gira de forma acumulada (nunca da el salto de vuelta de la última a la primera).
  const [vuelta, setVuelta] = useState(0);
  const i = ((vuelta % N) + N) % N;

  const ir = (destino: number) =>
    setVuelta((v) => {
      const actual = ((v % N) + N) % N;
      let d = destino - actual;
      if (d > N / 2) d -= N;
      if (d < -N / 2) d += N;
      return v + d;
    });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setVuelta((v) => v + 1), CADA_MS);
    return () => clearInterval(t);
  }, [vuelta]); // se reinicia con cada giro, también si el usuario hace clic

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-tinta text-hueso">
      <div className="absolute inset-0">
        {FOTOS.map((f, k) => {
          const cerca = [0, 1, N - 1].includes((k - i + N) % N); // carga solo actual, siguiente y anterior
          return (
            <div key={f.src} className={`hero-slide absolute inset-0 ${k === i ? "activa" : ""}`}>
              {(cerca || k === 0) && <Image src={f.src} alt={k === i ? f.alt : ""} fill priority={k === 0} sizes="100vw" quality={85} className="object-cover" />}
            </div>
          );
        })}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-black/60" />

      {/* Rueda: a la izquierda la foto que se proyecta; arriba la siguiente; abajo la anterior. */}
      <div className="rueda pointer-events-none absolute -right-12 top-[44%] hidden lg:block">
        <div className="rueda-giro" style={{ ["--rot" as string]: -vuelta * PASO }}>
          {FOTOS.map((f, k) => {
            let d = k - i;
            if (d > N / 2) d -= N;
            if (d < -N / 2) d += N;
            const ad = Math.abs(d);
            return (
              <button
                key={f.src}
                type="button"
                onClick={() => ir(k)}
                aria-label={`Ver foto: ${f.alt}`}
                aria-current={d === 0}
                tabIndex={ad <= 2 ? 0 : -1}
                className="rueda-item pointer-events-auto"
                style={{
                  ["--a" as string]: k * PASO,
                  opacity: ad === 0 ? 1 : ad === 1 ? 0.95 : ad === 2 ? 0.4 : 0,
                  scale: ad === 0 ? 1.3 : ad === 1 ? 0.95 : 0.75,
                  visibility: ad > 2 ? "hidden" : "visible",
                }}
              >
                <Image src={f.src} alt="" fill sizes="140px" className={`rounded-full object-cover ring-2 ${d === 0 ? "ring-terracota" : "ring-white/60"}`} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col items-center justify-end px-6 pb-10 pt-32 text-center lg:items-start lg:text-left">
        <Kicker claro>Coveñas · Sucre · Colombia</Kicker>
        <h1 className="mt-4 max-w-3xl text-6xl md:text-8xl">
          Un refugio <em className="text-arena">para el alma</em>
        </h1>
        <p className="mt-5 max-w-xl text-lg text-hueso/90">
          Sol, playa y buena vibra. Piscina entre palmeras, habitaciones cómodas y el mar a pocos pasos.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Boton href="/habitaciones">Ver habitaciones</Boton>
          <Boton href="/plan-covenas" variante="claro">Plan Coveñas</Boton>
        </div>
        <div className="mt-10 w-full text-left">
          <BookingBar />
        </div>
      </div>
    </section>
  );
}
