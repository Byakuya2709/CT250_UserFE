<template>
  <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
    Vé Điện Tử Của Bạn
  </h2>
  <div class="p-6 bg-white shadow-lg rounded-lg">
    <loading :active="loading" />

    <div v-if="tickets.length === 0" class="text-center text-gray-500">
      Bạn chưa mua vé nào.
    </div>

    <div v-else class="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="ticket in tickets"
        :key="ticket.ticketId"
        class="p-6 border rounded-lg shadow-md bg-gray-50 relative overflow-hidden"
      >
        <div
          class="flex flex-col md:flex-row justify-between items-center border-b pb-4 mb-4"
        >
          <div>
            <h3 class="text-2xl font-semibold text-gray-800">
              {{ ticket.eventTitle }}
            </h3>
            <p class="text-gray-600 text-sm mt-2">
              Ngày đặt:
              <span class="font-semibold">{{
                formatDate(ticket.ticketBookingTime)
              }}</span>
            </p>
          </div>

          <span
            class="px-3 py-1 text-sm font-medium rounded-lg mt-2 md:mt-0"
            :class="{
              'bg-green-100 text-green-700': ticket.ticketStatus === 'PAID',
              'bg-red-100 text-red-700': ticket.ticketStatus === 'UNPAID',
              'bg-yellow-100 text-yellow-700':
                ticket.ticketStatus === 'CANCELLED',
            }"
          >
            {{
              ticket.ticketStatus === "PAID"
                ? "Đã Thanh Toán"
                : ticket.ticketStatus === "CANCELLED"
                ? "Đã Hủy"
                : "Chưa Thanh Toán"
            }}
          </span>
        </div>
        <div class="ticket-detail flex flex-col md:flex-row">
          <div class="flex-1">
            <p class="text-gray-700 text-lg font-medium">
              Mã Vé:
              <span class="font-bold text-blue-600"
                >#{{ ticket.ticketId }}</span
              >
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
              Loại vé:
              <span class="font-bold">{{ ticket.ticketDuration }}</span>
            </p>
            <p class="text-gray-700 text-lg font-medium">
              Thời gian đặt:
              <span class="font-bold">{{
                formatDate(ticket.ticketBookingTime)
              }}</span>
            </p>
            <p class="text-gray-700 text-lg font-medium">
              Ngày có hiệu lực:
              <span class="font-bold">{{
                formatDate(ticket.ticketDayActive)
              }}</span>
            </p>
            <p class="text-gray-700 text-lg font-medium">
              Ngày hết hiệu lực:
              <span class="font-bold">{{
                formatDate(ticket.ticketExpiredTime)
              }}</span>
            </p>
          </div>
          <div class="mt-4 flex justify-center md:justify-end">
            <img
              v-if="ticket.qrCodeBase64"
              :src="ticket.qrCodeBase64"
              alt="QR Code"
              class="w-32 h-32"
            />
            <p v-else class="text-gray-500">Không có QR Code</p>
          </div>
        </div>

        <div class="text-center mt-4 text-gray-700">
          <p class="font-medium">
            Trạng thái đánh giá:
            <span
              :class="{
                'text-green-600': ticket.isRating,
                'text-red-600': !ticket.isRating,
              }"
            >
              {{ ticket.isRating ? "Đã đánh giá" : "Chưa đánh giá" }}
            </span>
          </p>
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
        <div
          v-if="
            ticket.ticketStatus === 'PAID' &&
            new Date(ticket.ticketExpiredTime) <= new Date() &&
            ticket.isRating == false
          "
          class="mt-4 flex justify-center"
        >
          <button
            @click="openReviewModal(ticket)"
            class="px-4 py-2 bg-yellow-500 text-white rounded-lg"
          >
            Đánh giá sự kiện
          </button>
        </div>
      </div>
    </div>

    <template v-if="showReviewModal">
      <div
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div class="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-96">
          <h2 class="text-xl font-bold mb-2">Đánh giá sự kiện</h2>
          <p class="text-sm text-red-500 mb-4">
            *Bạn chỉ được đánh giá một lần và không thể chỉnh sửa hoặc xóa.
          </p>

          <textarea
            v-model="reviewData.fbContent"
            class="w-full p-2 border rounded-lg"
            placeholder="Nhập nội dung đánh giá..."
          ></textarea>
          <div class="flex items-center mt-4">
            <span class="mr-2">Chấm điểm:</span>
            <select v-model="reviewData.fbRate" class="border p-2 rounded-lg">
              <option v-for="i in 5" :key="i" :value="i">{{ i }}⭐</option>
            </select>
          </div>
          <div class="flex justify-end gap-2 mt-4">
            <button
              @click="closeReviewModal"
              class="px-4 py-2 bg-gray-300 rounded-lg"
            >
              Hủy
            </button>
            <button
              @click="submitReview"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Gửi đánh giá
            </button>
          </div>
        </div>
      </div>
    </template>

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

<style scoped>
.ticket-detail {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
@media (min-width: 768px) {
  .ticket-detail {
    flex-direction: row;
  }
}
</style>
<script>
import { api } from "@/api/Api";
import format from "date-fns/format";
import differenceInDays from "date-fns/differenceInDays";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
export default {
  components: { Loading },
  props: {
    userInfo: Object,
  },
  data() {
    return {
      reviewData: {
        ticketId: null,
        eventId: null,
        fbUserId: this.userInfo.id || this.$route.params.userId, // Giả sử userInfo.id đã có trong state
        fbContent: "",
        fbCreateDate: "",
        fbRate: 5,
      },
      showReviewModal: false,

      userId: "",
      tickets: [],
      loading: false,
      error: null,
      page: 1,
      size: 10,
      totalPages: 1, // Cho phép chọn số lượng vé mỗi trang
    };
  },
  watch: {},
  methods: {
    openReviewModal(ticket) {
      this.reviewData.ticketId = ticket.ticketId;
      this.reviewData.eventId = ticket.eventId;
      this.reviewData.fbContent = "";
      this.fbCreateDate = new Date().toISOString();
      this.showReviewModal = true;
    },
    closeReviewModal() {
      this.reviewData.ticketId = null;
      this.reviewData.eventId = null;
      (this.reviewData.fbContent = ""),
        (this.fbCreateDate = null),
        (this.showReviewModal = false);
    },
    async submitReview() {
      this.loading = true;
      try {
        const res = (await api.post("/blogs/feedback", this.reviewData)).data
          .data;

        const ratingData = {
          eventId: res.eventId,
          userId: res.fbUserId,
          star: res.fbRate,
        };

        const ticketId = res.ticketId;
        const response = await api.patch(
          `/tickets/rating/${ticketId}`,
          ratingData
        );
        const updatedTicket = response.data.data;
        console.log(updatedTicket);

        // Cập nhật lại danh sách vé
        this.tickets = this.tickets.map((ticket) => {
          if (ticket.ticketId === updatedTicket.ticketId) {
            console.log("Updating ticket:", ticket);
            return updatedTicket;
          }
          return ticket;
        });

        this.$toast.success(response.data.message);
        this.closeReviewModal(); // Đóng modal sau khi gửi đánh giá
      } catch (error) {
        this.$toast.error(error.response?.data?.message || "Đã xảy ra lỗi");
      } finally {
        this.loading = false;
      }
    },
    async fetchTickets() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(
          `/tickets/buy/${this.$route.params.userId}?page=${
            this.page - 1
          }&size=${this.size}`
        );

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
        const res = await api.patch(`/tickets/${ticketId}`);
        this.$toast.success("Đã gửi yêu càu vé.");
        const updatedTicket = res.data.data;
        // Cập nhật vé trong danh sách thay vì xóa nhầm
        this.tickets = this.tickets.map((ticket) =>
          ticket.ticketId === ticketId ? updatedTicket : ticket
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
      if (this.page === this.totalPages) return; // Fixed the comparison here
      else {
        this.page++;
        this.fetchTickets();
      }
    },
  },
  mounted() {
    this.fetchTickets();
  },
};
</script>
