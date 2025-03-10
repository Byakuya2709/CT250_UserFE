<template>
  <h2
    class="text-4xl font-bold text-gray-800 p-4 text-center"
    style="background: #f3e8ff"
  >
    Kết Quả Tìm Kiếm
  </h2>
  <div class="flex mx-auto p-4 border border-gray-300">
    <!-- Danh sách sự kiện -->
    <div>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <div
          v-for="event in events"
          :key="event.eventId"
          class="bg-white shadow-lg rounded-lg p-4 hover:scale-105 cursor-pointer"
          @click="goToEventDetails(event.eventId)"
        >
          <h3 class="text-lg font-semibold mb-2">{{ event.eventTitle }}</h3>
          <p class="text-gray-600 mb-2 truncate">
            {{ event.eventDescription }}
          </p>
          <p class="text-sm">
            <strong>Ngày Bắt đầu:</strong>
            {{ formatDate(event.eventStartDate) }}
          </p>
          <p class="text-sm">
            <strong>Ngày Kết Thúc:</strong> {{ formatDate(event.eventEndDate) }}
          </p>
          <p class="text-sm">
            <strong>Giá:</strong> {{ formatCurrency(event.eventPrice) }}
          </p>
          <p class="text-sm">
            <strong>Trạng thái:</strong> {{ event.eventStatus }}
          </p>
          <img
            :src="getPosterImage(event.eventListImgURL)"
            alt="Event Image"
            class="w-full h-40 object-cover mt-3 rounded-md"
          />
        </div>
      </div>

      <!-- Phân trang -->
      <div class="flex justify-between items-center mt-6">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          <i class="fas fa-chevron-left"></i> Trang trước
        </button>
        <span class="font-semibold"
          >Trang {{ currentPage }} / {{ totalPages }}</span
        >
        <button
          @click="nextPage"
          :disabled="currentPage >= totalPages"
          class="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Trang sau <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from "@/api/Api";
import { formatCurrency } from "@/composable/format";

export default {
  data() {
    return {
      loading: true,
      events: [],
      currentPage: 1,
      itemsPerPage: 20,
      totalPages: 1,
      keyword: "",
    };
  },
  computed: {},
  methods: {
    formatCurrency,

    getPosterImage(imgURLs) {
      if (!imgURLs || imgURLs.length === 0) return "/default-event.jpg";
      return imgURLs.find((url) => url.includes("poster.jpg")) || imgURLs[0];
    },

    async getEvents() {
      this.loading = true;
      try {
        const response = await api.get("/public/search-text", {
          params: {
            keyword: this.keyword,
            page: this.currentPage - 1,
            size: this.itemsPerPage,
          },
        });

        if (response.data.status === "OK") {
          this.events = response.data.data.content;
          this.totalPages = response.data.data.totalPages;
        } else {
          this.$toast.error("Lỗi khi tải sự kiện.");
        }
      } catch (error) {
        console.error("Lỗi khi tải sự kiện:", error);
        this.$toast.error("Lỗi khi tải sự kiện.");
      } finally {
        this.loading = false;
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString();
    },

    goToEventDetails(eventId) {
      this.$router.push({ path: `/events/${eventId}` });
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.getEvents();
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.getEvents();
      }
    },
  },
  watch: {
    "$route.query.keyword": {
      immediate: true,
      handler(newKeyword) {
        this.keyword = newKeyword || "";
        this.currentPage = 1;
        this.getEvents();
      },
    },
  },
};
</script>
