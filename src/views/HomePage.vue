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
    };
  },
  methods: {
    async fetchTopRatedEvents() {
      try {
        const response = await api.get("/events/top-rated");
        this.topRatedEvents = response.data;
      } catch (error) {
        this.error = "Lỗi khi lấy danh sách sự kiện top-rated";
        console.error(error);
      }
    },
    async fetchEventsByTag() {
      try {
        const requests = eventTags.map((tag) =>
          api.get(`/events/tag`, { params: { tag: tag.value } })
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
    this.loading = false;
  },
};
</script>

<template>
  <div class="container mt-4">
    <h2 class="mb-3 text-primary">🔥 Top Rated Events</h2>

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
              <a href="#" class="btn btn-primary">Xem chi tiết</a>
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

    <!-- 🎭 Events by Tag -->
    <div v-for="(events, tag) in eventsByTag" :key="tag" class="mt-5">
      <h2 class="text-success">{{ tag }}</h2>
      <div v-if="events.length === 0" class="alert alert-warning">
        Không có sự kiện
      </div>

      <div class="row">
        <div v-for="event in events" :key="event.eventId" class="col-md-4 mb-4">
          <div class="card shadow-sm">
            <img
              :src="event.eventListImgURL[0]"
              class="card-img-top"
              alt="Event Image"
            />
            <div class="card-body">
              <h5 class="card-title">{{ event.eventTitle }}</h5>
              <p class="card-text">
                📍 {{ event.eventAddress }}<br />
                📅 {{ new Date(event.eventStartDate).toLocaleDateString()
                }}<br />
                💰 <strong>{{ event.eventPrice.toLocaleString() }} VND</strong>
              </p>
              <a href="#" class="btn btn-success">Xem chi tiết</a>
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
