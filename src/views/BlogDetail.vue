<template>
  <div class="flex gap-4">
    <div
      style="min-width: 900px"
      class="mx-auto p-6 bg-white border border-gray-300 rounded-xl shadow-sm"
    >
      <!-- Header -->
      <div class="flex items-center gap-3 mb-4">
        <div class="w-12 h-12 bg-gray-300 rounded-full"></div>
        <div>
          <p class="text-gray-400 font-semibold">@{{ blog.blogUserId }}</p>
        </div>
      </div>

      <!-- Tiêu đề -->
      <h1 class="text-xl font-bold text-gray-900 mb-3">
        {{ blog.blogSubject }}
      </h1>

      <!-- Nội dung bài viết -->
      <p class="text-gray-800 text-lg leading-relaxed mb-4">
        {{ blog.blogContent }}
      </p>
      <p class="text-sm text-gray-500">#{{ blog.blogType }}</p>

      <!-- Hình ảnh bài viết -->
      <div
        v-if="blog.eventListImgURL?.length"
        class="grid grid-cols-2 gap-2 mb-4 grid-auto-rows-[1fr]"
      >
        <template
          v-for="(img, index) in blog.eventListImgURL.slice(0, 4)"
          :key="img"
        >
          <div
            class="relative group cursor-pointer"
            @click="openImageViewer(index)"
          >
            <img
              :src="img"
              class="w-full h-auto aspect-[4/3] object-cover rounded-lg border"
            />
            <div
              v-if="index === 3 && blog.eventListImgURL.length > 4"
              class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-lg font-semibold rounded-lg"
            >
              +{{ blog.eventListImgURL.length - 4 }}
            </div>
          </div>
        </template>
      </div>

      <!-- Modal xem ảnh -->
      <div
        v-if="showImageViewer"
        class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      >
        <div class="relative max-w-4xl w-full p-4">
          <button
            @click="closeImageViewer"
            class="absolute top-2 right-2 text-white text-2xl"
          >
            &times;
          </button>
          <img
            :src="blog.eventListImgURL[currentImageIndex]"
            class="max-h-[80vh] w-auto mx-auto rounded-lg"
          />
          <div class="flex justify-between mt-4">
            <button
              v-if="currentImageIndex > 0"
              @click="prevImage"
              class="text-white text-lg"
            >
              ⬅ Trước
            </button>
            <button
              v-if="currentImageIndex < blog.eventListImgURL.length - 1"
              @click="nextImage"
              class="text-white text-lg"
            >
              Tiếp ➡
            </button>
          </div>
        </div>
      </div>

      <!-- Nút like -->
      <button
        @click="likeBlog"
        class="flex items-center gap-2 text-gray-500 hover:text-red-500 transition"
      >
        ❤️ {{ blog.blogEmotionsNumber }}
      </button>

      <!-- Bình luận -->
      <div class="mt-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-3">Bình luận</h2>
        <div
          v-for="comment in comments"
          :key="comment.cmtId"
          class="flex gap-3 p-3 border-b"
        >
          <div>
            <img
              v-if="userCache[comment.cmtUserId]?.imageURL"
              :src="userCache[comment.cmtUserId].imageURL"
              class="w-10 h-10 object-cover rounded-full border"
            />
            <div v-else class="w-10 h-10 bg-gray-300 rounded-full"></div>
          </div>
          <div class="flex-1">
            <p class="text-gray-800 font-semibold">
              {{
                userCache[comment.cmtUserId]?.userName || "Người dùng ẩn danh"
              }}
            </p>
            <p class="text-gray-800 text-sm">{{ comment.cmtContent }}</p>
            <small class="text-gray-500 block mt-1">{{
              new Date(comment.cmtCreateDate).toLocaleString()
            }}</small>
          </div>
        </div>

        <!-- Nút Xem thêm bình luận -->
        <div v-if="!lastPage" class="text-center mt-4">
          <button
            @click="loadMoreComments"
            class="text-blue-500 hover:underline text-sm"
          >
            Xem thêm bình luận
          </button>
        </div>
      </div>

      <!-- Phân trang bình luận -->
      <div class="flex justify-between mt-4">
        <button
          v-if="page > 0"
          @click="prevPage"
          class="text-blue-500 hover:underline text-sm"
        >
          Trước
        </button>
        <button
          v-if="!lastPage"
          @click="nextPage"
          class="text-blue-500 hover:underline text-sm"
        >
          Sau
        </button>
      </div>
    </div>

    <div style="max-width: 600px" class="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 class="text-lg font-semibold text-gray-700 mb-3">Bài viết gần đây</h2>
      <div class="recent-blogs-container">
        <div v-for="blog in blogs" :key="blog.blogId" class="blog-card">
          <h3 class="text-md font-semibold text-gray-800">
            {{ blog.blogSubject }}
          </h3>
          <p class="text-sm text-gray-600">
            {{
              blog.expanded
                ? blog.blogContent
                : blog.blogContent.substring(0, 100) + "..."
            }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
/* Thanh cuộn tùy chỉnh */
.recent-blogs-container {
  @apply max-h-80 overflow-y-auto space-y-3 px-2;
  scrollbar-width: thin;
  scrollbar-color: #64748b #f1f5f9;
  scroll-behavior: smooth;
}

.recent-blogs-container::-webkit-scrollbar {
  @apply w-2;
}
.recent-blogs-container::-webkit-scrollbar-thumb {
  @apply bg-gray-500 rounded-md;
}
.recent-blogs-container::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-600;
}
.recent-blogs-container::-webkit-scrollbar-track {
  @apply bg-gray-300 rounded-md;
}

/* Hiệu ứng hover thẻ bài viết */
.blog-card {
  @apply bg-white p-3 rounded-lg shadow-md border border-gray-200 transition-transform duration-300 hover:scale-105 hover:shadow-lg;
}

/* Hiệu ứng hover nhẹ nhàng */
button {
  transition: all 0.2s ease-in-out;
}
button:hover {
  transform: scale(1.05);
}
</style>

<script>
import { api } from "@/api/Api";
export default {
  data() {
    return {
      blogs: [],
      blog: {},
      event: {},
      comments: [],
      page: 0,
      size: 10,
      lastPage: false,
      userCache: {},

      showImageViewer: false,
      currentImageIndex: 0,
    };
  },
  methods: {
    openImageViewer(index) {
      this.currentImageIndex = index;
      this.showImageViewer = true;
    },
    closeImageViewer() {
      this.showImageViewer = false;
    },
    prevImage() {
      if (this.currentImageIndex > 0) {
        this.currentImageIndex--;
      }
    },
    nextImage() {
      if (this.currentImageIndex < this.blog.eventListImgURL.length - 1) {
        this.currentImageIndex++;
      }
    },
    async fetchBlog() {
      try {
        const response = await api.get(`/blogs/${this.$route.params.blogId}`);
        this.blog = response.data.data;
      } catch (error) {
        this.$toast.error(error.response?.data?.message || "Đã xảy ra lỗi");
      }
    },
    async fetchBlogsRecent() {
      try {
        const response = await api.get(`/blogs/recent`);
        this.blogs = response.data;
      } catch (error) {
        this.$toast.error(error.response?.data?.message || "Đã xảy ra lỗi");
      }
    },
    async fetchComments() {
      if (this.lastPage) return;
      try {
        const response = await api.get(
          `/blogs/${this.$route.params.blogId}/comment?page=${this.page}&size=${this.size}`
        );
        console.log(response)
        const newComments = response.data.data.content;
        this.comments = newComments;
        this.lastPage = response.data.data.last;
        this.fetchUserDetails(newComments);
      } catch (error) {
        this.$toast.error(error.response?.data?.message || "Đã xảy ra lỗi");
      }
    },
    async fetchUserDetails(comments) {
      const userIdsToFetch = comments
        .map((comment) => comment.cmtUserId)
        .filter((userId) => !this.userCache[userId]); // Chỉ lấy những user chưa có trong cache

      if (userIdsToFetch.length === 0) return; // Nếu tất cả user đã có trong cache thì không gọi API

      try {
        const userPromises = userIdsToFetch.map((userId) =>
          api.get(`/users/info/${userId}`)
        );

        const userResponses = await Promise.all(userPromises);

        // Cập nhật userCache
        const newUserCache = { ...this.userCache };
        userResponses.forEach((response, index) => {
          newUserCache[userIdsToFetch[index]] = response.data.data;
        });

        this.userCache = newUserCache;
      } catch (error) {
        console.error("Lỗi lấy thông tin người dùng:", error);
      }
    },
    async likeBlog() {
      try {
        const userId = this.$route.params.companyId; // Lấy userId từ dữ liệu hiện có
        const res = await api.post(`/blogs/${this.blog.blogId}/emotion`, null, {
          params: { userId }, // Gửi userId qua query parameters
        });
        const updatedBlog = res.data;
        console.log(updatedBlog);

        // Cập nhật lại danh sách blogs
        this.blog =updatedBlog;
        
      } catch (error) {
        this.$toast.error(
          error.response?.data?.message || "Lỗi khi thích bài viết"
        );
      }
    },
    loadMoreComments() {
      this.page += 1;
      this.fetchComments();
    },
    prevPage() {
      if (this.page > 0) {
        this.page -= 1;
        this.fetchComments();
      }
    },
    nextPage() {
      if (!this.lastPage) {
        this.page += 1;
        this.fetchComments();
      }
    },
  },
  mounted() {
    this.fetchBlog();
    this.fetchComments();
    this.fetchBlogsRecent();
  },
};
</script>
