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

const doc_data = ref({ doc_no: "", doc_date: "", doc_time: "", wh_code: "", wh_name: "", location_code: "", location_name: "", remark: "" });
const doc_detail = ref([]);

onMounted(async () => {
  if (route.params.id != "" && route.params.id != "" && route.params.id != undefined) {
    doc_no.value = route.params.id;
    await getDocData();
    await getDocDetail();
  }
});
function getDocData() {
  MasterdataService.getDocData(doc_no.value)
    .then((res) => {
      console.log(res);
      if (res.success) {
        console.log(res.data);
        doc_data.value = res.data[0];
        doc_data.value.doc_time = res.data[0].doc_time.substring(0, 5);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
function getDocDetail() {
  MasterdataService.getDocDetail(doc_no.value)
    .then((res) => {
      console.log(res);
      if (res.success) {
        console.log(res.data);
        doc_detail.value = res.data;
        doc_detail.value = doc_detail.value.sort((a, b) => a.diff_qty - b.diff_qty);

        setTimeout(() => {
          window.print();
          window.close();
        }, 1500);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
</script>
<template>
  <div class="flex align-items-center justify-content-center font-bold text-xl">เอกสารตรวจนับสินค้า</div>
  <div class="flex justify-content-between">
    <div class="flex align-items-start">เลขที่: {{ doc_data.doc_no }}</div>
    <div class="flex align-items-end">วันที่: {{ doc_data.doc_date }} เวลา: {{ doc_data.doc_time }}</div>
  </div>
  <div class="flex justify-content-between">
    <div class="flex align-items-start">
      สาขา: {{ doc_data.branch_code }}~{{ doc_data.branch_name }} คลัง: {{ doc_data.wh_code }}~{{ doc_data.wh_name }} ที่เก็บ: {{ doc_data.location_code }}~{{
        doc_data.location_name
      }}
    </div>
    <div class="flex align-items-start"></div>
    <div class="flex align-items-start"></div>
  </div>
  <div class="flex justify-content-between">
    <div class="flex align-items-start">หมายเหตุ: {{ remark }}</div>
    <div class="flex align-items-end">ผู้จัดทำ: {{ doc_data.creator_code }}~{{ doc_data.creator_name }}</div>
  </div>
  <div style="font-size: 8px !important">
    <DataTable :value="doc_detail" dataKey="roworder">
      <Column field="barcode" header="บาร์โค้ด"></Column>
      <Column field="item_name" header="ชื่อ"></Column>
      <Column field="unit_code" header="หน่วยนับ" bodyStyle="text-align:center"></Column>
      <Column field="price" header="ราคา" bodyStyle="text-align:right">
        <template #body="slotProps">
          {{ Utils.formatMoney(slotProps.data.price) }}
        </template>
      </Column>
      <Column field="qty" header="นับได้" bodyStyle="text-align:right;color:purple">
        <template #body="slotProps">
          {{ Utils.formatNumber(slotProps.data.qty) }}
        </template>
      </Column>
      <Column field="balance_qty" header="คงเหลือ" bodyStyle="text-align:right;color:brown">
        <template #body="slotProps">
          {{ Utils.formatNumber(slotProps.data.balance_qty) }}
        </template>
      </Column>
      <Column field="balance_qty" header="ผลต่าง" bodyStyle="text-align:right">
        <template #body="slotProps">
          <b v-if="parseFloat(slotProps.data.diff_qty) > -1" style="color: green"> {{ slotProps.data.diff_qty }} </b>
          <b v-if="parseFloat(slotProps.data.diff_qty) < 0" style="color: red"> {{ slotProps.data.diff_qty }} </b>
        </template>
      </Column>
      <Column field="remark" header="หมายเหตุ" ></Column>
    </DataTable>
  </div>
</template>
<style>
.pagex {
  page-break-after: always;
}
div {
  font-size: 14px;
}
@page {
  size: a4 landscape;
  margin: 3mm;
  font-size: 12px;
  scale: 50%;
}
</style>
