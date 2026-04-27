<script lang="ts" setup>
import { useRoute } from 'vue-x-router'

const route = useRoute()
</script>

<template>
  <h1>Month (valibot): {{ route.params.month }}</h1>
  <pre>typeof: {{ typeof route.params.month }}</pre>
</template>
