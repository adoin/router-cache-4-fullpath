# Detached route views / 独立路由视图

## English

Use `<RouterView :route="pageRoute" detached>` for a secondary page that stays
visible while the URL navigates elsewhere. Resolve and, for lazy components,
`await loadRouteLocation(router.resolve(path))` before displaying the route.
Descendant `useRoute()`, route props, nested views and link active classes use
the supplied route. `$route`, `useRouter().currentRoute`, `router.push()` and
relative navigation still use the browser's current route, as documented by
the upstream RouterView route-prop contract.

`detached` is an optional boolean (false by default), inherited by nested
RouterViews. A detached subtree does not register its page instances in the
shared route record and does not participate in URL navigation's component
leave/update guards (including Composition API guards). It does not invoke
`beforeRouteEnter` instance callbacks. Global router guards still apply to
`router.push()`. Closing a detached page does not run navigation guards: the
application must implement its own unsaved-changes confirmation.

Keep one primary, non-detached view for each route depth and view name. Other
simultaneously displayed instances of the same record must be detached. Turning
`detached` off registers that page as the primary view again. First navigate
successfully to its saved route, then restore it; aborted navigation must leave
the page detached. Detaching is not a navigation or a cache refresh.

For state-preserving placement changes, keep the same RouterView, component
ancestry and cache key mounted, and move its content with a stable Teleport:

```vue
<Teleport :to="pinned ? windowBody : mainBody">
  <RouterView
    :route="pageRoute"
    :detached="pinned"
    :cache-component-name="cacheName"
  />
</Teleport>
```

Both targets must exist before moving. Do not replace this with two conditional
RouterViews: those create different component instances. DOM relocation can
affect native focus and layout; the application owns focus restoration and
container measurements. Native DOM relocation can reset scroll offsets even
inside the moved subtree. Save relevant scroll positions before changing the
target and restore them after `nextTick()`; handle external scroll containers
as well. The executable example in `e2e/detached-view` demonstrates this.

`cacheComponentName` retains its existing fullPath/path/custom-key contract.
Remove a closed page from KeepAlive's include list; change its revision key
only for an explicit refresh. A detached view is not a separate router: links
and `router.push()` still navigate the main URL. Window-local navigation needs
an application policy. No page data, layouts or inputs are persisted on reload.

## 中文

`<RouterView :route="pageRoute" detached>` 用于主 URL 导航时仍需保留的独立页面。
先解析路由；懒加载页面先执行 `await loadRouteLocation(router.resolve(path))`。
后代 `useRoute()`、路由 props、嵌套 RouterView 和链接激活状态使用传入的路由。
`$route`、`useRouter().currentRoute`、`router.push()` 与相对导航仍按浏览器当前路由工作。

`detached` 是可选布尔值，默认为 false，并由嵌套 RouterView 继承。
独立视图不向共享路由记录登记页面实例，不参与 URL 导航的组件离开/更新守卫
（包括 Composition API 守卫），也不执行 `beforeRouteEnter` 的实例回调。
通过 `router.push()` 发起导航仍执行全局守卫。关闭窗口不会执行导航守卫，
应用需要自行处理未保存内容的确认。

同一路由深度和视图名称只保留一个参与主路由导航的视图，其余同时显示的页面使用
`detached`。恢复时先成功导航到该页面保存的路由，再取消 detached；导航被阻止时继续
保留独立视图。固定或恢复不应触发刷新，也不应修改缓存 revision。

上面的 Teleport 示例始终保留同一个 RouterView、组件层级和缓存 key，只改变 DOM
呈现位置。两个目标容器应提前存在。用两个条件分支分别创建 RouterView 会产生不同实例。
DOM 移动后的焦点恢复和容器测量由应用负责。即使滚动容器随页面一起移动，浏览器也可能
重置滚动位置；移动前记录需要保留的滚动位置，切换目标后等待 `nextTick()` 再恢复，
外部滚动容器也需要处理。可运行的 `e2e/detached-view` 示例包含该步骤。

`cacheComponentName` 继续支持 fullPath、path 和自定义缓存名称。
关闭时从 KeepAlive include 中移除对应名称，只有显式刷新才改变 revision。
独立视图仍共享主 router，窗口内导航策略由应用决定；本机制不提供浏览器刷新后的输入或布局持久化。
