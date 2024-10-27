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

                <div class="field col-12">
                  <Button label="ค้นหา" icon="pi pi-play" class="w-auto p-button-info" @click="getDocList"></Button>
                  <Button label="เพิ่มการจองรถ" icon="pi pi-plus" class="w-auto p-button-success ml-2" @click="openDialog()"></Button>
                </div>
              </div>
            </Panel>
            <DataTable :value="cars" responsiveLayout="scroll">
              <Column field="code" header="รหัส" />
              <Column field="province" header="จังหวัด" />
              <Column field="brand" header="ยี่ห้อ/รุ่น" />
              <Column field="car_type" header="ประเภทรถ" />
              <Column field="car_type_2" header="รถบริษัท/รถร่วม">
                <template #body="slotProps">
                  <span v-if="slotProps.data.car_type_2 == '0'">รถบริษัท</span>
                  <span v-else>รถร่วม</span>
                </template>
              </Column>
              <Column field="register_date" header="วันที่จดทะเบียน" />
              <Column field="driver_name" header="คนขับ" />
              <Column field="weight" header="น้ำหนัก" />
              <Column field="status" header="สถานะ">
                <template #body="slotProps">
                  <span v-if="slotProps.data.status == '0'" style="color: green">ว่าง</span>
                  <span v-else style="color: red">ไม่ว่าง</span>
                </template>
              </Column>
              <Column class="text-center">
                <template #body="slotProps">
                  <Button icon="pi pi-pencil" class="p-button-rounded p-button-warning mr-2 text-white" @click="openDialog(slotProps.data)" />
                  <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="onDeleteCar(slotProps.data)" />
                </template>
              </Column>
            </DataTable>

            <!-- Dialog สำหรับการเพิ่ม/แก้ไขข้อมูล -->
            <Dialog :header="isEditMode ? 'แก้ไขเอกสาน' : 'เพิ่มการจองรถ'" v-model:visible="displayDialog" :modal="true" :closable="false" :style="{ width: '30vw' }">
              <div class="formgrid p-fluid">
                <div class="p-field">
                  <label for="code">เลขที่</label>
                  <InputText id="code" v-model="carForm.doc_no" />
                </div>
                <div class="p-field mt-2">
                  <label>วันที่</label>
                  <Calendar dateFormat="yy-mm-dd" :showIcon="true" v-model="carForm.doc_date" />
                </div>
                <div class="p-field mt-2">
                  <label>ผู้ขอ</label>
                  <InputText v-model="carForm.creator_name" readonly />
                </div>
                <div class="p-field mt-2">
                  <label>ประเภทรถ</label>
                  <InputText v-model="carForm.car_type" />
                </div>

                <div class="p-field my-4 flex flex-wrap gap-4">
                  <div class="flex items-center">
                    <RadioButton v-model="carForm.car_type_2" name="รถบริษัท" value="0" />
                    <label class="ml-2">รถร่วม</label>
                  </div>
                  <div class="flex items-center ml-3">
                    <RadioButton v-model="carForm.car_type_2" name="รถร่วม" value="1" />
                    <label class="ml-2">รถบริษัท</label>
                  </div>
                </div>
                <div class="p-field mt-2">
                  <label for="register_date">วันที่จดทะเบียน</label>
                  <Calendar dateFormat="yy-mm-dd" id="register_date" v-model="carForm.register_date" :showIcon="true"> </Calendar>
                </div>
                <div class="p-field mt-2">
                  <label for="car_type">คนขับ</label>
                  <Dropdown v-model="carForm.driver" :options="employeeDetails" filter optionLabel="name" optionValue="code" placeholder="เลือกคนขับ" showClear />
                </div>
                <div class="p-field mt-2">
                  <label for="car_type">น้ำหนัก</label>
                  <InputText id="car_type" v-model="carForm.weight" />
                </div>
              </div>
              <div class="flex p-jc-end mt-2">
                <Button label="บันทึก" icon="pi pi-check" class="p-button-success" @click="saveCar" />
                <Button label="ยกเลิก" icon="pi pi-times" class="p-button-text ml-2" @click="displayDialog = false" />
              </div>
            </Dialog>
          </div>
        </div>
      </div>
      <Dialog v-model:visible="showConfirmDeleteDialog" :style="{ width: '450px' }" header="ยืนยันการทำงาน" :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span>ต้องการลบข้อมูลใช่หรือไม่?</span>
        </div>
        <template #footer>
          <Button label="ยกเลิก" icon="pi pi-times" class="p-button-text" @click="showConfirmDeleteDialog = false" />
          <Button label="ยืนยัน" icon="pi pi-check" class="p-button-success" @click="deleteCar" />
        </template>
      </Dialog>
    </MainContentWarp>
  </AppLayout>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";

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
const storeApp = useApp();
const toast = useToast();
const router = useRouter();
const employeeDetails = ref([]);
const from_date = ref("");
const to_date = ref("");
const search = ref("");
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
  driver_code: "",
  weight: "",
  is_close: "0",
});

// ข้อมูลตัวอย่าง
const cars = ref([]);

const displayDialog = ref(false);
let isEditMode = ref(false);

const onDeleteCar = (car) => {
  roworderDelete.value = car.roworder;
  showConfirmDeleteDialog.value = true;
};

const deleteCar = async (car) => {
  await MasterdataService.deleteCar(roworderDelete.value)
    .then((res) => {
      console.log(res);
      if (res.success) {
        toast.add({
          severity: "success",
          summary: "สำเร็จ",
          detail: "ลบข้อมูลสำเร็จ",
        });
        getCarList();
        showConfirmDeleteDialog.value = false;
      } else {
        toast.add({
          severity: "error",
          summary: "ลบไม่สำเร็จ",
          detail: res.message,
        });
        showConfirmDeleteDialog.value = false;
      }
    })
    .catch((err) => {
      console.log(err);
      showConfirmDeleteDialog.value = false;
    });
};

const getEmployee = () => {
  MasterdataService.getEmployee()
    .then((response) => {
        console.log("response" , response);
      if (response.success) {
        response.data.forEach((data) => {
          employeeDetails.value.push({ code: data.code, name:  data.name });
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
  storeApp.setActivePage("reservedoclist");
  storeApp.setActiveChild("");
  storeApp.setPageTitle("รายการจองรถ");

  getCarList();
  getEmployee();
});

watch(searchTerm, (newValue) => {
  // เคลียร์ timeout ก่อนหน้า ถ้ามีการพิมพ์ใหม่เกิดขึ้น
  clearTimeout(searchTimeout);

  // ตั้ง timeout ใหม่ หลังจากหยุดพิมพ์ 2 วินาที (2000 มิลลิวินาที)
  searchTimeout = setTimeout(() => {
    filterCars(); // เรียกฟังก์ชันค้นหาหลังจากหยุดพิมพ์
  }, 1000);
});

const getEmployeeName = (code) => {
    console.log(employeeDetails.value);
  const employee = employeeDetails.value.find((emp) => emp.code.toUpperCase() === code.toUpperCase());
  return employee ? employee.name : "";
};

const filterCars = () => {
  console.log("กำลังค้นหา:", searchTerm.value);
  getCarList();
};

const getDocList = async () => {
//   await MasterdataService.getCarList(search, from_date, to_date)
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

async function getCarList() {
  await MasterdataService.getCarList(searchTerm.value)
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
const openDialog = (car = null) => {
  if (car) {
    carForm.value = { ...car }; // กรณีแก้ไขข้อมูล
    isEditMode.value = true;
  } else {
    resetForm(); // กรณีเพิ่มข้อมูล
    isEditMode.value = false;
  }
  displayDialog.value = true;
};

// ฟังก์ชันบันทึกข้อมูล
const saveCar = async () => {
  // ตรวจสอบว่าทุกฟิลด์มีข้อมูลหรือไม่
  if (
    !carForm.value.code ||
    !carForm.value.province ||
    !carForm.value.brand ||
    !carForm.value.car_type ||
    !carForm.value.car_type_2 ||
    !carForm.value.register_date ||
    !carForm.value.driver ||
    !carForm.value.weight
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
    await MasterdataService.updateCar(
      carForm.value.roworder,
      carForm.value.code,
      carForm.value.brand,
      carForm.value.province,
      carForm.value.car_type,
      carForm.value.car_type_2,
      carForm.value.register_date,
      carForm.value.driver,
      carForm.value.weight
    )
      .then((res) => {
        console.log(res);
        if (res.success) {
          toast.add({
            severity: "success",
            summary: "สำเร็จ",
            detail: "บันทึกข้อมูลสำเร็จ",
          });
          getCarList();
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
    console.log(carForm.value);
    await MasterdataService.createCar(carForm.value)
      .then((res) => {
        console.log(res);
        if (res.success) {
          toast.add({
            severity: "success",
            summary: "สำเร็จ",
            detail: "บันทึกข้อมูลสำเร็จ",
          });
          getCarList();
        } else {
          toast.add({ severity: "error", summary: "บันทึกไม่สำเร็จ", detail: res.message });
        }
      })
      .catch((err) => {
        console.log(err);
        displayDialog.value = false;
      });
  }
  displayDialog.value = false;
  resetForm();
};

// ฟังก์ชันรีเซ็ตฟอร์ม
const resetForm = () => {
  carForm.value = {
    roworder: "",
    doc_date: new Date(),
    doc_no: "",
    creator_code: localStorage._usercode || "",
    creator_name: getEmployeeName(localStorage._usercode) || "",
    car_pack_type: "",
    receive_date: new Date(),
    arrival_date: new Date(),
    request_receive_date: new Date(),
    request_arrival_date: new Date(),
    pickup_place: "",
    dropoff_place: "",
    remark: "0",
    status: "0",
    car_code: "",
    driver_code: "",
    weight: "",
    is_close: "0",
  };
};
</script>
