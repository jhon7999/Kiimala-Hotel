import Link from "next/link";
import { BarraInferior, BarraLateral } from "@/components/admin/Nav";
import InstalarApp from "@/components/admin/InstalarApp";
import PulsoVivo, { BotonSonido } from "@/components/admin/PulsoVivo";
import { verificarSesion } from "@/lib/dal";
import { pulso } from "@/lib/hotel";
import { modulosDe } from "@/lib/modulos";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const sesion = await verificarSesion();
  const items = modulosDe(sesion.rol).map(({ href, label, icono }) => ({ href, label, icono }));
  const p = await pulso();
  const props = { items, nombre: sesion.nombre, rol: sesion.rol, pendientesLimpieza: p.tareasPendientes };

  return (
    <>
      <BarraLateral {...props} />
      <div className="lg:pl-72 print:pl-0">
        <header className="no-imprimir sticky top-0 z-30 flex items-center justify-between gap-3 px-4 py-3 lg:px-8">
          <Link href="/admin" className="font-serif text-xl lg:hidden">Kiimala</Link>
          <p className="hidden text-sm text-[color:var(--a-suave)] lg:block">Hola, {sesion.nombre.split(" ")[0]}</p>
          <div className="flex items-center gap-2">
            <InstalarApp />
            <BotonSonido />
          </div>
        </header>
        <main className="px-4 pb-32 pt-2 lg:px-8 lg:pb-12">{children}</main>
      </div>
      <BarraInferior {...props} />
      <PulsoVivo rol={sesion.rol} inicial={p} />
    </>
  );
}
