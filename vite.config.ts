import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

function buildDepPaths(names: string[]) {
  return names.map((name) => {
    let _name = name;
    if (_name.includes("/")) {
      _name = _name.replace("/", "+");
    }
    return `/.pnpm/${_name}`;
  });
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [vue()],
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        // manualChunks 配置
        manualChunks(id) {
          const vendorNames = ["vue", "vue-router"];
          const uiLibNames = [
            "@tinymce/tinymce-vue",
            "tinymce",
          ];
          // console.log(id)
          if (id.includes("node_modules")) {
            const packageDepName = id.split("node_modules")[1];
            // console.log(packageDepName)

            if (
              buildDepPaths(vendorNames).some((name) =>
                packageDepName.includes(name)
              )
            ) {
              return "vendor";
            }

            if (
              buildDepPaths(uiLibNames).some((name) =>
                packageDepName.includes(name)
              )
            ) {
              return "ui-libs";
            }
          }
        },
      },
    },
  },
});
