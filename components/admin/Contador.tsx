"use client";
import { useEffect, useState } from "react";

/** Número que sube animado hasta su valor (respeta "reducir movimiento"). */
export default function Contador({ valor, sufijo = "" }: { valor: number; sufijo?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(valor); return; }
    const t0 = performance.now();
    let raf = 0;
    const paso = (t: number) => {
      const p = Math.min(1, (t - t0) / 900);
      setN(Math.round(valor * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [valor]);
  return <span className="tabular-nums">{n}{sufijo}</span>;
}
