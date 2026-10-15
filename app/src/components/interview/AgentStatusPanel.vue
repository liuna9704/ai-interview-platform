<template>
  <el-card shadow="never" class="agent-panel">
    <template #header><div class="title"><strong>🤖 评估智能体状态</strong><el-tag :type="finishSuggested ? 'success' : 'primary'">{{ finishSuggested ? '证据充足' : '分析中' }}</el-tag></div></template>
    <div class="current"><small>正在评估</small><strong>{{ state.currentCompetency || "等待开始" }}</strong></div>
    <div class="coverage-title"><span>能力覆盖</span><strong>{{ state.coveredCompetencyCount || 0 }} / {{ totalCompetencies }}</strong></div>
    <el-progress :percentage="state.coverage || 0" :stroke-width="10" />
    <el-descriptions :column="1" border size="small" class="details">
      <el-descriptions-item label="当前阶段">{{ state.currentStage || "准备阶段" }}</el-descriptions-item>
      <el-descriptions-item label="已收集证据">{{ evidenceCount }} 条</el-descriptions-item>
      <el-descriptions-item label="最近一次分析">{{ state.latestAnalysis || "等待候选人回答" }}</el-descriptions-item>
      <el-descriptions-item label="AI下一步策略">{{ state.decision?.nextTarget || "从简历项目开始验证" }}</el-descriptions-item>
      <el-descriptions-item label="追问原因">{{ state.decision?.reason || state.followUpReason || "建立初始能力证据" }}</el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>
<script setup>defineProps({state:{type:Object,default:()=>({})},evidenceCount:{type:Number,default:0},totalCompetencies:{type:Number,default:5},finishSuggested:{type:Boolean,default:false}});</script>
<style scoped>.agent-panel{border-color:#c6e2ff}.title,.coverage-title{display:flex;align-items:center;justify-content:space-between}.current{padding:2px 0 14px}.current small{display:block;color:#909399;margin-bottom:5px}.current strong{font-size:18px;color:#337ecc}.coverage-title{margin-bottom:8px;font-size:13px}.details{margin-top:14px}</style>
