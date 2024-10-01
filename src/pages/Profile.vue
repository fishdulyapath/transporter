<script setup>
import AppLayout from "@/components/layout/AppLayout.vue";
import MainContentWarp from "@/components/MainContentWarp.vue";

import { useToast } from "primevue/usetoast";

const toast = useToast();

const showSuccess = () => {
  toast.add({
    severity: "success",
    summary: "Success Message",
    detail: "Message Content",
    life: 3000,
  });
};
const showError = () => {
  toast.add({
    severity: "error",
    summary: "Error Message",
    detail: "Message Content",
    life: 3000,
  });
};
</script>

<template>
  <AppLayout>
    <MainContentWarp>
      <div>Profile</div>
      <div>
        <Button label="Success" class="p-button-success" @click="showSuccess" />
        <Button label="Error" class="p-button-danger" @click="showError" />
      </div>
    </MainContentWarp>
  </AppLayout>
</template>
