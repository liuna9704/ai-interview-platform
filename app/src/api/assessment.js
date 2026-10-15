import { assessmentMockService } from "@/mock/assessment";

// 当前比赛演示使用本地 Mock；接入后端时仅替换本模块实现。
export const createAssessment = (payload) => assessmentMockService.create(payload);
export const generateInterviewPlan = (payload) => assessmentMockService.plan(payload);
export const getAssessment = (assessmentId) => assessmentMockService.get(assessmentId);
export const getAssessmentHistory = () => assessmentMockService.history();
export const submitAssessmentAnswer = (payload) => Promise.resolve({ code: 200, data: payload });
export const finishAssessment = () => assessmentMockService.report();
