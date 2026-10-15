<template>
  <div class="login-container">
    <div class="login-card">
      <div class="card-header">
        <h2>AI面试平台</h2>
        <p class="subtitle">请选择身份并登录你的账号</p>
      </div>

      <!-- 身份切换栏 -->
      <div class="role-tabs">
        <div 
          class="tab" 
          :class="{ active: loginType === 'user' }"
          @click="loginType = 'user'"
        >
          用户端登录
        </div>
        <div 
          class="tab" 
          :class="{ active: loginType === 'admin' }"
          @click="loginType = 'admin'"
        >
          管理端登录
        </div>
      </div>

      <!-- 管理端登录：仅账号密码 -->
      <form v-if="loginType === 'admin'" @submit.prevent="handleLogin">
        <div class="input-group">
          <label>用户名</label>
          <div class="input-wrapper">
            <span class="input-icon">👤</span>
            <input 
              type="text" 
              placeholder="请输入用户名" 
              v-model="loginForm.userName"  
            >
          </div>
        </div>

        <div class="input-group">
          <label>密码</label>
          <div class="input-wrapper">
            <span class="input-icon">🔒</span>
            <input 
              type="password" 
              placeholder="请输入密码" 
              v-model="loginForm.passWord"  
            >
          </div>
        </div>

        <button 
          type="submit"  
          class="login-button" 
          :disabled="loading"  
        >
          {{ loading ? '登录中...' : '登 录' }}
        </button>
      </form>

      <!-- 用户端登录：仅账号密码 -->
      <form v-else @submit.prevent="handleLogin">
        <div class="input-group">
          <label>用户名</label>
          <div class="input-wrapper">
            <span class="input-icon">👤</span>
            <input 
              type="text" 
              placeholder="请输入用户名" 
              v-model="loginForm.userName"  
            />
          </div>
        </div>

        <div class="input-group">
          <label>密码</label>
          <div class="input-wrapper">
            <span class="input-icon">🔒</span>
            <input 
              type="password" 
              placeholder="请输入密码" 
              v-model="loginForm.password"  
            />
          </div>
        </div>

        <div class="form-actions">
          <span class="link" @click="showRegister = true">还没有账号？去注册</span>
        </div>

        <button 
          type="submit"  
          class="login-button" 
          :disabled="loading"  
        >
          {{ loading ? '登录中...' : '登 录' }}
        </button>
      </form>
    </div>

    <!-- 注册弹窗 -->
    <div v-if="showRegister" class="modal-overlay" @click="handleModalClose">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>用户注册</h3>
          <span class="close" @click="showRegister = false">×</span>
        </div>
        <form @submit.prevent="handleRegister">
          <div class="input-group">
            <label>手机号</label>
            <div class="input-wrapper">
              <span class="input-icon">📱</span>
              <input 
                type="tel" 
                placeholder="请输入手机号" 
                v-model="registerForm.phone"  
              />
            </div>
          </div>

          <div class="input-group">
            <label>验证码</label>
            <div class="input-wrapper sms-wrapper">
              <span class="input-icon">✉️</span>
              <input 
                type="text" 
                placeholder="请输入验证码" 
                v-model="registerForm.code"  
              />
              <button 
                type="button" 
                class="sms-btn"
                :disabled="registerCountdown > 0 || !registerForm.phone"
                @click="sendSmsCode('register')"
              >
                {{ registerCountdown > 0 ? `${registerCountdown}s后重发` : '获取验证码' }}
              </button>
            </div>
          </div>

          <div class="input-group">
            <label>用户名</label>
            <div class="input-wrapper">
              <span class="input-icon">👤</span>
              <input 
                type="text" 
                placeholder="请输入用户名" 
                v-model="registerForm.userName"  
              />
            </div>
          </div>

          <div class="input-group">
            <label>昵称</label>
            <div class="input-wrapper">
              <span class="input-icon">🪪</span>
              <input 
                type="text" 
                placeholder="请输入昵称" 
                v-model="registerForm.nickName"  
              />
            </div>
          </div>

          <div class="input-group">
            <label>密码</label>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input 
                type="password" 
                placeholder="请输入密码" 
                v-model="registerForm.password"  
              />
            </div>
          </div>

          <button 
            type="submit"  
            class="login-button" 
            :disabled="loading"  
          >
            {{ loading ? '注册中...' : '注 册' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { reqAdminLogin, reqUserLogin, reqSendCode, reqUserRegister } from '@/api/request'
import { ElMessage } from 'element-plus'

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter()

    const loginType = ref('user')
    const showRegister = ref(false)
    const loading = ref(false)

    const loginForm = reactive({
      userName: '',
      passWord: '',
      password: ''
    })

    const registerForm = reactive({
      phone: '',
      code: '',
      userName: '',
      nickName: '',
      password: ''
    })

    const registerCountdown = ref(0)
    let registerTimer = null

    const sendSmsCode = async (type) => {
      let phone = registerForm.phone

      if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
        ElMessage.warning('请输入正确的手机号！')
        return
      }

      try {
        await reqSendCode(phone)
        ElMessage.success('验证码发送成功！')
        
        registerCountdown.value = 60
        registerTimer = setInterval(() => {
          registerCountdown.value--
          if (registerCountdown.value <= 0) {
            clearInterval(registerTimer)
            registerTimer = null
          }
        }, 1000)
      } catch (error) {
        console.error('发送验证码失败：', error)
        ElMessage.error('发送验证码失败')
      }
    }

    
   
// 登录
const handleLogin = async () => {
  if (!loginForm.userName) {
    ElMessage.warning('请输入用户名！')
    return
  }
  const checkPwd = loginType.value === 'admin' ? loginForm.passWord : loginForm.password
  if (!checkPwd) {
    ElMessage.warning('请输入密码！')
    return
  }

  loading.value = true
  try {
    let response
    let redirectPath = ''

    if (loginType.value === 'admin') {
      response = await reqAdminLogin({
        userName: loginForm.userName,
        passWord: loginForm.passWord
      })
      redirectPath = '/home'
    } else {
      response = await reqUserLogin({
        userName: loginForm.userName,
        password: loginForm.password
      })
      redirectPath = '/user-home'
    }

    const token = response?.data?.token
    console.log('【完整响应】', response)
    console.log('【token】', token)
    console.log('【跳转路径】', redirectPath)

    if (token) {
      localStorage.setItem('token', token)
      console.log('【token已存储】', localStorage.getItem('token'))
      ElMessage.success('登录成功！正在跳转...')
      
      // 直接跳转，不使用setTimeout避免页面刷新
      router.push(redirectPath).catch(err => {
        console.error('路由跳转失败：', err)
      })
      
    } else {
      throw new Error('无 token')
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('登录失败')
  } finally {
    loading.value = false
  }
}
    const handleRegister = async () => {
      if (!registerForm.phone) {
        ElMessage.warning('请输入手机号！')
        return
      }
      if (!registerForm.code) {
        ElMessage.warning('请输入验证码！')
        return
      }
      if (!registerForm.userName) {
        ElMessage.warning('请输入用户名！')
        return
      }
      if (!registerForm.nickName) {
        ElMessage.warning('请输入昵称！')
        return
      }
      if (!registerForm.password) {
        ElMessage.warning('请输入密码！')
        return
      }

      loading.value = true
      try {
        await reqUserRegister({
          userName: registerForm.userName,
          password: registerForm.password,
          code: registerForm.code,
          phone: registerForm.phone,
          nickName: registerForm.nickName
        })

        ElMessage.success('注册成功！请登录')
        showRegister.value = false
        Object.assign(registerForm, {
          phone: '',
          code: '',
          userName: '',
          nickName: '',
          password: ''
        })
        loginForm.userName = registerForm.userName
      } catch (error) {
        console.error('注册错误：', error)
        ElMessage.error('注册失败：' + (error.message || '未知错误'))
      } finally {
        loading.value = false
      }
    }

    const handleModalClose = () => {
      showRegister.value = false
    }

    onUnmounted(() => {
      if (registerTimer) {
        clearInterval(registerTimer)
      }
    })

    return {
      loginType,
      showRegister,
      loading,
      loginForm,
      registerForm,
      registerCountdown,
      sendSmsCode,
      handleLogin,
      handleRegister,
      handleModalClose
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.card-header {
  text-align: center;
  margin-bottom: 20px;
}
.card-header h2 {
  color: #333;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
}
.subtitle {
  color: #666;
  font-size: 14px;
}

/* 身份选项卡 */
.role-tabs {
  display: flex;
  border: 1px solid #eee;
  border-radius: 6px;
  margin-bottom: 25px;
  overflow: hidden;
}
.tab {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  cursor: pointer;
  font-size: 15px;
  color: #666;
  transition: all 0.3s;
}
.tab.active {
  background: #667eea;
  color: white;
  font-weight: 500;
}

.input-group {
  margin-bottom: 20px;
}
.input-group label {
  display: block;
  margin-bottom: 6px;
  color: #333;
  font-size: 14px;
  font-weight: 500;
}
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  transition: all 0.3s;
}
.input-wrapper:hover {
  border-color: #667eea;
}
.input-wrapper:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}
.input-icon {
  padding: 0 12px;
  color: #999;
  font-size: 16px;
}
.input-wrapper input {
  width: 100%;
  padding: 12px 12px 12px 0;
  border: none;
  background: transparent;
  font-size: 14px;
  outline: none;
}

.sms-wrapper {
  display: flex;
  align-items: center;
}
.sms-wrapper input {
  flex: 1;
}
.sms-btn {
  padding: 0 12px;
  height: 40px;
  border: none;
  background: #667eea;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  white-space: nowrap;
}
.sms-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
.link {
  color: #667eea;
  font-size: 13px;
  cursor: pointer;
}
.link:hover {
  text-decoration: underline;
}

.login-button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.3s;
}
.login-button:hover {
  opacity: 0.9;
}
.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 注册弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  border-radius: 8px;
  padding: 30px;
  width: 90%;
  max-width: 400px;
  position: relative;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.modal-header h3 {
  font-size: 20px;
  color: #333;
}
.close {
  font-size: 24px;
  color: #999;
  cursor: pointer;
}
.close:hover {
  color: #333;
}
</style>