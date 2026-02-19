import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Resolve convex/_generated from the parent project
      convex: path.resolve(__dirname, "../node_modules/convex"),
    },
  },
  // Allow importing from parent convex/ directory
  server: {
    fs: {
      allow: [".."],
    },
  },
});
