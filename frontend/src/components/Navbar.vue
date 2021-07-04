<template>
    <nav>
        <v-app-bar app class="teal accent-3">
            <v-row justify="center">
                <v-toolbar-title class="text-uppercase white--text nav-toolbar">
                    <v-icon left class="white--text">mdi-recycle-variant</v-icon>
                    <span class="font-weight-light">Forever</span>
                    <span class="font-weight-medium">Quotes</span>
                </v-toolbar-title>
            </v-row>
        </v-app-bar>
    </nav>
</template>

<script>
export default {
    name: "Navbar",
    data(){
        return{
        }
    },
    methods: {}
}
</script>

<style scoped>
    .nav-toolbar {
        display: flex;
    }
</style>