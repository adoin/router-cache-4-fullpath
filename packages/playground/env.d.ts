/// <reference types="vite/client" />
/// <reference path="../router/src/global.d.ts" />

declare module '*.vue' {
  import type { Component } from 'vue'
  var component: Component
  export default component
}
