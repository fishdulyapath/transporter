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

const router = useRouter();
const toast = useToast();
const data_list = ref([]);
const selectedProduct = ref();
const expandedRows = ref([]);
const search = ref('');
const from_date = ref('');
const to_date = ref('');
const showConfirmDeleteDialog = ref(false);
const deleteDocNo = ref('');
const showConfirmApproveDialog = ref(false);
const docNoConfirm = ref('');
const itemDetails = ref([]);
const employeeDetails = ref([]);
const supplierDetails = ref([]);
const customerDetails = ref([]);
const supplier_code = ref('');
const data_report = ref([]);
const expenseColumns = ref([]);  // เก็บคอลัมน์รายจ่ายทั้งหมด
const expensesColumns = ref([]); // เก็บคอลัมน์ของ expenses ที่จะสร้าง


const showDialogLoading = ref(false);
const cal_by = ref([
  { code: "0", name: "น้ำหนัก" },
  { code: "1", name: "จำนวนชิ้น" },
  { code: "2", name: "ต่อเที่ยว" },
]);


onMounted(() => {
  storeApp.setActivePage("tsreport");
  storeApp.setActiveChild('');
  storeApp.setPageTitle("รายงานการขนส่ง");

  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  from_date.value = firstDay;
  to_date.value = lastDay;

  // getIncomeList();
  getEmployee();
  getCustomer();
  getSupplier();
});

//getsupplier
const getSupplier = () => {
  MasterdataService.getSupplier()
    .then((response) => {
      if (response.success) {
        response.data.forEach(data => {
          supplierDetails.value.push({ code: data.code, name: data.code + '~' + data.name });
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


const getCalByName = (code) => {
  const cal = cal_by.value.find((cal) => cal.code === code);
  return cal ? cal.name : "";
};



const getIncomeList = () => {
  MasterdataService.getIncomeList()
    .then((response) => {
      console.log("transportItems1", response);
      if (response.success) {


        response.data.forEach(data => {
          itemDetails.value.push({ item_code: data.code, item_name: data.code + '~' + data.name });
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

const exportExcel = () => {
  // 1. กำหนดหัวตารางให้ตรงกับ DataTable
  const headers = [
    { header: 'วันที่', key: 'doc_date' },
    { header: 'ทะเบียนรถ', key: 'car_code' },
    { header: 'ลูกค้า', key: 'customer_1' },
    { header: 'สินค้าไป', key: 'item_1' },
    { header: 'หน่วย', key: 'unit_1' },
    { header: 'จำนวน', key: 'qty_1' },
    { header: 'ราคา', key: 'price_1' },
    { header: 'ค่าบรรทุกไป', key: 'total_1' },
    { header: 'สถานที่ลง', key: 'shop_1' },
    { header: 'สินค้ากลับ', key: 'item_2' },
    { header: 'หน่วย', key: 'unit_2' },
    { header: 'จำนวน', key: 'qty_2' },
    { header: 'ราคา', key: 'price_2' },
    { header: 'ค่าบรรทุกกลับ', key: 'total_2' },
    { header: 'สถานที่ลง', key: 'shop_2' },
    { header: 'เบิกพีสลิง', key: 'presling' },
    { header: 'ค่าขนส่งพรีสลิง', key: 'presling_price' },
    { header: 'รวมค่าบรรทุก', key: 'total' },
    { header: 'เลขไมล์ขาไป', key: 'start_mileage' },
    { header: 'เลขไมล์ขากลับ', key: 'end_mileage' },
    { header: 'ระยะทาง', key: 'total_mileage' },
    { header: 'เชื้อเพลิง', key: 'total_fuel' },
    { header: 'จำนวนเงิน', key: 'total_fuel_price' },
    { header: 'เรทก๊าซ/กก.', key: 'fuel_rate_price' }
  ];

  // 2. เพิ่มคอลัมน์ค่าใช้จ่ายจาก expensesColumns
  expensesColumns.value.forEach(column => {
    headers.push({ header: column, key: column });
  });

  // เพิ่มคอลัมน์รวมค่าใช้จ่าย
  headers.push({ header: 'ค่าใช้จ่ายรวม', key: 'total_expenses' });
  headers.push({ header: 'ยอดคงเหลือ', key: 'total_balance' });
  headers.push({ header: 'ค่าใช้จ่ายทั้งหมด', key: 'total_fuel_expenses' });

  // 3. เตรียมข้อมูลสำหรับ Export
  const excelData = data_report.value.map((item) => {
    return {
      doc_date: String(item.doc_date || ""),
      car_code: String(item.car_code || ""),
      customer_1: String(item.customer_1 || ""),
      item_1: String(item.item_1 || ""),
      unit_1: String(item.unit_1 || ""),
      qty_1: Number(item.qty_1 || 0),             // เป็นตัวเลข
      price_1: Number(item.price_1 || 0),         // เป็นตัวเลข
      total_1: Number(item.total_1 || 0),         // เป็นตัวเลข
      shop_1: String(item.shop_1 || ""),
      item_2: String(item.item_2 || ""),
      unit_2: String(item.unit_2 || ""),
      qty_2: Number(item.qty_2 || 0),             // เป็นตัวเลข
      price_2: Number(item.price_2 || 0),         // เป็นตัวเลข
      total_2: Number(item.total_2 || 0),         // เป็นตัวเลข
      shop_2: String(item.shop_2 || ""),
      presling: Number(item.presling || 0),       // เป็นตัวเลข
      presling_price: Number(item.presling_price || 0), // เป็นตัวเลข
      total: Number(item.total || 0),             // เป็นตัวเลข
      start_mileage: Number(item.start_mileage || 0),   // เป็นตัวเลข
      end_mileage: Number(item.end_mileage || 0),       // เป็นตัวเลข
      total_mileage: Number(item.total_mileage || 0),   // เป็นตัวเลข
      total_fuel: Number(item.total_fuel || 0),         // เป็นตัวเลข
      total_fuel_price: Number(item.total_fuel_price || 0), // เป็นตัวเลข
      fuel_rate_price: Number(item.fuel_rate_price || 0),   // เป็นตัวเลข
      total_expenses: Number(item.total_expenses || 0),     // เป็นตัวเลข
      total_balance: Number(item.total_balance || 0),       // เป็นตัวเลข
      total_fuel_expenses: Number(item.total_fuel_expenses || 0), // เป็นตัวเลข
      // รวมค่าใช้จ่ายตาม expensesColumns
      ...Object.fromEntries(
        expensesColumns.value.map(column => [column, Number(item[column] || 0)])
      )
    };
  });


  // 4. สร้าง worksheet และ workbook
  const worksheet = XLSX.utils.json_to_sheet(excelData, { header: headers.map(col => col.key) });
  XLSX.utils.sheet_add_aoa(worksheet, [headers.map(col => col.header)], { origin: "A1" });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data Report");

  // 5. Export ไฟล์ Excel
  XLSX.writeFile(workbook, "รายงานการขนส่ง" + Utils.getDateFormatPG(from_date.value) + "-" + Utils.getDateFormatPG(to_date.value) + ".xlsx");
};

//approveDoc
const approveDoc = async () => {
  await MasterdataService.successTSDoc(docNoConfirm.value, localStorage._usercode || "")
    .then((res) => {
      console.log(res);
      if (res.success) {
        toast.add({ severity: "success", summary: "อนุมัติสำเร็จ", life: 5000 });
        getDocList();
        showConfirmApproveDialog.value = false;
      } else {
        toast.add({ severity: "error", summary: "อนุมัติล้มเหลว", detail: res.message, life: 5000 });
        showConfirmApproveDialog.value = false;
      }
    })
    .catch((err) => {
      console.log(err);
      toast.add({ severity: "error", summary: "อนุมัติล้มเหลว", detail: err, life: 5000 });
      showConfirmApproveDialog.value = false;
    });
};
const getCustomerShow = (customer_code) => {
  const customer = customerDetails.value.find((customer) => customer.code === customer_code);
  return customer ? customer.name : "";
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

//getDocList
const getDocList = async () => {
  var from_datex = "";
  var to_datex = "";
  console.log(from_date.value);
  if (from_date.value != "" && from_date.value != undefined) {
    from_datex = Utils.getDateFormatPG(from_date.value);
  }
  if (to_date.value != "" && to_date.value != undefined) {
    to_datex = Utils.getDateFormatPG(to_date.value);
  }


  showDialogLoading.value = true;
  await MasterdataService.getTsDocReportList(search.value, from_datex, to_datex)
    .then((res) => {
      console.log(res);
      if (res.success) {
        data_list.value = res.data;

        data_list.value.forEach((item) => {
          item.expenses1.forEach((expense) => {
            // ตรวจสอบว่ามีคอลัมน์นี้หรือยัง ถ้าไม่มีก็เพิ่มเข้าไป
            if (!expenseColumns.value.includes(expense.item_name)) {
              expenseColumns.value.push(expense.item_name);
            }
          });
        });

        data_list.value.forEach((item) => {
          item.expenses1.forEach((expense) => {
            if (!expensesColumns.value.includes(expense.item_name)) {
              expensesColumns.value.push(expense.item_name);
            }
          });
        });

        data_report.value = data_list.value.map(item => {
          const dataInline = {
            car_code: "",
            doc_date: "",
            doc_date2: "",
            customer_1: "",
            customer_2: "",
            item_1: "",
            unit_1: "",
            qty_1: 0,
            price_1: 0,
            total_1: 0,
            shop_1: "",
            item_2: "",
            unit_2: "",
            qty_2: 0,
            price_2: 0,
            total_2: 0,
            shop_2: "",
            presling: 0,
            presling_price: 0,
            total: 0,
            start_mileage: 0,
            end_mileage: 0,
            total_mileage: 0,
            total_fuel: 0,
            total_fuel_price: 0,
            fuel_rate_price: 0,
            total_expenses: 0,
            total_balance: 0,
            total_fuel_expenses: 0,
          };

          // กำหนดค่าเริ่มต้นสำหรับ dynamic expenses columns
          expensesColumns.value.forEach((column) => {
            dataInline[column] = 0;  // กำหนดค่าเริ่มต้นเป็น 0 สำหรับทุก expenses ที่สร้างเป็นคอลัมน์
          });

          // ขาไป
          dataInline.car_code = item.car_code || "";

          const data1 = item.transportItems1[0] || {};
          dataInline.doc_date = data1.send_date || "";
          dataInline.customer_1 = getCustomerShow(data1.customer);
          dataInline.item_1 = data1.item_name || "";
          dataInline.unit_1 = data1.calculation_type || "";
          dataInline.qty_1 = data1.unit_price || 0;
          dataInline.price_1 = data1.allowance || 0;
          dataInline.total_1 = (parseFloat(data1.unit_price || 0) * parseFloat(data1.allowance || 0)).toFixed(2);
          dataInline.shop_1 = data1.dest_name || "";

          // ขากลับ
          const data2 = item.transportItems2[0] || {};
          dataInline.doc_date2 = data2.send_date || "";
          dataInline.customer_2 = getCustomerShow(data2.customer);
          dataInline.item_2 = data2.item_name || "";
          dataInline.unit_2 = data2.calculation_type || "";
          dataInline.qty_2 = data2.unit_price || 0;
          dataInline.price_2 = data2.allowance || 0;
          dataInline.total_2 = (parseFloat(data2.unit_price || 0) * parseFloat(data2.allowance || 0)).toFixed(2);
          dataInline.shop_2 = data2.dest_name || "";

          // ข้อมูล Presling
          dataInline.presling = item.presling || 0;
          dataInline.presling_price = item.presling_price || 0;
          dataInline.total = (parseFloat(dataInline.total_1 || 0) + parseFloat(dataInline.total_2 || 0) + parseFloat(dataInline.presling_price || 0)).toFixed(2);

          // ข้อมูลไมล์
          dataInline.start_mileage = item.start_mileage1 || 0;
          dataInline.end_mileage = item.end_mileage1 || 0;
          dataInline.total_mileage = item.total_mileage1 || 0;

          // คำนวณค่าเชื้อเพลิง
          const { totalFuel, totalFuelPrice } = calculateFuel(item.fuelDetails1);
          dataInline.total_fuel = totalFuel.toFixed(2);
          dataInline.total_fuel_price = totalFuelPrice.toFixed(2);
          dataInline.fuel_rate_price = item.total_mileage1 ? (totalFuelPrice / item.total_mileage1).toFixed(2) : 0;

          // คำนวณค่าใช้จ่ายรวม และใส่ค่าใน dynamic columns
          let totalExpenses = 0;
          item.expenses1.forEach((expense) => {
            dataInline[expense.item_name] = expense.amount ? parseFloat(expense.amount) : 0;
            totalExpenses += parseFloat(expense.amount || 0);
          });

          dataInline.total_expenses = totalExpenses.toFixed(2);
          dataInline.total_balance = (4000 - totalExpenses).toFixed(2);
          dataInline.total_fuel_expenses = (totalFuelPrice + totalExpenses).toFixed(2);

          return dataInline;
        });


        console.log(data_report.value)



        showDialogLoading.value = false;
      } else {
        showDialogLoading.value = false;
        toast.add({ severity: "error", summary: "ดึงข้อมูลล้มเหลว", detail: res.message, life: 5000 });
      }
    })
    .catch((err) => {
      showDialogLoading.value = false;
      console.log(err);
    });
};

const calculateFuel = (fuelDetails) => {
  let totalFuel = 0;
  let totalFuelPrice = 0;

  fuelDetails.forEach(fuel => {
    totalFuel += parseFloat(fuel.amount) || 0;
    totalFuelPrice += parseFloat(fuel.amount * fuel.unit_price) || 0;
  });

  return { totalFuel, totalFuelPrice };
};

// ฟังก์ชันสำหรับคำนวณค่าใช้จ่ายรวม
const calculateExpenses = (expenses) => {
  let totalExpenses = 0;
  expenses.forEach(expense => {
    totalExpenses += parseFloat(expense.amount) || 0;
  });
  return { totalExpenses };
};

const viewDetails = async (doc_no) => {
  console.log(doc_no);
  router.push({ name: "tsapprovedetail", params: { id: doc_no } });
};

const getItemShow = (item_code) => {
  const item = itemDetails.value.find((item) => item.item_code === item_code);
  return item ? item.item_name : "";
};

const deleteDoc = async () => {

  await MasterdataService.unapproveTSDoc(deleteDocNo.value)
    .then((res) => {
      console.log(res);
      if (res.success) {
        toast.add({ severity: "success", summary: "ไม่อนุมัติเอกสารสำเร็จ", life: 5000 });
        getDocList();
        showConfirmDeleteDialog.value = false;
      } else {
        toast.add({ severity: "error", summary: "ไม่อนุมัติเอกสารล้มเหลว", detail: res.message, life: 5000 });
        showConfirmDeleteDialog.value = false;
      }
    })
    .catch((err) => {
      console.log(err);
      toast.add({ severity: "error", summary: "ไม่อนุมัติเอกสารล้มเหลว", detail: res.message, life: 5000 });
      showConfirmDeleteDialog.value = false;
    });
};



const showConfirmDelete = (doc_no) => {
  deleteDocNo.value = doc_no;
  showConfirmDeleteDialog.value = true;
};

const showConfirmSendApprove = (doc_no) => {
  docNoConfirm.value = doc_no;
  showConfirmApproveDialog.value = true;
};

const formatNumber = (value) => {
  return Number(value).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};


function goToCreate() {
  router.push({ name: "transporter_detail", params: { id: 'new' } });
}


function printDoc(data) {
  const { href } = router.resolve({
    name: "send_print",
    params: { id: data },
  });
  window.open(href, "_blank");

  setTimeout(() => {
    getDocList();
  }, 1000);
}


function exportExcel2(doc_no, jsonData) {

  //getdocdetail

  // เตรียมข้อมูลหัวข้อสำหรับ Excel
  const excel_data = [
    ["เลขที่เอกสาร", jsonData.doc_no],
    ["วันที่", jsonData.doc_date],
    ["ทะเบียนรถ", jsonData.car_code],
    ["วันที่กลับ", jsonData.return_date],
    ["คนขับ 1", jsonData.driver1_name],
    ["คนขับ 2", jsonData.driver2_name],
    ["เลขไมล์เที่ยวก่อน ขาไป", jsonData.start_mileage1, "เลขไมล์เที่ยวก่อน ขากลับ", jsonData.start_mileage2],
    ["เลขไมล์เที่ยวนี้ ขาไป", jsonData.end_mileage1, "เลขไมล์เที่ยวนี้ ขากลับ", jsonData.end_mileage2],
    ["ระยะทางเที่ยวนี้ ขาไป", jsonData.total_mileage1, "ระยะทางเที่ยวนี้ ขากลับ", jsonData.total_mileage2],
    ["ผู้สร้าง", jsonData.creator_code, "หมายเหตุ", jsonData.remark],
    [],
    ["รายการสินค้า ขาไป"],
    ["ลำดับ", "วันที่ขน", "ลูกค้า", "สินค้า", "เส้นทาง", "ชื่อร้านปลายทาง", "เลขที่ใบขน", "คิดตาม", "จำนวน", "เบี้ยเลี้ยง", "รายได้"],
  ];

  // เตรียมข้อมูล Transport Items 1
  var transportItem1line = 0;
  jsonData.transportItems1.forEach(item => {
    excel_data.push([
      transportItem1line + 1,
      item.send_date,
      item.customer,
      getItemShow(item.item_code),
      item.route,
      item.dest_name,
      item.shipment_no,
      getCalByName(item.calculation_type),
      item.unit_price,
      item.allowance,
      item.revenue,
    ]);
    transportItem1line++;
  });

  excel_data.push([]); // เว้นบรรทัด
  excel_data.push(["ค่าเชื้อเพลิง ขาไป"]);
  excel_data.push(["ลำดับ", "สินค้า", "จำนวน", "ลิตรละ", "รวม"]);

  // เตรียมข้อมูล Fuel Details 1
  var fuelDetails1line = 0;
  jsonData.fuelDetails1.forEach(item => {
    excel_data.push([
      fuelDetails1line + 1,
      item.item_name,
      item.amount,
      item.unit_price,
      item.amount * item.unit_price,
    ]);
    fuelDetails1line++;
  });

  excel_data.push([]); // เว้นบรรทัด
  excel_data.push(["ค่าใช้จ่ายรวม ขาไป"]);
  excel_data.push(["ลำดับ", "สินค้า", "จำนวน"]);

  // เตรียมข้อมูล Expenses 1
  var expenses1line = 0;
  jsonData.expenses1.forEach(item => {
    excel_data.push([
      expenses1line + 1,
      item.item_name,
      item.amount,
    ]);
    expenses1line++;
  });

  // ทำซ้ำขั้นตอนเดียวกันสำหรับ Transport Items 2, Fuel Details 2, Expenses 2
  excel_data.push([]);
  excel_data.push(["รายการสินค้า ขากลับ"]);
  excel_data.push(["ลำดับ", "วันที่ขน", "ลูกค้า", "สินค้า", "เส้นทาง", "ชื่อร้านปลายทาง", "เลขที่ใบขน", "คิดตาม", "หน่วยละ", "เบี้ยเลี้ยง", "รายได้"]);


  var transportItem2line = 0;
  jsonData.transportItems2.forEach(item => {
    excel_data.push([
      transportItem2line + 1,
      item.send_date,
      item.customer,
      getItemShow(item.item_code),
      item.route,
      item.dest_name,
      item.shipment_no,
      getCalByName(item.calculation_type),
      item.unit_price,
      item.allowance,
      item.revenue,
    ]);
    transportItem2line++;
  });

  excel_data.push([]); // เว้นบรรทัด
  excel_data.push(["ค่าเชื้อเพลิง ขากลับ"]);
  excel_data.push(["ลำดับ", "สินค้า", "จำนวน", "ลิตรละ", "รวม"]);

  // เตรียมข้อมูล Fuel Details 1
  var fuelDetails2line = 0;
  jsonData.fuelDetails2.forEach(item => {
    excel_data.push([
      fuelDetails2line + 1,
      item.item_name,
      item.amount,
      item.unit_price,
      item.amount * item.unit_price,
    ]);
    fuelDetails2line++;
  });


  excel_data.push([]); // เว้นบรรทัด
  excel_data.push(["ค่าใช้จ่ายรวม ขากลับ"]);
  excel_data.push(["ลำดับ", "สินค้า", "จำนวน"]);

  // เตรียมข้อมูล Expenses 1
  var expenses2line = 0;
  jsonData.expenses2.forEach(item => {
    excel_data.push([
      expenses2line + 1,
      item.item_code,
      item.item_name,
      item.amount,
    ]);
    expenses2line++;
  });

  // สร้าง worksheet จากข้อมูล excel_data
  const worksheet = XLSX.utils.aoa_to_sheet(excel_data);

  // สร้าง workbook
  const workbook = XLSX.utils.book_new();

  // เพิ่ม worksheet ลงใน workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "รายการขนส่ง");

  // เขียนไฟล์ Excel
  XLSX.writeFile(workbook, `${doc_no}รายการขนส่ง.xlsx`);
}


</script>

<template>
  <AppLayout>
    <MainContentWarp>
      <Dialog v-model:visible="showDialogLoading" :style="{ width: '350px' }" :modal="true" :closable="false">
        <div class="text-center">
          <i class="pi pi-spin pi-spinner" style="font-size: 5rem"> </i>
          <h4>กำลังโหลดข้อมูล...</h4>
        </div>
      </Dialog>
      <div class="surface-ground px-2 py-2">
        <div class="surface-card shadow-2 border-round p-fluid mt-2">
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
                <Button label="Export Excel" icon="pi pi-file-excel" class="w-auto p-button-success ml-3" @click="exportExcel()" />

              </div>
            </div>
          </Panel>
          <div class="p-3">
            <DataTable :value="data_report" size="small" showGridlines resizableColumns columnResizeMode="fit">
              <Column field="doc_date" header="วันที่" />
              <Column field="car_code" header="ทะเบียนรถ" />
              <Column field="customer_1" header="ลูกค้า" />
              <Column field="item_1" header="สินค้าไป" />
              <Column field="unit_1" header="หน่วย" />
              <Column field="qty_1" header="จำนวน" class="text-right">
                <template #body="{ data, field }">
                  {{ Utils.formatNumber(data[field]) }}
                </template>
              </Column>
              <Column field="price_1" header="ราคา" class="text-right">
                <template #body="{ data, field }">
                  {{ Utils.formatNumber(data[field]) }}
                </template>
              </Column>
              <Column field="total_1" header="ค่าบรรทุกไป" class="text-right">
                <template #body="{ data, field }">
                  {{ Utils.formatNumber(data[field]) }}
                </template>
              </Column>
              <Column field="shop_1" header="สถานที่ลง" />
              <Column field="item_2" header="สินค้ากลับ" />
              <Column field="unit_2" header="หน่วย" />
              <Column field="qty_2" header="จำนวน" class="text-right">
                <template #body="{ data, field }">
                  {{ Utils.formatNumber(data[field]) }}
                </template>
              </Column>
              <Column field="price_2" header="ราคา" class="text-right">
                <template #body="{ data, field }">
                  {{ Utils.formatNumber(data[field]) }}
                </template>
              </Column>
              <Column field="total_2" header="ค่าบรรทุกกลับ" class="text-right">
                <template #body="{ data, field }">
                  {{ Utils.formatNumber(data[field]) }}
                </template>
              </Column>
              <Column field="shop_2" header="สถานที่ลง" />
              <Column field="presling" header="เบิกพีสลิง" class="text-right">
                <template #body="{ data, field }">
                  {{ Utils.formatNumber(data[field]) }}
                </template>
              </Column>
              <Column field="presling_price" header="ค่าขนส่งพรีสลิง" class="text-right">
                <template #body="{ data, field }">
                  {{ Utils.formatNumber(data[field]) }}
                </template>
              </Column>
              <Column field="total" header="รวมค่าบรรทุก" class="text-right">
                <template #body="{ data, field }">
                  {{ Utils.formatNumber(data[field]) }}
                </template>
              </Column>
              <Column field="start_mileage" header="เลขไมล์ขาไป" class="text-right">
                <template #body="{ data, field }">
                  {{ Utils.formatNumber(data[field]) }}
                </template>
              </Column>
              <Column field="end_mileage" header="เลขไมล์ขากลับ" class="text-right">
                <template #body="{ data, field }">
                  {{ Utils.formatNumber(data[field]) }}
                </template>
              </Column>
              <Column field="total_mileage" header="ระยะทาง" class="text-right">
                <template #body="{ data, field }">
                  {{ Utils.formatNumber(data[field]) }}
                </template>
              </Column>
              <Column field="total_fuel" header="เชื้อเพลิง" class="text-right">
                <template #body="{ data, field }">
                  {{ Utils.formatNumber(data[field]) }}
                </template>
              </Column>
              <Column field="total_fuel_price" header="จำนวนเงิน" class="text-right">
                <template #body="{ data, field }">
                  {{ Utils.formatNumber(data[field]) }}
                </template>
              </Column>
              <Column field="fuel_rate_price" header="เรทก๊าซ/กก." class="text-right">
                <template #body="{ data, field }">
                  {{ Utils.formatNumber(data[field]) }}
                </template>
              </Column>
              <template v-for="column in expensesColumns" :key="column">
                <Column :field="column" :header="column" class="text-right">
                  <template #body="{ data, field }">
                    {{ Utils.formatNumber(data[field]) }}
                  </template>
                </Column>
              </template>
              <Column field="total_expenses" header="ค่าใช้จ่ายรวม" class="text-right">
                <template #body="{ data, field }">
                  {{ Utils.formatNumber(data[field]) }}
                </template>
              </Column>
              <Column field="total_balance" header="ยอดคงเหลือ" class="text-right">
                <template #body="{ data, field }">
                  {{ Utils.formatNumber(data[field]) }}
                </template>
              </Column>
              <Column field="total_fuel_expenses" header="ค่าใช้จ่ายทั้งหมด" class="text-right">
                <template #body="{ data, field }">
                  {{ Utils.formatNumber(data[field]) }}
                </template>
              </Column>
            </DataTable>

          </div>
        </div>
        <Dialog v-model:visible="showConfirmDeleteDialog" :style="{ width: '450px' }" header="ยืนยันการทำงาน" :modal="true">
          <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span>ต้องการลบเอกสาร {{ deleteDocNo }} ใช่หรือไม่?</span>
          </div>
          <template #footer>
            <Button label="ยกเลิก" icon="pi pi-times" class="p-button-text" @click="showConfirmDeleteDialog = false" />
            <Button label="ยืนยัน" icon="pi pi-check" class="p-button-success" @click="deleteDoc" />
          </template>
        </Dialog>

        <Dialog v-model:visible="showConfirmApproveDialog" :style="{ width: '450px' }" header="ยืนยันการทำงาน" :modal="true">
          <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span>ต้องการอนุมัติเอกสาร {{ docNoConfirm }} ใช่หรือไม่?</span>

          </div>
          <template #footer>
            <Button label="ยกเลิก" icon="pi pi-times" class="p-button-text" @click="showConfirmApproveDialog = false" />
            <Button label="ยืนยัน" icon="pi pi-check" class="p-button-success" @click="approveDoc" />
          </template>
        </Dialog>
      </div>
    </MainContentWarp>
  </AppLayout>
</template>