<script setup>
import AppLayout from "@/components/layout/AppLayout.vue";
import MainContentWarp from "@/components/MainContentWarp.vue";
import { onMounted, ref } from "vue";
import { useApp } from "@/stores/app.js";
import MasterdataService from "@/services/MasterdataService";
import Utils from "@/utils/";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
const storeApp = useApp();
const router = useRouter();

const from_date = ref('');
const to_date = ref('');
const search = ref('');
const toast = useToast();
const data_brand = ref([]);
const data_category = ref([]);
const data_design = ref([]);
const data_group = ref([]);
const data_group_sub = ref([]);
const data_model = ref([]);
const data_pattern = ref([]);
const data_list = ref([])

const data_sale_type = ref([
    { code: "0", name: "ไม่เลือก" },
    { code: "1", name: "ขายสด" },
    { code: "2", name: "ขายเชื่อ" },
]);
const data_trans_type = ref([
    { code: "0", name: "รับเอง" },
    { code: "1", name: "ส่งให้" },
]);
const data_price_type = ref([
    { code: "1", name: "ปรกติ" },
    { code: "2", name: "ตามกลุ่ม" },
    { code: "3", name: "ตามลูกค้า" },
]);
const data_status = ref([
    { code: "1", name: "ใช้งาน" },
    { code: "0", name: "ยกเลิก" },
]);
const statuses = ref([
  { name: 'ยกเลิก', code: '0' },
  { name: 'ใช้งาน', code: '1' }
]);

const filterData = ref({
    search: "",
    sale_type: null,
    trans_type: null,
    price_type: null,
    group: null,
    group_sub: null,
    brand: null,
    model: null,
    design: null,
    pattern: null,
    category: null,
});

onMounted(() => {
    storeApp.setActivePage("saleprice");
    storeApp.setActiveChild("salepricelist");
    storeApp.setPageTitle("ประวัติการแก้ไขราคาทั่วไป");
    storeApp.setHideToggle();

    getMasterData();


});

const getStatusName = (value) => {
    return statuses.value.find((status) => status.code === value)?.name || value;
};

const getStatusSeverity = (status) => {
    switch (status) {
        case "0":
            return "danger";
        case "1":
            return "success";
        default:
            return null;
    }
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

function getDetailList() {
    console.log(filterData.value);
    var sale_type = filterData.value.sale_type != null ? filterData.value.sale_type : "";
    var trans_type = filterData.value.trans_type != null ? filterData.value.trans_type : "";
    var price_type = filterData.value.price_type != null ? filterData.value.price_type : "";
    var groupmain = filterData.value.group != null ? filterData.value.group : "";
    var groupsub = filterData.value.group_sub != null ? filterData.value.group_sub : "";
    var itembrand = filterData.value.brand != null ? filterData.value.brand : "";
    var itemmodel = filterData.value.model != null ? filterData.value.model : "";
    var itempattern = filterData.value.pattern != null ? filterData.value.pattern : "";
    var itemcategory = filterData.value.category != null ? filterData.value.category : "";
    var itemdesign = filterData.value.design != null ? filterData.value.design : "";
    var from_datex = "";
    var to_datex = "";

    if (from_date.value != "" && from_date.value != undefined) {
        from_datex = Utils.getDateFormatPG(from_date.value);
    }
    if (to_date.value != "" && to_date.value != undefined) {
        to_datex = Utils.getDateFormatPG(to_date.value);
    }

    MasterdataService.getDocNMHistory(search.value, from_datex, to_datex, sale_type, trans_type, price_type, groupmain, groupsub, itembrand, itemmodel, itempattern, itemcategory, itemdesign)
        .then((res) => {
            console.log(res);
            data_list.value = res.data;
        });
}




</script>

<template>
    <AppLayout>
        <MainContentWarp>
            <div class="surface-card shadow-2 border-round p-fluid mt-2">
                <Panel header="การค้นหา" :toggleable="true">
                    <div class="grid formgrid p-fluid">
                        <div class="field mb-4 col-12 md:col-3">
                            <label class="font-medium text-900">ค้นหาสินค้า</label>
                            <InputText type="text" v-model="search" />
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
                            <Dropdown v-model="filterData.group_sub" :options="data_group_sub" showClear filter optionLabel="name" optionValue="code"
                                placeholder="เลือกกลุ่มย่อย" />
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
                    </div>
                    <!-- <div class="grid formgrid p-fluid">
                        <div class="field mb-4 col-12 md:col-3">
                            <label class="font-medium text-900">จากวันที่</label>
                            <Calendar dateFormat="yy-mm-dd" v-model="from_date" :showIcon="true"> </Calendar>
                        </div>
                        <div class="field mb-4 col-12 md:col-3">
                            <label class="font-medium text-900">ถึงวันที่</label>
                            <Calendar dateFormat="yy-mm-dd" v-model="to_date" :showIcon="true"> </Calendar>
                        </div>
                    </div> -->
                    <div class="flex justify-content-start">
                        <div class="flex-none flex">
                            <Button label="ประมวลผล" icon="pi pi-play" class="w-auto p-button-success" @click="getDetailList"></Button>

                        </div>
                    </div>
                </Panel>
                <div class="mt-2" style="max-width: 97.8vw;">
                    <DataTable :value="data_list" :paginator="true" :rows="15" resizableColumns columnResizeMode="fit" showGridlines
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        :rowsPerPageOptions="[15, 50, 100, 150]" currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" responsiveLayout="scroll">

                        <Column field="doc_date" header="วันที่" sortable>
                            <template #body="slotProps">
                                {{ slotProps.data.doc_date }}
                            </template>
                        </Column>
                        <Column field="doc_time" header="เวลา" sortable>
                            <template #body="slotProps">
                                {{ slotProps.data.doc_time }}
                            </template>
                        </Column>

                        <Column field="ic_code" header="สินค้า" sortable></Column>
                        <Column field="item_name" header="ชื่อสินค้า" sortable></Column>
                        <Column field="unit_code" header="หน่วย" sortable></Column>
                        <Column field="from_qty" header="จากจำนวน" sortable></Column>
                        <Column field="to_qty" header="ถึงจำนวน" sortable></Column>
                        <Column field="from_date" header="จากวันที่" sortable>
                            <template #body="slotProps">
                                {{ slotProps.data.from_date }}
                            </template>
                        </Column>
                        <Column field="to_date" header="ถึงวันที่" sortable>
                            <template #body="slotProps">
                                {{ slotProps.data.to_date }}
                            </template>
                        </Column>
                        <Column field="sale_type" header="ประเภาการขาย" sortable bodyStyle="text-align:center">
                            <template #body="slotProps">

                                {{ Utils.getSaleTypeName(slotProps.data.sale_type) }}
                            </template>
                        </Column>
                        <!-- <Column field="transport_type" header="ประเภทการส่ง" sortable bodyStyle="text-align:center">
                            <template #body="slotProps">
                                {{ Utils.getTranspotTypeName(slotProps.data.transport_type) }}
                            </template>
                        </Column> -->
                        <Column field="price_type" header="ประเภทราคา" sortable bodyStyle="text-align:center">
                            <template #body="slotProps">
                                {{ Utils.getPriceTypeName(slotProps.data.price_type) }}
                            </template>
                        </Column>
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
                        <Column field="status" header="สถานะ" sortable class="text-center">
                            <template #body="slotProps">
                                <Tag :value="getStatusName(slotProps.data.status.toString())" :severity="getStatusSeverity(slotProps.data.status.toString())" />
                            </template>
                        </Column>

                        <Column field="cust_code" header="ลูกค้า" sortable></Column>
                        <Column field="cust_group_1" header="กลุ่มหลัก" sortable></Column>
                        <Column field="cust_group_2" header="กลุ่มย่อย" sortable></Column>
                        <Column field="command" header="คำสั่ง" sortable class="text-right"></Column>
                        <Column field="doc_no" header="เอกสาร" sortable></Column>
                        <Column field="creator_code" header="ผู้จัดทำ" sortable></Column>
                    </DataTable>
                </div>
            </div>
        </MainContentWarp>
    </AppLayout>
</template>
<style>
.p-datatable .p-datatable-tbody>tr>td {
    padding: 8px !important;
}
</style>
