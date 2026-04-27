import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueRouter from 'vue-x-router/vite'
import AutoScaffold from 'auto-scaffold/vite'
// import AutoImport from 'unplugin-auto-import/vite'
import VueDevtools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // FIXME: it seems to conflict with the mono repo setup
    // AutoImport({
    // dts: './src/auto-imports.d.ts',
    // imports: ['vue', 'vue-x-router'],
    // }),
    AutoScaffold({
      presets: ['vue', 'vue-x-router'],
    }),
    // FIXME: why doesn't it work when imported from vue-x-router/vite
    VueRouter({
      logs: true,
      dts: './src/routes.d.ts',

      experimental: {
        autoExportsDataLoaders: ['src/loaders'],
        paramParsers: {
          dir: 'src/params',
        },
      },
    }),
    Vue(),
    VueDevtools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // "vue-x-router": fileURLToPath(new URL("../router/src", import.meta.url)),
    },
  },
  define: {
    __DEV__: JSON.stringify(!process.env.prod),
    __BROWSER__: 'true',
    __FEATURE_PROD_DEVTOOLS__: 'false',
    __STRIP_DEVTOOLS__: 'false',
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
  },
})
