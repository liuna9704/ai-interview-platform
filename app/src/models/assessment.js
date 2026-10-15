/**
 * 岗位胜任力评估领域模型（JavaScript 运行时工厂）。
 * 这些工厂提供稳定默认值，避免页面直接拼装不完整对象。
 */

export const ASSESSMENT_STATUS = Object.freeze({
  DRAFT: "draft",
  READY: "ready",
  INTERVIEWING: "interviewing",
  COMPLETED: "completed",
});

export const createCompetency = (data = {}) => ({
  id: data.id || "",
  name: data.name || "",
  weight: Number(data.weight ?? 0),
  score: Number(data.score ?? 0),
  targetScore: Number(data.targetScore ?? 70),
  evidenceCount: Number(data.evidenceCount ?? 0),
  status: data.status || "pending",
});

export const createEvidence = (data = {}) => ({
  id: data.id || "",
  competencyId: data.competencyId || "",
  source: data.source || "interview",
  content: data.content || "",
  relatedQuestion: data.relatedQuestion || "",
  strength: Number(data.strength ?? 0),
  confidence: Number(data.confidence ?? 0),
  supportType: data.supportType || "support",
});

export const createInterviewAgentState = (data = {}) => ({
  currentStage: data.currentStage || "preparation",
  currentCompetency: data.currentCompetency || "",
  questionType: data.questionType || "opening",
  followUpReason: data.followUpReason || "",
  coverage: Number(data.coverage ?? 0),
  coveredCompetencyCount: Number(data.coveredCompetencyCount ?? 0),
  latestAnalysis: data.latestAnalysis || "",
  decision: createAgentDecision(data.decision),
});

export const createInterviewTurnEvidence = (data = {}) => ({
  id: data.id || "",
  question: data.question || "",
  answer: data.answer || "",
  competencyId: data.competencyId || "",
  competencyName: data.competencyName || "",
  evidenceContent: data.evidenceContent || "",
  evidenceStrength: Number(data.evidenceStrength ?? 0),
  confidence: Number(data.confidence ?? 0),
  scoreChange: Number(data.scoreChange ?? 0),
  followUpNeeded: Boolean(data.followUpNeeded),
  risk: Boolean(data.risk),
  createdAt: data.createdAt || new Date().toISOString(),
});

export function createAgentDecision(data = {}) {
  return {
    action: data.action || "ask_initial",
    reason: data.reason || "",
    nextTarget: data.nextTarget || "",
  };
}

export const createAssessmentReport = (data = {}) => ({
  summary: data.summary || "",
  overallScore: Number(data.overallScore ?? 0),
  matchScore: Number(data.matchScore ?? 0),
  confidence: Number(data.confidence ?? 0),
  recommendation: data.recommendation || "待评估",
  competencyScores: Array.isArray(data.competencyScores) ? data.competencyScores : [],
  evidenceSummary: Array.isArray(data.evidenceSummary) ? data.evidenceSummary : [],
  risks: Array.isArray(data.risks) ? data.risks : [],
  growthPlan: Array.isArray(data.growthPlan) ? data.growthPlan : [],
  interviewReview: Array.isArray(data.interviewReview) ? data.interviewReview : [],
  strengths: Array.isArray(data.strengths) ? data.strengths : [],
  generatedAt: data.generatedAt || new Date().toISOString(),
  generationNote: data.generationNote || "基于简历证据、多轮面试回答和能力模型综合分析。",
});

export const createAssessmentSession = (data = {}) => ({
  assessmentId: data.assessmentId || "",
  candidate: data.candidate || {},
  resumeProfile: data.resumeProfile || {},
  jobProfile: data.jobProfile || {},
  competencyModel: (data.competencyModel || []).map(createCompetency),
  matchResult: data.matchResult || null,
  interviewPlan: data.interviewPlan || {},
  messages: Array.isArray(data.messages) ? data.messages : [],
  evidence: (data.evidence || []).map(createEvidence),
  interviewTurnEvidence: (data.interviewTurnEvidence || []).map(createInterviewTurnEvidence),
  dimensionScores: Array.isArray(data.dimensionScores) ? data.dimensionScores : [],
  coverage: Number(data.coverage ?? 0),
  agentState: createInterviewAgentState(data.agentState),
  status: data.status || ASSESSMENT_STATUS.DRAFT,
  report: data.report ? createAssessmentReport(data.report) : null,
  createdAt: data.createdAt || new Date().toISOString(),
  updatedAt: data.updatedAt || new Date().toISOString(),
});

export const cloneAssessmentSession = (session) =>
  createAssessmentSession(JSON.parse(JSON.stringify(session || {})));
