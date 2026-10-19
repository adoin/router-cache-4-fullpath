/** @vitest-environment happy-dom */
import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import {
  defineComponent,
  h,
  shallowRef,
  nextTick,
  Teleport,
  KeepAlive,
  getCurrentInstance,
  onMounted,
  onUnmounted,
} from 'vue'
import {
  createRouter,
  createMemoryHistory,
  RouterView,
  useRoute,
  loadRouteLocation,
  onBeforeRouteLeave,
  onBeforeRouteUpdate,
} from '../src'

describe('detached route views', () => {
  it('keeps multiple pinned routes independent and cleans up exposed instances safely', async () => {
    const leave = vi.fn()
    const Page = defineComponent({
      setup(_, { expose }) {
        const route = useRoute()
        expose({ page: route.params.id })
        onBeforeRouteLeave(() => leave(route.params.id))
        return () => h('p', `${route.params.id}:${route.query.mode}`)
      },
    })
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/draft/:id', component: Page },
        { path: '/other', component: { render: () => h('div') } },
      ],
    })
    await router.push('/draft/3?mode=c')
    const one = await loadRouteLocation(router.resolve('/draft/1?mode=a'))
    const two = await loadRouteLocation(router.resolve('/draft/2?mode=b'))
    const show = shallowRef(true)
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h('div', [
            show.value ? h(RouterView) : null,
            h(RouterView, { route: one, detached: true }),
            h(RouterView, { route: two, detached: true }),
          ]),
      }),
      { global: { plugins: [router] } }
    )
    await flushPromises()
    expect(wrapper.findAll('p').map(p => p.text())).toEqual([
      '3:c',
      '1:a',
      '2:b',
    ])
    expect(one.matched[0].instances.default).toEqual({ page: '3' })
    show.value = false
    await nextTick()
    expect(one.matched[0].instances.default).toBeNull()
    await router.push('/other')
    expect(leave).not.toHaveBeenCalled()
    expect(wrapper.findAll('p').map(p => p.text())).toEqual(['1:a', '2:b'])
    wrapper.unmount()
  })
  it('moves the same page between containers and isolates routes, instances and guards', async () => {
    const mounted = vi.fn(),
      unmounted = vi.fn()
    const leave = vi.fn(),
      update = vi.fn(),
      optionLeave = vi.fn()
    const Page = defineComponent({
      beforeRouteLeave: optionLeave,
      setup() {
        const route = useRoute()
        const uid = getCurrentInstance()!.uid
        const input = shallowRef('')
        onMounted(mounted)
        onUnmounted(unmounted)
        onBeforeRouteLeave(() => leave(route.params.id))
        onBeforeRouteUpdate(() => update(route.params.id))
        return () =>
          h('section', { 'data-id': route.params.id, 'data-uid': uid }, [
            h('span', `${route.params.id}:${route.query.mode}`),
            h('input', {
              value: input.value,
              onInput: (e: Event) => {
                input.value = (e.target as HTMLInputElement).value
              },
            }),
          ])
      },
    })
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/draft/:id', component: Page },
        { path: '/other', component: { render: () => h('div', 'other') } },
      ],
    })
    await router.push('/draft/1?mode=a')
    const saved = router.currentRoute.value
    const pinned = shallowRef(false),
      secondary = shallowRef(false)
    const main = document.createElement('div'),
      window = document.createElement('div')
    document.body.append(main, window)
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h('div', [
            h(Teleport, { to: pinned.value ? window : main }, [
              h(RouterView, {
                route: saved,
                detached: pinned.value,
                cacheComponentName: 'fullPath',
              }),
            ]),
            secondary.value ? h(RouterView) : null,
          ]),
      }),
      { global: { plugins: [router] }, attachTo: document.body }
    )
    try {
      await flushPromises()
      const page = main.querySelector('section')!
      const uid = page.getAttribute('data-uid')
      const input = main.querySelector('input')!
      input.value = 'unsaved text'
      input.dispatchEvent(new Event('input', { bubbles: true }))
      page.scrollTop = 73
      pinned.value = true
      await nextTick()
      await router.push('/draft/2?mode=b')
      secondary.value = true
      await flushPromises()
      expect(window.querySelector('section')).toBe(page)
      expect(window.textContent).toBe('1:a')
      expect(window.querySelector('input')!.value).toBe('unsaved text')
      expect(page.scrollTop).toBe(73)
      expect(wrapper.text()).toBe('2:b')
      expect(update).not.toHaveBeenCalled()
      expect(leave).not.toHaveBeenCalled()
      const record = saved.matched[0]
      const primary = record.instances.default
      expect(primary).toBeTruthy()
      await router.push('/other')
      await flushPromises()
      expect(leave).toHaveBeenCalledExactlyOnceWith('2')
      expect(optionLeave).toHaveBeenCalledTimes(1)
      expect(window.textContent).toBe('1:a')

      secondary.value = false
      await nextTick()
      await router.push(saved.fullPath)
      pinned.value = false
      await nextTick()
      expect(main.querySelector('section')).toBe(page)
      expect(page.getAttribute('data-uid')).toBe(uid)
      expect(main.querySelector('input')!.value).toBe('unsaved text')
      expect(mounted).toHaveBeenCalledTimes(2)
      expect(record.instances.default).toBeTruthy()
      await router.push('/other')
      expect(leave).toHaveBeenLastCalledWith('1')
      expect(optionLeave).toHaveBeenCalledTimes(2)
    } finally {
      wrapper.unmount()
      main.remove()
      window.remove()
    }
    expect(unmounted).toHaveBeenCalledTimes(2)
  })

  it('inherits detachment through nested views and does not clear another view on unmount', async () => {
    const leave = vi.fn()
    const Child = defineComponent({
      setup() {
        onBeforeRouteLeave(leave)
        const route = useRoute()
        return () => h('div', route.fullPath)
      },
    })
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/parent',
          component: { render: () => h(RouterView) },
          children: [{ path: ':id', component: Child }],
        },
        { path: '/other', component: { render: () => h('div') } },
      ],
    })
    await router.push('/parent/1')
    const saved = router.currentRoute.value
    const show = shallowRef(true)
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h('div', [
            h(RouterView),
            show.value ? h(RouterView, { route: saved, detached: true }) : null,
          ]),
      }),
      { global: { plugins: [router] } }
    )
    await flushPromises()
    const records = saved.matched
    const primary = records.map(r => r.instances.default)
    expect(records[1].leaveGuards.size).toBe(1)
    show.value = false
    await nextTick()
    expect(records.map(r => r.instances.default)).toEqual(primary)
    await router.push('/other')
    expect(leave).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })

  it('keeps per-fullPath cached inputs, evicts only closed pages, and refreshes revisions', async () => {
    const mounted = vi.fn(),
      unmounted = vi.fn()
    const Page = defineComponent({
      setup() {
        const input = shallowRef('')
        onMounted(mounted)
        onUnmounted(unmounted)
        return () =>
          h('input', {
            value: input.value,
            onInput: (e: Event) => {
              input.value = (e.target as HTMLInputElement).value
            },
          })
      },
    })
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/draft/:id', component: Page }],
    })
    const names = shallowRef(['/draft/1::0', '/draft/2::0'])
    const revision = shallowRef(0)
    await router.push('/draft/1')
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(
            RouterView,
            {
              cacheComponentName: route =>
                `${route.fullPath}::${revision.value}`,
            },
            {
              default: ({ Component }: { Component: ReturnType<typeof h> }) =>
                h(
                  KeepAlive,
                  { include: names.value },
                  { default: () => Component }
                ),
            }
          ),
      }),
      { global: { plugins: [router] } }
    )
    await flushPromises()
    await wrapper.get('input').setValue('first')
    await router.push('/draft/2')
    await flushPromises()
    await wrapper.get('input').setValue('second')
    await router.push('/draft/1')
    await flushPromises()
    expect(wrapper.get('input').element.value).toBe('first')
    names.value = ['/draft/1::0']
    await nextTick()
    expect(unmounted).toHaveBeenCalledTimes(1)
    revision.value++
    names.value = ['/draft/1::1']
    await nextTick()
    expect(wrapper.get('input').element.value).toBe('')
    expect(mounted).toHaveBeenCalledTimes(3)
    expect(unmounted).toHaveBeenCalledTimes(2)
    wrapper.unmount()
  })
})
