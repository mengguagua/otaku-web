// vite.config.js
import { defineConfig } from "file:///Users/gcc/gcc/react/otaku-web/node_modules/vite/dist/node/index.js";
import react from "file:///Users/gcc/gcc/react/otaku-web/node_modules/@vitejs/plugin-react-swc/index.mjs";
import vitePluginRequire from "file:///Users/gcc/gcc/react/otaku-web/node_modules/vite-plugin-require/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    // 让vite支持require语法
    vitePluginRequire.default()
  ],
  minify: true,
  // 是否压缩代码
  build: {
    rollupOptions: {
      output: {
        // 修改静态资源路径
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "static/assets/js/[name]-[hash].js",
        assetFileNames: "static/assets/[ext]/[name]-[hash].[ext]"
      }
    }
  },
  base: "/otaku/",
  // 资源定位更改为相对路径
  server: {
    port: 8899,
    host: "0.0.0.0",
    proxy: {
      "/otaku-web": {
        target: "http://localhost:3100/",
        // 后端ip
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/otaku-web/, "/")
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZ2NjL2djYy9yZWFjdC9vdGFrdS13ZWJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9nY2MvZ2NjL3JlYWN0L290YWt1LXdlYi92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZ2NjL2djYy9yZWFjdC9vdGFrdS13ZWIvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0LXN3YydcbmltcG9ydCB2aXRlUGx1Z2luUmVxdWlyZSBmcm9tIFwidml0ZS1wbHVnaW4tcmVxdWlyZVwiO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgLy8gXHU4QkE5dml0ZVx1NjUyRlx1NjMwMXJlcXVpcmVcdThCRURcdTZDRDVcbiAgICB2aXRlUGx1Z2luUmVxdWlyZS5kZWZhdWx0KClcbiAgXSxcbiAgbWluaWZ5OiB0cnVlLCAvLyBcdTY2MkZcdTU0MjZcdTUzOEJcdTdGMjlcdTRFRTNcdTc4MDFcbiAgYnVpbGQ6IHtcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgLy8gXHU0RkVFXHU2NTM5XHU5NzU5XHU2MDAxXHU4RDQ0XHU2RTkwXHU4REVGXHU1Rjg0XG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiAnYXNzZXRzL2pzL1tuYW1lXS1baGFzaF0uanMnLFxuICAgICAgICBlbnRyeUZpbGVOYW1lczogJ3N0YXRpYy9hc3NldHMvanMvW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiAnc3RhdGljL2Fzc2V0cy9bZXh0XS9bbmFtZV0tW2hhc2hdLltleHRdJyxcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGJhc2U6ICcvb3Rha3UvJywgLy8gXHU4RDQ0XHU2RTkwXHU1QjlBXHU0RjREXHU2NkY0XHU2NTM5XHU0RTNBXHU3NkY4XHU1QkY5XHU4REVGXHU1Rjg0XG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDg4OTksXG4gICAgaG9zdDogJzAuMC4wLjAnLFxuICAgIHByb3h5OiB7XG4gICAgICBcIi9vdGFrdS13ZWJcIjoge1xuICAgICAgICB0YXJnZXQ6IFwiaHR0cDovL2xvY2FsaG9zdDozMTAwL1wiLCAvLyBcdTU0MEVcdTdBRUZpcFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9vdGFrdS13ZWIvLCBcIi9cIiksXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE0USxTQUFTLG9CQUFvQjtBQUN6UyxPQUFPLFdBQVc7QUFDbEIsT0FBTyx1QkFBdUI7QUFHOUIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBO0FBQUEsSUFFTixrQkFBa0IsUUFBUTtBQUFBLEVBQzVCO0FBQUEsRUFDQSxRQUFRO0FBQUE7QUFBQSxFQUNSLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQTtBQUFBLFFBRU4sZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsTUFDbEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsTUFBTTtBQUFBO0FBQUEsRUFDTixRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxjQUFjO0FBQUEsUUFDWixRQUFRO0FBQUE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxnQkFBZ0IsR0FBRztBQUFBLE1BQ3JEO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
