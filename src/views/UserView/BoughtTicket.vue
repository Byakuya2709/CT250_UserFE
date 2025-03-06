<template>
  <div class="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
    <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
      Vé Điện Tử Của Bạn
    </h2>

    <div v-if="loading" class="text-center text-gray-600">
      Đang tải dữ liệu...
    </div>
    <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>
    <div v-else-if="tickets.length === 0" class="text-center text-gray-500">
      Bạn chưa có vé nào.
    </div>

    <div v-else class="space-y-6">
      <div
        v-for="ticket in tickets"
        :key="ticket.ticketId"
        class="p-6 border rounded-lg shadow-md bg-gray-50 relative overflow-hidden"
      >
        <!-- Thiết kế kiểu vé điện tử -->
        <div
          class="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gray-200 rounded-full"
        ></div>
        <div
          class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gray-200 rounded-full"
        ></div>

        <div class="flex justify-between items-center border-b pb-4 mb-4">
          <h3 class="text-2xl font-semibold text-gray-800">VÉ ĐIỆN TỬ</h3>
          <span
            class="px-3 py-1 text-sm font-medium rounded-lg"
            :class="{
              'bg-green-100 text-green-700': ticket.ticketStatus === 'PAID',
              'bg-red-100 text-red-700': ticket.ticketStatus === 'UNPAID',
            }"
          >
            {{
              ticket.ticketStatus === "PAID"
                ? "Đã Thanh Toán"
                : "Chưa Thanh Toán"
            }}
          </span>
        </div>

        <p class="text-gray-700 text-lg font-medium">
          Mã Vé:
          <span class="font-bold text-blue-600">#{{ ticket.ticketId }}</span>
        </p>
        <p class="text-gray-700 text-lg font-medium">
          Giá:
          <span class="font-bold"
            >{{ ticket.ticketPrice.toLocaleString() }} VND</span
          >
        </p>
        <p class="text-gray-700 text-lg font-medium">
          Vị trí: <span class="font-bold">{{ ticket.ticketPosition }}</span>
        </p>
        <p class="text-gray-700 text-lg font-medium">
          Loại vé: <span class="font-bold">{{ ticket.ticketDuration }}</span>
        </p>
        <p class="text-gray-700 text-lg font-medium">
          Ngày hiệu lực:
          <span class="font-bold">{{
            formatDate(ticket.ticketDayActive)
          }}</span>
        </p>
        <p class="text-gray-700 text-lg font-medium">
          Thời gian đặt:
          <span class="font-bold">{{
            formatDate(ticket.ticketBookingTime)
          }}</span>
        </p>

        <div class="mt-4 flex justify-center">
          <img
            v-if="ticket.qrCodeBase64"
            :src="ticket.qrCodeBase64"
            alt="QR Code"
            class="w-32 h-32"
          />
          <p v-else class="text-gray-500">Không có QR Code</p>
        </div>

        <div
          v-if="ticket.ticketStatus === 'UNPAID'"
          class="mt-6 flex gap-3 justify-center"
        >
          <button
            :disabled="!canCancel(ticket)"
            @click="cancelTicket(ticket.ticketId)"
            class="px-4 py-2 bg-red-500 text-white rounded-lg disabled:bg-gray-400"
          >
            Hủy vé
          </button>
          <button
            @click="payTicket(ticket)"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Thanh toán ngay
          </button>
        </div>
      </div>
    </div>

    <!-- Điều khiển phân trang -->
    <div class="flex justify-between items-center mt-6">
      <button
        @click="prevPage"
        :disabled="page === 1"
        class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
      >
        Trang trước
      </button>
      <span class="text-gray-800 font-medium"
        >Trang {{ page }} / {{ totalPages }}</span
      >
      <button
        @click="nextPage"
        class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
      >
        Trang sau
      </button>
    </div>
  </div>
</template>

<script>
import { api } from "@/api/Api";
import format from "date-fns/format";
import differenceInDays from "date-fns/differenceInDays";

export default {
  data() {
    return {
      userId: "",
      tickets: [],
      loading: true,
      error: null,
      page: 1,
      size: 10,
      totalPages: 1, // Cho phép chọn số lượng vé mỗi trang
    };
  },
  methods: {
    async fetchTickets() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(
          `/tickets/buy/${this.$route.params.userId}?page=${
            this.page - 1
          }&size=${this.size}`
        );
        console.log(response.data.data.content);
        // Chuyển đổi QR Code byte[] thành Base64 ngay từ response
        this.tickets = response.data.data.content.map((ticket) => {
          if (ticket.qrCode) {
            ticket.qrCodeBase64 = `data:image/png;base64,${ticket.qrCode}`;
          } else {
            ticket.qrCodeBase64 = null;
          }
          return ticket;
        });

        this.totalPages = response.data.data.totalPages;
      } catch (err) {
        this.error = "Lỗi khi lấy dữ liệu vé!";
      } finally {
        this.loading = false;
      }
    },
    canCancel(ticket) {
      const eventDate = new Date(ticket.ticketDayActive);
      return differenceInDays(eventDate, new Date()) > 1;
    },
    formatDate(dateString) {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm");
    },
    async cancelTicket(ticketId) {
      try {
        await api.delete(`/tickets/${ticketId}`);
        this.$toast.success("Hủy vé thành công.");
        this.tickets = this.tickets.filter(
          (ticket) => ticket.ticketId !== ticketId
        );
      } catch (error) {
        this.$toast.error(error.response?.data?.message || "Đã xảy ra lỗi");
      }
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
    prevPage() {
      if (this.page > 1) {
        this.page--;
        this.fetchTickets();
      }
    },
    nextPage() {
      this.page++;
      this.fetchTickets();
    },
  },
  mounted() {
    this.fetchTickets();
  },
};
</script>
