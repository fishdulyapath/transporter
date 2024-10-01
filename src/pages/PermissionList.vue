<script setup>
import AppLayout from "@/components/layout/AppLayout.vue";
import MainContentWarp from "@/components/MainContentWarp.vue";
import MasterdataService from "@/services/MasterdataService";
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { useApp } from "@/stores/app.js";
import Utils from "@/utils/";
import XLSX from "xlsx";

const storeApp = useApp();
const router = useRouter();
const toast = useToast();
const detail = ref("");
const data_list = ref([]);
const deleteDetailDialog = ref(false);
const totalItemsCount = ref(0);
const loading = ref(false);
const activePage = ref(1);
const typingTimer = ref(null);
const doneTypingInterval = ref(1000);
const firstPage = ref(0);
const search = ref("");
const from_date = ref("");
const to_date = ref("");
const confirmSaveDialog = ref(false);
const confirmDialogMsg = ref("");
const confirmDialogData = ref();
const filters = ref(null);
const sortField = ref("code");
const sortOrder = ref(1);
const limitPage = ref(20);
const status = ref("");
const confirmReceiveData = ref();
const confirmReceiveDialog = ref(false);
const receivedate = ref();
const receiver = ref();
const user_list = ref([]);
const confirmNoPrintDialogMsg = ref("");
const confirmNoPrintDialog = ref(false);
const statusReceive = ref("");
const statusUpdate = ref("");
const from_permission = ref({
  doc_list: "0",
  doc_approve_list: "0",
  doc_history_list: "0",
});

onMounted(() => {
  getErpUserPermission();
  storeApp.setPageTitle("กำหนดสิทธิ์");
  storeApp.setActivePage("permissionlist");
  storeApp.setActiveChild("");
});

function getErpUserPermission() {
  MasterdataService.getErpUserPermission(search.value)
    .then((res) => {
      console.log(res);
      if (res.success) {
        user_list.value = res.data;
        toast.add({
          severity: "success",
          summary: "Successful",
          detail: "โหลดข้อมูลพนักงานสำเร็จ",
          life: 1500,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function goDetail(data) {
  router.push({ name: "history_detail", params: { id: data.doc_no } });
}

function confirmDeleteDetail(data) {
  console.log(data);
  detail.value = data.doc_no;
  console.log(detail);
  deleteDetailDialog.value = true;
}

function noPrint(data) {
  confirmNoPrintDialogMsg.value = data.doc_no;
  confirmNoPrintDialog.value = true;
}

function doReceive(data) {
  confirmReceiveData.value = data.code;
  confirmReceiveDialog.value = true;
  from_permission.value.doc_list = data.doc_list;
  from_permission.value.doc_approve_list = data.doc_approve_list;
  from_permission.value.doc_history_list = data.doc_history_list;

}

function doExport(data) {
  confirmDialogMsg.value = data.doc_no;
  confirmDialogData.value = data;
  confirmSaveDialog.value = true;
}

function confirmSend() {
  MasterdataService.doExport(confirmDialogMsg.value)
    .then((res) => {
      console.log(res);
      if (res.success) {
        ExportExcel(confirmDialogMsg.value);

        confirmSaveDialog.value = false;
        confirmDialogMsg.value = "";
        getDocHistoryPrice();
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function confirmNoPrint() {
  MasterdataService.doNoPrint(confirmNoPrintDialogMsg.value)
    .then((res) => {
      console.log(res);
      if (res.success) {
        confirmNoPrintDialog.value = false;
        confirmNoPrintDialogMsg.value = "";
        getDocHistoryPrice();
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function confirmReceive() {
  MasterdataService.upDatePermission(from_permission.value, confirmReceiveData.value)
    .then((res) => {
      console.log(res);
      if (res.success) {
        confirmReceiveData.value = null;
        confirmReceiveDialog.value = false;
        getErpUserPermission();
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function deleteDetail() {
  MasterdataService.unApproveDoc(detail.value)
    .then((res) => {
      console.log(res);
      if (res.success) {
        getDocHistoryPrice();
        toast.add({
          severity: "success",
          summary: "Successful",
          detail: "ไม่อนุมัติเอกสารเรียบร้อยแล้ว",
          life: 3000,
        });
        deleteDetailDialog.value = false;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function getUserData(data) {
  console.log(data);
  if (data == undefined) {
    data = "";
  }
  var user = "";
  user_list.value.forEach((ele) => {
    if (ele.code.toString().toLowerCase() == data.toString().toLowerCase()) {
      user = ele.name_1;
    }
  });
  return user;
}
</script>

<template>
  <AppLayout>
    <MainContentWarp>
      <div class="surface-card shadow-2 border-round p-fluid mt-2">
        <Panel header="กำหนดสิทธิ์การใช้งาน" :toggleable="true">
          <div class="grid formgrid p-fluid">
            <div class="field mb-4 col-12">
              <label class="font-bold text-900">รหัส-ชื่อพนักงาน</label>
              <InputText type="text" v-model="search" />
            </div>
          </div>
          <div class="flex justify-content-startF">
            <div class="flex-none flex">
              <Button label="ค้นหาพนักงาน" icon="pi pi-search" class="w-auto p-button-info" @click="getErpUserPermission"></Button>
            </div>
          </div>
        </Panel>
      </div>
      <div class="surface-card shadow-2 border-round p-fluid mt-2">
        <div class="grid p-2">
          <div class="col-12">
            <DataTable :value="user_list" dataKey="doc_no" class="p-datatable-sm" :loading="loading" stripedRows responsiveLayout="scroll">
              <template #empty> ไม่พบข้อมูล </template>
              <template #loading> กำลังประมวลผล กรุณารอซักครู่..</template>
              <Column field="code" header="รหัส"></Column>
              <Column field="name_1" header="ชื่อ"></Column>
              <Column field="doc_list" bodyStyle="text-align:center">
                <template #header>
                  <div class="text-center w-full">รายการตรวจนับ</div>
                </template>
                <template #body="slotProps">
                  <b class="text-green-500" v-if="slotProps.data.doc_list == '1'">Yes</b>
                  <b class="text-red-500" v-if="slotProps.data.doc_list == '0'">No</b>
                </template>
              </Column>
              <Column field="doc_approve_list" bodyStyle="text-align:center">
                <template #header>
                  <div class="text-center w-full">อนุมัติปรับปรุงรายการ</div>
                </template>
                <template #body="slotProps">
                  <b class="text-green-500" v-if="slotProps.data.doc_approve_list == '1'">Yes</b>
                  <b class="text-red-500" v-if="slotProps.data.doc_approve_list == '0'">No</b>
                </template>
              </Column>
              <Column field="doc_history_list" bodyStyle="text-align:center">
                <template #header>
                  <div class="text-center w-full">ประวัติรายการตรวจนับ</div>
                </template>
                <template #body="slotProps">
                  <b class="text-green-500" v-if="slotProps.data.doc_history_list == '1'">Yes</b>
                  <b class="text-red-500" v-if="slotProps.data.doc_history_list == '0'">No</b>
                </template>
              </Column>
              

              <Column bodyStyle="text-align:right">
                <template #body="slotProps">
                  <Button label="แก้ไข" class="p-button-danger w-auto" @click="doReceive(slotProps.data)" />
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
      </div>

      <Dialog v-model:visible="confirmReceiveDialog" :style="{ width: '650px' }" header="กำหนดสิทธิ์" :modal="true">
        <div class="confirmation-content">
          <div class="grid formgrid p-fluid">
            <div class="field mb-2 col-12 md:col-6">
              <label class="font-bold text-900">รายการตรวจนับ</label>
              <SelectButton
                v-model="from_permission.doc_list"
                :options="[
                  { name: 'No', code: '0' },
                  { name: 'Yes', code: '1' },
                ]"
                optionLabel="name"
                optionValue="code"
                :multiple="false"
              />
            </div>

            <div class="field mb-2 col-12 md:col-6">
              <label class="font-bold text-900">อนุมัติปรับราคา</label>
              <SelectButton
                v-model="from_permission.doc_approve_list"
                :options="[
                  { name: 'No', code: '0' },
                  { name: 'Yes', code: '1' },
                ]"
                optionLabel="name"
                optionValue="code"
                :multiple="false"
              />
            </div>
            <div class="field mb-2 col-12 md:col-6">
              <label class="font-bold text-900">ประวัติรายการตรวจนับ</label>
              <SelectButton
                v-model="from_permission.doc_history_list"
                :options="[
                  { name: 'No', code: '0' },
                  { name: 'Yes', code: '1' },
                ]"
                optionLabel="name"
                optionValue="code"
                :multiple="false"
              />
            </div>
            
          </div>
        </div>
        <template #footer>
          <Button label="ยกเลิก" icon="pi pi-times" class="p-button-danger" @click="confirmReceiveDialog = false" />
          <Button label="บันทึก" icon="pi pi-check" class="p-button-success" @click="confirmReceive" />
        </template>
      </Dialog>
      <Dialog v-model:visible="confirmNoPrintDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span>ไม่ต้องการ Export/พิมพ์ เอกสาร {{ confirmNoPrintDialogMsg }} ใช่หรือไม่?</span>
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" class="p-button-text" @click="confirmNoPrintDialog = false" />
          <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="confirmNoPrint" />
        </template>
      </Dialog>
      <Dialog v-model:visible="confirmSaveDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span>ต้องการExport/พิมพ์ป้าย เอกสาร {{ confirmDialogMsg }} ใช่หรือไม่?</span>
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" class="p-button-text" @click="confirmSaveDialog = false" />
          <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="confirmSend" />
        </template>
      </Dialog>
      <Dialog v-model:visible="deleteDetailDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span
            >ไม่อนุมัติเอกสารขอปรับราคา
            <b>{{ detail }} </b>
            ใช่หรือไม่?</span
          >
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteDetailDialog = false" />
          <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteDetail" />
        </template>
      </Dialog>
    </MainContentWarp>
  </AppLayout>
</template>
