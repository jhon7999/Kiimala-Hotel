// Iconos de contorno (trazo 1.75), sin dependencias.
const RUTAS: Record<string, string> = {
  home: "M3 11.5 12 4l9 7.5M5.5 10v9.5h4.5v-5h4v5h4.5V10",
  calendar: "M7 3v3M17 3v3M4 8.5h16M5.5 5h13A1.5 1.5 0 0 1 20 6.5v12a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-12A1.5 1.5 0 0 1 5.5 5Z",
  ticket: "M4 8.5A1.5 1.5 0 0 1 5.5 7h13A1.5 1.5 0 0 1 20 8.5V10a2 2 0 0 0 0 4v1.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 15.5V14a2 2 0 0 0 0-4Zm9-1.5v10",
  sparkles: "M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8ZM18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8Z",
  bed: "M3 18V7M3 14h18v4M21 14v-2.5A2.5 2.5 0 0 0 18.5 9H11v5M6.5 11.5a1.5 1.5 0 1 0 0-.01",
  users: "M16 19v-1.2a3.8 3.8 0 0 0-3.8-3.8H8.8A3.8 3.8 0 0 0 5 17.8V19M10.5 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19 19v-1a3.2 3.2 0 0 0-2.4-3.1M15.5 5.2a3 3 0 0 1 0 5.6",
  plug: "M9 3v5M15 3v5M6.5 8h11v2.5a5.5 5.5 0 0 1-11 0ZM12 16v5",
  bell: "M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 1.5h-15ZM10 20.5a2.2 2.2 0 0 0 4 0",
  sound: "M4 9.5v5h3.5L12 18.5v-13L7.5 9.5ZM15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11",
  mute: "M4 9.5v5h3.5L12 18.5v-13L7.5 9.5ZM16 9.5l5 5M21 9.5l-5 5",
  logout: "M14 4.5H7.5A1.5 1.5 0 0 0 6 6v12a1.5 1.5 0 0 0 1.5 1.5H14M10 12h10M17 8.5 20.5 12 17 15.5",
  plus: "M12 5v14M5 12h14",
  check: "m5 12.5 4.5 4.5L19 7.5",
  x: "M6 6l12 12M18 6 6 18",
  left: "m14.5 6-6 6 6 6",
  right: "m9.5 6 6 6-6 6",
  print: "M7 9V4h10v5M7 17H5.5A1.5 1.5 0 0 1 4 15.5v-5A1.5 1.5 0 0 1 5.5 9h13a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5H17M7 14h10v6H7Z",
  phone: "M5 4.5h3.2l1.6 4-2 1.3a10 10 0 0 0 5.4 5.4l1.3-2 4 1.6V18a1.5 1.5 0 0 1-1.6 1.5A14 14 0 0 1 3.5 6.1 1.5 1.5 0 0 1 5 4.5Z",
  download: "M12 4v11M7.5 11 12 15.5 16.5 11M5 19.5h14",
  key: "M14.5 9.5a4 4 0 1 1-1.2 2.8L4.5 21v-3H7.5v-3H10.5l2.8-2.7",
  shield: "M12 3.5 5 6v5.5c0 4.4 2.8 7.5 7 9 4.2-1.5 7-4.6 7-9V6Z",
};

export default function Icono({ n, className = "size-5" }: { n: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={RUTAS[n] ?? RUTAS.home} />
    </svg>
  );
}
