<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthen } from "@/stores/authen.js";
import { useApp } from "@/stores/app.js";

const storeApp = useApp();
const store = useAuthen();
const router = useRouter();

onMounted(() => {
  storeApp.setPageTitle("ออกจากระบบ");
  store.logout();
  setTimeout(() => {
    router.push('/login')
  }, 1000);
});
</script>
<template>
  <div class="w-full">
    <div class="surface-card border-round shadow-2 p-4 text-center">
    </div>
  </div>
</template>
