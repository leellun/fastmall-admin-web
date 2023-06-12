import { defineStore } from "pinia";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./mutation-types";
import storage from "@/utils/Storage";
import { _auth_login } from "@/api/system/userApi";
import secret from "@/utils/secret";
export const useUserStore = defineStore("user", {
  state: () => {
    return {
      set token(value: string) {
        storage.set(ACCESS_TOKEN, value);
      },
      get token(): string {
        const value = storage.get(ACCESS_TOKEN);
        return value ? value : "";
      },
      set refreshToken(value: string) {
        storage.set(REFRESH_TOKEN, value);
      },
      get refreshToken(): string {
        const value = storage.get(REFRESH_TOKEN);
        return value ? value : "";
      },
      showLogin: false,
    };
  },
  getters: {
    isLogin: (state) => {
      return state.token && state.token != "";
    },
  },
  actions: {
    async login(username: string, password: string) {
      try {
        let res = await _auth_login(username, secret.encrypt(password));
        this.setToken(res.data, res.data);
        return true;
      } catch (e) {
        return false;
      }
    },
    setToken(accessToken: string, refreshToken: string) {
      this.token = accessToken;
      this.refreshToken = refreshToken;
    },
    loginOut() {
      storage.remove(ACCESS_TOKEN)
      storage.remove(REFRESH_TOKEN)
      return new Promise((resolve, rej) => {
        resolve("");
      });
    },
  },
});
