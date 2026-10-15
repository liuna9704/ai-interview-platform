<template><EvidenceMatrix :summary="evidence"/></template>
<script setup>import EvidenceMatrix from "@/components/competency/EvidenceMatrix.vue";defineProps({evidence:{type:Array,default:()=>[]}});</script>
