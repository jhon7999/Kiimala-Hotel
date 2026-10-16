"use client";
import { useActionState, useTransition } from "react";
import { bloquearHabitacion, editarHabitacion, quitarBloqueo, type Estado } from "@/app/admin/actions";

type H = { id: number; capacidad: number; camas: string; notas: string; activa: boolean };

export function FormEditarHabitacion({ h }: { h: H }) {
  const [e, accion, pend] = useActionState<Estado, FormData>(editarHabitacion, {});
  return (
    <form action={accion} className="mt-3 grid gap-3 sm:grid-cols-2">
      <input type="hidden" name="id" value={h.id} />
      <div>
        <label htmlFor={`cap-${h.id}`} className="etiqueta">Capacidad</label>
        <input id={`cap-${h.id}`} name="capacidad" type="number" min={1} max={20} defaultValue={h.capacidad} className="campo" />
      </div>
      <div className="flex items-end">
        <label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" name="activa" defaultChecked={h.activa} className="size-4" /> Activa (se puede vender)</label>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`cam-${h.id}`} className="etiqueta">Camas</label>
        <input id={`cam-${h.id}`} name="camas" defaultValue={h.camas} className="campo" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`not-${h.id}`} className="etiqueta">Notas internas</label>
        <input id={`not-${h.id}`} name="notas" defaultValue={h.notas} className="campo" />
      </div>
      <div className="flex items-center gap-3 sm:col-span-2">
        <button className="btn btn-sm btn-p" disabled={pend}>{pend ? "Guardando…" : "Guardar"}</button>
        {e.error && <span role="alert" className="error-txt">{e.error}</span>}
        {e.ok && <span role="status" className="text-sm text-emerald-300">Guardado.</span>}
      </div>
    </form>
  );
}

export function FormBloquear({ habs, hoy }: { habs: { id: number; nombre: string }[]; hoy: string }) {
  const [e, accion, pend] = useActionState<Estado, FormData>(bloquearHabitacion, {});
  return (
    <form action={accion} className="grid gap-3 sm:grid-cols-5 sm:items-end">
      <div className="sm:col-span-2">
        <label htmlFor="bl-hab" className="etiqueta">Habitación</label>
        <select id="bl-hab" name="habitacionId" required className="campo">
          <option value="">Elige…</option>
          {habs.map((h) => <option key={h.id} value={h.id}>{h.nombre}</option>)}
        </select>
      </div>
      <div><label htmlFor="bl-d" className="etiqueta">Desde</label><input id="bl-d" name="desde" type="date" min={hoy} required className="campo" /></div>
      <div><label htmlFor="bl-h" className="etiqueta">Hasta</label><input id="bl-h" name="hasta" type="date" min={hoy} required className="campo" /></div>
      <div className="sm:col-span-4"><label htmlFor="bl-m" className="etiqueta">Motivo</label><input id="bl-m" name="motivo" placeholder="Mantenimiento, pintura, uso del hotel…" maxLength={120} className="campo" /></div>
      <button className="btn btn-p" disabled={pend}>Bloquear</button>
      {e.error && <p role="alert" className="error-txt sm:col-span-5">{e.error}</p>}
      {e.ok && <p role="status" className="text-sm text-emerald-300 sm:col-span-5">Bloqueo creado.</p>}
    </form>
  );
}

export function BotonQuitarBloqueo({ id }: { id: number }) {
  const [pend, iniciar] = useTransition();
  return <button className="btn btn-sm btn-peligro" disabled={pend} onClick={() => iniciar(async () => { await quitarBloqueo(id); })}>Quitar</button>;
}
