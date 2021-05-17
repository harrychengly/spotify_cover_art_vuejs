<template>
  <v-app>
    <Header />
    <v-main>
      <v-snackbar 
        :value="this.error"
        color="error"
        bottom
        left
      >
        {{error}}
      </v-snackbar>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import 'vue-swatches/dist/vue-swatches.css'
import { mapState } from "vuex"
import Header from './components/Header'

export default {
  name: "App",
  components: {
    'Header': Header
  },
  computed: {
    ...mapState('home', [
      'error',
    ]),
  }
};
</script>

<style>
@font-face {
  font-family: "Gotham Bold";
  src: local("Gotham Bold"), url(./fonts/Gotham/GothamBold.ttf) format("truetype");
}

@font-face {
  font-family: "Gotham Light";
  src: local("Gotham Light"), url(./fonts/Gotham/GothamLight.ttf) format("truetype");
}

@font-face {
  font-family: "Gotham Medium";
  src: local("Gotham Medium"), url(./fonts/Gotham/GothamMedium.ttf) format("truetype");
}
</style>
