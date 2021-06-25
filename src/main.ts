import 'devextreme/dist/css/dx.common.css';
import '@/themes/generated/theme.base.css';
import '@/themes/generated/theme.additional.css';
import { createApp } from "vue";
import router from "@/router";
import store from '@/store'
import App from "./App.vue";
import appInfo from "./app-info";
// import dev from '@/dev'
// import '@/utils/cookie-parse.js'  //jwt 待实现
if (process.env.NODE_ENV === 'development') {
  const { mockXHR } = require('../mock')
  mockXHR()
}
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}
const app = createApp(App);
app.config.globalProperties.$appInfo = appInfo;
app.use(router);
app.use(store)
// app.use(dev)
app.mount('#app');
