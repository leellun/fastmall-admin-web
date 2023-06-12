import { createApp } from "vue";
import { createPinia } from "pinia";
import PiniaPluginPersist from "pinia-plugin-persist";
import App from "./App.vue";
import router from "./router/index";
import "./assets/main.scss";
import "virtual:svg-icons-register";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "element-plus/dist/index.css";
import ElementPlus from "element-plus";
import { usePermissionStore } from "@/store/permission";
import SvgIcon from "@/components/SvgIcon/index.vue";

//引入echarts
import * as echarts from "echarts";
//引入vue-echarts组件
import VueECharts from "vue-echarts";

// 实例化vue
const app = createApp(App);

app.component("svg-icon", SvgIcon);

//将VueEcharts注册为全局组件
app.component("v-chart", VueECharts);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(ElementPlus, { size: "small" });

// 实例化store
const pinia = createPinia();
// 添加本地持久化存储插件
pinia.use(PiniaPluginPersist);
app.use(pinia);
app.use(router);

app.mount("#app");

//按钮权限
app.directive("permission", {
  mounted(el, binding) {
    let type = binding.value || "";
    let status = false;
    const permissionStore = usePermissionStore();
    ///这里表示用户所拥有的所有权限
    let permissionBtns = permissionStore.permissions;

    permissionBtns.forEach((item: any) => {
      let sta =
        type === item ||
        (type.constructor === Array && type.indexOf(item) != -1);
      if (sta) {
        status = true;
      }
    });
    if (!status) {
      el.style.display = "none";
    }
  },
});
