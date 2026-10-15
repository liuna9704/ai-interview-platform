import { assessmentMockService } from "@/mock/assessment";

export const getAssessmentReport = (assessmentId, session) => assessmentMockService.report(session || { assessmentId });
export const exportAssessmentReport = (assessmentId) => Promise.resolve({ code: 200, assessmentId });
