<template>
  <v-dialog v-model="openModal" width="450">
    <template v-slot:activator="{ on, attrs }">
      <p class="helper-text" v-bind="attrs" v-on="on">How to get the link?</p>
    </template>
    <v-card>
      <v-card-title>
        <h3>How to obtain playlist link?</h3>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="gif-wrapper">
        <v-img src="@/assets/how-to-get-link.gif" />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="openModal = false">I understand</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'HelperModal',
  data () {
    return {
      openModal: false
    }
  }
}
</script>

<style scoped lang="scss">

.helper-text {
  cursor: pointer;
  width: fit-content;
  margin: 0.3rem auto;

  &:hover {
    text-decoration: underline;
  }
}

.gif-wrapper {
    text-align: center;
    margin-top: 2rem;
}

</style>