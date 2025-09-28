import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/wmts': {
        target: 'https://gibs.earthdata.nasa.gov',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/wmts/, '/wmts')
      }
    }
  }
})