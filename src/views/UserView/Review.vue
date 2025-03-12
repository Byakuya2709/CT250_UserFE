<template>
  <div class="p-6 bg-white shadow-lg rounded-lg">
    <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
      Đánh Giá Của Bạn
    </h2>
    <loading :active="loading" />
    <div
      v-if="feedbacks.length === 0 && !loading"
      class="text-center text-gray-500"
    >
      Bạn chưa có đánh giá nào.
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="feedback in feedbacks"
        :key="feedback.fbId"
        class="p-6 border rounded-lg shadow-md bg-gray-50"
      >
        <h3 class="text-xl font-semibold text-gray-800 mb-2">
          Đánh giá từ vé số: {{ feedback.ticketId }}
        </h3>
        <div class="flex items-center mb-2">
          <span
            class="text-yellow-500 mr-1"
            v-for="i in feedback.fbRate"
            :key="i"
            >⭐</span
          >
          <span
            class="text-gray-500"
            v-for="i in 5 - feedback.fbRate"
            :key="`empty-${i}`"
            >☆</span
          >
        </div>

        <p class="text-gray-700">
          {{ feedback.fbContent }}
        </p>
        <p class="text-gray-600 text-sm mt-2">
          Ngày đánh giá:
          <span class="font-semibold">
            {{ formatDate(feedback.fbCreateDate) }}
          </span>
        </p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-between items-center mt-6">
      <button
        @click="prevPage"
        :disabled="page === 1"
        class="px-4 py-2 bg-blue-500 text-gray-700 rounded-lg disabled:opacity-50"
      >
        Trang trước
      </button>
      <span class="text-gray-800 font-medium"
        >Trang {{ page }} / {{ totalPages }}</span
      >
      <button
        @click="nextPage"
        :disabled="page === totalPages"
        class="px-4 py-2 bg-blue-500 text-gray-700 rounded-lg"
      >
        Trang sau
      </button>
    </div>
  </div>
</template>

<script>
import { api } from "@/api/Api";
import { format } from "date-fns";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";

export default {
  components: {
    Loading,
  },
  data() {
    return {
      feedbacks: [],
      loading: false,
      error: null,
      page: 1,
      size: 10,
      totalPages: 1,
      userId: "",
    };
  },
  methods: {
    async fetchFeedbacks() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(
          `/blogs/feedbacks/user/${this.$route.params.userId}?page=${
            this.page - 1
          }&size=${this.size}`
        );
        this.feedbacks = response.data.data.content;
        this.totalPages = response.data.data.totalPages;
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to fetch feedbacks";
        this.$toast.error(this.error);
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      if (!dateString) return "Chưa xác định";
      return format(new Date(dateString), "dd/MM/yyyy HH:mm");
    },
    prevPage() {
      if (this.page > 1) {
        this.page--;
        this.fetchFeedbacks();
      }
    },
    nextPage() {
      if (this.page < this.totalPages) {
        this.page++;
        this.fetchFeedbacks();
      }
    },
  },
  mounted() {
    this.userId = this.$route.params.userId;
    this.fetchFeedbacks();
  },
};
</script>
