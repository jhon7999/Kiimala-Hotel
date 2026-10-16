"use client";
import { useActionState, useTransition } from "react";
import { activarUsuario, cambiarClaveUsuario, crearTokenApi, crearUsuario, revocarTokenApi, type Estado } from "@/app/admin/actions";

const ROLES = [
  ["recepcion", "Recepción"],
  ["ventas", "Ventas (consulta y crea reservas)"],
  ["limpieza", "Limpieza"],
  ["admin", "Administrador"],
];

export function FormNuevoUsuario() {
  const [e, accion, pend] = useActionState<Estado, FormData>(crearUsuario, {});
  return (
    <form action={accion} className="grid gap-3 sm:grid-cols-2">
      <div><label htmlFor="u-nombre" className="etiqueta">Nombre</label><input id="u-nombre" name="nombre" required maxLength={80} className="campo" /></div>
      <div><label htmlFor="u-usuario" className="etiqueta">Usuario</label><input id="u-usuario" name="usuario" required minLength={3} maxLength={40} autoCapitalize="none" className="campo" /></div>
      <div><label htmlFor="u-clave" className="etiqueta">Contraseña (mín. 8)</label><input id="u-clave" name="clave" type="password" required minLength={8} autoComplete="new-password" className="campo" /></div>
      <div>
        <label htmlFor="u-rol" className="etiqueta">Rol</label>
        <select id="u-rol" name="rol" className="campo" defaultValue="recepcion">{ROLES.map(([v, t]) => <option key={v} value={v}>{t}</option>)}</select>
      </div>
      <div className="flex items-center gap-3 sm:col-span-2">
        <button className="btn btn-p" disabled={pend}>Crear usuario</button>
        {e.error && <span role="alert" className="error-txt">{e.error}</span>}
        {e.ok && <span role="status" className="text-sm text-emerald-300">Usuario creado.</span>}
      </div>
    </form>
  );
}

export function FormClave({ id }: { id: number }) {
  const [e, accion, pend] = useActionState<Estado, FormData>(cambiarClaveUsuario, {});
  return (
    <form action={accion} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <label htmlFor={`c-${id}`} className="sr-only">Nueva contraseña</label>
      <input id={`c-${id}`} name="clave" type="password" minLength={8} required placeholder="Nueva contraseña" autoComplete="new-password" className="campo !min-h-9 max-w-48 !py-1" />
      <button className="btn btn-sm" disabled={pend}>Cambiar</button>
      {e.error && <span role="alert" className="error-txt">{e.error}</span>}
      {e.aviso && <span role="status" className="text-xs text-emerald-300">{e.aviso}</span>}
    </form>
  );
}

export function BotonActivar({ id, activo }: { id: number; activo: boolean }) {
  const [pend, iniciar] = useTransition();
  return (
    <button className={`btn btn-sm ${activo ? "btn-peligro" : "btn-ok"}`} disabled={pend} onClick={() => iniciar(async () => { await activarUsuario(id, !activo); })}>
      {activo ? "Desactivar" : "Activar"}
    </button>
  );
}

export function FormToken() {
  const [e, accion, pend] = useActionState<Estado, FormData>(crearTokenApi, {});
  return (
    <div className="space-y-3">
      <form action={accion} className="flex flex-wrap items-end gap-3">
        <div className="min-w-48 grow">
          <label htmlFor="t-nombre" className="etiqueta">Nombre de la integración</label>
          <input id="t-nombre" name="nombre" required maxLength={60} placeholder="Destidnos" className="campo" />
        </div>
        <button className="btn btn-p" disabled={pend}>Generar token</button>
      </form>
      {e.error && <p role="alert" className="error-txt">{e.error}</p>}
      {e.token && (
        <div role="status" className="rounded-2xl border border-amber-300/40 bg-amber-300/10 p-4">
          <p className="text-sm font-medium text-amber-200">Cópialo ahora: no se vuelve a mostrar.</p>
          <code className="mt-2 block break-all rounded-lg bg-black/40 p-3 text-sm select-all">{e.token}</code>
        </div>
      )}
    </div>
  );
}

export function BotonRevocar({ id }: { id: number }) {
  const [pend, iniciar] = useTransition();
  return <button className="btn btn-sm btn-peligro" disabled={pend} onClick={() => { if (window.confirm("¿Revocar este token? La integración dejará de funcionar.")) iniciar(async () => { await revocarTokenApi(id); }); }}>Revocar</button>;
}
