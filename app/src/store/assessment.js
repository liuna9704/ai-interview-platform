import { defineStore } from "pinia";
import { createAssessmentSession, createAgentDecision, createInterviewAgentState, createInterviewTurnEvidence } from "@/models/assessment";
import { mockAssessmentSession } from "@/mock/assessment";

const STORAGE_KEY = "ai-interview-assessment-session-v1";

const readPersistedSession = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? createAssessmentSession(JSON.parse(raw)) : createAssessmentSession();
  } catch (error) {
    console.warn("评估会话缓存读取失败", error);
    return createAssessmentSession();
  }
};

export const useAssessmentStore = defineStore("assessment", {
  state: () => ({ session: readPersistedSession() }),
  getters: {
    assessmentId: (state) => state.session.assessmentId,
    competencyModel: (state) => state.session.competencyModel,
    agentState: (state) => state.session.agentState,
    report: (state) => state.session.report,
  },
  actions: {
    persist() {
      this.session.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.session));
    },
    createAssessment(payload = {}) {
      this.session = createAssessmentSession(payload);
      this.persist();
      return this.session;
    },
    loadDemoAssessment() {
      this.session = createAssessmentSession(JSON.parse(JSON.stringify(mockAssessmentSession)));
      this.persist();
      return this.session;
    },
    setResumeProfile(profile) { this.session.resumeProfile = profile || {}; this.persist(); },
    setJobProfile(profile) { this.session.jobProfile = profile || {}; this.persist(); },
    setCompetencyModel(model) { this.session.competencyModel = model || []; this.persist(); },
    setMatchResult(result) { this.session.matchResult = result || null; this.persist(); },
    setInterviewPlan(plan) { this.session.interviewPlan = plan || {}; this.persist(); },
    addMessage(message) { this.session.messages.push({ id: `msg-${Date.now()}`, createdAt: new Date().toISOString(), ...message }); this.persist(); },
    addEvidence(item) { this.session.evidence.push({ id: `evidence-${Date.now()}`, ...item }); this.persist(); },
    addInterviewMessage(message) {
      this.session.messages.push({ id: `interview-msg-${Date.now()}`, role: message.role, content: message.content, time: message.time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) });
      this.persist();
    },
    addInterviewEvidence(item) {
      const evidence = createInterviewTurnEvidence({ id: item.id || `turn-evidence-${Date.now()}`, ...item });
      this.session.interviewTurnEvidence.push(evidence);
      this.session.evidence.push({ id: evidence.id, competencyId: evidence.competencyId, source: "interview", content: evidence.evidenceContent, relatedQuestion: evidence.question, strength: evidence.evidenceStrength, confidence: evidence.confidence, supportType: evidence.risk ? "risk" : "support" });
      this.persist();
      return evidence;
    },
    updateCompetencyProgress({ competencyId, scoreChange = 0 }) {
      const competency = this.session.competencyModel.find((item) => item.id === competencyId);
      if (competency) {
        competency.score = Math.max(0, Math.min(100, competency.score + Number(scoreChange)));
        competency.evidenceCount += 1;
        competency.status = competency.score >= competency.targetScore ? "qualified" : "evaluating";
      }
      const coveredIds = new Set(this.session.interviewTurnEvidence.map((item) => item.competencyId));
      const total = this.session.competencyModel.length || 1;
      this.session.coverage = Math.round((coveredIds.size / total) * 100);
      this.session.dimensionScores = this.session.competencyModel.map(({ id, name, score, targetScore, weight }) => ({ id, name, score, targetScore, weight }));
      this.persist();
    },
    updateAgentDecision({ decision, currentCompetency, currentStage, questionType, latestAnalysis }) {
      this.session.agentState = createInterviewAgentState({ ...this.session.agentState, currentStage, currentCompetency, questionType, latestAnalysis, coverage: this.session.coverage, coveredCompetencyCount: new Set(this.session.interviewTurnEvidence.map((item) => item.competencyId)).size, followUpReason: decision?.reason || "", decision: createAgentDecision(decision) });
      this.persist();
    },
    setAgentState(state) { this.session.agentState = createInterviewAgentState({ ...this.session.agentState, ...state }); this.session.coverage = this.session.agentState.coverage; this.persist(); },
    setReport(report) { this.session.report = report; this.session.status = "completed"; this.persist(); },
    clearAssessment() { this.session = createAssessmentSession(); localStorage.removeItem(STORAGE_KEY); },
  },
});
