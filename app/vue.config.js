const { defineConfig } = require('@vue/cli-service')

// 后端 / Mock 服务地址，与 src/config/index.js 保持一致，可通过环境变量覆盖
const API_BASE_URL =
  process.env.VUE_APP_API_BASE_URL || 'http://127.0.0.1:4523/m1/7900134-7650835-default'

module.exports = defineConfig({
  // 关闭 ESLint 检查
  lintOnSave: false,
  transpileDependencies: true,

  // 接口代理配置
  devServer: {
    proxy: {
      '/admin': {
        target: API_BASE_URL,
        changeOrigin: true
      }
      // 注意：/api 请求由 Mock.js 拦截，不走代理
    }
  }
})
