<template>
  <div
    class="max-w-2xl mx-auto p-6 bg-white border border-gray-300 rounded-xl shadow-sm"
  >
    <!-- Header -->
    <div class="flex items-center gap-3 mb-4">
      <!-- Avatar giả lập -->
      <div class="w-12 h-12 bg-gray-300 rounded-full"></div>
      <div>
        <p class="text-gray-400 font-semibold">@{{ blog.blogUserId }}</p>
      </div>
    </div>

    <!-- Tiêu đề -->
    <h1 class="text-xl font-bold text-gray-900 mb-3">{{ blog.blogSubject }}</h1>

    <!-- Nội dung bài viết -->
    <p class="text-gray-800 text-lg leading-relaxed mb-4">
      {{ blog.blogContent }}
    </p>
    <p class="text-sm text-gray-500">#{{ blog.blogType }}</p>
    <!-- Hình ảnh bài viết -->
    <div
      v-if="blog.eventListImgURL?.length"
      class="grid grid-cols-2 gap-2 mb-4"
    >
      <img
        v-for="img in blog.eventListImgURL"
        :key="img"
        :src="img"
        class="w-full h-48 object-cover rounded-lg border"
      />
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
        <!-- Avatar và thông tin người dùng -->
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
            {{ userCache[comment.cmtUserId]?.userName || "Người dùng ẩn danh" }}
          </p>
          <p class="text-gray-800 text-sm">{{ comment.cmtContent }}</p>
          <small class="text-gray-500 block mt-1">
            {{ new Date(comment.cmtCreateDate).toLocaleString() }}
          </small>
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
</template>

<script>
import { api } from "@/api/Api";

export default {
  data() {
    return {
      blog: {},
      comments: [],
      page: 0,
      size: 10,
      lastPage: false,
      userCache: {},
    };
  },
  methods: {
    async fetchBlog() {
      try {
        const response = await api.get(`/blogs/${this.$route.params.blogId}`);
        this.blog = response.data.data;
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
    likeBlog() {
      //   this.blog.blogEmotionsNumber += 1;
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
  },
};
</script>

<style scoped>
/* Hiệu ứng hover nhẹ nhàng */
button {
  transition: all 0.2s ease-in-out;
}
button:hover {
  transform: scale(1.05);
}
</style>
