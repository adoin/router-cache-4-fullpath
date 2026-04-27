import { PiniaColada } from '@pinia/colada'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { RouterLink, RouterView } from 'vue-smart-router'
import { DataLoaderPlugin } from 'vue-smart-router/experimental'
import App from './App.vue'
import { router } from './router/resolver'
import './style.css'

const app = createApp(App)

app.use(createPinia())
app.use(PiniaColada, {})
app.use(DataLoaderPlugin, {
  // FIXME: should be doable without `as any`
  router: router as any,
})
app.component('RouterLink', RouterLink)
app.component('RouterView', RouterView)
router.afterEach((to, from, failure) => {
  if (failure) {
    console.error('⛔️ Failed navigation', from.fullPath, '->', to.fullPath)
    console.error(failure)
  }
})
router.onError(err => {
  console.log('❌ Router error', err)
})
app.use(router)

// @ts-expect-error: for debugging on browser
window.$router = router

app.mount('#app')

// small logger for navigations, useful to check HMR
router.isReady().then(() => {
  router.beforeEach((to, from) => {
    console.log('🧭', from.fullPath, '->', to.fullPath)
  })
})
