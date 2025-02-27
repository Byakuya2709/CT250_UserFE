<template>
  <div class="email-verification bg-light">
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="bg-white p-4 border border-dark">
        <h1 class="text-dark text-center mb-4">Thay đổi mật khẩu</h1>

        <!-- Step 1: Email Input Form -->
        <form v-if="step === 1" @submit.prevent="sendOtp">
          <div class="mb-3">
            <label for="email" class="form-label">Nhập vào Email</label>
            <input type="email" v-model="email" class="form-control" required />
          </div>
          <button type="submit" class="btn btn-primary">Gửi Mã OTP</button>
        </form>

        <!-- Step 2: OTP Input Form -->
        <form v-else-if="step === 2" @submit.prevent="verifyOtp">
          <div class="mb-3">
            <label for="otp" class="form-label">Nhập Mã OTP</label>
            <input type="text" v-model="otp" class="form-control" required />
          </div>
          <p class="info" v-if="step2">Mã OTP đã được gửi đến email của bạn.</p>
          <button type="submit" class="btn btn-primary">Xác Thực Mã OTP</button>
        </form>

        <!-- Step 3: New Password Form -->
        <form v-else-if="step === 3" @submit.prevent="resetPassword">
          <div class="mb-3">
            <label for="newPassword" class="form-label"
              >Nhập Mật Khẩu Mới</label
            >
            <input
              type="password"
              v-model="newPassword"
              class="form-control"
              required
            />
            <p v-if="!validated.password" class="text-danger mt-1">
              Mật khẩu phải gồm ít nhất 8 kí tự bao gồm chữ thường/HOA và 1 số.
            </p>
          </div>
          <div class="mb-3">
            <label for="confirmPassword" class="form-label"
              >Xác Nhận Mật Khẩu Mới</label
            >
            <input
              type="password"
              v-model="confirmPassword"
              class="form-control"
              required
            />
            <p v-if="!validated.passwordConfirm" class="text-danger mt-1">
              Vui lòng nhập đúng lại mật khẩu đã nhập.
            </p>
          </div>
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="!isValidated"
          >
            Đổi Mật Khẩu
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from "@/api/Api";

export default {
  name: "EmailVerification",
  data() {
    return {
      step: 1,
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
      validated: {
        password: false,
        passwordConfirm: false,
      },
      step2: false,
    };
  },
  computed: {
    isValidated() {
      return this.validated.password && this.validated.passwordConfirm;
    },
  },
  watch: {
    newPassword(value) {
      this.validatePassword(value);
    },
    confirmPassword(value) {
      this.validatePasswordConfirm(value);
    },
  },
  methods: {
    async sendOtp() {
      try {
        const response = await api.post("/auth/generate-passcode", {
          email: this.email,
        });
        this.$toast.success(response.data.message);
        this.step = 2; // Chuyển đến bước tiếp theo
      } catch (error) {
        this.$toast.error(
          error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại."
        );
      }
    },
    async verifyOtp() {
      try {
        const response = await api.post("/auth/account/verify", {
          email: this.email,
          code: this.otp,
          type: "ResetPassword",
        });
        this.$toast.success(response.data.message);
        this.step = 3; // Chuyển đến bước tiếp theo
      } catch (error) {
        this.$toast.error(
          error.response?.data?.message || "Mã OTP không hợp lệ."
        );
      }
    },
    async resetPassword() {
      if (!this.isValidated) {
        return; // Ngăn việc gửi nếu có lỗi
      }

      try {
        const response = await api.post("/auth/account/resetpassword", {
          email: this.email,
          newPassword: this.newPassword,
        });
        this.$toast.success(response.data.message);
        setTimeout(() => {
          this.$router.replace("/company/login");
        }, 2000);
      } catch (error) {
        this.$toast.error(
          error.response?.data?.message || "Đã xảy ra lỗi khi đổi mật khẩu."
        );
      }
    },
    validatePassword(value) {
      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      this.validated.password = passwordPattern.test(value);
    },
    validatePasswordConfirm(value) {
      this.validated.passwordConfirm = value === this.newPassword;
    },
  },
};
</script>
