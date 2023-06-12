<template>
  <div class="header-container f_r_s_b h100">
    <div class="f_r_s_c">
      <el-icon class="cursor_pointer">
        <expand v-if="isCollapse" @click="collapseHandle(false)" />
        <fold v-else @click="collapseHandle(true)" />
      </el-icon>
      <el-icon class="mL10 cursor_pointer mR10" @click="refreshHandle()">
        <RefreshRight />
      </el-icon>
      <BreadcrumnVue />
    </div>
    <el-dropdown @command="commandHandle">
      <span class="f_r_c_c">
        <el-avatar class="mR5" :size="30"
          src="https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar" />
        admin
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
          <el-dropdown-item command="out">注销</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <PasswordModal v-model:visible="passwordVisible" v-if="passwordVisible" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useSettingStore } from "@/store/setting"
import { Fold, Expand, RefreshRight } from "@element-plus/icons-vue";
import BreadcrumnVue from "../breadcrumb/Breadcrumb.vue";
import PasswordModal from "@/pages/system/user/drawer/PasswordModal.vue";
import { useUserStore } from '@/store/user'
// 获取路由实例
const router = useRouter();
const userStore = useUserStore()
// settingStore
const settingStore = useSettingStore();
const passwordVisible = ref<boolean>(false)
// 获取getter
const isCollapse = computed(() => settingStore.getIsCollapse);
// 设置isCollapse值
const collapseHandle = (type: boolean) => {
  settingStore.setIsCollapse(type);
};
// 刷新当前页面
const refreshHandle = () => {
  router.replace("/redirect?fullPath=" + router.currentRoute.value.fullPath);
};
// 下拉菜单
const commandHandle = async (command: string) => {
  // 注销
  if (command == "out") {
    // router.push("/login");
    await userStore.loginOut()
    window.location.reload();
  } else if (command === 'changePassword') {
    passwordVisible.value = true
  }
};
</script>

<style lang="scss" scoped>
.header-container {}
</style>
