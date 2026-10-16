"use client";
// Sonidos del panel generados con Web Audio (sin archivos). El navegador exige un toque previo del usuario para sonar.
let ctx: AudioContext | null = null;
const CLAVE = "kiimala_sonido";

export const sonidoActivo = () => {
  try { return localStorage.getItem(CLAVE) !== "off"; } catch { return true; }
};
export const fijarSonido = (on: boolean) => {
  try { localStorage.setItem(CLAVE, on ? "on" : "off"); } catch { /* sin almacenamiento: queda el valor por defecto */ }
};

function audio() {
  if (typeof window === "undefined") return null;
  ctx ??= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function nota(freq: number, inicio: number, dur: number, tipo: OscillatorType = "sine", vol = 0.18) {
  const c = audio();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = tipo;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, c.currentTime + inicio);
  g.gain.exponentialRampToValueAtTime(vol, c.currentTime + inicio + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + inicio + dur);
  o.connect(g).connect(c.destination);
  o.start(c.currentTime + inicio);
  o.stop(c.currentTime + inicio + dur + 0.05);
}

/** Mantiene el sonido listo tras el primer toque del usuario (política de autoplay). */
export const desbloquearAudio = () => { audio(); };

export type Tono = "reserva" | "limpieza" | "exito" | "alerta";
export function sonar(tono: Tono) {
  if (!sonidoActivo()) return;
  if (tono === "reserva") { nota(659, 0, 0.5); nota(880, 0.14, 0.5); nota(1318, 0.3, 0.7, "sine", 0.14); }
  else if (tono === "limpieza") { nota(523, 0, 0.35, "triangle"); nota(659, 0.18, 0.35, "triangle"); nota(523, 0.5, 0.35, "triangle"); nota(659, 0.68, 0.45, "triangle"); }
  else if (tono === "exito") { nota(784, 0, 0.18); nota(1175, 0.1, 0.35); }
  else { nota(330, 0, 0.25, "square", 0.08); nota(330, 0.3, 0.25, "square", 0.08); }
}

/** Para el botón "Probar": reproduce los dos avisos del panel, uno tras otro. */
export function probarSonidos() {
  desbloquearAudio();
  sonar("reserva");
  setTimeout(() => sonar("limpieza"), 1300);
}

/** Vibración corta en el celular (si el dispositivo la permite). */
export function vibrar() {
  try { navigator.vibrate?.([200, 100, 200]); } catch { /* sin vibración */ }
}
