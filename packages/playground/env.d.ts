/// <reference types="vite/client" />
/// <reference path="vue-smart-router/global.d.ts"/>

declare module '*.vue' {
  import type { Component } from 'vue'
  var component: Component
  export default component
}
