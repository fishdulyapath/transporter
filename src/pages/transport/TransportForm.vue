<script setup>
import AppLayout from "@/components/layout/AppLayout.vue";
import MainContentWarp from "@/components/MainContentWarp.vue";
import { onMounted, ref } from "vue";
import { useApp } from "@/stores/app.js";
import * as XLSX from "xlsx";
import Utils from "@/utils/";
import { useRouter, useRoute } from "vue-router";
import MasterdataService from "@/services/MasterdataService";
import { useToast } from "primevue/usetoast";

const router = useRouter();
const storeApp = useApp();
const import_data = ref([]);
const route = useRoute();
const toast = useToast();
const myFiles = ref("");
const doc_no = ref("");
const doc_date = ref("");
const creator_code = ref("");
const remark = ref("");
const confirmDialog = ref(false);
const captcha = ref("");
const userInput = ref("");
const errorMessage = ref("");

onMounted(() => {
  storeApp.setActivePage("transport_list");
  storeApp.setActiveChild("");
  storeApp.setPageTitle("สร้างเอกสารใหม่");

  if (route.params.id != "" && route.params.id != "" && route.params.id != undefined) {
    if (route.params.id == "new") {
      doc_no.value = "";
      doc_date.value = new Date();
      creator_code.value = localStorage._usercode;
      remark.value = "";
    } else {
      doc_no.value = route.params.id;
    }
    //getDocDetail();
  }
});
const dialogVisible = ref(false);
const emptyFields = ref([]);
const fieldsToCheck = ["item_code", "unit_code", "from_qty", "to_qty", "from_date", "to_date", "sale_price1", "sale_price2", "sale_type", "transport_type", "status", "price_type"];
const validateData = () => {
  emptyFields.value = [];
  console.log(import_data.value);
  import_data.value.forEach((item, index) => {
    const emptyFieldsInItem = fieldsToCheck.filter((field) => {
      const value = item[field];
      return value === undefined || value === null || value === "";
    });

    if (emptyFieldsInItem.length > 0) {
      emptyFields.value.push({
        position: index,
        fields: emptyFieldsInItem,
      });
    }
  });

  if (emptyFields.value.length > 0) {
    dialogVisible.value = true;
  }
};
function ImportFile() {
  var config = { raw: true, type: "string" };
  var reader = new FileReader();
  reader.readAsArrayBuffer(myFiles.value.files[0]);
  reader.onload = function (e) {
    var data = new Uint8Array(reader.result);
    var wb = XLSX.read(data, { type: "array" });
    var firstSheetName = wb.SheetNames[0];
    var worksheet = wb.Sheets[firstSheetName];
    var results = XLSX.utils.sheet_to_json(worksheet, config);

    console.log(results);
    var details = [];
    for (let index = 0; index < results.length; index++) {
      console.log(results[index]);
      details.push({
        item_code: results[index].รหัสสินค้า != undefined ? results[index].รหัสสินค้า.toString().trim() : "",
        unit_code: results[index].หน่วยนับ != undefined ? results[index].หน่วยนับ.toString().trim() : "",
        from_qty: results[index].จากจำนวน != undefined ? results[index].จากจำนวน.toString().trim() : "",
        to_qty: results[index].ถึงจำนวน != undefined ? results[index].ถึงจำนวน.toString().trim() : "",
        from_date: results[index].จากวันที่ != undefined ? results[index].จากวันที่.toString().trim() : "",
        to_date: results[index].ถึงวันที่ != undefined ? results[index].ถึงวันที่.toString() : "",
        sale_type: results[index].ประเภทการขาย != undefined ? results[index].ประเภทการขาย.toString().trim() : "",
        transport_type: results[index].ประเภทการส่ง != undefined ? results[index].ประเภทการส่ง.toString().trim() : "",
        sale_price1: results[index].ราคาแยกภาษี != undefined ? results[index].ราคาแยกภาษี : "",
        sale_price2: results[index].ราคารวมภาษี != undefined ? results[index].ราคารวมภาษี : "",
        status: results[index].สถานะ != undefined ? results[index].สถานะ.toString().trim() : "",
        price_type: results[index].ประเภทราคา != undefined ? results[index].ประเภทราคา.toString().trim() : "",
        cust_code: results[index].รหัสลูกค้า != undefined ? results[index].รหัสลูกค้า.toString().trim() : "",
        cust_group_1: results[index].กลุ่มลูกค้าหลัก != undefined ? results[index].กลุ่มลูกค้าหลัก.toString().trim() : "",
        cust_group_2: results[index].กลุ่มลูกค้าย่อย != undefined ? results[index].กลุ่มลูกค้าย่อย.toString().trim() : "",
        price_mode: 1,
      });
    }

    // accountbalancetype: results[index].รหัสสินค้า != undefined ? parseInt(results[index].balance_mode.toString().trim()) : "",
    console.log(details);
    import_data.value = details;
    setTimeout(() => {
      validateData();
    }, 500);
  };
  reader.onerror = function (e) {
    console.log(e);
  };
}

function goList() {
  router.push({ name: "sale_price_import_list" });
}

const generateCaptcha = () => {
  captcha.value = Math.floor(100000 + Math.random() * 900000).toString();
  userInput.value = "";
};

const cancelConfirmation = () => {
  confirmDialog.value = false;
  userInput.value = "";
  errorMessage.value = "";
};

const confirmSave = async () => {
  if (userInput.value === captcha.value) {
    console.log("Captcha correct, saving...");
    var post_data = {
      doc_no: doc_no.value,
      doc_date: doc_date.value,
      creator_code: localStorage._usercode,
      details: import_data.value,
    };
    await MasterdataService.reactiveDocNM(post_data)
      .then((res) => {
        console.log(res);
        if (res.success) {
          confirmDialog.value = false;
          toast.add({
            severity: "success",
            summary: "สำเร็จ",
            detail: "บันทึกเอกสารสำเร็จ",
          });
          goList();
        } else {
          confirmDialog.value = false;
          toast.add({
            severity: "error",
            summary: "บันทึกไม่สำเร็จ",
            detail: res.message,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        confirmDialog.value = false;
      });
  } else {
    errorMessage.value = "Captcha ไม่ถูกต้อง กรุณาลองใหม่";
    generateCaptcha();
  }
};

async function getDocDetail() {
  await MasterdataService.getDocDetailNM(doc_no.value)
    .then((res) => {
      console.log(res);
      if (res.success) {
        doc_date.value = res.data.doc_date + " " + res.data.doc_time;
        creator_code.value = res.data.creator_code;
        remark.value = res.data.remark;
        import_data.value = res.data.details;
      } else {
        toast.add({
          severity: "error",
          summary: "ดึงข้อมูลล้มเหลว",
          detail: res.message,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function confirmImport() {
  generateCaptcha();
  confirmDialog.value = true;
}
</script>

<template>
  <AppLayout>
    <MainContentWarp>
      <div class="surface-ground px-1 py-1">
        <Button label="กลับหน้ารายการ" icon="pi pi-arrow-left" class="p-button-text p-button-sm p-button-info" @click="goList()" />

        <div class="surface-card shadow-2 border-round p-fluid mt-2 p-4" id="boxupdate">
          <div class="grid formgrid p-fluid">
            <div class="field mb-4 col-12 md:col-3">
              <label class="font-medium text-900">ใบปฏิบ้ติงาน</label>
              <InputText type="text" readonly />
            </div>
            <div class="field mb-4 col-12 md:col-3">
              <label class="font-medium text-900">วันที่</label>
              <InputText readonly />
            </div>
            <div class="field mb-4 col-12 md:col-3">
              <label class="font-medium text-900">ทะเบียนรถ</label>
              <InputText type="text" readonly />
            </div>
            <div class="field mb-4 col-12 md:col-3">
              <label class="font-medium text-900">วันที่กลับ</label>
              <InputText type="text" readonly />
            </div>
            <div class="field mb-4 col-12 md:col-3">
              <label class="font-medium text-900">คนขับ1</label>
              <InputText type="text" readonly />
            </div>
            <div class="field mb-4 col-12 md:col-3">
              <label class="font-medium text-900">คนขับ2</label>
              <InputText type="text" readonly />
            </div>
          </div>
          <TabView>
            <TabPanel header="รายละเอียดขาไป">
              <div class="grid formgrid p-fluid">
                <div class="field mb-4 col-12 md:col-3">
                  <label class="font-medium text-900">วันที่ขย</label>
                  <InputText type="text" readonly />
                </div>
                <div class="field mb-4 col-12 md:col-3">
                  <label class="font-medium text-900">รหัสลูกค้า</label>
                  <InputText readonly />
                </div>
                <div class="field mb-4 col-12 md:col-3">
                  <label class="font-medium text-900">ใบสั่งงาน</label>
                  <InputText type="text" readonly />
                </div>
                <div class="field mb-4 col-12 md:col-3">
                  <label class="font-medium text-900">ลำดับ</label>
                  <InputText type="text" readonly />
                </div>
                <div class="field mb-4 col-12 md:col-3">
                  <label class="font-medium text-900">เส้นทาง</label>
                  <InputText type="text" readonly />
                </div>
                <div class="field mb-4 col-12 md:col-3">
                  <label class="font-medium text-900">ต้นทาง</label>
                  <InputText type="text" readonly />
                </div>
                <div class="field mb-4 col-12 md:col-3">
                  <label class="font-medium text-900">ปลายทาง</label>
                  <InputText type="text" readonly />
                </div>
                <div class="field mb-4 col-12 md:col-3">
                  <label class="font-medium text-900">ชื่อร้านปลายทาง</label>
                  <InputText type="text" readonly />
                </div>
                <div class="field mb-4 col-12 md:col-3">
                  <label class="font-medium text-900">สินค้า</label>
                  <InputText type="text" readonly />
                </div>
                <div class="field mb-4 col-12 md:col-3">
                  <label class="font-medium text-900">น้ำหนัก</label>
                  <InputText type="text" readonly />
                </div>
                <div class="field mb-4 col-12 md:col-3">
                  <label class="font-medium text-900">จำนวน</label>
                  <InputText type="text" readonly />
                </div>
              </div>
              <div class="grid formgrid p-fluid">
                <h4>คิดตาม</h4>
                <div class="field mb-4 col-12">
                  <div class="flex flex-wrap gap-4">
                    <div class="flex items-center">
                      <RadioButton  value="0" />
                      <label class="ml-2">น้ำหนัก</label>
                    </div>
                    <div class="flex items-center">
                      <RadioButton value="1" class="ml-2" />
                      <label class="ml-2">ต่อเที่ยว</label>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel header="รายละเอียดขากลับ">
              <p class="m-0">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et
                quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
                eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
              </p>
            </TabPanel>
          </TabView>
        </div>
      </div>
    </MainContentWarp>
  </AppLayout>
</template>
<style>
.captcha-text {
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 5px;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
}
</style>
