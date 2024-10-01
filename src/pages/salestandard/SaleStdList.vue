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

const toast = useToast();
const data_brand = ref([]);
const data_category = ref([]);
const data_design = ref([]);
const data_group = ref([]);
const data_group_sub = ref([]);
const data_model = ref([]);
const data_pattern = ref([]);
const data_sale_type = ref([{ code: '0', name: 'ไม่เลือก' }, { code: '1', name: 'ขายสด' }, { code: '2', name: 'ขายเชื่อ' }]);
const data_trans_type = ref([{ code: '0', name: 'รับเอง' }, { code: '1', name: 'ส่งให้' }]);
const data_price_type = ref([{ code: '1', name: 'ปรกติ' }, { code: '2', name: 'ตามกลุ่ม' }, { code: '3', name: 'ตามลูกค้า' }]);
const data_status = ref([{ code: '1', name: 'ใช้งาน' }, { code: '0', name: 'ยกเลิก' }]);
const loading = ref(true);
const filterData = ref({
  search: '',
  sale_type: null,
  trans_type: null,
  price_type: null,
  group: null,
  group_sub: null,
  brand: null,
  model: null,
  design: null,
  pattern: null,
  category: null
});
const updateData = ref({
  from_qty: null,
  to_qty: null,
  from_date: null,
  to_date: null,
  sale_type: null,
  transport_type: null,
  price_type: null,
  status: null,
  sale_price1: '',
  sale_price2: '',
  cust_code: null,
  group_main: null,
  group_sub: null,

});
const data_list = ref([]);
const selectedProduct = ref();
onMounted(() => {
  storeApp.setActivePage("sale_std_list");
  storeApp.setActiveChild('');
  storeApp.setPageTitle("รายการสินค้าราคามาตรฐาน");
  storeApp.setHideToggle();

  getMasterData();
});

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  ic_code: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  unit_code: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  from_qty: { value: null, matchMode: FilterMatchMode.EQUALS },
  to_qty: { value: null, matchMode: FilterMatchMode.EQUALS },
  from_date: { value: null, matchMode: FilterMatchMode.DATE_IS },
  to_date: { value: null, matchMode: FilterMatchMode.DATE_IS },
  sale_type: { value: null, matchMode: FilterMatchMode.EQUALS },
  sale_price2: { value: null, matchMode: FilterMatchMode.EQUALS },
  transport_type: { value: null, matchMode: FilterMatchMode.EQUALS },
  price_type: { value: null, matchMode: FilterMatchMode.EQUALS },
  status: { value: null, matchMode: FilterMatchMode.EQUALS }
});

const saleTypes = ref([
  { name: 'ไม่เลือก', code: '0' },
  { name: 'ขายสด', code: '1' },
  { name: 'ขายเชื่อ', code: '2' }
]);

const priceTypes = ref([
  { name: 'ปกติ', code: '1' },
  { name: 'ตามกลุ่ม', code: '2' },
  { name: 'ตามลูกค้า', code: '3' }
]);

const transTypes = ref([
  { name: 'รับเอง', code: '0' },
  { name: 'ส่งให้', code: '1' },
]);

const statuses = ref([
  { name: 'ยกเลิก', code: '0' },
  { name: 'ใช้งาน', code: '1' }
]);

const formatNumber = (value) => {
  return Number(value).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};


const getSaleTypeName = (value) => {
  return saleTypes.value.find(type => type.code === value)?.name || value;
};

const getPriceTypeName = (value) => {
  return priceTypes.value.find(type => type.code === value)?.name || value;
};

const getTransTypeName = (value) => {
  return transTypes.value.find(type => type.code === value)?.name || value;
};

const getStatusName = (value) => {
  return statuses.value.find(status => status.code === value)?.name || value;
};

const getStatusSeverity = (status) => {
  switch (status) {
    case '0':
      return 'danger';
    case '1':
      return 'success';
    default:
      return null;
  }
};

const onCellEditComplete = (e) => {
  const { data, newValue, field } = e;
  const doubleValue = parseFloat(newValue); // Convert newValue to a floating-point number
  data[field] = isNaN(doubleValue) ? 0 : doubleValue; // Ensure it's a valid number, default to 0 if conversion fails
};

async function getMasterData() {

  await MasterdataService.getMasterDataFilter()
    .then((res) => {
      console.log(res);
      if (res.success) {
        data_brand.value = res.data_brand;
        data_category.value = res.data_category;
        data_design.value = res.data_design;
        data_group.value = res.data_group;
        data_group_sub.value = res.data_group_sub;
        data_model.value = res.data_model;
        data_pattern.value = res.data_pattern;
      } else {
        toast.add({ severity: "error", summary: "ดึงข้อมูลล้มเหลว", detail: res.message });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

async function getItemPriceList() {
  console.log(filterData.value);
  var sale_type = filterData.value.sale_type != null ? filterData.value.sale_type : '';
  var trans_type = filterData.value.trans_type != null ? filterData.value.trans_type : '';
  var price_type = filterData.value.price_type != null ? filterData.value.price_type : '';
  var groupmain = filterData.value.group != null ? filterData.value.group : '';
  var groupsub = filterData.value.group_sub != null ? filterData.value.group_sub : '';
  var itembrand = filterData.value.brand != null ? filterData.value.brand : '';
  var itemmodel = filterData.value.model != null ? filterData.value.model : '';
  var itempattern = filterData.value.pattern != null ? filterData.value.pattern : '';
  var itemcategory = filterData.value.category != null ? filterData.value.category : '';
  var itemdesign = filterData.value.design != null ? filterData.value.design : '';
  loading.value = true;

  await MasterdataService.getItemPriceStdList(filterData.value.search, sale_type, trans_type, price_type, groupmain, itembrand, groupsub, itempattern, itemmodel, itemcategory, itemdesign)
    .then((res) => {
      console.log(res);
      if (res.success) {
        data_list.value = res.data
      } else {
        toast.add({ severity: "error", summary: "ดึงข้อมูลล้มเหลว", detail: res.message });
      }
      loading.value = false;
    })
    .catch((err) => {
      console.log(err);
      loading.value = false;
    });

}


function updatePrice() {
  if (selectedProduct.value == null) selectedProduct.value = [];
  if (selectedProduct.value.length > 0) {
    var from_datex = "";
    var to_datex = "";
    console.log(updateData.value);
    if (updateData.value.from_date != "" && updateData.value.from_date != undefined) {
      from_datex = Utils.getDateFormatPG(updateData.value.from_date);
    }
    if (updateData.value.to_date != "" && updateData.value.to_date != undefined) {
      to_datex = Utils.getDateFormatPG(updateData.value.to_date);
    }
    selectedProduct.value.forEach((item) => {
      console.log('updateData.value.sale_price2 ' + updateData.value.sale_price2)

      console.log(item)
      // item.from_qty = (updateData.value.from_qty != null && updateData.value.from_qty != '') ? updateData.value.from_qty : item.from_qty;
      // item.to_qty = (updateData.value.to_qty != null && updateData.value.to_qty != '') ? updateData.value.to_qty : item.to_qty;
      item.from_date = (from_datex != null && from_datex != '') ? from_datex : item.from_date;
      item.to_date = (to_datex != null && to_datex != '') ? to_datex : item.to_date;
      // item.sale_type = (updateData.value.sale_type != null && updateData.value.sale_type != '') ? updateData.value.sale_type : item.sale_type;
      // item.transport_type = (updateData.value.transport_type != null && updateData.value.transport_type != '') ? updateData.value.transport_type : item.transport_type;
      item.sale_price1 = (updateData.value.sale_price1 != null && updateData.value.sale_price1 != '') ? updateData.value.sale_price1 : item.sale_price1;
      item.sale_price2 = (updateData.value.sale_price2 != null && updateData.value.sale_price2 != '') ? updateData.value.sale_price2 : item.sale_price2;
      item.status = (updateData.value.status != null && updateData.value.status != '') ? updateData.value.status : item.status;
      // item.price_type = (updateData.value.price_type != null && updateData.value.price_type != '') ? updateData.value.price_type : item.price_type;
      // item.cust_code = (updateData.value.cust_code != null && updateData.value.cust_code != '') ? updateData.value.cust_code : item.cust_code;
      // item.cust_group_1 = (updateData.value.group_main != null && updateData.value.group_main != '') ? updateData.value.group_main : item.cust_group_1;
      // item.cust_group_2 = (updateData.value.group_sub != null && updateData.value.group_sub != '') ? updateData.value.group_sub : item.cust_group_2;
    });
  }

}

function convertStatus(status) {
  return status == 1 || status == "1"
}

function updateStatus(data, value) {
  data.status = value ? 1 : 0;
}

function exportExcel() {
  if (selectedProduct.value == null) selectedProduct.value = [];
  if (selectedProduct.value.length > 0) {
    console.log(selectedProduct.value);
    var excel_data = []



    selectedProduct.value.forEach((item) => {
      var data = {
        รหัสสินค้า: item.ic_code.toString(),
        ชื่อสินค้า: item.item_name.toString(),
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

    XLSX.writeFile(workbook, "ราคามาตรฐาน.xlsx");
  }
}

function saveUpdate() {
  if (selectedProduct.value == null) selectedProduct.value = [];
  if (selectedProduct.value.length > 0) {
    console.log(selectedProduct.value);
    var data = [];
    selectedProduct.value.forEach((item) => {
      var obj = {
        roworder: item.roworder,
        ic_code: item.ic_code,
        unit_code: item.unit_code,
        from_qty: item.from_qty,
        to_qty: item.to_qty,
        from_date: item.from_date,
        to_date: item.to_date,
        sale_type: item.sale_type,
        transport_type: item.transport_type,
        sale_price1: item.sale_price1,
        sale_price2: item.sale_price2,
        status: item.status,
        price_type: item.price_type,
        cust_code: item.cust_code,
        cust_group_1: item.cust_group_1,
        cust_group_2: item.cust_group_2,
      };
      data.push(obj);
    });

    var post_data = {
      creator_code: localStorage._usercode,
      details: data,
    };
    console.log(post_data);
    MasterdataService.saveItemPriceSTD(post_data)
      .then((res) => {
        console.log(res);
        if (res.success) {
          getItemPriceList()
          toast.add({ severity: "success", summary: "บันทึกรายการสำเร็จ", detail: res.message });
        } else {
          toast.add({ severity: "error", summary: "บันทึกรายการล้มเหลว", detail: res.message });
        }
      })
      .catch((err) => {
        console.log(err);
      });
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
                <label class="font-medium text-900">ค้นหาสินค้า</label>
                <InputText type="text" v-model="filterData.search" />
              </div>
              <div class="field mb-4 col-12 md:col-3">
                <label class="font-medium text-900">ประเภทการขาย</label>
                <Dropdown v-model="filterData.sale_type" :options="data_sale_type" showClear optionLabel="name" optionValue="code" placeholder="เลือกประเภทการขาย" />
              </div>
              <div class="field mb-4 col-12 md:col-3">
                <label class="font-medium text-900">ประเภทการส่ง</label>
                <Dropdown v-model="filterData.trans_type" :options="data_trans_type" showClear optionLabel="name" optionValue="code" placeholder="เลือกประเภทการส่ง" />
              </div>
              <div class="field mb-4 col-12 md:col-3">
                <label class="font-medium text-900">ประเภทราคา</label>
                <Dropdown v-model="filterData.price_type" :options="data_price_type" showClear optionLabel="name" optionValue="code" placeholder="เลือกประเภทราคา" />
              </div>
              <div class="field mb-4 col-12 md:col-3">
                <label class="font-medium text-900">กลุ่มหลัก</label>
                <Dropdown v-model="filterData.group" :options="data_group" showClear filter optionLabel="name" optionValue="code" placeholder="เลือกกลุ่มหลัก" />
              </div>
              <div class="field mb-4 col-12 md:col-3">
                <label class="font-medium text-900">กลุ่มย่อย</label>
                <Dropdown v-model="filterData.group_sub" :options="data_group_sub" showClear filter optionLabel="name" optionValue="code" placeholder="เลือกกลุ่มย่อย" />
              </div>
              <div class="field mb-4 col-12 md:col-3">
                <label class="font-medium text-900">ยี่ห้อ</label>
                <Dropdown v-model="filterData.brand" :options="data_brand" showClear filter optionLabel="name" optionValue="code" placeholder="เลือกยี่ห้อ" />
              </div>
              <div class="field mb-4 col-12 md:col-3">
                <label class="font-medium text-900">รุ่น</label>
                <Dropdown v-model="filterData.model" :options="data_model" showClear filter optionLabel="name" optionValue="code" placeholder="เลือกรุ่น" />
              </div>
              <div class="field mb-4 col-12 md:col-3">
                <label class="font-medium text-900">รูปทรงสินค้า</label>
                <Dropdown v-model="filterData.design" :options="data_design" showClear filter optionLabel="name" optionValue="code" placeholder="เลือกรูปทรงสินค้า" />
              </div>
              <div class="field mb-4 col-12 md:col-3">
                <label class="font-medium text-900">รูปแบบ</label>
                <Dropdown v-model="filterData.pattern" :options="data_pattern" showClear filter optionLabel="name" optionValue="code" placeholder="เลือกรูปแบบ" />
              </div>
              <div class="field mb-4 col-12 md:col-3">
                <label class="font-medium text-900">หมวดหมู่</label>
                <Dropdown v-model="filterData.category" :options="data_category" showClear filter optionLabel="name" optionValue="code" placeholder="เลือกหมวดหมู่" />
              </div>
              <div class="field col-12">
                <Button label="ค้นหาสินค้า" icon="pi pi-play" class="w-auto p-button-success" @click="getItemPriceList"></Button>
              </div>
            </div>
          </Panel>
          <Panel header="ปรับราคา และ ส่งออก" :toggleable="true" :collapsed="false">
            <div class="grid formgrid p-fluid">
              <!-- <div class="field col-6 md:col-2">
                <label class="font-medium text-900">จากจำนวน</label>
                <InputText type="number" v-model="updateData.from_qty" />
              </div>
              <div class="field col-6 md:col-2">
                <label class="font-medium text-900">ถึงจำนวน</label>
                <InputText type="number" v-model="updateData.to_qty" />
              </div> -->
              <div class="field col-6 md:col-2">
                <label class="font-medium text-900">จากวันที่</label>
                <Calendar dateFormat="yy-mm-dd" :showIcon="true" v-model="updateData.from_date"> </Calendar>
              </div>
              <div class="field col-6 md:col-2">
                <label class="font-medium text-900">ถึงวันที่</label>
                <Calendar dateFormat="yy-mm-dd" :showIcon="true" v-model="updateData.to_date"> </Calendar>
              </div>
              <!-- <div class="field col-6 md:col-2">
                <label class="font-medium text-900">ประเภทขาย</label>
                <Dropdown v-model="updateData.sale_type" :options="data_sale_type" showClear optionLabel="name" optionValue="code" placeholder="เลือกประเภทการขาย" />
              </div>
              <div class="field col-6 md:col-2">
                <label class="font-medium text-900">ประเภทส่ง</label>
                <Dropdown v-model="updateData.transport_type" :options="data_trans_type" showClear optionLabel="name" optionValue="code" placeholder="เลือกประเภทการส่ง" />
              </div> -->
              <div class="field col-6 md:col-2">
                <label class="font-medium text-900">ราคาแยกภาษี</label>
                <InputText type="text" v-model="updateData.sale_price1" />
              </div>
              <div class="field col-6 md:col-2">
                <label class="font-medium text-900">ราคารวมภาษี</label>
                <InputText type="text" v-model="updateData.sale_price2" />
              </div>
              <div class="field col-6 md:col-2">
                <label class="font-medium text-900">สถานะ</label>
                <Dropdown v-model="updateData.status" :options="data_status" showClear optionLabel="name" optionValue="code" placeholder="เลือกสถานะ" />
              </div>
              <!-- <div class="field col-6 md:col-2">
                <label class="font-medium text-900">ประเภทราคา</label>
                <Dropdown v-model="updateData.price_type" :options="data_price_type" showClear optionLabel="name" optionValue="code" placeholder="เลือกประเภท" />
              </div>
              <div class="field col-6 md:col-2">
                <label class="font-medium text-900">ลูกค้า</label>
                <InputText type="text" v-model="updateData.cust_code" />
              </div>
              <div class="field col-6 md:col-2">
                <label class="font-medium text-900">กลุ่มหลัก</label>
                <Dropdown v-model="updateData.group_main" :options="data_group" showClear filter optionLabel="name" optionValue="code" placeholder="เลือกกลุ่มหลัก" />
              </div>
              <div class="field col-6 md:col-2">
                <label class="font-medium text-900">กลุ่มย่อย</label>
                <Dropdown v-model="updateData.group_sub" :options="data_group_sub" showClear filter optionLabel="name" optionValue="code" placeholder="เลือกกลุ่มหลัก" />
              </div> -->
              <div class="field col-12">
                <Button label="ปรับราคา" icon="pi pi-play" class="w-auto p-button-success" @click="updatePrice"></Button>
                <Button label="บันทึกรายการที่เลือก" icon="pi pi-save" class="w-auto p-button-danger ml-2" @click="saveUpdate"></Button>
                <Button label="Export" icon="pi pi-download" class="w-auto p-button-info ml-2" @click="exportExcel"></Button>
              </div>
            </div>
          </Panel>
        </div>
        <div class="card shadow-2 border-round bg-white mt-2" v-if="data_list.length > 0" style="max-width: 97vw;">
          <DataTable :value="data_list" editMode="cell" @cell-edit-complete="onCellEditComplete" v-model:selection="selectedProduct" paginator resizableColumns
            columnResizeMode="fit" showGridlines :rows="10" dataKey="roworder" :loading="loading"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" :rowsPerPageOptions="[10, 50, 100, 150]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" responsiveLayout="scroll">

            <template #empty> ไม่พบข้อมูล </template>
            <template #loading> กำลังโหลดข้อมูล กรุณารอสักครู่ </template>
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column field="ic_code" header="รหัสสินค้า" sortable>
              <template #body="{ data }">
                {{ data.ic_code }}
              </template>
            </Column>
            <Column field="item_name" header="ชื่อสินค้า" sortable>
              <template #body="{ data }">
                {{ data.item_name }}
              </template>
            </Column>
            <Column field="unit_code" header="หน่วย" class="text-center" sortable>
              <template #body="{ data }">
                {{ data.unit_code }}
              </template>
            </Column>

            <Column field="from_qty" header="จากจำนวน" class="text-right" sortable>
              <template #body="{ data }">
                {{ formatNumber(data.from_qty) }}
              </template>
            </Column>

            <Column field="to_qty" header="ถึงจำนวน" class="text-right" sortable>
              <template #body="{ data }">
                {{ formatNumber(data.to_qty) }}
              </template>
            </Column>

            <Column field="from_date" header="จากวันที่" class="text-center" sortable>
              <template #body="{ data }">
                {{ data.from_date }}
              </template>
            </Column>

            <Column field="to_date" header="ถึงวันที่" class="text-center" sortable>
              <template #body="{ data }">
                {{ data.to_date }}
              </template>
            </Column>

            <Column field="sale_type" header="ประเภทขาย" class="text-center" sortable>
              <template #body="{ data }">
                {{ getSaleTypeName(data.sale_type) }}
              </template>
            </Column>

            <!-- <Column field="transport_type" header="ประเภทส่ง" class="text-center" sortable>
              <template #body="{ data }">
                {{ getTransTypeName(data.transport_type) }}
              </template>
            </Column> -->

            <Column field="sale_price1" header="ราคาแยกภาษี" bodyClass="text-right" sortable style="color:blueviolet">

              <template #body="{ data }">
                {{ Utils.formatMoney(data.sale_price1) }}
              </template>
              <template #editor="{ data, field }">
                <InputText fluid type="text" v-model="data[field]" />
              </template>
            </Column>

            <Column field="sale_price2" header="ราคารวมภาษี" bodyClass="text-right" sortable style="color:orange">
              <template #body="{ data }">
                {{ Utils.formatMoney(data.sale_price2) }}
              </template>
              <template #editor="{ data, field }">
                <InputText fluid type="text" v-model="data[field]" />
              </template>
            </Column>
            <Column field="status" header="สถานะ" class="text-center" sortable>
              <template #body="{ data }">
                <Checkbox :model-value="convertStatus(data.status)" @update:model-value="value => updateStatus(data, value)" :binary="true" />
              </template>
            </Column>

            <Column field="price_type" header="ประเภทราคา" class="text-center" sortable>
              <template #body="{ data }">
                {{ getPriceTypeName(data.price_type) }}
              </template>
            </Column>

            <Column field="cust_code" header="ลูกค้า" sortable>
              <template #body="{ data }">
                {{ getPriceTypeName(data.cust_code) }}
              </template>
            </Column>

            <Column field="cust_group_1" header="กลุ่มหลัก" sortable>
              <template #body="{ data }">
                {{ getPriceTypeName(data.cust_group_1) }}
              </template>
            </Column>

            <Column field="cust_group_2" header="กลุ่มย่อย" sortable>
              <template #body="{ data }">
                {{ getPriceTypeName(data.cust_group_2) }}
              </template>
            </Column>

            <Column field="doc_no" header="เอกสาร" sortable>
              <template #body="{ data }">
                {{ data.doc_no }}
              </template>
            </Column>

            <Column field="doc_date" header="วันที่" sortable>
              <template #body="{ data }">
                <span v-if="data.doc_no != '' || data.creator_code != ''">{{ data.doc_date }} {{ data.doc_time }}</span>
              </template>
            </Column>

            <Column field="creator_code" header="ผู้จัดทำ" sortable>
              <template #body="{ data }">
                {{ data.creator_code }}
              </template>
            </Column>

          </DataTable>
        </div>
      </div>
    </MainContentWarp>
  </AppLayout>
</template>
