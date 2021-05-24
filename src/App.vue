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
  },
};
</script>

<style>
@font-face {
  font-family: "Gotham Bold";
  src: local("Gotham Bold"), url(./fonts/Gotham/Gotham-Bold.otf) format("opentype");
}

@font-face {
  font-family: "Gotham Light";
  src: local("Gotham Light"), url(./fonts/Gotham/Gotham-Light.otf) format("opentype");
}

@font-face {
  font-family: "Gotham Thin";
  src: local("Gotham Thin"), url(./fonts/Gotham/Gotham-Thin.otf) format("opentype");
}

@font-face {
  font-family: "Gotham Book";
  src: local("Gotham Book"), url(./fonts/Gotham/Gotham-BookItalic.otf) format("opentype");
}
</style>
