<template>
  <div class="loader">
    <v-progress-circular
      v-show="isLoading"
      :size="70"
      :width="7"
      color="black"
      indeterminate
    ></v-progress-circular>
  </div>
</template>

<script>

export default {
  name: 'Loader',
  data: () => {
    return {
      isLoading: false
    }
  },
  components: {
  }
}
</script>

<style>
</style>
