/**
 * 统一运行时配置
 *
 * 所有可变配置都从 Vue CLI 环境变量读取（VUE_APP_ 前缀），
 * 详见根目录 .env.example 与 README 的「环境变量」章节。
 *
 * ⚠️ 安全须知（务必阅读）
 *   VUE_APP_* 变量会在构建时被**编译进前端产物**，任何访问者都能在
 *   dist/js/*.js 里读到。因此把讯飞密钥放进环境变量，解决的只是
 *   「不把密钥提交进 Git 仓库」，并**不等于**安全。
 *   正式部署必须把讯飞签名逻辑迁移到服务端，前端只调用自己的后端。
 */

const readEnv = (key, fallback = '') => process.env[key] || fallback

/** 后端 / Mock 服务基础地址 */
export const API_BASE_URL = readEnv(
  'VUE_APP_API_BASE_URL',
  'http://127.0.0.1:4523/m1/7900134-7650835-default'
)

/**
 * 是否启用 Mock.js 请求拦截。
 * 默认：开发环境开启，生产构建关闭（避免线上拦截真实请求）。
 * 需要纯前端静态部署做演示时，可显式设置 VUE_APP_USE_MOCK=true 打开。
 */
export const USE_MOCK =
  readEnv('VUE_APP_USE_MOCK', process.env.NODE_ENV !== 'production' ? 'true' : 'false') === 'true'

/** 讯飞语音（TTS / IAT）配置 */
export const XUNFEI_CONFIG = {
  APPID: readEnv('VUE_APP_XUNFEI_APPID'),
  API_KEY: readEnv('VUE_APP_XUNFEI_API_KEY'),
  API_SECRET: readEnv('VUE_APP_XUNFEI_API_SECRET')
}

/** 讯飞配置是否已完整提供 */
export const isXunfeiConfigured = () =>
  Boolean(XUNFEI_CONFIG.APPID && XUNFEI_CONFIG.API_KEY && XUNFEI_CONFIG.API_SECRET)

/** 未配置讯飞时给出一致的提示文案 */
export const XUNFEI_MISSING_TIP =
  '未配置讯飞语音密钥，语音功能不可用。请在 .env.local 中设置 VUE_APP_XUNFEI_APPID / VUE_APP_XUNFEI_API_KEY / VUE_APP_XUNFEI_API_SECRET（参见 .env.example）。'

export default {
  API_BASE_URL,
  USE_MOCK,
  XUNFEI_CONFIG,
  isXunfeiConfigured,
  XUNFEI_MISSING_TIP
}
