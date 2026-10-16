import type { Metadata, Viewport } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: { default: "Panel Kiimala", template: "%s · Panel Kiimala" },
  description: "Panel interno de Kiimala Villas & Hotel.",
  robots: { index: false, follow: false },
  manifest: "/panel.webmanifest",
  appleWebApp: { capable: true, title: "Kiimala", statusBarStyle: "black-translucent" },
  alternates: { canonical: null },
};
export const viewport: Viewport = { themeColor: "#163020", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="adm">{children}</div>;
}
