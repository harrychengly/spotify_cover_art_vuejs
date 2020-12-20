<template>
  <v-app>
    <Header />
    <v-main>
      <HomePage/>
    </v-main>
  </v-app>
</template>

<script>
import Header from './components/Header'
import HomePage from './layout/HomePage'

export default {
  name: 'App',
  components: {
    'HomePage': HomePage,
    'Header': Header
  }
};
</script>
