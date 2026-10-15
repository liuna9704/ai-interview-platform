# AI 面试与岗位胜任力智能评估平台（前端）

<p>
  <img alt="Vue" src="https://img.shields.io/badge/Vue-3-42b883">
  <img alt="Element Plus" src="https://img.shields.io/badge/Element%20Plus-2-409eff">
  <img alt="Pinia" src="https://img.shields.io/badge/Pinia-3-ffd859">
  <img alt="ECharts" src="https://img.shields.io/badge/ECharts-6-aa344d">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-blue">
</p>

基于 Vue 3 的 AI 面试与胜任力评估系统前端。把传统「AI 聊天面试」升级为
**「岗位胜任力智能评估」**：从简历解析、岗位建模、人岗匹配，到多轮 AI 模拟面试
与可解释的能力报告，形成完整闭环。

> **本项目为纯前端项目**：所有接口由 Mock.js 在浏览器内拦截，
> 无需任何后端即可运行完整演示。

---

## 功能

| 模块 | 说明 |
| --- | --- |
| 简历解析 | 上传简历，输出结构化候选人画像 |
| 岗位建模 | 解析 JD，生成岗位胜任力模型与目标线 |
| 人岗匹配 | 匹配度计算、核心优势与用人风险 |
| AI 模拟面试 | 多轮追问、智能体状态面板、语音合成与识别（讯飞） |
| 能力报告 | 动态胜任力雷达、证据矩阵、评分可解释性 |
| 成长计划 | 基于能力短板生成针对性提升建议 |
| 题库 / 速记卡 | 题目管理、审核、速记卡创建与练习 |
| AI 教练 | 多轮对话式求职辅导 |

## 技术栈

Vue 3 · Vue Router 4 · Pinia · Element Plus · ECharts · Axios · Mock.js · Vue CLI 5

## 快速开始

```bash
git clone https://github.com/liuna9704/ai-interview-platform.git
cd ai-interview-platform/app
npm install
npm run serve
```

浏览器打开 <http://localhost:8080>。接口全部由 Mock 提供，演示无需后端。

### 生产构建

```bash
cd app
npm run build
```

产物输出到 `app/dist`。

## 环境变量

复制示例文件并填写：

```bash
cd app
cp .env.example .env.local        # Windows: copy .env.example .env.local
```

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `VUE_APP_API_BASE_URL` | 后端 / Mock 服务地址 | Apifox Mock 地址 |
| `VUE_APP_USE_MOCK` | 是否启用 Mock.js 拦截 | 开发 `true`，生产 `false` |
| `VUE_APP_XUNFEI_APPID` | 讯飞 APPID | 空（语音功能自动禁用并提示） |
| `VUE_APP_XUNFEI_API_KEY` | 讯飞 APIKey | 空 |
| `VUE_APP_XUNFEI_API_SECRET` | 讯飞 APISecret | 空 |

### ⚠️ 关于密钥安全

`VUE_APP_*` 变量会在构建时被**明文编译进 `dist/js/*.js`**，任何访问者都能读取。
把密钥从源码移到环境变量，只解决了「不提交进 Git 仓库」，**并不等于安全**。

本项目已通过环境变量隔离密钥，但这仅适用于本地演示。
**正式上线必须把讯飞签名逻辑迁移到服务端**，前端只调用自己的后端接口。

## 项目结构

```text
.
├── LICENSE
├── README.md
├── .gitignore
└── app/                          # 前端工程
    ├── .env.example              # 环境变量模板
    ├── .env.production           # 生产构建配置（显式开启 Mock 以支持静态部署）
    ├── package.json
    ├── vue.config.js
    ├── public/
    └── src/
        ├── api/                  # 接口封装（Axios 实例 + 领域 API）
        ├── components/           # 公共组件（competency / interview / report）
        ├── config/               # 统一运行时配置（环境变量收口）
        ├── mock/                 # Mock.js 接口与演示数据
        ├── models/               # 评估领域数据模型
        ├── pages/                # 业务页面（目录/index.vue）
        ├── router/               # 路由与登录守卫
        ├── store/                # Pinia 状态管理
        ├── App.vue
        └── main.js
```

## 路由一览

| 路径 | 页面 |
| --- | --- |
| `/login` | 登录 / 注册 |
| `/home` | 管理首页（数据看板） |
| `/user-home` | 用户首页 |
| `/resume` | 简历管理 |
| `/question` | 题库 |
| `/user-question` | 速记卡 |
| `/aicoachhome` `/aichat` | AI 教练 |
| `/resume-analysis` | 简历解析 |
| `/job-analysis` | 岗位分析 |
| `/job-match` | 人岗匹配 |
| `/assessment-plan` | 评估计划 |
| `/assessment-history` | 评估历史 |
| `/preparation` `/interview` `/report` | 面试准备 / 面试执行 / 能力报告 |
| `/growth-plan` | 成长计划 |
| `/user` | 个人中心 |

## 已知限制

- **无独立后端**：所有接口由 Mock.js 提供，数据存于内存，刷新即重置。
- **讯飞密钥在前端**：仅用于本地演示，生产环境需迁移至服务端签名。
- **Mock 默认进入生产包**：见 `app/.env.production`，接入真实后端后请关闭。
- **路由守卫较弱**：仅校验 token 是否存在，缺少角色与过期时间校验。
- **未做代码分割优化**：Element Plus 与 ECharts 为全量引入，vendor 包约 2.9 MB（gzip 约 950 KB）。
- **无自动化测试与 CI**。

## 后续计划

- [ ] 接入真实后端，替换 Mock API
- [ ] 讯飞签名迁移至服务端
- [ ] Element Plus / ECharts 按需引入，优化包体积
- [ ] 路由权限精细化（角色、token 过期）
- [ ] 补充单元测试与 CI

## License

[MIT](LICENSE)
