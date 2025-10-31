import { defineVitestConfig } from "@nuxt/test-utils/config";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, ".env.test") });

export default defineVitestConfig({
  test: {
    environment: "nuxt",
    environmentOptions: {
      nuxt: {
        domEnvironment: "happy-dom",
        mock: {
          intersectionObserver: true,
          indexedDb: true,
        },
      },
    },
    setupFiles: ["./test/setup.ts"],
  },
  resolve: {
    alias: {
      "bun:test": "vitest",
    },
  },
});
