<script setup lang="ts">
import { useRoute } from 'vue-x-router'

const route = useRoute()
</script>

<template>
  <h2>{{ route.path }}</h2>
</template>
