# vue-smart-router

[![npm version](https://img.shields.io/npm/v/vue-smart-router.svg)](https://www.npmjs.com/package/vue-smart-router)
[![license](https://img.shields.io/npm/l/vue-smart-router.svg)](https://github.com/adoin/router-cache-4-fullpath/blob/package-try/LICENSE)

`vue-smart-router` 是一个保持跟进 Vue Router 上游版本的增强分支，面向需要“多标签页 + KeepAlive 独立缓存”的 Vue 3 应用。

它保留 Vue Router 的现有 API，并为 `<router-view>` 增加 `cacheComponentName`：同一个路由页面可以根据 `fullPath`、`path` 或业务键生成不同的组件名，从而让 `<keep-alive :include>` 精确管理每个页面实例。

## 解决什么问题

Vue 的 `<keep-alive>` 使用组件的 `name` 匹配 `include` 和 `exclude`。当多个标签页使用同一个页面组件、仅路由参数不同时，它们仍然共享同一个组件名，例如：

```text
/orders/1001  -> OrderDetail
/orders/1002  -> OrderDetail
```

这会导致标签栏无法只移除其中一个页面的缓存。

启用 `cacheComponentName="fullPath"` 后，RouterView 会在真实页面组件外创建一个稳定的命名壳：

```text
/orders/1001  -> shell name: /orders/1001
/orders/1002  -> shell name: /orders/1002
```

`include` 因此可以分别保留或释放两个页面。真实路由组件上的 `ref`、导航守卫和 `matched.instances` 行为保持不变。

## 安装

```bash
pnpm add vue-smart-router
```

也可以使用 npm 或 yarn：

```bash
npm install vue-smart-router
# 或
yarn add vue-smart-router
```

如果项目原来使用 `vue-router`，请把依赖和导入路径替换为 `vue-smart-router`：

```ts
// 修改前
import { createRouter, createWebHistory } from 'vue-router'

// 修改后
import { createRouter, createWebHistory } from 'vue-smart-router'
```

子路径导入同样需要替换，例如：

```ts
import VueRouter from 'vue-smart-router/vite'
import { routes } from 'vue-smart-router/auto-routes'
```

## 按 fullPath 缓存

适合每个标签页已经保存完整 URL 的场景：

```vue
<template>
  <router-view v-slot="{ Component }" cache-component-name="fullPath">
    <keep-alive :include="cachedFullPaths">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const openTabs = ref([
  { fullPath: '/orders/1001' },
  { fullPath: '/orders/1002?from=list' },
])

const cachedFullPaths = computed(() => openTabs.value.map(tab => tab.fullPath))
</script>
```

关闭标签页时，从 `openTabs` 中删除对应项。`include` 更新后，KeepAlive 会释放对应壳组件和页面实例。

## 按 path 缓存

不希望查询参数和 hash 影响缓存身份时，可以使用 `path`：

```vue
<router-view v-slot="{ Component }" cache-component-name="path">
  <keep-alive :include="cachedPaths">
    <component :is="Component" />
  </keep-alive>
</router-view>
```

此时 `/orders/1001?tab=base` 和 `/orders/1001?tab=history` 使用相同的缓存名 `/orders/1001`。

## 使用业务缓存键

复杂标签栏推荐传入函数，只为需要多开的页面生成缓存名：

```vue
<template>
  <router-view v-slot="{ Component }" :cache-component-name="getRouteCacheName">
    <keep-alive :include="openTabCacheNames">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-smart-router'

const openTabs = ref([{ orderId: '1001' }, { orderId: '1002' }])

const openTabCacheNames = computed(() =>
  openTabs.value.map(tab => `OrderDetail-${tab.orderId}`)
)

function getRouteCacheName(route: RouteLocationNormalizedLoaded) {
  if (route.name !== 'OrderDetail') return undefined

  const orderId = route.params.orderId
  return orderId == null ? undefined : `OrderDetail-${String(orderId)}`
}
</script>
```

函数返回 `null`、`undefined` 或空字符串时，不会添加缓存壳，行为与普通 RouterView 一致。

## API

`cacheComponentName` 是 `<router-view>` 的可选 prop：

| 值                                       | 生成的缓存组件名                     |
| ---------------------------------------- | ------------------------------------ |
| `'fullPath'`                             | `route.fullPath`，包含 query 和 hash |
| `'path'`                                 | `route.path`，不包含 query 和 hash   |
| `(route) => string \| null \| undefined` | 由业务决定；返回空值时禁用缓存壳     |

相同字符串键只创建一个组件类型，以保证 KeepAlive 身份稳定。

## 使用注意

- `include` 中的值必须与 `cacheComponentName` 最终生成的字符串完全一致。
- 使用 `fullPath` 时，query 顺序、编码和 hash 都属于缓存名的一部分。
- 关闭标签页时，应同步从 `include` 列表移除缓存名。
- 内部会保存出现过的缓存壳类型。对于可能产生大量不重复键的系统，建议限制同时打开的标签页数量。
- 本包不能与 `vue-router` 同时作为同一应用的路由实例来源；迁移时应统一依赖和 import。

更完整的说明见 [`cacheComponentName` 文档](https://github.com/adoin/router-cache-4-fullpath/blob/package-try/packages/router/docs/cache-component-name.md)。

## 分支与版本

- `main`：同步上游代码，只保留本项目的核心缓存功能，便于持续比较差异。
- `package-try`：在 `main` 基础上应用 `vue-smart-router` 包名和发布配置。
- 包版本尽量与对应的 Vue Router 上游版本保持一致。

当前版本基于 Vue Router `5.3.1`。上游项目：[vuejs/router](https://github.com/vuejs/router)。

## License

[MIT](https://github.com/adoin/router-cache-4-fullpath/blob/package-try/LICENSE)。本项目基于 Vue Router 修改，保留原项目版权与许可声明。
