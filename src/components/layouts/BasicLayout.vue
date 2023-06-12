<template>
  <el-container class="w100 h100">
    <el-aside class="aside-content" :style="{ width: isCollapse ? '65px' : '210px','background-color':'#191a23' }">
      <el-header v-if="isShowLogo">
        <logo-vue />
      </el-header>
      <menu-vue v-if="isShowMenu" />
    </el-aside>
    <el-container class="main-container" direction="vertical">
      <el-header v-if="isShowTopNav">
        <header-vue />
      </el-header>
      <TagsViewVue v-if="isShowTags" />
      <el-main>
        <RouterView v-slot="{ Component, route }">
          <transition name="fade" mode="out-in">
            <div class="w100 h100">
              <template v-if="route.meta.keepAlive">
                <transition :name="'fade'" mode="out-in">
                  <keep-alive>
                    <suspense>
                      <template #default>
                        <component :is="Component" :key="refreshRouterViewKey" />
                      </template>
                      <template #fallback>
                        <LoadingVue />
                      </template>
                    </suspense>
                  </keep-alive>
                </transition>
              </template>
              <template v-else>
                <suspense>
                  <template #default>

                    <component :is="Component" :key="refreshRouterViewKey" />

                  </template>
                  <template #fallback>
                    <LoadingVue />
                  </template>
                </suspense>
              </template>
            </div>
          </transition>
        </RouterView>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { computed, watch, ref, nextTick } from "vue";
import { RouterView } from "vue-router";
import MenuVue from "../menu/Menu.vue";
import HeaderVue from "../head/Header.vue";
import LogoVue from "../logo/Logo.vue";
import TagsViewVue from "../tags/TagsView.vue";
import LoadingVue from "../loading/Loading.vue";
import { useSettingStore } from "@/store/setting";
import events from '@/utils/eventBus'
import { useRoute } from 'vue-router';

const settingStore = useSettingStore();
const isShowTopNav = computed(() => settingStore.isShowTopNav);
const isShowTags = computed(() => settingStore.isShowTags);
const isShowLogo = computed(() => settingStore.isShowLogo);
const isShowMenu = computed(() => settingStore.isShowMenu);
const isCollapse = computed(() => settingStore.isCollapse);
const routeKeyMap = ref<Map<string, string>>(new Map<string, string>())
const routeDeleteKeyMap = ref<Map<string, string>>(new Map<string, string>())
const keepAliveNameList = ref<Array<any>>([]);
const route = useRoute();
routeKeyMap.value.set(route.fullPath as string, Date.now() + "")
// 监听路由变化，防止 tagsView 多标签时，切换动画消失
watch(
  () => route.fullPath,
  () => {
    if (routeKeyMap.value.get(route.fullPath as string) == undefined || routeDeleteKeyMap.value.get(route.fullPath as string) != undefined) {
      routeKeyMap.value.set(route.fullPath as string, Date.now() + "")
      routeDeleteKeyMap.value.delete(route.fullPath as string)
    }
  }
);
const refreshRouterViewKey = computed(() => {
  return routeKeyMap.value.get(route.fullPath as string)
})

events.once('onTagsViewRefreshRouterView', () => {
  routeKeyMap.value.set(route.fullPath as string, Date.now() + "")
});
events.once('onTagsViewUpdateRouterView', (fullPaths: Array<string>) => {
  for (let fullPath of fullPaths) {
    routeDeleteKeyMap.value.set(fullPath, Date.now() + "")
  }
});
</script>

<style lang="scss">
/* 页面切换动画
------------------------------- */
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 0.3s ease;
}

/* fade 面包屑过渡动画
------------------------------- */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}

.fade-enter-from,
.fade-leave-active {
  opacity: 0;
  transform: translateX(20px);
}

.fade-leave-active {
  position: absolute;
}
</style>
