<template>
  <div id="user" class="d-flex">
    <div id="logo-sidebar" class="sidebar">
      <div class="h-100 px-3 pt-4 pb-2 overflow-auto">
        <ul class="nav flex-column">
          <div
            class="user-info mt-4 d-flex align-items-center"
            style="flex-direction: column"
          >
            <img
              :src="
                this.userInfo.imageURL ||
                `https://res.cloudinary.com/dtza0pk4w/image/upload/v1734758873/default_avatar.jpg`
              "
              alt="User Avatar"
              class="avatar"
            />
            <div class="ms-3">
              <p class="user-name">{{ userInfo.userName }}</p>
              <p class="user-role" v-if="role">Vai trò: {{ role }}</p>
            </div>
          </div>
          <li class="nav-item mb-2" v-for="item in navItems" :key="item.name">
            <router-link :to="item.path" class="nav-link">
              <svg
                class="bi text-secondary"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 16"
                width="20"
                height="20"
              >
                <path :d="item.iconPath" />
              </svg>
              <span class="ms-2">{{ item.name }}</span>
            </router-link>
          </li>
        </ul>
        <!-- User info -->
      </div>
    </div>

    <div class="container" style="margin-left: 10px">
      <RouterView :userInfo="userInfo" />
    </div>
  </div>
</template>

<script>
import { api } from "../api/Api";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies(); // Lấy cookie API
export default {
  name: "User",
  data() {
    return {
      userInfo: {},
      email: "",
    };
  },
  computed: {
    user() {
      return this.$authStore.user;
    },
    role() {
      return this.$authStore.role;
    },
    navItems() {
      return [
        {
          name: "Thông Tin Tài Khoản",
          path: `/user/${this.userInfo.id}/profile`,
          iconPath:
            "M8 3.5a.5.5 0 0 1 .5.5v4h3.5a.5.5 0 0 1 0 1H8a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 .5-.5z M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1zM1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8z",
        },
        {
          name: "Vé Đã Mua",
          path: `/user/${this.userInfo.id}/tickets`,
          iconPath:
            "M2 3.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1.5h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1h1zm11-1V2a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v.5H2v10h12v-10h-1z M9 8H7v4h2V8zm1-3H6v2h4V5z",
        },
        {
          name: "Đánh giá của bạn",
          path: `/user/${this.userInfo.id}/feedbacks`,
          iconPath:
            "M2 3.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1.5h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1h1zm11-1V2a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v.5H2v10h12v-10h-1z M9 8H7v4h2V8zm1-3H6v2h4V5z",
        },
      ];
    },
  },
  methods: {
    async fetchUserInfo() {
      try {
        const res = await api.get(`/users/${this.user.id}`);
        console.log(res.data);
        this.userInfo = res.data.data;
        this.email = cookies.get("email");
        sessionStorage.setItem("email", this.userInfo.userName);
        this.$route.meta.userInfo = this.userInfo;
      } catch (error) {
        if (error.response?.status === 404) {
          this.$toast.error("Chưa có thông tin người dùng, hãy tạo mới!");
          this.$router.push({
            name: "CreateUser",
            query: { accountId: this.user.id },
          });
        } else {
          this.$toast.error(
            error.message || "Đã xảy ra lỗi khi tải thông tin người dùng"
          );
        }
      }
    },
  },
  created() {
    this.fetchUserInfo();
  },
};
</script>

<style scoped>
.sidebar {
  background-color: #f8f9fa; /* Màu nền sáng hơn */
  border-right: 1px solid #dee2e6;
  width: 250px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 12px;
  color: #495057;
  border-radius: 5px;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: #e9ecef; /* Màu nền khi hover */
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 50px; /* Kích thước lớn hơn */
  height: 50px; /* Chiều cao tương ứng */
  border-radius: 50%; /* Hình tròn */
  border: 2px solid #007bff; /* Viền cho ảnh đại diện */
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* Bóng đổ cho ảnh đại diện */
}

.user-name {
  margin-top: 10px;
  font-weight: bold;
  font-size: 1.1em; /* Kích thước chữ lớn hơn */
  margin-bottom: 0; /* Giảm khoảng cách bên dưới */
}

.user-email {
  font-size: 0.9em; /* Kích thước chữ cho email */
  color: #6c757d; /* Màu chữ nhạt hơn */
  margin-bottom: 0; /* Giảm khoảng cách bên dưới */
}

.user-role {
  text-align: center;
  font-size: 0.8em; /* Kích thước chữ cho vai trò */
  color: #6c757d; /* Màu chữ nhạt hơn */
}
</style>
