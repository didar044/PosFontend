import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https:/vite.dev/config/
export default defineConfig({
    
   base: '/Laravel_React/dist/',
    // base:'./',
   plugins: [react()],
})

// vite.config.js
// export default defineConfig({
//   base: './',
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://127.0.0.1:8000',
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api/, '/api'),
//       },
//     },
//   },
// });
