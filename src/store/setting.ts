import { defineStore } from "pinia";
import storage from "@/utils/Storage";
import { SITE_SETTINGS } from "@/store/mutation-types";

export const useSettingStore = defineStore("setting", {
  state: () => {
    return {
      device: "desktop",
      isCollapse: false, // 菜单是否折叠
      isShowTopNav: true, //是否显示顶部导航
      isShowTags: true, //是否显示 选项卡
      isShowLogo: true, //是否显示logo
      isShowMenu: true, //是否显示菜单
    };
  },
  getters: {
    getIsCollapse: (state) => state.isCollapse
  },
  actions: {
    setIsCollapse(value: boolean) {
      this.isCollapse = value
    },
    setSetting(setting: any) {
      Object.assign(this.$state,setting)
      storage.setObj(SITE_SETTINGS, setting);
    },
  },
});
