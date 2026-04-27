# `cacheComponentName`：用「路径/自定义键」驱动 `<keep-alive include>`

`vue-smart-router` 在 `<router-view>` 上提供可选的 **`cacheComponentName`**，在内部为当前路由页面包一层**稳定壳组件**，壳的 **组件名（`name`）** 由你指定为 `fullPath`、`path` 或**自定义函数**的返回值。

这样，`<keep-alive :include="...">` 可以按 **URL 或 `pageId`** 区分多开实例，而不是只认页面 SFC 上**同一个** `name`（与路由 `name: 'Xxx'` 容易撞名的问题）。

## 安装

本仓库发布的 npm 包名是 **`vue-smart-router`**（**不是**官方 `vue-router`），安装时不要写错包名。

```bash
# pnpm（推荐）
pnpm add vue-smart-router

# npm
npm install vue-smart-router

# yarn
yarn add vue-smart-router
```

`vue-smart-router` 与官方 `vue-router` 的 peer 要求一致，需与项目中的 **Vue 3** 版本匹配（参见包内 `peerDependencies`）。从 `vue-router` 迁到本 fork 时，请**全局**把依赖与 import 从 `vue-router` 改为 `vue-smart-router`（子路径如 `vue-smart-router/auto-routes` 同理）。

## 背景

- Vue 的 `<keep-alive>` 的 `include` / `exclude` 匹配的是**子树根组件的 `name`**，不读 `route`。
- 多 tab、同一路由、不同 `param`（如 `:pageId`）时，若页面组件名始终相同，所有实例在 KeepAlive 里会**共用一个「逻辑名」**，无法单独关掉某一页缓存，且容易**越开越卡**。
- 本功能在 **RouterView 内**为「当前要渲染的页面」外包一层，**`ref` 仍挂在真实页面组件上**（导航守卫、`matched.instances` 行为与未开启时一致）。

## API

在 `<router-view>` 上增加 prop（与 `name` / `route` 等并列）：

| 类型                                     | 含义                                             |
| ---------------------------------------- | ------------------------------------------------ |
| `'fullPath'`                             | 壳的 `name === route.fullPath`（含 query、hash） |
| `'path'`                                 | 壳的 `name === route.path`                       |
| `(route) => string \| null \| undefined` | 自定义；返回假值时不包壳（与未配置行为一致）     |

同一字符串键只会 `defineComponent` 一次并缓存在内部 `Map` 中，保证 **KeepAlive 身份稳定**。

## 基础示例（按 `fullPath` 缓存）

```vue
<template>
  <router-view v-slot="{ Component, route }" cache-component-name="fullPath">
    <keep-alive :include="allowedFullPaths">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 与「仍打开的页签」一致；关页时从数组里移除对应项，可释放该实例缓存
const allowedFullPaths = ref<string[]>(['/orders/1', '/orders/2'])
</script>
```

`include` 里的字符串需与**当前** `route.fullPath` 在规范化后**完全一致**（含查询、hash 时尤其注意）。

## 多开同一路由、按 `pageId` 区分（推荐函数）

同一 `name: 'FacebookAdEdit'`、路径 `.../facebook_ad_edit/:pageId` 时，用函数把壳名设成**每个 tab 唯一**（例如与标签栏里存的 id 一致）：

```vue
<template>
  <router-view
    v-slot="{ Component, route }"
    :cache-component-name="cacheNameForRoute"
  >
    <keep-alive :include="openTabCacheKeys">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-smart-router'

const openTabCacheKeys = computed(() =>
  /* 与业务里「未关闭的 tab」一致 */ openTabs.value.map(
    t => `FacebookAdEdit-${t.pageId}`
  )
)

function cacheNameForRoute(r: RouteLocationNormalizedLoaded) {
  if (r.name !== 'FacebookAdEdit') return undefined
  const id = r.params.pageId
  if (id == null) return undefined
  return `FacebookAdEdit-${String(id)}`
}
</script>
```

**关 tab 时**：从 `openTabs` 删掉该项 → `include` 少一个字符串 → KeepAlive 会丢掉对应壳（及内层页面）的缓存。

## 在业务里写 import

```ts
import { createRouter, useRoute, useRouter } from 'vue-smart-router'
import type { RouteLocationNormalizedLoaded } from 'vue-smart-router'
```

文件式路由、Vite 插件等子路径也一律用 **`vue-smart-router/...`**（如 `vue-smart-router/auto-routes`），与官方 `vue-router/...` 的命名对应关系以本包 `package.json` 的 `exports` 为准。

## 注意

- `fullPath` 较长或含特殊字符时，只要与 `include` 中字符串**一致**即可；若只想按 path 或只按 id，用 **`'path'`** 或**函数**更可控。
- 壳类型会在运行期按**出现过的键**增加；若长期大量打开不重复 id，内部 `Map` 会变大，通常在应用层用「tab 上限 / 关页时从 `include` 移除」即可控制。
