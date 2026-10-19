import {
  createApp,
  defineComponent,
  h,
  shallowRef,
  Teleport,
  nextTick,
  getCurrentInstance,
} from 'vue'
import {
  createRouter,
  createWebHistory,
  RouterView,
  useRoute,
  onBeforeRouteLeave,
  onBeforeRouteUpdate,
} from 'vue-router'

const Page = defineComponent({
  setup() {
    const route = useRoute()
    const text = shallowRef('')
    const uid = getCurrentInstance()!.uid
    const recordNavigation = () => {
      document.querySelector('#guards')!.textContent += `${route.params.id},`
    }
    onBeforeRouteLeave(recordNavigation)
    onBeforeRouteUpdate(recordNavigation)
    return () =>
      h('section', { 'data-uid': uid, style: 'height:120px;overflow:auto' }, [
        h('p', `${route.params.id}:${route.query.mode}`),
        h('input', {
          'aria-label': 'Draft text',
          value: text.value,
          onInput: (e: Event) => {
            text.value = (e.target as HTMLInputElement).value
          },
        }),
        h('div', { style: 'height:800px' }, 'Scrollable page content'),
      ])
  },
})
const router = createRouter({
  history: createWebHistory('/detached-view'),
  routes: [{ path: '/draft/:id', component: Page }],
})
await router.push('/draft/1?mode=a')
const saved = router.currentRoute.value
const pinned = shallowRef(false),
  secondary = shallowRef(false)
createApp(
  defineComponent({
    setup() {
      const main = shallowRef<HTMLElement>(),
        window = shallowRef<HTMLElement>()
      async function move(value: boolean) {
        const section = (
          pinned.value ? window.value : main.value
        )!.querySelector('section')!
        const top = section.scrollTop
        const left = section.scrollLeft
        pinned.value = value
        await nextTick()
        // Native browsers can reset scroll during DOM relocation.
        section.scrollTop = top
        section.scrollLeft = left
      }
      async function pin() {
        await move(true)
        await router.push('/draft/2?mode=b')
        secondary.value = true
      }
      async function restore() {
        secondary.value = false
        await nextTick()
        await router.push(saved.fullPath)
        await move(false)
      }
      return () =>
        h('div', [
          h('button', { onClick: pin }, 'Pin'),
          h('button', { onClick: restore }, 'Restore'),
          h(
            'button',
            { onClick: () => router.push('/draft/3?mode=c') },
            'Navigate main'
          ),
          h('output', { id: 'guards' }),
          h('div', { id: 'main', ref: main }),
          h('div', { id: 'window', ref: window }),
          main.value && window.value
            ? h(Teleport, { to: pinned.value ? window.value : main.value }, [
                h(RouterView, {
                  route: saved,
                  detached: pinned.value,
                  cacheComponentName: 'fullPath',
                }),
              ])
            : null,
          secondary.value ? h('div', { id: 'primary' }, [h(RouterView)]) : null,
        ])
    },
  })
)
  .use(router)
  .mount('#app')
