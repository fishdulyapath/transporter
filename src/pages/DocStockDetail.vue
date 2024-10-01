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
const doc_no = ref("");
const doc_data = ref({ doc_no: "", doc_date: "", doc_time: "", wh_code: "", wh_name: "", location_code: "", location_name: "", remark: "" });
const doc_detail = ref([]);
const doc_detail_add = ref([]);
const doc_detail_minus = ref([]);
const selectedProduct = ref();
const showConfirmCreateCart = ref(false);
const doc_no_add = ref("");
const doc_no_minus = ref("");
onMounted(async () => {
  if (route.params.id != "" && route.params.id != "" && route.params.id != undefined) {
    doc_no.value = route.params.id;
    await getDocData();
    await getDocDetail();
    doc_no_add.value = "IARM" + doc_no.value.replace("SC", "");
    doc_no_minus.value = "ISPM" + doc_no.value.replace("SC", "");
  }
  storeApp.setPageTitle("ปรับปรุงรายการ " + doc_no.value);
  storeApp.setActivePage("docapprove_list");
  storeApp.setActiveChild("");
});

function goList() {
  router.push({ name: "docapprove_list" });
}

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

        doc_detail.value.forEach((item) => {
          if (item.diff_qty >= 0) {
            doc_detail_add.value.push(item);
          } else if (item.diff_qty < 0) {
            doc_detail_minus.value.push(item);
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
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
function onApproveProcessStock() {
  var minus_detail = doc_detail_minus.value;
  minus_detail.forEach((item) => {
    item.diff_qty = Math.abs(item.diff_qty);
  });

  var post_data = {
    docno: doc_data.value.doc_no,
    docdate: doc_data.value.doc_date,
    doctime: doc_data.value.doc_time,

    branchcode: doc_data.value.branch_code,
    whcode: doc_data.value.wh_code,
    locationcode: doc_data.value.location_code,
    remark: doc_data.value.remark,
    usercode: localStorage._usercode,
    doc_no_add: doc_no_add.value,
    doc_no_minus: doc_no_minus.value,
    details_add: doc_detail_add.value,
    details_minus: minus_detail,
  };
  if (doc_detail_add.value.length == 0) {
    post_data.doc_no_add = "";
  }
  if (minus_detail.length == 0) {
    post_data.doc_no_minus = "";
  }
  console.log(post_data);
  MasterdataService.approveProcessStock(post_data)
    .then((res) => {
      console.log(res);
      if (res.success) {
        console.log(res.data);
        toast.add({
          severity: "success",
          summary: "ปรับปรุงรายการตรวจนับสำเร็จ",
          detail: "",
          life: 3000,
        });
        router.push({ name: "docapprove_list" });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
function showConfirmCreate() {
  if (selectedProduct.value == null) selectedProduct.value = [];
  if (selectedProduct.value.length == 0) {
    toast.add({
      severity: "warn",
      summary: "กรุณาเลือกสินค้าที่ต้องการส่ง",
      detail: "",
      life: 3000,
    });
    selectedProduct.value = null;
    return;
  } else {
    showConfirmCreateCart.value = true;
  }
}

function priceConfirm() {
  if (printprice.value.length > 0) {
    printDialog.value = false;
    console.log(printprice.value.toString());
    const { href } = router.resolve({
      name: "sale_price_print",
      params: {
        id: printData.value.doc_no,
        printprice: printprice.value.toString(),
      },
    });
    window.open(href, "_blank");
  }
}
</script>

<template>
  <AppLayout>
    <MainContentWarp>
      <div class="surface-ground px-2 py-2">
        <Button label="กลับหน้ารายการ" icon="pi pi-arrow-left" class="p-button-text p-button-sm p-button-info" @click="goList()" />
        <div class="surface-card shadow-2 border-round p-fluid p-2">
          <div>
            <p>
              <span><b>เลขที่:</b> {{ doc_data.doc_no }}</span>
              <span style="margin-left: 10px"><b>วันที่:</b> {{ doc_data.doc_date }}</span>
              <span style="margin-left: 10px"><b>เวลา:</b> {{ doc_data.doc_time }}</span>
            </p>
            <p>
              <span><b>สาขา:</b> {{ doc_data.branch_code }}~{{ doc_data.branch_name }}</span>
              <span style="margin-left: 10px"><b>คลัง:</b> {{ doc_data.wh_code }}~{{ doc_data.wh_name }}</span>
              <span style="margin-left: 10px"><b>ที่เก็บ:</b> {{ doc_data.location_code }}~{{ doc_data.location_name }}</span>
            </p>
          </div>
          <div class="mt-2 mb-2">
            <Button @click="showConfirmCreateCart = true" label="บันทึกรายการปรับปรุง" icon="pi pi-play" class="w-auto p-button-success"></Button>
          </div>
          <DataTable :value="doc_detail_add" dataKey="roworder" v-if="doc_detail_add.length > 0" showGridlines>
            <template #header>
              <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                <span class="text-xl text-900 font-bold">ปรับปรุงเพิ่ม เลขที่: {{ doc_no_add }}</span>
              </div>
            </template>
            <Column field="barcode" header="บาร์โค้ด"></Column>
            <Column field="item_name" header="ชื่อ" style="width: 25%"></Column>
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
            <Column field="balance_qty" header="ผลต่าง" bodyStyle="text-align:right" sortable>
              <template #body="slotProps">
                <b v-if="parseFloat(slotProps.data.diff_qty) > -1" style="color: green"> {{ slotProps.data.diff_qty }} </b>
                <b v-if="parseFloat(slotProps.data.diff_qty) < 0" style="color: red"> {{ slotProps.data.diff_qty }} </b>
              </template>
            </Column>
            <Column field="remark" header="หมายเหตุ" ></Column>
          </DataTable>
          <DataTable :value="doc_detail_minus" dataKey="roworder" v-if="doc_detail_minus.length > 0" showGridlines>
            <template #header>
              <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                <span class="text-xl text-900 font-bold">ปรับปรุงลด(ขาด) เลขที่: {{ doc_no_minus }}</span>
              </div>
            </template>
            <Column field="barcode" header="บาร์โค้ด"></Column>
            <Column field="item_name" header="ชื่อ" style="width: 25%"></Column>
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
            <Column field="diff_qty" header="ผลต่าง" bodyStyle="text-align:right" sortable>
              <template #body="slotProps">
                <b v-if="parseFloat(slotProps.data.diff_qty) > -1" style="color: green"> {{ slotProps.data.diff_qty }} </b>
                <b v-if="parseFloat(slotProps.data.diff_qty) < 0" style="color: red"> {{ slotProps.data.diff_qty }} </b>
              </template>
            </Column>
            <Column field="remark" header="หมายเหตุ" ></Column>
          </DataTable>
        </div>
      </div>
      <Dialog v-model:visible="showConfirmCreateCart" :style="{ width: '450px' }" header="ยืนยันการทำงาน" :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span>คุณต้องการบนทึกรายการปรับปรุง ใช่หรือไม่?</span>
        </div>
        <template #footer>
          <Button label="ยกเลิก" icon="pi pi-times" class="p-button-text" @click="showConfirmCreateCart = false" />
          <Button label="ยืนยัน" icon="pi pi-check" class="p-button-text" @click="onApproveProcessStock" />
        </template>
      </Dialog>
    </MainContentWarp>
  </AppLayout>
</template>
