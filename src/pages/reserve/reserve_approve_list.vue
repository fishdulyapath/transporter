<template>
  <AppLayout>
    <MainContentWarp>
      <div class="surface-ground px-1 py-1">
        <div class="surface-card shadow-2 border-round p-fluid mt-1">
          <div class="p-3">
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
                <!-- <div class="field mb-4 col-12 md:col-3">
                  <label class="font-medium text-900">สถานะ</label>
                  <Dropdown v-model="selectedStatus" :options="statusSelect" filter showClear optionLabel="name" placeholder="เลือก" class="w-full">
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
</div> -->
                <div class="field col-12">
                  <Button label="ค้นหา" icon="pi pi-play" class="w-auto p-button-info" @click="getReserveCarlist"></Button>

                </div>
              </div>
            </Panel>

            <DataTable :value="cars" responsiveLayout="scroll">
              <Column>
                <template #body="slotProps">
                  <table style="width: 100%; border-collapse: collapse;">
                    <!-- แถวแรกของข้อมูล -->
                    <tr style="font-size: 18px;">
                      <td colspan="5"><strong>เลขที่: </strong> {{ slotProps.data.doc_no }}
                        ( <span v-if="slotProps.data.status == '0'" style="color: orangered; font-weight: bold;font-size: 25px;">ขอจอง</span>
                        <span v-else-if="slotProps.data.status == '1'" style="color: green; font-weight: bold;font-size: 23px">พร้อมรับ</span>
                        <span v-else-if="slotProps.data.status == '2'" style="color: green; font-weight: bold;font-size: 23px">รับสินค้า</span>
                        <span v-else-if="slotProps.data.status == '3'" style="color: blue; font-weight: bold;font-size: 23px">ส่งสินค้าสำเร็จ</span>
                        <span v-else-if="slotProps.data.status == '4'" style="color: red; font-weight: bold;font-size: 23px">ยกเลิก</span>
                        <span v-else-if="slotProps.data.status == '5'" style="color: black; font-weight: bold;font-size: 23px">ยืนยันแล้ว</span> )
                      </td>
                    </tr>

                    <tr style="font-size: 18px;">
                      <td style="padding-top: 8px !important;"><strong>วันที่: </strong> {{ slotProps.data.doc_date }}</td>
                      <td style="padding-top: 8px !important;"><strong>ผู้ขอ: </strong> {{ slotProps.data.creator_name }}</td>
                      <td style="padding-top: 8px !important;"><strong>ประเภทบรรทุก: </strong> {{ slotProps.data.car_pack_type }}</td>
                      <td style="padding-top: 8px !important;"><strong>วันที่ขอเข้ารับ: </strong> {{ slotProps.data.request_receive_date }}</td>
                      <td style="padding-top: 8px !important;"><strong>วันที่ขอถึงจุดหมาย: </strong> {{ slotProps.data.request_arrival_date }}</td>
                    </tr>

                    <tr style="font-size: 18px;">
                      <td style="padding-top: 8px !important;"><strong>สถานที่เข้ารับสินค้า: </strong> {{ slotProps.data.pickup_place }}</td>
                      <td style="padding-top: 8px !important;"><strong>สถานที่ส่งสินค้า: </strong> {{ slotProps.data.dropoff_place }}</td>
                      <td style="padding-top: 8px !important;" colspan="3"><strong>หมายเหตุเพิ่มเติม: </strong> {{ slotProps.data.remark }}</td>

                    </tr>

                    <tr style="font-size: 18px;">
                      <td style="padding-top: 8px !important;"><strong>ทะเบียนรถ: </strong> {{ slotProps.data.car_code }}</td>
                      <td style="padding-top: 8px !important;"><strong>คนขับ: </strong> {{ slotProps.data.driver_code }}</td>
                      <td style="padding-top: 8px !important;"><strong>น้ำหนัก: </strong> {{ slotProps.data.weight }}</td>
                      <td style="padding-top: 8px !important;"><strong>รถบริษัท/รถร่วม: </strong>
                        <span v-if="slotProps.data.car_type_2 == '0'">รถบริษัท</span>
                        <span v-else>รถร่วม</span>
                      </td>

                    </tr>
                    <tr style="font-size: 18px;color:blue" v-if="slotProps.data.receive_user_code != '' && slotProps.data.receive_user_code != undefined">
                      <td style="padding-top: 8px !important;"><strong>วันที่เข้ารับ : </strong> {{ slotProps.data.receive_date }}</td>
                      <td style="padding-top: 8px !important;"><strong>ผู้อนุมัติ : </strong> {{ slotProps.data.receive_user_code }}</td>
                      <td colspan="3" style="padding-top: 8px !important;"><strong>หมายเหตุรับ : </strong> {{ slotProps.data.receive_remark }}</td>
                    </tr>
                    <tr style="font-size: 18px;color:green" v-if="slotProps.data.send_approve_user != '' && slotProps.data.send_approve_user != undefined">
                      <td style="padding-top: 8px !important;"><strong>วันที่ส่งมอบ : </strong> {{ slotProps.data.arrival_date }}</td>
                      <td style="padding-top: 8px !important;"><strong>ผู้อนุมัติ : </strong> {{ slotProps.data.send_approve_user }}</td>
                      <td colspan="3" style="padding-top: 8px !important;"><strong>หมายเหตุ : </strong> {{ slotProps.data.send_remark }}</td>
                    </tr>

                    <tr style="font-size: 18px;color:red" v-if="slotProps.data.cancel_user != '' && slotProps.data.cancel_user != undefined">
                      <td style="padding-top: 8px !important;"><strong>วันที่ยกเลิก : </strong> {{ Utils.getDateFormatPG(slotProps.data.cancel_date_time) }}</td>
                      <td style="padding-top: 8px !important;"><strong>ผู้ยกเลิก : </strong> {{ slotProps.data.cancel_user }}</td>
                      <td colspan="3" style="padding-top: 8px !important;"><strong>หมายเหตุ : </strong> {{ slotProps.data.cancel_remark }}</td>
                    </tr>

                    <tr style="font-size: 18px;">
                      <td colspan="5" style="padding-top: 8px !important;">
                        <div style="display: flex; gap: 10px;">
                          <Button v-if="slotProps.data.status == '1' || slotProps.data.status == '2'" icon="pi pi-download" label="บันทึกรับสินค้า"
                            class="p-button-success text-white" style="width: 200px;" @click="openDialog(slotProps.data)" />
                          <Button v-if="slotProps.data.status == '2'" icon="pi pi-check" label="ส่งมอบสินค้า" class="p-button-primary text-white" style="width: 200px;"
                            @click="openDialog2(slotProps.data)" />
                          <Button v-if="slotProps.data.status == '1' || slotProps.data.status == '2'" icon="pi pi-trash" label="ยกเลิกเอกสาร" class="p-button-danger"
                            style="width: 200px;" @click="openDialog3(slotProps.data)" />

                        </div>
                      </td>
                    </tr>

                  </table>
                </template>
              </Column>
            </DataTable>

            <!-- Dialog สำหรับการเพิ่ม/แก้ไขข้อมูล -->
            <Dialog :header="isEditMode ? 'พร้อมรับ/รับสินค้า' : ''" v-model:visible="displayDialog" :modal="true" :closable="false" :style="{ width: '70vw' }">
              <div class="formgrid p-fluid">
                <div class="p-field">
                  <label for="code">เลขที่</label>
                  <InputText id="code" v-model="carForm.doc_no" readonly />
                </div>

                <div class="p-field mt-2">
                  <label class="">เลือกรถ</label>

                  <DataTable :value="carsDetails" selectionMode="single" v-model:selection="selectedCar" paginator :rows="5" :filters="filters"
                    :globalFilterFields="['driver_name', 'code', 'weight']" :rowsPerPageOptions="[5, 10, 20]">

                    <!-- ช่องค้นหาหลัก (Global Search) -->
                    <template #header>
                      <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="filters['global'].value" placeholder="Search..." />
                      </span>
                    </template>

                    <Column selectionMode="single" headerStyle="width: 3em;"></Column>
                    <Column field="code" header="ทะเบียนรถ" filter sortable></Column>
                    <Column field="driver_name" header="คนขับ" filter sortable></Column>
                    <Column field="weight" header="น้ำหนัก" sortable></Column>
                    <Column field="status" header="สถานะ" sortable>
                      <template #body="slotProps">
                        <span v-if="slotProps.data.status == '0'" style="color: green; font-weight: bold;">ว่าง</span>
                        <span v-else-if="slotProps.data.status == '1'" style="color: red; font-weight: bold;">ไม่ว่าง</span>
                      </template>
                    </Column>
                  </DataTable>
                  <div class="p-field">
                    <label for="code">ทะเบียนรถ</label>
                    <InputText id="code" v-model="carForm.car_code" readonly />
                  </div>
                  <div class="p-field">
                    <label for="code">คนขับ</label>
                    <InputText id="code" v-model="carForm.driver_code" readonly />
                  </div>
                  <div class="p-field">
                    <label for="code">น้ำหนัก</label>
                    <InputText id="code" v-model="carForm.weight" readonly />
                  </div>
                  <div class="mt-3">สถานะ</div>
                  <div class="p-field my-3 flex flex-wrap gap-4">

                    <div class="flex items-center">
                      <RadioButton v-model="carForm.status_selected" name="พร้อมรับ" value="1" />
                      <label class="ml-2">พร้อมรับ</label>
                    </div>
                    <div class="flex items-center ml-3">
                      <RadioButton v-model="carForm.status_selected" name="รับสินค้า" value="2" />
                      <label class="ml-2">รับสินค้า</label>
                    </div>

                  </div>
                  <div class="p-field mt-2">
                    <label>หมายเหตุ</label>
                    <Textarea v-model="carForm.receive_remark" rows="5" />
                  </div>
                </div>


              </div>
              <div class="flex p-jc-end mt-2">
                <Button label="บันทึก" icon="pi pi-check" class="p-button-success" @click="saveCar" />
                <Button label="ยกเลิก" icon="pi pi-times" class="p-button-text ml-2" @click="displayDialog = false" />
              </div>
            </Dialog>
            <Dialog :header="'บันทึกส่งมอบสินค้า'" v-model:visible="displaySendDialog" :modal="true" :closable="false" :style="{ width: '70vw' }">
              <div class="formgrid p-fluid">
                <div class="p-field">
                  <label for="code">เลขที่</label>
                  <InputText id="code" v-model="carForm.doc_no" readonly />
                </div>
                <div class="p-field">
                  <label>วันที่ส่งมอบ</label>
                  <Calendar dateFormat="yy-mm-dd" v-model="carForm.arrival_date" :showIcon="true"> </Calendar>
                </div>
                <div class="p-field mt-2">
                  <label>หมายเหตุ</label>
                  <Textarea v-model="carForm.send_remark" rows="5" />
                </div>


              </div>
              <div class="flex p-jc-end mt-2">
                <Button label="บันทึก" icon="pi pi-check" class="p-button-success" @click="showConfirmSend = true" />
                <Button label="ยกเลิก" icon="pi pi-times" class="p-button-text ml-2" @click="displaySendDialog = false" />
              </div>
            </Dialog>
            <Dialog :header="'บันทึกยกเลิกการจองรถ'" v-model:visible="displayCancelDialog" :modal="true" :closable="false" :style="{ width: '70vw' }">
              <div class="formgrid p-fluid">
                <div class="p-field">
                  <label for="code">เลขที่</label>
                  <InputText id="code" v-model="carForm.doc_no" readonly />
                </div>

                <div class="p-field mt-2">
                  <label>หมายเหตุ</label>
                  <Textarea v-model="carForm.cancel_remark" rows="5" />
                </div>


              </div>
              <div class="flex p-jc-end mt-2">
                <Button label="บันทึก" icon="pi pi-check" class="p-button-success" @click="ondeleteDoc" />
                <Button label="ยกเลิก" icon="pi pi-times" class="p-button-text ml-2" @click="displayCancelDialog = false" />
              </div>
            </Dialog>
          </div>
        </div>
      </div>
      <Dialog v-model:visible="showConfirmDeleteDialog" :style="{ width: '450px' }" header="ยืนยันการทำงาน" :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span>ต้องการยกเลิกเอกสาร {{ carForm.doc_no }} ใช่หรือไม่?</span>
        </div>
        <template #footer>
          <Button label="ยกเลิก" icon="pi pi-times" class="p-button-text" @click="showConfirmDeleteDialog = false" />
          <Button label="ยืนยัน" icon="pi pi-check" class="p-button-success" @click="deleteDoc" />
        </template>
      </Dialog>
      <Dialog v-model:visible="showConfirmSend" :style="{ width: '450px' }" header="ส่งมอบสินค้า" :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span>ต้องการส่งมอบสินค้าเอกสาร {{ carForm.doc_no }} ใช่หรือไม่?</span>
        </div>
        <template #footer>
          <Button label="ยกเลิก" icon="pi pi-times" class="p-button-text" @click="showConfirmSend = false" />
          <Button label="ยืนยัน" icon="pi pi-check" class="p-button-success" @click="sendSuccessDoc" />
        </template>
      </Dialog>

      <Dialog v-model:visible="showConfirmCancel" :style="{ width: '450px' }" header="ยกเลิกการจอง" :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span>ต้องการยกเลิกจองเอกสาร {{ carForm.doc_no }} ใช่หรือไม่?</span>
        </div>
        <template #footer>
          <Button label="ยกเลิก" icon="pi pi-times" class="p-button-text" @click="showConfirmCancel = false" />
          <Button label="ยืนยัน" icon="pi pi-check" class="p-button-success" @click="cancelApproveDoc" />
        </template>
      </Dialog>

      <Dialog v-model:visible="showConfirmApproveDialog" :style="{ width: '450px' }" header="ส่งอนุมัติเอกสาร" :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span>ต้องการส่งเอกสาร {{ approveDocNo }} อนุมัติใช่หรือไม่?</span>
        </div>
        <template #footer>
          <Button label="ยกเลิก" icon="pi pi-times" class="p-button-text" @click="showConfirmApproveDialog = false" />
          <Button label="ยืนยัน" icon="pi pi-check" class="p-button-success" @click="sendApproveDoc" />
        </template>
      </Dialog>
    </MainContentWarp>
  </AppLayout>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { FilterMatchMode } from 'primevue/api';

import AppLayout from "@/components/layout/AppLayout.vue";
import MainContentWarp from "@/components/MainContentWarp.vue";
import { useApp } from "@/stores/app.js";
import { useRouter, useRoute } from "vue-router";
import MasterdataService from "@/services/MasterdataService";
import Utils from "@/utils/";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";

const confirm = useConfirm();
const showConfirmDeleteDialog = ref(false);
const selectedCar = ref(null);
const showConfirmApproveDialog = ref(false);
const approveDocNo = ref("");
const deleteDocNo = ref('');
const deleteCarcode = ref('');
const storeApp = useApp();
const toast = useToast();
const router = useRouter();
const employeeDetails = ref([]);
const from_date = ref("");
const to_date = ref("");
const search = ref("");
const displaySendDialog = ref(false);
const displayCancelDialog = ref(false);
const selectedStatus = ref(null);
const showConfirmSend = ref(false);
const showConfirmCancel = ref(false);
const statusSelect = ref([
  { code: 0, name: "ขอจอง" },
  { code: 1, name: "พร้อมรับ" },
  { code: 2, name: "รับสินค้า" },
  { code: 3, name: "ส่งสินค้าสำเร็จ" },
  { code: 4, name: "ยกเลิก" },
  { code: 5, name: "ยืนยันแล้ว" },
]);
const carsDetails = ref([]);
const carsDetailsFull = ref([]);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  driver_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  code: { value: null, matchMode: FilterMatchMode.CONTAINS },
  weight: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const provinces = [
  { name: "กรุงเทพมหานคร" },
  { name: "กระบี่" },
  { name: "กาญจนบุรี" },
  { name: "กาฬสินธุ์" },
  { name: "กำแพงเพชร" },
  { name: "ขอนแก่น" },
  { name: "จันทบุรี" },
  { name: "ฉะเชิงเทรา" },
  { name: "ชลบุรี" },
  { name: "ชัยนาท" },
  { name: "ชัยภูมิ" },
  { name: "ชุมพร" },
  { name: "เชียงใหม่" },
  { name: "เชียงราย" },
  { name: "ตรัง" },
  { name: "ตราด" },
  { name: "ตาก" },
  { name: "นครนายก" },
  { name: "นครปฐม" },
  { name: "นครพนม" },
  { name: "นครราชสีมา" },
  { name: "นครศรีธรรมราช" },
  { name: "นครสวรรค์" },
  { name: "นนทบุรี" },
  { name: "นราธิวาส" },
  { name: "น่าน" },
  { name: "บึงกาฬ" },
  { name: "บุรีรัมย์" },
  { name: "ปทุมธานี" },
  { name: "ประจวบคีรีขันธ์" },
  { name: "ปราจีนบุรี" },
  { name: "ปัตตานี" },
  { name: "พระนครศรีอยุธยา" },
  { name: "พะเยา" },
  { name: "พังงา" },
  { name: "พัทลุง" },
  { name: "พิจิตร" },
  { name: "พิษณุโลก" },
  { name: "เพชรบุรี" },
  { name: "เพชรบูรณ์" },
  { name: "แพร่" },
  { name: "ภูเก็ต" },
  { name: "มหาสารคาม" },
  { name: "มุกดาหาร" },
  { name: "แม่ฮ่องสอน" },
  { name: "ยโสธร" },
  { name: "ยะลา" },
  { name: "ร้อยเอ็ด" },
  { name: "ระนอง" },
  { name: "ระยอง" },
  { name: "ราชบุรี" },
  { name: "ลพบุรี" },
  { name: "ลำปาง" },
  { name: "ลำพูน" },
  { name: "เลย" },
  { name: "ศรีสะเกษ" },
  { name: "สกลนคร" },
  { name: "สงขลา" },
  { name: "สตูล" },
  { name: "สมุทรปราการ" },
  { name: "สมุทรสงคราม" },
  { name: "สมุทรสาคร" },
  { name: "สระแก้ว" },
  { name: "สระบุรี" },
  { name: "สิงห์บุรี" },
  { name: "สุโขทัย" },
  { name: "สุพรรณบุรี" },
  { name: "สุราษฎร์ธานี" },
  { name: "สุรินทร์" },
  { name: "หนองคาย" },
  { name: "หนองบัวลำภู" },
  { name: "อ่างทอง" },
  { name: "อุดรธานี" },
  { name: "อุทัยธานี" },
  { name: "อุตรดิตถ์" },
  { name: "อุบลราชธานี" },
  { name: "อำนาจเจริญ" },
];
const searchTerm = ref("");
let searchTimeout = null;

const doc_no = ref("");

const doc_date = ref("");
const roworderDelete = ref("");
const carForm = ref({
  roworder: "",
  doc_date: "",
  doc_no: "",
  creator_code: localStorage._usercode || "",
  creator_name: "",
  car_pack_type: "",
  receive_date: "",
  arrival_date: "",
  request_receive_date: "",
  request_arrival_date: "",
  pickup_place: "",
  dropoff_place: "",
  remark: "0",
  status: "0",
  car_code: "",
  old_car_code: "",
  driver_code: "",
  weight: "",
  is_close: "0",
  status_selected: "1",
  receive_remark: "",
  send_remark: "",
  cancel_remark: "",
});

// ข้อมูลตัวอย่าง
const cars = ref([]);

const displayDialog = ref(false);
let isEditMode = ref(false);

const ondeleteDoc = (car) => {

  showConfirmDeleteDialog.value = true;
};

const onSelect = (car) => {
  // ให้เลือกแถวที่มี status = 0 เท่านั้น
  if (car.status === "0") {
    selectedCar.value = car;
  }
};

const deleteDoc = async (car) => {
  console.log(carForm.value.cancel_remark);
  await MasterdataService.cancelReserveDoc(carForm.value.doc_no, carForm.value.car_code, carForm.value.cancel_remark, localStorage._usercode)
    .then((res) => {
      console.log(res);
      if (res.success) {
        toast.add({
          severity: "success",
          summary: "สำเร็จ",
          detail: "ยกเลิกข้อมูลสำเร็จ",
        });
        getReserveCarlist();
        showConfirmDeleteDialog.value = false;
        displayCancelDialog.value = false;
      } else {
        toast.add({
          severity: "error",
          summary: "ยกเลิกไม่สำเร็จ",
          detail: res.message,
        });
        showConfirmDeleteDialog.value = false;
        displayCancelDialog.value = false;
      }
    })
    .catch((err) => {
      console.log(err);
      showConfirmDeleteDialog.value = false;
      displayCancelDialog.value = false;
    });
};

const getCarList = () => {
  MasterdataService.getCarList('')
    .then((response) => {
      console.log(response);
      if (response.success) {

        carsDetailsFull.value = response.data;

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

const getCarReserveList = () => {
  MasterdataService.getCarReserveList('')
    .then((response) => {
      console.log(response);
      if (response.success) {

        carsDetails.value = response.data;

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
      console.log("response", response);
      if (response.success) {
        response.data.forEach((data) => {
          employeeDetails.value.push({ code: data.code, name: data.name });
        });
      } else {
        toast.add({
          severity: "error",
          summary: "เกิดข้อผิดพลาด",
          detail: response.message,
          life: 3000,
        });
      }
    })
    .catch((error) => {
      console.error(error);
      toast.add({
        severity: "error",
        summary: "เกิดข้อผิดพลาด",
        detail: "ไม่สามารถดึงข้อมูลได้",
        life: 3000,
      });
    });
};

onMounted(() => {
  storeApp.setActivePage("reservedocapprovelist");
  storeApp.setActiveChild("");
  storeApp.setPageTitle("อนุมัติรายการจองรถ");
  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  from_date.value = firstDay;
  to_date.value = lastDay;

  getReserveCarlist();
  getEmployee();
  getCarList();

});

watch(searchTerm, (newValue) => {
  // เคลียร์ timeout ก่อนหน้า ถ้ามีการพิมพ์ใหม่เกิดขึ้น
  clearTimeout(searchTimeout);

  // ตั้ง timeout ใหม่ หลังจากหยุดพิมพ์ 2 วินาที (2000 มิลลิวินาที)
  searchTimeout = setTimeout(() => {
    filterCars(); // เรียกฟังก์ชันค้นหาหลังจากหยุดพิมพ์
  }, 1000);
});

watch(selectedCar, (newVal) => {
  carForm.value.car_code = newVal ? newVal.code : null;
  carForm.value.driver_code = newVal ? newVal.driver_name : null;
  carForm.value.weight = newVal ? newVal.weight : null;
});

const getEmployeeName = (code) => {
  console.log(employeeDetails.value);
  const employee = employeeDetails.value.find((emp) => emp.code.toUpperCase() === code.toUpperCase());
  return employee ? employee.name : "";
};

const filterCars = () => {
  console.log("กำลังค้นหา:", searchTerm.value);
  getReserveCarlist();
};

const getDocList = async () => {
  //   await MasterdataService.getReserveCarlist(search, from_date, to_date)
  //     .then((res) => {
  //       console.log(res);
  //       if (res.success) {
  //         cars.value = res.data;
  //       } else {
  //         toast.add({ severity: "error", summary: "ดึงข้อมูลล้มเหลว", detail: res.message });
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
};

async function getReserveCarlist() {
  var from_datex = "";
  var to_datex = "";
  console.log(from_date.value);
  if (from_date.value != "" && from_date.value != undefined) {
    from_datex = Utils.getDateFormatPG(from_date.value);
  }
  if (to_date.value != "" && to_date.value != undefined) {
    to_datex = Utils.getDateFormatPG(to_date.value);
  }
  var status = "";
  if (selectedStatus.value != "" && selectedStatus.value != undefined) {
    status = selectedStatus.value.code;
  }

  await MasterdataService.getReserveCarApprovelist(search.value, from_datex, to_datex)
    .then((res) => {
      console.log(res);
      if (res.success) {
        cars.value = res.data;
      } else {
        toast.add({ severity: "error", summary: "ดึงข้อมูลล้มเหลว", detail: res.message });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

// ฟังก์ชันเปิด Dialog
const openDialog = async (car = null) => {
  await getCarReserveList('');
  if (car) {
    carForm.value = { ...car }; // กรณีแก้ไขข้อมูล
    carForm.value.status_selected = (carForm.value.status == "0" ? "1" : carForm.value.status);
    if (carForm.value.car_code == '') {
      selectedCar.value = null;
    } else {
      selectedCar.value = carsDetails.value.find(c => c.code === carForm.value.car_code) || null;
    }
    carForm.value.old_car_code = carForm.value.car_code;
    carForm.value.receive_remark = carForm.value.receive_remark ?? '';

    console.log(selectedCar.value);
    isEditMode.value = true;
  } else {
    resetForm(); // กรณีเพิ่มข้อมูล
    isEditMode.value = false;
  }
  displayDialog.value = true;
};

const openDialog2 = async (car = null) => {

  carForm.value = { ...car }; // กรณีแก้ไขข้อมูล
  carForm.value.status_selected = (carForm.value.status == "0" ? "1" : carForm.value.status);
  carForm.value.send_remark = carForm.value.send_remark ?? '';
  carForm.value.old_car_code = carForm.value.car_code;
  console.log(selectedCar.value);
  displaySendDialog.value = true;
};
const openDialog3 = async (car = null) => {

  carForm.value = { ...car }; // กรณีแก้ไขข้อมูล
  carForm.value.status_selected = (carForm.value.status == "0" ? "1" : carForm.value.status);
  carForm.value.old_car_code = carForm.value.car_code;
  carForm.value.cancel_remark = carForm.value.cancel_remark ?? '';
  console.log(carForm.value);
  deleteDocNo.value = car.doc_no;
  deleteCarcode.value = car.car_code;
  roworderDelete.value = car.roworder;
  displayCancelDialog.value = true;
};


const onSendApprove = async (car) => {
  approveDocNo.value = car.doc_no;
  showConfirmApproveDialog.value = true;

};

const openReceiveApprove = (car) => {

}

const sendApproveDoc = async () => {
  await MasterdataService.sendApproveReserveDoc(approveDocNo.value)
    .then((res) => {
      console.log(res);
      if (res.success) {
        toast.add({
          severity: "success",
          summary: "สำเร็จ",
          detail: "ส่งอนุมัติสำเร็จ",
        });
        getReserveCarlist();
        showConfirmApproveDialog.value = false;
      } else {
        toast.add({
          severity: "error",
          summary: "ส่งอนุมัติไม่สำเร็จ",
          detail: res.message,
        });
        showConfirmApproveDialog.value = false;
      }
    })
    .catch((err) => {
      console.log(err);
      showConfirmApproveDialog.value = false;
    });
}

const sendSuccessDoc = async () => {
  await MasterdataService.sendSuccessReserveDoc(carForm.value.doc_no, carForm.value.arrival_date, carForm.value.send_remark, localStorage._usercode)
    .then((res) => {
      console.log(res);
      if (res.success) {
        toast.add({
          severity: "success",
          summary: "สำเร็จ",
          detail: "ส่งมอบสำเร็จ",
        });
        getReserveCarlist();
        showConfirmApproveDialog.value = false;
        showConfirmSend.value = false;
        displaySendDialog.value = false;
      } else {
        toast.add({
          severity: "error",
          summary: "ส่งมอบไม่สำเร็จ",
          detail: res.message,
        });
        showConfirmApproveDialog.value = false;
        showConfirmSend.value = false;
        displaySendDialog.value = false;
      }
    })
    .catch((err) => {
      console.log(err);
      showConfirmApproveDialog.value = false;
    });
}


// ฟังก์ชันบันทึกข้อมูล
const saveCar = async () => {
  // ตรวจสอบว่าทุกฟิลด์มีข้อมูลหรือไม่

  if (
    !carForm.value.doc_no ||
    !carForm.value.car_code ||
    !carForm.value.status_selected
  ) {
    toast.add({
      severity: "warn",
      summary: "ข้อมูลไม่ครบ",
      detail: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
    });
    return;
  }

  if (isEditMode.value) {
    // แก้ไขข้อมูล
    console.log(carForm.value);
    await MasterdataService.updateReceiveStatus(
      carForm.value.doc_no,
      carForm.value.car_code,
      carForm.value.status_selected,
      carForm.value.receive_remark,
      carForm.value.driver_code,
      carForm.value.weight,
      localStorage._usercode,
      carForm.value.old_car_code
    )
      .then((res) => {
        console.log(res);
        if (res.success) {
          toast.add({
            severity: "success",
            summary: "สำเร็จ",
            detail: "บันทึกข้อมูลสำเร็จ",
          });
          getReserveCarlist();
        } else {
          toast.add({ severity: "error", summary: "บันทึกไม่สำเร็จ", detail: res.message });
        }
      })
      .catch((err) => {
        console.log(err);
        displayDialog.value = false;
      });
  } else {
    // เพิ่มข้อมูลใหม่
    // console.log(carForm.value);
    // await MasterdataService.createReserveCar(carForm.value)
    //   .then((res) => {
    //     console.log(res);
    //     if (res.success) {
    //       toast.add({
    //         severity: "success",
    //         summary: "สำเร็จ",
    //         detail: "บันทึกข้อมูลสำเร็จ",
    //       });
    //       getReserveCarlist();
    //     } else {
    //       toast.add({ severity: "error", summary: "บันทึกไม่สำเร็จ", detail: res.message });
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     displayDialog.value = false;
    //   });
  }
  displayDialog.value = false;
  resetForm();
};

// ฟังก์ชันรีเซ็ตฟอร์ม
const resetForm = () => {
  carForm.value = {
    roworder: "",
    doc_date: new Date(),
    doc_no: Utils.getDocNoDate("RE"),
    creator_code: localStorage._usercode || "",
    creator_name: getEmployeeName(localStorage._usercode) || "",
    car_pack_type: "",
    receive_date: new Date(),
    arrival_date: new Date(),
    request_receive_date: new Date(),
    request_arrival_date: new Date(),
    pickup_place: "",
    dropoff_place: "",
    remark: "",
    status: "0",
    car_code: "",
    driver_code: "",
    weight: "",
    is_close: "0",
  };
};
</script>
