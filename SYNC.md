# 上游同步与包分支

- `upstream` 指向 `https://github.com/vuejs/router.git`。
- `main` 保留 `vue-router` 包身份，合并上游迭代并保留核心缓存/视图扩展。
- `package-try` 从 main 合并，保留 `vue-smart-router` 包身份、入口文件名、内部模块引用和发布配置。
- 继续复用这两条分支，不为同步或打包创建替代分支。

## 同步顺序

1. 确认工作树干净，fetch upstream 与 origin。
2. 在 main 合并选定的上游提交，保留 RouterView 缓存扩展，同时保留上游新增钩子。
3. 将 main 合回 package-try，解决 package.json、构建入口、路径别名与 codegen 引用的包名冲突。
4. 新增上游文件也必须使用发布分支的模块身份；不得仅改 package.json 的 name。
5. 冻结锁文件安装依赖，运行路由单元测试、类型检查、构建及相关浏览器回归。
6. 验证打包入口后提交、推送。npm 发布单独执行，不属于代码同步。

## 当前同步基准

- 官方稳定标签：v5.4.0。
- 本次合并的上游 main：c97c8c40（包含正式版之后的修复）。
- 既有 `cacheComponentName` 保持 fullPath/path/自定义名称、独立释放及 revision 刷新契约。
- 新增独立视图契约见 `packages/router/docs/detached-route-views.md`。
- `RouterView detached` 与 DOM 容器移动是不同职责：应用始终保留同一承载树，管理 Teleport 目标、焦点、滚动容器和窗口操作。
