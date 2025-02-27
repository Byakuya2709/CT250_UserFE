// src/plugins/toast.js
import { useToast } from "vue-toastification";

export default {
  install(app) {
    // Gắn toast vào Vue instance
    app.config.globalProperties.$toast = useToast();
  }
};
