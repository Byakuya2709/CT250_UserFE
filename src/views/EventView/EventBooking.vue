<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h2 class="modal-title">Đặt vé sự kiện</h2>
      <p class="event-info"><strong>Sự kiện:</strong> {{ event.eventTitle }}</p>
      <p class="event-info">
        <strong>Giá vé:</strong>
        {{ event.eventPrice.toLocaleString("vi-VN") }} VND
      </p>

      <label for="zone" class="label">Chọn khu vực:</label>
      <select v-model="selectedZone" @change="filterSeats" class="dropdown">
        <option v-for="zone in zones" :key="zone.zoneId" :value="zone">
          {{ zone.zoneName }} (Còn {{ zone.remainingCapacity }} chỗ)
        </option>
      </select>

      <div v-if="selectedZone" class="seat-container">
        <h3>
          Chọn ghế trong khu vực {{ selectedZone.zoneName }} ( x
          {{ selectedZone.zoneRate }} % giá vé)
        </h3>
        <div class="seat-grid">
          <button
            v-for="seat in availableSeats"
            :key="seat"
            :class="{
              seat: true,
              selected: selectedSeats.includes(seat),
              paid: bookedSeats[seat] === 'PAID',
              unpaid: bookedSeats[seat] === 'UNPAID',
            }"
            :disabled="
              bookedSeats[seat] === 'PAID' || bookedSeats[seat] === 'UNPAID'
            "
            @click="toggleSeat(seat)"
          >
            {{ seat.split("_")[1] }}
          </button>
        </div>
      </div>

      <div v-if="selectedSeats.length > 0" class="ticket">
        <div class="ticket-header">Vé Sự Kiện</div>
        <div class="ticket-body">
          <p><strong>Sự kiện:</strong> {{ event.eventTitle }}</p>
          <p><strong>Khu vực:</strong> {{ selectedZone.zoneName }}</p>
          <p><strong>Ghế:</strong> {{ selectedSeats.join(", ") }}</p>
          <p>
            <strong>Giá vé:</strong>
            {{ formattedPrice }}
            VND
          </p>
          <p><strong>Thanh toán:</strong> Chưa Thanh Toán - UNPAID</p>
          <p><strong>Loại vé:</strong> Single Day - Day {{ this.day.day }}</p>
          <p>
            <strong>Ngày kích hoạt:</strong>
            {{ formatDate(event.eventStartDate) }}
          </p>
        </div>
      </div>

      <button
        @click="bookTicket"
        :disabled="selectedSeats.length === 0"
        class="confirm-btn"
      >
        Xác nhận đặt {{ selectedSeats.length }} vé
      </button>
      <button class="close-btn" @click="$emit('close')">Đóng</button>

      <a
        v-if="paymentUrl"
        :href="paymentUrl"
        target="_blank"
        class="btn btn-primary"
      >
        Thanh toán ngay
      </a>
    </div>
  </div>
</template>

<style scoped>
p,lable,select {
  color: black!important;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 25px;
  border-radius: 12px;
  width: 1000vw;
  max-width: 1000px;
  height: 900px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.3s ease-in-out;
}

.modal-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 15px;
}

.label {
  font-size: 16px;
  font-weight: bold;
  display: block;
  margin: 10px 0;
}

.dropdown {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #f8f9fa;
}

.seat-container {
  margin-top: 15px;
}

.seat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
  gap: 8px;
  margin-top: 20px;
}

.seat {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: #e0e0e0;
  border: 2px solid transparent;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s;
}

.seat:hover {
  background-color: #d6d6d6;
}

.seat.selected {
  background-color: #28a745;
  color: white;
  border-color: #1e7e34;
}

.seat.paid {
  background-color: #dc3545;
  color: white;
  cursor: not-allowed;
  opacity: 0.7;
}

.seat.unpaid {
  background-color: #007bff;
  color: white;
}

.ticket {
  background: #f8f9fa;
  border: 2px dashed #333;
  padding: 15px;
  margin-top: 35px;
  border-radius: 10px;
  text-align: left;
}

.ticket-header {
  background: #333;
  color: white;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  padding: 8px;
  border-radius: 6px 6px 0 0;
}

.ticket-body {
  padding: 10px;
  font-size: 16px;
}

.confirm-btn {
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  padding: 12px 20px;
  margin-top: 15px;
  transition: 0.3s;
}

.confirm-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.close-btn {
  background-color: #6c757d;
  color: white;
  margin-top: 10px;
  padding: 10px 20px;
  border-radius: 6px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

<script>
import { api } from "@/api/Api";
import { useToast } from "vue-toastification";
import dayjs from "dayjs";
export default {
  props: {
    event: Object,
    day: Object, // day là số nguyên
  },
  data() {
    return {
      selectedSeats: [],
      allBookedSeats: {}, // Lưu toàn bộ dữ liệu ghế ngay từ đầu
      bookedSeats: {}, // Chứa ghế đã đặt theo khu vực
      zones: [],
      selectedZone: null,
      availableSeats: [],
      paymentUrl: null,
      userInfo: {},
    };
  },
  computed: {
    user() {
      return this.$authStore.user;
    },
    formattedPrice() {
      return (
        this.event.eventPrice * this.selectedZone.zoneRate
      ).toLocaleString("vi-VN");
    },
    amountInt() {
      return Math.round(this.event.eventPrice * this.selectedZone.zoneRate); // Chuyển thành số nguyên
    },
  },
  async mounted() {
    await this.fetchZones();
    await this.fetchAllSeats();
    await this.fetchUserInfo(); // Chỉ fetch API một lần
  },
  watch: {
    day() {
      this.fetchZones();
      this.fetchAllSeats();
      this.fetchUserInfo();
    },
  },
  methods: {
    async fetchUserInfo() {
      try {
        const res = await api.get(`/users/${this.user.id}`);
        console.log(res.data);
        this.userInfo = res.data.data;
      } catch (error) {
        this.$toast.error(
          error.response?.data?.message ||
            "Đã xảy ra lỗi khi tải thông tin người dùng"
        );
      }
    },
    async fetchZones() {
      try {
        const response = await api.get(`/booking/zone/${this.event.eventId}`, {
          params: { day: this.day.day },
        });
        this.zones = response.data.data;
        console.log(response);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Không thể kết nối đến hệ thống.",
          { position: "top-right" }
        ); // Toast lỗi
      }
    },
    async fetchAllSeats() {
      try {
        const [response, res] = await Promise.all([
          api.get(`/tickets/${this.event.eventId}`, {
            params: { day: this.day.day },
          }),
          api.get(`/tickets/${this.event.eventId}/all`),
        ]);

        const bookedTickets = response.data.data || [];
        const allSeats = res.data.data || [];
        const allDaysTickets = allSeats.filter(
          (ticket) => ticket.ticketDuration === "ALL_DAYS"
        );

        const mergedArray = bookedTickets.concat(allDaysTickets);

        this.allBookedSeats = mergedArray.reduce((acc, ticket) => {
          acc[ticket.ticketPosition] = ticket.ticketStatus;
          return acc;
        }, {});
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Không thể kết nối đến hệ thống.",
          { position: "top-right" }
        ); // Toast lỗi
      }
    },
    filterSeats() {
      if (!this.selectedZone) return;
      // Giữ lại các ghế có ticketPosition bắt đầu bằng tên khu vực được chọn (selectedZone.zoneName).
      this.bookedSeats = Object.fromEntries(
        Object.entries(this.allBookedSeats).filter(([seat]) =>
          seat.startsWith(this.selectedZone.zoneName)
        )
      );
      this.availableSeats = Array.from(
        { length: this.selectedZone.zoneCapacity },
        (_, i) => `${this.selectedZone.zoneName}_${i + 1}`
      );
      this.selectedSeats = [];
    },
    toggleSeat(seat) {
      if (
        this.bookedSeats[seat] === "PAID" ||
        this.bookedSeats[seat] === "UNPAID"
      ) {
        return; // Không cho chọn ghế đã thanh toán hoặc chưa thanh toán
      }

      if (this.selectedSeats.includes(seat)) {
        this.selectedSeats = [];
      } else {
        this.selectedSeats = [seat]; // Chỉ chọn 1 ghế
      }
    },

    async bookTicket() {
      const toast = useToast();
      if (this.selectedSeats.length > 0) {
        const ticket = {
          eventId: this.event.eventId,
          userId: this.userInfo.id,
          userEmail: this.userInfo.userMail,
          ticketPrice: this.event.eventPrice,
          day: this.day.day,
          ticketPosition: this.selectedSeats[0],
          ticketDuration: "SINGLE_DAY",
          ticketZone: this.selectedZone.zoneName,
        };
        try {
          const response = await api.post(`/booking/ticket`, ticket);

          toast.info(
            response.data.message + ". Vui lòng thanh toán trong 15 phút",
            { position: "top-right" }
          ); // Toast thành công

          const ticketId = response.data.data.ticketId;
          const body = {
            userId: this.user.id,
            receiverId: this.event.eventCompanyId,
            paymentDescrption:
              "Thanh toán vé sự kiện: " + this.event.eventTitle,
            eventId: this.event.eventId,
            ticketId: ticketId,
          };

          const params = {
            amount: this.amountInt,
          };

          const res = await api.post(`/payment`, body, {
            params: params,
          });
          this.paymentUrl = res.data; // Lưu vào biến

          console.log("URL Thanh toán:", this.paymentUrl);
        } catch (error) {
          toast.error(
            error.response?.data?.message || "Không thể kết nối đến hệ thống.",
            { position: "top-right" }
          ); // Toast lỗi
        }
      }
    },
    formatDate(date) {
      return dayjs(date).add(this.day.day, "day").format("YYYY-MM-DD HH:mm:ss");
    },
  },
};
</script>
