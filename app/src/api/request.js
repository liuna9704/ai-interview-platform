import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

const request = axios.create({
  baseURL: '/api',
  timeout: 5000
})

// 请求拦截器：统一添加Token
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['token'] = token
    }
    // 仅在非生产环境打印，且刻意不打印 config.data
    // （登录、注册等请求体里含明文密码，不应出现在控制台）
    if (process.env.NODE_ENV !== 'production') {
      console.log('【发起请求】', config.method.toUpperCase(), config.url, config.params || '')
    }
    return config
  },
  error => {
    console.error('【请求错误】', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('【接口响应】', response.config.url, response.status)
    }
    return response.data || {}
  },
  (error) => {
    console.error('【响应错误】', error)
    let msg = '网络请求失败'
    if (error.response) {
      msg = error.response.data?.msg || error.message
    } else if (error.message) {
      msg = error.message
    }
    ElMessage.error(msg)
    return Promise.reject(error)
  }
)

// ==================== 登录相关接口 ====================
export const reqAdminLogin = (data) => request.post('/admin/admin/login', data)
export const reqUserLogin = (params) => request.get('/user/user/login', { params })
export const reqUserRegister = (data) => request.post('/user/user/register', data)
export const reqSendCode = (phone) => request.get('/user/user/sendCode', { params: { phone } })

// ==================== 题目管理接口 ====================
export const addQuestion = (data) => request.post("/admin/question/add", data);
export const batchAddQuestion = (data) => request.post("/admin/question/addBatch", { question: data });
export const getUnreviewed = () => request.get("/admin/question/search");
export const getApproved = () => request.get("/admin/question/approved");
export const batchApprove = (ids) => request.post("/admin/question/audit", { ids: ids.filter(Boolean) });
export const vectorImport = () => request.post("/admin/question/vector");
export const deleteQuestion = (id) => request.post("/admin/question/delete", { id });

// ==================== 面试日记接口 ====================
export const getHistoryInterviewList = () => request.get("/user/aiSummary/search");
export const getInterviewList = () => request.get("/user/diary/search");
export const addInterview = (data) => request.post("/user/diary/add", data);
export const polishInterview = (data) => request.post("/user/diary/runse", data);
export const deleteInterview = (id) => request.post("/user/diary/delete", { id });
export const updateInterview = (data) => request.post("/user/diary/update", data);

// ==================== 用户信息接口 ====================
export const updateUserInfo = (data) => request.post("/user/user/update", data);
export const getAbilityData = () => request.get("/user/SkillsShowcase/getSkillsShowcase");
export const getAnswerList = () => request.get("/user/card/getHistory");
export const getCollectList = () => request.get("/user/SkillsShowcase/getCollection");

// ==================== 题库/题目操作接口 ====================
export const addQuestionAgain = (data) => request.post("/user/question/add", data);
export const getTagList = (params) => request.get("/user/question/tag", { params });
export const getJobRoleList = (params) => request.get("/user/question/jobRole", { params });
export const getQuestionList = (params) => request.get("/user/question/search", { params });
export const getSimilarQuestion = (questionId) => request.get("/user/question/vectorSearch", { params: { questionId } });
export const collectQuestion = (questionId) => request.get("/user/question/collect", { params: { questionId } });
export const likeQuestion = (questionId) => request.get("/user/question/like", { params: { questionId } });

// ==================== 速记卡接口====================
export const getCardSetList = () => request.get('/user/card/getAll')
export const createCardSet = (data) => request.post('/user/card/add', data)
export const deleteCardSet = (id) => request.post('/user/card/delete', { id })
export const getCardList = (cardSetId) => request.get('/user/card/getQuestionsAndOption', { params: { cardid: cardSetId } })
export const aiGenerateCard = (params) => request.get('/user/card/addQuestionsByAI', { params })
export const addFlashcardQuestion = (data) => request.post('/user/card/addQuestion', data)
export const batchAddQuestions = (data) => request.post('/user/card/addQuestions', data)
export const batchDeleteQuestions = (ids) => request.post('/user/card/deleteQuestions', { ids })
export const submitAnswer = (data) => request.post('/user/card/submitAnswer', data)
export const startPracticeApi = (cardSetId) => request.get('/user/card/startExam', { params: { cardid: cardSetId } })
export const getExamResult = (examId) => request.get('/user/card/getExamResult', { params: { examid: examId } })
export const getAllFlashcards = (params) => request.get('/user/card/getAll', { params })
export const addCardList = (data) => request.post('/user/card/addCardList', data)

export default request