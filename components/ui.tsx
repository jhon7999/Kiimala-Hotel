import Image from "next/image";
import Link from "next/link";

export function Kicker({ children, claro }: { children: React.ReactNode; claro?: boolean }) {
  return <p className={`text-xs font-medium uppercase tracking-[0.3em] ${claro ? "text-arena" : "text-terracota-osc"}`}>{children}</p>;
}

export function Seccion({ children, fondo = "hueso", className = "" }: { children: React.ReactNode; fondo?: "hueso" | "arena" | "palma"; className?: string }) {
  const bg = { hueso: "bg-hueso", arena: "bg-arena/50", palma: "bg-palma text-hueso" }[fondo];
  return (
    <section className={`${bg} px-6 py-20 text-center md:py-28 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export function Titulo({ kicker, titulo, texto, claro }: { kicker?: string; titulo: string; texto?: string; claro?: boolean }) {
  return (
    <div className="mx-auto max-w-2xl">
      {kicker && <Kicker claro={claro}>{kicker}</Kicker>}
      <h2 className="mt-3 text-4xl md:text-5xl">{titulo}</h2>
      {texto && <p className="mt-4 text-lg opacity-80">{texto}</p>}
    </div>
  );
}

/** Cabecera de subpágina: foto real a todo el ancho con título. */
export function PaginaHero({ kicker, titulo, texto, foto }: { kicker: string; titulo: string; texto?: string; foto: string }) {
  return (
    <section className="relative flex min-h-[58vh] items-end overflow-hidden bg-tinta text-center text-hueso">
      <Image src={foto} alt="" fill priority sizes="100vw" quality={85} className="object-cover opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
      <div className="relative mx-auto w-full max-w-6xl px-6 pb-14 pt-40">
        <Kicker claro>{kicker}</Kicker>
        <h1 className="mx-auto mt-3 max-w-3xl text-5xl md:text-7xl">{titulo}</h1>
        {texto && <p className="mx-auto mt-4 max-w-2xl text-lg text-hueso/90">{texto}</p>}
      </div>
    </section>
  );
}

export function Boton({ href, children, variante = "terracota" }: { href: string; children: React.ReactNode; variante?: "terracota" | "borde" | "claro" }) {
  const estilos = {
    terracota: "bg-terracota-osc text-white hover:brightness-110",
    borde: "border border-tinta/40 text-tinta hover:bg-tinta hover:text-hueso",
    claro: "bg-hueso text-tinta hover:bg-arena",
  }[variante];
  const cls = `inline-block rounded-full px-7 py-3 text-sm font-medium tracking-wide transition ${estilos}`;
  return href.startsWith("http") ? (
    <a href={href} className={cls} target="_blank" rel="noopener noreferrer">{children}</a>
  ) : (
    <Link href={href} className={cls}>{children}</Link>
  );
}

export function Foto({ src, alt, className = "", sizes = "(min-width: 768px) 50vw, 100vw", priority, posicion = "center", zoom }: { src: string; alt: string; className?: string; sizes?: string; priority?: boolean; posicion?: string; zoom?: string }) {
  // zoom="grupo": al hacer clic se abre ampliado en el visor (components/Lightbox.tsx)
  const ampliable = zoom ? { "data-zoom": zoom, "data-src": src, "data-alt": alt, role: "button", tabIndex: 0, "aria-label": `Ampliar foto: ${alt}` } : {};
  return (
    <div {...ampliable} className={`${className.includes("absolute") ? "" : "relative"} overflow-hidden ${zoom ? "cursor-zoom-in" : ""} ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} draggable={false} className="object-cover transition duration-700 hover:scale-105" style={{ objectPosition: posicion }} />
    </div>
  );
}

/** Texto largo (políticas, privacidad). */
export function Prosa({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl space-y-5 text-left text-lg [&_a]:text-terracota-osc [&_a]:underline [&_h2]:mt-12 [&_h2]:text-3xl [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
      {children}
    </div>
  );
}
