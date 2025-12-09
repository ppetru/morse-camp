import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      includeAssets: [
        "favicon-16x16.png",
        "favicon-32x32.png",
        "apple-touch-icon.png",
        "safari-pinned-tab.svg",
      ],
      manifest: false, // Use existing manifest.json
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"],
      },
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        // Suppress deprecation warnings from react-md's old Sass
        silenceDeprecations: [
          "legacy-js-api",
          "import",
          "global-builtin",
          "slash-div",
          "if-function",
          "elseif",
        ],
        quietDeps: true,
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "build",
  },
});
