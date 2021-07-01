<template>
  <v-app class="grey darken-4">
    <Loader />
    <Navbar />
    <v-main class="grey darken-4 pa-5">
      <Quoter :class="{isLoading}"/>
    </v-main>
  </v-app>
</template>

<script>

import './css/style.css';
import Loader from './components/Loader.vue';
import Navbar from './components/Navbar.vue';
import Quoter from './components/Quoter.vue';

export default {
  name: 'App',
  components: {
    Loader,
    Navbar,
    Quoter,
  },
  data: () => ({
    isLoading: false
  }),
};
</script>


<style>
  
</style>
