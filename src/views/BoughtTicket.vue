<template>
  <div class="ticket-list">
    <h2>🎟️ Danh Sách Vé</h2>
    <div v-if="tickets" class="tickets-container">
      <div class="ticket-card" v-for="ticket in tickets" :key="ticket.ticketId">
        <!-- Header -->
        <div class="ticket-header">
          <span class="ticket-id">#{{ ticket.ticketId }}</span>
          <span
            class="ticket-status"
            :class="getStatusClass(ticket.ticketStatus)"
          >
            {{ ticket.ticketStatus }}
          </span>
        </div>

        <!-- Body -->
        <div class="ticket-body">
          <p>
            <strong>🎫 Giá:</strong>
            {{ ticket.ticketPrice.toLocaleString() }} VND
          </p>
          <p><strong>📍 Vị trí:</strong> {{ ticket.ticketPosition }}</p>
          <p>
            <strong>📅 Ngày hoạt động:</strong>
            {{ formatDate(ticket.ticketDayActive) }}
          </p>
        </div>

        <!-- Dotted Line Effect -->
        <div class="ticket-cut-line"></div>

        <!-- Footer (Nút Thanh Toán) -->
        <div class="ticket-footer">
          <button
            v-if="ticket.ticketStatus === 'UNPAID'"
            class="pay-button"
            @click="payTicket(ticket)"
          >
            💳 Thanh Toán Ngay
          </button>
        </div>
      </div>
    </div>
    <p v-else class="empty-message">Không có vé nào được tìm thấy.</p>
  </div>
</template>

<script>
import { api } from "@/api/Api";

export default {
  data() {
    return {
      tickets: [],
    };
  },
  mounted() {
    this.fetchTickets();
  },
  methods: {
    async fetchTickets() {
      try {
        const response = await api.get(`/tickets/${this.$route.params.userId}`);
        if (response.data.status === "OK") {
          this.tickets = response.data.data;
          console.log(this.tickets);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu vé:", error);
      }
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
    getStatusClass(status) {
      return {
        available: status === "Available",
        sold: status === "Sold",
        pending: status === "Pending",
        unpaid: status === "UNPAID",
      };
    },
    async payTicket(ticket) {
      try {
        const body = {
          userId: this.$route.params.userId,
          receiverId: ticket.companyId,
          paymentDescrption: "Thanh toán vé sự kiện: " + ticket.eventTitle,
          eventId: ticket.eventId,
          ticketId: ticket.ticketId,
        };
        const params = {
          amount: ticket.ticketPrice,
        };

        const res = await api.post(`/payment`, body, { params: params });
        const paymentUrl = res.data;

        // Hiển thị thông báo trước khi chuyển hướng
        this.$toast.success("Đang chuyển hướng đến trang thanh toán...", {
          timeout: 2000,
        });

        // Chuyển hướng sau 2 giây
        setTimeout(() => {
          window.location.href = paymentUrl;
        }, 2000);
      } catch (error) {
        console.error("Lỗi khi thanh toán:", error);
        this.$toast.error("Thanh toán thất bại, vui lòng thử lại!");
      }
    },
  },
};
</script>

<style scoped>
.ticket-list {
  max-width: 800px;
  margin: 20px auto;
  text-align: center;
}

h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.tickets-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
}

.ticket-card {
  background: #fef8e0; /* Màu giấy vàng nhẹ */
  border-radius: 16px;
  padding: 15px;
  width: 320px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  border: 2px solid #d4a373;
  font-family: "Courier New", Courier, monospace;
  position: relative;
}

.ticket-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

/* Đường đứt khúc */
.ticket-cut-line {
  width: 90%;
  height: 1px;
  background: repeating-linear-gradient(
    90deg,
    #999,
    #999 5px,
    transparent 5px,
    transparent 10px
  );
  margin: 10px auto;
}

/* Header */
.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  margin-bottom: 10px;
}

.ticket-id {
  font-size: 18px;
  color: #444;
}

.ticket-status {
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: bold;
}

/* Trạng thái vé */
.available {
  background-color: #28a745;
  color: white;
}

.sold {
  background-color: #dc3545;
  color: white;
}

.pending {
  background-color: #ffc107;
  color: black;
}

.unpaid {
  background-color: #ff5722;
  color: white;
}

/* Nội dung vé */
.ticket-body {
  text-align: left;
  font-size: 14px;
  margin-bottom: 10px;
}

.ticket-body p {
  margin: 5px 0;
}

/* Footer */
.ticket-footer {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

/* Nút thanh toán */
.pay-button {
  background: #ff5722;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.pay-button:hover {
  background: #e64a19;
}

/* Thông báo khi không có vé */
.empty-message {
  font-size: 16px;
  color: #777;
}
</style>
