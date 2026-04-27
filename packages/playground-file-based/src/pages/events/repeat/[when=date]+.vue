<script lang="ts" setup>
import { useRoute } from 'vue-x-router'

const route = useRoute()
console.log(route.params.when)
</script>

<template>
  <h1>Date</h1>
  <pre>{{ typeof route.params.when }} - {{ route.params.when }}</pre>
</template>
