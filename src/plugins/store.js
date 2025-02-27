
import { useAuthStore } from '../stores/pina';

export default {
  install(app) {
    app.config.globalProperties.$authStore = useAuthStore();
  }
};