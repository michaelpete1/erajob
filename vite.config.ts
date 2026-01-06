import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dns from 'node:dns'

dns.setDefaultResultOrder('ipv4first')

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, 'src')
      }
    ]
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://eba.3nis.net',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, _req, _res) => {
            // Ensure proper headers are forwarded
            proxyReq.setHeader('Accept', 'application/json');
            proxyReq.setHeader('Content-Type', 'application/json');
          });
        },
        ws: true,
      },
      '/v1': {
        target: 'https://eba.3nis.net',
        changeOrigin: true,
        secure: true,
      },
    },
    cors: true, // Enable CORS for better browser compatibility
  }
})
