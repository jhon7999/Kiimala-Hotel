"use client";
import { useActionState, useEffect, useMemo, useState, useTransition } from "react";
import { consultarDisponibilidad, crearReserva, type Consulta, type Estado } from "@/app/admin/actions";
import { noches } from "@/lib/fechas";
import Icono from "./Icono";

type Props = { hoy: string; entradaInicial?: string; habInicial?: number };

export default function FormReserva({ hoy, entradaInicial, habInicial }: Props) {
  const [entrada, setEntrada] = useState(entradaInicial ?? "");
  const [salida, setSalida] = useState("");
  const [personas, setPersonas] = useState(2);
  const [sel, setSel] = useState<number[]>(habInicial ? [habInicial] : []);
  const [consulta, setConsulta] = useState<Consulta | null>(null);
  const [cargando, iniciar] = useTransition();
  const [estado, accion, enviando] = useActionState<Estado, FormData>(crearReserva, {});

  const n = entrada && salida ? noches(entrada, salida) : 0;
  const fechasOk = n >= 1;

  useEffect(() => {
    if (!fechasOk) { setConsulta(null); return; }
    const t = setTimeout(() => iniciar(async () => {
      const c = await consultarDisponibilidad(entrada, salida, personas);
      setConsulta(c);
      setSel((actual) => actual.filter((id) => c.libres.some((l) => l.id === id))); // quita las que dejaron de estar libres
    }), 250);
    return () => clearTimeout(t);
  }, [entrada, salida, personas, fechasOk]);

  const libres = consulta?.libres ?? [];
  const torres = useMemo(() => [...new Set(libres.map((l) => l.torre))], [libres]);
  const capacidad = libres.filter((l) => sel.includes(l.id)).reduce((a, l) => a + l.capacidad, 0);
  const alterna = (id: number) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <form action={accion} className="space-y-6">
      <input type="hidden" name="habitaciones" value={sel.join(",")} />

      <section className="cristal space-y-4 p-5">
        <h2 className="text-2xl">1. Fechas y personas</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="entrada" className="etiqueta">Entrada</label>
            <input id="entrada" name="entrada" type="date" min={hoy} value={entrada} onChange={(e) => setEntrada(e.target.value)} required className="campo" />
          </div>
          <div>
            <label htmlFor="salida" className="etiqueta">Salida</label>
            <input id="salida" name="salida" type="date" min={entrada || hoy} value={salida} onChange={(e) => setSalida(e.target.value)} required className="campo" />
          </div>
          <div>
            <label htmlFor="personas" className="etiqueta">Personas</label>
            <input id="personas" name="personas" type="number" min={1} max={100} value={personas} onChange={(e) => setPersonas(Math.max(1, Number(e.target.value) || 1))} required className="campo" />
          </div>
        </div>
        {salida && entrada && !fechasOk && <p className="error-txt" role="alert">La salida debe ser después de la entrada.</p>}
        {fechasOk && <p className="text-sm text-[color:var(--a-suave)]">{n} {n === 1 ? "noche" : "noches"}</p>}
      </section>

      <section className="cristal space-y-4 p-5" aria-live="polite">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-2xl">2. Habitaciones</h2>
          {consulta && consulta.sugerencia.length > 0 && (
            <button type="button" className="btn btn-sm btn-ok" onClick={() => setSel(consulta.sugerencia)}>
              <Icono n="sparkles" className="size-4" /> Sugerir para {personas} personas
            </button>
          )}
        </div>
        {!fechasOk && <p className="text-sm text-[color:var(--a-suave)]">Elige las fechas para ver qué habitaciones están libres.</p>}
        {fechasOk && cargando && !consulta && <p className="text-sm text-[color:var(--a-suave)]">Consultando disponibilidad…</p>}
        {consulta?.error && <p className="error-txt">{consulta.error}</p>}
        {fechasOk && consulta && libres.length === 0 && <p className="error-txt">No hay habitaciones libres en esas fechas.</p>}
        {fechasOk && consulta && consulta.sugerencia.length === 0 && libres.length > 0 && personas > libres.reduce((a, l) => a + l.capacidad, 0) && (
          <p className="error-txt">Para {personas} personas no alcanza la capacidad libre ({libres.reduce((a, l) => a + l.capacidad, 0)}).</p>
        )}
        {torres.map((t) => (
          <div key={t}>
            <p className="etiqueta">Torre {t}</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {libres.filter((l) => l.torre === t).map((l) => {
                const on = sel.includes(l.id);
                return (
                  <button
                    type="button" key={l.id} onClick={() => alterna(l.id)} aria-pressed={on}
                    className={`rounded-2xl border p-3 text-left transition ${on ? "border-[#e7d9c2] bg-[#e7d9c2]/15 ring-1 ring-[#e7d9c2]" : "border-white/12 bg-white/5 hover:bg-white/10"}`}
                  >
                    <span className="flex items-center justify-between font-medium">
                      {l.nombre}{l.vip && <span className="text-xs text-amber-300">VIP</span>}
                      {on && <Icono n="check" className="size-4 text-[#e7d9c2]" />}
                    </span>
                    <span className="block text-xs text-[color:var(--a-suave)]">{l.capacidad} personas</span>
                    <span className="mt-1 block text-[11px] leading-tight text-[color:var(--a-suave)]">{l.camas}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {sel.length > 0 && (
          <p className={`text-sm ${capacidad >= personas ? "text-emerald-300" : "text-amber-300"}`} role="status">
            {sel.length} habitación(es) · capacidad {capacidad} · {capacidad >= personas ? "alcanza para el grupo" : `faltan ${personas - capacidad} cupos`}
          </p>
        )}
      </section>

      <section className="cristal space-y-4 p-5">
        <h2 className="text-2xl">3. Huésped</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="huesped" className="etiqueta">Nombre del huésped o grupo</label>
            <input id="huesped" name="huesped" required maxLength={120} className="campo" autoComplete="off" />
          </div>
          <div>
            <label htmlFor="telefono" className="etiqueta">WhatsApp / teléfono</label>
            <input id="telefono" name="telefono" type="tel" maxLength={30} className="campo" autoComplete="off" />
          </div>
          <div>
            <label htmlFor="canal" className="etiqueta">Canal de venta</label>
            <select id="canal" name="canal" className="campo" defaultValue="whatsapp">
              <option value="whatsapp">WhatsApp</option>
              <option value="directo">Directo / recepción</option>
              <option value="agencia">Agencia</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="total" className="etiqueta">Total (COP)</label>
              <input id="total" name="total" inputMode="numeric" defaultValue="0" className="campo" />
            </div>
            <div>
              <label htmlFor="abonado" className="etiqueta">Abono (COP)</label>
              <input id="abonado" name="abonado" inputMode="numeric" defaultValue="0" className="campo" />
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="notas" className="etiqueta">Notas</label>
          <textarea id="notas" name="notas" rows={2} maxLength={500} className="campo" placeholder="Llegada tarde, cumpleaños, alergias…" />
        </div>
      </section>

      {estado.error && <p role="alert" className="cristal border-red-400/40 p-4 error-txt">{estado.error}</p>}
      <div className="flex justify-end">
        <button className="btn btn-p min-w-48" disabled={enviando || sel.length === 0 || !fechasOk}>{enviando ? "Guardando…" : "Crear reserva"}</button>
      </div>
    </form>
  );
}
