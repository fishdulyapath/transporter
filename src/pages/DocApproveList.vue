<script setup>
import AppLayout from "@/components/layout/AppLayout.vue";
import MainContentWarp from "@/components/MainContentWarp.vue";
import MasterdataService from "@/services/MasterdataService";
import { useRouter, useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { useApp } from "@/stores/app.js";
import Utils from "@/utils/";
import XLSX from "xlsx";

const storeApp = useApp();
const router = useRouter();
const route = useRoute();
const toast = useToast();
const detail = ref("");
const data_list = ref([]);

const loading = ref(false);

const docno = ref("");
const deliveryno = ref("");
const createcode = ref("");
const selectedBranch = ref(null);
const sendcode = ref("");
const from_date = ref("");
const products = ref([]);
const to_date = ref("");
const expandedRows = ref([]);
const selece_doc_no = ref("");
const branch_list = ref([]);
const provider_code = ref("");
const db_name = ref("");

const showConfirmDialog = ref(false);
const showConfirmDeleteDialog = ref(false);

const delete_doc_no = ref("");

const user_list = ref([]);

onMounted(() => {
  provider_code.value = localStorage.provider;
  db_name.value = localStorage.dbname;
  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  from_date.value = firstDay;
  to_date.value = lastDay;
  getBranchList();
  setTimeout(() => {
    getDocList();
  }, 1000);

  storeApp.setPageTitle("อนุมัติปรับปรุงรายการ");
  storeApp.setActivePage("docapprove_list");
  storeApp.setActiveChild("");
});

function inApproveDoc(docno) {
  showConfirmDeleteDialog.value = true;
  delete_doc_no.value = docno;
}

function onDelete() {
  MasterdataService.inApproveCartDoc(delete_doc_no.value)
    .then((res) => {
      console.log(res);
      if (res.success) {
        showConfirmDeleteDialog.value = false;
        toast.add({ severity: "success", summary: "สำเร็จ", detail: "ไม่อนุมัติเอกสารสำเร็จ" });
        getDocList();
      } else {
        toast.add({ severity: "error", summary: "ไม่สำเร็จ", detail: res.message });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function getBranchList() {
  MasterdataService.getBranchList()
    .then((res) => {
      // console.log(res);
      if (res.success) {
        branch_list.value = res.data;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function getDocList() {
  loading.value = true;

  var from_datex = "";
  var to_datex = "";
  console.log(from_date.value);
  if (from_date.value != "" && from_date.value != undefined) {
    from_datex = Utils.getDateFormatPG(from_date.value);
  }
  if (to_date.value != "" && to_date.value != undefined) {
    to_datex = Utils.getDateFormatPG(to_date.value);
  }
  var branchcode = "";

  if (selectedBranch.value != "" && selectedBranch.value != undefined) {
    branchcode = selectedBranch.value.code;
  }
  console.log(branchcode);

  MasterdataService.getDocApproveList(docno.value, branchcode, from_datex, to_datex)
    .then((res) => {
      console.log(res);
      if (res.success) {
        data_list.value = res.data;
      }
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
      console.log(err);
    });
}

function goDetail(data) {
  router.push({ name: "doc_approve_detail", params: { id: data } });
}
function printDoc(data) {
  const { href } = router.resolve({
    name: "stock_print",
    params: {
      id: data,
    },
  });
  window.open(href, "_blank");
}
function onSendApprove(data) {
  showConfirmDialog.value = true;
  selece_doc_no.value = data;
}
function sendApprove(data) {
  router.push({ name: "doc_stock_detail", params: { id: data } });
}
</script>

<template>
  <AppLayout>
    <MainContentWarp>
      <div class="surface-card shadow-2 border-round p-fluid mt-2" id="boxupdate">
        <Panel header="การค้นหา" :toggleable="true">
          <div class="grid formgrid p-fluid">
            <div class="field mb-4 col-12 md:col-3">
              <label class="font-medium text-900">ค้นหา</label>
              <InputText type="text" v-model="docno" />
            </div>
            <div class="field mb-4 col-12 md:col-3">
              <label class="font-medium text-900">สาขา</label>
              <Dropdown v-model="selectedBranch" :options="branch_list" filter showClear optionLabel="name" placeholder="เลือกสาขา" class="w-full">
                <template #value="slotProps">
                  <div v-if="slotProps.value" class="flex align-items-center">
                    <div>{{ slotProps.value.name }}</div>
                  </div>
                  <span v-else>
                    {{ slotProps.placeholder }}
                  </span>
                </template>
                <template #option="slotProps">
                  <div class="flex align-items-center">
                    <div>{{ slotProps.option.name }}</div>
                  </div>
                </template>
              </Dropdown>
            </div>
            <div class="field mb-4 col-12 md:col-3">
              <label class="font-medium text-900">จากวันที่</label>
              <Calendar dateFormat="yy-mm-dd" v-model="from_date" :showIcon="true"> </Calendar>
            </div>
            <div class="field mb-4 col-12 md:col-3">
              <label class="font-medium text-900">ถึงวันที่</label>
              <Calendar dateFormat="yy-mm-dd" v-model="to_date" :showIcon="true"> </Calendar>
            </div>
          </div>
          <div class="flex justify-content-startF">
            <div class="flex-none flex">
              <Button label="ประมวลผล" icon="pi pi-play" class="w-auto p-button-success" @click="getDocList"></Button>
            </div>
          </div>
        </Panel>
        <div>
          <Card v-for="(item, index) in data_list" :key="index" class="p-mb-2 mb-1">
            <template #title>
              <span class="card-title" style="font-size: 21px">{{ item.doc_no }}</span>
              <span class="card-subtitle"><span style="color: red" v-if="item.status == 3">นับซ้ำ</span></span>
            </template>
            <template #content>
              <div class="grid">
                <div class="col-12 md:col-3">
                  <span>วันที่: {{ item.doc_date }} เวลา: {{ item.doc_time.split(":")[0] }}:{{ item.doc_time.split(":")[1] }}</span>
                </div>
                <div class="col-12 md:col-3">
                  <span>สาขา: {{ item.branch_code }}~{{ item.branch_name }}</span>
                </div>
                <div class="col-12 md:col-3">
                  <span>คลัง: {{ item.wh_code }}~{{ item.wh_name }} </span>
                </div>
                <div class="col-12 md:col-3">
                  <span>ที่เก็บ: {{ item.location_code }}~{{ item.location_name }} </span>
                </div>
                <div class="col-12 md:col-3">
                  <span>ผู้จัดทำ: {{ item.creator_code }}~{{ item.creator_name }} </span>
                </div>
                <div class="col-12 md:col-6">
                  <span>หมายเหตุ: {{ item.remark }} </span>
                </div>
                <div class="col-12 md:col-12">
                  <span>สินค้า: {{ item.item_count }} รายการ </span>
                </div>
              </div>
            </template>
            <template #footer>
              <div class="">
                <div class="flex-none flex">
                  <Button @click="sendApprove(item.doc_no)" label="ปรับปรุงสต๊อก" icon="pi pi-sync" class="w-auto p-button-success"></Button>
                  <Button label="รายการสินค้า" icon="pi pi-list" class="w-auto p-button-primary ml-2" @click="goDetail(item.doc_no)"></Button>
                  <Button label="พิมพ์ใบตรวจนับ" icon="pi pi-print" class="w-auto p-button-info ml-2" @click="printDoc(item.doc_no)"></Button>
                  <Button label="ไม่อนุมัติ" icon="pi pi-times" class="w-auto p-button-danger ml-2" @click="inApproveDoc(item.doc_no)"></Button>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
      <Dialog v-model:visible="showConfirmDialog" :style="{ width: '450px' }" header="ยืนยันการทำงาน" :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span>คุณต้องการอนุมัติปรับปรุงสต๊อก {{ selece_doc_no }} ใช่หรือไม่?</span>
        </div>
        <template #footer>
          <Button label="ยกเลิก" icon="pi pi-times" class="p-button-text" @click="showConfirmDialog = false" />
          <Button label="ยืนยัน" icon="pi pi-check" class="p-button-text" @click="sendApprove" />
        </template>
      </Dialog>
      <Dialog v-model:visible="showConfirmDeleteDialog" :style="{ width: '450px' }" header="ยืนยันการทำงาน" :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span>ไม่อนุมัติเอกสาร {{ delete_doc_no }} ใช่หรือไม่?</span>
        </div>
        <template #footer>
          <Button label="ยกเลิก" icon="pi pi-times" class="p-button-text" @click="showConfirmDeleteDialog = false" />
          <Button label="ยืนยัน" icon="pi pi-check" class="p-button-text" @click="onDelete" />
        </template>
      </Dialog>
    </MainContentWarp>
  </AppLayout>
</template>
<style scoped>
.card-title {
  font-weight: bold;
}
.card-subtitle {
  margin-left: 10px;
  color: #777;
  font-size: 0.8em;
}

.creator {
  font-size: 0.8em;
  color: #555;
}
.icons {
  float: right;
}
.icons i {
  margin-left: 10px;
  cursor: pointer;
}
</style>
