<script lang="ts" setup>
import SemVerInfo from '@/components/SemVerInfo.vue'
import { SemVer } from 'semver'
import { useRoute } from 'vue-smart-router'

const route = useRoute()
</script>

<template>
  <h2>
    {{ route.params.org ? `@${route.params.org}/` : ''
    }}{{ route.params.pkgName }}
  </h2>
  <h3>Version Range (param parser)</h3>

  <template v-if="route.params.pkgVersion instanceof SemVer">
    <SemVerInfo :version="route.params.pkgVersion" />
  </template>
  <template v-else>
    <dl>
      <dt>Range</dt>
      <dd>
        <code>{{ route.params.pkgVersion.range }}</code>
      </dd>

      <dt>Formatted</dt>
      <dd>
        <code>{{ route.params.pkgVersion.format() }}</code>
      </dd>
    </dl>
  </template>
</template>
