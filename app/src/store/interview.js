import { defineStore } from "pinia";
import { API_BASE_URL, XUNFEI_CONFIG } from "@/config";

export const useInterviewStore = defineStore("interview", {
  state: () => ({
    chatId: null,
    resumeFile: null,
    jobRole: "",
    userAnswers: [],
    reportData: null,

    // 讯飞配置：从环境变量读取，不再硬编码在源码中（见 .env.example）
    xunfeiConfig: { ...XUNFEI_CONFIG },

    // 接口基础地址：从环境变量读取
    baseUrl: API_BASE_URL,
  }),

  getters: {
    // 只从 localStorage 读取 token；不再内置兜底 JWT
    token() {
      return localStorage.getItem("token") || "";
    },

    // 完整接口地址（自动拼接）
    apiConfig(state) {
      const base = `${state.baseUrl}/user/aiInter`;
      const BASE_URL = `${state.baseUrl}/user/aiSummary`;

      return {
        INTERVIEW: `${base}/getInterSummary`,
        END_INTERVIEW: `${base}/endInter`,
        startInterview: `${base}/getInter`,
        AVG_ALL: `${BASE_URL}/average`,
        AVG_PERSONAL: `${BASE_URL}/myAverage`,
      };
    },
  },

  actions: {
    setInterviewData(data) {
      this.chatId = data.chatId;
      this.resumeFile = data.resumeFile;
      this.jobRole = data.jobRole;
      this.reportData = data;
    },
  },
});
