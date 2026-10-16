import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { qualities: [75, 85] },
  serverExternalPackages: ["@electric-sql/pglite"], // base local de pruebas (PGlite necesita cargar su wasm desde node_modules)
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
