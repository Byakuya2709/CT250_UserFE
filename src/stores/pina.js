import { defineStore } from "pinia";
import { api } from "@/api/Api";
import { jwtDecode } from "jwt-decode";
import { useToast } from "vue-toastification";
import router from "@/router";


import { useCookies } from "vue3-cookies";

const { cookies } = useCookies(); // Lấy cookies API


const toast = useToast();

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: { id: null, email: "" },
    token: null,
    role: null,
  }),
  actions: {
    hydrate() {
      const token = cookies.get("token");
      if (token) {
        this.token = token;

        const decodedToken = jwtDecode(token);
        this.$patch({
          user: { id: decodedToken.userId, email: decodedToken.sub },
          role: decodedToken.role,
        });
      }
    },
    async login(user, rolelogin) {
      try {
        const response = await api.post(`/auth/${rolelogin}/login`, user);
        const res = response.data;
        this.token = res.data.token;
        const decodedToken = jwtDecode(this.token);

        // Cập nhật state
        this.$patch({
          user: { id: res.data.userId, email: decodedToken.sub },
          role: decodedToken.role,
          token: this.token,
        });

        // Lưu token vào cookie & API
        const expiresInSeconds = decodedToken.exp - Math.floor(Date.now() / 1000);
        cookies.set("token", this.token, expiresInSeconds + "s");

        cookies.set('email', decodedToken.sub, expiresInSeconds + "s")

        sessionStorage.setItem('UserEmail', decodedToken.sub);
        return { loginResponse: response, role: this.role };
      } catch (err) {
        cookies.remove("token");
        this.token = null;
        this.user = { id: null, email: "" };
        throw new Error(err.response?.data?.message || "Login failed");
      }
    },
    async logout() {
      this.$patch({
        token: null,
        user: { id: null, email: "" },
        role: null,
      });
      sessionStorage.removeItem('UserEmail');
      cookies.remove("token");
      cookies.remove("email");
      toast.info("Đang đăng xuất...");
      setTimeout(() => router.replace("/"), 1500);
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.role === 'ADMIN',
    userId: (state) => state.user.id,
    email: (state) => state.user.email,
  },
});
