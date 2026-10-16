"use client";
import { useState, useTransition } from "react";
import { accionReserva, registrarAbono, type Estado } from "@/app/admin/actions";
import { sonar } from "@/lib/sonidos";
import Icono from "./Icono";

type Props = { id: number; estado: string; puedeIngresar: boolean; saldo: number; total: number; operador: boolean };

export default function AccionesReserva({ id, estado, puedeIngresar, saldo, total, operador }: Props) {
  const [msg, setMsg] = useState<Estado | null>(null);
  const [pend, iniciar] = useTransition();
  const [abono, setAbono] = useState("");

  const correr = (accion: "checkin" | "checkout" | "cancelar" | "reactivar", confirmar?: string) => {
    if (confirmar && !window.confirm(confirmar)) return;
    iniciar(async () => {
      const r = await accionReserva(id, accion);
      setMsg(r);
      if (r.ok) sonar("exito"); else sonar("alerta");
    });
  };
  const pagar = () => {
    const v = Number(abono.replace(/[^\d]/g, ""));
    iniciar(async () => {
      const r = await registrarAbono(id, v);
      setMsg(r);
      if (r.ok) { setAbono(""); sonar("exito"); } else sonar("alerta");
    });
  };

  if (!operador) return <p className="text-sm text-[color:var(--a-suave)]">Tu rol puede consultar esta reserva, pero no operarla.</p>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {estado === "confirmada" && (
          <>
            <button className="btn btn-ok" disabled={pend || !puedeIngresar} onClick={() => correr("checkin")}>
              <Icono n="check" className="size-4" /> Hacer check-in
            </button>
            <button className="btn btn-peligro" disabled={pend} onClick={() => correr("cancelar", "¿Cancelar esta reserva? Se libera la habitación.")}>
              <Icono n="x" className="size-4" /> Cancelar
            </button>
          </>
        )}
        {estado === "en_casa" && (
          <button className="btn btn-p" disabled={pend} onClick={() => correr("checkout", saldo > 0 ? `Hay un saldo pendiente de $${saldo.toLocaleString("es-CO")}. ¿Hacer check-out de todas formas?` : undefined)}>
            <Icono n="logout" className="size-4" /> Hacer check-out
          </button>
        )}
        {estado === "cancelada" && <button className="btn" disabled={pend} onClick={() => correr("reactivar")}>Reactivar reserva</button>}
      </div>
      {estado === "confirmada" && !puedeIngresar && <p className="text-xs text-[color:var(--a-suave)]">El check-in se habilita desde la fecha de entrada.</p>}

      {total > 0 && saldo > 0 && estado !== "cancelada" && (
        <div className="flex flex-wrap items-end gap-2">
          <div className="grow sm:max-w-56">
            <label htmlFor="abono" className="etiqueta">Registrar abono (COP)</label>
            <input id="abono" inputMode="numeric" value={abono} onChange={(e) => setAbono(e.target.value)} placeholder="50000" className="campo" />
          </div>
          <button className="btn" disabled={pend || !abono} onClick={pagar}>Registrar</button>
        </div>
      )}
      {msg?.error && <p role="alert" className="error-txt">{msg.error}</p>}
      {msg?.ok && <p role="status" className="text-sm text-emerald-300">Listo.</p>}
    </div>
  );
}
