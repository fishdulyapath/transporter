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
const selectedStatus = ref(null);
const statusSelect = ref([
  { code: 0, name: "รอส่งตรวจ" },
  { code: 1, name: "รอตรวจสอบ" },
  { code: 2, name: "นับซ้ำ" },
  { code: 3, name: "นับซ้ำรอตรวจสอบ" },
  { code: 4, name: "รออนุมัติปรับปรุง" },
  { code: 5, name: "ปรับปรุงสต๊อกแล้ว" },
  { code: 6, name: "ไม่อนุมัติ" },
]);
const showConfirmDialog = ref(false);

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

  storeApp.setPageTitle("ประวัติรายการตรวจนับ");
  storeApp.setActivePage("dochistory_list");
  storeApp.setActiveChild("");
});

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
  var status = "";
  if (selectedBranch.value != "" && selectedBranch.value != undefined) {
    branchcode = selectedBranch.value.code;
  }
  if (selectedStatus.value != "" && selectedStatus.value != undefined) {
    status = selectedStatus.value.code;
  }

  console.log(branchcode);

  MasterdataService.getDocHistoryList(docno.value, branchcode, from_datex, to_datex, status)
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
  router.push({ name: "dochistory_detail", params: { id: data } });
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
function openDetailPage(data) {
  router.push({ name: "sub_detail", params: { id: data } });
}

function onSendApprove(data) {
  showConfirmDialog.value = true;
  selece_doc_no.value = data;
}
function sendApprove() {
  MasterdataService.sendApprove(selece_doc_no.value)
    .then((res) => {
      console.log(res);
      if (res.success) {
        showConfirmDialog.value = false;
        toast.add({ severity: "success", summary: "สำเร็จ", detail: "ขออนุมัติปรับปรุงสต๊อกสำเร็จ" });
        getDocList();
      } else {
        toast.add({ severity: "error", summary: "ไม่สำเร็จ", detail: res.message });
      }
    })
    .catch((err) => {
      console.log(err);
    });
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

            <div class="field mb-4 col-12 md:col-3">
              <label class="font-medium text-900">สถานะ</label>
              <Dropdown v-model="selectedStatus" :options="statusSelect" filter showClear optionLabel="name" placeholder="เลือกสาขา" class="w-full">
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
              <span class="card-subtitle"
                ><span style="color: red" v-if="item.status == 0 && item.is_merge == 0">รอส่งตรวจ</span
                ><span style="color: gray" v-if="item.status == 0 && item.is_merge == 1">รวมตะกร้าแล้ว</span><span style="color: orange" v-if="item.status == 1">รอตรวจสอบ</span
                ><span style="color: purple" v-if="item.status == 2">นับซ้ำ</span><span style="color: brown" v-if="item.status == 3">นับซ้ำรอตรวจสอบ</span
                ><span style="color: purple" v-if="item.status == 4">รออนุมัติปรับปรุงสต๊อก</span><span style="color: green" v-if="item.status == 5">ปรับปรุงสต๊อกแล้ว</span><span style="color: red" v-if="item.status == 6">ไม่อนุมัติ</span></span
              >
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
                <div class="col-12 md:col-12" v-if="item.status == 5">
                  <span
                    >ปรับปรุงเลขที่ : <b style="color: green">{{ item.doc_no_add }}</b>
                  </span>
                  <span style="margin-left: 8px"
                    >ปรับปรุงลด(ขาด) เลขที่ : <b style="color: red">{{ item.doc_no_minus }}</b>
                  </span>
                </div>
                <div class="col-12 md:col-12" v-if="item.cart_sub.length > 0">
                  <span
                    ><b>รายการตะกร้านับซ้ำ {{ item.cart_sub.length }} รายการ</b></span
                  >
                  <div class="grid" style="margin-top: 5px">
                    <div class="col-12 md:col-12" v-for="(cart, index) in item.cart_sub" :key="cart.doc_no" style="padding-top: 0px; padding-bottom: 0px">
                      <span>{{ index + 1 }}. {{ cart.doc_no }}</span> <span style="color: blue; cursor: pointer" @click="openDetailPage(cart.doc_no)">รายละเอียด </span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template #footer>
              <div class="">
                <div class="flex-none flex">
                  <Button label="รายการสินค้า" icon="pi pi-list" class="w-auto p-button-primary ml-2" @click="goDetail(item.doc_no)"></Button>
                  <Button label="พิมพ์ใบตรวจนับ" icon="pi pi-print" class="w-auto p-button-info ml-2" @click="printDoc(item.doc_no)"></Button>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
      <Dialog v-model:visible="showConfirmDialog" :style="{ width: '450px' }" header="ยืนยันการทำงาน" :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span>คุณต้องการขออนุมัติปรับปรุงสต๊อก {{ selece_doc_no }} ใช่หรือไม่?</span>
        </div>
        <template #footer>
          <Button label="ยกเลิก" icon="pi pi-times" class="p-button-text" @click="showConfirmDialog = false" />
          <Button label="ยืนยัน" icon="pi pi-check" class="p-button-text" @click="sendApprove" />
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
