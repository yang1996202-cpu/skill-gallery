/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// import.meta.dirname 类型扩展
interface ImportMeta {
  dirname: string
}

// Vite 构建时注入的构建时间
declare const __BUILD_TIME__: string