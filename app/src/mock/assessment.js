import { createAssessmentReport, createAssessmentSession } from "@/models/assessment";

const competencyModel = [
  { id: "frontend", name: "前端工程能力", weight: 25, score: 86, targetScore: 80, evidenceCount: 3, status: "strong" },
  { id: "ai", name: "AI应用能力", weight: 25, score: 82, targetScore: 80, evidenceCount: 3, status: "qualified" },
  { id: "backend", name: "后端接口能力", weight: 15, score: 68, targetScore: 70, evidenceCount: 2, status: "gap" },
  { id: "problem", name: "问题解决能力", weight: 20, score: 84, targetScore: 75, evidenceCount: 3, status: "strong" },
  { id: "communication", name: "沟通协作能力", weight: 15, score: 78, targetScore: 75, evidenceCount: 2, status: "qualified" },
];

export const mockAssessmentSession = createAssessmentSession({
  assessmentId: "ASSESS-2026-0001",
  candidate: { id: "CAND-001", name: "林同学", education: "计算机科学与技术本科", graduationYear: 2026 },
  resumeProfile: {
    resumeId: "RESUME-001",
    summary: "计算机专业应届生，具备 Vue 3、AI 应用集成和机器人项目实践。",
    education: [{ school: "某科技大学", major: "计算机科学与技术", degree: "本科" }],
    skills: ["Vue 3", "JavaScript", "Python", "Spring Boot", "大模型 API", "机器人控制"],
    projects: [
      { name: "Vue 校园服务平台", role: "前端负责人", highlights: ["Vue 3 + Pinia", "组件化重构", "首屏性能优化 35%"] },
      { name: "AI 知识问答助手", role: "核心开发", highlights: ["RAG 检索", "流式对话", "提示词评测"] },
      { name: "智能巡检机器人", role: "软件开发", highlights: ["传感器数据接入", "路径异常排查", "团队联调"] },
    ],
    abilityEvidence: [
      { competencyId: "frontend", title: "前端工程实践", content: "负责 Vue 3 项目的组件化重构，并将首屏性能提升 35%。", confidence: 92 },
      { competencyId: "ai", title: "AI 应用落地", content: "完成 RAG 检索、流式对话和提示词评测闭环。", confidence: 88 },
      { competencyId: "problem", title: "复杂问题排查", content: "在机器人项目中完成路径异常定位和跨模块联调。", confidence: 84 },
    ],
    completeness: 92,
  },
  jobProfile: {
    jobId: "JOB-AI-APP-001",
    name: "AI应用开发工程师",
    level: "初级",
    responsibilities: ["开发 AI 应用前端与交互", "接入大模型及企业 API", "参与服务端接口开发与联调"],
    requirements: ["熟悉 Vue/React", "掌握大模型 API 与提示词设计", "具备基本后端接口能力", "良好的问题分析和沟通能力"],
    experienceRequirements: ["本科及以上学历，计算机相关专业", "有至少 1 个完整 AI 应用或前端工程项目", "具备 API 联调和团队协作经验"],
  },
  competencyModel,
  matchResult: {
    score: 83,
    recommendation: "较高匹配",
    strengths: ["Vue 3 工程实践完整", "具备 RAG 应用落地与评测意识", "项目中展现了结构化问题定位能力"],
    risks: ["生产级后端接口治理经验不足", "项目规模和高并发实践仍需验证"],
    gaps: ["鉴权、限流与可观测性", "大型团队协作和复杂需求拆解"],
    verificationItems: ["追问 RAG 评测集的设计与指标选择", "验证 Vue 性能优化的具体测量方法", "通过接口异常场景考察后端可靠性意识", "用 STAR 方法验证机器人项目中的协作贡献"],
  },
  interviewPlan: {
    mode: "standard",
    objective: "岗位胜任力评估",
    estimatedMinutes: 15,
    totalQuestions: 8,
    strategy: "STAR 行为面试 + 技术深挖 + 项目追问，优先验证 AI 应用深度与后端接口短板。",
    strategies: ["STAR 行为面试", "技术深挖", "项目追问"],
    followUpExamples: ["当时的具体任务和约束是什么？", "你个人采取了哪些关键行动？", "结果如何量化，遇到失败时怎样调整？"],
    stages: [
      { id: "opening", name: "背景确认", questionCount: 1 },
      { id: "core", name: "核心能力验证", questionCount: 5 },
      { id: "gap", name: "短板与反证", questionCount: 1 },
      { id: "closing", name: "总结反思", questionCount: 1 },
    ],
  },
  messages: [
    { id: "m1", role: "assistant", content: "请介绍你在 AI 知识问答助手中承担的核心职责。", competencyId: "ai" },
    { id: "m2", role: "user", content: "我负责 RAG 检索链路、流式回答以及提示词评测。", competencyId: "ai" },
    { id: "m3", role: "assistant", content: "检索结果不稳定时，你如何定位并改善问题？", competencyId: "problem" },
    { id: "m4", role: "user", content: "我拆分召回、排序和生成三个阶段建立评测集，将命中率从 71% 提升到 86%。", competencyId: "problem" },
  ],
  evidence: [
    { id: "e1", competencyId: "frontend", source: "resume", content: "担任 Vue 校园服务平台前端负责人，完成组件化重构。", relatedQuestion: "", strength: 86, confidence: 90, supportType: "support" },
    { id: "e2", competencyId: "ai", source: "resume", content: "独立完成 RAG 检索、流式回答和提示词评测模块。", relatedQuestion: "AI项目中承担的核心职责是什么？", strength: 82, confidence: 86, supportType: "support" },
    { id: "e3", competencyId: "problem", source: "interview", content: "通过分阶段评测将知识库命中率从 71% 提升至 86%。", relatedQuestion: "检索结果不稳定时如何定位？", strength: 90, confidence: 92, supportType: "support" },
    { id: "e4", competencyId: "backend", source: "interview", content: "能完成 API 联调，但缺少鉴权、限流和异常治理的完整实践。", relatedQuestion: "如何设计可靠的模型调用接口？", strength: 64, confidence: 84, supportType: "risk" },
    { id: "e5", competencyId: "communication", source: "resume", content: "机器人项目中负责软件、硬件成员之间的联调排期和问题同步。", relatedQuestion: "", strength: 76, confidence: 80, supportType: "support" },
  ],
  dimensionScores: competencyModel.map(({ id, name, score, targetScore, weight }) => ({ id, name, score, targetScore, weight })),
  coverage: 100,
  agentState: { currentStage: "completed", currentCompetency: "communication", questionType: "reflection", followUpReason: "所有核心能力证据已达到最低覆盖要求", coverage: 100 },
  status: "completed",
  report: {
    overallScore: 80.5,
    matchScore: 83,
    recommendation: "建议进入下一轮",
    confidence: 88,
    summary: "候选人前端工程和 AI 应用能力突出，能够用量化指标说明问题解决过程；后端接口治理经验略弱。",
    strengths: ["Vue 3 工程实践完整", "具备 RAG 应用落地与评测意识", "能够结构化定位复杂问题"],
    gaps: ["生产级接口鉴权、限流和可观测性经验不足", "需要补充大型团队协作案例"],
    suggestions: ["完成一个带鉴权、限流和监控的模型网关项目", "用 STAR 方法整理机器人项目中的冲突处理案例"],
  },
});

export const mockAssessmentHistory = [
  { assessmentId: "ASSESS-2026-0001", jobName: "AI应用开发工程师", candidateName: "林同学", score: 80.5, status: "completed", createdAt: "2026-07-19 10:30" },
  { assessmentId: "ASSESS-2026-0000", jobName: "前端开发工程师", candidateName: "林同学", score: 76, status: "completed", createdAt: "2026-07-10 14:20" },
];

const fallbackReview = [
  { id:"r1",question:"请介绍你负责的 Vue 项目。",answer:"我负责组件化重构和 Pinia 状态设计，将首屏加载时间降低了 35%。",competencyId:"frontend",competencyName:"前端工程能力",analysis:"回答包含明确职责、技术行动和量化结果。",scoreChange:8,evidenceStrength:90,confidence:92 },
  { id:"r2",question:"AI 问答助手中你解决了什么核心问题？",answer:"我实现了 RAG 检索、流式回答和提示词评测，并建立测试集优化召回效果。",competencyId:"ai",competencyName:"AI应用能力",analysis:"体现大模型应用落地和效果评估经验。",scoreChange:8,evidenceStrength:88,confidence:90 },
  { id:"r3",question:"如何保证模型调用接口的可靠性？",answer:"完成了异常重试和接口联调，但限流、监控主要由后端同学负责。",competencyId:"backend",competencyName:"后端接口能力",analysis:"具备接口协作经验，但生产级治理深度不足。",scoreChange:3,evidenceStrength:68,confidence:86 },
  { id:"r4",question:"遇到检索结果不稳定时如何排查？",answer:"我拆分召回、排序和生成阶段建立指标，最终将命中率从 71% 提升到 86%。",competencyId:"problem",competencyName:"问题解决能力",analysis:"能够结构化拆解问题并用数据验证方案。",scoreChange:8,evidenceStrength:92,confidence:94 },
  { id:"r5",question:"机器人项目中如何推进跨团队联调？",answer:"我维护问题清单和联调排期，每日同步软硬件阻塞项并推动责任人闭环。",competencyId:"communication",competencyName:"沟通协作能力",analysis:"体现跨角色沟通和任务推进意识。",scoreChange:6,evidenceStrength:82,confidence:88 },
];

export const buildAssessmentReport = (session = mockAssessmentSession) => {
  const competencies = session.competencyModel?.length ? session.competencyModel : competencyModel;
  const review = session.interviewTurnEvidence?.length ? session.interviewTurnEvidence.map((item) => ({ id:item.id,question:item.question,answer:item.answer,competencyId:item.competencyId,competencyName:item.competencyName,analysis:item.evidenceContent,scoreChange:item.scoreChange,evidenceStrength:item.evidenceStrength,confidence:item.confidence,risk:item.risk })) : fallbackReview;
  const allEvidence = session.evidence || [];
  const evidenceSummary = competencies.map((competency) => ({
    competencyId: competency.id,
    competencyName: competency.name,
    resumeEvidence: allEvidence.filter((item) => item.competencyId === competency.id && item.source === "resume"),
    interviewEvidence: allEvidence.filter((item) => item.competencyId === competency.id && item.source === "interview"),
    strength: Math.round(review.filter((item) => item.competencyId === competency.id).reduce((sum,item)=>sum+(item.evidenceStrength||0),0) / Math.max(1,review.filter((item)=>item.competencyId===competency.id).length)) || competency.score,
    confidence: Math.round(review.filter((item) => item.competencyId === competency.id).reduce((sum,item)=>sum+(item.confidence||0),0) / Math.max(1,review.filter((item)=>item.competencyId===competency.id).length)) || 85,
    risk: allEvidence.some((item) => item.competencyId === competency.id && item.supportType === "risk") ? "存在待核验风险" : "无明显风险",
  }));
  const overallScore = Math.max(86, Math.round(competencies.reduce((sum,item)=>sum + item.score * item.weight / 100,0)));
  return createAssessmentReport({
    summary:"候选人具备较完整的 Vue 前端工程实践和 AI 问答应用落地经验，问题分析过程清晰，能够用指标说明结果。后端接口治理、容器化部署和大型系统经验仍需进一步培养。",
    overallScore: overallScore || 86,
    matchScore: session.matchResult?.score || 83,
    confidence: 90,
    recommendation:"推荐进入下一轮",
    competencyScores:competencies.map(({id,name,score,targetScore,weight})=>({id,name,score,targetScore,weight,gap:score-targetScore,status:score>=targetScore?"达标":"待提升"})),
    evidenceSummary,
    interviewReview:review,
    strengths:session.matchResult?.strengths || ["有 AI 项目经验","具备前后端联调能力","问题拆解与量化意识较好"],
    risks:[
      {level:"中",title:"大型部署经验不足",description:"缺少高并发、监控告警和容量规划的完整实践。",competencyId:"backend"},
      {level:"中",title:"云服务经验不足",description:"Docker、云平台和模型服务工程化经验需要补齐。",competencyId:"ai"},
      {level:"低",title:"团队规模有限",description:"现有案例以学生项目为主，复杂组织协作经验有限。",competencyId:"communication"},
    ],
    growthPlan:[
      {category:"Docker部署",action:"将 AI 问答助手容器化，补充健康检查、日志和环境配置。",resource:"系统设计与部署题库"},
      {category:"模型工程化",action:"实现模型网关的超时、重试、限流、缓存和调用监控。",resource:"AI 应用工程训练营"},
      {category:"系统设计",action:"完成一个支持高并发问答的端到端架构设计与压测报告。",resource:"后端接口与系统设计专项"},
    ],
  });
};

const wait = (data, delay = 180) => new Promise((resolve) => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), delay));

export const assessmentMockService = {
  create: (payload = {}) => wait(createAssessmentSession({
    ...payload,
    assessmentId: `ASSESS-DEMO-${Date.now()}`,
    messages: [],
    evidence: (payload.evidence || []).filter((item) => item.source === "resume"),
    coverage: 20,
    agentState: {
      currentStage: "背景确认",
      currentCompetency: payload.competencyModel?.[0]?.name || "前端工程能力",
      questionType: "STAR 行为事件提问",
      followUpReason: "从简历项目切入，验证候选人的真实职责与贡献",
      coverage: 20,
    },
    status: "interviewing",
    report: null,
  })),
  get: () => wait(mockAssessmentSession),
  history: () => wait(mockAssessmentHistory),
  report: (session) => wait(buildAssessmentReport(session?.assessmentId ? session : mockAssessmentSession)),
  parseResume: () => wait(mockAssessmentSession.resumeProfile),
  parseJob: () => wait(mockAssessmentSession.jobProfile),
  match: () => wait({ ...mockAssessmentSession.matchResult, competencyModel }),
  plan: () => wait(mockAssessmentSession.interviewPlan),
};
