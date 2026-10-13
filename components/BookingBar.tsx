"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { HABITACIONES } from "@/data/habitaciones";
import { enlaceReserva } from "@/lib/site";

const hoy = () => new Date().toISOString().slice(0, 10);
const campo =
  "w-full rounded-xl bg-white/10 px-3 py-2.5 text-sm text-hueso outline-none ring-1 ring-white/30 focus:ring-2 focus:ring-arena [color-scheme:dark]";

export default function BookingBar() {
  const [entrada, setEntrada] = useState("");
  const [salida, setSalida] = useState("");
  const [hab, setHab] = useState("");
  const [personas, setPersonas] = useState("2");

  const error = entrada && salida && salida <= entrada ? "La salida debe ser después de la entrada." : "";
  const noches = useMemo(
    () => (entrada && salida && !error ? Math.round((+new Date(salida) - +new Date(entrada)) / 864e5) : 0),
    [entrada, salida, error],
  );
  const href = enlaceReserva({
    entrada,
    salida,
    personas,
    hab: HABITACIONES.find((h) => h.slug === hab)?.nombre ?? "",
  });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      aria-label="Buscar fechas y habitación"
      className="vidrio rounded-3xl bg-black/30 p-4 text-hueso shadow-2xl shadow-black/20 md:p-5"
    >
      <div className="grid gap-3 md:grid-cols-[1fr_1fr_1.2fr_0.7fr_auto] md:items-end">
        <label className="text-xs uppercase tracking-widest">
          Entrada
          <input type="date" min={hoy()} value={entrada} onChange={(e) => setEntrada(e.target.value)} className={`${campo} mt-1`} />
        </label>
        <label className="text-xs uppercase tracking-widest">
          Salida
          <input type="date" min={entrada || hoy()} value={salida} onChange={(e) => setSalida(e.target.value)} className={`${campo} mt-1`} />
        </label>
        <label className="text-xs uppercase tracking-widest">
          Habitación
          <select value={hab} onChange={(e) => setHab(e.target.value)} className={`${campo} mt-1`}>
            <option value="" className="text-tinta">Cualquiera</option>
            {HABITACIONES.map((h) => (
              <option key={h.slug} value={h.slug} className="text-tinta">{h.nombre}</option>
            ))}
          </select>
        </label>
        <label className="text-xs uppercase tracking-widest">
          Personas
          <input type="number" min={1} max={20} value={personas} onChange={(e) => setPersonas(e.target.value)} className={`${campo} mt-1`} />
        </label>
        <Link
          href={href}
          aria-disabled={!!error}
          onClick={(e) => error && e.preventDefault()}
          className={`rounded-full bg-terracota-osc px-7 py-3 text-center text-sm font-medium text-white transition hover:brightness-110 ${error ? "pointer-events-none opacity-50" : ""}`}
        >
          Reservar
        </Link>
      </div>
      <p className="mt-2 min-h-5 text-xs text-arena" role="status">
        {error ||
          (noches
            ? `${noches} ${noches === 1 ? "noche" : "noches"} · te confirmamos disponibilidad y tarifa.`
            : "Elige tus fechas y te confirmamos disponibilidad y tarifa.")}
      </p>
    </form>
  );
}
