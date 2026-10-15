// 全局抑制 ResizeObserver 循环警告
const observer = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends observer {
  constructor(callback) {
    super((entries, observer) => {
      // 用 requestAnimationFrame 包裹，避免同步循环
      requestAnimationFrame(() => callback(entries, observer));
    });
  }
};

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from '@/router'

// 导入 Element Plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

// Mock 数据拦截：仅开发环境或显式开启时加载。
// 这里用 process.env.NODE_ENV 做**静态**判断，生产构建时该分支会被
// 完整移除，mockjs 不会被一起打进产物（旧代码无条件 import，导致
// 线上请求被 Mock 拦截）。
if (process.env.NODE_ENV !== "production" || process.env.VUE_APP_USE_MOCK === "true") {
  require("./mock/index.js");
}

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
