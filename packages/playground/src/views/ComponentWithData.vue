<template>
  <div>
    <p>Here is the data: {{ fromApi }}</p>
    other {{ other }}
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { onBeforeRouteUpdate } from 'vue-smart-router'
import { delay, getData } from '../api'

const ComponentWithData = defineComponent({
  name: 'ComponentWithData',
  async setup() {
    const data = reactive<{
      other: string
      fromApi: null | { message: string; time: number }
    }>({ other: 'old', fromApi: null })

    onBeforeRouteUpdate(async () => {
      data.fromApi = await getData()
    })

    data.fromApi = await getData()

    return {
      ...toRefs(data),
    }
  },
  async beforeRouteEnter(to, from, next) {
    console.log('this in beforeRouteEnter', this)
    await delay(300)
    next(vm => {
      console.log('got vm', vm)
      // Workaround for https://github.com/vuejs/router/issues/701
      ;(vm as InstanceType<typeof ComponentWithData>).other = 'Hola'
    })
  },
})

export default ComponentWithData
</script>
