import { assessmentMockService } from "@/mock/assessment";

export const parseResume = (file) => assessmentMockService.parseResume(file);
export const getResumeProfile = () => assessmentMockService.parseResume();
export const saveResumeProfile = (profile) => Promise.resolve({ code: 200, data: profile });
