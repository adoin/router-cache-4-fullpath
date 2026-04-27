<script lang="ts" setup>
import { useRoute } from 'vue-smart-router'

definePage({
  meta: {
    guards: ['auth'],
  },
})

const route = useRoute()
</script>

<template>
  <h1>About page</h1>
</template>
