<template>
  <div class="qouter-wrapper" v-show="activeQuote.author">
      <v-container fill-height>
          <v-card class="mx-auto my-12 main-card" max-width="1000">
            <v-row wrap align="center">
                <v-col cols="12" sm="12" md="8" class="px-5 myQuote qtSections" align="center">
                    <v-icon color="primary" size="50">mdi-format-quote-open</v-icon>
                    <p class="ma-5 primary--text">{{activeQuote.content}}</p>
                </v-col>
                <v-col cols="12" sm="12" md="4" class="px-5 white--text teal accent-3 qouteInfo qtSections" align="center">
                    <h1 class="mb-5 .text-md-subtitle-1'">Rate this quote by</h1>
                    <a class="white--text" :href="`https://www.google.com/search?q=${activeQuote.author}`" target="_blank">{{activeQuote.author}}</a>
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

import { mapState } from "vuex";

export default {
  name: 'Quoter',
  components: {
  },
  data: () => ({
      rating: 0
  }),
  methods: {
    getQuote: function() {
        if(this.rating > 0){
            let rateObj = {
                rating: this.rating,
                qtData: this.activeQuote
            };
        
            this.$store.dispatch('quotesModule/rateQuote', rateObj);
            this.rating = 0;
            return;
        }

        this.$store.dispatch('quotesModule/getQuote');

    }
  },
  computed: {
    ...mapState('quotesModule', ['activeQuote'])
  },
  beforeMount() {
      this.$store.dispatch('quotesModule/getQuote');
  },
};
</script>


<style scoped>

p {
    font-size: 1.5em;
    font-family: 'Yellowtail';
}

h1 {
    font-weight: 500;
}

h1, a, button {
    font-size: 25px;
    font-family: 'Prompt';
}

a {
    font-weight: 600;
    text-decoration: none;
}
.main-card {
    overflow:hidden;
    width: 100%;
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
