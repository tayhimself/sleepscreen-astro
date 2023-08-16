import path from "path";
import { fileURLToPath } from "url";

import { defineConfig } from "astro/config"
import tailwind from "@astrojs/tailwind"

import { SITE } from "./src/config.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: SITE.origin,
  base: SITE.basePathname,
  trailingSlash: SITE.trailingSlash ? "always" : "never",
  output: "static",
  integrations: [tailwind()],
  vite: {
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "./src"),
      },
    },
  },
})
