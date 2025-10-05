import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// Set base to repo name for GitHub Pages when building, otherwise '/'
const repoName = 'cre-impro-vibe-cording';
const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
const isProdBuild = process.env.NODE_ENV === 'production';
const base = isProdBuild ? `/${repoName}/` : '/';

export default defineConfig({
  base,
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Cre Impro Vibe Cording',
        short_name: 'CIVC',
        description: 'Hello World PWA (Vite + vanilla JS)',
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
      },
      devOptions: {
        enabled: true,
        suppressWarnings: true,
        type: 'module'
      }
    })
  ]
});

