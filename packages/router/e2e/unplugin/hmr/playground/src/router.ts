import { createRouter, createWebHistory } from 'vue-x-router'
import { routes, handleHotUpdate } from 'vue-x-router/auto-routes'

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

if (import.meta.hot) {
  handleHotUpdate(router, routes => {
    console.log('🔥 HMR with', routes)
  })
}
