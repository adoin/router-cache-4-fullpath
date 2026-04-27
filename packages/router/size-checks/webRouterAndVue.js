import { createApp, h } from 'vue'
import { createRouter, createWebHistory } from '../dist/vue-smart-router.js'

createRouter({
  history: createWebHistory(),
  routes: [],
})

// The bare minimum code required for rendering something to the screen
createApp({
  render: () => h('div', 'hello world!'),
}).mount('#app')
