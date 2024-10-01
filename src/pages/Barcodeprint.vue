<script setup>
import AppLayout from "@/components/layout/AppLayout.vue";
import MainContentWarp from "@/components/MainContentWarp.vue";
import MasterdataService from "@/services/MasterdataService";
import { useRouter, useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { useApp } from "@/stores/app.js";
import Utils from "@/utils/";

const doc_no = ref("");
const print_detail = ref([]);
const route = useRoute();

onMounted(() => {
  if (
    route.params.id != "" &&
    route.params.id != "" &&
    route.params.id != undefined
  ) {
    doc_no.value = route.params.id;
    getQRDetail();
  }
});

function getQRDetail() {
  MasterdataService.GetQRDetail(doc_no.value)
    .then((res) => {
      console.log(res);
      if (res.success) {
        print_detail.value = res.data;

        setTimeout(() => {
          window.print()
          window.close()
        }, 1500);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
</script>
<template>
  <div
    class="pagex"
    v-for="(data, index) in print_detail"
    :key="index"
    style="align-items: center"
  >
   
    <div style="font-size: 18px; font-weight: bold">
      {{ data.box_no }}
    </div>
    <div>
      <vue-qrcode
        id="imgqr"
        :value="data.box_no"
        :options="{ width: 250 }"
      ></vue-qrcode>
    </div>
    <div style="font-size: 20px; font-weight: bold">
      กล่องที่ {{ data.line_number }}/{{ data.box_qty }}
    </div>
  </div>
</template>
<style>
.pagex {
  page-break-after: always;
  
}
div {text-align: center;}
@page { size: auto;  margin: 5mm; }
</style>