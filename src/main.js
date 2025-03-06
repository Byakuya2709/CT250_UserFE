import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
const app = createApp(App);
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
library.add(fas, far, fab);
dom.watch();
import storePlugin from './plugins/store';
import { jwtDecode } from 'jwt-decode';  // Sử dụng thư viện jwt-decode

import VTooltip from "v-tooltip";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies(); // Lấy cookie API

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from "chart.js";

// Đăng ký tất cả thành phần cần thiết
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
import './index.css'

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import ToastPlugin from '@/plugins/toast';

const token = cookies.get("token")
if (token) {
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000); // Thời gian hiện tại (tính bằng giây)

    // 🔥 Kiểm tra token có hết hạn không
    if (decodedToken.exp < currentTime) {
      cookies.remove("token"); // Xóa token khỏi cookie

      router.push("/"); // Chuyển hướng về trang đăng nhập
    }
  } catch (error) {
    console.error("Lỗi giải mã token:", error);
    cookies.remove("token"); // Xóa cookie nếu lỗi
    cookies.remove("email");
    router.push("/company/login"); // Chuyển hướng về login nếu token lỗi
  }
} else {
  router.push("/"); // Nếu không có token, điều hướng về login
}

app.use(VTooltip);
app.use(Toast, {
  position: "top-right",
  timeout: 4000,
  closeOnClick: true,
});
import VueKonva from 'vue-konva';
app.use(VueKonva)
app.use(ToastPlugin);
app.use(createPinia());
app.use(router);
app.use(storePlugin);
app.component("font-awesome-icon", FontAwesomeIcon);
app.mount('#app');
