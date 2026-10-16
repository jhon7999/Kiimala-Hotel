"use client";
import { useState, useTransition } from "react";
import { solicitarLimpieza } from "@/app/admin/actions";
import { sonar } from "@/lib/sonidos";
import Icono from "./Icono";

export default function SolicitarLimpieza({ habs }: { habs: { id: number; nombre: string }[] }) {
  const [id, setId] = useState("");
  const [motivo, setMotivo] = useState("");
  const [msg, setMsg] = useState<{ ok?: boolean; error?: string }>({});
  const [pend, iniciar] = useTransition();
  return (
    <form
      className="cristal flex flex-wrap items-end gap-3 p-4"
      onSubmit={(e) => {
        e.preventDefault();
        iniciar(async () => {
          const r = await solicitarLimpieza(Number(id), motivo.trim() || undefined);
          setMsg(r);
          if (r.ok) { setId(""); setMotivo(""); sonar("exito"); } else sonar("alerta");
        });
      }}
    >
      <div className="min-w-40 grow">
        <label htmlFor="sl-hab" className="etiqueta">Solicitar limpieza de</label>
        <select id="sl-hab" value={id} onChange={(e) => setId(e.target.value)} required className="campo">
          <option value="">Elige una habitación…</option>
          {habs.map((h) => <option key={h.id} value={h.id}>{h.nombre}</option>)}
        </select>
      </div>
      <div className="min-w-40 grow">
        <label htmlFor="sl-motivo" className="etiqueta">Motivo (opcional)</label>
        <input id="sl-motivo" value={motivo} onChange={(e) => setMotivo(e.target.value)} maxLength={120} placeholder="Cambio de sábanas, derrame…" className="campo" />
      </div>
      <button className="btn btn-p" disabled={pend || !id}><Icono n="bell" className="size-4" /> Avisar a limpieza</button>
      {msg.error && <p role="alert" className="error-txt w-full">{msg.error}</p>}
      {msg.ok && <p role="status" className="w-full text-sm text-emerald-300">Solicitud enviada: sonará en el celular de limpieza.</p>}
    </form>
  );
}
