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

---

## Panel del hotel (`/admin`) — software de gestión de Kiimala

Login con usuario y contraseña, roles (admin, recepción, ventas, limpieza), calendario de disponibilidad, reservas con asignación sugerida de habitaciones, check-in / check-out, abonos y recibo imprimible, limpieza con avisos sonoros, bloqueos por mantenimiento, usuarios y una API de solo lectura para Destidnos. Se instala como app en Android (PWA).

```bash
npm run db:push        # crea las tablas (sin DATABASE_URL usa una base local de pruebas en .data/)
npm run seed           # 22 habitaciones reales + usuarios y reservas FICTICIAS (contraseñas en .data/credenciales-demo.txt)
npm run seed:prod      # producción: solo habitaciones reales + el administrador (ADMIN_USUARIO / ADMIN_CLAVE)
npm run build && SESSION_SECRET=<32+ caracteres> npm run start -- -p 3100
npm run smoke          # prueba de humo (lógica + rutas) con el servidor levantado
```

- Variables: ver `.env.example`. En Vercel hacen falta `DATABASE_URL` y `SESSION_SECRET`.
- Inventario real de habitaciones: `lib/inventario.ts` (22 habitaciones, 92 personas).
- API para Destidnos: `GET /api/v1/disponibilidad?entrada=…&salida=…&personas=N` con `Authorization: Bearer kmk_…` (token creado en Panel → Integraciones). Nunca devuelve datos de huéspedes.
- Datos de huéspedes: nunca van en el repo ni en datos de prueba. Los de demostración son ficticios.
- Pendiente de la siguiente fase: factura electrónica (Alegra/Siigo), reporte de extranjeros a Migración (SIRE/TRA), pre-check-in por WhatsApp, reportes de ocupación.
