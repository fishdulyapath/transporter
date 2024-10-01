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

const storeApp = useApp();

const router = useRouter();

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
const nosentprice = ref("0")
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
const expandedRows = ref([]);


onMounted(() => {
  storeApp.setActivePage("dashboard");
  storeApp.setActiveChild('');
  storeApp.setPageTitle("รายการขนส่ง");


});


const fetchDetails = async (rowData) => {
  try {
    console.log(rowData)

    await MasterdataService.getDashBoardDetail(rowData.ic_code)
      .then((res) => {
        console.log(res);
        if (res.success) {
          rowData.details = res.data;
        } else {
          toast.add({ severity: "error", summary: "ดึงข้อมูลล้มเหลว", detail: res.message });
          rowData.details = [];
        }
      })
      .catch((err) => {
        console.log(err);
        toast.add({ severity: "error", summary: "ดึงข้อมูลล้มเหลว", detail: res.message });
        rowData.details = [];
      });

  } catch (error) {
    console.error('Error fetching details:', error);
    rowData.details = []; // หรือจัดการ error ตามที่คุณต้องการ
  }
};

const onRowExpand = (event) => {
  const rowData = event.data;

  if (!rowData.details) {
    fetchDetails(rowData);
  }
};

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
function goToCreate() {
  router.push({ name: "transporter_detail", params: { id: 'new' } });
}

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
  var nosentpricex = nosentprice.value != null ? nosentprice.value : '0';
  loading.value = true;

  await MasterdataService.getItemPriceDashboardList(filterData.value.search, sale_type, trans_type, price_type, groupmain, itembrand, groupsub, itempattern, itemmodel, itemcategory, itemdesign, nosentpricex)
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

const rowClass = (data) => {
  return {
    'bg-blue-100': data.type === '0',
    'bg-yellow-200': data.type === '1',
    'bg-red-200': data.type === '2'
  };
};

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
      item.from_qty = (updateData.value.from_qty != null && updateData.value.from_qty != '') ? updateData.value.from_qty : item.from_qty;
      item.to_qty = (updateData.value.to_qty != null && updateData.value.to_qty != '') ? updateData.value.to_qty : item.to_qty;
      item.from_date = (from_datex != null && from_datex != '') ? from_datex : item.from_date;
      item.to_date = (to_datex != null && to_datex != '') ? to_datex : item.to_date;
      item.sale_type = (updateData.value.sale_type != null && updateData.value.sale_type != '') ? updateData.value.sale_type : item.sale_type;
      item.transport_type = (updateData.value.transport_type != null && updateData.value.transport_type != '') ? updateData.value.transport_type : item.transport_type;
      item.sale_price1 = (updateData.value.sale_price1 != null && updateData.value.sale_price1 != '') ? updateData.value.sale_price1 : item.sale_price1;
      item.sale_price2 = (updateData.value.sale_price2 != null && updateData.value.sale_price2 != '') ? updateData.value.sale_price2 : item.sale_price2;
      item.status = (updateData.value.status != null && updateData.value.status != '') ? updateData.value.status : item.status;
      item.price_type = (updateData.value.price_type != null && updateData.value.price_type != '') ? updateData.value.price_type : item.price_type;
      item.cust_code = (updateData.value.cust_code != null && updateData.value.cust_code != '') ? updateData.value.cust_code : item.cust_code;
      item.cust_group_1 = (updateData.value.group_main != null && updateData.value.group_main != '') ? updateData.value.group_main : item.cust_group_1;
      item.cust_group_2 = (updateData.value.group_sub != null && updateData.value.group_sub != '') ? updateData.value.group_sub : item.cust_group_2;
    });
  }

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
                <label class="font-medium text-900">ค้นหาสินค้า</label>
                <InputText type="text" v-model="filterData.search" />
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

              <div class="field mb-4 col-12 ">
               
                <div class="flex flex-wrap gap-4">
                  <div class="flex items-center">
                    <RadioButton v-model="nosentprice" value="0" />
                    <label class="ml-2">ทั้งหมด</label>
                  </div>
                  <div class="flex items-center">
                    <RadioButton v-model="nosentprice" value="1" class="ml-2"/>
                    <label class="ml-2">มีราคาขายส่ง</label>
                  </div>
                  <div class="flex items-center">
                    <RadioButton v-model="nosentprice" value="2" class="ml-2" />
                    <label class="ml-2">ไม่มีราคาขายส่ง</label>
                  </div>

                </div>

              </div>



              <div class="field col-12">
                <Button label="ค้นหา" icon="pi pi-play" class="w-auto p-button-info"></Button>
                <Button label="สร้างเอกสารใหม่" icon="pi pi-plus" class="w-auto p-button-success ml-2" @click="goToCreate"></Button>
                
              </div>
            </div>
          </Panel>

        </div>
        <div class="card shadow-2 border-round bg-white mt-2" v-if="data_list.length > 0" style="max-width: 97vw;">
          <DataTable :value="data_list" paginator resizableColumns columnResizeMode="fit" showGridlines :rows="10" dataKey="ic_code" :loading="loading"
            v-model:expandedRows="expandedRows" @rowExpand="onRowExpand"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" :rowsPerPageOptions="[10, 50, 100, 150]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" responsiveLayout="scroll">

            <template #empty> ไม่พบข้อมูล </template>
            <template #loading> กำลังโหลดข้อมูล กรุณารอสักครู่ </template>
            <Column :expander="true" style="width: 3rem" />
            <Column field="ic_code" header="รหัสสินค้า" sortable>
              <template #body="{ data }">
                {{ data.ic_code }}
              </template>
            </Column>


            <Column field="ic_name" header="ชื่อ" class="text-left" sortable>
              <template #body="{ data }">
                {{ data.ic_name }}
              </template>
            </Column>

            <Column field="ic_name_2" header="ชื่ออังกฤษ" class="text-left" sortable>
              <template #body="{ data }">
                {{ data.ic_name_2 }}
              </template>
            </Column>

            <Column field="totala" header="ปลีกสด" class="text-right" sortable>
              <template #body="{ data }">
                {{ formatNumber(data.totala) }}
              </template>
            </Column>

            <Column field="totalb" header="ปลีกเชื่อ" class="text-right" sortable>
              <template #body="{ data }">
                {{ formatNumber(data.totalb) }}
              </template>
            </Column>

            <Column field="totalc" header="ขายส่ง" class="text-right" sortable>
              <template #body="{ data }">
                {{ formatNumber(data.totalc) }}
              </template>
            </Column>

            <Column field="xxx" header="ราคาซื้อ" class="text-right" sortable>
              <template #body="{ data }">
                {{ formatNumber(data.xxx) }}
              </template>
            </Column>

            <Column field="totald" header="ซื้อล่าสุด" class="text-right" sortable>
              <template #body="{ data }">
                {{ formatNumber(data.totald) }}
              </template>
            </Column>

            <Column field="totale" header="ทุนเฉลี่ย" class="text-right" sortable>
              <template #body="{ data }">
                {{ formatNumber(data.totale) }}
              </template>
            </Column>
            <template #expansion="slotProps">
              <div class="p-1">
                <DataTable :value="slotProps.data.details" v-if="slotProps.data.details" :rowClass="rowClass">
                  <Column field="price_type" header="ประเภทราคา" headerClass="text-center">
                    <template #body="{ data }">
                      <span v-if="data.type == '0'">ซื้อ</span>
                      <span v-if="data.type == '1'">ทั่วไป {{ (data.price_type == '2') ? `[${Utils.getPriceTypeNameDash(data.price_type)}]` : (data.price_type == '3') ?
                        `[${Utils.getPriceTypeNameDash(data.price_type)}]` : '' }}</span>
                      <span v-if="data.type == '2'">มาตรฐาน {{ (data.price_type == '2') ? `[${Utils.getPriceTypeNameDash(data.price_type)}]` : (data.price_type == '3') ?
                        `[${Utils.getPriceTypeNameDash(data.price_type)}]` : '' }}</span>
                    </template>
                  </Column>
                  <Column field="sale_type" header="ประเภทซื้อ/ขาย" headerClass="text-center">
                    <template #body="{ data }">
                      {{ Utils.getSaleTypeName(data.sale_type) }}
                    </template>
                  </Column>
                  <Column field="cust_name" header="ชื่อลูกหนี้/เจ้าหนี้" headerClass="text-center">
                    <template #body="{ data }">
                      {{ data.cust_name }}
                    </template>
                  </Column>
                  <Column field="cust_group_1" header="กลุ่มหลัก" headerClass="text-center">
                    <template #body="{ data }">
                      {{ data.cust_group_1 }}
                    </template>
                  </Column>
                  <Column field="cust_group_2" header="กลุ่มย่อย" headerClass="text-center">
                    <template #body="{ data }">
                      {{ data.cust_group_2 }}
                    </template>
                  </Column>
                  <Column field="from_qty" header="จากจำนวน" headerClass="text-center" bodyClass="text-right">
                    <template #body="{ data }">
                      {{ formatNumber(data.from_qty) }}
                    </template>
                  </Column>
                  <Column field="to_qty" header="ถึงจำนวน" headerClass="text-center" bodyClass="text-right">
                    <template #body="{ data }">
                      {{ formatNumber(data.from_qty) }}
                    </template>
                  </Column>
                  <Column field="unit_code" header="หน่วย" class="text-center" headerClass="text-center">
                    <template #body="{ data }">
                      {{ data.unit_code }}
                    </template>
                  </Column>
                  <Column field="from_date" header="จากวันที่" headerClass="text-center" bodyClass="text-center">
                    <template #body="{ data }">
                      {{ data.from_date }}
                    </template>
                  </Column>
                  <Column field="to_date" header="ถึงวันที่" headerClass="text-center" bodyClass="text-center">
                    <template #body="{ data }">
                      {{ data.to_date }}
                    </template>
                  </Column>
                  <Column field="sale_price1" header="ราคาแยกภาษี" headerClass="text-center" bodyClass="text-right">
                    <template #body="{ data }">
                      {{ Utils.formatMoney(data.sale_price1) }}
                    </template>
                  </Column>
                  <Column field="sale_price2" header="ราคารวมภาษี" headerClass="text-center" bodyClass="text-right">
                    <template #body="{ data }">
                      {{ Utils.formatMoney(data.sale_price2) }}
                    </template>
                  </Column>
                  <Column field="creator_code" header="ผู้แก้ไข" headerClass="text-center" bodyClass="text-left">
                    <template #body="{ data }">
                      {{ data.creator_code }}
                    </template>
                  </Column>
                  <Column field="doc_date" header="วันที่แก้ล่าสุด" headerClass="text-center" bodyClass="text-center">
                    <template #body="{ data }">
                      <span v-if="data.creator_code != ''"> {{ data.doc_date }} {{ data.doc_time }}</span>

                    </template>
                  </Column>
                  <Column field="status" header="สถานะ" headerClass="text-center" bodyClass="text-left">
                    <template #body="{ data }">
                      <Tag :value="Utils.getStatusName(data.status)" :severity="getStatusSeverity(data.status)" />
                    </template>
                  </Column>
                </DataTable>
                <div v-else>กำลังโหลดข้อมูล...</div>
              </div>
            </template>

          </DataTable>
        </div>
      </div>
    </MainContentWarp>
  </AppLayout>
</template>