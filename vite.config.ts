import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/dsci320-project-website/" : "/",
  build: {
    outDir: "docs",
  },
  plugins: [svelte(), tailwindcss()],
}));
