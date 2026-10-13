"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SITE } from "@/lib/site";

const ETIQUETAS: [string, string][] = [["entrada", "Entrada"], ["salida", "Salida"], ["hab", "Habitación"], ["personas", "Personas"]];

/** Resumen de la búsqueda (fechas/habitación). No pide ni guarda datos personales. */
export default function ContactoResumen() {
  const sp = useSearchParams();
  const filas = ETIQUETAS.filter(([k]) => sp.get(k));
  return (
    <div>
      <h2 className="text-3xl">Tu solicitud</h2>
      {filas.length ? (
        <dl className="mt-5 divide-y divide-arena rounded-3xl border border-arena">
          {filas.map(([k, label]) => (
            <div key={k} className="flex justify-between gap-4 px-5 py-3">
              <dt className="opacity-70">{label}</dt>
              <dd className="font-medium">{sp.get(k)}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="mt-4 opacity-80">
          Elige fechas y habitación en el <Link href="/" className="underline">buscador de la portada</Link> y tu solicitud aparece aquí.
        </p>
      )}
      <p className="mt-5 opacity-80">
        Para confirmar disponibilidad y tarifa, envíanos este resumen por Instagram:{" "}
        <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="underline">{SITE.instagramUsuario}</a>.
      </p>
    </div>
  );
}
