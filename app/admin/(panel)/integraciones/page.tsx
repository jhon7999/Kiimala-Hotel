import { desc } from "drizzle-orm";
import { BotonRevocar, FormToken } from "@/components/admin/FormsUsuario";
import { getDb, tokensApi } from "@/lib/db";
import { SITE } from "@/lib/site";

export const metadata = { title: "Integraciones" };

export default async function Integraciones() {
  const db = await getDb();
  const tokens = await db.select({ id: tokensApi.id, nombre: tokensApi.nombre, activo: tokensApi.activo, ultimoUso: tokensApi.ultimoUso, creado: tokensApi.creado }).from(tokensApi).orderBy(desc(tokensApi.id));
  const fmt = new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Bogota" });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="sube">
        <h1 className="text-4xl lg:text-5xl">Integraciones</h1>
        <p className="text-sm text-[color:var(--a-suave)]">Conecta otros sistemas (por ejemplo, Destidnos) para que vean la disponibilidad real. No ven datos de huéspedes.</p>
      </div>

      <section className="cristal sube space-y-4 p-5" style={{ ["--i" as string]: 1 }} aria-labelledby="tk">
        <h2 id="tk" className="text-2xl">Tokens de acceso</h2>
        <FormToken />
        <ul className="divide-y divide-white/10">
          {tokens.length === 0 && <li className="py-3 text-sm text-[color:var(--a-suave)]">Aún no hay tokens.</li>}
          {tokens.map((t) => (
            <li key={t.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
              <span>
                <strong>{t.nombre}</strong>{" "}
                <span className="text-[color:var(--a-suave)]">· creado {fmt.format(t.creado)} · {t.ultimoUso ? `último uso ${fmt.format(t.ultimoUso)}` : "sin uso"}</span>
              </span>
              <span className="flex items-center gap-2">
                <span className={`chip ${t.activo ? "chip-libre" : "chip-cancelada"}`}>{t.activo ? "Activo" : "Revocado"}</span>
                {t.activo && <BotonRevocar id={t.id} />}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="cristal sube space-y-3 p-5" style={{ ["--i" as string]: 2 }} aria-labelledby="doc">
        <h2 id="doc" className="text-2xl">Cómo consultar la disponibilidad</h2>
        <p className="text-sm text-[color:var(--a-suave)]">Cada consulta lleva el token en el encabezado <code>Authorization</code>. Límite: 60 consultas por minuto por token.</p>
        <pre className="scroll-fino overflow-x-auto rounded-xl bg-black/40 p-4 text-xs leading-relaxed">{`curl "${SITE.url}/api/v1/disponibilidad?entrada=2026-12-26&salida=2026-12-30&personas=10" \\
  -H "Authorization: Bearer kmk_TU_TOKEN"`}</pre>
        <p className="text-sm text-[color:var(--a-suave)]">Responde con las habitaciones libres, la capacidad libre, si alcanza para el grupo y una <strong>sugerencia</strong> de habitaciones (pocas habitaciones, poco cupo sobrante).</p>
        <pre className="scroll-fino overflow-x-auto rounded-xl bg-black/40 p-4 text-xs leading-relaxed">{`{
  "entrada": "2026-12-26", "salida": "2026-12-30", "noches": 4, "personas": 10,
  "habitaciones_libres": 17, "capacidad_libre": 71, "alcanza": true,
  "habitaciones": [ { "id": 3, "nombre": "Garzas 3", "torre": "Garzas", "capacidad": 4, "camas": "…", "vip": false } ],
  "sugerencia": { "habitaciones": [ … ], "capacidad": 10 }
}`}</pre>
        <p className="text-sm text-[color:var(--a-suave)]">También: <code>GET /api/v1/habitaciones</code> con el inventario. La reserva en sí la confirma recepción de Kiimala.</p>
      </section>
    </div>
  );
}
