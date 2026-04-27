<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-x-router'

const route = useRoute()
const n = ref(0)
</script>

<template>
  <div class="ka-probe" data-testid="ka-probe">
    <p>
      <strong>KeepAlive 探针</strong>（<code>route.fullPath</code>：{{
        route.fullPath
      }}）
    </p>
    <p>
      计数（用于验证缓存：离开再回来应保留）:
      <span data-testid="ka-count">{{ n }}</span>
    </p>
    <p><button type="button" @click="n++">+1</button></p>
  </div>
</template>

<style scoped>
.ka-probe {
  border: 2px dashed #888;
  padding: 0.5rem 1rem;
  margin: 0.5rem 0;
}
</style>
