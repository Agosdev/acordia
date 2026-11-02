import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
export default defineConfig(({ mode }) => ({
  base: mode === "pages" ? "/acordia/" : "/",
  plugins: [react()],
  test: { environment: "jsdom", exclude: ["e2e/**", "node_modules/**"] },
}));
