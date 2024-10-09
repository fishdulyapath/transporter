<script setup>
import AppLayout from "@/components/layout/AppLayout.vue";
import MainContentWarp from "@/components/MainContentWarp.vue";
import { onMounted, ref } from "vue";
import { useApp } from "@/stores/app.js";
import { useRouter, useRoute } from "vue-router";
import MasterdataService from "@/services/MasterdataService";
import Utils from "@/utils/";
import { FilterMatchMode } from 'primevue/api';
import XLSX from "xlsx";
import { useToast } from "primevue/usetoast";

const storeApp = useApp();

const router = useRouter();
const toast = useToast();
const data_list = ref([]);
const selectedProduct = ref();
const expandedRows = ref([]);
const search = ref('');
const from_date = ref('');
const to_date = ref('');
const showConfirmDeleteDialog = ref(false);
const deleteDocNo = ref('');
const showConfirmApproveDialog = ref(false);
const docNoConfirm = ref('');

onMounted(() => {
  storeApp.setActivePage("dashboard");
  storeApp.setActiveChild('');
  storeApp.setPageTitle("รายการขนส่ง");

  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  from_date.value = firstDay;
  to_date.value = lastDay;

  getDocList();
});


//approveDoc
const approveDoc = async () => {
  await MasterdataService.approveTSDoc(docNoConfirm.value)
    .then((res) => {
      console.log(res);
      if (res.success) {
        toast.add({ severity: "success", summary: "ส่งอนุมัติสำเร็จ", life: 5000 });
        getDocList();
        showConfirmApproveDialog.value = false;
      } else {
        toast.add({ severity: "error", summary: "ส่งอนุมัติล้มเหลว", detail: res.message, life: 5000 });
        showConfirmApproveDialog.value = false;
      }
    })
    .catch((err) => {
      console.log(err);
      toast.add({ severity: "error", summary: "ส่งอนุมัติล้มเหลว", detail: res.message, life: 5000 });
      showConfirmApproveDialog.value = false;
    });
};

function printDoc(data) {
  const { href } = router.resolve({
    name: "send_print",
    params: { id: data },
  });
  window.open(href, "_blank");

  setTimeout(() => {
    getDocList();
  }, 1000);
}


//getDocList
const getDocList = async () => {
  var from_datex = "";
  var to_datex = "";
  console.log(from_date.value);
  if (from_date.value != "" && from_date.value != undefined) {
    from_datex = Utils.getDateFormatPG(from_date.value);
  }
  if (to_date.value != "" && to_date.value != undefined) {
    to_datex = Utils.getDateFormatPG(to_date.value);
  }

  await MasterdataService.getDocList(search.value, from_datex, to_datex)
    .then((res) => {
      console.log(res);
      if (res.success) {
        data_list.value = res.data;
      } else {
        toast.add({ severity: "error", summary: "ดึงข้อมูลล้มเหลว", detail: res.message, life: 5000 });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const viewDetails = async (doc_no) => {
  console.log(doc_no);
  router.push({ name: "transporter_detail", params: { id: doc_no } });
};

const deleteDoc = async () => {

  await MasterdataService.deleteTSDoc(deleteDocNo.value)
    .then((res) => {
      console.log(res);
      if (res.success) {
        toast.add({ severity: "success", summary: "ลบข้อมูลสำเร็จ", life: 5000 });
        getDocList();
        showConfirmDeleteDialog.value = false;
      } else {
        toast.add({ severity: "error", summary: "ลบข้อมูลล้มเหลว", detail: res.message, life: 5000 });
        showConfirmDeleteDialog.value = false;
      }
    })
    .catch((err) => {
      console.log(err);
      toast.add({ severity: "error", summary: "ลบข้อมูลล้มเหลว", detail: res.message, life: 5000 });
      showConfirmDeleteDialog.value = false;
    });
};



const showConfirmDelete = (doc_no) => {
  deleteDocNo.value = doc_no;
  showConfirmDeleteDialog.value = true;
};

const showConfirmSendApprove = (doc_no) => {
  docNoConfirm.value = doc_no;
  showConfirmApproveDialog.value = true;
};

const formatNumber = (value) => {
  return Number(value).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};


function goToCreate() {
  router.push({ name: "transporter_detail", params: { id: 'new' } });
}

function exportExcel() {
  if (selectedProduct.value == null) selectedProduct.value = [];
  if (selectedProduct.value.length > 0) {
    console.log(selectedProduct.value);
    var excel_data = []



    selectedProduct.value.forEach((item) => {
      var data = {
        รหัสสินค้า: item.ic_code.toString(),
        หน่วยนับ: item.unit_code.toString(),
        จากจำนวน: item.from_qty.toString(),
        ถึงจำนวน: item.to_qty.toString(),
        จากวันที่: item.from_date.toString(),
        ถึงวันที่: item.to_date.toString(),
        ประเภทการขาย: item.sale_type.toString(),
        ประเภทการส่ง: item.transport_type.toString(),
        ราคาแยกภาษี: item.sale_price1.toString(),
        ราคารวมภาษี: item.sale_price2.toString(),
        สถานะ: item.status.toString(),
        ประเภทราคา: item.price_type.toString(),
        รหัสลูกค้า: item.cust_code.toString(),
        กลุ่มลูกค้าหลัก: item.cust_group_1.toString(),
        กลุ่มลูกค้าย่อย: item.cust_group_2.toString()
      }
      excel_data.push(data);
    });
    const worksheet = XLSX.utils.json_to_sheet(excel_data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Price List");

    XLSX.writeFile(workbook, "ราคาทั่วไป.xlsx");
  }
}


</script>

<template>
  <AppLayout>
    <MainContentWarp>
      <div class="surface-ground px-2 py-2">
        <div class="surface-card shadow-2 border-round p-fluid mt-2">
          <Panel header="ค้นหาสินค้า" :toggleable="true">
            <div class="grid formgrid p-fluid">

              <div class="field mb-4 col-12 md:col-3">
                <label class="font-medium text-900">ค้นหา</label>
                <InputText type="text" v-model="search" />
              </div>
              <div class="field mb-4 col-12 md:col-3">
                <label class="font-medium text-900">จากวันที่</label>
                <Calendar dateFormat="yy-mm-dd" v-model="from_date" :showIcon="true"> </Calendar>
              </div>
              <div class="field mb-4 col-12 md:col-3">
                <label class="font-medium text-900">ถึงวันที่</label>
                <Calendar dateFormat="yy-mm-dd" v-model="to_date" :showIcon="true"> </Calendar>
              </div>

              <div class="field col-12">
                <Button label="ค้นหา" icon="pi pi-play" class="w-auto p-button-info"  @click="getDocList"></Button>
                <Button label="สร้างเอกสารใหม่" icon="pi pi-plus" class="w-auto p-button-success ml-2" @click="goToCreate"></Button>

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
            <Column field="doc_no" header="เลขที่" sortable></Column>
            <Column field="doc_date" header="วันที่" sortable></Column>
            <Column field="car_code" header="ทะเบียน" sortable></Column>
            <Column field="return_date" header="วันที่กลับ" sortable></Column>
            <Column field="driver1_name" header="คนขับ" sortable></Column>
            <Column field="creator_code" header="ผู้สร้าง" sortable></Column>
            <Column field="remark" header="หมายเหตุ" sortable></Column>
            <Column field="status" header="สถานะ" sortable>
              <template #body="slotProps">
                <span v-if="slotProps.data.status == 0" style="color:orange">รอส่งอนุมัติ</span>
                <span v-if="slotProps.data.status == 3" style="color:red">ไม่อนุมัติ</span>
              </template>
            </Column>
            <Column field="" header="">
              <template #body="slotProps">
                <div class="flex">
                  <Button icon="pi pi-check" label="ส่งอนุมัติ" class="p-button-success mr-2" @click="showConfirmSendApprove(slotProps.data.doc_no)"></Button>
                  <Button icon="pi pi-trash" label="ลบ" class="p-button-danger mr-2" @click="showConfirmDelete(slotProps.data.doc_no)"></Button>
                  <Button icon="pi pi-print" label="พิมพ์" class="p-button-info flex " @click="printDoc(slotProps.data.doc_no)"></Button>
                </div>
              </template>
            </Column>

          </DataTable>

        </div>
        <Dialog v-model:visible="showConfirmDeleteDialog" :style="{ width: '450px' }" header="ยืนยันการทำงาน" :modal="true">
          <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span>ต้องการลบเอกสาร {{ deleteDocNo }} ใช่หรือไม่?</span>
          </div>
          <template #footer>
            <Button label="ยกเลิก" icon="pi pi-times" class="p-button-text" @click="showConfirmDeleteDialog = false" />
            <Button label="ยืนยัน" icon="pi pi-check" class="p-button-success" @click="deleteDoc" />
          </template>
        </Dialog>

        <Dialog v-model:visible="showConfirmApproveDialog" :style="{ width: '450px' }" header="ยืนยันการทำงาน" :modal="true">
          <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span>ต้องการส่งอนุมัติเอกสาร {{ docNoConfirm }} ใช่หรือไม่?</span>
          </div>
          <template #footer>
            <Button label="ยกเลิก" icon="pi pi-times" class="p-button-text" @click="showConfirmApproveDialog = false" />
            <Button label="ยืนยัน" icon="pi pi-check" class="p-button-success" @click="approveDoc" />
          </template>
        </Dialog>
      </div>
    </MainContentWarp>
  </AppLayout>
</template>