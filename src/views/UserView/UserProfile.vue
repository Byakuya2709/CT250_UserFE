<template>
    <div class="company-info">
      <h1>Thông Tin Người Dùng</h1>
  
      <form @submit.prevent="updateUserInfo">
        <div v-if="user">
          <!-- Logo Công Ty -->
          <div class="logo-container">
            <img :src="previewLogo" alt="Logo Công Ty" class="logo" />
            <input type="file" @change="handleImageUpload" class="file-input" />
          </div>
  
          <div class="form-group">
            <label><strong>Mã Người Dùng:</strong></label>
            <p class="readonly">{{ user.id }}</p>
          </div>
  
          <div class="form-group">
            <label>Tên Người Dùng:</label>
            <input v-model="user.userName" type="text" required />
          </div>
  
          <div class="form-group">
            <label>Email:</label>
            <input v-model="user.userMail" type="email" required disabled class="readonly" />
          </div>
  
          <div class="form-group">
            <label>Số Điện Thoại:</label>
            <input v-model="user.userPhone" type="tel" required />
          </div>
  
          <div class="form-group">
            <label>Địa Chỉ:</label>
            <input v-model="user.userAddress" type="text" required />
          </div>
  
          <div class="form-group">
            <label>Giới tính:</label>
            <select v-model="user.userGender">
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
            </select>
          </div>
  
          <div class="form-group">
            <label>Ngày Sinh:</label>
            <p class="readonly">{{ formatDate(user.userBirth) }}</p>
          </div>
  
          <button type="submit" class="submit-btn">Lưu Thông Tin</button>
        </div>
        <p v-else>Đang tải dữ liệu...</p>
      </form>
    </div>
  </template>
  

<script>
import { api } from "@/api/Api";
export default {
  props: {
    userInfo: Object,
  },
  data() {
    return {
      user: { ...this.userInfo }, // Dữ liệu công ty
      logoFile: null, // File ảnh mới
      previewLogo: this.userInfo?.imageURL, // Giữ ảnh cũ ban đầu
    };
  },
  watch: {
    userInfo: {
      handler(newValue) {
        this.user = { ...newValue };
        this.previewLogo = newValue?.imageURL;
      },
      deep: true,
      immediate: true, // Cập nhật ngay khi component được mount
    },
  },
  methods: {
    async updateUserInfo() {
      try {
        // Nếu không có ảnh mới, bỏ qua việc upload logo
        if (this.logoFile) {
          const logoResponse = await this.uploadLogo();
          if (logoResponse?.data?.data?.imageUrl) {
            this.user.imageURL = logoResponse.data.data.imageUrl; // Cập nhật logo mới
          }
        }

        // Gửi dữ liệu cập nhật công ty
        await this.updateUser();
      } catch (error) {
        console.log(error);
        this.$toast.error("Đã xảy ra lỗi khi lưu thông tin công ty.");
      }
    },
    async updateUser() {
      try {
        const response = await api.patch("/users", this.user);
        this.$toast.success(response.data.message);
      } catch (error) {
        console.log(error);
        this.$toast.error(error.response?.data?.message || "Đã xảy ra lỗi");
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        this.logoFile = file;
        reader.onload = (e) => {
          this.previewLogo = e.target.result; // Chỉ cập nhật ảnh xem trước
        };
        //
        reader.readAsDataURL(file);
      }
    },
    async uploadLogo() {
      const formData = new FormData();
      formData.append("file", this.logoFile);
      return await api.post("/media/upload", formData, {
        params: { accountId: this.user.id },
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    formatDate(isoString) {
      const date = new Date(isoString);
      return date.toLocaleDateString("vi-VN");
    },
  },
};
</script>

<style scoped>.company-info {
    max-width: 500px;
    margin: 20px auto;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    text-align: center;
    color: #333;
    margin-bottom: 20px;
  }
  
  .logo-container {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .logo {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #ddd;
  }
  
  .file-input {
    display: block;
    cursor: pointer;
  }
  
  .form-group {
    margin-top: 1%;
    display: flex;
    flex-direction: column;
  }
  
  label {
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  input,
  select {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
  }
  
  .readonly {
    background: #f3f3f3;
    border-radius: 5px;
    font-size: 16px;
  }
  
  .submit-btn {
    width: 100%;
    background: #007bff;
    color: white;
    padding: 10px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .submit-btn:hover {
    background: #0056b3;
  }
  
</style>
