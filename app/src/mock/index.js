import Mock from "mockjs";

// 设置请求延迟
Mock.setup({ timeout: "200-600" });

// 统一存储数据
const data = {
  unreviewedList: Mock.mock({
    "list|3-5": [
      {
        "id|+1": 1,
        questionContent: "@csentence(10,20)",
        difficultyLevel: "@integer(1,3)",
        jobRole: "@cword(4,8)",
        status: 0,
        referenceAnswer: "@csentence(5,15)",
        evaluationCriteria: "@csentence(8,20)",
        tags: "@cword(4,10)",
        source: "@integer(0,1)",
        type: "@pick(['single', 'multiple', 'short'])",
        createTime: "@datetime",
        vectorStatus: 0,
        updateTime: "@datetime",
        isDeleted: 0,
        like: 0,
      },
    ],
  }).list,
  approvedList: [],
  // 🔥 新增：速记卡数据存储
  cardSetList: Mock.mock({
    "list|8-12": [
      {
        "id|+1": 1,
        name: "@ctitle(4,8)",
        description: "@csentence(10,30)",
        "cardCount|5-20": 1,
        author: "@cname",
        createdAt: "@datetime",
        isMy: false, // 区分我的/发现的
      },
    ],
  }).list,
  // 🔥 新增：速记卡卡片数据
  cardList: [
    {
      id: 1,
      cardSetId: 1,
      content: "Vue3中Composition API的核心优势是什么？",
      analysis: "Composition API允许我们根据功能组织代码，而不是根据选项类型，这使得代码更易于维护和复用。它还提供了更好的TypeScript支持和更灵活的逻辑组合方式。",
      correctOptionId: "C",
      options: [
        { optionKey: "A", optionText: "只能在setup函数中使用" },
        { optionKey: "B", optionText: "完全替代Options API" },
        { optionKey: "C", optionText: "按功能组织代码，提高可维护性" },
        { optionKey: "D", optionText: "不支持TypeScript" },
      ],
    },
    {
      id: 2,
      cardSetId: 1,
      content: "React中useEffect的依赖数组作用是什么？",
      analysis: "useEffect的依赖数组用于控制副作用的执行时机。当依赖数组中的值发生变化时，useEffect会重新执行。空依赖数组意味着副作用只在组件挂载和卸载时执行一次。",
      correctOptionId: "B",
      options: [
        { optionKey: "A", optionText: "控制组件渲染次数" },
        { optionKey: "B", optionText: "控制副作用执行时机" },
        { optionKey: "C", optionText: "存储组件状态" },
        { optionKey: "D", optionText: "定义组件属性" },
      ],
    },
    {
      id: 3,
      cardSetId: 2,
      content: "JavaScript中什么是闭包？",
      analysis: "闭包是指有权访问另一个函数作用域中变量的函数。即使外部函数已经执行完毕，闭包仍然可以访问其变量，这使得变量可以在函数执行后继续存在。",
      correctOptionId: "A",
      options: [
        { optionKey: "A", optionText: "有权访问另一个函数作用域中变量的函数" },
        { optionKey: "B", optionText: "一个立即执行的函数表达式" },
        { optionKey: "C", optionText: "一种数据类型" },
        { optionKey: "D", optionText: "JavaScript的一种设计模式" },
      ],
    },
    {
      id: 4,
      cardSetId: 2,
      content: "什么是RESTful API？",
      analysis: "RESTful API是一种基于HTTP协议的API设计风格，它使用HTTP方法（GET、POST、PUT、DELETE等）来操作资源，并通过URL路径来标识资源。它强调无状态、缓存、分层系统等原则。",
      correctOptionId: "D",
      options: [
        { optionKey: "A", optionText: "一种编程语言" },
        { optionKey: "B", optionText: "一种数据库技术" },
        { optionKey: "C", optionText: "一种前端框架" },
        { optionKey: "D", optionText: "一种基于HTTP的API设计风格" },
      ],
    },
    {
      id: 5,
      cardSetId: 3,
      content: "CSS中box-sizing属性的作用是什么？",
      analysis: "box-sizing属性用于控制元素的盒模型计算方式。content-box是默认值，元素的宽度和高度只包括内容区域；border-box则包括内容、内边距和边框。",
      correctOptionId: "C",
      options: [
        { optionKey: "A", optionText: "控制元素的显示方式" },
        { optionKey: "B", optionText: "控制元素的定位方式" },
        { optionKey: "C", optionText: "控制元素盒模型的计算方式" },
        { optionKey: "D", optionText: "控制元素的背景样式" },
      ],
    },
  ],
};

// 工具函数
const createQuestion = (item, id) => ({
  id,
  difficultyLevel: Number(item.difficultyLevel) || 1,
  jobRole: item.jobRole?.trim() || "",
  questionContent: item.questionContent?.trim() || "",
  referenceAnswer: item.referenceAnswer?.trim() || "",
  evaluationCriteria: item.evaluationCriteria?.trim() || "",
  tags: typeof item.tags === 'string' ? item.tags.trim() : (Array.isArray(item.tags) ? item.tags.join(',') : ""),
  source: Number(item.source) || 0,
  type: item.type || "unknown",
  createTime: new Date().toLocaleString(),
  status: 0,
  vectorStatus: 0,
  updateTime: new Date().toLocaleString(),
  isDeleted: 0,
  like: 0,
});

const resp = (code, msg, data = null) => ({ code, message: msg, data });

// ==============================
// 🔥 核心：登录 / 注册 / 验证码 Mock
// ==============================
const baseUrl = "/api";

// ====================
// 用户登录 → 改成GET方法，匹配后端
// ====================
Mock.mock(RegExp(`${baseUrl}/user/user/login.*`), "get", (options) => {
  const urlParams = new URLSearchParams(options.url.split('?')[1])
  const body = {
    userName: urlParams.get('userName'),
    passWord: urlParams.get('passWord') || urlParams.get('password')
  }
  console.log("【Mock 用户登录】", body);

  return {
    code: 1,
    msg: "登录成功",
    data: {
      token: "user-mock-token-654321",
      userName: body.userName,
      nickName: "普通用户",
      id: 100,
    },
  };
});

// ====================
// 管理员登录 → 改成GET方法，匹配后端
// ====================
Mock.mock(RegExp(`${baseUrl}/admin/admin/login.*`), "post", (options) => {
  const body = JSON.parse(options.body)
  console.log("【Mock 管理员登录】", body);

  return {
    code: 1,
    msg: "登录成功",
    data: {
      token: "admin-mock-token-123456",
      userName: body.userName,
      nickName: "管理员",
      id: 1,
    },
  };
});

// 用户注册
Mock.mock(`${baseUrl}/user/user/register`, "post", (options) => {
  const body = JSON.parse(options.body);
  console.log("【Mock 用户注册】", body);

  return {
    code: 1,
    msg: "注册成功",
    data: null,
  };
});

// 发送验证码
Mock.mock(`${baseUrl}/user/user/sendCode`, "get", () => {
  return {
    code: 1,
    msg: "验证码发送成功",
    data: null,
  };
});

// ==============================
// 题目管理接口
// ==============================
Mock.mock(`${baseUrl}/admin/question/delete`, "post", ({ body }) => {
  const { id } = JSON.parse(body);
  const unreviewedIndex = data.unreviewedList.findIndex(
    (item) => item.id === id
  );
  if (unreviewedIndex > -1) {
    data.unreviewedList.splice(unreviewedIndex, 1);
    return resp(200, "删除成功");
  }
  return resp(400, "题目不存在");
});

Mock.mock(`${baseUrl}/admin/question/add`, "post", ({ body }) => {
  const newId = data.unreviewedList.length + 1;
  const newQuestion = createQuestion(JSON.parse(body), newId);
  data.unreviewedList.push(newQuestion);
  return resp(200, "添加成功", newQuestion);
});

Mock.mock(`${baseUrl}/admin/question/addBatch`, "post", ({ body }) => {
  const list = JSON.parse(body).question;
  if (!Array.isArray(list)) return resp(400, "必须是数组");
  const maxId = data.unreviewedList.length
    ? Math.max(...data.unreviewedList.map((i) => i.id))
    : 0;
  const newList = list.map((item, i) => createQuestion(item, maxId + i + 1));
  data.unreviewedList.push(...newList);
  return resp(200, `添加${newList.length}题成功`, newList);
});

Mock.mock(`${baseUrl}/admin/question/search`, "get", () => {
  return resp(200, "success", data.unreviewedList);
});

Mock.mock(`${baseUrl}/admin/question/audit`, "post", ({ body }) => {
  const { ids } = JSON.parse(body);
  const passList = data.unreviewedList.filter((i) => ids.includes(i.id));
  data.approvedList.push(...passList.map((i) => ({ ...i, status: 1 })));
  data.unreviewedList = data.unreviewedList.filter((i) => !ids.includes(i.id));
  return resp(200, "审核通过");
});

Mock.mock(`${baseUrl}/admin/question/approved`, "get", () => {
  return resp(200, "success", data.approvedList);
});

Mock.mock(`${baseUrl}/admin/question/vector`, "post", () => {
  data.approvedList = data.approvedList.map((item) => ({
    ...item,
    vectorStatus: 1,
  }));
  return resp(200, "向量化成功");
});

// ==============================
// 面试相关 Mock
// ==============================
Mock.mock(`${baseUrl}/user/aiInter/getInter`, "post", () => {
  return { code: 200, message: "成功", data: "mock-chat-id" };
});

Mock.mock(`${baseUrl}/user/aiInter/getInterSummary`, "get", () => {
  return "请先做个自我介绍吧！";
});

Mock.mock(`${baseUrl}/user/aiInter/endInter`, "post", () => {
  return {
    code: 200,
    message: "成功",
    data: {
      aiSummary: "表现优秀，技术扎实",
      radarData: {
        communication: 85,
        technical_depth: 90,
        problem_solving: 80,
        learning_ability: 88,
        teamwork: 75,
        initiative: 82,
      },
    },
  };
});

Mock.mock(`${baseUrl}/user/aiSummary/average`, "get", () => {
  return {
    code: 200,
    data: {
      avgCommunication: 75,
      avgTechnicalDepth: 70,
      avgProblemSolving: 65,
      avgLearningAbility: 72,
    },
  };
});

Mock.mock(`${baseUrl}/user/aiSummary/myAverage`, "get", () => {
  return {
    code: 200,
    data: {
      avgCommunication: 85,
      avgTechnicalDepth: 90,
      avgProblemSolving: 80,
    },
  };
});

// ==============================
// 🔥 新增：速记卡相关Mock接口（完全匹配后端）
// ==============================
// 1. 获取我的速记卡列表
Mock.mock(`${baseUrl}/user/card/getCardSetList`, "get", () => {
  const myCardList = data.cardSetList.filter(item => item.isMy);
  console.log("【Mock 获取我的速记卡】", myCardList);
  return resp(200, "success", myCardList);
});

// 2. 获取发现速记卡列表（全部公开速记卡）
Mock.mock(`${baseUrl}/user/card/getAll`, "get", (options) => {
  // 支持搜索筛选
  const urlParams = new URLSearchParams(options.url.split('?')[1]);
  const title = urlParams.get('title') || '';
  const keyword = urlParams.get('keyword') || '';
  
  // 转换数据格式，确保包含所有需要的字段
  let cardList = data.cardList.map(card => ({
    id: card.id,
    question: card.content,
    content: card.content,
    answer: card.analysis,
    analysis: card.analysis,
    options: card.options,
    correctOption: card.correctOptionId,
    difficulty: card.difficulty || 1,
    type: 'manual',
    createTime: card.createTime || new Date().toISOString()
  }));
  
  if (keyword) {
    cardList = cardList.filter(item => item.content.includes(keyword));
  }
  console.log("【Mock 获取卡片列表】", cardList);
  return resp(200, "success", cardList);
});

// 3. 创建速记卡
// 创建速记卡接口
Mock.mock(`${baseUrl}/user/card/add`, "post", ({ body }) => {
  const newCard = JSON.parse(body);
  const newId = data.cardList.length + 1;
  const createData = {
    id: newId,
    question: newCard.name,
    content: newCard.name,
    answer: newCard.description,
    analysis: newCard.description,
    options: [
      { optionText: '选项 A' },
      { optionText: '选项 B' },
      { optionText: '选项 C' },
      { optionText: '选项 D' }
    ],
    correctOption: 'A',
    difficulty: newCard.difficulty,
    type: 'manual',
    createTime: new Date().toISOString()
  };
  data.cardList.unshift(createData);
  console.log("【Mock 创建速记卡】", createData);
  return resp(200, "创建成功", createData);
});

// 4. 删除速记卡
Mock.mock(`${baseUrl}/user/card/deleteCardSet`, "post", ({ body }) => {
  const { id } = JSON.parse(body);
  const index = data.cardSetList.findIndex(item => item.id === id);
  if (index > -1) {
    data.cardSetList.splice(index, 1);
    // 同步删除卡片
    data.cardList = data.cardList.filter(item => item.cardSetId !== id);
    return resp(200, "删除成功");
  }
  return resp(400, "速记卡不存在");
});

// 5. 获取速记卡下的卡片列表
Mock.mock(`${baseUrl}/user/card/getCardList`, "get", (options) => {
  const urlParams = new URLSearchParams(options.url.split('?')[1]);
  const cardSetId = Number(urlParams.get('cardSetId'));
  const list = data.cardList.filter(item => item.cardSetId === cardSetId);
  console.log(`【Mock 获取速记卡${cardSetId}的卡片】`, list);
  return resp(200, "success", list);
});

// 6. 开始练习接口
Mock.mock(`${baseUrl}/user/card/startPractice`, "get", (options) => {
  const urlParams = new URLSearchParams(options.url.split('?')[1]);
  const cardSetId = Number(urlParams.get('cardSetId'));
  console.log(`【Mock 开始练习速记卡${cardSetId}】`);
  return resp(200, "success", { practiceId: Mock.mock('@id') });
});

// 7. 添加卡片接口（创建选择题）
Mock.mock(`${baseUrl}/user/card/addQuestion`, "post", ({ body }) => {
  const newCard = JSON.parse(body);
  const newId = data.cardList.length + 1;
  const createData = {
    id: newId,
    cardSetId: newCard.cardid || 1, // 默认添加到第一个速记卡
    content: newCard.content,
    analysis: newCard.analysis,
    correctOptionId: newCard.correctOption || newCard.correct_option_id,
    options: newCard.options.map((opt, index) => {
      return {
        optionKey: opt.optionKey || String.fromCharCode(65 + index),
        optionText: opt.optionText || opt
      };
    }),
  };
  data.cardList.push(createData);
  // 更新卡片数量
  const cardSet = data.cardSetList.find(item => item.id === createData.cardSetId);
  if (cardSet) {
    cardSet.cardCount += 1;
  }
  console.log("【Mock 添加卡片】", createData);
  return resp(200, "添加成功", createData);
});

// 8. AI生成卡片接口
Mock.mock(`${baseUrl}/user/card/addQuestionByAI`, "get", (options) => {
  const urlParams = new URLSearchParams(options.url.split('?')[1]);
  const cardSetId = Number(urlParams.get('cardSetId'));
  const title = urlParams.get('title');
  console.log(`【Mock AI生成卡片】cardSetId:${cardSetId}, title:${title}`);
  
  const newId = data.cardList.length + 1;
  const aiCard = {
    id: newId,
    cardSetId: cardSetId,
    content: `AI生成：${title}相关题目`,
    analysis: `这是${title}的答案解析`,
    correctOptionId: 'B',
    options: [
      { optionKey: 'A', optionText: '错误选项1' },
      { optionKey: 'B', optionText: '正确选项' },
      { optionKey: 'C', optionText: '错误选项2' },
      { optionKey: 'D', optionText: '错误选项3' },
    ],
  };
  data.cardList.push(aiCard);
  return resp(200, "生成成功", aiCard);
});

// ==============================
// 🔥 新增：面试知识点相关Mock接口
// ==============================
// 面试知识点数据存储
data.knowledgeList = Mock.mock({
  "list|20-30": [
    {
      "id|+1": 1,
      questionContent: "@csentence(15,30)",
      "difficultyLevel|1-3": 1,
      jobRole: "@pick(['后端开发工程师','前端开发工程师','测试工程师','产品经理'])",
      referenceAnswer: "@csentence(30,80)",
      evaluationCriteria: "@csentence(20,50)",
      tags: "@pick(['Spring','设计模式','API','数据库','架构','事务','REST','JWT','认证','安全'])",
      "source|0-1": 0,
      createTime: "@datetime",
      updateTime: "@datetime",
      "like|0-100": 0,
      "collect|0-50": 0,
      isLiked: false,
      isCollected: false,
    },
  ],
}).list;

// 1. 获取面试知识点题目列表
Mock.mock(`${baseUrl}/user/question/search`, "get", (options) => {
  const urlParams = new URLSearchParams(options.url.split('?')[1]);
  const keyword = urlParams.get('keyword') || '';
  const tag = urlParams.get('tag') || '';
  const jobRole = urlParams.get('jobRole') || '';
  const pageNum = Number(urlParams.get('pageNum')) || 1;
  const pageSize = Number(urlParams.get('pageSize')) || 10;

  let list = [...data.knowledgeList];
  
  if (keyword) {
    list = list.filter(item => item.questionContent.includes(keyword));
  }
  if (tag) {
    list = list.filter(item => item.tags.includes(tag));
  }
  if (jobRole) {
    list = list.filter(item => item.jobRole === jobRole);
  }

  const total = list.length;
  const start = (pageNum - 1) * pageSize;
  const end = start + pageSize;
  const records = list.slice(start, end);

  console.log(`【Mock 获取面试知识点列表】keyword:${keyword}, tag:${tag}, jobRole:${jobRole}, 共${total}条`);
  return resp(200, "success", { records, total, pageNum, pageSize });
});

// 2. 添加面试知识点题目
Mock.mock(`${baseUrl}/user/question/add`, "post", ({ body }) => {
  const newQuestion = JSON.parse(body);
  const newId = data.knowledgeList.length + 1;
  const createData = {
    id: newId,
    questionContent: newQuestion.questionContent,
    referenceAnswer: newQuestion.referenceAnswer,
    evaluationCriteria: newQuestion.evaluationCriteria,
    difficultyLevel: Number(newQuestion.difficultyLevel),
    jobRole: newQuestion.jobRole,
    tags: Array.isArray(newQuestion.tags) ? newQuestion.tags.join(',') : newQuestion.tags,
    source: Number(newQuestion.source),
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
    like: 0,
    collect: 0,
    isLiked: false,
    isCollected: false,
  };
  data.knowledgeList.unshift(createData);
  console.log("【Mock 添加面试知识点】", createData);
  return resp(200, "添加成功", createData);
});

// 3. 获取标签列表
Mock.mock(`${baseUrl}/user/question/tag`, "get", () => {
  const tags = ['Spring', '设计模式', 'API', '数据库', '架构', '事务', 'REST', 'JWT', '认证', '安全'];
  console.log("【Mock 获取标签列表】", tags);
  return resp(200, "success", tags);
});

// 4. 获取岗位列表
Mock.mock(`${baseUrl}/user/question/jobRole`, "get", () => {
  const jobRoles = ['后端开发工程师', '前端开发工程师', '测试工程师', '产品经理'];
  console.log("【Mock 获取岗位列表】", jobRoles);
  return resp(200, "success", jobRoles);
});

// 5. 相似性搜索
Mock.mock(`${baseUrl}/user/question/vectorSearch`, "get", (options) => {
  const urlParams = new URLSearchParams(options.url.split('?')[1]);
  const questionId = Number(urlParams.get('questionId'));
  
  // 随机返回5条相似题目
  const similarList = Mock.mock({
    "list|3-5": [
      {
        "id|+1": 1000,
        questionContent: "@csentence(15,30)",
        "difficultyLevel|1-3": 1,
        jobRole: "@pick(['后端开发工程师','前端开发工程师','测试工程师','产品经理'])",
        tags: "@pick(['Spring','设计模式','API','数据库','架构','事务','REST','JWT','认证','安全'])",
      },
    ],
  }).list;

  console.log(`【Mock 相似性搜索】questionId:${questionId}`);
  return resp(200, "success", similarList);
});

// 6. 收藏题目
Mock.mock(`${baseUrl}/user/question/collect`, "get", (options) => {
  const urlParams = new URLSearchParams(options.url.split('?')[1]);
  const questionId = Number(urlParams.get('questionId'));
  
  const question = data.knowledgeList.find(item => item.id === questionId);
  if (question) {
    question.isCollected = !question.isCollected;
    question.collect += question.isCollected ? 1 : -1;
    console.log(`【Mock 收藏题目】questionId:${questionId}, 当前收藏状态:${question.isCollected}`);
    return resp(200, question.isCollected ? "收藏成功" : "取消收藏", { isCollected: question.isCollected, collect: question.collect });
  }
  return resp(400, "题目不存在");
});

// 7. 点赞题目
Mock.mock(`${baseUrl}/user/question/like`, "get", (options) => {
  const urlParams = new URLSearchParams(options.url.split('?')[1]);
  const questionId = Number(urlParams.get('questionId'));
  
  const question = data.knowledgeList.find(item => item.id === questionId);
  if (question) {
    question.isLiked = !question.isLiked;
    question.like += question.isLiked ? 1 : -1;
    console.log(`【Mock 点赞题目】questionId:${questionId}, 当前点赞状态:${question.isLiked}`);
    return resp(200, question.isLiked ? "点赞成功" : "取消点赞", { isLiked: question.isLiked, like: question.like });
  }
  return resp(400, "题目不存在");
});

// ==============================
// 🔥 新增：AI 客服求助接口（流式输出）
// ==============================
Mock.mock(RegExp(`${baseUrl}/user/homepage/ai-help.*`), "get", (options) => {
  const urlParams = new URLSearchParams(options.url.split('?')[1]);
  const content = urlParams.get('content') || '';
  console.log(`【Mock AI客服求助】用户问题：${content}`);
  
  // 模拟流式响应 - 返回完整的推荐内容
  const aiResponse = `你好！我是 AI 助手，很高兴为你服务。

根据你的问题"${content}"，我为你推荐以下面试题目：

**题目推荐：**

1. **Vue 3 响应式原理**
   - 难度：中等
   - 标签：前端、Vue、响应式
   - 考点：Proxy、Reactive、Ref

2. **Java 多线程与并发**
   - 难度：困难
   - 标签：Java、并发、线程
   - 考点：Thread、Runnable、线程池

3. **MySQL 索引优化**
   - 难度：中等
   - 标签：数据库、MySQL、索引
   - 考点：B+树、索引类型、最左前缀

**解答示例（Vue 3 响应式原理）：**

Vue 3 采用了 **Proxy** 代理对象来实现响应式系统，相比 Vue 2 的 Object.defineProperty 有以下优势：

- 可以监听对象属性的新增和删除
- 可以监听数组索引的变化
- 性能更好，内存占用更少

核心代码示例：
\`\`\`javascript
const reactive = (target) => {
  return new Proxy(target, {
    get(target, key) {
      // 收集依赖
      track(target, key)
      return target[key]
    },
    set(target, key, value) {
      target[key] = value
      // 触发更新
      trigger(target, key)
      return true
    }
  })
}
\`\`\`

希望这些内容对你有帮助！还有其他问题随时问我。`;

  return resp(200, "success", aiResponse);
});

// ==============================
// 🔥 速记卡相关接口
// ==============================
// 提交答案接口
Mock.mock(`${baseUrl}/user/card/submitAnswer`, "post", ({ body }) => {
  const answerData = JSON.parse(body);
  console.log("【Mock 提交答案】", answerData);
  return resp(200, "提交成功");
});

// 批量添加速记卡题目接口
Mock.mock(`${baseUrl}/user/card/addCardList`, "post", ({ body }) => {
  const cardData = JSON.parse(body);
  const cardSetId = cardData.cardid;
  const questions = cardData.questions;
  
  questions.forEach((q, index) => {
    const newId = data.cardList.length + 1;
    const createData = {
      id: newId,
      cardSetId: cardSetId,
      content: q.content,
      analysis: q.analysis,
      correctOptionId: q.correct,
      options: q.options.map((opt, optIndex) => {
        return {
          optionKey: opt.optionKey || String.fromCharCode(65 + optIndex),
          optionText: opt.optionText || opt
        };
      }),
    };
    data.cardList.push(createData);
  });
  
  // 更新卡片数量
  const cardSet = data.cardSetList.find(item => item.id === cardSetId);
  if (cardSet) {
    cardSet.cardCount += questions.length;
  }
  
  console.log("【Mock 批量添加速记卡题目】", cardSetId, questions.length);
  return resp(200, "添加成功");
});