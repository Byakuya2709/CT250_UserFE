<template>
  <div class="bg-gradient-to-b from-purple-600 to-pink-500 text-white">
    <!-- Hero Section -->
    <section class="text-center py-16">
      <h1 class="text-4xl font-bold">Chào mừng đến với EventHub</h1>
      <p class="mt-4">
        Nền tảng đặt vé sự kiện hàng đầu giúp bạn trải nghiệm những khoảnh khắc
        tuyệt vời nhất!
      </p>
      <div class="mt-6">
        <router-link to="/events" class="bg-pink-600 px-6 py-3 rounded-full">
          Xem Sự Kiện
        </router-link>
      </div>
    </section>
  </div>

  <!-- Sự kiện sắp tới -->
  <section class="py-16">
    <h2 class="text-3xl font-bold text-center">Sự Kiện Sắp Diễn Ra</h2>
    <div v-if="eventInCurrentMonth.length" class="mt-8 px-4 rounded-lg">
      <div class="flex justify-center">
        <div
          class="grid gap-6"
          :class="{
            'grid-cols-3': eventInCurrentMonth.length >= 3,
            'grid-cols-2': eventInCurrentMonth.length === 2,
            'grid-cols-1': eventInCurrentMonth.length === 1,
          }"
        >
          <div
            v-for="event in eventInCurrentMonth"
            :key="event.eventId"
            @click="toDetail(event.eventId)"
            class="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-blue-500"
          >
            <img
              :src="
                event.eventImageURL ??
                'https://res.cloudinary.com/dtza0pk4w/image/upload/v1736700339/mbs_ortxmh.jpg'
              "
              class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              alt="Event Image"
            />
            <div class="p-4 space-y-2 bg-gray-100">
              <h5 class="text-lg font-medium text-gray-900 truncate">
                {{ event.eventTitle }}
              </h5>
              <p class="text-sm text-gray-600">
                📅 {{ new Date(event.eventStartDate).toLocaleDateString() }}
                <br />📍 {{ event.eventAddress }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 text-base mt-6">
      Không có sự kiện nào trong tháng này.
    </div>
  </section>

  <!-- Thanh toán VNPAY -->
  <div
    class="make-event-container bg-gradient-to-b from-purple-600 to-pink-500"
  >
    <div class="make-event-content">
      <img
        src="/src/assets/vnpay.png"
        style="width: 200px; height: 200px"
        class="event-image"
      />
      <div class="event-text">
        <h2 class="text-2xl font-bold">Thanh toán trực tuyến</h2>
        <p class="text-2xl">Hỗ trợ thanh toán trực tuyến qua VNPAY.</p>
        <!-- <button class="create-event-btn">Create Events</button> -->
      </div>
    </div>
  </div>

  <!-- Danh sách blog -->
  <section class="py-16">
    <h2 class="text-3xl font-bold text-center mb-8">Bài Viết Gần Đây</h2>
    <div class="container mx-auto px-4">
      <div class="flex justify-center">
        <div
          class="grid gap-6"
          :class="{
            'grid-cols-5': blogs.length >= 5,
            'grid-cols-4': blogs.length === 4,
            'grid-cols-3': blogs.length === 3,
            'grid-cols-2': blogs.length === 2,
            'grid-cols-1': blogs.length === 1,
          }"
        >
          <div
            v-for="blog in blogs"
            :key="blog.blogId"
            class="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 hover:shadow-2xl hover:border-blue-500"
            @click="goBlogDetail(blog)"
          >
            <img
              :src="blog.eventListImgURL[0]"
              alt="Blog image"
              class="w-full h-48 object-cover"
            />
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-800">
                {{ blog.blogSubject }}
              </h3>
              <p class="text-gray-600 text-sm mt-2 truncate">
                {{ blog.blogContent }}
              </p>
              <div class="text-gray-500 text-xs mt-3">
                {{ new Date(blog.blogCreateDate).toLocaleDateString() }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { api } from "@/api/Api";

export default {
  data() {
    return {
      blogs: [],
      loading: true,
      error: null,
      eventInCurrentMonth: [],
    };
  },
  methods: {
    goBlogDetail(blog) {
      this.$router.push(`/events/${blog.eventId}/blogs/${blog.blogId}`);
    },
    async fetchCurrentMonthEvents() {
      try {
        const response = await api.get("/public/current-month");
        this.eventInCurrentMonth = response.data.data;
      } catch (error) {
        this.error = "Lỗi khi lấy danh sách sự kiện top-rated";
        console.error(error);
      }
    },
    async fetchBlogsRecent() {
      try {
        const response = await api.get(`/blogs/recent`);
        this.blogs = response.data;
        console.log(this.blogs);
      } catch (error) {
        this.$toast.error(error.response?.data?.message || "Đã xảy ra lỗi");
      }
    },
    toDetail(eventId) {
      this.$router.push({ path: `/events/${eventId}` });
    },
  },
  async mounted() {
    await this.fetchCurrentMonthEvents();
    await this.fetchBlogsRecent();
    this.loading = false;
  },
};
</script>

<style scoped>
.make-event-container {
  background: #f3e8ff;
  padding: 40px;
  display: flex;
  justify-content: center;
}

.make-event-content {
  display: flex;
  align-items: center;
  gap: 20px;
  max-width: 900px;
}

.event-image {
  width: 200px;
}
</style>
