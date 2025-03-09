import { createRouter, createWebHistory } from "vue-router"; // Dùng createWebHistory
import HomeView from "../views/HomeView.vue";
import { jwtDecode } from "jwt-decode";

import { useCookies } from "vue3-cookies";

const { cookies } = useCookies(); // Lấy cookies API

const router = createRouter({
  history: createWebHistory(), // Cấu hình sử dụng history mode
  routes: [
    // {
    //   path: "/",
    //   name: "home",
    //   component: HomeView,
    //   meta: { requiresAuth: false },
    // },

    {
      path: "/",
      name: "home",
      component: () => import("@/views/HomeView.vue"),
      meta: { requiresAuth: false },
    },

    {
      path: "/events",
      name: "ViewEvents",
      component: () => import("../views/HomePage.vue"),
      meta: { requiresAuth: false },
    },
    {
      path: "/events/:eventId",
      name: "EventDetail",
      component: () => import("../views/EventView/EventDetail.vue"),
      meta: { requiresAuth: false },
      children: [
        {
          path: "booking",
          name: "EventBooking",
          component: () => import("../views/EventView/EventBooking.vue"),
          meta: { modal: true, requiresAuth: true, role: "USER" }, // Đánh dấu route này là modal
        },
        {
          path: "booking/all-day",
          name: "EventBookingAllDay",
          component: () => import("../views/EventView/EventBookingAllDay.vue"),
          meta: { modal: true, requiresAuth: true, role: "USER" },
        },
      ],
    },

    {
      path: "/events/:eventId/blogs/:blogId",
      name: "BlogDetail",
      component: () => import("../views/EventView/BlogDetail.vue"),
      meta: { requiresAuth: false }
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
      name: "CreateUser",
      component: () => import("../views/CreateUserProfile.vue"),
      meta: { requiresAuth: true, role: "USER" },
    },
    {
      path: "/user",
      name: "Users",
      component: () => import("../views/UserView.vue"),
      meta: { requiresAuth: true, role: "USER", userInfo: null },

      children: [
        {
          path: ":userId/profile",
          name: "UserProfile",
          component: () => import("../views/UserView/UserProfile.vue"),
          props: (route) => ({ userInfo: route.meta.userInfo }),
        },
        {
          path: ":userId/tickets",
          name: "PurchasedTickets",
          component: () => import("../views/UserView/BoughtTicket.vue"),
        },
      ],
    },
  ],
});

import { useToast } from "vue-toastification";
const toast = useToast();
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
          console.error("⛔ Không đủ quyền, chuyển về home");
          toast.warning("Bạn Không đủ quyền để sử dụng tính năng này.");
          return next({ name: "home" });
        }

        return next();
      } catch (error) {
        console.error("⚠️ Token không hợp lệ:", error);
        cookies.remove("token"); // Xóa token lỗi
        toast.info("Phiên đăng nhập của bạn kết thúc.");
        return next({ name: "Login" });
      }
    } else {
      console.warn("🔴 Không tìm thấy token, chuyển về login");
      toast.info("Bạn phải đăng nhập để sử dụng đầy đủ tính năng trang web.");
      return next({ name: "Login" });
    }
  } else {
    console.log("✅ Route không yêu cầu xác thực, tiếp tục...");
    return next();
  }
});

export default router;
