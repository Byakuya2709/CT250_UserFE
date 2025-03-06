<template>
  <div class="register-container">
    <div class="register-box">
      <h2>Đăng Ký</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Nhập email"
            required
            autofocus
          />
          <p v-if="email && !isEmailValid" class="error-message">
            Email không hợp lệ.
          </p>
        </div>

        <div class="form-group">
          <label for="password">Mật khẩu</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Nhập mật khẩu"
            required
          />
          <p v-if="password && password.length < 6" class="error-message">
            Mật khẩu phải ít nhất 6 ký tự.
          </p>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Xác nhận mật khẩu</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            placeholder="Nhập lại mật khẩu"
            required
          />
          <p
            v-if="confirmPassword && confirmPassword !== password"
            class="error-message"
          >
            Mật khẩu xác nhận không khớp.
          </p>
        </div>

        <button type="submit" :disabled="!isFormValid">Đăng Ký</button>
      </form>

      <!-- Modal OTP -->
      <div v-if="showOtpModal" class="otp-modal">
        <div class="otp-box">
          <h3>Nhập mã OTP</h3>
          <form @submit.prevent="handleOtpVerification">
            <div class="form-group">
              <label for="otp">Mã OTP</label>
              <input
                type="text"
                id="otp"
                v-model="otp"
                placeholder="Nhập mã OTP"
                required
              />
            </div>
            <button type="submit" :disabled="!otp">Xác nhận OTP</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from "../api/Api";
import { useAuthStore } from "../stores/pina";
export default {
  name: "Register",
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: "",
      otp: "",
      role: "USER",
      showOtpModal: false, // Hiển thị modal OTP
    };
  },
  computed: {
    isEmailValid() {
      return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        this.email
      );
    },
    isFormValid() {
      return (
        this.isEmailValid &&
        this.password.length >= 6 &&
        this.password === this.confirmPassword
      );
    },
  },
  created() {
    // Dynamically set the role based on the current path
    const path = this.$route.path;
    if (path.includes("company")) {
      this.role = "COMPANY";
    } else if (path.includes("artist")) {
      this.role = "ARTIST";
    }
    // If the path doesn't match any of the above, the role will stay 'USER'
  },
  methods: {
    async handleRegister() {
      if (this.isFormValid) {
        try {
          const data = { email: this.email };
          const response = await api.post("/auth/generate", data);
          if (response.status === 200) {
            this.$toast.success(response.data.message);
            this.showOtpModal = true; // Hiển thị modal OTP
          } else {
            this.$toast.warning(response.data.message);
            this.showOtpModal = true;
          }
        } catch (error) {
          console.log(error);
          this.$toast.error(error.response?.data?.message || "Đã xảy ra lỗi");
        }
      }
    },

    async handleOtpVerification() {
      if (this.otp) {
        try {
          const user = {
            email: this.email,
            password: this.password,
            role: this.role,
            code: this.otp,
            type: "Registration",
          };
          const response = await api.post("/auth/register", user);
          if (response.status === 201) {
            this.$toast.success(response.data.message);
            sessionStorage.setItem("UserEmail", this.email);

            const login = {
              email: this.email,
              password: this.password,
            };

            const authStore = useAuthStore();
            const { loginResponse, role } = await authStore.login(
              login,
              "user"
            );
            console.log(loginResponse);
            console.log(role);

            if (loginResponse.status === 200) {
              this.$toast.success(loginResponse.data.message);
              this.$router.push({
                path: `/${this.role.toLocaleLowerCase()}s/create`,
                query: { accountId: response.data.data.id },
              });
            } else {
              this.$toast.warning(loginResponse.data.message);
            }
          } else {
            this.$toast.warning(response.data.message);
          }
        } catch (error) {
          console.log(error);
          this.$toast.error(error.response?.data?.message || "Đã xảy ra lỗi");
        } finally {
          this.showOtpModal = false; // Đóng modal khi hoàn thành
        }
      } else {
        this.$toast.error("Vui lòng nhập mã OTP.");
      }
    },
  },
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f7fc;
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

.otp-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.otp-box {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;
}

h3 {
  margin-bottom: 20px;
  font-size: 24px;
}
</style>
