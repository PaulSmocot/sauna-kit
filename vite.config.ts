import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// Pe GitHub Pages site-ul stă la /sauna-kit/
export default defineConfig({
  base: '/sauna-kit/',
  build: { chunkSizeWarningLimit: 1500 },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: ['icons/*.png', 'icons/icon.svg'],
      manifest: {
        name: 'Saună 2 × 2 m – kit de montaj',
        short_name: 'Saună',
        description: 'Kit de montaj 3D pentru sauna de 2 × 2 m: pași, listă de tăiere și cumpărături. Merge offline.',
        lang: 'ro',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'any',
        background_color: '#141C1F',
        theme_color: '#2E6B57',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,woff2,webmanifest}'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallback: 'index.html'
      }
    })
  ]
});
