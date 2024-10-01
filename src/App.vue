<script setup>
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "@/components/HelloWorld.vue";
import AppLayout from "@/components/layout/AppLayout.vue";
import { onMounted } from "vue";

onMounted(() => {
  document.title = "Transporter"
});
</script>

<template>
  <RouterView />
</template>

<style lang="scss">
@import "./assets/styles/app.scss";
</style>
<style>
.p-datatable .p-datatable-tbody>tr>td {
  padding: 8px !important;
}
</style>