import { assessmentMockService } from "@/mock/assessment";

export const parseJob = async (content) => ({
  jobProfile: await assessmentMockService.parseJob(content),
  competencyModel: (await assessmentMockService.match()).competencyModel,
});
export const getJobTemplates = () => Promise.resolve([
  { id: "JOB-AI-APP-001", name: "AI应用开发工程师", description: "负责 AI 应用交互、大模型能力接入及服务端接口联调。" },
  { id: "JOB-FRONTEND-001", name: "前端开发工程师", description: "负责 Web 产品开发、工程化建设与体验优化。" },
]);
export const analyzeJobMatch = (payload) => assessmentMockService.match(payload);
