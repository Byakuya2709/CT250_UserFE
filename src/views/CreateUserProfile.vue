<template>
  <div>
    <form @submit.prevent="submitForm">
      <!-- Upload Avatar (Hình tròn giống Facebook) -->
      <div class="avatar-container">
        <label for="avatar">Chọn Avatar:</label>
        <input type="file" id="avatar" @change="handleFileChange" />
        <div v-if="previewImage" class="preview">
          <img
            :src="previewImage"
            alt="Preview Avatar"
            class="avatar-preview"
          />
        </div>
      </div>

      <!-- Form Người Dùng -->
      <label for="userName">Họ Tên:</label>
      <input
        type="text"
        id="userName"
        v-model="user.userName"
        :class="{ invalid: errors.userName }"
        @blur="validateField('userName')"
      />
      <span v-if="errors.userName" class="error">{{ errors.userName }}</span>

      <label for="userMail">Email:</label>
      <input
        type="email"
        id="userMail"
        v-model="user.userMail"
        readonly
        disabled
      />

      <label for="userPhone">Số Điện Thoại:</label>
      <input
        type="text"
        id="userPhone"
        v-model="user.userPhone"
        :class="{ invalid: errors.userPhone }"
        @blur="validateField('userPhone')"
      />
      <span v-if="errors.userPhone" class="error">{{ errors.userPhone }}</span>

      <label for="userGender">Giới Tính:</label>
      <select
        v-model="user.userGender"
        :class="{ invalid: errors.userGender }"
        @blur="validateField('userGender')"
      >
        <option value="MALE">Nam</option>
        <option value="FEMALE">Nữ</option>
      </select>
      <span v-if="errors.userGender" class="error">{{
        errors.userGender
      }}</span>

      <label for="userAddress">Địa Chỉ:</label>
      <select
        v-model="user.userAddress"
        :class="{ invalid: errors.userAddress }"
        @blur="validateField('userAddress')"
      >
        <option
          v-for="province in provinces"
          :key="province.code"
          :value="province.name"
        >
          {{ province.name }}
        </option>
      </select>
      <span v-if="errors.userAddress" class="error">{{
        errors.userAddress
      }}</span>

      <label for="userBirth">Ngày Sinh:</label>
      <input
        type="date"
        id="userBirth"
        v-model="user.userBirth"
        :class="{ invalid: errors.userBirth }"
        @blur="validateField('userBirth')"
      />
      <span v-if="errors.userBirth" class="error">{{ errors.userBirth }}</span>

      <button type="submit">Tạo Người Dùng</button>
    </form>
  </div>
</template>

<script>
import { api } from "../api/Api";
import { provinces } from "../composable/provinces";
export default {
  data() {
    return {
      user: {
        userName: "",
        userMail: sessionStorage.getItem("UserEmail"),
        userPhone: "",
        userGender: "MALE",
        userAddress: "",
        userBirth: "",
        imageURL: null,
      },
      avatarFile: null,
      previewImage: null,
      errors: {
        userName: "",
        userPhone: "",
        userGender: "",
        userAddress: "",
        userBirth: "",
        avatarFile: "",
      },
      provinces,
    };
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0];
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (file) {
        if (!allowedTypes.includes(file.type)) {
          this.errors.avatarFile =
            "Chỉ hỗ trợ các tệp hình ảnh (JPEG, PNG, GIF).";
          this.avatarFile = null;
          this.previewImage = null;
        } else if (file.size > maxSize) {
          this.errors.avatarFile = "Kích thước tệp không được vượt quá 5MB.";
          this.avatarFile = null;
          this.previewImage = null;
        } else {
          this.errors.avatarFile = "";
          this.avatarFile = file;

          // Preview ảnh
          const reader = new FileReader();
          reader.onload = (e) => {
            this.previewImage = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      }
    },
    validateField(field) {
      if (field === "userName" && !this.user.userName.trim()) {
        this.errors.userName = "Họ tên không được để trống.";
      } else if (
        field === "userPhone" &&
        !/^\d{10}$/.test(this.user.userPhone)
      ) {
        this.errors.userPhone =
          "Số điện thoại không hợp lệ (phải gồm 10 chữ số).";
      } else if (field === "userGender" && !this.user.userGender) {
        this.errors.userGender = "Vui lòng chọn giới tính.";
      } else if (field === "userAddress" && !this.user.userAddress.trim()) {
        this.errors.userAddress = "Địa chỉ không được để trống.";
      } else if (field === "userBirth" && !this.user.userBirth) {
        this.errors.userBirth = "Vui lòng chọn ngày sinh.";
      } else if (field === "userBirth" && this.isUnder14YearsOld()) {
        this.errors.userBirth = "Bạn phải từ 14 tuổi trở lên.";
      } else {
        this.errors[field] = "";
      }
    },
    isUnder14YearsOld() {
      const birthDate = new Date(this.user.userBirth);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      return age < 14;
    },
    async submitForm() {
      // Kiểm tra toàn bộ form
      for (const field in this.user) {
        if (field !== "avatarUrl" && field !== "userMail") {
          this.validateField(field);
        }
      }

      if (Object.values(this.errors).some((error) => error)) {
        this.$toast.error("Vui lòng kiểm tra lại các trường nhập liệu.");
        return;
      }

      try {
        const avatarResponse = await this.uploadAvatar();

        if (avatarResponse.data.data.imageUrl) {
          this.user.imageURL = avatarResponse.data.data.imageUrl;
          await this.createUser();
        }
      } catch (error) {
        this.$toast.error(
          "Đã xảy ra lỗi khi tải lên Avatar hoặc tạo người dùng."
        );
      }
    },
    async uploadAvatar() {
      const formData = new FormData();
      formData.append("file", this.avatarFile);
      return await api.post("/media/upload", formData, {
        params: { accountId: this.$route.query.accountId },
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    async createUser() {
      try {
        const accountId = this.$route.query.accountId;
        console.log(this.user.avatarUrl);
        const response = await api.post("/users", this.user, {
          params: { accountId },
        });
        this.$toast.success(response.data.message);
        // localStorage.removeItem("email");
      } catch (error) {
        console.log(error);
        this.$toast.error("Đã xảy ra lỗi khi tạo người dùng");
      }
    },
  },
};
</script>

<style scoped>
form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

label {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

input,
select {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input.invalid,
select.invalid {
  border-color: red;
}

.error {
  color: red;
  font-size: 12px;
  margin-bottom: 10px;
}

button[type="submit"] {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[type="submit"]:hover {
  background-color: #0056b3;
}

.avatar-container {
  text-align: center;
  margin-bottom: 20px;
}

.preview img {
  max-width: 120px;
  max-height: 120px;
  border-radius: 50%;
  margin-top: 10px;
  border: 2px solid #ccc;
}

.preview {
  display: inline-block;
  position: relative;
}

select {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
