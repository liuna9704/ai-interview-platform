<template><el-alert :title="title" type="info" :closable="false" show-icon><template #default><p>{{ summary }}</p><p class="formula">综合分 = Σ（能力得分 × 岗位权重），并结合证据置信度给出推荐结论。</p></template></el-alert></template>
<script setup>defineProps({ title:{type:String,default:"评分说明"}, summary:{type:String,default:"评分来自简历与多轮面试证据。"} });</script>
<style scoped>.formula{margin-top:8px;color:#606266}</style>
