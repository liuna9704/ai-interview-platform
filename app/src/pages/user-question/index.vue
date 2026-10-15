<template>
  <div class="question-container">
    <!-- 顶部导航 -->
    <nav class="navbar">
      <div class="logo">AI面试平台</div>
      <div class="nav-links">
        <router-link to="/user-home" class="nav-link">首页</router-link>
        <router-link to="/interview-prepare" class="nav-link">面试准备</router-link>
        <router-link to="/aicoach" class="nav-link">ai教练</router-link>
        <router-link to="/user-question" class="nav-link">题目库</router-link>
        <router-link to="/user" class="nav-link">用户</router-link>
        <button @click="handleLogout" class="logout-btn">退出登录</button>
      </div>
    </nav>

    <!-- 内容区域 -->
    <div class="content-wrapper">
      <!-- 标签切换 -->
      <div class="tab-header">
        <div
          class="tab-item"
          :class="{ active: activeTab === 'knowledge' }"
          @click="activeTab = 'knowledge'"
        >
          📚 面试知识点
        </div>
        <div
          class="tab-item"
          :class="{ active: activeTab === 'flashcard' }"
          @click="activeTab = 'flashcard'"
        >
          🎴 发现速记卡
        </div>
      </div>

      <!-- 面试知识点内容 -->
      <div v-if="activeTab === 'knowledge'" class="knowledge-content">
        <!-- 搜索 + 筛选区域 -->
        <div class="query-bar">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索题目关键词"
            style="width: 240px"
            clearable
            @keyup.enter="handleSearch"
          />

          <el-select
            v-model="searchTag"
            placeholder="按标签筛选"
            style="width: 180px"
            clearable
          >
            <el-option label="Spring" value="Spring" />
            <el-option label="设计模式" value="设计模式" />
            <el-option label="API" value="API" />
            <el-option label="数据库" value="数据库" />
            <el-option label="架构" value="架构" />
            <el-option label="事务" value="事务" />
            <el-option label="REST" value="REST" />
            <el-option label="JWT" value="JWT" />
            <el-option label="认证" value="认证" />
            <el-option label="安全" value="安全" />
          </el-select>

          <el-select
            v-model="searchJob"
            placeholder="按岗位筛选"
            style="width: 180px"
            clearable
          >
            <el-option label="后端开发工程师" value="后端开发工程师" />
            <el-option label="前端开发工程师" value="前端开发工程师" />
            <el-option label="测试工程师" value="测试工程师" />
            <el-option label="产品经理" value="产品经理" />
          </el-select>

          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>

        <!-- 添加题目表单 -->
        <el-form
          :model="questionForm"
          :rules="questionRules"
          ref="questionFormRef"
          label-width="120px"
          class="question-form"
        >
          <el-form-item label="题目标题" prop="questionContent">
            <el-input
              v-model="questionForm.questionContent"
              type="textarea"
              :rows="3"
              placeholder="请输入题目内容"
            />
          </el-form-item>

          <el-form-item label="参考答案" prop="referenceAnswer">
            <el-input
              v-model="questionForm.referenceAnswer"
              type="textarea"
              :rows="3"
              placeholder="请输入参考答案"
            />
          </el-form-item>

          <el-form-item label="评分准则" prop="evaluationCriteria">
            <el-input
              v-model="questionForm.evaluationCriteria"
              type="textarea"
              :rows="2"
              placeholder="请输入评分准则"
            />
          </el-form-item>

          <el-form-item label="难度等级" prop="difficultyLevel">
            <el-radio-group v-model="questionForm.difficultyLevel">
              <el-radio label="1">简单</el-radio>
              <el-radio label="2">中等</el-radio>
              <el-radio label="3">困难</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="适用岗位" prop="jobRole">
            <el-select v-model="questionForm.jobRole" placeholder="请选择岗位">
              <el-option label="后端开发工程师" value="后端开发工程师" />
              <el-option label="前端开发工程师" value="前端开发工程师" />
              <el-option label="测试工程师" value="测试工程师" />
              <el-option label="产品经理" value="产品经理" />
            </el-select>
          </el-form-item>

          <el-form-item label="知识点标签" prop="tags">
            <el-select
              v-model="questionForm.tags"
              multiple
              placeholder="请选择或输入标签"
              style="width: 100%"
              filterable
              allow-create
            >
              <el-option label="Spring" value="Spring" />
              <el-option label="设计模式" value="设计模式" />
              <el-option label="API" value="API" />
              <el-option label="数据库" value="数据库" />
              <el-option label="架构" value="架构" />
              <el-option label="事务" value="事务" />
              <el-option label="REST" value="REST" />
              <el-option label="JWT" value="JWT" />
              <el-option label="认证" value="认证" />
              <el-option label="安全" value="安全" />
            </el-select>
          </el-form-item>

          <el-form-item label="题目来源" prop="source">
            <el-radio-group v-model="questionForm.source">
              <el-radio label="0">公共题目</el-radio>
              <el-radio label="1">企业专用题库</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              @click="handleAddQuestion"
              :loading="addLoading"
            >
              提交题目
            </el-button>
          </el-form-item>
        </el-form>

        <!-- 题目列表 -->
        <div class="question-list">
          <!-- 表格独立表头 -->
          <div class="table-header">
            <div class="header-item">题目内容</div>
            <div class="header-item">难度等级</div>
            <div class="header-item">适用岗位</div>
            <div class="header-item">知识点标签</div>
            <div class="header-item">操作功能</div>
          </div>

          <!-- 题目列表表格 -->
          <el-table
            :data="questionList"
            style="width: 100%"
            :loading="loading"
            row-key="id"
            empty-text="暂无题目数据"
            stripe
            border
          >
            <!-- 题目内容列 -->
            <el-table-column
              prop="questionContent"
              width="432"
              show-overflow-tooltip
              align="left"
            />

            <!-- 难度等级列 -->
            <el-table-column width="135" align="center">
              <template #default="scope">
                <el-tag
                  :type="
                    scope.row.difficultyLevel === 1
                      ? 'success'
                      : scope.row.difficultyLevel === 2
                      ? 'warning'
                      : 'danger'
                  "
                  size="small"
                >
                  {{ 
                    scope.row.difficultyLevel === 1
                      ? "简单"
                      : scope.row.difficultyLevel === 2
                      ? "中等"
                      : scope.row.difficultyLevel === 3
                      ? "困难"
                      : "未知"
                  }}
                </el-tag>
              </template>
            </el-table-column>

            <!-- 适用岗位列 -->
            <el-table-column
              prop="jobRole"
              width="170"
              align="center"
              show-overflow-tooltip
            />

            <!-- 知识点标签列 -->
            <el-table-column
              prop="tags"
              width="200"
              show-overflow-tooltip
              align="center"
            />

            <!-- 操作功能列 -->
            <el-table-column width="360" align="center">
              <template #default="scope">
                <div class="action-buttons">
                  <el-button
                    size="small"
                    :type="scope.row.isLiked ? 'primary' : 'default'"
                    @click="handleLike(scope.row.id)"
                  >
                    {{ scope.row.isLiked ? "已点赞" : "点赞" }}
                  </el-button>

                  <el-button
                    size="small"
                    :type="scope.row.isCollected ? 'success' : 'default'"
                    @click="handleCollect(scope.row.id)"
                  >
                    {{ scope.row.isCollected ? "已收藏" : "收藏" }}
                  </el-button>

                  <el-button
                    size="small"
                    type="info"
                    @click="handleSimilar(scope.row.id)"
                  >
                    相似题目
                  </el-button>

                  <el-button
                    size="small"
                    type="primary"
                    @click="handleViewDetail(scope.row.id)"
                  >
                    查看详情
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 分页 -->
        <el-pagination
          v-model:current-page="pageNum"
          v-model:page-size="pageSize"
          :total="total"
          style="margin-top: 20px; text-align: right"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />

        <!-- 面试知识点详情弹窗 -->
        <el-dialog
          v-model="detailDialogVisible"
          title="面试知识点详情"
          width="900px"
          destroy-on-close
          :close-on-click-modal="false"
          :close-on-press-escape="false"
        >
          <el-descriptions
            v-if="currentQuestionDetail.id"
            :column="4"
            border
            style="width: 100%; font-size: 14px"
            :label-style="{
              background: '#f5f7fa',
              fontWeight: 600,
              color: '#303133',
              width: '120px',
              textAlign: 'right',
            }"
            :content-style="{
              padding: '12px 16px',
              color: '#606266',
            }"
          >
            <!-- 1. 题目ID + 难度等级 -->
            <el-descriptions-item label="题目ID" span="1">
              {{ currentQuestionDetail?.id || "暂无数据" }}
            </el-descriptions-item>
            <el-descriptions-item label="难度等级" span="3">
              <el-tag
                :type="
                  currentQuestionDetail?.difficultyLevel === 1
                    ? 'success'
                    : currentQuestionDetail?.difficultyLevel === 2
                    ? 'warning'
                    : 'danger'
                "
                size="small"
              >
                {{ 
                  currentQuestionDetail?.difficultyLevel === 1
                    ? "简单"
                    : currentQuestionDetail?.difficultyLevel === 2
                    ? "中等"
                    : currentQuestionDetail?.difficultyLevel === 3
                    ? "困难"
                    : "暂无数据"
                }}
              </el-tag>
            </el-descriptions-item>

            <!-- 2. 适用岗位 -->
            <el-descriptions-item label="适用岗位" span="1">
              {{ currentQuestionDetail?.jobRole || "暂无数据" }}
            </el-descriptions-item>

            <!-- 3. 题目内容 -->
            <el-descriptions-item label="题目内容" span="4">
              <div class="detail-content">
                {{ currentQuestionDetail?.questionContent || "暂无数据" }}
              </div>
            </el-descriptions-item>

            <!-- 4. 参考答案 -->
            <el-descriptions-item label="参考答案" span="4">
              <div class="detail-content">
                {{ currentQuestionDetail?.referenceAnswer || "暂无数据" }}
              </div>
            </el-descriptions-item>

            <!-- 5. 评分准则 -->
            <el-descriptions-item label="评分准则" span="4">
              <div class="detail-content">
                {{ currentQuestionDetail?.evaluationCriteria || "暂无数据" }}
              </div>
            </el-descriptions-item>

            <!-- 6. 知识点标签 + 题目来源 -->
            <el-descriptions-item label="知识点标签" span="1">
              <el-tag
                v-for="tag in tagList"
                :key="tag"
                size="small"
                style="margin: 0 4px 4px 0"
              >
                {{ tag }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="题目来源" span="3">
              <el-tag
                :type="currentQuestionDetail?.source === 0 ? 'primary' : 'info'"
                size="small"
              >
                {{ 
                  currentQuestionDetail?.source === 0
                    ? "公共题目"
                    : currentQuestionDetail?.source === 1
                    ? "企业专用题库"
                    : "暂无数据"
                }}
              </el-tag>
            </el-descriptions-item>

            <!-- 7. 创建时间 + 更新时间 -->
            <el-descriptions-item label="创建时间" span="1">
              {{ formatTime(currentQuestionDetail?.createTime) || "暂无数据" }}
            </el-descriptions-item>
            <el-descriptions-item label="更新时间" span="3">
              {{ formatTime(currentQuestionDetail?.updateTime) || "暂无数据" }}
            </el-descriptions-item>

            <!-- 9. 点赞数 + 收藏数 -->
            <el-descriptions-item label="点赞数" span="1">
              <span class="count">{{ currentQuestionDetail?.like || 0 }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="收藏数" span="3">
              <span class="count">{{ currentQuestionDetail?.collect || 0 }}</span>
            </el-descriptions-item>
          </el-descriptions>

          <!-- 弹窗底部按钮 -->
          <template #footer>
            <el-button @click="detailDialogVisible = false">关闭</el-button>
          </template>
        </el-dialog>

        <!-- 相似题弹窗 -->
        <el-dialog v-model="similarDialogVisible" title="相似性搜索(最近的5条)">
          <el-table
            :data="similarQuestionList"
            border
            empty-text="暂无相似题目"
            style="width: 100%"
          >
            <el-table-column
              prop="questionContent"
              label="题目内容"
              min-width="300"
              show-overflow-tooltip
            />
            <el-table-column label="难度等级" width="100">
              <template #default="scope">
                {{ 
                  scope.row.difficultyLevel === 1
                    ? "简单"
                    : scope.row.difficultyLevel === 2
                    ? "中等"
                    : scope.row.difficultyLevel === 3
                    ? "困难"
                    : "未知"
                }}
              </template>
            </el-table-column>
            <el-table-column prop="jobRole" label="适用岗位" width="160" />
            <el-table-column prop="tags" label="知识点标签" width="200" />
          </el-table>
        </el-dialog>
      </div>

      <!-- 速记卡内容 -->
      <div v-else class="flashcard-content">
        <!-- 搜索栏和操作按钮 -->
        <div class="search-bar">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索速记卡..."
            clearable
            @keyup.enter="loadCardList"
          >
            <template #append>
              <el-button @click="loadCardList"><el-icon><Search /></el-icon></el-button>
            </template>
          </el-input>
          <div class="action-buttons">
            <el-button type="primary" @click="showCreateCardDialog = true">
              <el-icon><Plus /></el-icon> 创建速记卡
            </el-button>
          </div>
        </div>

        <!-- 速记卡列表 -->
        <div class="card-list">
          <div
            v-for="card in cardList"
            :key="card.id"
            class="card-item"
            @click="startPractice(card)"
          >
            <div class="card-header">
              <span class="card-type" :class="card.type">{{ card.type === 'ai' ? 'AI生成' : '手动创建' }}</span>
              <span class="card-difficulty">{{ getDifficultyText(card.difficulty) }}</span>
            </div>
            <div class="card-content">
              <h4>{{ card.question || card.content }}</h4>
              <p class="card-answer" v-if="card.answer || card.analysis">{{ card.answer || card.analysis }}</p>
            </div>
            <div class="card-footer">
              <span class="card-date">{{ formatDate(card.createTime) }}</span>
              <div class="card-actions">
                <el-button type="success" size="small" @click.stop="showAddDialog = true">
                  <el-icon><Plus /></el-icon> 添加题目
                </el-button>
                <el-button type="primary" size="small" @click.stop="startPractice(card)">开始答题</el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="cardList.length === 0" class="empty-state">
          <el-empty description="暂无速记卡，点击上方按钮添加" />
        </div>
      </div>
    </div>

    <!-- 添加题目对话框 -->
    <el-dialog
      v-model="showAddDialog"
      title="添加题目"
      width="700px"
      :close-on-click-modal="false"
    >
      <el-tabs v-model="activeAddTab">
        <!-- 手动添加 -->
        <el-tab-pane label="手动添加题目" name="manual">
          <div class="manual-add-section">
            <el-form :model="manualForm" :rules="manualRules" ref="manualFormRef" label-width="100px">
              <el-form-item label="*题目" prop="content">
                <el-input
                  v-model="manualForm.content"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入题目内容"
                />
              </el-form-item>

              <el-form-item label="*答案解析" prop="analysis">
                <el-input
                  v-model="manualForm.analysis"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入答案解析"
                />
              </el-form-item>

              <el-form-item label="选项">
                <div class="options-grid">
                  <div v-for="(opt, index) in manualForm.options" :key="index" class="option-item">
                    <span class="option-label">{{ String.fromCharCode(65 + index) }}</span>
                    <el-input
                      v-model="opt.optionText"
                      :placeholder="`选项 ${String.fromCharCode(65 + index)}`"
                      style="flex: 1; margin: 0 10px"
                    />
                    <el-button
                      type="danger"
                      circle
                      size="small"
                      @click="removeOption(index)"
                      :disabled="manualForm.options.length <= 2"
                    >
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                </div>
                <el-button type="primary" text @click="addOption">+ 添加选项</el-button>
              </el-form-item>

              <el-form-item label="*正确答案" prop="correctOption">
                <el-select v-model="manualForm.correctOption" placeholder="请选择正确选项" style="width: 100%">
                  <el-option
                    v-for="(opt, index) in manualForm.options"
                    :key="index"
                    :label="`${String.fromCharCode(65 + index)}: ${opt.optionText || '未填写'}`"
                    :value="String.fromCharCode(65 + index)"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="难度">
                <el-select v-model="manualForm.difficulty" placeholder="请选择难度" style="width: 100%">
                  <el-option label="简单" :value="1" />
                  <el-option label="中等" :value="2" />
                  <el-option label="困难" :value="3" />
                </el-select>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="submitManual" :loading="submitting" style="width: 100%; padding: 12px 0; font-size: 16px">提交创建</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <!-- AI生成 -->
        <el-tab-pane label="AI生成题目" name="ai">
          <el-form :model="aiForm" :rules="aiRules" ref="aiFormRef" label-width="100px">
            <el-form-item label="生成数量" prop="count">
              <el-input-number v-model="aiForm.count" :min="1" :max="10" :step="1" />
            </el-form-item>

            <el-form-item label="难度">
              <el-select v-model="aiForm.difficulty" placeholder="请选择难度">
                <el-option label="简单" :value="1" />
                <el-option label="中等" :value="2" />
                <el-option label="困难" :value="3" />
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submitAIGenerate" :loading="aiGenerating">AI生成题目</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 批量添加 -->
        <el-tab-pane label="批量添加题目" name="batch">
          <el-form :model="batchForm" ref="batchFormRef" label-width="100px">
            <el-form-item label="题目列表">
              <el-input
                v-model="batchForm.questions"
                type="textarea"
                :rows="10"
                placeholder="请输入题目列表，每个题目占一行，格式：题目|||选项A|||选项B|||选项C|||选项D|||正确答案|||解析"
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submitBatchAdd" :loading="batchSubmitting">批量添加</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 题目管理 -->
        <el-tab-pane label="题目管理" name="manage">
          <div class="manage-header">
            <el-button type="danger" @click="batchDelete" :disabled="selectedQuestions.length === 0">
              批量删除
            </el-button>
            <el-button type="primary" @click="loadCardList">刷新列表</el-button>
          </div>
          <el-table :data="manageCardList" @selection-change="handleSelectionChange" style="width: 100%">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="content" label="题目内容" show-overflow-tooltip />
            <el-table-column prop="difficulty" label="难度" width="100">
              <template #default="scope">
                {{ getDifficultyText(scope.row.difficulty) }}
              </template>
            </el-table-column>
          </el-table>
          <div v-if="manageCardList.length === 0" class="empty-state">暂无题目</div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- 答题对话框 -->
    <el-dialog
      v-model="showPracticeDialog"
      title="速记卡练习"
      width="800px"
      :close-on-click-modal="false"
    >
      <div v-if="currentCard" class="practice-content">
        <div class="practice-question">
          <h3>{{ currentCard.question || currentCard.content }}</h3>
        </div>
        
        <div v-if="currentCard.options && currentCard.options.length > 0" class="practice-options">
          <div
            v-for="(opt, index) in currentCard.options"
            :key="index"
            class="option-item-practice"
            :class="{ 
              selected: selectedOption === (opt.optionKey || String.fromCharCode(65 + index)),
              correct: showResult && (opt.optionKey || String.fromCharCode(65 + index)) === (currentCard.correctOptionId || currentCard.correctOption),
              wrong: showResult && selectedOption === (opt.optionKey || String.fromCharCode(65 + index)) && selectedOption !== (currentCard.correctOptionId || currentCard.correctOption)
            }"
            @click="selectOption(opt.optionKey || String.fromCharCode(65 + index))"
          >
            <span class="option-label">{{ opt.optionKey || String.fromCharCode(65 + index) }}</span>
            <span class="option-text">{{ opt.optionText || opt }}</span>
          </div>
        </div>

        <div v-if="showResult" class="practice-result">
          <div :class="['result-text', isCorrect ? 'correct' : 'wrong']">
            {{ isCorrect ? '回答正确！' : '回答错误！' }}
          </div>
          <div class="answer-analysis">
            <h4>答案解析：</h4>
            <p>{{ currentCard.answer || currentCard.analysis }}</p>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button @click="showPracticeDialog = false">关闭</el-button>
        <el-button v-if="!showResult" type="primary" @click="submitAnswer" :disabled="!selectedOption">提交答案</el-button>
        <el-button v-else type="primary" @click="nextCard">下一题</el-button>
      </template>
    </el-dialog>

    <!-- 创建速记卡对话框（简化版） -->
    <el-dialog
      v-model="showCreateCardDialog"
      title="创建速记卡"
      width="600px"
      :close-on-click-modal="false"
    >
      <div class="create-card-section">
        <el-form :model="createCardForm" :rules="createCardRules" ref="createCardFormRef" label-width="100px">
          <el-form-item label="*速记卡名称" prop="name">
            <el-input
              v-model="createCardForm.name"
              placeholder="请输入速记卡名称"
            />
          </el-form-item>

          <el-form-item label="*速记卡描述" prop="description">
            <el-input
              v-model="createCardForm.description"
              type="textarea"
              :rows="3"
              placeholder="请输入速记卡描述"
            />
          </el-form-item>

          <el-form-item label="*难度" prop="difficulty">
            <el-select v-model="createCardForm.difficulty" placeholder="请选择难度" style="width: 100%">
              <el-option label="简单" :value="1" />
              <el-option label="中等" :value="2" />
              <el-option label="困难" :value="3" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <el-button @click="showCreateCardDialog = false">取消</el-button>
        <el-button type="primary" @click="submitCreateCard" :loading="createCardSubmitting">提交创建</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Search } from '@element-plus/icons-vue'
import {
  getAllFlashcards,
  addFlashcardQuestion,
  aiGenerateCard,
  batchAddQuestions,
  batchDeleteQuestions,
  createCardSet,
  getTagList,
  getJobRoleList,
  getQuestionList,
  addQuestion,
  getSimilarQuestion,
  collectQuestion,
  likeQuestion
} from '@/api/request'

export default {
  name: 'QuestionPage',
  components: {
    Plus,
    Delete,
    Search
  },
  setup() {
    const router = useRouter()
    
    // 标签页
    const activeTab = ref('flashcard')
    
    // 搜索关键词
    const searchKeyword = ref('')
    
    // 速记卡列表
    const cardList = ref([])
    // 题目管理列表
    const manageCardList = ref([])
    
    // 面试知识点相关状态
    const searchTag = ref('')
    const searchJob = ref('')
    const pageNum = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    const loading = ref(false)
    const addLoading = ref(false)
    const questionList = ref([])
    const questionFormRef = ref(null)
    const detailDialogVisible = ref(false)
    const similarDialogVisible = ref(false)
    const currentQuestionDetail = ref({})
    const similarQuestionList = ref([])
    
    const jobRoleList = ref([])
    const tagOptions = ref([])
    
    // 添加题目对话框
    const showAddDialog = ref(false)
    const activeAddTab = ref('manual')
    
    // 创建速记卡对话框（简化版）
    const showCreateCardDialog = ref(false)
    const createCardFormRef = ref(null)
    const createCardSubmitting = ref(false)
    const createCardForm = ref({
      name: '',
      description: '',
      difficulty: 1
    })
    const createCardRules = {
      name: [{ required: true, message: '请输入速记卡名称', trigger: 'blur' }],
      description: [{ required: true, message: '请输入速记卡描述', trigger: 'blur' }],
      difficulty: [{ required: true, message: '请选择难度', trigger: 'change' }]
    }
    
    // 手动添加表单
    const manualFormRef = ref(null)
    const submitting = ref(false)
    const manualForm = ref({
      content: '',
      analysis: '',
      options: [
        { optionText: '' },
        { optionText: '' },
        { optionText: '' },
        { optionText: '' }
      ],
      correctOption: '',
      difficulty: 1
    })
    const manualRules = {
      content: [{ required: true, message: '请输入题目内容', trigger: 'blur' }],
      analysis: [{ required: true, message: '请输入答案解析', trigger: 'blur' }],
      correctOption: [{ required: true, message: '请选择正确答案', trigger: 'change' }]
    }
    
    // AI生成表单
    const aiFormRef = ref(null)
    const aiGenerating = ref(false)
    const aiForm = ref({
      count: 5,
      difficulty: 1
    })
    const aiRules = {
      count: [{ required: true, message: '请输入生成数量', trigger: 'blur' }]
    }
    
    // 批量添加表单
    const batchFormRef = ref(null)
    const batchSubmitting = ref(false)
    const batchForm = ref({
      questions: ''
    })
    
    // 题目管理
    const selectedQuestions = ref([])
    
    // 答题对话框
    const showPracticeDialog = ref(false)
    const currentCard = ref(null)
    const selectedOption = ref('')
    const showResult = ref(false)
    const isCorrect = ref(false)
    
    // 面试知识点表单
    const questionForm = ref({
      questionContent: '',
      referenceAnswer: '',
      evaluationCriteria: '',
      difficultyLevel: '',
      jobRole: '',
      tags: [],
      source: '0',
    })
    
    // 表单校验规则
    const questionRules = ref({
      questionContent: [
        { required: true, message: '请输入题目内容', trigger: 'blur' },
      ],
      referenceAnswer: [
        { required: true, message: '请输入参考答案', trigger: 'blur' },
      ],
      difficultyLevel: [
        { required: true, message: '请选择难度等级', trigger: 'change' },
      ],
      jobRole: [
        { required: true, message: '请选择适用岗位', trigger: 'change' },
      ],
      tags: [
        { required: true, message: '请选择知识点标签', trigger: 'change' },
      ],
    })

    // 获取难度文本
    const getDifficultyText = (difficulty) => {
      const map = { 1: '简单', 2: '中等', 3: '困难' }
      return map[difficulty] || '未知'
    }

    // 格式化日期
    const formatDate = (date) => {
      if (!date) return ''
      const d = new Date(date)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    }
    
    // 标签列表计算属性
    const tagList = computed(() => {
      if (!currentQuestionDetail.value) return []
      const tags = currentQuestionDetail.value.tags
      if (Array.isArray(tags)) return tags
      if (typeof tags === "string")
        return tags.split(",").filter((t) => t.trim())
      return []
    })
    
    // 加载岗位列表
    const loadJobRoleList = async () => {
      try {
        const res = await getJobRoleList()
        jobRoleList.value = res.data || []
      } catch (err) {
        console.error("岗位接口请求失败：", err)
        ElMessage.error("岗位加载失败")
      }
    }
    
    // 加载标签列表
    const loadTagList = async () => {
      try {
        const res = await getTagList()
        tagOptions.value = res.data || []
      } catch (err) {
        console.error("标签接口请求失败：", err)
        ElMessage.error("标签加载失败")
      }
    }
    
    // 加载题目列表
    const loadQuestionList = async () => {
      loading.value = true
      try {
        const params = {
          pageNum: pageNum.value,
          pageSize: pageSize.value,
          keyword: searchKeyword.value,
          tag: searchTag.value,
          jobRole: searchJob.value,
        }
        const res = await getQuestionList(params)
        
        // 统一格式化 tags 为数组
        questionList.value = (res.data.records || []).map((item) => {
          let tags = []
          if (Array.isArray(item.tags)) {
            tags = item.tags
          } else if (typeof item.tags === "string") {
            tags = item.tags
              .split(",")
              .map((t) => t.trim())
              .filter((t) => t)
          }
          return { ...item, tags }
        })
        
        total.value = res.data.total || 0
      } catch (error) {
        console.error("题目列表接口请求失败：", error)
        ElMessage.error("加载失败")
      } finally {
        loading.value = false
      }
    }
    
    // 添加题目
    const handleAddQuestion = async () => {
      if (!questionFormRef.value) return
      addLoading.value = true
      try {
        await questionFormRef.value.validate()
        const res = await addQuestion(questionForm.value)
        ElMessage.success("题目添加成功！")
        questionFormRef.value.resetFields()
        loadQuestionList()
      } catch (error) {
        console.error("添加题目接口失败：", error)
        ElMessage.error("提交失败：" + (error.message || "请检查表单"))
      } finally {
        addLoading.value = false
      }
    }
    
    // 搜索题目
    const handleSearch = () => {
      pageNum.value = 1
      loadQuestionList()
    }
    
    // 重置搜索
    const resetSearch = () => {
      searchKeyword.value = ""
      searchTag.value = ""
      searchJob.value = ""
      pageNum.value = 1
      loadQuestionList()
    }
    
    // 分页处理
    const handleSizeChange = (val) => {
      pageSize.value = val
      loadQuestionList()
    }
    
    const handleCurrentChange = (val) => {
      pageNum.value = val
      loadQuestionList()
    }
    
    // 收藏题目
    const handleCollect = async (id) => {
      try {
        const res = await collectQuestion(id)
        const item = questionList.value.find((x) => x.id === id)
        if (item) {
          item.isCollected = !item.isCollected
          item.collect += item.isCollected ? 1 : -1
          ElMessage.success(item.isCollected ? "收藏成功" : "取消收藏")
        }
      } catch (e) {
        console.error(`收藏接口失败 (ID:${id})：`, e)
        ElMessage.error("操作失败")
      }
    }
    
    // 点赞题目
    const handleLike = async (id) => {
      try {
        const res = await likeQuestion(id)
        const item = questionList.value.find((x) => x.id === id)
        if (item) {
          item.isLiked = !item.isLiked
          item.like += item.isLiked ? 1 : -1
          ElMessage.success(item.isLiked ? "点赞成功" : "取消点赞")
        }
      } catch (e) {
        console.error(`点赞接口失败 (ID:${id})：`, e)
        ElMessage.error("操作失败")
      }
    }
    
    // 查看相似题目
    const handleSimilar = async (id) => {
      try {
        const res = await getSimilarQuestion(id)
        similarQuestionList.value = res.data || []
        similarDialogVisible.value = true
      } catch (e) {
        console.error(`相似题接口失败 (ID:${id})：`, e)
        ElMessage.error("获取相似题失败")
      }
    }
    
    // 查看题目详情
    const handleViewDetail = async (id) => {
      try {
        const question = questionList.value.find((q) => q.id === id)
        if (question) {
          currentQuestionDetail.value = { ...question }
          detailDialogVisible.value = true
        } else {
          ElMessage.warning("未找到该题目")
        }
      } catch (error) {
        console.error("加载题目详情失败:", error)
        ElMessage.error("加载失败，请稍后重试")
      }
    }
    
    // 格式化时间
    const formatTime = (timestamp) => {
      if (!timestamp) return ""
      const date = new Date(timestamp)
      return (
        date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0") +
        " " +
        String(date.getHours()).padStart(2, "0") +
        ":" +
        String(date.getMinutes()).padStart(2, "0") +
        ":" +
        String(date.getSeconds()).padStart(2, "0")
      )
    }

    // 加载速记卡列表
    const loadCardList = async () => {
      try {
        const params = searchKeyword.value ? { keyword: searchKeyword.value } : {}
        const response = await getAllFlashcards(params)
        // 检查响应结构，确保获取到正确的数据
        const data = response.data || []
        cardList.value = data
        manageCardList.value = data
      } catch (error) {
        console.error('加载速记卡失败', error)
        // 使用模拟数据
        const mockData = [
          {
            id: 1,
            question: 'Vue 3 的响应式原理是什么？',
            content: 'Vue 3 的响应式原理是什么？',
            answer: 'Vue 3 使用 Proxy 代理对象实现响应式，相比 Vue 2 的 Object.defineProperty，可以监听数组变化和对象属性的增删。',
            analysis: 'Vue 3 使用 Proxy 代理对象实现响应式，相比 Vue 2 的 Object.defineProperty，可以监听数组变化和对象属性的增删。',
            options: [
              { optionText: '使用 Object.defineProperty' },
              { optionText: '使用 Proxy 代理' },
              { optionText: '使用 Object.observe' },
              { optionText: '使用 Reflect API' }
            ],
            correctOption: 'B',
            difficulty: 2,
            type: 'ai',
            createTime: new Date().toISOString()
          },
          {
            id: 2,
            question: '以下哪个是 CSS 中用于创建弹性布局的属性？',
            content: '以下哪个是 CSS 中用于创建弹性布局的属性？',
            answer: 'display: flex 用于创建弹性盒模型布局，可以让子元素灵活排列。',
            analysis: 'display: flex 用于创建弹性盒模型布局，可以让子元素灵活排列。',
            options: [
              { optionText: 'display: block' },
              { optionText: 'display: inline' },
              { optionText: 'display: flex' },
              { optionText: 'display: grid' }
            ],
            correctOption: 'C',
            difficulty: 1,
            type: 'manual',
            createTime: new Date().toISOString()
          }
        ]
        cardList.value = mockData
        manageCardList.value = mockData
      }
    }

    // 添加选项
    const addOption = () => {
      manualForm.value.options.push({ optionText: '' })
    }

    // 删除选项
    const removeOption = (index) => {
      if (manualForm.value.options.length > 2) {
        manualForm.value.options.splice(index, 1)
      }
    }
    
    // 添加创建速记卡选项
    const addCreateCardOption = () => {
      createCardForm.value.options.push({ optionText: '' })
    }

    // 删除创建速记卡选项
    const removeCreateCardOption = (index) => {
      if (createCardForm.value.options.length > 2) {
        createCardForm.value.options.splice(index, 1)
      }
    }

    // 提交创建速记卡（简化版弹窗）
    const submitCreateCard = async () => {
      const valid = await createCardFormRef.value.validate().catch(() => false)
      if (!valid) return

      createCardSubmitting.value = true
      try {
        const data = {
          name: createCardForm.value.name,
          description: createCardForm.value.description,
          difficulty: createCardForm.value.difficulty
        }
        await createCardSet(data)
        ElMessage.success('创建速记卡成功！')
        loadCardList()
        // 重置表单
        createCardForm.value = {
          name: '',
          description: '',
          difficulty: 1
        }
        showCreateCardDialog.value = false
      } catch (error) {
        console.error('创建失败', error)
        ElMessage.error('创建失败，请重试')
      } finally {
        createCardSubmitting.value = false
      }
    }

    // 提交手动添加
    const submitManual = async () => {
      const valid = await manualFormRef.value.validate().catch(() => false)
      if (!valid) return

      submitting.value = true
      try {
        const data = {
          content: manualForm.value.content,
          analysis: manualForm.value.analysis,
          options: manualForm.value.options.filter(o => o.optionText.trim()),
          correctOption: manualForm.value.correctOption,
          difficulty: manualForm.value.difficulty,
          type: 'manual'
        }
        await addFlashcardQuestion(data)
        ElMessage.success('添加成功！')
        showAddDialog.value = false
        loadCardList()
        // 重置表单
        manualForm.value = {
          content: '',
          analysis: '',
          options: [
            { optionText: '' },
            { optionText: '' },
            { optionText: '' },
            { optionText: '' }
          ],
          correctOption: '',
          difficulty: 1
        }
      } catch (error) {
        console.error('添加失败', error)
        ElMessage.error('添加失败，请重试')
      } finally {
        submitting.value = false
      }
    }

    // 提交AI生成
    const submitAIGenerate = async () => {
      const valid = await aiFormRef.value.validate().catch(() => false)
      if (!valid) return

      aiGenerating.value = true
      try {
        await aiGenerateCard({
          count: aiForm.value.count,
          difficulty: aiForm.value.difficulty
        })
        ElMessage.success(`成功生成 ${aiForm.value.count} 道题目！`)
        showAddDialog.value = false
        loadCardList()
      } catch (error) {
        console.error('生成失败', error)
        ElMessage.error('生成失败，请重试')
      } finally {
        aiGenerating.value = false
      }
    }

    // 提交批量添加
    const submitBatchAdd = async () => {
      if (!batchForm.value.questions.trim()) {
        ElMessage.warning('请输入题目列表')
        return
      }

      batchSubmitting.value = true
      try {
        await batchAddQuestions({ questions: batchForm.value.questions })
        ElMessage.success('批量添加成功！')
        showAddDialog.value = false
        loadCardList()
        batchForm.value.questions = ''
      } catch (error) {
        console.error('批量添加失败', error)
        ElMessage.error('批量添加失败，请重试')
      } finally {
        batchSubmitting.value = false
      }
    }

    // 选择变化
    const handleSelectionChange = (selection) => {
      selectedQuestions.value = selection.map(item => item.id)
    }

    // 批量删除
    const batchDelete = async () => {
      if (selectedQuestions.value.length === 0) {
        ElMessage.warning('请选择要删除的题目')
        return
      }

      try {
        await ElMessageBox.confirm(
          `确定要删除选中的 ${selectedQuestions.value.length} 道题目吗？`,
          '确认删除',
          { type: 'warning' }
        )
        await batchDeleteQuestions(selectedQuestions.value)
        ElMessage.success('删除成功！')
        loadCardList()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除失败', error)
          ElMessage.error('删除失败，请重试')
        }
      }
    }

    // 开始答题
    const startPractice = (card) => {
      currentCard.value = card
      selectedOption.value = ''
      showResult.value = false
      isCorrect.value = false
      showPracticeDialog.value = true
    }

    // 选择选项
    const selectOption = (option) => {
      if (!showResult.value) {
        selectedOption.value = option
      }
    }

    // 提交答案
    const submitAnswer = () => {
      if (!selectedOption.value) {
        ElMessage.warning('请选择一个答案')
        return
      }
      isCorrect.value = selectedOption.value === (currentCard.value.correctOptionId || currentCard.value.correctOption)
      showResult.value = true
    }

    // 下一题
    const nextCard = () => {
      const currentIndex = cardList.value.findIndex(c => c.id === currentCard.value.id)
      if (currentIndex < cardList.value.length - 1) {
        currentCard.value = cardList.value[currentIndex + 1]
        selectedOption.value = ''
        showResult.value = false
        isCorrect.value = false
      } else {
        ElMessage.success('已经是最后一题了！')
        showPracticeDialog.value = false
      }
    }

    // 退出登录
    const handleLogout = () => {
      localStorage.removeItem('token')
      router.push('/login')
    }

    onMounted(() => {
      loadCardList()
      loadQuestionList()
      loadJobRoleList()
      loadTagList()
    })

    return {
      activeTab,
      searchKeyword,
      cardList,
      manageCardList,
      showAddDialog,
      activeAddTab,
      manualFormRef,
      manualForm,
      manualRules,
      submitting,
      aiFormRef,
      aiForm,
      aiRules,
      aiGenerating,
      batchFormRef,
      batchForm,
      batchSubmitting,
      selectedQuestions,
      showPracticeDialog,
      currentCard,
      selectedOption,
      showResult,
      isCorrect,
      getDifficultyText,
      formatDate,
      loadCardList,
      addOption,
      removeOption,
      submitManual,
      submitAIGenerate,
      submitBatchAdd,
      handleSelectionChange,
      batchDelete,
      startPractice,
      selectOption,
      submitAnswer,
      nextCard,
      handleLogout,
      // 创建速记卡（简化版）
      showCreateCardDialog,
      createCardFormRef,
      createCardForm,
      createCardRules,
      createCardSubmitting,
      addCreateCardOption,
      removeCreateCardOption,
      submitCreateCard,
      // 面试知识点相关
      searchTag,
      searchJob,
      pageNum,
      pageSize,
      total,
      loading,
      addLoading,
      questionList,
      questionForm,
      questionRules,
      questionFormRef,
      detailDialogVisible,
      similarDialogVisible,
      currentQuestionDetail,
      similarQuestionList,
      tagList,
      jobRoleList,
      tagOptions,
      handleAddQuestion,
      handleSearch,
      resetSearch,
      handleSizeChange,
      handleCurrentChange,
      handleCollect,
      handleLike,
      handleSimilar,
      handleViewDetail,
      formatTime,
      loadQuestionList,
      loadJobRoleList,
      loadTagList
    }
  }
}
</script>

<style scoped>
.question-container {
  min-height: 100vh;
  background: #f5f7fa;
}

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

/* 内容区域 */
.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 标签切换 */
.tab-header {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.tab-item {
  padding: 12px 24px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s;
  font-weight: 500;
}
.tab-item:hover {
  background: #f0f0f0;
}
.tab-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* 面试知识点占位 */
.knowledge-content {
  background: white;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
}
.placeholder-text {
  color: #999;
  font-size: 16px;
}

/* 创建速记卡弹窗 */
.create-card-section {
  padding: 20px 0;
}

.create-card-section h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

/* 速记卡内容 */
.flashcard-content {
  background: white;
  padding: 20px;
  border-radius: 12px;
  min-height: 500px;
}

/* 搜索栏 */
.search-bar {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
}
.search-bar .el-input {
  flex: 1;
  max-width: 400px;
}

/* 操作按钮组 */
.action-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
}

/* 操作栏 */
.action-bar {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 速记卡列表 */
.card-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
.card-item {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #e0e0e0;
}
.card-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}
.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}
.card-type {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}
.card-type.ai {
  background: #e3f2fd;
  color: #1976d2;
}
.card-type.manual {
  background: #f3e5f5;
  color: #7b1fa2;
}
.card-difficulty {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  background: #fff3e0;
  color: #f57c00;
}
.card-content h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
  line-height: 1.5;
  color: #333;
}
.card-answer {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
}
.card-date {
  color: #999;
  font-size: 12px;
}

.card-actions {
  display: flex;
  gap: 8px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

/* 手动添加部分 */
.manual-add-section h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

/* 选项网格 */
.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 15px;
}

/* 选项样式 */
.option-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.options-grid .option-item {
  margin-bottom: 0;
}

.option-item .option-label {
  width: 30px;
  font-weight: bold;
  color: #666;
}

.option-item .el-input {
  flex: 1;
}

/* 题目管理 */
.manage-header {
  margin-bottom: 16px;
  display: flex;
  gap: 10px;
}

/* 答题样式 */
.practice-content {
  padding: 20px;
}
.practice-question {
  margin-bottom: 30px;
}
.practice-question h3 {
  font-size: 18px;
  line-height: 1.6;
  color: #333;
}
.practice-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 30px;
}
.option-item-practice {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}
.option-item-practice:hover {
  background: #e8e8e8;
}
.option-item-practice.selected {
  border-color: #667eea;
  background: #f0f0ff;
}
.option-item-practice.correct {
  border-color: #4caf50;
  background: #e8f5e9;
}
.option-item-practice.wrong {
  border-color: #f44336;
  background: #ffebee;
}
.option-label {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  margin-right: 12px;
  font-weight: bold;
  color: #666;
}
.option-text {
  flex: 1;
  font-size: 15px;
}
.practice-result {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}
.result-text {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
}
.result-text.correct {
  color: #4caf50;
}
.result-text.wrong {
  color: #f44336;
}
.answer-analysis h4 {
  margin-bottom: 8px;
  color: #333;
}
.answer-analysis p {
  color: #666;
  line-height: 1.6;
}

/* 面试知识点相关样式 */
.knowledge-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.query-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.question-form {
  margin-bottom: 30px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
}

.question-list {
  margin-top: 20px;
}

.table-header {
  display: flex;
  align-items: center;
  background: #f5f7fa;
  border: 1px solid #e6e6e6;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  padding: 0 10px;
  height: 55px;
  font-weight: 600;
  color: #303133;
  width: 100%;
  box-sizing: border-box;
}

.header-item {
  flex: 1;
  text-align: center;
}

.detail-content {
  white-space: pre-wrap;
  line-height: 1.8;
  padding: 8px;
  background: #fafafa;
  border-radius: 4px;
}

.count {
  color: #409eff;
  font-weight: 600;
}

/* 响应式 */
@media (max-width: 768px) {
  .navbar {
    padding: 0 20px;
  }
  .nav-links {
    gap: 15px;
  }
  .card-list {
    grid-template-columns: 1fr;
  }
  
  .query-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .query-bar > * {
    width: 100% !important;
  }
  
  .action-buttons {
    flex-wrap: wrap;
  }
  
  .flashcard-content {
    padding: 16px;
  }
}
</style>
