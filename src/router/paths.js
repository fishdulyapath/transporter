import Home from "@/pages/Home.vue";
import HomeView from "../views/HomeView.vue";

export default [
  {
    path: "/home",
    name: "home",
    meta: {
      auth: true,
    },
    component: Home,
  },
  {
    path: "/",
    name: "dashboard",
    meta: {
      auth: true,
    },
    component: () => import("../pages/Dashboard.vue"),
  },
  {
    path: "/pricelist",
    name: "price_list",
    meta: {
      auth: true,
    },
    component: () => import("../pages/PriceList.vue"),
  },
  {
    path: "/salepricelist",
    name: "sale_price_list",
    meta: {
      auth: true,
    },
    component: () => import("../pages/saleprice/SalePriceList.vue"),
  },
  {
    path: "/salepriceimportlist",
    name: "sale_price_import_list",
    meta: {
      auth: true,
    },
    component: () => import("../pages/saleprice/SalePriceImpList.vue"),
  },
  {
    path: "/salepriceimporthistory",
    name: "sale_price_import_history",
    meta: {
      auth: true,
    },
    component: () => import("../pages/saleprice/SalePriceImpHistory.vue"),
  },
  {
    path: "/salepriceimportdetail/:id",
    name: "sale_price_import_detail",
    meta: {
      auth: true,
    },
    component: () => import("../pages/saleprice/SalePriceImpdetail.vue"),
  },
  {
    path: "/salepriceimport",
    name: "sale_price_import",
    meta: {
      auth: true,
    },
    component: () => import("../pages/saleprice/SalePriceImp.vue"),
  },

  {
    path: "/salestdlist",
    name: "sale_std_list",
    meta: {
      auth: true,
    },
    component: () => import("../pages/salestandard/SaleStdList.vue"),
  },
  {
    path: "/salestdimportlist",
    name: "sale_std_import_list",
    meta: {
      auth: true,
    },
    component: () => import("../pages/salestandard/SaleStdImpList.vue"),
  },
  {
    path: "/salestdimporthistory",
    name: "sale_std_import_history",
    meta: {
      auth: true,
    },
    component: () => import("../pages/salestandard/SaleStdImpHistory.vue"),
  },
  {
    path: "/salestdimportdetail/:id",
    name: "sale_std_import_detail",
    meta: {
      auth: true,
    },
    component: () => import("../pages/salestandard/SaleStdImpdetail.vue"),
  },
  {
    path: "/salestdimport",
    name: "sale_std_import",
    meta: {
      auth: true,
    },
    component: () => import("../pages/salestandard/SaleStdImp.vue"),
  },

  {
    path: "/purchaselist",
    name: "purchase_list",
    meta: {
      auth: true,
    },
    component: () => import("../pages/purchase/PurchaseList.vue"),
  },
  {
    path: "/purchasedoclist",
    name: "purchase_doc_list",
    meta: {
      auth: true,
    },
    component: () => import("../pages/purchase/PurchaseDocList.vue"),
  },
  {
    path: "/purchasehistory",
    name: "purchase_history",
    meta: {
      auth: true,
    },
    component: () => import("../pages/purchase/PurchaseHistory.vue"),
  },
  {
    path: "/purchasedetail/:id",
    name: "purchase_detail",
    meta: {
      auth: true,
    },
    component: () => import("../pages/purchase/PurchaseDetail.vue"),
  },
  {
    path: "/purchaseimport",
    name: "purchase_import",
    meta: {
      auth: true,
    },
    component: () => import("../pages/purchase/PurchaseImp.vue"),
  },

  {
    path: "/docdetail/:id",
    name: "doc_detail",
    meta: {
      auth: true,
    },
    component: () => import("../pages/DocDetail.vue"),
  },
  {
    path: "/subdetail/:id",
    name: "sub_detail",
    meta: {
      auth: true,
    },
    component: () => import("../pages/DocSubDetail.vue"),
  },
  {
    path: "/docapprovelist",
    name: "docapprove_list",
    meta: {
      auth: true,
    },
    component: () => import("../pages/DocApproveList.vue"),
  },
  {
    path: "/docapprovedetail/:id",
    name: "doc_approve_detail",
    meta: {
      auth: true,
    },
    component: () => import("../pages/DocApproveDetail.vue"),
  },
  {
    path: "/docstockdetail/:id",
    name: "doc_stock_detail",
    meta: {
      auth: true,
    },
    component: () => import("../pages/DocStockDetail.vue"),
  },
  {
    path: "/permissionlist",
    name: "permission_list",
    meta: {
      auth: true,
    },
    component: () => import("../pages/PermissionList.vue"),
  },
  {
    path: "/dochistorylist",
    name: "dochistory_list",
    meta: {
      auth: true,
    },
    component: () => import("../pages/DocHistoryList.vue"),
  },
  {
    path: "/dochistorydetail/:id",
    name: "dochistory_detail",
    meta: {
      auth: true,
    },
    component: () => import("../pages/DocHistoryDetail.vue"),
  },
  {
    path: "/docapprovedetail/:id",
    name: "doc_approve_detail",
    meta: {
      auth: true,
    },
    component: () => import("../pages/DocApproveDetail.vue"),
  },

  {
    path: "/stock_print/:id",
    name: "stock_print",
    meta: {
      auth: false,
    },
    component: () => import("../pages/stock_print.vue"),
  },
  {
    path: "/barcode/print/:id",
    name: "barcode_print",
    meta: {
      auth: false,
    },
    component: () => import("../pages/Barcodeprint.vue"),
  },
  {
    path: "/login",
    name: "login",
    meta: {
      forwordauth: true,
      guest: true,
    },
    component: () => import("../pages/Login.vue"),
  },
  {
    path: "/me",
    name: "profile",
    meta: {
      auth: true,
    },
    component: () => import("../pages/Profile.vue"),
  },
  {
    path: "/logout",
    name: "logout",
    component: () => import("../pages/Logout.vue"),
  },

  {
    path: "/health-check",
    name: "health-check",
    component: () => import("../pages/HealthCheck.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: () => import("../pages/NotFound.vue"),
  },
];
