import { SITE } from "@/lib/site";

const base = "inline-flex size-11 items-center justify-center rounded-full border border-current/30 transition hover:bg-terracota-osc hover:border-terracota-osc hover:text-white";

export function IconoInstagram({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconoFacebook({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.5V21h3Z" />
    </svg>
  );
}

/** Iconos de redes sociales del hotel. Hereda el color del texto. */
export default function Redes({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex items-center justify-center gap-3 ${className}`} aria-label="Redes sociales de Kiimala">
      <li>
        <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram de Kiimala" className={base}>
          <IconoInstagram />
        </a>
      </li>
      <li>
        <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook de Kiimala" className={base}>
          <IconoFacebook />
        </a>
      </li>
    </ul>
  );
}
