<template>
  <div class="event-calendar-container">
    <vue-cal
      :events="events"
      :time="false"
      default-view="month"
      @cell-click="onCellClick"
    />
    <div v-if="loading" class="loading-spinner">Loading...</div>
  </div>
</template>

<script>
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import { api } from "@/api/Api";

export default {
  components: {
    VueCal,
  },
  props: {
    userInfo: Object,
  },
  data() {
    return {
      events: [],
      user: { ...this.userInfo },
      loading: false,
    };
  },
  mounted() {
    // Removed initial fetch here.
    // We'll fetch in the watcher after user info is available
  },
  watch: {
    userInfo: {
      handler(newValue) {
        // Only update user if a valid object is received
        if (newValue && Object.keys(newValue).length > 0) {
          this.user = { ...newValue };
          this.fetchTickets(); // Fetch tickets when user info changes
        }
      },
      deep: true,
      immediate: true, // Run the handler immediately when the component mounts
    },
  },
  methods: {
    async fetchTickets() {
      console.log("Fetching tickets for user:", this.user);
      if (!this.user || !this.user.id) {
        console.warn("User ID is missing. Skipping ticket fetch.");
        return; // Exit early if user ID is missing
      }

      this.loading = true;
      try {
        const response = await api.get(
          `/tickets/buy/${this.user.id}?page=0&size=50`
        );
        console.log("Tickets fetched:", response.data.data.content);
        this.events = response.data.data.content
          .filter((ticket) => ticket.ticketStatus === "PAID") // Lọc chỉ những ticket đã thanh toán
          .map((ticket) => ({
            start: new Date(ticket.ticketDayActive),
            end: new Date(ticket.ticketExpiredTime),
            title: `#${ticket.ticketId} - ${ticket.eventTitle}`, // Hiển thị ticketId kèm tiêu đề
            class: "paid-ticket",
          }));
      } catch (error) {
        console.error("Error fetching tickets:", error);
        this.$toast.error(
          error.response?.data?.message || "Failed to fetch tickets"
        );
      } finally {
        this.loading = false;
      }
    },
    onCellClick(event) {
      if (event.startDate) {
        const selectedDate = event.startDate;
        console.log("Chuyển đến ngày:", selectedDate);

        // Di chuyển đến ngày/tháng được chọn
        this.$refs.calendar.moveToDate(selectedDate);
      }
    },
  },
};
</script>

<style>
/* Đổi màu ô có sự kiện */
.vuecal__cell--current {
  background-color: #e5e8a8 !important;
  border-radius: 5px;
}

.event-calendar-container {
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
}

.loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5em;
  color: #000;
}
.vuecal__cell-content {
  font-size: 1.1em; /* Tăng kích thước chữ */
  padding: 10px; /* Tăng khoảng cách trong ô */
}
.vuecal {
  height: 700px; /* Tăng chiều cao lịch */
  font-size: 1.2em; /* Phóng to chữ */
}
/* Màu xanh lá cho vé đã thanh toán */
.vuecal__event.paid-ticket {
  color: #28a745 !important; /* Xanh lá */
  font-weight: bold;
}
</style>
