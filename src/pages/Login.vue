<script setup>
import BlankLayout from "@/components/layout/BlankLayout.vue";
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { useAuthen } from "@/stores/authen.js";
import AuthenService from "@/services/AuthenService";
import { useApp } from "@/stores/app.js";
import MasterdataService from "@/services/MasterdataService";
const storeApp = useApp();
const store = useAuthen();
const username = ref("");
const password = ref("");
const provider = ref("");
const dbname = ref("");
const listShop = ref(undefined);
const checked = ref(false);
const showShopList = ref(false);
const loading = ref(false);
const router = useRouter();
const loginFailed = ref(false);

async function handleLogin() {
  //console.log(username, password);

  if (provider.value != "" && dbname.value != "" && username.value != "" && password.value != "") {
    loading.value = true;

    localStorage.removeItem("_token");
    await store.login(provider.value, dbname.value, username.value, password.value);

    //console.log("Can Login ", store.loginSuccess);

    if (store.loginSuccess) {
      // select shop
      localStorage.provider = provider.value;
      localStorage.dbname = dbname.value;
      setTimeout(async () => {
          router.push({ name: "dashboard" });
        }, 1000);
    } else {
      loginFailed.value = true;
    }
    loading.value = false;
  } else {
    loginFailed.value = true;
  }
}

function getErpUserPermission() {
  MasterdataService.getErpUserPermissionLogin(username.value)
    .then((res) => {
      console.log(res);
      if (res.success) {
        localStorage.doc_list = res.data[0].doc_list;
        localStorage.doc_approve_list = res.data[0].doc_approve_list;
        localStorage.doc_history_list = res.data[0].doc_history_list;

        setTimeout(async () => {
          router.push({ name: "dashboard" });
        }, 1000);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

// function getErpUserPermission() {
//   MasterdataService.getErpUserPermission(username.value)
//     .then((res) => {
//       console.log(res);
//       if (res.success) {
//         localStorage.is_update = res.data[0].is_update;
//         localStorage.is_approve = res.data[0].is_approve;
//         localStorage.is_create = res.data[0].is_create;
//         localStorage.is_history = res.data[0].is_history;
//         localStorage.is_permission = res.data[0].is_permission;
//         localStorage.is_print = res.data[0].is_print;
//         localStorage.is_report = res.data[0].is_report;

//       }
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }

// function selectShop(item) {
//   localStorage.shopid = item.shopid;
//   localStorage.shop_name = item.name;
//   localStorage.shop_role = item.role;
//   AuthenService.selectShop().then((res) => {
//     if (res.success) {
//       // this.showSnackBar("เข้าสู่ระบบสำเร็จ", "success");

//       setTimeout(async () => {
//         router.push({ name: "dashboard" });
//       }, 1000);
//     } else {
//       // this.showSnackBar(
//       //   " ไม่สามารถเชื่อมต่อได้ เนื่องจากฐานข้อมูลมีปัญหา",
//       //   "error"
//       // );
//     }
//   });
// }

function goHome() {
  router.push({
    name: "home",
  });
}

onMounted(() => {
  storeApp.setPageTitle("เข้าสู่ระบบ");
});
</script>

<template>
  <div class="surface-ground px-4 py-8 md:px-6 lg:px-8 flex align-items-center justify-content-center">
    <div class="surface-card p-4 shadow-2 border-round w-full lg:w-6" v-if="!showShopList">
      <div class="text-center mb-5 mt-5">
        <img src="@/assets/logo.png" alt="Image" height="150" class="mb-3" />

        <!-- <span class="text-600 font-medium line-height-3">Don't have an account?</span>
        <a class="font-medium no-underline ml-2 text-blue-500 cursor-pointer"
          >Create today!</a
        > -->
      </div>

      <div>
        <label for="provider" class="block text-900 font-medium mb-2">Provider</label>
        <InputText id="provider" type="text" class="w-full mb-3" v-model="provider" />

        <label for="DBName" class="block text-900 font-medium mb-2">Database</label>
        <InputText id="DBName" type="text" class="w-full mb-3" v-model="dbname" />

        <label for="email1" class="block text-900 font-medium mb-2">Username</label>
        <InputText id="email1" type="text" class="w-full mb-3" v-model="username" />

        <label class="block text-900 font-medium mb-2">Password</label>
        <InputText type="password" class="w-full mb-3" v-model="password" />

        <div style="height: 20px">
          <span v-if="loginFailed" style="color: #ff0000" class="text-xs">*Invalid Provider or Username or Password.</span>
        </div>
        <Button label="Sign In" icon="pi pi-lock" class="w-full" v-if="loading == false" @click="handleLogin()"></Button>

        <Button icon="pi pi-spin pi-spinner" v-if="loading == true" class="w-full"></Button>
      </div>
    </div>

    <div class="surface-card p-4 shadow-2 border-round w-full lg:w-6" v-if="showShopList">
      <div class="text-3xl font-medium text-900 mb-3">เลือกร้านค้า</div>
      <div class="">
        <ul class="list-none p-0 m-0">
          <li
            style="border-radius: 10px; border-color: rgba(234, 179, 10, 0.5)"
            class="pb-3 cursor-pointer p-3 border-1"
            v-for="shop in listShop"
            :key="shop"
            @click="selectShop(shop)"
          >
            {{ shop.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
