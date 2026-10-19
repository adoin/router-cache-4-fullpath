<script lang="ts" setup>
import { useRoute } from 'vue-smart-router'

const route = useRoute()
definePage({
  props: true,
  params: {
    path: {
      userId: 'int',
    },
  },
})

const props = defineProps()
</script>

<template>
  <h1>User by id - {{ $route.path }}</h1>
  <p>User {{ userId }}</p>

  <pre>{{ route.params }}</pre>
</template>
