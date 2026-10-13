"use client";
import { useCallback, useEffect, useRef, useState } from "react";

type Item = { src: string; alt: string };
const grande = (src: string) => `/_next/image?url=${encodeURIComponent(src)}&w=1920&q=85`;

/**
 * Visor de fotos + protección básica contra descarga.
 * Cualquier elemento con data-zoom="grupo" data-src data-alt se abre ampliado; las flechas recorren su grupo.
 * Nota: ninguna web puede impedir del todo copiar una imagen (capturas, herramientas del navegador);
 * esto solo bloquea clic derecho y arrastre sobre las fotos.
 */
export default function Lightbox() {
  const [items, setItems] = useState<Item[]>([]);
  const [i, setI] = useState(0);
  const abierto = items.length > 0;
  const cierre = useRef<HTMLButtonElement>(null);
  const toqueX = useRef<number | null>(null);
  const origen = useRef<HTMLElement | null>(null);

  const cerrar = useCallback(() => {
    setItems([]);
    origen.current?.focus();
  }, []);
  const mover = useCallback((d: number) => setI((v) => (v + d + items.length) % items.length), [items.length]);

  // Abrir (delegación de clic / Enter) y protección de imágenes
  useEffect(() => {
    const abrir = (el: HTMLElement) => {
      const grupo = el.dataset.zoom;
      const todos = [...document.querySelectorAll<HTMLElement>(`[data-zoom="${grupo}"]`)];
      origen.current = el;
      setItems(todos.map((t) => ({ src: t.dataset.src ?? "", alt: t.dataset.alt ?? "" })));
      setI(Math.max(0, todos.indexOf(el)));
    };
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-zoom]");
      if (el) abrir(el);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-zoom]");
      if (el && el === e.target) { e.preventDefault(); abrir(el); }
    };
    const bloquear = (e: Event) => { if ((e.target as HTMLElement).tagName === "IMG") e.preventDefault(); };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    document.addEventListener("contextmenu", bloquear);
    document.addEventListener("dragstart", bloquear);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("contextmenu", bloquear);
      document.removeEventListener("dragstart", bloquear);
    };
  }, []);

  // Teclado y bloqueo de scroll mientras está abierto
  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
      if (e.key === "ArrowRight") mover(1);
      if (e.key === "ArrowLeft") mover(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cierre.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [abierto, cerrar, mover]);

  if (!abierto) return null;
  const actual = items[i];
  const btn = "absolute z-10 flex size-12 items-center justify-center rounded-full bg-white/15 text-2xl text-white backdrop-blur transition hover:bg-white/30";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Foto ampliada: ${actual.alt}`}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
      onClick={(e) => e.target === e.currentTarget && cerrar()}
      onTouchStart={(e) => { toqueX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (toqueX.current === null) return;
        const dx = e.changedTouches[0].clientX - toqueX.current;
        if (Math.abs(dx) > 50) mover(dx < 0 ? 1 : -1);
        toqueX.current = null;
      }}
    >
      <button ref={cierre} onClick={cerrar} aria-label="Cerrar" className={`${btn} right-4 top-4`}>✕</button>
      {items.length > 1 && (
        <>
          <button onClick={() => mover(-1)} aria-label="Foto anterior" className={`${btn} left-3 top-1/2 -translate-y-1/2 md:left-6`}>‹</button>
          <button onClick={() => mover(1)} aria-label="Foto siguiente" className={`${btn} right-3 top-1/2 -translate-y-1/2 md:right-6`}>›</button>
        </>
      )}
      <figure className="flex max-h-full max-w-full flex-col items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={grande(actual.src)} alt={actual.alt} draggable={false} className="max-h-[82vh] max-w-full select-none rounded-lg object-contain" />
        <figcaption className="mt-3 text-center text-sm text-white/80">
          {actual.alt} · {i + 1} / {items.length}
        </figcaption>
      </figure>
    </div>
  );
}
