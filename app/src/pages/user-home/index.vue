<template>
  <div class="home-container">
    <!-- 顶部导航 -->
    <nav class="navbar">
      <div class="logo">AI岗位胜任力智能评估系统</div>
      <div class="nav-links">
        <router-link to="/user-home" class="nav-link">首页</router-link>
        <router-link to="/resume-analysis" class="nav-link">岗位评估</router-link>
        <router-link to="/interview-prepare" class="nav-link">AI面试</router-link>
        <router-link to="/assessment-history" class="nav-link">历史评估</router-link>
        <router-link to="/user" class="nav-link">用户中心</router-link>
        <button @click="handleLogout" class="logout-btn">退出登录</button>
      </div>
    </nav>

    <section class="assessment-hero">
      <div class="hero-content">
        <el-tag class="hero-tag" effect="dark">科大讯飞开发者大赛 Demo</el-tag>
        <h1>AI岗位胜任力智能评估系统</h1>
        <p>基于大模型多轮问询、岗位建模和证据分析的智能招聘评估平台</p>
        <div class="hero-features"><span>✓ 简历证据提取</span><span>✓ 动态岗位建模</span><span>✓ 多轮智能追问</span><span>✓ 可解释能力评估</span></div>
        <el-button type="primary" size="large" class="assessment-entry" @click="startAssessment">开始 AI 岗位胜任力评估</el-button>
      </div>
      <div class="hero-visual"><div class="score-ring">AI<div>胜任力</div></div></div>
    </section>

    <!-- 轮播图区域 -->
    <div class="carousel-container">
      <div class="carousel" @mouseenter="pauseAutoPlay" @mouseleave="startAutoPlay">
        <div class="carousel-inner" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
          <div class="carousel-item" v-for="(item, index) in banners" :key="index">
            <img :src="item.image" :alt="item.title" />
            <div class="carousel-caption">
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </div>
          </div>
        </div>
        
        <!-- 轮播指示器 -->
        <div class="carousel-indicators">
          <span 
            v-for="(item, index) in banners" 
            :key="index"
            :class="{ active: currentIndex === index }"
            @click="goToSlide(index)"
          ></span>
        </div>
        
        <!-- 左右箭头 -->
        <button class="carousel-arrow prev" @click="prevSlide">
          ❮
        </button>
        <button class="carousel-arrow next" @click="nextSlide">
          ❯
        </button>
      </div>
    </div>

    <!-- 搜索框区域 -->
    <div v-if="false" class="search-section">
      <h3>搜索题目</h3>
      <div class="search-wrapper">
        <input 
          v-model="searchKeyword" 
          type="text" 
          placeholder="输入题目关键词，回车搜索..." 
          @keyup.enter="handleSearch"
        />
        <button @click="handleSearch">搜索</button>
      </div>
      <p class="search-tip">例如：Vue 生命周期、MySQL 索引、Java 基础</p>
    </div>

    <!-- 客服求助 - AI 流式对话 -->
    <div v-if="false" class="support-section">
      <h3>🤖 客服求助</h3>
      <div class="chat-container">
        <div class="chat-messages" ref="chatRef">
          <!-- 欢迎消息 -->
          <div class="message ai-message" v-if="chatMessages.length === 0">
            <div class="avatar">
              <span>🤖</span>
            </div>
            <div class="message-content">
              <div class="bubble">
                <p>你好！我是 AI 助手，有什么问题随时问我，我会为你推荐题目并解答。</p>
              </div>
            </div>
          </div>

          <!-- 消息列表 -->
          <div 
            v-for="(msg, index) in chatMessages" 
            :key="index"
            class="message"
            :class="msg.role === 'user' ? 'user-message' : 'ai-message'"
          >
            <div class="avatar">
              <span v-if="msg.role === 'ai'">🤖</span>
              <span v-else>👤</span>
            </div>
            <div class="message-content">
              <div class="bubble" :class="msg.role">
                <!-- 用户消息 -->
                <p v-if="msg.role === 'user'">{{ msg.content }}</p>
                <!-- AI 消息 - 支持 Markdown -->
                <div 
                  v-else 
                  class="markdown-content" 
                  v-html="renderMarkdown(msg.content)"
                ></div>
                <!-- 打字指示器 -->
                <div v-if="msg.role === 'ai' && msg.isTyping" class="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="input-area">
          <textarea 
            v-model="userInput" 
            placeholder="输入你的问题，例如：'给我推荐一道 Java 面试题'" 
            @keydown.enter.exact.prevent="sendMessage"
            :disabled="sending"
          ></textarea>
          <button 
            @click="sendMessage" 
            :disabled="!userInput.trim() || sending"
            :class="{ sending: sending }"
          >
            <span v-if="!sending">发送</span>
            <span v-else>发送中...</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <footer class="footer">
      <p>© 2026 AI岗位胜任力智能评估系统</p>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted, nextTick, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { ElMessage } from 'element-plus'

export default {
  name: 'HomePage',
  setup() {
    const router = useRouter()
    const chatRef = ref(null)
    
    // 搜索关键词
    const searchKeyword = ref('')
    
    // 轮播图数据
    const currentIndex = ref(0)
    let autoPlayTimer = null
    
    const banners = ref([
      {
        image: 'https://picsum.photos/id/1/1200/400',
        title: 'AI创新大赛',
        description: '📢 大学生比赛通知：AI创新大赛即将开始，报名从速！'
      },
      {
        image: 'https://picsum.photos/id/2/1200/400',
        title: '校园招聘',
        description: '💼 公司招聘动态：优质企业校招岗位更新，等你来投！'
      },
      {
        image: 'https://picsum.photos/id/3/1200/400',
        title: '系统维护',
        description: '🔧 系统维护信息：定期维护通知，请合理安排使用时间'
      },
      {
        image: 'https://picsum.photos/id/4/1200/400',
        title: '面试技巧',
        description: '💡 面试技巧分享：AI面试官教你如何脱颖而出'
      }
    ])
    
    // AI 对话
    const userInput = ref('')
    const chatMessages = ref([])
    const sending = ref(false)

    // 配置 marked
    marked.setOptions({ 
      breaks: true, 
      gfm: true,
      headerIds: false
    })

    // Markdown 渲染
    const renderMarkdown = (text) => {
      if (!text) return ''
      const rawHtml = marked(text)
      return DOMPurify.sanitize(rawHtml)
    }

    // 轮播图控制
    const nextSlide = () => {
      currentIndex.value = (currentIndex.value + 1) % banners.value.length
    }
    
    const prevSlide = () => {
      currentIndex.value = (currentIndex.value - 1 + banners.value.length) % banners.value.length
    }
    
    const goToSlide = (index) => {
      currentIndex.value = index
    }
    
    const startAutoPlay = () => {
      if (autoPlayTimer) return
      autoPlayTimer = setInterval(() => {
        nextSlide()
      }, 5000) // 每5秒切换一次
    }
    
    const pauseAutoPlay = () => {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer)
        autoPlayTimer = null
      }
    }
    
    // 退出登录
    const handleLogout = () => {
      localStorage.removeItem('token')
      router.push('/login')
    }

    const startAssessment = () => router.push('/resume-analysis')

    // 搜索题目
    const handleSearch = () => {
      if (!searchKeyword.value.trim()) {
        alert('请输入搜索关键词！')
        return
      }
      router.push({
        path: '/user-question',
        query: { keyword: searchKeyword.value }
      })
    }

    // 滚动到底部
    const scrollToBottom = () => {
      nextTick(() => {
        if (chatRef.value) {
          chatRef.value.scrollTop = chatRef.value.scrollHeight
        }
      })
    }

    // AI 流式对话
    const sendMessage = async () => {
      if (!userInput.value.trim() || sending.value) return
      
      const content = userInput.value.trim()
      
      // 添加用户消息
      chatMessages.value.push({
        role: 'user',
        content: content
      })
      
      // 清空输入
      userInput.value = ''
      scrollToBottom()

      // 设置发送状态
      sending.value = true

      // 添加 AI 消息占位（带打字指示器）
      const aiMsgIndex = chatMessages.value.length
      chatMessages.value.push({
        role: 'ai',
        content: '',
        isTyping: true
      })
      scrollToBottom()

      try {
        // 模拟 AI 回复内容
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

        // 模拟流式输出 - 逐字显示
        let fullContent = '';
        for (let i = 0; i < aiResponse.length; i++) {
          fullContent += aiResponse[i];
          chatMessages.value[aiMsgIndex] = {
            role: 'ai',
            content: fullContent,
            isTyping: true
          };
          scrollToBottom();
          // 随机延迟模拟打字效果
          await new Promise(resolve => setTimeout(resolve, Math.random() * 30 + 10));
        }

        // 完成打字
        chatMessages.value[aiMsgIndex] = {
          role: 'ai',
          content: fullContent,
          isTyping: false
        };

      } catch (err) {
        console.error('请求失败：', err)
        const errText = `❌ ${err.message || '请求失败，请稍后重试'}`
        
        chatMessages.value[aiMsgIndex] = {
          role: 'ai',
          content: errText,
          isTyping: false
        }
        ElMessage.error(errText)
      } finally {
        sending.value = false
        scrollToBottom()
      }
    }

    onMounted(() => {
      // 校验登录状态
      if (!localStorage.getItem('token')) {
        router.push('/login')
      }
      // 启动自动轮播
      startAutoPlay()
    })
    
    onUnmounted(() => {
      // 清理定时器
      pauseAutoPlay()
    })

    return {
      chatRef,
      searchKeyword,
      userInput,
      chatMessages,
      banners,
      currentIndex,
      sending,
      handleLogout,
      startAssessment,
      handleSearch,
      sendMessage,
      renderMarkdown,
      nextSlide,
      prevSlide,
      goToSlide,
      startAutoPlay,
      pauseAutoPlay
    }
  }
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f5f7fa;
}

.assessment-hero{margin:28px 50px 8px;padding:48px 6%;display:flex;align-items:center;justify-content:space-between;border-radius:18px;background:linear-gradient(135deg,#eef4ff 0%,#f7f1ff 100%);border:1px solid #dce8ff;overflow:hidden}.hero-content{max-width:760px}.hero-tag{margin-bottom:14px}.assessment-hero h1{font-size:38px;margin:0 0 14px;color:#27364b}.assessment-hero p{font-size:18px;color:#606f85;line-height:1.7}.hero-features{display:flex;flex-wrap:wrap;gap:18px;margin:22px 0;color:#52647b}.assessment-entry{padding:22px 30px;font-size:17px;box-shadow:0 8px 20px rgba(64,158,255,.25)}.hero-visual{padding:24px}.score-ring{width:170px;height:170px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:white;border:14px solid #7b8ff4;color:#5266d5;font-size:34px;font-weight:700;box-shadow:0 16px 36px rgba(82,102,213,.2)}.score-ring div{font-size:18px;margin-top:5px}

/* 导航栏 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}
.logo {
  font-size: 24px;
  font-weight: bold;
  padding: 15px 0;
}
.nav-links {
  display: flex;
  gap: 30px;
  align-items: center;
}
.nav-link {
  color: white;
  text-decoration: none;
  font-size: 16px;
  transition: opacity 0.3s;
}
.nav-link:hover {
  opacity: 0.8;
}
.logout-btn {
  padding: 8px 16px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}
.logout-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* 轮播图容器 */
.carousel-container {
  padding: 20px 50px 0;
  background: #f5f7fa;
}
.carousel {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.carousel-inner {
  display: flex;
  transition: transform 0.5s ease-in-out;
}
.carousel-item {
  flex-shrink: 0;
  width: 100%;
  position: relative;
}
.carousel-item img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}
.carousel-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  color: white;
  padding: 30px;
  text-align: left;
}
.carousel-caption h3 {
  font-size: 28px;
  margin-bottom: 10px;
  font-weight: 600;
}
.carousel-caption p {
  font-size: 16px;
  opacity: 0.9;
}

/* 轮播指示器 */
.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}
.carousel-indicators span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
  cursor: pointer;
  transition: all 0.3s;
}
.carousel-indicators span.active {
  width: 30px;
  border-radius: 5px;
  background: white;
}
.carousel-indicators span:hover {
  background: rgba(255,255,255,0.8);
}

/* 轮播箭头 */
.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  transition: all 0.3s;
  z-index: 10;
}
.carousel-arrow:hover {
  background: rgba(0,0,0,0.8);
  transform: translateY(-50%) scale(1.1);
}
.prev {
  left: 20px;
}
.next {
  right: 20px;
}

/* 搜索区域 */
.search-section {
  padding: 40px 50px;
  text-align: center;
  background: white;
  margin: 20px 50px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.search-section h3 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}
.search-wrapper {
  display: flex;
  justify-content: center;
  gap: 10px;
  max-width: 600px;
  margin: 0 auto;
}
.search-wrapper input {
  flex: 1;
  padding: 12px 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s;
}
.search-wrapper input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
}
.search-wrapper button {
  padding: 12px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s;
}
.search-wrapper button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102,126,234,0.4);
}
.search-tip {
  margin-top: 15px;
  color: #666;
  font-size: 14px;
}

/* 客服求助 */
.support-section {
  flex: 1;
  padding: 20px 50px 40px;
  background: white;
  margin: 0 50px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.support-section h3 {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
}
.chat-container {
  display: flex;
  flex-direction: column;
  height: 500px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: #f8f9fa;
  overflow: hidden;
}
.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

/* 消息样式 */
.message {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  max-width: 85%;
}
.message.user-message {
  flex-direction: row-reverse;
  margin-left: auto;
}
.message.ai-message {
  margin-right: auto;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}
.user-message .avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.ai-message .avatar {
  background: #e3f2fd;
}

.message-content {
  flex: 1;
}

.bubble {
  padding: 12px 18px;
  border-radius: 18px;
  word-break: break-word;
}

.user-message .bubble {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-right-radius: 4px;
}

.ai-message .bubble {
  background: white;
  color: #333;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.bubble p {
  margin: 0;
  line-height: 1.6;
}

/* Markdown 内容样式 */
.markdown-content {
  line-height: 1.8;
}
.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4) {
  margin: 16px 0 12px;
  color: #333;
}
.markdown-content :deep(p) {
  margin: 8px 0;
}
.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: 8px 0;
  padding-left: 20px;
}
.markdown-content :deep(li) {
  margin: 4px 0;
}
.markdown-content :deep(code) {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}
.markdown-content :deep(pre) {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
}
.markdown-content :deep(pre code) {
  background: none;
  padding: 0;
}
.markdown-content :deep(blockquote) {
  border-left: 4px solid #667eea;
  margin: 8px 0;
  padding-left: 16px;
  color: #666;
}
.markdown-content :deep(strong) {
  color: #667eea;
}

/* 打字指示器 */
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 8px 0;
}
.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #667eea;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out both;
}
.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}
.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}
@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* 输入区域 */
.input-area {
  display: flex;
  gap: 10px;
  padding: 15px;
  background: white;
  border-top: 1px solid #e0e0e0;
}
.input-area textarea {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: none;
  height: 60px;
  font-family: inherit;
  font-size: 14px;
  transition: all 0.3s;
}
.input-area textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
}
.input-area textarea:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}
.input-area button {
  padding: 0 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 16px;
  transition: all 0.3s;
  min-width: 100px;
}
.input-area button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102,126,234,0.4);
}
.input-area button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.input-area button.sending {
  background: #999;
}

/* 页脚 */
.footer {
  text-align: center;
  padding: 30px;
  background: #2c3e50;
  color: #ecf0f1;
  margin-top: auto;
}
.footer a {
  color: #667eea;
  text-decoration: none;
  margin: 0 5px;
}
.footer a:hover {
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar {
    padding: 0 20px;
  }
  .logo {
    font-size: 18px;
  }
  .nav-links {
    gap: 15px;
  }
  .nav-link {
    font-size: 14px;
  }
  .carousel-container {
    padding: 15px 20px 0;
  }
  .carousel-item img {
    height: 250px;
  }
  .carousel-caption h3 {
    font-size: 20px;
  }
  .carousel-caption p {
    font-size: 12px;
  }
  .search-section {
    padding: 30px 20px;
    margin: 15px 20px;
  }
  .support-section {
    padding: 20px;
    margin: 0 20px 20px;
  }
  .chat-container {
    height: 400px;
  }
  .message {
    max-width: 95%;
  }
}
</style>
