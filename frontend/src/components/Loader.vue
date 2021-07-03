<template>
  <div class="loader">
    <v-container fill-height justify-center>
      <v-progress-circular
      v-show="isLoading"
      :size="70"
      :width="7"
      color="grey darken-4"
      indeterminate
      ></v-progress-circular>
    </v-container>
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
