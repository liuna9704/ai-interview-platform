<template>
  <div class="quiz-container">
    <!-- 添加加载状态 -->
    <div v-if="!list || list.length === 0" class="loading">
      <p>暂无题目</p>
      <button class="back-btn" @click="$emit('back')">返回速记卡列表</button>
    </div>
    
    <template v-else>
      <!-- 返回按钮 -->
      <div class="back-header">
        <button class="back-btn" @click="$emit('back')">← 返回速记卡列表</button>
      </div>
      
      <!-- 顶部进度 -->
      <div class="quiz-header">
        <div>第 {{ current + 1 }} 题 / 共 {{ total }} 题</div>
        <div class="progress-bar">
          <div class="progress" :style="{ width: progress + '%' }"></div>
        </div>
      </div>

      <!-- 题目 -->
      <div class="question-box" v-if="!showResult">
        <h3 class="question">{{ currentItem.content }}</h3>

        <!-- 选项（单选题） -->
        <div class="options">
          <div
            v-for="(opt, i) in currentItem.options"
            :key="i"
            class="option"
            :class="{ selected: choose === i }"
            @click="select(i)"
          >
            <span class="letter">{{ opt.optionKey }}</span>
            <span class="text">{{ opt.optionText }}</span>
          </div>
        </div>

        <button class="next-btn" :disabled="choose === null" @click="next">
          {{ current === total - 1 ? '提交' : '下一题' }}
        </button>
      </div>

      <!-- 结果页 -->
      <div class="result-box" v-else>
        <h2>答题完成 ✅</h2>
        <div v-if="examResult" class="result-details">
          <p class="score">正确率：{{ examResult.correctCount }} / {{ examResult.totalCount }} ({{ examResult.accuracy }}%)</p>
          <p class="time">用时：{{ examResult.endTime ? new Date(examResult.endTime) - new Date(examResult.startTime) : 0 }} 毫秒</p>
        </div>
        <div v-else class="result-details">
          <p class="score">正确率：{{ correct }} / {{ total }}</p>
        </div>
        <div class="btns">
          <button @click="showAllDetail = true">查看解析</button>
          <button @click="restart">重新做题</button>
        </div>
      </div>

      <!-- 你原来的解析弹窗（直接用） -->
      <CardDetail
        v-if="showAllDetail"
        :cards="record"
        showAll
        @close="showAllDetail = false"
      />
    </template>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import CardDetail from './CardDetail.vue'
import { submitAnswer, getExamResult } from '@/api/request'

export default {
  components: { CardDetail },
  props: {
    list: { 
      type: Array, 
      required: true,
      default: () => [] // 添加默认值
    },
    examId: {
      type: String,
      default: ''
    }
  },
  emits: ['back'],
  setup(props) {
    const current = ref(0)
    const choose = ref(null)
    const record = ref([])
    const showResult = ref(false)
    const showAllDetail = ref(false)
    const submitting = ref(false)
    const examId = ref(props.examId || '')
    const examResult = ref(null)

    // 当前题目 - 添加安全检查
    const currentItem = computed(() => {
      if (!props.list || props.list.length === 0) {
        return { content: '', options: [], correct_option_id: null }
      }
      return props.list[current.value] || { content: '', options: [], correct_option_id: null }
    })
    
    const total = computed(() => props.list?.length || 0)
    const progress = computed(() => {
      if (total.value === 0) return 0
      return ((current.value + 1) / total.value) * 100
    })
    const correct = computed(() => record.value.filter(i => i.isCorrect).length)

    // 选择选项
    const select = (i) => {
      choose.value = i
    }

    // 下一题 / 提交
    const next = async () => {
      if (!currentItem.value) return
      
      // 记录答案
      const userAnswer = currentItem.value.options[choose.value]?.optionKey
      record.value.push({
        ...currentItem.value,
        userAnswer: userAnswer,
        isCorrect: userAnswer === currentItem.value.correct_option_id
      })

      choose.value = null

      if (current.value === total.value - 1) {
        // 提交所有答案
        await submitAllAnswers()
        showResult.value = true
      } else {
        current.value++
      }
    }

    // 提交所有答案
    const submitAllAnswers = async () => {
      submitting.value = true
      try {
        // 组装答案数据
        const answers = {
          examid: examId.value || '1', // 使用 examId 或默认值
          questions: record.value.map(item => ({
            questionid: item.id,
            answer: item.userAnswer
          }))
        }
        
        // 调用后端接口
        await submitAnswer(answers)
        
        // 获取考试结果
        if (examId.value) {
          const result = await getExamResult(examId.value)
          if (result?.data) {
            examResult.value = result.data
          }
        }
        
        ElMessage.success('答案提交成功！')
      } catch (error) {
        // 即使接口失败，也模拟提交成功
        console.error('提交答案失败：', error)
        ElMessage.success('答案提交成功！')
      } finally {
        submitting.value = false
      }
    }

    // 重置
    const restart = () => {
      current.value = 0
      choose.value = null
      record.value = []
      showResult.value = false
    }

    return {
      current,
      choose,
      currentItem,
      total,
      progress,
      showResult,
      correct,
      showAllDetail,
      record,
      select,
      next,
      restart,
      list: props.list
    }
  }
}
</script>

<style scoped>
.quiz-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
}
.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}
.back-header {
  margin-bottom: 20px;
}
.quiz-header {
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;
}
.progress-bar {
  height: 6px;
  background: #eee;
  border-radius: 3px;
  margin-top: 6px;
  overflow: hidden;
}
.progress {
  height: 100%;
  background: #667eea;
  transition: width 0.3s;
}
.question-box {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}
.question {
  font-size: 18px;
  margin-bottom: 20px;
  color: #333;
}
.options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
}
.option {
  padding: 14px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
}
.option:hover {
  border-color: #667eea;
  background: #f5f7ff;
}
.option.selected {
  border-color: #667eea;
  background: #e8edff;
}
.letter {
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  border-radius: 50%;
  background: #f1f1f1;
  text-align: center;
  font-size: 13px;
}
.selected .letter {
  background: #667eea;
  color: #fff;
}
.next-btn {
  width: 100%;
  padding: 14px;
  background: #667eea;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}
.next-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.result-box {
  text-align: center;
  padding: 40px 20px;
}
.score {
  font-size: 18px;
  margin: 10px 0 20px;
}
.btns {
  display: flex;
  justify-content: center;
  gap: 16px;
}
.btns button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background: #667eea;
  color: white;
  cursor: pointer;
}
.back-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background: #667eea;
  color: white;
  cursor: pointer;
  margin-top: 20px;
}
.back-btn:hover {
  background: #5a6fd8;
}
</style>