<script setup>
import { defineComponent } from "@vue/runtime-core";
import { RouterLink } from "vue-router";
import { menus } from "@/api/menu";
import { useApp } from "@/stores/app.js";
import MasterdataService from "@/services/MasterdataService";
import { ref, onMounted } from "vue";
const storeApp = useApp();

const docUpdateCount = ref("0");
const userName = ref(localStorage._usercode);

onMounted(async () => { });

function checkPermission(data) {
  console.log(data);
  var show = false;
  console.log(localStorage._usercode.toUpperCase());
  if (localStorage._usercode.toUpperCase() != "SUPERADMIN") {
    if (data == "doc_list" && localStorage.doc_list == "1") {
      show = true;
    } else if (data == "docapprove_list" && localStorage.doc_approve_list == "1") {
      show = true;
    } else if (data == "dochistory_list" && localStorage.doc_history_list == "1") {
      show = true;
    }
  } else {
    show = true;
  }
  console.log(show);
  return show;
}
</script>
<template>
  <div class="bg-gray-900 h-screen flex-shrink-0 static left-0 top-0 z-1 border-gray-800 select-none">
    <div id="app-sidebar-11" :class="storeApp.showToggle == false ? 'hidden' : ''"
      class="surface-overlay h-screen flex-shrink-0 animation-duration-200 animation-ease-in-out static left-0 top-0 z-1 border-right-1 surface-border select-none"
      style="width: 280px">
      <div class="flex flex-column h-full bg-white">
        <div class="flex align-items-center px-5 bg-blue-500 text-white flex-shrink-0" style="height: 5vh; font-weight: 600; font-size: 22px">
          <span class="">Transporter</span>
        </div>
        <div class="overflow-y-auto">
          <ul class="list-none p-3 m-0">
            <li v-for="menu in menus" :key="menu.name">

              <router-link :to="menu.to" v-ripple
                class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                <i :class="menu.icon + ' mr-2'"></i>
                <span class="font-medium">{{ menu.title }}</span>
              </router-link>

            </li>
          </ul>
        </div>
        <div class="mt-auto">
          <hr class="mb-3 mx-3 border-top-1 border-none surface-border" />
          <RouterLink to="/logout" v-ripple
            class="flex align-items-center cursor-pointer m-4 text-900 border-2 border-transparent transition-duration-150 transition-colors p-ripple" style="border-radius: 12px">
            <i class="pi pi-lock mr-2"></i>
            <span class="font-medium">ออกจากระบบ</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "../assets/styles/app/layout.scss";
</style>
