<template>
  <div class="container mt-7 border border-black p-4 rounded-lg">
    <h4
      class="mb-4 text-2xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl"
    >
      Lịch Sự Kiện
    </h4>
    <EventCalendar :userInfo="userInfo" />
  </div>
</template>

<script>
import EventCalendar from "@/components/EventCalendar.vue";

export default {
  props: {
    userInfo: Object,
  },
  data() {
    return {
      user: { ...this.userInfo },
    };
  },
  watch: {
    userInfo: {
      handler(newValue) {
        // Only update user if a valid object is received
        if (newValue && Object.keys(newValue).length > 0) {
          this.user = { ...newValue };
        }
      },
      deep: true,
      immediate: true, // Run the handler immediately when the component mounts
    },
  },
  components: {
    EventCalendar,
  },
};
</script>
