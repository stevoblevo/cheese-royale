import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const BASE = "/cheese-royale/";

/** Prefix root-absolute public URLs so GitHub Pages can host under /cheese-royale/. */
function prefixPublicAssets() {
  const rewrite = (code: string) =>
    code
      .replaceAll('"/art/', `"${BASE}art/`)
      .replaceAll("'/art/", `'${BASE}art/`)
      .replaceAll("url(/art/", `url(${BASE}art/`)
      .replaceAll('"/og.jpg', `"${BASE}og.jpg`)
      .replaceAll('"/favicon.svg', `"${BASE}favicon.svg`);
  return {
    name: "cheese-royale:prefix-public-assets",
    transform(code: string, id: string) {
      if (!id.includes("/src/") && !id.includes("/pages-src/")) return;
      if (!code.includes("/art/") && !code.includes("/og.jpg")) return;
      return { code: rewrite(code), map: null };
    },
  };
}

export default defineConfig({
  root: "pages-src",
  base: BASE,
  publicDir: fileURLToPath(new URL("./public", import.meta.url)),
  plugins: [tailwindcss(), viteReact(), prefixPublicAssets()],
  define: {
    "import.meta.env.VITE_AUTH_ENABLED": JSON.stringify("false"),
  },
  resolve: {
    tsconfigPaths: true,
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  build: {
    outDir: fileURLToPath(new URL("./dist-pages", import.meta.url)),
    emptyOutDir: true,
    assetsInlineLimit: 0,
  },
});
