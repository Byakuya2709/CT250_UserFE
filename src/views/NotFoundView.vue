<template>
  <div class="not-found py-4">
    <h1>404 - Page Not Found</h1>
    <p>Oops! The page you are looking for does not exist.</p>
    <router-link to="/" class="home-link">
      <button>Go Back to Home</button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "NotFoundView",
};
</script>

<style scoped>
.not-found {
  text-align: center;
  margin-top: 100px;
}

.not-found h1 {
  font-size: 3em;
  color: #ff5252;
  margin-bottom: 20px;
}

.not-found p {
  font-size: 1.2em;
  margin-bottom: 30px;
}

.home-link button {
  background-color: #42b983;
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 1em;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.home-link button:hover {
  background-color: #358a6d;
}
</style>
