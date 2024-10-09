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
const itemDetails = ref([]);
const employeeDetails = ref([]);
const supplierDetails = ref([]);
const supplier_code = ref('');

const cal_by = ref([
  { code: "0", name: "น้ำหนัก" },
  { code: "1", name: "จำนวนชิ้น" },
  { code: "2", name: "ต่อเที่ยว" },
]);


onMounted(() => {
  storeApp.setActivePage("tsdocapprovelist");
  storeApp.setActiveChild('');
  storeApp.setPageTitle("อนุมัติรายการ");

  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  from_date.value = firstDay;
  to_date.value = lastDay;

  getDocList();
  getIncomeList();
  getEmployee();
  getSupplier();
});

//getsupplier
const getSupplier = () => {
  MasterdataService.getSupplier()
    .then((response) => {
      if (response.success) {
        response.data.forEach(data => {
          supplierDetails.value.push({ code: data.code, name: data.code + '~' + data.name });
        });
      } else {
        toast.add({
          severity: "error",
          summary: "เกิดข้อผิดพลาด",
          detail: response.message,
          life: 3000
        });
      }
    })
    .catch((error) => {
      console.error(error);
      toast.add({
        severity: "error",
        summary: "เกิดข้อผิดพลาด",
        detail: "ไม่สามารถดึงข้อมูลได้",
        life: 3000
      });
    });
};


const getCalByName = (code) => {
  const cal = cal_by.value.find((cal) => cal.code === code);
  return cal ? cal.name : "";
};



const getIncomeList = () => {
  MasterdataService.getIncomeList()
    .then((response) => {
      console.log("transportItems1", response);
      if (response.success) {


        response.data.forEach(data => {
          itemDetails.value.push({ item_code: data.code, item_name: data.code + '~' + data.name });
        });

      } else {
        toast.add({
          severity: "error",
          summary: "เกิดข้อผิดพลาด",
          detail: response.message,
          life: 3000
        });
      }
    })
    .catch((error) => {
      console.error(error);
      toast.add({
        severity: "error",
        summary: "เกิดข้อผิดพลาด",
        detail: "ไม่สามารถดึงข้อมูลได้",
        life: 3000
      });
    });
};


const getEmployee = () => {
  MasterdataService.getEmployee()
    .then((response) => {
      if (response.success) {
        response.data.forEach(data => {
          employeeDetails.value.push({ code: data.code, name: data.code + '~' + data.name });
        });


      } else {
        toast.add({
          severity: "error",
          summary: "เกิดข้อผิดพลาด",
          detail: response.message,
          life: 3000
        });
      }
    })
    .catch((error) => {
      console.error(error);
      toast.add({
        severity: "error",
        summary: "เกิดข้อผิดพลาด",
        detail: "ไม่สามารถดึงข้อมูลได้",
        life: 3000
      });
    });
};

//approveDoc
const approveDoc = async () => {
  await MasterdataService.successTSDoc(docNoConfirm.value,localStorage._usercode || "")
    .then((res) => {
      console.log(res);
      if (res.success) {
        toast.add({ severity: "success", summary: "อนุมัติสำเร็จ", life: 5000 });
        getDocList();
        showConfirmApproveDialog.value = false;
      } else {
        toast.add({ severity: "error", summary: "อนุมัติล้มเหลว", detail: res.message, life: 5000 });
        showConfirmApproveDialog.value = false;
      }
    })
    .catch((err) => {
      console.log(err);
      toast.add({ severity: "error", summary: "อนุมัติล้มเหลว", detail: err, life: 5000 });
      showConfirmApproveDialog.value = false;
    });
};

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

  await MasterdataService.getTsDocApproveList(search.value, from_datex, to_datex)
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
  router.push({ name: "tsapprovedetail", params: { id: doc_no } });
};

const getItemShow = (item_code) => {
  const item = itemDetails.value.find((item) => item.item_code === item_code);
  return item ? item.item_name : "";
};

const deleteDoc = async () => {

  await MasterdataService.unapproveTSDoc(deleteDocNo.value)
    .then((res) => {
      console.log(res);
      if (res.success) {
        toast.add({ severity: "success", summary: "ไม่อนุมัติเอกสารสำเร็จ", life: 5000 });
        getDocList();
        showConfirmDeleteDialog.value = false;
      } else {
        toast.add({ severity: "error", summary: "ไม่อนุมัติเอกสารล้มเหลว", detail: res.message, life: 5000 });
        showConfirmDeleteDialog.value = false;
      }
    })
    .catch((err) => {
      console.log(err);
      toast.add({ severity: "error", summary: "ไม่อนุมัติเอกสารล้มเหลว", detail: res.message, life: 5000 });
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

// exportExcel
function exportExcel(doc_no) {
  MasterdataService.getTSDocDetail(doc_no)
    .then((res) => {
      console.log(res);
      if (res.success) {
        var jsonData = res.data;
        exportExcel2(doc_no, jsonData);
      } else {
        toast.add({ severity: "error", summary: "ดึงข้อมูลล้มเหลว", detail: res.message, life: 5000 });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

//printDoc
// function printDoc(doc_no) {
//   // MasterdataService.getTSDocDetail(doc_no)
//   //   .then((res) => {
//   //     console.log(res);
//   //     if (res.success) {
//   //       var jsonData = res.data;
//   //       printSend(doc_no, jsonData);
//   //     } else {
//   //       toast.add({ severity: "error", summary: "ดึงข้อมูลล้มเหลว", detail: res.message, life: 5000 });
//   //     }
//   //   })
//   //   .catch((err) => {
//   //     console.log(err);
//   //   });
// }
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


function exportExcel2(doc_no, jsonData) {

  //getdocdetail

  // เตรียมข้อมูลหัวข้อสำหรับ Excel
  const excel_data = [
    ["เลขที่เอกสาร", jsonData.doc_no],
    ["วันที่", jsonData.doc_date],
    ["ทะเบียนรถ", jsonData.car_code],
    ["วันที่กลับ", jsonData.return_date],
    ["คนขับ 1", jsonData.driver1_name],
    ["คนขับ 2", jsonData.driver2_name],
    ["เลขไมล์เที่ยวก่อน ขาไป", jsonData.start_mileage1, "เลขไมล์เที่ยวก่อน ขากลับ", jsonData.start_mileage2],
    ["เลขไมล์เที่ยวนี้ ขาไป", jsonData.end_mileage1, "เลขไมล์เที่ยวนี้ ขากลับ", jsonData.end_mileage2],
    ["ระยะทางเที่ยวนี้ ขาไป", jsonData.total_mileage1, "ระยะทางเที่ยวนี้ ขากลับ", jsonData.total_mileage2],
    ["ผู้สร้าง", jsonData.creator_code, "หมายเหตุ", jsonData.remark],
    [],
    ["รายการสินค้า ขาไป"],
    ["ลำดับ", "วันที่ขน", "ลูกค้า", "สินค้า", "เส้นทาง", "ชื่อร้านปลายทาง", "เลขที่ใบขน", "คิดตาม", "จำนวน", "เบี้ยเลี้ยง", "รายได้"],
  ];

  // เตรียมข้อมูล Transport Items 1
  var transportItem1line = 0;
  jsonData.transportItems1.forEach(item => {
    excel_data.push([
      transportItem1line + 1,
      item.send_date,
      item.customer,
      getItemShow(item.item_code),
      item.route,
      item.dest_name,
      item.shipment_no,
      getCalByName(item.calculation_type),
      item.unit_price,
      item.allowance,
      item.revenue,
    ]);
    transportItem1line++;
  });

  excel_data.push([]); // เว้นบรรทัด
  excel_data.push(["ค่าเชื้อเพลิง ขาไป"]);
  excel_data.push(["ลำดับ", "สินค้า", "จำนวน", "ลิตรละ", "รวม"]);

  // เตรียมข้อมูล Fuel Details 1
  var fuelDetails1line = 0;
  jsonData.fuelDetails1.forEach(item => {
    excel_data.push([
      fuelDetails1line + 1,
      item.item_name,
      item.amount,
      item.unit_price,
      item.amount * item.unit_price,
    ]);
    fuelDetails1line++;
  });

  excel_data.push([]); // เว้นบรรทัด
  excel_data.push(["ค่าใช้จ่ายรวม ขาไป"]);
  excel_data.push(["ลำดับ", "สินค้า", "จำนวน"]);

  // เตรียมข้อมูล Expenses 1
  var expenses1line = 0;
  jsonData.expenses1.forEach(item => {
    excel_data.push([
      expenses1line + 1,
      item.item_name,
      item.amount,
    ]);
    expenses1line++;
  });

  // ทำซ้ำขั้นตอนเดียวกันสำหรับ Transport Items 2, Fuel Details 2, Expenses 2
  excel_data.push([]);
  excel_data.push(["รายการสินค้า ขากลับ"]);
  excel_data.push(["ลำดับ", "วันที่ขน", "ลูกค้า", "สินค้า", "เส้นทาง", "ชื่อร้านปลายทาง", "เลขที่ใบขน", "คิดตาม", "หน่วยละ", "เบี้ยเลี้ยง", "รายได้"]);


  var transportItem2line = 0;
  jsonData.transportItems2.forEach(item => {
    excel_data.push([
      transportItem2line + 1,
      item.send_date,
      item.customer,
      getItemShow(item.item_code),
      item.route,
      item.dest_name,
      item.shipment_no,
      getCalByName(item.calculation_type),
      item.unit_price,
      item.allowance,
      item.revenue,
    ]);
    transportItem2line++;
  });

  excel_data.push([]); // เว้นบรรทัด
  excel_data.push(["ค่าเชื้อเพลิง ขากลับ"]);
  excel_data.push(["ลำดับ", "สินค้า", "จำนวน", "ลิตรละ", "รวม"]);

  // เตรียมข้อมูล Fuel Details 1
  var fuelDetails2line = 0;
  jsonData.fuelDetails2.forEach(item => {
    excel_data.push([
      fuelDetails2line + 1,
      item.item_name,
      item.amount,
      item.unit_price,
      item.amount * item.unit_price,
    ]);
    fuelDetails2line++;
  });


  excel_data.push([]); // เว้นบรรทัด
  excel_data.push(["ค่าใช้จ่ายรวม ขากลับ"]);
  excel_data.push(["ลำดับ", "สินค้า", "จำนวน"]);

  // เตรียมข้อมูล Expenses 1
  var expenses2line = 0;
  jsonData.expenses2.forEach(item => {
    excel_data.push([
      expenses2line + 1,
      item.item_code,
      item.item_name,
      item.amount,
    ]);
    expenses2line++;
  });

  // สร้าง worksheet จากข้อมูล excel_data
  const worksheet = XLSX.utils.aoa_to_sheet(excel_data);

  // สร้าง workbook
  const workbook = XLSX.utils.book_new();

  // เพิ่ม worksheet ลงใน workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "รายการขนส่ง");

  // เขียนไฟล์ Excel
  XLSX.writeFile(workbook, `${doc_no}รายการขนส่ง.xlsx`);
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
            <Column field="" header="">
              <template #body="slotProps">
                <div class="flex">
                  <Button icon="pi pi-check" label="อนุมัติ" class="p-button-success flex mr-2" @click="showConfirmSendApprove(slotProps.data.doc_no)"></Button>
                  <Button icon="pi pi-times" label="ไม่อนุมัติ" class="p-button-danger flex mr-2" @click="showConfirmDelete(slotProps.data.doc_no)"></Button>

                  <Button icon="pi pi-print" label="พิมพ์" class="p-button-info flex mr-2" @click="printDoc(slotProps.data.doc_no)"></Button>
                  <!-- <Button icon="pi pi-file" label="Export" class="p-button-info flex" @click="exportExcel(slotProps.data.doc_no)"></Button> -->
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
            <span>ต้องการอนุมัติเอกสาร {{ docNoConfirm }} ใช่หรือไม่?</span>

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