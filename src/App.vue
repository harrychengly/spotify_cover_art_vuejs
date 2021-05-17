<template>
  <v-app>
    <Header />
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Header from "./components/Header";

export default {
  name: "App",
  components: {
    Header: Header,
  },
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
