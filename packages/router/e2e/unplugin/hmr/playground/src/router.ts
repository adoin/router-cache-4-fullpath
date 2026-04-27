import { createRouter, createWebHistory } from 'vue-smart-router'
import { handleHotUpdate, routes } from 'vue-smart-router/auto-routes'

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

if (import.meta.hot) {
  handleHotUpdate(router, routes => {
    console.log('🔥 HMR with', routes)
  })
}
