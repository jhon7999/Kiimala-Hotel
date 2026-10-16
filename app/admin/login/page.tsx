import Image from "next/image";
import { FOTO } from "@/data/fotos";
import FormLogin from "./FormLogin";

export const metadata = { title: "Ingresar" };

export default function Login() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-10">
      <Image src={FOTO.piscinaInfinita} alt="" fill priority sizes="100vw" quality={70} className="object-cover opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c1812]/80 via-[#163020]/70 to-[#0e1b14]/95" />
      <div className="cristal sube relative w-full max-w-sm p-7 sm:p-9" style={{ background: "rgb(255 255 255 / 0.1)" }}>
        <Image src="/marca/logo-hueso.png" alt="Kiimala Villas & Hotel" width={190} height={57} className="mx-auto h-14 w-auto" priority />
        <h1 className="mt-6 text-center text-3xl">Panel del hotel</h1>
        <p className="mt-1 text-center text-sm text-[color:var(--a-suave)]">Ingresa con tu usuario y contraseña.</p>
        <FormLogin />
      </div>
    </main>
  );
}
