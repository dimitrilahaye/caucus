import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// Set base to repo name for GitHub Pages when building, otherwise '/'
const repoName = 'caucus';
const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
const isProdBuild = process.env.NODE_ENV === 'production';
const base = isProdBuild ? `/${repoName}/` : '/';

export default defineConfig({
  base,
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      filename: 'sw.js',
      strategies: 'generateSW',
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Caucus',
        short_name: 'Caucus',
        description: 'Générateur d\'improvisations théâtrales pour les professeurs',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '.',
        scope: '.',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        navigateFallbackDenylist: [/^\/api\//],
        // Fix for GitHub Pages subdirectory deployment
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/dimitrilahaye\.github\.io\/caucus\//,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'caucus-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
        suppressWarnings: true,
        type: 'module'
      }
    })
  ]
});

