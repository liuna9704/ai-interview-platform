<template><div ref="chartRef" class="radar"></div></template>
<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import * as echarts from "echarts";
const props = defineProps({ competencies: { type: Array, default: () => [] } });
const chartRef = ref(null); let chart;
const render = async () => { await nextTick(); if (!chartRef.value) return; chart ||= echarts.init(chartRef.value); chart.setOption({ tooltip:{}, legend:{data:["候选人","岗位目标"],bottom:0}, radar:{indicator:props.competencies.map(i=>({name:i.name,max:100}))}, series:[{type:"radar",data:[{name:"候选人",value:props.competencies.map(i=>i.score)},{name:"岗位目标",value:props.competencies.map(i=>i.targetScore)}]}] }); };
const resize=()=>chart?.resize(); onMounted(()=>{render();window.addEventListener("resize",resize)}); watch(()=>props.competencies,render,{deep:true}); onBeforeUnmount(()=>{window.removeEventListener("resize",resize);chart?.dispose()});
</script>
<style scoped>.radar{width:100%;height:360px}</style>
