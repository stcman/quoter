<template>
  <div class="loader">
    <v-progress-circular
      v-show="isLoading"
      :size="70"
      :width="7"
      color="grey darken-4"
      indeterminate
    ></v-progress-circular>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: 'Loader',
  components: {
  },
  data: () => {
    return {
    }
  },
  computed: {
    ...mapState('globalModule', ['isLoading'])
  }
}
</script>

<style>
</style>
