import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "path";
import postcssNested from "postcss-nesting";
// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [vue()],
  css: {
    postcss: {
      plugins: [postcssNested],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
