"use client";
import { useState, useTransition } from "react";
import { avanzarTarea } from "@/app/admin/actions";
import { sonar } from "@/lib/sonidos";
import Icono from "./Icono";

type Props = { id: number; habitacion: string; torre: string; motivo: string; estado: "pendiente" | "en_proceso" | "lista"; tomadaPor: string | null; hace: string };

/** Tarjeta grande, pensada para tocar con el pulgar desde el celular de la camarera. */
export default function TarjetaTarea({ id, habitacion, torre, motivo, estado, tomadaPor, hace }: Props) {
  const [error, setError] = useState("");
  const [pend, iniciar] = useTransition();
  const avanzar = () =>
    iniciar(async () => {
      const r = await avanzarTarea(id);
      if (r.error) { setError(r.error); sonar("alerta"); } else { setError(""); sonar("exito"); }
    });
  return (
    <li className="solido space-y-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-serif text-2xl leading-none">{habitacion}</p>
          <p className="mt-1 text-xs text-[color:var(--a-suave)]">Torre {torre} · {motivo}</p>
        </div>
        <span className="text-xs text-[color:var(--a-suave)]">{hace}</span>
      </div>
      {tomadaPor && <p className="text-xs text-cyan-200">{estado === "lista" ? "Limpió" : "Limpia"}: {tomadaPor}</p>}
      {estado === "pendiente" && <button className="btn btn-p w-full" disabled={pend} onClick={avanzar}><Icono n="sparkles" className="size-4" /> Empezar limpieza</button>}
      {estado === "en_proceso" && <button className="btn btn-ok w-full" disabled={pend} onClick={avanzar}><Icono n="check" className="size-4" /> Marcar como lista</button>}
      {estado === "lista" && <p className="chip chip-libre">Habitación lista</p>}
      {error && <p role="alert" className="error-txt">{error}</p>}
    </li>
  );
}
