<script setup lang="ts">
import {onBeforeUnmount} from 'vue'
import { RouterView } from 'vue-router'
import { useSettingStore} from '@/store/setting'
// 监听窗口大小变化，折叠侧边栏
const listeningWindow = () => {
	const screenWidth = document.body.clientWidth;
  const settingStore = useSettingStore();
  const isCollapse = settingStore.getIsCollapse;
	if (!isCollapse && screenWidth < 1200) settingStore.setSetting({isCollapse: true });
	if (isCollapse && screenWidth > 1200) settingStore.setSetting({isCollapse: false });
};
window.addEventListener("resize", listeningWindow);
onBeforeUnmount(() => {
	window.removeEventListener("resize", listeningWindow);
});
</script>

<template>
  <RouterView />
</template>
