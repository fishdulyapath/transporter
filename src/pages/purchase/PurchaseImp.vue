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
const myFiles = ref('');
const doc_no = ref('');
const doc_date = ref('');
const creator_code = ref('');
const remark = ref('');
const confirmDialog = ref(false);
const captcha = ref('');
const userInput = ref('');
const errorMessage = ref('');

onMounted(() => {
  storeApp.setActivePage("purchase_price");
  storeApp.setActiveChild("purchase_import");
  storeApp.setPageTitle("นำเข้าราคาซื้อ");
  storeApp.setHideToggle();
  doc_no.value = Utils.getDocNoDate('PUR');
  doc_date.value = new Date();
  creator_code.value = localStorage._usercode;


});
const dialogVisible = ref(false);
const emptyFields = ref([]);
const fieldsToCheck = [
  'item_code', 'unit_code', 'from_qty', 'to_qty', 'from_date', 'to_date',
  'sale_price1', 'sale_price2', 'sale_type', 'transport_type', 'status', 'price_type'
];
const validateData = () => {
  emptyFields.value = [];
  console.log(import_data.value)
  import_data.value.forEach((item, index) => {
    const emptyFieldsInItem = fieldsToCheck.filter(field => {
      const value = item[field];
      return value === undefined || value === null || value === '';
    });

    if (emptyFieldsInItem.length > 0) {
      emptyFields.value.push({
        position: index,
        fields: emptyFieldsInItem
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
        item_name: results[index].ชื่อสินค้า != undefined ? results[index].ชื่อสินค้า.toString().trim() : "",
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
        supplier_code: results[index].รหัสเจ้าหนี้ != undefined ? results[index].รหัสเจ้าหนี้.toString().trim() : "",
        discount: results[index].ส่วนลด != undefined ? results[index].ส่วนลด.toString().trim() : "",

      });
    }

    // accountbalancetype: results[index].รหัสสินค้า != undefined ? parseInt(results[index].balance_mode.toString().trim()) : "",
    console.log(details);
    import_data.value = details;
    setTimeout(() => {

      validateData()
    }, 500);
  };
  reader.onerror = function (e) {
    console.log(e);
  };
}

function goList() {
  router.push({ name: 'purchase_doc_list' });
}

const generateCaptcha = () => {
  captcha.value = Math.floor(100000 + Math.random() * 900000).toString();
  userInput.value = '';

};

const cancelConfirmation = () => {
  confirmDialog.value = false;
  userInput.value = '';
  errorMessage.value = '';
};

const confirmSave = async () => {
  if (userInput.value === captcha.value) {
    console.log('Captcha correct, saving...');
    var post_data = {
      doc_no: doc_no.value,
      doc_date: doc_date.value,
      creator_code: creator_code.value,
      remark: remark.value,
      details: import_data.value
    }
    await MasterdataService.createImportDocPur(post_data)
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
          toast.add({ severity: "error", summary: "บันทึกไม่สำเร็จ", detail: res.message });
        }
      })
      .catch((err) => {
        console.log(err);
        confirmDialog.value = false;
      });

  } else {
    errorMessage.value = 'Captcha ไม่ถูกต้อง กรุณาลองใหม่';
    generateCaptcha();
  }
};



function confirmImport() {
  generateCaptcha();
  confirmDialog.value = true;
}
</script>

<template>
  <AppLayout>
    <MainContentWarp>
      <div class="surface-ground px-2 py-2">
        <Button label="กลับหน้ารายการ" icon="pi pi-arrow-left" class="p-button-text p-button-sm p-button-info" @click="goList()" />

        <div class="surface-card shadow-2 border-round p-fluid mt-2" id="boxupdate">
          <Panel header="การค้นหา" :toggleable="true">
            <div class="grid formgrid p-fluid">
              <div class="field mb-4 col-12 md:col-3">
                <label class="font-medium text-900">เลขที่เอกสาร</label>
                <InputText type="text" v-model="doc_no" />
              </div>
              <div class="field mb-4 col-12 md:col-3">
                <label class="font-medium text-900">วันที่</label>
                <Calendar dateFormat="yy-mm-dd" v-model="doc_date" :showIcon="true"> </Calendar>
              </div>
              <div class="field mb-4 col-12 md:col-3">
                <label class="font-medium text-900">ผู้จัดทำ</label>
                <InputText type="text" v-model="creator_code" />
              </div>
              <div class="field mb-4 col-12 md:col-3">
                <label class="font-medium text-900">หมายเหตุ</label>
                <InputText type="text" v-model="remark" />
              </div>
            </div>
            <div class="flex justify-content-start">
              <div class="flex-none flex">
                <Button label="บันทึก" icon="pi pi-play" class="w-auto p-button-success" @click="confirmImport" v-if="import_data.length > 0"></Button>

                <FileUpload mode="basic" name="input file" accept=".xls,.xlsx" ref="myFiles" :customUpload="true" @change="ImportFile()"
                  class="p-button-plain p-button-primary ml-2" chooseIcon="pi pi-upload" chooseLabel="นำเข้าราคาซื้อ"></FileUpload>
              </div>
            </div>
          </Panel>
          <div class="datatable-container mt-2" v-if="import_data.length > 0" style="max-width: 97.5vw;">
            <DataTable :value="import_data" :paginator="true" :rows="50" resizableColumns columnResizeMode="fit" showGridlines
              paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" :rowsPerPageOptions="[50, 70, 100]"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords}">
              <Column field="item_code" header="สินค้า" sortable></Column>
              <Column field="item_name" header="ชื่อสินค้า" sortable></Column>
              <Column field="unit_code" header="หน่วย" sortable class="text-center"></Column>
              <Column field="from_qty" header="จากจำนวน" sortable class="text-right">
                <template #body="slotProps">
                  {{ Utils.formatNumber(slotProps.data.from_qty) }}
                </template>
              </Column>
              <Column field="to_qty" header="ถึงจำนวน" sortable class="text-right">
                <template #body="slotProps">
                  {{ Utils.formatNumber(slotProps.data.to_qty) }}
                </template>
              </Column>
              <Column field="from_date" header="จากวันที่" sortable class="text-center"></Column>
              <Column field="to_date" header="ถึงวันที่" sortable class="text-center"></Column>
              <Column field="sale_type" header="ประเภทการขาย" sortable class="text-center"></Column>
              <!-- <Column field="transport_type" header="ประเภทการขนส่ง" sortable class="text-center"></Column> -->
              <Column field="sale_price1" header="ราคาแยกภาษี" sortable class="text-right" style="color:blueviolet">
                <template #body="slotProps">
                  {{ Utils.formatMoney(slotProps.data.sale_price1) }}
                </template>
              </Column>
              <Column field="sale_price2" header="ราคารวมภาษี" sortable class="text-right" style="color:orange">
                <template #body="slotProps">
                  {{ Utils.formatMoney(slotProps.data.sale_price2) }}
                </template>
              </Column>
              
              <Column field="discount" header="ส่วนลด" sortable class="text-center"></Column>
              <Column field="status" header="สถานะ" sortable class="text-center"></Column>
              <Column field="price_type" header="ประเภทราคา" sortable class="text-center"></Column>
              <Column field="supplier_code" header="เจ้าหนี้" sortable class="text-left"></Column>

            </DataTable>
          </div>
        </div>
        <Dialog v-model:visible="confirmDialog" header="บันทึก" :style="{ width: '50vw' }">
          <div class="flex flex-column align-items-center">
            <div class="mb-3">
              <label for="captcha" class="block mb-2">กรุณากรอกตัวเลขที่เห็น:</label>
              <div class="flex align-items-center">
                <span class="captcha-text mr-3">{{ captcha }}</span>
                <Button icon="pi pi-refresh" @click="generateCaptcha" />
              </div>
            </div>
            <InputText id="captcha" v-model="userInput" placeholder="กรอกตัวเลข" class="mb-3" />
            <small v-if="errorMessage != ''" class="p-error mb-3">{{ errorMessage }}</small>
            <div class="flex justify-content-center">
              <Button label="ยกเลิก" icon="pi pi-times" @click="cancelConfirmation" class="p-button-secondary mr-2" />
              <Button label="บันทึก" icon="pi pi-check" @click="confirmSave" class="p-button-success" />
            </div>
          </div>
        </Dialog>
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