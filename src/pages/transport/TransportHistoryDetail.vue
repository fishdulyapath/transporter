<script setup>
import AppLayout from "@/components/layout/AppLayout.vue";
import MainContentWarp from "@/components/MainContentWarp.vue";
import { onMounted, ref, computed, watch } from "vue";
import { useApp } from "@/stores/app.js";
import * as XLSX from "xlsx";
import Utils from "@/utils/";
import { useRouter, useRoute } from "vue-router";
import MasterdataService from "@/services/MasterdataService";
import { useToast } from "primevue/usetoast";

const router = useRouter();
const storeApp = useApp();
const route = useRoute();
const toast = useToast();

// ฟอร์ม Model สำหรับบันทึกข้อมูล
const form_model = ref({
  doc_no: "",
  doc_date: new Date(),
  creator_code: localStorage._usercode || "",
  remark: "",
  car_code: "",
  return_date: new Date(),
  driver1: "",
  driver2: "",
  start_mileage1: 0,
  end_mileage1: 0,
  total_mileage1: 0,
  total_mileage_before1: 0,
  total_mileage_current1: 0,
  start_mileage2: 0,
  end_mileage2: 0,
  total_mileage2: 0,
  total_mileage_before2: 0,
  total_mileage_current2: 0,
  isSameData: 0,
  totaloiluse: 0,
});


const showConfirmSave = ref(false);
const employeeDetails = ref([]);
const customerDetails = ref([]);
const destinationDetails = ref([]);
const routeDetails = ref([]);
const carsDetails = ref([]);
const itemDetails = ref([]);
const showDialogLoading = ref(false);
const editMode = ref(false);
// ข้อมูลตาราง รายการสินค้า
const transportItems1 = ref([]);

const transportItems2 = ref([]);

// ข้อมูลตาราง ค่าเชื้อเพลิง
const fuelDetails1 = ref([]);

const fuelDetails2 = ref([]);

// ข้อมูลตาราง ค่าใช้จ่ายรวม
const expenses1 = ref([]);

const expenses2 = ref([]);
const supplierDetails = ref([]);

const cal_by = ref([

]);

onMounted(async () => {
  storeApp.setActivePage("transport_list");
  await getIncomeList();
  await getEmployee();
  await getCarList();
  await getRouteList();
  await getFuelList();
  await getExpensedList();
  await getCustomer();
  await getDestination();
  await getUnit();
  await getSupplier();

  if (route.params.id === "new") {
    storeApp.setPageTitle("สร้างเอกสารใหม่");
    form_model.value.doc_no = Utils.getDocNoDate("TS");
  } else {
    showDialogLoading.value = true;
    form_model.value.doc_no = route.params.id;
    storeApp.setPageTitle(`ประวัติเอกสาร ${form_model.value.doc_no}`);
    editMode.value = true;
    setTimeout(async () => {
      await getTSDocDetail();
    }, 1500);

  }


});


const getSupplier = () => {
  MasterdataService.getSupplier()
    .then((response) => {
      if (response.success) {
        response.data.forEach(data => {
          supplierDetails.value.push({ code: data.code, name: data.name });
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

const getUnit = () => {
  MasterdataService.getUnit()
    .then((response) => {
      if (response.success) {
        cal_by.value = response.data;

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

const getSupplierName = (code) => {
  const supplier = supplierDetails.value.find((supplier) => supplier.code === code);
  return supplier ? supplier.name : "";
};


const getDestinationOptions = (customerCode) => {
  // สมมุติว่าเราใช้ customerCode ในการดึงข้อมูลร้านปลายทาง
  // คุณอาจจะดึงข้อมูลจาก API อื่น หรือใช้ข้อมูลภายในได้ตามความเหมาะสม

  return destinationDetails.value.filter(destination => destination.code === customerCode);
};

//getTSDocDetail
const getTSDocDetail = async () => {
  await MasterdataService.getTSDocDetail(form_model.value.doc_no)
    .then((res) => {
      console.log(res);
      if (res.success) {
        const data = res.data;
        form_model.value = {
          ...form_model.value,
          ...data,
        };

        transportItems1.value = data.transportItems1.map(item => {
          return {
            ...item,
            destinationOptions: getDestinationOptions(item.customer)
          }
        });

        transportItems2.value = data.transportItems2.map(item => {
          return {
            ...item,
            destinationOptions: getDestinationOptions(item.customer)
          }
        });
        fuelDetails1.value = data.fuelDetails1;
        fuelDetails2.value = data.fuelDetails2;
        expenses1.value = data.expenses1;
        expenses2.value = data.expenses2;

        var sum_fuel = 0;
        fuelDetails1.value.forEach(item => {
          const amount = parseFloat(item.amount) || 0;

          sum_fuel += amount;
        });

        form_model.value.totaloiluse = (sum_fuel / parseFloat(form_model.value.total_mileage1)).toFixed(2);



        showDialogLoading.value = false;
      } else {
        toast.add({ severity: "error", summary: "ดึงข้อมูลล้มเหลว", detail: res.message, life: 3000 });
        showDialogLoading.value = false;
      }
    })
    .catch((err) => {
      console.log(err);
      toast.add({ severity: "error", summary: "ดึงข้อมูลล้มเหลว", detail: res.message, life: 3000 });
      showDialogLoading.value = false;
    });
};

const totalAllowance1 = computed(() =>
  transportItems1.value.reduce((sum, item) => sum + (item.allowance ? +item.allowance : 0), 0)
);

const totalRevenue1 = computed(() =>
  transportItems1.value.reduce((sum, item) => sum + (item.revenue ? +item.revenue : 0), 0)
);

const totalAllowance2 = computed(() =>
  transportItems2.value.reduce((sum, item) => sum + (item.allowance ? +item.allowance : 0), 0)
);

const totalRevenue2 = computed(() =>
  transportItems2.value.reduce((sum, item) => sum + (item.revenue ? +item.revenue : 0), 0)
);


const totalFuel1 = computed(() => {
  return fuelDetails1.value.reduce((sum, item) => {
    const amount = parseFloat(item.amount) || 0;      // เช็คค่าว่างและแปลงเป็นตัวเลข
    const unit_price = parseFloat(item.unit_price) || 0;  // เช็คค่าว่างและแปลงเป็นตัวเลข
    const total = amount * unit_price;
    return sum + total;
  }, 0);
});

const totalFuel2 = computed(() => {
  return fuelDetails2.value.reduce((sum, item) => {
    const amount = parseFloat(item.amount) || 0;      // เช็คค่าว่างและแปลงเป็นตัวเลข
    const unit_price = parseFloat(item.unit_price) || 0;  // เช็คค่าว่างและแปลงเป็นตัวเลข
    const total = amount * unit_price;
    return sum + total;
  }, 0);
});

const totalExpenses1 = computed(() => {
  return expenses1.value.reduce((sum, item) => {
    const amount = parseFloat(item.amount) || 0;
    return sum + amount;
  }, 0);
});

const totalExpenses2 = computed(() => {
  return expenses2.value.reduce((sum, item) => {
    const amount = parseFloat(item.amount) || 0;
    return sum + amount;
  }, 0);
});


const onCustomerChange = (rowData) => {
  // ถ้าลูกค้ามีการเปลี่ยนแปลง ให้ดึงร้านปลายทางที่เกี่ยวข้อง
  console.log("onCustomerChange", rowData);
  rowData.destinationOptions = destinationDetails.value.filter(
    (item) => item.code === rowData.customer
  );
  console.log("destinationOptions", rowData.destinationOptions);
};

const getDestination = () => {
  MasterdataService.getDestination()
    .then((response) => {
      console.log("destinationDetails", response);
      if (response.success) {
        destinationDetails.value = response.data;

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

//getItemShow
const getItemShow = (item_code) => {
  const item = itemDetails.value.find((item) => item.item_code === item_code);
  return item ? item.item_name : "";
};

//getCustomerShow
const getCustomerShow = (customer_code) => {
  const customer = customerDetails.value.find((customer) => customer.code === customer_code);
  return customer ? customer.name : "";
};

//getCalByName
const getCalByName = (code) => {
  const cal = cal_by.value.find((cal) => cal.code === code);
  return cal ? cal.name : "";
};

const getCustomer = () => {
  MasterdataService.getCustomer()
    .then((response) => {
      if (response.success) {
        customerDetails.value = response.data;

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

const addRow = (items) => {
  items.push({

    send_date: new Date(),
    calculation_type: "0",
    unit_price: 0,
    allowance: 0,
    revenue: 0,

  });
};

const getEmployeeName = (code) => {
  if (!code) return ""; // ถ้า code ไม่มีค่า (undefined หรือ null) ให้ return เป็น string ว่าง

  const employee = employeeDetails.value.find((employee) => 
    employee.code && employee.code.toLowerCase() === code.toLowerCase()
  );

  return employee ? employee.name.toLowerCase() : "";
};


const getIncomeList = () => {
  MasterdataService.getIncomeList()
    .then((response) => {
      console.log("transportItems1", response);
      if (response.success) {


        response.data.forEach(data => {
          itemDetails.value.push({ item_code: data.code, item_name: data.code + '~' + data.name });
        });
        /*response.data.forEach(data => {
          transportItems1.value.push({ ...data, send_date: new Date(), calculation_type: '0' });
          transportItems2.value.push({ ...data, send_date: new Date(), calculation_type: '0' });
        });*/

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

const getCarList = () => {
  MasterdataService.getCarList('')
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

const getRouteList = () => {
  MasterdataService.getRouteList('')
    .then((response) => {
      console.log("routeDetails", response)
      if (response.success) {
        routeDetails.value = response.data;

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

const getFuelList = () => {
  MasterdataService.getFuelList()
    .then((response) => {
      console.log("fuelDetails1", response);
      if (response.success) {

        // response.data.forEach(data => {
        //   fuelDetails1.value.push({ item_code: data.code, item_name: data.code + '~' + data.name, amount: 0, unit_price: 0 });
        //   fuelDetails2.value.push({ item_code: data.code, item_name: data.code + '~' + data.name, amount: 0, unit_price: 0 });
        // });

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

const getExpensedList = () => {
  MasterdataService.getExpensedList()
    .then((response) => {
      console.log("expenses1", response);
      if (response.success) {
        // response.data.forEach(data => {
        //   expenses1.value.push({ item_code: data.code, item_name: data.code + '~' + data.name, amount: 0 });
        //   expenses2.value.push({ item_code: data.code, item_name: data.code + '~' + data.name, amount: 0 });
        // });
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

const saveData = () => {
  // เช็คค่าที่ต้องการใน form_model
  if (!validateForm()) {
    console.log("มีข้อมูลที่ยังไม่ครบถ้วน");
    return;
  }

  console.log(form_model.value.isSameData);
  if (form_model.value.isSameData == 1) {
    transportItems2.value = transportItems1.value;
    fuelDetails2.value = fuelDetails1.value;
    expenses2.value = expenses1.value;

    form_model.value.start_mileage2 = form_model.value.start_mileage1;
    form_model.value.end_mileage2 = form_model.value.end_mileage1;
    form_model.value.total_mileage2 = form_model.value.total_mileage1;
    form_model.value.total_mileage_before2 = form_model.value.total_mileage_before1;
    form_model.value.total_mileage_current2 = form_model.value.total_mileage_current1;
  }


  showConfirmSave.value = true;

};

const confirmSave = () => {
  const data = {
    ...form_model.value,
    transportItems1: transportItems1.value,
    fuelDetails1: fuelDetails1.value,
    expenses1: expenses1.value,
    transportItems2: transportItems2.value,
    fuelDetails2: fuelDetails2.value,
    expenses2: expenses2.value,
  };

  if (editMode.value) {
    updateData(data);
  } else {
    saveTransportData(data);
  }
};

//savetransportData
const saveTransportData = async (data) => {
  await MasterdataService.saveTransportData(data)
    .then((res) => {
      console.log(res);
      if (res.success) {
        toast.add({ severity: "success", summary: "บันทึกข้อมูลสำเร็จ", life: 5000 });
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        toast.add({ severity: "error", summary: "บันทึกข้อมูลล้มเหลว", detail: res.message, life: 5000 });
      }
    })
    .catch((err) => {
      console.log(err);
      toast.add({ severity: "error", summary: "บันทึกข้อมูลล้มเหลว", detail: res.message, life: 5000 });
    });
};

//updateData
const updateData = async (data) => {
  await MasterdataService.updateTransportData(data)
    .then((res) => {
      console.log(res);
      if (res.success) {
        toast.add({ severity: "success", summary: "บันทึกข้อมูลสำเร็จ", life: 5000 });
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        toast.add({ severity: "error", summary: "บันทึกข้อมูลล้มเหลว", detail: res.message, life: 5000 });
      }
    })
    .catch((err) => {
      console.log(err);
      toast.add({ severity: "error", summary: "บันทึกข้อมูลล้มเหลว", detail: res.message, life: 5000 });
    });
};

// ฟังก์ชันตรวจสอบค่าว่างในฟอร์ม
const validateForm = () => {
  // สร้าง object เก็บ code (ใช้ในการเช็ค) และ name (ใช้ในการแสดงผล)
  const requiredFields = [
    { code: 'doc_no', name: 'เลขที่' },
    { code: 'doc_date', name: 'วันที่' },
    { code: 'car_code', name: 'ทะเบียนรถ' },
    { code: 'return_date', name: 'วันที่กลับ' },
    { code: 'driver1', name: 'คนขับ1' }
  ];

  // วนลูปเช็คค่าว่างในฟิลด์
  var errorcheck = false;
  for (const field of requiredFields) {
    if (!form_model.value[field.code]) {
      toast.add({
        severity: "error",
        summary: "ข้อมูลไม่ครบถ้วน",
        detail: `กรุณากรอกข้อมูลในช่อง ${field.name}`,
        life: 3000,
      });
      errorcheck = true;
    }
  }
  for (const [index, item] of transportItems1.value.entries()) {
    // รายการที่ต้องตรวจสอบ
    const requiredFields = [
      { field: 'send_date', name: 'วันที่ขน' },
      { field: 'item_code', name: 'สินค้า' },
      { field: 'customer', name: 'ลูกค้า' },
      { field: 'route', name: 'เส้นทาง' },
      { field: 'dest_name', name: 'ชื่อร้านปลายทาง' },
      { field: 'shipment_no', name: 'เลขที่ใบขน' },
      { field: 'calculation_type', name: 'หน่วย' },
    ];

    for (const { field, name } of requiredFields) {
      if (!item[field]) {
        toast.add({
          severity: "error",
          summary: `ขาไปแถวที่ ${index + 1}: ข้อมูลไม่ครบถ้วน`,
          detail: `กรุณากรอกข้อมูลในช่อง ${name}`,
          life: 3000,
        });
        errorcheck = true;
      }
    }
  }

  for (const [index, item] of transportItems2.value.entries()) {
    // รายการที่ต้องตรวจสอบ
    const requiredFields = [
      { field: 'send_date', name: 'วันที่ขน' },
      { field: 'item_code', name: 'สินค้า' },
      { field: 'customer', name: 'ลูกค้า' },
      { field: 'route', name: 'เส้นทาง' },
      { field: 'dest_name', name: 'ชื่อร้านปลายทาง' },
      { field: 'shipment_no', name: 'เลขที่ใบขน' },
      { field: 'calculation_type', name: 'หน่วย' },
    ];

    for (const { field, name } of requiredFields) {
      if (!item[field]) {
        toast.add({
          severity: "error",
          summary: `ไปกลับแถวที่ ${index + 1}: ข้อมูลไม่ครบถ้วน`,
          detail: `กรุณากรอกข้อมูลในช่อง ${name}`,
          life: 3000,
        });
        errorcheck = true;
      }
    }
  }

  if (errorcheck) {
    return false;
  }

  // ถ้าทุกฟิลด์ถูกกรอกครบแล้ว
  return true;
};


watch(
  [
    () => form_model.value.start_mileage1,
    () => form_model.value.end_mileage1,
    () => form_model.value.start_mileage2,
    () => form_model.value.end_mileage2,
    () => transportItems1.value, // Watch transportItems1 เมื่อมีการเปลี่ยนแปลง
    () => transportItems2.value, // Watch transportItems2 เมื่อมีการเปลี่ยนแปลง
  ],
  () => {
    // คำนวณระยะทางเที่ยวที่ 1
    const startMileage1 = parseFloat(form_model.value.start_mileage1) || 0;
    const endMileage1 = parseFloat(form_model.value.end_mileage1) || 0;

    form_model.value.total_mileage1 = endMileage1 - startMileage1;
    form_model.value.total_mileage_current1 = form_model.value.total_mileage1;

    // คำนวณระยะทางเที่ยวที่ 2
    const startMileage2 = parseFloat(form_model.value.start_mileage2) || 0;
    const endMileage2 = parseFloat(form_model.value.end_mileage2) || 0;

    form_model.value.total_mileage2 = endMileage2 - startMileage2;
    form_model.value.total_mileage_current2 = form_model.value.total_mileage2;

    // คำนวณ revenue สำหรับทุกรายการใน transportItems1
    transportItems1.value.forEach(item => {
      const allowance = parseFloat(item.allowance) || 0;
      const unitPrice = parseFloat(item.unit_price) || 0;

      // คำนวณ revenue (รายได้)
      item.revenue = allowance * unitPrice;
    });

    // คำนวณ revenue สำหรับทุกรายการใน transportItems2
    transportItems2.value.forEach(item => {
      const allowance = parseFloat(item.allowance) || 0;
      const unitPrice = parseFloat(item.unit_price) || 0;

      // คำนวณ revenue (รายได้)
      item.revenue = allowance * unitPrice;
    });
  },
  { deep: true } // ใช้ deep: true เพื่อดูการเปลี่ยนแปลงภายใน object transportItems
);

const goList = () => {
  router.push("/tsdochistorylist");
};

</script>

<template>
  <AppLayout>
    <MainContentWarp>
      <div class="surface-ground px-1 py-1">
        <Button label="กลับหน้ารายการ" icon="pi pi-arrow-left" class="p-button-text p-button-sm p-button-info" @click="goList()" />

        <div class="surface-card shadow-2 border-round p-fluid mt-2 p-4" id="boxupdate">
          <div class="grid formgrid p-fluid">
            <div class="field mb-2 col-12 md:col-3">
              <label class="font-medium text-900">ใบปฏิบ้ติงาน</label>
              <InputText type="text" v-model="form_model.doc_no" readonly />
            </div>
            <div class="field mb-2 col-12 md:col-3">
              <label class="font-medium text-900">วันที่</label>
              <InputText type="text" :value="Utils.getDateFormatPG(form_model.doc_date)" readonly />
            </div>
            <div class="field mb-2 col-12 md:col-6">
              <label class="font-medium text-900">หมายเหตุ</label>
              <InputText type="text" v-model="form_model.remark" readonly />
            </div>
          </div>
          <div class="grid formgrid p-fluid">
            <div class="field mb-2 col-12 md:col-3">
              <label class="font-medium text-900">ทะเบียนรถ</label>
              <InputText type="text" :value="form_model.car_code" readonly />
            </div>
            <div class="field mb-2 col-12 md:col-3">
              <label class="font-medium text-900">วันที่กลับ</label>

              <InputText type="text" :value="Utils.getDateFormatPG(form_model.return_date)" readonly />
            </div>
            <div class="field mb-2 col-12 md:col-3">
              <label class="font-medium text-900">คนขับ1</label>
              <InputText type="text" :value="form_model.driver1_name" readonly />
            </div>
            <!-- <div class="field mb-2 col-12 md:col-3">
              <label class="font-medium text-900">คนขับ2</label>

              <InputText type="text" :value="form_model.driver2_name" readonly />
            </div> -->
          </div>
          <div class="grid formgrid p-fluid">
            <div class="field mb-2 col-12 md:col-6">
              <label class="font-medium text-900">เลขที่ใบขาย</label>
              <InputText type="text" v-model="form_model.sale_doc_no" readonly />
            </div>
            <div class="field mb-2 col-12 md:col-6">
              <label class="font-medium text-900">เลขที่ซื้อค่าใช้จ่าย</label>
              <InputText type="text" v-model="form_model.expenses_doc_no" readonly />
            </div>
            <div class="field mb-2 col-12 md:col-12">
              <label class="font-medium text-900">เลขที่ซื้อเชื้อเพลิง</label>
              <InputText type="text" v-model="form_model.fuel_doc_no" readonly />
            </div>
            <div class="field mb-2 col-12 md:col-4">
              <label class="font-medium text-900">ผู้อนุมัติ</label>
              <InputText type="text" :value="getEmployeeName(form_model.approve_code)" readonly />
            </div>
            <div class="field mb-2 col-12 md:col-4">
              <label class="font-medium text-900">วันที่อนุมัติ</label>
              <InputText type="text" :value="Utils.getDateFormatPG(form_model.approve_date)" readonly />
            </div>
            <div class="field mb-2 col-12 md:col-4">
              <label class="font-medium text-900">เวลา</label>
              <InputText type="text" v-model="form_model.approve_time" readonly />
            </div>
          </div>
          <h4>รายการสินค้า</h4>
          <TabView>
            <TabPanel header="รายละเอียดขาไป">
              <div class="flex align-items-center">
                <Checkbox v-model="form_model.isSameData" :binary="true" :true-value="1" :false-value="0" :disabled="true" />
                <label for="ingredient1" class="ml-2"> ใช้ข้อมูลเดียวกันทั้งขาไปและกลับ </label>
              </div>

              <DataTable :value="transportItems1">
                <Column header="ลำดับ" class="text-center" style="width:85px">
                  <template #body="{ index }">
                    {{ index + 1 }}
                  </template>
                </Column>
                <Column field="send_date" header="วันที่ขน" style="min-width: 170px;">
                  <template #body="{ data, field }">

                    {{ Utils.getDateFormatPG(data[field]) }}
                  </template>
                </Column>
                <Column field="item_code" header="สินค้า">
                  <template #body="{ data }">
                    {{ data.item_code }}~{{ data.item_name }}
                  </template>
                </Column>
                <Column field="customer" header="ลูกค้า">
                  <template #body="{ data, field }">
                    {{ getCustomerShow(data[field]) }}
                  </template>
                </Column>
                <Column field="route" header="เส้นทาง">
                  <template #body="{ data, field }">

                    {{ data[field] }}
                  </template>
                </Column>
                <Column field="dest_name" header="ชื่อร้านปลายทาง">
                  <template #body="{ data, field }">

                    {{ data[field] }}
                  </template>
                </Column>
                <Column field="shipment_no" header="เลขที่ใบขน">
                  <template #body="{ data, field }">
                    {{ data[field] }}
                  </template>
                </Column>
                <Column field="calculation_type" header="หน่วย">
                  <template #body="{ data, field }">

                    {{ getCalByName(data[field]) }}
                  </template>
                </Column>
                <Column field="unit_price" header="จำนวน" class="text-right">
                  <template #body="{ data, field }">
                    {{ Utils.formatNumber(data[field]) }}
                  </template>
                </Column>
                <Column field="allowance" header="ราคา" class="text-right">
                  <template #body="{ data, field }">
                    {{ Utils.formatNumber(data[field]) }}
                  </template>
                </Column>
                <Column field="revenue" header="รายได้" class="text-right">
                  <template #body="{ data, field }">
                    {{ Utils.formatNumber(data[field]) }}
                  </template>
                </Column>


                <ColumnGroup type="footer">
                  <Row>

                    <Column footer="รวม" :colspan="10" footerStyle="text-align:right" />
                    <Column :footer="Utils.formatNumber(totalRevenue1)" footerStyle="text-align:right" />

                  </Row>
                </ColumnGroup>
              </DataTable>

            </TabPanel>
            <TabPanel header="รายละเอียดขากลับ" v-if="form_model.isSameData == 0">
              <DataTable :value="transportItems2">
                <Column header="ลำดับ" class="text-center" style="width:85px">
                  <template #body="{ index }">
                    {{ index + 1 }}
                  </template>
                </Column>
                <Column field="send_date" header="วันที่ขน" style="min-width: 170px;">
                  <template #body="{ data, field }">

                    {{ Utils.getDateFormatPG(data[field]) }}
                  </template>
                </Column>
                <Column field="item_code" header="สินค้า">
                  <template #body="{ data }">
                    {{ data.item_code }}~{{ data.item_name }}
                  </template>
                </Column>
                <Column field="customer" header="ลูกค้า">
                  <template #body="{ data, field }">
                    {{ getCustomerShow(data[field]) }}
                  </template>
                </Column>
                <Column field="route" header="เส้นทาง">
                  <template #body="{ data, field }">

                    {{ data[field] }}
                  </template>
                </Column>
                <Column field="dest_name" header="ชื่อร้านปลายทาง">
                  <template #body="{ data, field }">

                    {{ data[field] }}
                  </template>
                </Column>
                <Column field="shipment_no" header="เลขที่ใบขน">
                  <template #body="{ data, field }">
                    {{ data[field] }}
                  </template>
                </Column>
                <Column field="calculation_type" header="หน่วย">
                  <template #body="{ data, field }">

                    {{ getCalByName(data[field]) }}
                  </template>
                </Column>
                <Column field="unit_price" header="จำนวน" class="text-right">
                  <template #body="{ data, field }">
                    {{ Utils.formatNumber(data[field]) }}
                  </template>
                </Column>
                <Column field="allowance" header="ราคา" class="text-right">
                  <template #body="{ data, field }">
                    {{ Utils.formatNumber(data[field]) }}
                  </template>
                </Column>
                <Column field="revenue" header="รายได้" class="text-right">
                  <template #body="{ data, field }">
                    {{ Utils.formatNumber(data[field]) }}
                  </template>
                </Column>


                <ColumnGroup type="footer">
                  <Row>

                    <Column footer="รวม" :colspan="10" footerStyle="text-align:right" />

                    <Column :footer="Utils.formatNumber(totalRevenue2)" footerStyle="text-align:right" />

                  </Row>
                </ColumnGroup>
              </DataTable>
            </TabPanel>
          </TabView>

          <div class="grid formgrid p-fluid">
            <div class="field mb-2 mt-2 col-12 md:col-2">
              <label class="font-medium text-900">เบิกพีสลิง : {{ form_model.presling }}</label>
            </div>
            <div class="field mb-2 mt-2 col-12 md:col-2">
              <label class="font-medium text-900">ค่าขนส่งพรีสลิง : {{ form_model.presling_price }}</label>

            </div>
          </div>
          <!-- ตาราง ค่าเชื้อเพลิง -->
          <h4>ค่าเชื้อเพลิง</h4>
          <DataTable :value="fuelDetails1">
            <Column header="ลำดับ" class="text-center" style="width:85px">
              <template #body="{ index }">
                {{ index + 1 }}
              </template>
            </Column>

            <Column field="fuel_date" header="วันที่">
              <template #body="{ data, field }">
                {{ Utils.getDateFormatPG(data[field]) }}
              </template>
            </Column>
            <Column field="supplier_code" header="เจ้าหนี้">
              <template #body="{ data, field }">
                {{ getSupplierName(data[field]) }}
              </template>
            </Column>

            <Column field="fuel_doc_no" header="เลขที่ใบแจ้งหนี้" />

            <Column field="route_code" header="เส้นทาง" />
            <Column field="item_name" header="สินค้า" />

            <Column field="amount" header="จำนวน" class="text-right">
              <template #body="{ data, field }">
                {{ Utils.formatNumber(data[field]) }}
              </template>
            </Column>
            <Column field="unit_price" header="ลิตละ" class="text-right">
              <template #body="{ data, field }">
                {{ Utils.formatNumber(data[field]) }}
              </template>
            </Column>
            <Column header="รวม" class="text-right">
              <template #body="{ data }">
                {{ Utils.formatNumber(data.amount * data.unit_price) }}
              </template>
            </Column>

            <ColumnGroup type="footer">
              <Row>
                <Column footer="รวม" :colspan="8" footerStyle="text-align:right" />
                <Column :footer="Utils.formatNumber(totalFuel1)" footerStyle="text-align:right" />
              </Row>
            </ColumnGroup>
          </DataTable>

          <!-- ตาราง ค่าใช้จ่ายรวม -->
          <h4>ค่าใช้จ่ายรวม</h4>
          <div class="flex align-items-center mt-0 pt-0">
            เจ้าหนี้ : {{ getSupplierName(form_model.expenses_supplier_code) }}
          </div>
          <DataTable :value="expenses1">
            <Column header="ลำดับ" class="text-center" style="width:85px">
              <template #body="{ index }">
                {{ index + 1 }}
              </template>
            </Column>
            <Column field="item_name" header="สินค้า" />
            <Column field="amount" header="จำนวน" style="width:20%" class="text-right">
              <template #body="{ data, field }">
                {{ Utils.formatNumber(data[field]) }}
              </template>
            </Column>
            <ColumnGroup type="footer">
              <Row>
                <Column footer="รวม" :colspan="2" footerStyle="text-align:right" />
                <Column :footer="Utils.formatNumber(totalExpenses1)" footerStyle="text-align:right" />

              </Row>
            </ColumnGroup>
          </DataTable>


          <div class="grid formgrid p-fluid mt-2 mx-2">
            <div class="field mb-2 col-12 md:col-3">
              <label class="font-medium text-900">เลขไมล์ขาไป</label>
              <InputText type="text" v-model="form_model.start_mileage1" readonly />
            </div>
            <div class="field mb-2 col-12 md:col-3">
              <label class="font-medium text-900">เลขไมล์ขากลับ</label>
              <InputText type="text" v-model="form_model.end_mileage1" readonly />
            </div>
            <div class="field mb-2 col-12 md:col-3">
              <label class="font-medium text-900">ระยะทางเที่ยวนี้</label>
              <InputText type="text" v-model="form_model.total_mileage1" readonly />
            </div>
            <div class="field mb-2 col-12 md:col-3">
              <label class="font-medium text-900">อัตราการใช้น้ำมัน (กม./ชม)</label>
              <InputText type="text" v-model="form_model.totaloiluse" readonly />
            </div>
          </div>

        </div>
      </div>
      <Dialog v-model:visible="showDialogLoading" :style="{ width: '350px' }" :modal="true" :closable="false">
        <div class="text-center">
          <i class="pi pi-spin pi-spinner" style="font-size: 5rem"> </i>
          <h4>กำลังโหลดข้อมูล...</h4>
        </div>
      </Dialog>
      <Dialog v-model:visible="showConfirmSave" :style="{ width: '450px' }" header="ยืนยันการทำงาน" :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span>ต้องการบันทึกข้อมูลใช่หรือไม่</span>
        </div>
        <template #footer>
          <Button label="ยกเลิก" icon="pi pi-times" class="p-button-text" @click="showConfirmSave = false" />
          <Button label="ยืนยัน" icon="pi pi-check" class="p-button-success" @click="confirmSave" />
        </template>
      </Dialog>
    </MainContentWarp>
  </AppLayout>
</template>
<style></style>
