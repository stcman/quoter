<template>
  <v-app class="grey darken-4">
    <Loader />
    <Errors />
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
import Errors from './components/Errors.vue';
import { mapState } from "vuex";

export default {
  name: 'App',
  components: {
    Loader,
    Errors,
    Navbar,
    Quoter,
  },
  data: () => ({
  }),
  computed: {
    ...mapState('globalModule', ['isLoading'])
  }
};
</script>


<style>
  
</style>
