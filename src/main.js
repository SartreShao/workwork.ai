import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import AV from "leancloud-storage";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

AV.init({
  appId: "ycWUAGQsXBV4Ij6HHTCkvyob-MdYXbMMI",
  appKey: "1gJusZZMpXrRE03gzGcqKjk5",
  serverURL: "https://api.workwork.ai"
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ElementPlus);

app.mount("#app");
