<script>
import { api } from "@/api/Api";
import { eventTags } from "@/composable/eventTags";

export default {
  data() {
    return {
      topRatedEvents: [],
      eventsByTag: {},
      loading: true,
      error: null,
      eventInCurrentMonth: [],
    };
  },
  methods: {
    async fetchTopRatedEvents() {
      try {
        const response = await api.get("/public/top-rated");
        this.topRatedEvents = response.data;
      } catch (error) {
        this.error = "Lỗi khi lấy danh sách sự kiện top-rated";
        console.error(error);
      }
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
    async fetchEventsByTag() {
      try {
        const requests = eventTags.map((tag) =>
          api.get(`/public/tag`, { params: { tag: tag.value } })
        );

        const responses = await Promise.allSettled(requests);

        responses.forEach((result, index) => {
          if (result.status === "fulfilled" && result.value?.data?.data) {
            this.eventsByTag[eventTags[index].label] = result.value.data.data;
          } else {
            this.eventsByTag[eventTags[index].label] = [];
            console.warn(`Không có dữ liệu cho tag: ${eventTags[index].label}`);
          }
        });
      } catch (error) {
        this.error = "Lỗi khi lấy danh sách sự kiện theo tag";
        console.error(error);
      }
    },
    toDetail(eventId) {
      this.$router.push({ path: `/events/${eventId}` });
    },
    calculateAverageRating(eventRatingStart) {
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
    await this.fetchEventsByTag();
    await this.fetchCurrentMonthEvents();
    this.loading = false;
  },
};
</script>

<template>
  <div class="container mt-4">
    <h2 class="text-2xl font-semibold text-gray-800 mb-6">
      Những sự kiện sắp diễn ra
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
                        calculateAverageRating(event.eventRatingStart)
                      ),
                  }"
                  >⭐</span
                >
                <span class="rating-value"
                  >({{
                    calculateAverageRating(event.eventRatingStart)
                  }}/5)</span
                >
              </div>
              <p>
                📍 {{ event.eventAddress }}<br />📅
                {{ new Date(event.eventStartDate).toLocaleDateString()
                }}<br />💰
                <strong>{{ event.eventPrice.toLocaleString() }} VND</strong>
              </p>
              <button class="btn btn-primary" @click="toDetail(event.eventId)">
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

    <div
      v-if="eventInCurrentMonth.length"
      class="mt-8 bg-gray-100 py-8 px-4 rounded-lg"
    >
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">
        Sự kiện trong tháng ({{ eventInCurrentMonth.length }})
      </h2>

      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <div
          v-for="event in eventInCurrentMonth"
          :key="event.eventTitle + event.eventAddress"
          @click="toDetail(event.eventId)"
          class="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-blue-500"
        >
          <!-- Hiệu ứng nền khi hover -->
          <div
            class="absolute inset-0 bg-blue-100 opacity-0 transition-opacity duration-300 group-hover:opacity-30"
          ></div>

          <img
            :src="
              event.eventListImgURL ||
              'https://res.cloudinary.com/dtza0pk4w/image/upload/v1736700339/mbs_ortxmh.jpg'
            "
            class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
            alt="Event Image"
          />
          <div
            class="p-4 space-y-2 relative z-10 transition-colors duration-300 group-hover:bg-blue-50"
          >
            <h5
              class="text-lg font-medium text-gray-900 truncate transition-colors duration-300 group-hover:text-blue-600"
            >
              {{ event.eventTitle }}
            </h5>
            <p
              class="text-sm text-gray-600 transition-colors duration-300 group-hover:text-gray-800"
            >
              📅 {{ new Date(event.eventStartDate).toLocaleDateString() }}
              <br />📍 {{ event.eventAddress }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 text-base mt-6">
      Không có sự kiện nào trong tháng này.
    </div>

    <!-- 🎭 Events by Tag -->
    <div
      v-for="(events, tag) in eventsByTag"
      :key="tag"
      class="mt-8 bg-gray-100 px-4 rounded-lg"
    >
      <div v-if="events.length">
        <h2
          class="text-2xl font-semibold text-gray-800 mb-6"
          style="padding-top: 1%"
        >
          {{ tag }} ({{ events.length }})
        </h2>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <div
            v-for="event in events"
            :key="event.eventId"
            @click="toDetail(event.eventId)"
            class="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-blue-500"
          >
            <!-- Hiệu ứng nền khi hover -->
            <div
              class="absolute inset-0 bg-blue-100 opacity-0 transition-opacity duration-300 group-hover:opacity-30"
            ></div>

            <img
              :src="event.eventListImgURL[0]"
              class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              alt="Event Image"
            />
            <div
              class="p-4 space-y-2 relative z-10 transition-colors duration-300 group-hover:bg-blue-50"
            >
              <h5
                class="text-lg font-medium text-gray-900 truncate transition-colors duration-300 group-hover:text-blue-600"
              >
                {{ event.eventTitle }}
              </h5>
              <p
                class="text-sm text-gray-600 transition-colors duration-300 group-hover:text-gray-800"
              >
                📅 {{ new Date(event.eventStartDate).toLocaleDateString() }}
                <br />📍 {{ event.eventAddress }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.carousel-img {
  height: 400px;
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
