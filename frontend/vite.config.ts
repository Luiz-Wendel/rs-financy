import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rolldownOptions: {
      output: {
        // Libraries change less often than the app: separate chunks stay cached between deploys
        codeSplitting: {
          groups: [
            {
              name: 'react',
              test: /node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/,
              priority: 30,
            },
            {
              name: 'apollo',
              test: /node_modules[\\/](@apollo|graphql|rxjs|@wry|optimism|tslib)/,
              priority: 20,
            },
            {
              name: 'forms',
              test: /node_modules[\\/](zod|react-hook-form|@hookform)[\\/]/,
              priority: 10,
            },
            { name: 'vendor', test: /node_modules[\\/]/, priority: 0 },
          ],
        },
      },
    },
  },
})
