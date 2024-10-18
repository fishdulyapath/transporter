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


const cal_by = ref([]);
const company_name = ref([]);

const tableMile = ref([]);

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
  await getCompany();


  if (route.params.id === "new") {
    storeApp.setPageTitle("สร้างเอกสารใหม่");
    form_model.value.doc_no = Utils.getDocNoDate("TS");
  } else {
    showDialogLoading.value = true;
    form_model.value.doc_no = route.params.id;
    storeApp.setPageTitle(`แก้ไขเอกสาร ${form_model.value.doc_no}`);
    editMode.value = true;
    setTimeout(async () => {
      await getTSDocDetail();
    }, 1500);

  }


});

//getCompany
const getCompany = () => {
  MasterdataService.getCompany()
    .then((response) => {
      if (response.success) {
        if (response.data.length > 0) {
          company_name.value = response.data[0];
        }
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

        // รวม transportItems1 กับ transportItems2
        transportItems1.value = [...data.transportItems1, ...data.transportItems2.map(item => {
          return {
            ...item,
            destinationOptions: getDestinationOptions(item.customer)
          }
        })];

        // ฟังก์ชันสำหรับรวม fuelDetails1 และ fuelDetails2
        fuelDetails1.value = mergeDetails(data.fuelDetails1, data.fuelDetails2, 'fuel');

        // ฟังก์ชันสำหรับรวม expenses1 และ expenses2
        expenses1.value = mergeDetails(data.expenses1, data.expenses2, 'expenses');

        // อัปเดต fuelDetails2 และ expenses2 เป็นรายการว่าง (ถ้าไม่ต้องการให้แสดงซ้ำ)
        fuelDetails2.value = [];
        expenses2.value = [];

        var sum_fuel = 0
        fuelDetails1.value.forEach(item => {
          const amount = parseFloat(item.amount) || 0;      // เช็คค่าว่างและแปลงเป็นตัวเลข
          sum_fuel += amount;
        });

        tableMile.value.push({ name: "เลขไมล์ขาไป", amount: form_model.value.start_mileage1 })
        tableMile.value.push({ name: "เลขไมล์ขากลับ", amount: form_model.value.end_mileage1 })
        tableMile.value.push({ name: "ระยะทางเที่ยวนี้", amount: form_model.value.total_mileage1 })

        tableMile.value.push({ name: "อัตราการใช้น้ำมัน", amount: (sum_fuel / parseFloat(form_model.value.total_mileage1)).toFixed(2) })

        showDialogLoading.value = false;

        setTimeout(() => {
          window.print();
          window.close();
        }, 1500);
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

// ฟังก์ชันสำหรับรวม fuelDetails หรือ expenses
const mergeDetails = (details1, details2, type) => {
  const merged = [...details1];

  details2.forEach(item2 => {
    const match = merged.find(item1 =>
      item1.item_code === item2.item_code && item1.unit_standard === item2.unit_standard
    );

    if (match) {
      // ถ้าเจอรายการที่ตรงกัน ให้นำ amount มารวมกัน และรวม unit_price ถ้าจำเป็น
      match.amount = parseFloat(match.amount) + parseFloat(item2.amount);

      // ถ้าเป็น fuelDetails ให้รวม unit_price ด้วย
      if (type === 'fuel') {
        match.unit_price = parseFloat(match.unit_price) + parseFloat(item2.unit_price);
      }
    } else {
      // ถ้าไม่เจอ ให้เพิ่มรายการใหม่เข้าไปใน merged
      merged.push(item2);
    }
  });

  return merged;
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

        response.data.forEach(data => {
          fuelDetails1.value.push({ item_code: data.code, item_name: data.name, amount: 0, unit_price: 0 });
          fuelDetails2.value.push({ item_code: data.code, item_name: data.name, amount: 0, unit_price: 0 });
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

const getExpensedList = () => {
  MasterdataService.getExpensedList()
    .then((response) => {
      console.log("expenses1", response);
      if (response.success) {
        response.data.forEach(data => {
          expenses1.value.push({ item_code: data.code, item_name: data.name, amount: 0 });
          expenses2.value.push({ item_code: data.code, item_name: data.name, amount: 0 });
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


</script>

<template>

  <div class="grid formgrid p-fluid mb-2" style="font-size: 14px;  color:#000;">
    <div class="field mt-1 col-12">
      <h2 class="font-medium text-900 text-center mb-0">{{ company_name.name }}</h2>
    </div>
    <div class="field mt-0 col-12">
      <h2 class="font-medium text-900 text-center mt-0">ใบปฏิบ้ติงาน</h2>
    </div>
    <div class="field my-1 col-3 ">
      <p class="my-0">เลขที่ : {{ form_model.doc_no }}</p>
    </div>
    <div class="field my-1 col-3 ">
      <p class="my-0">วันที่ : {{ Utils.getDateFormatPG(form_model.doc_date) }}</p>
    </div>
    <div class="field my-1 col-3 ">
      <p class="my-0">ทะเบียนรถ : {{ form_model.car_code }}</p>
    </div>
    <div class="field my-1 col-3 ">
      <p class="my-0">คนขับ : {{ form_model.driver1_name }}</p>
    </div>
    <div class="field my-1 col-3 ">
      <p class="my-0">วันที่กลับ : {{ Utils.getDateFormatPG(form_model.return_date) }}</p>
    </div>
    <div class="field my-1 col-3 ">
      <p class="my-0">หมายเหตุ : {{ form_model.remark }}</p>
    </div>
  </div>

  <DataTable :value="transportItems1" style="font-size: 12px !important;   color:#000;" size="small" showGridlines>
    <Column header="#" class="text-center">
      <template #body="{ index }">
        {{ index + 1 }}
      </template>
    </Column>
    <Column field="send_date" header="วันที่ขน" style="min-width:105px">
      <template #body="{ data, field }">

        {{ Utils.getDateFormatPG(data[field]) }}
      </template>
    </Column>

    <Column field="trans_flag" header="" class="text-center">
      <template #body="{ data }">
        <span v-if="data.trans_flag == 0">G</span>
        <span v-if="data.trans_flag == 1">B</span>
      </template>
    </Column>
    <Column field="customer" header="ลูกค้า">
      <template #body="{ data, field }">
        {{ getCustomerShow(data[field]) }}
      </template>
    </Column>
    <Column field="item_code" header="สินค้า">
      <template #body="{ data }">
        {{ data.item_name }}
      </template>
    </Column>

    <Column field="route" header="เส้นทาง">
      <template #body="{ data, field }">

        {{ data[field] }}
      </template>
    </Column>
    <Column field="dest_name" header="ร้านปลายทาง">
      <template #body="{ data, field }">

        {{ data[field] }}
      </template>
    </Column>
    <Column field="shipment_no" header="เลขที่ใบขน">
      <template #body="{ data, field }">
        {{ data[field] }}
      </template>
    </Column>

    <Column field="revenue" header="รายได้" class="text-right">
      <template #body="{ data, field }">
        {{ Utils.formatNumber(data[field]) }}
      </template>
    </Column>


    <ColumnGroup type="footer" class="my-0">
      <Row class="my-0 ">
        <Column footer="รวม" :colspan="8" footerStyle="text-align:right" class="py-1" />
        <Column :footer="Utils.formatNumber(totalRevenue1)" style="text-align:right;padding-right: 8px;" class="py-1 text-right" />
      </Row>
    </ColumnGroup>
  </DataTable>


  <!-- ตาราง ค่าใช้จ่ายรวม -->
  <p class="mb-1" style="font-size: 12px;  color:#000;">ค่าใช้จ่ายรวม</p>
  <DataTable :value="expenses1" style="font-size: 12px !important;  color:#000;" size="small" showGridlines>

    <Column field="item_name" header="สินค้า" />
    <Column field="amount" header="จำนวน" style="width:20%" class="text-right">
      <template #body="{ data, field }">
        {{ Utils.formatNumber(data[field]) }}
      </template>
    </Column>
    <ColumnGroup type="footer">
      <Row class="py-1">
        <Column footer="รวม" :colspan="1" footerStyle="text-align:right" class="py-1" />
        <Column :footer="Utils.formatNumber(totalExpenses1)" style="text-align:right;padding-right: 8px;" class="py-1 text-right" />

      </Row>
    </ColumnGroup>
  </DataTable>

  <!-- ตาราง ค่าเชื้อเพลิง -->
  <p class="mb-1" style="font-size: 12px;   color:#000;">ค่าเชื้อเพลิง</p>
  <div class="grid formgrid p-fluid mt-2" style="font-size: 13px;">
    <div class=" col-8 ">

      <DataTable :value="fuelDetails1" style="font-size: 12px !important;" size="small" showGridlines>

        <Column field="item_name" header="สินค้า" />
        <Column field="amount" header="จำนวน" class="text-right">
          <template #body="{ data, field }">
            {{ Utils.formatNumber(data[field]) }}
          </template>
        </Column>
        <Column field="unit_price" header="ลิตรละ" class="text-right">
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
          <Row class="my-0 ">
            <Column footer="รวม" :colspan="3" footerStyle="text-align:right" class="py-1" />
            <Column :footer="Utils.formatNumber(totalFuel1)" style="text-align:right;padding-right: 8px;" class="py-1 text-right" />
          </Row>
        </ColumnGroup>
      </DataTable>
    </div>
    <div class=" col-4 ">
      <DataTable :value="tableMile" style="font-size: 12px !important;" size="small" showGridlines>

        <Column field="name" header="ชื่อ"></Column>
        <Column field="amount" header="" class="text-right">
          <template #body="{ data }">
            <span class="text-right" v-if="data.name != 'อัตราการใช้น้ำมัน'">{{ Utils.formatNumber(data.amount) }}</span>
            <span class="text-right" v-else>{{ data.amount }} กม./ลิตร</span>
          </template>
        </Column>

      </DataTable>
    </div>
  </div>

  <div class="grid signature-section" style="font-size: 13px;  color:#000;">
    <div class="field mb-1 col-12 text-right">
      <span>ลงชื่อ.............................................ผู้รับเงิน</span>
    </div>
    <div class="field my-0  col-12 text-right">
      <span>ลงชื่อ..........................................ผู้เบิกจ่าย</span>
    </div>
  </div>


</template>
<style>
th {
  padding-top: 8px !important;
  padding-bottom: 8px !important;
}

.p-datatable .p-datatable-thead > tr > th {
  color: #000 !important;
  border: 1px solid #000 !important;
}

.p-datatable .p-datatable-tbody > tr > td {
  color: #000 !important;
  border: 1px solid #000 !important;
}

.p-datatable .p-datatable-tfoot > tr > td {
  color: #000 !important;
  border: 1px solid #000 !important;
}
.signature-section {
  position: absolute;
  bottom: 40px;
  right: 0;
  width: 100%;
  text-align: right;
  padding-right: 20px;
  /* ปรับค่า padding ตามต้องการ */
}

@page {
  size: a4 portrait;
  margin: 2mm;
  font-size: 14px !important;
  color:#000;
  scale: 70%;
}
</style>