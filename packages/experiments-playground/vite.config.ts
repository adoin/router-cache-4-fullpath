import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueDevtools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [Vue(), VueDevtools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // directly point to the vue-x-router source code
      'vue-x-router/experimental': fileURLToPath(
        new URL('../router/src/experimental/index.ts', import.meta.url)
      ),
      'vue-x-router': fileURLToPath(
        new URL('../router/src/index.ts', import.meta.url)
      ),
    },
  },
  // to handle replacements added in vue-x-router source code
  define: {
    __DEV__: 'true',
    __BROWSER__: 'true',
    __FEATURE_PROD_DEVTOOLS__: 'false',
    __STRIP_DEVTOOLS__: 'false',
  },
})
