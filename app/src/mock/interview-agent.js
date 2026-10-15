const wait = (data, delay = 320) => new Promise((resolve) => setTimeout(() => resolve(data), delay));

const competencyOrder = ["frontend", "ai", "backend", "problem", "communication"];
const competencyNames = {
  frontend: "前端工程能力",
  ai: "AI应用能力",
  backend: "后端接口能力",
  problem: "问题解决能力",
  communication: "沟通协作能力",
};

const looksVague = (answer) => answer.length < 24 || /不知道|不清楚|大概|可能|没什么/.test(answer);
const looksInconsistent = (answer) => /没有参与|不是我做|其实没做|简历写错|别人完成/.test(answer);
const looksDetailed = (answer) => answer.length >= 55 || /\d+%|提升|降低|负责|设计|实现|排查|指标/.test(answer);

export const analyzeAnswer = async ({ question = "", answer = "", currentCompetency = {}, turnIndex = 0 }) => {
  const competencyId = currentCompetency.id || competencyOrder[turnIndex % competencyOrder.length];
  const competencyName = currentCompetency.name || competencyNames[competencyId];
  let scenario = "normal";
  if (looksInconsistent(answer)) scenario = "inconsistent";
  else if (looksVague(answer)) scenario = "vague";
  else if (looksDetailed(answer)) scenario = "detailed";

  const configs = {
    detailed: { strength: 88, confidence: 92, delta: 8, action: "switch_competency", reason: "回答包含明确职责、技术行动或量化结果，当前能力证据充分。", nextTarget: "切换到下一项岗位核心能力", followUpNeeded: false, risk: false },
    vague: { strength: 45, confidence: 62, delta: 2, action: "deep_follow_up", reason: "回答涉及项目，但缺少个人行动、技术细节和结果数据。", nextTarget: "继续验证项目中的真实贡献与技术决策", followUpNeeded: true, risk: false },
    inconsistent: { strength: 25, confidence: 88, delta: -5, action: "verify", reason: "当前回答与简历中的职责描述不一致，需要进行事实核验。", nextTarget: "澄清候选人在项目中的实际职责边界", followUpNeeded: true, risk: true },
    normal: { strength: 70, confidence: 80, delta: 5, action: "clarify", reason: "已获得基础证据，还需要补充关键实现过程。", nextTarget: "确认技术选型依据和问题处理过程", followUpNeeded: true, risk: false },
  };
  const config = configs[scenario];
  return wait({
    scenario,
    evidence: { competencyId, competencyName, content: scenario === "inconsistent" ? `回答与简历记录存在差异：${answer}` : `用户回答体现：${answer}`, strength: config.strength, confidence: config.confidence, risk: config.risk },
    scoreChange: { competencyId, competencyName, value: config.delta },
    decision: { action: config.action, reason: config.reason, nextTarget: config.nextTarget },
    followUpNeeded: config.followUpNeeded,
    question,
    answer,
  });
};

export const getNextCompetency = (competencyModel, currentId) => {
  const index = competencyModel.findIndex((item) => item.id === currentId);
  return competencyModel[(index + 1 + competencyModel.length) % competencyModel.length] || null;
};

export const AGENT_MAX_QUESTIONS = 5;
