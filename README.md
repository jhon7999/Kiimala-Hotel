# Kiimala Villas & Hotel — web pública (Fase 1)

Next.js 16 (App Router) + TypeScript + Tailwind 4. Solo español. Sin base de datos, sin panel, sin pasarela.

```bash
npm install
npm run dev      # desarrollo
npm run build && npm run start -- -p 3100
```

## Dónde se edita cada cosa
| Qué | Archivo |
|---|---|
| Nombre, dirección, horarios, tarifa "desde", WhatsApp | `lib/site.ts` |
| Habitaciones (textos, fotos, tarifa) | `data/habitaciones.ts` |
| Planes y temporadas | `data/planes.ts` |
| Tours opcionales | `data/tours.ts` |
| Testimonios reales (vacío = la sección no aparece) | `data/testimonios.ts` |
| Rutas de fotos | `data/fotos.ts` (archivos en `public/fotos`) |

## Variables de entorno (Vercel → Settings → Environment Variables)
- `NEXT_PUBLIC_SITE_URL`: dominio final (afecta sitemap, schema.org y OG).
- `NEXT_PUBLIC_WHATSAPP`: número del hotel con indicativo, sin `+` (ej. `573001234567`). Vacío = "Reservar" lleva a `/contacto` con el resumen.

## Pendiente de confirmar con el hotel (no inventado en cifras, pero revisar textos)
- Hora de check-in/check-out (`lib/site.ts`: 3:00 p. m. / 12:00 m. son supuestos).
- Dirección exacta y coordenadas del hotel (hoy es el centro de Coveñas).
- Capacidad de la Múltiple, camas de Triple/Doble, qué incluye cada habitación (aire, baño privado).
- Tarifa de particulares de Triple y Doble (solo Múltiple tiene $160.000 pp/noche confirmado, temporada normal).
- Qué tours se ofrecen realmente (hoy: lista genérica de la zona, sin precios).
- Políticas de cancelación, mascotas y niños; razón social para privacidad.
- Reseñas reales para `data/testimonios.ts`.
- Fotos por habitación (asignadas por apariencia; verificar que corresponden al tipo).

## Marca
Colores y tipografías en `app/globals.css` (ver `01-marca/MARCA.md`). Logos derivados en `public/marca` (tinta / hueso / K).
