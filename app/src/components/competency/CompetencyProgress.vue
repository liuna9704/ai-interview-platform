<template>
  <el-card shadow="never" class="panel">
    <template #header><strong>胜任力进度</strong></template>
    <div v-for="item in competencies" :key="item.id" class="progress-item">
      <div class="progress-title"><span>{{ item.name }}</span><span>{{ item.score }} / {{ item.targetScore }}</span></div>
      <el-progress :percentage="item.score" :status="item.score >= item.targetScore ? 'success' : ''" />
    </div>
  </el-card>
</template>
<script setup>
defineProps({ competencies: { type: Array, default: () => [] } });
</script>
<style scoped>.panel{height:100%}.progress-item{margin-bottom:18px}.progress-title{display:flex;justify-content:space-between;margin-bottom:8px;color:#303133;font-size:14px}</style>
