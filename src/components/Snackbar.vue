<template>
  <div class="text-center ma-2">
    <v-snackbar :color="color" v-model="snackbar">
      {{ text }}
    </v-snackbar>
  </div>
</template>

<script>
export default {
  data: () => ({ snackbar: true }),

  props: {
    text: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: "success",
    },
  },
};
</script>
