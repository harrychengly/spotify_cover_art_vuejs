<template>
  <v-container fluid class="body-wrapper">
    <transition name="drop">
      <div v-if="show" class="form-wrapper">
        <div v-if="userIsLoggedIn">
          <VueTyper
            :pre-type-delay="600"
            :repeat="0"
            text="where art 🎨 meets music 🎵"
          />
          <LinkForm
            :playlistLink="playlistLink"
            @link-change="handleLinkChange"
            @generate-art="generateArt"
          />
          <HelperModal />
        </div>
        <div v-else>
          <VueTyper
            :pre-type-delay="600"
            erase-style='clear'
            :repeat="0"
            :text='["Hello 👋", "We make art 🎨 with music 🎵", "Log in to continue 😄"]'
          />
          <v-btn :link="true" href="http://localhost:8888/login" color="success">
            Log in with Spotify
          </v-btn>
        </div>
      </div>
    </transition>
  </v-container>
</template>

<script>
import { VueTyper } from 'vue-typer'
import { mapState, mapActions } from "vuex"

import LinkForm from "../components/LinkForm"
import HelperModal from "../components/HelperModal"

export default {
  name: "HomePage",
  components: {
    LinkForm,
    HelperModal,
    VueTyper
  },
  data() {
    return {
      show: false,
      playlistLink: '',
    };
  },
  computed: {
    ...mapState('home', [
      'artists',
      'userIsLoggedIn',
      'error',
    ]),
    /**
     * Retrieves the playlistId from the playlist link
     */
    playlistId() {
      return this.playlistLink.split("?")[0].split("/")[4]
    }
  },
  mounted() {
    this.show = true
  },

  methods: {
    ...mapActions('home', [
      'setTokens',
      'retrievePlaylistArtists',
    ]),

    /**
     * Change value of playlistLink when there is an input change in LinkForm
     */
    handleLinkChange(value) {
      this.playlistLink = value
    },

    /**
     * Generate the playlist art
     */
    async generateArt () {
      this.$router.push({ path: 'result', query: { playlistId: this.playlistId }})
    },

    // async convertTobase64() {
    //   const urlParams = new URLSearchParams(window.location.search);
    //   const access_token = urlParams.get("access_token");
    //   var canvas = document.getElementById("my_canvas");
    //   var dataURL = canvas.toDataURL();
    //   var strImage = dataURL.replace(/^data:image\/[a-z]+;base64,/, "");
    //   try {
    //     await axios.put(
    //       "http://localhost:8888/change_image/?access_token=" + access_token + "&playlist_id=" + this.playlistId,
    //       {
    //         data: {
    //           img: strImage,
    //         },
    //       }
    //     );
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },

    downloadCoverImage() {
      var canvas = document.getElementById("my_canvas");
      var image = canvas
        .toDataURL("image/png", 1.0)
        .replace("image/png", "image/octet-stream");
      var link = document.createElement("a");
      link.download = "my-coverart.png";
      link.href = image;
      link.click();
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/styles/colors.scss";

.body-wrapper {
  display: flex;
  height: 100%;
  justify-content: center;
  background-color: $light-white;

  .form-wrapper {
    text-align: center;
    position: absolute;
    top: 30%;
    width: 30rem;

    & .tagline-text {
      font-size: 2.5rem;
    }
  }
}

.vue-typer {
  display: block;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.drop-enter-active {
  animation: drop-fade-in 1s ease-in-out;
}

@keyframes drop-fade-in {
  0% {
    opacity: 0;
    top: 15%;
  }
  100% {
    opacity: 1;
    top: 30%;
  }
}
</style>