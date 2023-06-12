import { TRouter } from "@/router/types";
import { defineStore } from "pinia";
import { _getCatalogues, _getUserPermissions } from "@/api/system/menuApi";
import defaultSettings from "@/config/defaultSettings";
interface PermissionState {
  menus: Array<TRouter>;
  permissions: Array<string>;
  isRouterMenuCheck: boolean;
  prevRouterCheckTime: number;
}
export const usePermissionStore = defineStore("permission", {
  state: (): PermissionState => {
    return {
      menus: [], //菜单那
      permissions: [],
      isRouterMenuCheck: false,
      prevRouterCheckTime: 0,
    };
  },
  getters: {
    getMenus: (state) => {
      return state.menus;
    },
  },
  actions: {
    resetRouterMenu() {
      this.isRouterMenuCheck = false;
      this.prevRouterCheckTime = 0;
      this.menus = [];
    },
    isHasRouterMenu() {
      let check = this.isRouterMenuCheck;
      let prevTime = this.prevRouterCheckTime;
      this.isRouterMenuCheck = true;
      this.prevRouterCheckTime = Date.now();

      return check || (prevTime !== 0 && Date.now() - prevTime > 5000);
    },
    setMenus(menus: Array<TRouter>) {
      this.isRouterMenuCheck = true;
      this.menus = menus;
    },
    async getCatalogues() {
      // return defaultSettings.menus;
      let res = await _getCatalogues();
      return res.data;
    },
    async getUserPermissions() {
      try {
        let res = await _getUserPermissions();
        this.permissions = res.data;
      } catch (e) {}
    },
  },
});
