<template>
  <v-form ref="form" @submit.prevent="submitForm">
    <v-text-field
      :value="playlistLink"
      :placeholder="$LOCAL('LINK_FORM_PLACEHOLDER')"
      :rules="rules"
      outlined
      dark
      autocomplete="off"
      @input="handleInputChange"
      :full-width="true"
      :success-messages="successMessage"
    />
    <v-btn dark color="#191414" :disabled="!valid" @click="generateArt">
      Generate
    </v-btn>
  </v-form>
</template>

<script>
export default {
  name: "LinkForm",
  data() {
    return {
      valid: false, // Check if input is valid
      rules: [
        (value) => {
          // Link cannot be empty
          this.valid = value !== "";
          return this.valid || "Playlist link is required";
        },
        (value) => {
          // Link must be valid
          this.valid =
            (value.length === 76 || value.length === 82) &&
            value.match(this.$LOCAL("LINK_REGEX")) !== null;
          return this.valid || this.$LOCAL("LINK_INVALID");
        },
      ],
    };
  },
  props: {
    playlistLink: {
      type: String,
      default: "",
    },
  },
  computed: {
    successMessage() {
      return this.valid ? "Playlist link is valid" : "";
    },
  },
  methods: {
    /**
     * Handle input change.
     * Emit link-change event to HomePage and mutate playlistLink value.
     */
    handleInputChange(value) {
      this.$emit("link-change", value);
    },

    /**
     * Log user out and delete tokens
     */
    logOut() {
      // TODO: Remove Tokens
      this.$router.push({ name: "Home" });
    },

    /**
     * Emit generate-art event to HomePage and generate word cloud.
     */
    async generateArt() {
      this.$emit("generate-art");
    },

    async submitForm() {
      const isValid = this.$refs.form.validate()
      if (isValid) {
        await this.generateArt()
      }
    }
  },
};
</script>

<style scoped lang='scss'>
::v-deep input {
  text-align: center;
}
</style>