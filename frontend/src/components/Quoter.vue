<template>
  <div class="qouter-wrapper">
      <v-container fill-height>
          <v-card class="mx-auto my-12 main-card" max-width="1000">
            <v-row wrap align="center">
                <v-col cols="12" sm="12" md="8" class="px-5 myQuote qtSections" align="center">
                    <v-icon color="primary" size="50">mdi-format-quote-open</v-icon>
                    <p class="ma-5 primary--text">The one thing that you have that nobody else has is you. Your voice, your mind, your story, your vision. So write and draw and build and play and dance and live as only you can. The one thing that you have that nobody else has is you. Your voice, your mind, your story, your vision. So write and draw and build and play and dance and live as only you can.</p>
                </v-col>
                <v-col cols="12" sm="12" md="4" class="px-5 white--text teal accent-3 qouteInfo qtSections" align="center">
                    <h1 class="mb-5 .text-md-subtitle-1'">Rate this quote by</h1>
                    <a class="white--text" href="https://www.google.com/search?q=john%20cena" target="_blank">Albert Einstein</a>
                    <v-rating
                    v-model="rating"
                    hover
                    background-color="grey lighten-2"
                    color="yellow darken-3"
                    empty-icon="$ratingFull"
                    length="5"
                    size="30"
                    value="0"
                    :class="['mt-5', {ratingSelected: rating > 0}]"
                    >
                    </v-rating>
                    <v-btn @click="getQuote" id="newQuoteBtn" depressed :class="['mt-5 grey darken-4 white--text', {ratingSelected: rating > 0}]">
                        New Quote
                    </v-btn>
                </v-col>
            </v-row>
        </v-card>
      </v-container>
  </div>
</template>

<script>

export default {
  name: 'Quoter',
  components: {
  },
  data: () => ({
      rating: 0
  }),
  methods: {
    getQuote: function(){
        this.rating = 0;
    }
  }
};
</script>


<style>

p {
    font-size: 1.5em;
    font-family: 'Yellowtail';
}

h1 {
    font-weight: 500;
}

h1, a {
    font-size: 25px;
    font-family: 'Prompt';
}

a {
    font-weight: 600;
    text-decoration: none;
}
.main-card {
    overflow:hidden;
}

.qouter-wrapper {
    height: 100%;
}

.qouteInfo {
    padding: 60px 0;
}

.v-rating.ratingSelected {
    pointer-events: none;
}
</style>
