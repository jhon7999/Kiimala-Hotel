"use client";
import { useEffect, useState } from "react";
import Icono from "./Icono";

type EventoInstalar = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

/** Registra el service worker (necesario para instalar la app) y muestra "Instalar app" cuando el navegador lo permite. */
export default function InstalarApp() {
  const [ev, setEv] = useState<EventoInstalar | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js", { scope: "/admin/" }).catch(() => {});
    const antes = (e: Event) => { e.preventDefault(); setEv(e as unknown as EventoInstalar); };
    const hecho = () => setEv(null);
    window.addEventListener("beforeinstallprompt", antes);
    window.addEventListener("appinstalled", hecho);
    return () => { window.removeEventListener("beforeinstallprompt", antes); window.removeEventListener("appinstalled", hecho); };
  }, []);

  if (!ev) return null;
  return (
    <button className="btn btn-sm btn-p" onClick={async () => { await ev.prompt(); await ev.userChoice; setEv(null); }}>
      <Icono n="download" className="size-4" />
      <span>Instalar app</span>
    </button>
  );
}
