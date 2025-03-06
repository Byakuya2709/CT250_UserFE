<template>
  <div class="event-container" v-if="event">
    <div class="event-header">
      <h1 class="event-title">{{ event.eventTitle }}</h1>
      <p v-for="(tag, index) in eventTags" :key="index" class="event-tags">
        {{ tag }}
      </p>
      <p class="event-age-tag">{{ event.eventAgeTag }}</p>
      <div class="stars">
        <span
          v-for="index in getStars(event).fullStars"
          :key="'full-' + index"
          class="star full-star"
        >
          ★
        </span>
        <span v-if="getStars(event).halfStars" class="star half-star">★</span>
        <span
          v-for="index in getStars(event).emptyStars"
          :key="'empty-' + index"
          class="star empty-star"
        >
          ★
        </span>
      </div>
    </div>

    <div class="event-content">
      <swiper
        v-if="event?.eventListImgURL?.length"
        :space-between="10"
        :slides-per-view="1"
        :loop="true"
        :autoplay="{ delay: 3000 }"
        class="event-image-carousel"
        navigation
      >
        <swiper-slide
          v-for="(image, index) in event.eventListImgURL"
          :key="index"
          class="event-image-slide"
        >
          <img :src="image" alt="Event Image" />
        </swiper-slide>
      </swiper>

      <div class="event-details card shadow-lg border-0 rounded-4">
        <div class="card-body p-4">
          <h3
            class="card-title text-center text-uppercase fw-bold text-primary mb-4"
          >
            <i class="fas fa-calendar-alt"></i> Event Details
          </h3>
          <ul class="list-group list-group-flush">
            <li class="list-group-item d-flex justify-content-between">
              <strong
                ><i class="fas fa-clock text-warning"></i> Start Date:</strong
              >
              <span>{{ formattedStartDate }}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between">
              <strong
                ><i class="fas fa-clock text-danger"></i> End Date:</strong
              >
              <span>{{ formattedEndDate }}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between">
              <strong
                ><i class="fas fa-money-bill-wave text-success"></i>
                Price:</strong
              >
              <span class="fw-semibold text-success"
                >{{ event.eventPrice }} VND</span
              >
            </li>
            <li class="list-group-item d-flex justify-content-between">
              <strong
                ><i class="fas fa-map-marker-alt text-info"></i>
                Location:</strong
              >
              <span>{{ event.eventAddress }}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between">
              <strong
                ><i class="fas fa-users text-primary"></i> Capacity:</strong
              >
              <span class="fw-semibold text-primary"
                >{{ event.eventCapacity }} people</span
              >
            </li>
            <li class="list-group-item d-flex justify-content-between">
              <strong
                ><i class="fas fa-check-circle text-secondary"></i>
                Status:</strong
              >
              <span class="fw-bold">{{ event.eventStatus }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="event-descriptions">
      <h3>Mô tả sự kiện</h3>
      <p class="event-description">
        {{ isExpanded ? event.eventDescription : truncatedText }}
      </p>
      <button
        v-if="event.eventDescription.length > maxLength"
        @click="isExpanded = !isExpanded"
        class="toggle-btn"
      >
        {{ isExpanded ? "Thu gọn" : "Xem thêm" }}
      </button>
    </div>

    <div class="event-tickets">
      <h3>Book Your Tickets</h3>
      <div class="ticket-list">
        <div
          v-for="(remainingCapacity, day) in event.eventTicketCapacity"
          :key="day"
          class="ticket-card"
        >
          <p>
            <strong>Day {{ day }}</strong>
          </p>
          <p>Remaining Tickets: {{ remainingCapacity }}</p>
          <button
            class="book-btn"
            :disabled="!canPurchaseTicket"
            @click="openModal({ day, remainingCapacity })"
            :title="
              !canPurchaseTicket
                ? 'Vé chỉ được mua trong vòng 7 ngày trước khi sự kiện bắt đầu'
                : ''
            "
          >
            Đặt vé ngay
          </button>
        </div>
        <div class="ticket-card">
          <p>
            <strong>ALL_DAY</strong>
          </p>
          <p>Tổng: {{ event.totalDay }} ngày</p>
          <button
            class="book-btn"
            :disabled="!canPurchaseTicket"
            @click="openModalAllDay"
            :title="
              !canPurchaseTicket
                ? 'Vé chỉ được mua trong vòng 7 ngày trước khi sự kiện bắt đầu'
                : ''
            "
          >
            Đặt vé toàn sự kiện
          </button>
        </div>
      </div>
    </div>
    <!-- Modal đặt vé -->
    <EventBooking
      v-if="showModal"
      :event="event"
      :day="selectedTicket"
      @close="closeModal"
    />
  </div>
  <EventBookingAllDay
    v-if="showModalAllDay"
    :event="event"
    :day="string"
    @close="closeModal"
  />
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper-bundle.css";
import { api } from "@/api/Api";
import EventBooking from "@/views/EventView/EventBooking.vue";
import EventBookingAllDay from "@/views/EventView/EventBookingAllDay.vue";
export default {
  components: {
    Swiper,
    SwiperSlide,
    EventBooking,
    EventBookingAllDay,
  },
  data() {
    return {
      isModalOpen: false,
      loading: true,
      eventId: this.$route.params.eventId,
      event: null,
      showModal: false,
      isExpanded: false,
      maxLength: 100, // Giới hạn số ký tự hiển thị ban đầu
      showModalAllDay: false,
      string: "ALL_DAYS",
      selectedTicket: null,
    };
  },
  async mounted() {
    await this.fetchEventData();

    if (this.$route.name === "EventBooking") {
      const dayQuery = this.$route.query.day;
      if (dayQuery) {
        this.selectedTicket = {
          day: dayQuery,
          remainingCapacity: this.event.eventTicketCapacity[dayQuery] || 0,
        };
      }
      this.showModal = true;
    }
  },
  watch: {
    async $route(to) {
      await this.fetchEventData();

      if (to.name === "EventBooking") {
        const dayQuery = to.query.day;
        if (dayQuery) {
          this.selectedTicket = {
            day: dayQuery,
            remainingCapacity: this.event.eventTicketCapacity[dayQuery] || 0,
          };
        }
        this.showModal = true;
      } else {
        this.showModal = false;
        this.selectedTicket = null;
      }
    },
  },
  methods: {
    async fetchEventData() {
      this.loading = true;
      try {
        const response = await api.get(`/public/${this.eventId}`);
        this.event = response.data.data;
      } catch (error) {
        console.error("Error fetching event data:", error);
        this.$toast.error(error.response?.data?.message || "Đã xảy ra lỗi");
      } finally {
        this.loading = false;
      }
    },
    openModal(ticket) {
      this.selectedTicket = ticket;
      this.showModal = true;

      // Điều hướng sang /events/:eventId/booking + ticketId
      this.$router.push({
        name: "EventBooking",
        params: { eventId: this.eventId },
        query: { day: ticket.day },
      });
    },
    openModalAllDay() {
      this.selectedTicket = {
        day: "ALL_DAY",
        remainingCapacity: this.totalRemainCapacity || 0,
      };
      this.showModalAllDay = true;

      this.$router.push({
        name: "EventBookingAllDay",
        params: { eventId: this.eventId },
        query: { day: "ALL_DAYS" },
      });
    },
    closeModal() {
      this.showModal = false;
      this.showModalAllDay = false;
      this.selectedTicket = null;

      // Quay lại trang event chính
      this.$router.push({
        path: `/events/${this.event.eventId}`,
      });
    },
    calculateAverageRating(event) {
      let totalReviews = 0;
      let weightedSum = 0;

      // Loop through ratings to calculate the weighted sum
      for (let star in event.eventRatingStart) {
        let count = event.eventRatingStart[star];
        weightedSum += star * count;
        totalReviews += count;
      }

      // Return the average rating or 0 if no ratings
      return totalReviews === 0 ? 0 : weightedSum / totalReviews;
    },

    // Get full, half, and empty stars based on the average rating of an event
    getStars(event) {
      const averageRating = this.calculateAverageRating(event);
      const fullStars = Math.floor(averageRating); // Full stars
      const halfStars = averageRating % 1 >= 0.5 ? 1 : 0; // Half star if needed
      const emptyStars = 5 - fullStars - halfStars; // Empty stars

      return {
        fullStars,
        halfStars,
        emptyStars,
      };
    },
  },
  computed: {
    truncatedText() {
      return this.event.eventDescription.length > this.maxLength
        ? this.event.eventDescription.substring(0, this.maxLength) + "..."
        : this.event.eventDescription;
    },
    formattedStartDate() {
      return this.event?.eventStartDate
        ? new Date(this.event.eventStartDate).toLocaleString()
        : "";
    },
    formattedEndDate() {
      return this.event?.eventEndDate
        ? new Date(this.event.eventEndDate).toLocaleString()
        : "";
    },
    eventTags() {
      return this.event?.eventTags?.split("_") || [];
    },
    totalRemainCapacity() {
      if (!this.event?.eventTicketCapacity) return 0;
      return Math.min(
        ...Object.values(this.event.eventTicketCapacity).map(
          (capacity) => capacity || Infinity
        )
      );
    },
    // Cho phép mua vé nếu thời gian còn lại từ 0 đến 7 ngày trước khi sự kiện bắt đầu
    canPurchaseTicket() {
      if (!this.event || !this.event.eventStartDate) return false;
      const now = new Date();
      const eventDate = new Date(this.event.eventStartDate);
      const diffTime = eventDate.getTime() - now.getTime();
      const diffDays = diffTime / (1000 * 3600 * 24);
      return diffDays <= 7 && diffDays >= 0;
    },
  },
};
</script>

<style scoped>
.event-container {
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(to right, #2f3132, #c6cbcf);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.event-header {
  text-align: center;
  background: linear-gradient(135deg, #c12c07, #feb47b);
  color: white;
  padding: 20px;
  width: 90%;
  border-radius: 15px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
}

.event-title {
  font-size: 32px;
  font-weight: bold;
  text-transform: uppercase;
}

.tags-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.event-tag,
.event-age-tag {
  background: rgba(255, 255, 255, 0.3);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 14px;
}

.stars {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  font-size: 22px;
}

.full-star {
  color: gold;
}
.half-star {
  color: gold;
  opacity: 0.6;
}
.empty-star {
  color: gray;
}

.event-content {
  display: flex;
  width: 90%;
  margin-top: 20px;
  gap: 20px;
}

.event-image-carousel {
  flex: 1;
  border-radius: 10px;
  overflow: hidden;
}

.event-image {
  width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
}

.event-description-container {
  text-align: center;
  max-width: 80%;
  margin-top: 20px;
}
.event-descriptions {
}
.event-description {
  font-size: 16px;
  line-height: 1.6;
}

.toggle-btn {
  background: none;
  border: none;
  color: #ffb74d;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}
.event-tags,
.event-age-tag {
  display: inline-block;
  background: #222;
  color: white;
  padding: 5px 15px;
  margin: 5px;
  font-size: 14px;
  border-radius: 5px;
}

.event-content {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.event-details {
  flex: 1;
  padding: 20px;
  border-radius: 8px;
  padding: 15px;
  color: black;
}

.event-details h3 {
  margin-bottom: 10px;
  color: #d32f2f;
}

.event-info p {
  font-size: 16px;
  margin: 10px 0;
}

.event-artists {
  margin-top: 20px;
  text-align: center;
}

.event-artists h3 {
  color: #d32f2f;
}

.artist-item {
  display: inline-block;
  background: #eeeeee;
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
}
.toggle-btn {
  background: none;
  border: none;
  color: blue;
  cursor: pointer;
  display: block;
  margin: 10px auto; /* Căn giữa */
}
.event-tickets {
  margin-top: 20px;
  text-align: center;
}

.ticket-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.book-btn {
  margin-top: 10px;
  padding: 8px 15px;
  background: #d32f2f;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.book-btn:hover {
  background: #b71c1c;
}

.book-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #ccc;
}

.event-image-carousel {
  flex: 1;
  border-radius: 8px;
}

.event-image-slide img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.swiper-button-prev,
.swiper-button-next {
  color: white;
  font-size: 20px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 50%;
}

.swiper-button-prev {
  left: 10px;
}

.swiper-button-next {
  right: 10px;
}

.swiper-button-prev:hover,
.swiper-button-next:hover {
  background: rgba(0, 0, 0, 0.9);
}
.stars {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
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

.event-description {
  margin-top: 20px;
  text-align: justify;
  white-space: pre-line;
}

.toggle-btn {
  background: none;
  border: none;
  color: #ffcc00;
  cursor: pointer;
  display: block;
  margin: 10px auto;
}

.event-tickets {
  margin-top: 20px;
  text-align: center;
}

.ticket-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
}

.ticket-card {
  padding: 15px;
  border-radius: 5px;
  text-align: center;
  background: #cfe2cd;
  color: black;
}

.book-btn {
  margin-top: 10px;
  padding: 8px 15px;
  background: #ffcc00;
  color: black;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-weight: bold;
}

.book-btn:hover {
  background: #e6b800;
}
</style>
