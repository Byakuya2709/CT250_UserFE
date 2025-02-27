import { createRouter, createWebHistory } from "vue-router"; // Dùng createWebHistory
import HomeView from "../views/HomeView.vue";
import { jwtDecode } from "jwt-decode";

import { useCookies } from "vue3-cookies";

const { cookies } = useCookies(); // Lấy cookies API

const router = createRouter({
  history: createWebHistory(), // Cấu hình sử dụng history mode
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { requiresAuth: false },
    },

    {
      path: "/events",
      name: "ViewEnvents",
      component: () => import("../views/HomePage.vue"),
      meta: { requiresAuth: false },
    },
    {
      path: "/users/signup",
      name: "register",
      component: () => import("../views/Register.vue"),
      meta: { requiresAuth: false },
    },
    {
      path: "/users/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
      meta: { requiresAuth: false },
    },
    {
      path: "/users/reset-password",
      name: "ResetPassword",
      component: () => import("@/views/ForgotPassword.vue"),
      meta: { requiresAuth: false },
    },
    {
      path: "/users/create",
      name: "CreateCompany",
      component: () => import("../views/CreateUserProfile.vue"),
      meta: { requiresAuth: true, role: "USER" },
    },
    {
      path: "/users",
      name: "Users",
      component: () => import("../views/UserView.vue"),
      meta: { requiresAuth: true, role: "USER" },
    },

  ]
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    console.log("🔒 This route requires authentication");

    const token = cookies.get("token");
    console.log("📌 Token from cookies:", token);

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("🔑 Decoded Token:", decodedToken);

        const userRole = decodedToken.role;
        console.log("👤 User Role:", userRole);

        if (to.meta.role && to.meta.role !== userRole) {
          console.warn("⛔ Không đủ quyền, chuyển về home");
          return next({ name: "home" });
        }

        return next();
      } catch (error) {
        console.error("⚠️ Token không hợp lệ:", error);
        Cookies.remove("token"); // Xóa token lỗi
        return next({ name: "Login" });
      }
    } else {
      console.warn("🔴 Không tìm thấy token, chuyển về login");
      return next({ name: "Login" });
    }
  } else {
    console.log("✅ Route không yêu cầu xác thực, tiếp tục...");
    return next();
  }
});

export default router;
