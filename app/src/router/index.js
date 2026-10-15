import { createRouter, createWebHistory } from 'vue-router'
import login from '@/pages/login'
import resume from '@/pages/resume'
import home from '@/pages/home'
import question from '@/pages/question'
import userHome from '@/pages/user-home'
import userQuestion from '@/pages/user-question'
import interview from '@/pages/interview-prepare/interview'
import preparation from '@/pages/interview-prepare/preparation'
import report from '@/pages/interview-prepare/report'
import aichat from '@/pages/aicoach/aichat'
import aicoachhome from '@/pages/aicoach/aicoachhome'
import user from '@/pages/user'

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: login },
  { path: "/resume", component: resume },
  { path: "/home", component: home },
  { path: "/question", component: question },
  { path:"/user-home",component:userHome},
  { path:"/user-question",component:userQuestion},
  { path: "/interview-prepare", redirect: "/preparation" },
  { path: "/interview", component: interview },
  { path: "/preparation", component: preparation },
  { path: "/report", component: report },
  { path: "/resume-analysis", component: () => import("@/pages/resume-analysis") },
  { path: "/job-analysis", component: () => import("@/pages/job-analysis") },
  { path: "/job-match", component: () => import("@/pages/job-match") },
  { path: "/assessment-plan", component: () => import("@/pages/assessment-plan") },
  { path: "/assessment-history", component: () => import("@/pages/assessment-history") },
  { path: "/growth-plan", component: () => import("@/pages/growth-plan") },
  { path: "/aicoach", redirect: "/aicoachhome" },
  { path: "/aichat", component: aichat },
  { path: "/aicoachhome", component: aicoachhome },
  { path: "/user", component: user },
  { path: "/:pathMatch(.*)*", redirect: "/login" }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// =======================
// ✅ 加上这个！路由守卫
// =======================
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  // 没登录 且 想去的不是登录页 → 强制去登录
  if (!token && to.path !== '/login') {
    next('/login')
  } 
  // 其他情况全部放行
  else {
    next()
  }
})

export default router
