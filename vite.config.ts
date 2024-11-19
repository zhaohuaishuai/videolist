import { defineConfig } from "vite";
import { resolve } from "path";
import buildAfter from "./plugins/vite-plugin-build-after";
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  plugins: [buildAfter()],
  build: {
    lib: {
      entry: {
        main: resolve(__dirname, "./src/main.ts"),
      },
      name: "AudioList",
      fileName: "[name]",
    },
    outDir: "dist",
    watch: {},
  },
});
