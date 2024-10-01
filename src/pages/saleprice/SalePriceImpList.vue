<script setup>
import AppLayout from "@/components/layout/AppLayout.vue";
import MainContentWarp from "@/components/MainContentWarp.vue";
import { onMounted, ref } from "vue";
import { useApp } from "@/stores/app.js";
import * as XLSX from "xlsx";
import { useRouter, useRoute } from "vue-router";
import MasterdataService from "@/services/MasterdataService";
import Utils from "@/utils/";

const router = useRouter();

const storeApp = useApp();
const data_list = ref([]);
const from_date = ref('');
const to_date = ref('');
const search = ref('');
const myFiles = ref(null);

onMounted(() => {
  storeApp.setActivePage("saleprice");
  storeApp.setActiveChild("salepriceimport");
  storeApp.setPageTitle("รายการนำเข้าราคาทั่วไป");
  storeApp.setHideToggle();

  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  from_date.value = firstDay;
  to_date.value = lastDay;

  getDocList()
});
const dialogVisible = ref(false);
const emptyFields = ref([]);
const fieldsToCheck = [
  'item_code', 'unit_code', 'from_qty', 'to_qty', 'from_date', 'to_date',
  'sale_price1', 'sale_price2', 'sale_type', 'transport_type', 'status', 'price_type'
];


function goToImport() {
  router.push({ name: 'sale_price_import' });
}
async function getDocList() {
  console.log(search.value);
  console.log(from_date.value);
  console.log(to_date.value);
  var from_datex = "";
  var to_datex = "";
  console.log(from_date.value);
  if (from_date.value != "" && from_date.value != undefined) {
    from_datex = Utils.getDateFormatPG(from_date.value);
  }
  if (to_date.value != "" && to_date.value != undefined) {
    to_datex = Utils.getDateFormatPG(to_date.value);
  }

  await MasterdataService.getDocNMList(search.value, from_datex, to_datex)
    .then((res) => {
      console.log(res);
      if (res.success) {
        data_list.value = res.data
      } else {
        toast.add({ severity: "error", summary: "ดึงข้อมูลล้มเหลว", detail: res.message });
      }
    })
    .catch((err) => {
      console.log(err);

    });
}
function viewDetails(docNo) {
  console.log(`Viewing details for document: ${docNo}`);
  router.push({ name: "sale_price_import_detail", params: { id: docNo } });
};

</script>

<template>
  <AppLayout>
    <MainContentWarp>
      <div class="surface-card shadow-2 border-round p-fluid mt-2">
        <Panel header="การค้นหา" :toggleable="true">
          <div class="grid formgrid p-fluid">
            <div class="field mb-4 col-12 md:col-2">
              <label class="font-medium text-900">ค้นหา</label>
              <InputText type="text" v-model="search" />
            </div>
            <div class="field mb-4 col-12 md:col-2">
              <label class="font-medium text-900">จากวันที่</label>
              <Calendar dateFormat="yy-mm-dd" v-model="from_date" :showIcon="true"> </Calendar>
            </div>
            <div class="field mb-4 col-12 md:col-2">
              <label class="font-medium text-900">ถึงวันที่</label>
              <Calendar dateFormat="yy-mm-dd" v-model="to_date" :showIcon="true"> </Calendar>
            </div>
          </div>
          <div class="flex justify-content-start">
            <div class="flex-none flex">
              <Button label="ประมวลผล" icon="pi pi-play" class="w-auto p-button-success" @click="getDocList"></Button>
              <Button label="นำเข้าราคาทั่วไป" icon="pi pi-upload" class="w-auto p-button-info ml-2" @click="goToImport"></Button>
            </div>
          </div>
        </Panel>
        <DataTable :value="data_list" :paginator="true" :rows="15"
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" :rowsPerPageOptions="[15, 50, 100]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords}">
          <Column header="" style="width:45px">
            <template #body="slotProps">
              <Button icon="pi pi-search" label="" rounded outlined @click="viewDetails(slotProps.data.doc_no)" class="mr-2" />
            </template>
          </Column>
          <Column field="doc_no" header="เลขที่เอกสาร" sortable></Column>
          <Column field="doc_date" header="วันที่" sortable></Column>
          <Column field="doc_time" header="เวลา" sortable></Column>
          <Column field="creator_code" header="ผู้สร้าง" sortable></Column>
          <Column field="remark" header="หมายเหตุ" sortable></Column>

        </DataTable>
      </div>
      <Dialog v-model:visible="dialogVisible" header="Empty Values Found" :style="{ width: '50vw' }">
        <div v-if="emptyFields.length > 0">
          <p>The following items have empty values:</p>
          <ul>
            <li v-for="(item, index) in emptyFields" :key="index">
              Item at position {{ item.position + 1 }}:
              <ul>
                <li v-for="field in item.fields" :key="field">{{ field }}</li>
              </ul>
            </li>
          </ul>
        </div>
        <div v-else>
          <p>No empty values found.</p>
        </div>
      </Dialog>
    </MainContentWarp>
  </AppLayout>
</template>
