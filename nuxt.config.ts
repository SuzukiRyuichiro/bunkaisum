// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/ui", "@nuxt/test-utils/module"],
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  typescript: {
    typeCheck: true,
  },
  alias: {
    components: fileURLToPath(new URL("./app/components", import.meta.url)),
    "@": fileURLToPath(new URL("./app/", import.meta.url)),
    "~": fileURLToPath(new URL("./app/", import.meta.url)),
    "@@": fileURLToPath(new URL("./", import.meta.url)),
    "~~": fileURLToPath(new URL("./", import.meta.url)),
  },
  nitro: {
    alias: {
      "@@": fileURLToPath(new URL("./", import.meta.url)),
      "~~": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
});
