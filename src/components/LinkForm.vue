<template>
  <v-form>
    <v-text-field
      outlined
      color="success"
      :placeholder="$LOCAL('LINK_FORM_PLACEHOLDER')"
      :model="link"
      class="link-text-field mt-4"
      autocomplete="off"
      :clearable="true"
      :rules="[validateInput]"
      :error-messages="invalidLinkError"
      @input="handleInputChage"
      :full-width="true"
    ></v-text-field>
    <v-btn
      color="success"
      :disabled="invalidLinkError !== ''"
      @click="generateArt"
      >Generate</v-btn
    >
    <v-btn color="secondary" @click="loginSpotify"></v-btn>
    <a href="http://localhost:8888/login" class="btn btn-primary"
      >Log in with Spotify</a
    ><br />
  </v-form>
</template>

<script>
// import Vue from "vue";
import axios from "axios";

export default {
  name: "LinkForm",
  data() {
    return {
      link: "",
      invalidLinkError: "",
      formDirty: false,
      email: "",
    };
  },

  computed: {
    user() {
      return this.$store.getters.getUser;
    },
  },
  methods: {
    handleInputChage(value) {
      this.formDirty = true;
      this.link = value;
    },
    validateInput() {
      if (this.formDirty) {
        if (
          this.link &&
          this.link.match(this.$LOCAL("LINK_REGEX")) &&
          this.link.length === 82
        ) {
          this.invalidLinkError = "";
          return true;
        }
        this.invalidLinkError = this.$LOCAL("LINK_INVALID");
        return false;
      }
      return true;
    },

    logOut() {
      this.$store.commit("mutateUser", null);
      this.$router.push({ name: "Home" });
    },

    async generateArt() {
      // generateArt() {
      const urlParams = new URLSearchParams(window.location.search);
      const access_token = urlParams.get("access_token");

      const playlistUrl = this.link;

      const playlistId = playlistUrl.split("?")[0].split("/")[4];
      this.$parent.playlistId = playlistId

      const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

      const config = {
        headers: { Authorization: "Bearer " + access_token },
      };

      const res = await axios.get(url, config);
    //   console.log(res.data);

      var bodyItems = res.data.items;
      var bodyItemsLen = Object.keys(bodyItems).length;

      var artistsObj = {};

      for (let i = 0; i < bodyItemsLen; i++) {
        var artists = bodyItems[i]["track"]["artists"];
        artists.forEach((element) => {
          if (element.name in artistsObj) {
            artistsObj[element.name] += 1;
          } else {
            artistsObj[element.name] = 1;
          }
        });
      }
var list = Object.entries(artistsObj)
      this.$emit("generate-art", list);
      //   console.log(this.$parent.getElementById("my_canvas"))
      //   WordCloud(this.$parent.getElementById("my_canvas"), { list: list });
    },

    async loginSpotify() {
      try {
        const config = {
          headers: { "Access-Control-Allow-Origin": "*" },
        };
        const { access_token, refresh_token } = await axios.get(
          "http://localhost:8888/login",
          config
        );
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
      } catch (error) {
        console.log(error);
      }
    },
  },

  async created() {
    if (this.$route.query) {
      await axios
        .get(
          "https://api.spotify.com/v1/playlists/2pQfOsK5FheoNZlN67akuB/tracks",
          {
            headers: {
              Authorization: "Bearer " + this.$route.query.access_token,
            },
          }
        )
        .then((response) => {
          this.$store.commit("mutateUser", response.data);
          console.log("Response from server: ");
          console.log(this.$store.state.user);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },
};
</script>

<style scoped lang="scss">
@import "@/styles/colors.scss";

.link-text-field {
  margin-top: 1rem;
}

::v-deep .link-text-field input {
  text-align: center;
}
</style>