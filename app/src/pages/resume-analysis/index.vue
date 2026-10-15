<template>
  <div class="page-shell">
    <header class="page-header">
      <div><el-tag>第 1 步 / 4</el-tag><h1>简历智能分析</h1><p>AI 将从简历中提取经历、技能和可验证的能力证据</p></div>
      <el-button @click="router.push('/user-home')">返回首页</el-button>
    </header>
    <el-steps :active="0" finish-status="success" class="flow"><el-step title="简历分析"/><el-step title="岗位建模"/><el-step title="人岗匹配"/><el-step title="评估方案"/></el-steps>
    <el-row :gutter="20">
      <el-col :xs="24" :lg="8">
        <el-card shadow="never">
          <template #header><strong>上传候选人简历</strong></template>
          <el-upload v-model:file-list="files" drag :auto-upload="false" :limit="1" accept=".pdf,.txt,.doc,.docx" @change="onFileChange">
            <div class="upload-icon">📄</div><div>拖拽简历到此处，或点击选择文件</div><small>比赛 Demo 支持任意示例文件，解析使用 Mock 数据</small>
          </el-upload>
          <el-button type="primary" size="large" class="wide" :loading="loading" @click="analyze">{{ profile.summary ? '重新分析演示简历' : '开始 AI 简历分析' }}</el-button>
          <el-alert title="演示候选人：计算机专业学生" description="项目包含 Vue 校园平台、AI 问答助手和智能巡检机器人。" type="info" :closable="false" class="tip"/>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="16">
        <el-card shadow="never" v-loading="loading">
          <template #header><div class="card-title"><strong>AI 结构化分析结果</strong><el-tag v-if="profile.summary" type="success">解析完成 · {{ profile.completeness }}%</el-tag></div></template>
          <el-empty v-if="!profile.summary" description="上传简历后开始分析"/>
          <template v-else>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="姓名">{{ session.candidate.name }}</el-descriptions-item><el-descriptions-item label="学历">{{ session.candidate.education }}</el-descriptions-item>
              <el-descriptions-item label="个人摘要" :span="2">{{ profile.summary }}</el-descriptions-item>
              <el-descriptions-item label="教育经历" :span="2"><div v-for="item in profile.education" :key="item.school">{{ item.school }} · {{ item.major }} · {{ item.degree }}</div></el-descriptions-item>
              <el-descriptions-item label="技能标签" :span="2"><el-tag v-for="skill in profile.skills" :key="skill" class="tag">{{ skill }}</el-tag></el-descriptions-item>
            </el-descriptions>
            <h3>项目经历</h3><el-timeline><el-timeline-item v-for="item in profile.projects" :key="item.name" :timestamp="item.role" type="primary"><strong>{{ item.name }}</strong><p>{{ item.highlights.join('；') }}</p></el-timeline-item></el-timeline>
            <h3>AI 识别的能力证据</h3><el-row :gutter="12"><el-col v-for="item in profile.abilityEvidence" :key="item.title" :span="8"><el-card shadow="hover" class="evidence-card"><strong>{{ item.title }}</strong><p>{{ item.content }}</p><el-progress :percentage="item.confidence" :stroke-width="8"/></el-card></el-col></el-row>
            <div class="actions"><el-button type="primary" size="large" @click="confirmAndNext">确认简历分析结果，下一步岗位分析</el-button></div>
          </template>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { parseResume } from "@/api/resume";
import { useAssessmentStore } from "@/store/assessment";
const router=useRouter(); const store=useAssessmentStore(); const files=ref([]); const loading=ref(false);
const session=computed(()=>store.session); const profile=computed(()=>session.value.resumeProfile||{});
const onFileChange=(file)=>ElMessage.success(`已选择 ${file.name}，可开始 AI 分析`);
const analyze=async()=>{loading.value=true;try{store.clearAssessment();store.createAssessment({candidate:{id:"CAND-001",name:"林同学",education:"计算机科学与技术本科",graduationYear:2026},status:"draft"});const result=await parseResume(files.value[0]?.raw);store.setResumeProfile(result);(result.abilityEvidence||[]).forEach((item,index)=>store.addEvidence({id:`resume-e${index+1}`,source:"resume",content:item.content,competencyId:item.competencyId,relatedQuestion:"",strength:item.confidence,confidence:item.confidence,supportType:"support"}));ElMessage.success("简历解析完成，已识别 3 条能力证据")}finally{loading.value=false}};
const confirmAndNext=()=>{store.persist();router.push('/job-analysis')};
</script>
<style scoped>.page-shell{min-height:100vh;padding:32px 5%;background:#f5f7fa}.page-header,.card-title{display:flex;justify-content:space-between;align-items:center}.page-header h1{margin:10px 0 4px}.page-header p,small{color:#909399}.flow{margin:28px 0 34px}.upload-icon{font-size:44px;margin-bottom:12px}.wide{width:100%;margin-top:18px}.tip{margin-top:16px}.tag{margin:4px}.evidence-card{height:190px}.evidence-card p{height:76px;color:#606266;line-height:1.6}.actions{text-align:right;margin-top:24px}h3{margin:24px 0 16px}@media(max-width:992px){.el-col{margin-bottom:16px}}</style>
