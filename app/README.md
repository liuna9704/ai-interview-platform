# app —— 前端工程

本目录是 **AI 面试与岗位胜任力智能评估平台** 的 Vue 3 前端工程。

完整的项目说明、功能列表、环境变量与部署方式，请见仓库根目录的
[README.md](../README.md)。

## 常用命令

```bash
npm install        # 安装依赖
npm run serve      # 开发服务器（默认 http://localhost:8080）
npm run build      # 生产构建，产物在 dist/
npm run lint       # ESLint 检查
```

## 运行前

复制环境变量模板并按需填写（不填也能跑，语音功能会自动禁用并提示）：

```bash
cp .env.example .env.local        # Windows: copy .env.example .env.local
```

接口默认由 Mock.js 在浏览器内拦截，**无需后端即可完整演示**。
