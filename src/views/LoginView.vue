<template>
  <div class="login-container" style="flex-direction: column">
    <div class="register-box">
      <h2>Đăng Nhập</h2>
      <form @submit.prevent="handleLogin">
        <!-- Email -->
        <div class="form-group">
          <input
            type="email"
            v-model="email"
            placeholder="Nhập email"
            :disabled="isLocked"
            @input="validateEmail"
          />
          <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
        </div>

        <!-- Mật khẩu -->
        <div class="form-group">
          <input
            type="password"
            v-model="password"
            placeholder="Nhập mật khẩu"
            :disabled="isLocked"
            @input="validatePassword"
          />
          <p v-if="errors.password" class="error-message">
            {{ errors.password }}
          </p>
        </div>

        <!-- Thông báo khóa tài khoản -->
        <p class="error-message" v-if="isLocked">
          Bạn đã đăng nhập sai 3 lần. Vui lòng thử lại sau {{ lockTime }} giây.
        </p>
        <p>
          <router-link to="/users/reset-password"
            >Khôi phục mật khẩu</router-link
          >.
        </p>

        <!-- Nút đăng nhập -->
        <button :disabled="isLocked || failedAttempts >= 5 || !isFormValid">
          Đăng nhập
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "../stores/pina";
import { api } from "../api/Api";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      errors: {
        email: "",
        password: "",
      },
      failedAttempts: 0,
      isLocked: false,
      lockTime: 0,
    };
  },
  mounted() {
    const savedFailedAttempts = sessionStorage.getItem("failedAttempts");
    const savedIsLocked = sessionStorage.getItem("isLocked");
    const savedLockTime = sessionStorage.getItem("lockTime");

    if (savedFailedAttempts) {
      this.failedAttempts = parseInt(savedFailedAttempts, 10);
    }

    if (savedIsLocked === "true") {
      this.isLocked = true;
      this.lockTime = parseInt(savedLockTime, 10) || 30;
      this.startLockCountdown();
    }
  },
  computed: {
    isEmailValid() {
      return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        this.email
      );
    },
    isFormValid() {
      return this.isEmailValid && this.password.length >= 6;
    },
  },
  methods: {
    validateEmail() {
      this.errors.email = "";
      if (!this.isEmailValid) {
        this.errors.email = "Email không hợp lệ.";
      }
    },
    validatePassword() {
      this.errors.password = "";
      if (!this.password || this.password.length < 6) {
        this.errors.password = "Mật khẩu phải ít nhất 6 ký tự.";
      }
    },

    async handleLogin() {
      if (!this.isFormValid) {
        this.$toast.error("Vui lòng kiểm tra lại thông tin.");
        return;
      }

      if (this.failedAttempts < 5) {
        try {
          const user = { email: this.email, password: this.password };
          const authStore = useAuthStore();
          const { loginResponse } = await authStore.login(user, "user");
          console.log(loginResponse);
          if (loginResponse.status === 200) {
            this.failedAttempts = 0;
            sessionStorage.removeItem("failedAttempts");
            this.$toast.success(loginResponse.data.message);
            this.$router.push({ name: "Users" });
          } else {
            this.handleFailedAttempt();
          }
        } catch (error) {
          console.log(error);
          this.handleFailedAttempt();
        }
      } else {
        this.blockAccount();
      }
    },

    handleFailedAttempt() {
      this.failedAttempts++;
      sessionStorage.setItem("failedAttempts", this.failedAttempts);

      if (this.failedAttempts === 3) {
        this.isLocked = true;
        this.lockTime = 10;
        sessionStorage.setItem("isLocked", true);
        sessionStorage.setItem("lockTime", this.lockTime);
        this.startLockCountdown();
        this.$toast.warning("Đăng nhập sai 3 lần. Vui lòng thử lại sau.");
      } else if (this.failedAttempts === 5) {
        this.blockAccount();
      } else {
        this.$toast.warning("Đăng nhập thất bại. Thử lại.");
      }
    },

    startLockCountdown() {
      const interval = setInterval(() => {
        this.lockTime--;

        if (this.lockTime <= 0) {
          clearInterval(interval);
          this.isLocked = false;
          sessionStorage.setItem("isLocked", false);
        }
      }, 1000);
    },

    async blockAccount() {
      const user = { email: this.email };
      try {
        const response = await api.post("/auth/blocked", user);

        if (response.status === 200) {
          this.$toast.warning(
            "Tài khoản đã bị khóa. Vui lòng kiểm tra email để khôi phục mật khẩu."
          );

          sessionStorage.removeItem("failedAttempts");
          sessionStorage.removeItem("isLocked");
          sessionStorage.removeItem("lockTime");

          // Cập nhật lại trạng thái trong component
          this.failedAttempts = 0;
          this.isLocked = false;
          this.lockTime = 0;
        } else {
          this.$toast.error("Có lỗi xảy ra khi khóa tài khoản.");
        }
      } catch (error) {
        this.$toast.error(
          error.response?.data?.message || "Không thể kết nối đến hệ thống."
        );
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f7fc;
}

h2 {
  margin-bottom: 20px;
  font-size: 28px;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

input {
  width: 100%;
  padding: 14px;
  margin-top: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}
button {
  background-color: #4caf50;
  color: white;
  padding: 14px;
  width: 100%;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: red;
  font-size: 14px;
}
.register-box {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  min-width: 350px;
  text-align: center;
}
</style>
