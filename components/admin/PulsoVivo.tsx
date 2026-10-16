"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { desbloquearAudio, fijarSonido, probarSonidos, sonar, sonidoActivo, vibrar } from "@/lib/sonidos";
import Icono from "./Icono";

type Pulso = { ultimaReserva: number; ultimaTarea: number; tareasPendientes: number };
type Aviso = { id: number; texto: string };

/** Sondeo cada 8 s: suena y avisa cuando entra una reserva o una solicitud de limpieza, y refresca la pantalla. */
export default function PulsoVivo({ rol, inicial }: { rol: string; inicial: Pulso }) {
  const router = useRouter();
  const ultimo = useRef(inicial);
  const [avisos, setAvisos] = useState<Aviso[]>([]);

  useEffect(() => {
    const primerToque = () => desbloquearAudio();
    for (const ev of ["pointerdown", "keydown", "touchstart"]) window.addEventListener(ev, primerToque, { once: true });
    const ver = rol !== "limpieza";
    const limpia = rol !== "ventas";
    const poner = (texto: string) => {
      const id = Date.now() + Math.random();
      setAvisos((a) => [...a.slice(-2), { id, texto }]);
      setTimeout(() => setAvisos((a) => a.filter((x) => x.id !== id)), 7000);
    };
    const tick = async () => {
      if (document.hidden) return;
      try {
        const r = await fetch("/api/admin/pulso", { cache: "no-store" });
        if (!r.ok) return;
        const p: Pulso = await r.json();
        const antes = ultimo.current;
        let cambio = false;
        if (p.ultimaTarea > antes.ultimaTarea && limpia) { sonar("limpieza"); vibrar(); poner("🧹 Nueva solicitud de limpieza"); cambio = true; }
        if (p.ultimaReserva > antes.ultimaReserva && ver) { sonar("reserva"); vibrar(); poner("🛎️ Entró una nueva reserva"); cambio = true; }
        if (p.tareasPendientes !== antes.tareasPendientes) cambio = true;
        ultimo.current = p;
        if (cambio) router.refresh();
      } catch { /* sin red: se reintenta en el siguiente ciclo */ }
    };
    const t = setInterval(tick, 8000);
    return () => { clearInterval(t); for (const ev of ["pointerdown", "keydown", "touchstart"]) window.removeEventListener(ev, primerToque); };
  }, [rol, router]);

  return (
    <div className="no-imprimir pointer-events-none fixed inset-x-0 top-3 z-[60] flex flex-col items-center gap-2 px-3" role="status" aria-live="polite">
      {avisos.map((a) => (
        <div key={a.id} className="toast cristal pointer-events-auto flex items-center gap-3 px-5 py-3 text-sm shadow-2xl" style={{ background: "rgb(22 48 32 / 0.92)" }}>
          {a.texto}
        </div>
      ))}
    </div>
  );
}

export function BotonSonido() {
  const [on, setOn] = useState(true);
  useEffect(() => setOn(sonidoActivo()), []);
  return (
    <div className="flex items-center gap-1">
      <button
        className="btn btn-sm"
        aria-pressed={on}
        aria-label={on ? "Silenciar avisos sonoros" : "Activar avisos sonoros"}
        onClick={() => { const n = !on; setOn(n); fijarSonido(n); desbloquearAudio(); if (n) sonar("exito"); }}
      >
        <Icono n={on ? "sound" : "mute"} className="size-4" />
        <span className="hidden sm:inline">{on ? "Sonido" : "Silencio"}</span>
      </button>
      <button className="btn btn-sm" onClick={() => { if (!on) { setOn(true); fijarSonido(true); } probarSonidos(); }} aria-label="Probar los avisos sonoros">
        <Icono n="bell" className="size-4" />
        <span>Probar</span>
      </button>
    </div>
  );
}
