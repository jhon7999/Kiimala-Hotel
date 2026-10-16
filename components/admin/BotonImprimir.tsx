"use client";
import Icono from "./Icono";

export default function BotonImprimir() {
  return (
    <button className="btn btn-p btn-sm" onClick={() => window.print()}>
      <Icono n="print" className="size-4" /> Imprimir / guardar PDF
    </button>
  );
}
