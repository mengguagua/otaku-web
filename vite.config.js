import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import vitePluginRequire from "vite-plugin-require";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // 让vite支持require语法
    vitePluginRequire.default()
  ],
  minify: true, // 是否压缩代码
  sourcemap: true,
  build: {
    rollupOptions: {
      output: {
        // 修改静态资源路径
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'static/assets/js/[name]-[hash].js',
        assetFileNames: 'static/assets/[ext]/[name]-[hash].[ext]',
      }
    }
  },
  base: '/otaku/', // 资源定位更改为相对路径
  server: {
    port: 8899,
    host: '0.0.0.0',
    proxy: {
      "/otaku-web": {
        target: "http://localhost:3100/", // 后端ip
        // target: "http://otaku.gaocc.cc/", // 后端ip
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/otaku-web/, "/"),
      },
    },
  },
})
