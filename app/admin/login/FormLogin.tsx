"use client";
import { useActionState } from "react";
import { iniciarSesion, type LoginEstado } from "./actions";

export default function FormLogin() {
  const [estado, accion, pendiente] = useActionState<LoginEstado, FormData>(iniciarSesion, {});
  return (
    <form action={accion} className="mt-6 space-y-4">
      <div>
        <label htmlFor="usuario" className="etiqueta">Usuario</label>
        <input id="usuario" name="usuario" autoComplete="username" autoCapitalize="none" required className="campo" />
      </div>
      <div>
        <label htmlFor="clave" className="etiqueta">Contraseña</label>
        <input id="clave" name="clave" type="password" autoComplete="current-password" required className="campo" aria-invalid={!!estado.error} aria-describedby={estado.error ? "err" : undefined} />
      </div>
      {estado.error && <p id="err" role="alert" className="error-txt">{estado.error}</p>}
      <button className="btn btn-p w-full" disabled={pendiente}>{pendiente ? "Entrando…" : "Entrar"}</button>
    </form>
  );
}
