<template>
  <header id="header" class="text-white">
    <nav class="container mx-auto flex items-center justify-between py-4">
      <!-- Logo -->
      <router-link
        class="text-xl font-bold"
        to="/"
        style="color: black; font-size: 35px"
      >
        USER
      </router-link>
      <!-- Search Bar -->
      <div class="relative w-1/3">
        <input
          type="text"
          name="textSearch"
          placeholder="Search"
          class="w-full p-2 pl-4 pr-10 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <i
          class="fa-solid fa-magnifying-glass absolute right-3 top-2.5 text-gray-400"
        ></i>
      </div>
      <!-- Thanh menu hiển thị trên PC -->
      <ul class="hidden md:flex items-center space-x-4">
        <li v-if="isAuthenticated">
          <router-link class="hover:text-blue-400" to="/user">
            Trang Cá Nhân
          </router-link>
        </li>
        <li v-if="!isAuthenticated">
          <router-link class="hover:text-blue-400" to="/users/signup"
            >Tạo tài khoản</router-link
          >
        </li>
        <li v-if="!isAuthenticated">
          <router-link class="hover:text-blue-400" to="/users/login"
            >Đăng nhập</router-link
          >
        </li>
        <!-- <li>
          <router-link class="hover:text-blue-400" to="/about"
            >About</router-link
          >
        </li> -->
        <li v-if="isAuthenticated">
          <a class="hover:text-red-400 cursor-pointer" @click.prevent="logout"
            >Đăng xuất</a
          >
        </li>
      </ul>

      <!-- Nút menu cho Mobile -->
      <button class="md:hidden text-white text-2xl" @click="toggleMenu">
        <i :class="isMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'"></i>
      </button>
    </nav>

    <!-- Sidebar ẩn bên phải (chỉ hiển thị trên mobile) -->
    <transition name="slide">
      <div
        v-if="isMenuOpen"
        class="fixed top-0 right-0 w-2/3 h-full bg-white text-black p-6 shadow-lg z-50 md:hidden"
      >
        <button class="absolute top-4 right-4 text-2xl" @click="toggleMenu">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <ul class="space-y-4 mt-10">
          <li v-if="isAuthenticated">
            <router-link
              class="hover:text-blue-400"
              :to="isAdmin ? '/admin' : '/company'"
            >
              {{ isAdmin ? "ADMIN Dashboard" : "Dashboard" }}
            </router-link>
          </li>
          <li v-if="!isAuthenticated">
            <router-link class="hover:text-blue-400" to="/company/signup"
              >Tạo tài khoản</router-link
            >
          </li>
          <li v-if="!isAuthenticated">
            <router-link class="hover:text-blue-400" to="/company/login"
              >Đăng nhập</router-link
            >
          </li>
          <li v-if="!isAuthenticated">
            <router-link class="hover:text-blue-400" to="/admin/login"
              >Đăng nhập ADMIN</router-link
            >
          </li>
          <li>
            <router-link class="hover:text-blue-400" to="/about"
              >About</router-link
            >
          </li>
          <li v-if="isAuthenticated">
            <a class="hover:text-red-400 cursor-pointer" @click.prevent="logout"
              >Đăng xuất</a
            >
          </li>
        </ul>
        <ul class="mt-3">
          <input
            type="text"
            name="textSearch"
            placeholder="Search"
            class="w-full p-2 pl-4 pr-10 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <i
            class="fa-solid fa-magnifying-glass absolute right-3 top-2.5 text-gray-400"
          ></i>
        </ul>
      </div>
    </transition>
  </header>
</template>

<script>
import { useAuthStore } from "../stores/pina";
import { computed, ref } from "vue";

export default {
  name: "Header",
  setup() {
    const authStore = useAuthStore();

    const isAuthenticated = computed(() => authStore.isAuthenticated);
    const isAdmin = computed(() => authStore.isAdmin);

    const isMenuOpen = ref(false);

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value;
    };

    const logout = async () => {
      try {
        await authStore.logout();
        isMenuOpen.value = false;
      } catch (error) {
        this.$toast.error(error);
      }
    };

    return {
      isAuthenticated,
      isAdmin,
      isMenuOpen,
      toggleMenu,
      logout,
    };
  },
};
</script>

<style scoped>
/* Hiệu ứng trượt */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease-in-out;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
