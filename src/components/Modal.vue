<template>
    <div v-if="showOtpModal" class="modal">
      <div class="modal-content">
        <h3>Enter OTP</h3>
        <input type="text" v-model="otp" placeholder="Enter verification code">
        <button @click="verifyOtp">Verify</button>
        <button @click="closeModal">Cancel</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        showOtpModal: false,
        otp: ''
      };
    },
    methods: {
      closeModal() {
        this.showOtpModal = false;
      },
      async verifyOtp() {
        // Handle OTP verification
      }
    }
  }
  </script>
  