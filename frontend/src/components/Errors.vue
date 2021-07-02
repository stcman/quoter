<template>
    <div class="err-wrapper">
        <v-snackbar
        v-model="showSnack"
        timeout="10000"
        color="red"
        >
            <span>{{globalErrMsg}}</span>
        </v-snackbar>
    </div>
</template>

<script>

import { mapState } from "vuex";

export default {
    name: "Errors",
    data(){
        return{
            
        }
    },
    methods: {},
    computed: {
        ...mapState('globalModule', ['globalErrMsg']),
        showSnack: {
            get() {
                return this.$store.state.globalModule.showSnack;
            },
            set(v) {
                this.$store.commit('globalModule/updateShowSnack', v)
            }
        }
    },
}
</script>