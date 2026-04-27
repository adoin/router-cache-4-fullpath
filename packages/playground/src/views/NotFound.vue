<template>
  <div>Not Found: {{ route.fullPath }}</div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-smart-router'

const route = useRoute()
</script>
