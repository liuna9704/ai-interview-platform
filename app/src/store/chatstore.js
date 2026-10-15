import { defineStore } from "pinia";
import { API_BASE_URL } from "@/config";

export const useChatStore = defineStore("chat", {
  state: () => ({
    currentSession: null, // 当前对话（首页创建的存在这里）
    sessionList: [], // 历史列表
    // 接口基础地址：从环境变量读取
    baseUrl: API_BASE_URL,
  }),
  getters: {
    // 只从 localStorage 读取 token；不再内置兜底 JWT
    token() {
      return localStorage.getItem("token") || "";
    },

    apiConfig(state) {
      const base = `${state.baseUrl}/user/aiCoach`;

      return {
        LIST: `${base}/list`,
        CREATE: `${base}/create`,
        ANSWER: `${base}/answer`,
        RESUME: `${base}/resume`,
        HISTORY: `${base}/history`,
      };
    },
  },
  actions: {
    // 保存当前对话
    setCurrentSession(session) {
      this.currentSession = session;
    },

    // 保存列表
    setSessionList(list) {
      this.sessionList = list;
    },
  },
});
