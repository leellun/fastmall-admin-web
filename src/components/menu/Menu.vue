<template>
  <el-menu :default-active="defaltActive" class="el-menu-vertical" :collapse="isCollapse" unique-opened router
    @select="handleSelect" @open="handleOpen" @close="handleClose" background-color="#191a23"
    text-color="hsla(0,0%,100%,.7)" active-text-color="#fff">
    <menu-item v-for="item in menuList" :key="item.name" :item="item"></menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { usePermissionStore } from '@/store/permission'
import { useSettingStore } from '@/store/setting'
import MenuItem from "./MenuItem.vue";
const permissionStore = usePermissionStore()
// 状态管理
const settingStore = useSettingStore();
// 菜单展开/隐藏
const isCollapse = computed(() => settingStore.isCollapse);
// 菜单默认选中项
// const defaltActive = ref<string>();
// 获取菜单数据
const menuList = computed(() => permissionStore.getMenus);
const router = useRouter()
// defaltActive.value = router.currentRoute.value.path
const handleSelect = (
  index: string,
  indexPath: string[],
  item: any,
  routeResult: boolean
) => {
  // defaltActive.value = index
};
const defaltActive = computed(()=>{
  return router.currentRoute.value.path
})
const handleOpen = (key: string, keyPath: string[]) => {

};
const handleClose = (key: string, keyPath: string[]) => {

};
</script>

<style lang="scss" scoped>
.el-menu-vertical {
  border-top: solid 0.2px var(--el-menu-border-color);
  border-right: none;
  height: calc(100% - 60px);

  :deep(.el-menu-item.is-active) {
    background-color: var(--color-menu-active-bg);
  }
  :deep(.el-menu-item:hover) {
    background-color: var(--color-menu-active-bg);
  }
}
</style>
