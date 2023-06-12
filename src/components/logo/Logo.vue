<template>
  <div class="logo-container f_r_c_c h100">
    <img  style="width: 30px; height: 30px" src="@/assets/logo.svg" />
    <span v-if="!isCollapse">{{ title }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { useSettingStore } from "@/store/setting"
const t = import.meta.env.VITE_APP_TITLE;
const title = ref();
const settingStore = useSettingStore();

const isCollapse = computed(() => settingStore.getIsCollapse);
watch(
  isCollapse,
  (newVal, oldVal) => {
    if (!newVal) {
        title.value = t;
      } else {
        title.value = "sdfsdf";
      }
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss" scoped>
.logo-container {
  color: #fff;
}
</style>
