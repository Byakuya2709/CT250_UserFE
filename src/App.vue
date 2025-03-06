<script setup>
import { onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import { useAuthStore } from "./stores/pina";

const authStore = useAuthStore();

onMounted(() => {
  authStore.hydrate();
});
</script>

<template>
  <Header></Header>

  <div class="router-view-container">
    <RouterView />
  </div>

<Footer></Footer>
</template>

<style>

.router-view-container {

}

</style>
