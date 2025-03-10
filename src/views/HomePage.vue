<script>
import { api } from "@/api/Api";
import { formatCurrency } from "@/composable/format";
import { availableYears } from "@/composable/availableYears";
import { months } from "@/composable/months";
import { eventTags } from "@/composable/eventTags";

export default {
  data() {
    return {
      topRatedEvents: [],
      loading: true,
      error: null,
      events: [], // Store events data

      selectedTag: eventTags[0].value,
      eventsByTag: [],

      currentPage: 1,
      itemsPerPage: 8,
      totalPages: 1,
      totalElements: 0,
      availableYears,
      months,
      filters: {
        companyId: "",
        eventStatus: "", // Trạng thái sự kiện
        year: "",
        month: "",
      },
    };
  },
  computed: {
    paginatedAccounts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.events;
    },
    eventTags() {
      return eventTags; // Sử dụng dữ liệu từ module
    },
    invalidFilter() {
      if (!this.filters.month && !this.filters.year) {
        return false; // Cho phép không chọn tháng và năm
      }
      return (
        (this.filters.month && !this.filters.year) ||
        (this.filters.year && !this.filters.month)
      );
    },
  },
  methods: {
    
    formatCurrency,
    async fetchEventsByTag(selectedTag) {
      if (!selectedTag) return;

      try {
        const response = await api.get(`/public/tag`, {
          params: { tag: selectedTag },
        });

        this.eventsByTag = response.data.data;

        // if (response.data?.data) {
        //   this.eventsByTag[this.selectedTag.label] = response.data.data;
        // } else {
        //   this.eventsByTag[this.selectedTag.label] = [];
        //   console.warn(`Không có dữ liệu cho tag: ${this.selectedTag.label}`);
        // }
        console.log(this.eventsByTag);
      } catch (error) {
        this.error = "Lỗi khi lấy danh sách sự kiện theo tag";
        console.error(error);
      }
    },
    async fetchTopRatedEvents() {
      try {
        const response = await api.get("/public/top-rated");
        this.topRatedEvents = response.data;
      } catch (error) {
        this.error = "Lỗi khi lấy danh sách sự kiện top-rated";
        console.error(error);
      }
    },

    getPosterImage(imgURLs) {
      return imgURLs.find((url) => url.includes("poster.jpg")) || imgURLs[0];
    },
    async getEvents() {
      this.loading = true;
      const { eventStatus, year, month } = this.filters;
      try {
        const response = await api.get(
          `/public/filter?page=${this.currentPage - 1}&companyId=${
            this.filters.companyId
          }&size=${
            this.itemsPerPage
          }&eventStatus=${eventStatus}&month=${month}&year=${year}`
        );

        if (response.data.status === "OK") {
          this.events = response.data.data.content;
          console.log(this.events);
          this.totalPages = response.data.data.totalPages;
        } else {
          this.$toast.error("Error fetching events");
          console.error("Error fetching events:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        this.$toast.error("Error fetching events");
      } finally {
        this.loading = false;
      }
    },
    applyFilters() {
      if (this.invalidFilter) {
        console.warn("Lỗi: Nếu chọn tháng thì phải chọn năm và ngược lại!");
        return;
      }
      this.currentPage = 1; // Reset to first page when filters are applied
      this.getEvents();
    },
    clearFilters() {
      this.filters.companyId = "";
      this.filters.eventStatus = "";
      this.filters.year = "";
      this.filters.month = "";
      this.applyFilters();
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString();
    },
    calculateAverageRating(event) {
      let totalReviews = 0;
      let weightedSum = 0;
      for (let star in event.eventRatingStart) {
        let count = event.eventRatingStart[star];
        weightedSum += star * count;
        totalReviews += count;
      }
      return totalReviews === 0 ? 0 : weightedSum / totalReviews;
    },
    getStars(event) {
      const averageRating = this.calculateAverageRating(event);
      const fullStars = Math.floor(averageRating);
      const halfStars = averageRating % 1 >= 0.5 ? 1 : 0;
      const emptyStars = 5 - fullStars - halfStars;

      return {
        fullStars,
        halfStars,
        emptyStars,
      };
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
    toDetail(eventId) {
      this.$router.push({ path: `/events/${eventId}` });
    },
    calculateAverageRating2(eventRatingStart) {
      if (!eventRatingStart) return 0;

      let totalVotes = 0;
      let totalScore = 0;

      Object.keys(eventRatingStart).forEach((rating) => {
        const count = eventRatingStart[rating];
        totalVotes += count;
        totalScore += parseInt(rating) * count;
      });

      return totalVotes ? (totalScore / totalVotes).toFixed(1) : 0;
    },
  },
  async mounted() {
    await this.fetchTopRatedEvents();
    await this.getEvents();
    await this.fetchEventsByTag(eventTags[0].value);
    this.loading = false;
  },
};
</script>

<template>
  <div class="mx-auto">
    <div>
      <h2
        class="text-4xl font-bold text-gray-800 p-4 text-center"
        style="background: #f3e8ff"
      >
        Sự kiện nổi bật
      </h2>

      <div v-if="loading" class="d-flex justify-content-center">
        <div class="spinner-border text-primary" role="status"></div>
      </div>
      <div v-if="error" class="alert alert-danger">{{ error }}</div>

      <div v-if="!loading && topRatedEvents.length > 0">
        <div
          id="topRatedEventsCarousel"
          class="carousel slide"
          data-bs-ride="carousel"
        >
          <div class="carousel-inner">
            <div
              v-for="(event, index) in topRatedEvents"
              :key="event.eventId"
              :class="['carousel-item', { active: index === 0 }]"
            >
              <img
                :src="event.eventListImgURL[0]"
                class="d-block w-100 carousel-img"
                alt="Event Image"
              />
              <div
                class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 p-3 rounded"
              >
                <h5>{{ event.eventTitle }}</h5>
                <div class="event-rating">
                  <span
                    v-for="star in 5"
                    :key="star"
                    class="star"
                    :class="{
                      filled:
                        star <=
                        Math.round(
                          calculateAverageRating2(event.eventRatingStart)
                        ),
                    }"
                    >⭐</span
                  >
                  <span class="rating-value"
                    >({{
                      calculateAverageRating2(event.eventRatingStart)
                    }}/5)</span
                  >
                </div>
                <p>
                  📍 {{ event.eventAddress }}<br />📅
                  {{ new Date(event.eventStartDate).toLocaleDateString()
                  }}<br />💰
                  <strong>{{ event.eventPrice.toLocaleString() }} VND</strong>
                </p>
                <button
                  class="btn btn-primary"
                  @click="toDetail(event.eventId)"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
          <button
            class="carousel-control-prev"
            type="button"
            data-bs-target="#topRatedEventsCarousel"
            data-bs-slide="prev"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          </button>
          <button
            class="carousel-control-next"
            type="button"
            data-bs-target="#topRatedEventsCarousel"
            data-bs-slide="next"
          >
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <h2
    class="text-4xl font-bold text-gray-800 p-4 text-center"
    style="background: #f3e8ff"
  >
    Tất Cả Sự Kiện
  </h2>
  <!-- filter all -->
  <div class="flex mx-auto p-4 border border-gray-300">
    <!-- Bộ lọc bên trái -->
    <div class="w-1/4 p-4 border-r border-gray-300">
      <div class="bg-white p-4 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold mb-4">Bộ lọc</h2>
        <label for="eventStatus" class="block text-sm font-medium text-gray-700"
          >Trạng thái:</label
        >
        <select
          v-model="filters.eventStatus"
          id="eventStatus"
          class="w-full p-2 border rounded mb-4"
        >
          <option value="">Tất cả</option>
          <option value="UP_COMMING">Sắp Diễn Ra</option>
          <option value="CANCELLED">Đã Hủy</option>
          <option value="ENDED">Đã Kết Thúc</option>
        </select>

        <label for="month" class="block text-sm font-medium text-gray-700"
          >Tháng:</label
        >
        <select
          v-model="filters.month"
          id="month"
          class="w-full p-2 border rounded mb-4"
        >
          <option value="">Tất cả</option>
          <option v-for="month in months" :key="month" :value="month">
            {{ month }}
          </option>
        </select>

        <label for="year" class="block text-sm font-medium text-gray-700"
          >Năm:</label
        >
        <select
          v-model="filters.year"
          id="year"
          class="w-full p-2 border rounded mb-4"
        >
          <option value="">Tất cả</option>
          <option v-for="year in availableYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
        <p v-if="invalidFilter" class="text-red-500 mb-2">
      Nếu chọn tháng thì phải chọn năm và ngược lại!
    </p>
        <div class="flex space-x-2 mt-4">
          <button
            @click="applyFilters"
            class="bg-blue-500 text-white px-4 py-2 rounded"
              :disabled="invalidFilter"
          >
            Áp dụng
          </button>
          <button
            @click="clearFilters"
            class="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>

    <!-- Danh sách sự kiện bên phải -->
    <div class="w-3/4 p-4">
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <div
          v-for="event in paginatedAccounts"
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

  <h2
    class="text-4xl font-bold text-gray-800 text-center p-4"
    style="background: #f3e8ff"
  >
    Sự Kiện Sắp Diễn Ra
  </h2>
  <div class="flex mx-auto p-4 border border-gray-300">
    <!-- Bộ lọc bên trái -->
    <div class="w-1/4 p-4 border-r border-gray-300">
      <div class="bg-white p-4 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold mb-4">Thể Loại</h2>
        <select v-model="selectedTag" class="w-full p-2 border rounded mb-4">
          <option v-for="tag in eventTags" :key="tag.value" :value="tag.value">
            {{ tag.label }}
          </option>
        </select>
        <button
          @click="fetchEventsByTag(selectedTag)"
          class="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto"
        >
          Áp dụng
        </button>
      </div>
    </div>

    <!-- Danh sách sự kiện bên phải -->
    <div class="w-3/4 p-4">
      <div v-if="eventsByTag"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <div
          v-for="event in eventsByTag"
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
      <div v-else class=" font-bold text-lg">Không có sự kiện nào</div>
    </div>
  </div>
</template>
<style scoped>
body {
  font-family: "Roboto", sans-serif;
  background-color: #f7f8fa;
  margin: 0;
  padding: 0;
}

/* Thẻ sự kiện */
.event {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-right: 20px; /* Thêm margin phải để có khoảng cách giữa các thẻ */
  margin-bottom: 20px;
  transition: all 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  max-width: 300px; /* Giới hạn chiều rộng tối đa */
  width: 100%;
}

.event:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}
.event-description {
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Hiển thị tối đa 3 dòng */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis; /* Hiển thị dấu "..." nếu quá dài */
  max-width: 100%;
}
.event h3 {
  font-size: 1.6rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.event p {
  font-size: 1rem;
  color: #666;
  line-height: 1.5;
}

.event img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-top: 15px;
  transition: transform 0.3s ease-in-out;
}

.event img:hover {
  transform: scale(1.05);
}
.event-description {
  display: -webkit-box;
  /* -webkit-line-clamp: 3; Hiển thị tối đa 3 dòng */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis; /* Hiển thị dấu "..." nếu quá dài */
  max-width: 100%;
}

/* Đánh giá sao */
.stars {
  margin-top: 10px;
  display: flex;
  align-items: center;
}

.star {
  font-size: 20px;
  color: #ffcc00;
  margin-right: 3px;
}

.full-star {
  color: #ffcc00;
}

.half-star {
  position: relative;
}

.empty-star {
  color: #e0e0e0;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  background-color: #ff6347;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s, transform 0.3s ease;
  margin: 0 8px;
}

.pagination button:hover {
  background-color: #ff4500;
  transform: scale(1.05);
}

.pagination button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.pagination span {
  padding: 10px;
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

/* Thiết kế cấu trúc trang (chuyển sang layout ngang) */
.event-list {
  display: flex;
  flex-wrap: wrap; /* Allow wrapping for small screens */
  gap: 20px;
  justify-content: flex-start;
}

.event {
  width: 280px; /* Điều chỉnh lại chiều rộng của các sự kiện */
}

/* Pagination control should be aligned with the horizontal layout */
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* Trang tải và không có sự kiện */
.loading {
  text-align: center;
  font-size: 1.2rem;
  color: #ff6347;
  margin-top: 30px;
}

.no-events {
  text-align: center;
  font-size: 1.2rem;
  color: #ff6347;
  font-weight: bold;
  margin-top: 30px;
}

/* Responsive design */
@media (max-width: 768px) {
  .event-list {
    flex-direction: column; /* Chuyển sang dọc khi màn hình nhỏ */
    align-items: center;
  }

  .pagination {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .event {
    width: 100%; /* Thẻ sự kiện chiếm toàn bộ chiều rộng */
    margin-bottom: 20px;
  }

  .pagination button {
    padding: 8px 15px;
  }
}
.carousel-img {
  height: 600px;
  object-fit: cover;
}
.carousel-caption {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}
.event-rating {
  align-items: center;
  font-size: 1.2rem;
}
.star {
  color: #ccc;
  transition: color 0.3s;
}
.star.filled {
  color: gold;
}
.rating-value {
  margin-left: 5px;
  font-weight: bold;
}
</style>
