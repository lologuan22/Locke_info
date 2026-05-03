import { defineConfig } from "vite";
import { resolve } from "node:path";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        compare: resolve(__dirname, "compare.html"),
        debug: resolve(__dirname, "debug.html"),
        details: resolve(__dirname, "details.html"),
        myCollection: resolve(__dirname, "my-collection.html"),
        worldMap: resolve(__dirname, "world-map.html"),
      },
    },
  },
  base: "./",
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "img",
          dest: "./",
        },
      ],
    }),
  ],
});
