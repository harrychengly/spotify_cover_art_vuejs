<template>
  <v-container fluid class="body-wrapper">
    <transition name="drop">
      <div v-if="show" class="form-wrapper">
        <div v-if="userIsLoggedIn">
          <VueTyper
            :pre-type-delay="600"
            :repeat="0"
            text="create spotify playlist art ⬜"
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
            erase-style="clear"
            :repeat="0"
            :text="[
              'hello 👋',
              'create spotify playlist art ⬜',
              'login to continue 😄',
            ]"
          />
          <v-btn
            dark
            :link="true"
            href="https://covrr-spotify.herokuapp.com/login"
            color="#191414"
          >
            Login with Spotify
          </v-btn>
        </div>
      </div>
    </transition>
  </v-container>
</template>

<script>
import { VueTyper } from "vue-typer";
import { mapState, mapActions } from "vuex";

import LinkForm from "../components/LinkForm";
import HelperModal from "../components/HelperModal";

export default {
  name: "HomePage",
  components: {
    LinkForm,
    HelperModal,
    VueTyper,
  },
  data() {
    return {
      show: false,
      playlistLink: "",
    };
  },
  computed: {
    ...mapState("home", ["artists", "userIsLoggedIn", "error"]),
    /**
     * Retrieves the playlistId from the playlist link
     */
    playlistId() {
      return this.playlistLink.split("?")[0].split("/")[4];
    },
  },
  mounted() {
    this.show = true;
  },

  methods: {
    ...mapActions("home", ["setTokens", "retrievePlaylistArtists"]),

    /**
     * Change value of playlistLink when there is an input change in LinkForm
     */
    handleLinkChange(value) {
      this.playlistLink = value;
    },

    /**
     * Generate the playlist art
     */
    async generateArt() {
      this.$router.push({
        path: "result",
        query: { playlistId: this.playlistId },
      });
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/colors.scss";

.body-wrapper {
  display: flex;
  height: 100%;
  justify-content: center;
  background: linear-gradient(120deg, #1db954,30%, #191414);

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
  font-family: "Gotham Book", Times, sans-serif;
  display: block;
  font-size: 2rem;
  margin-bottom: 1rem;
  color: $light-white;
}

.vue-typer .custom.char.typed {
  color: $light-white;
}

.vue-typer .custom.caret.typing {
  background-color: $light-white;
}
.vue-typer .custom.caret.selecting {
  display: inline-block;
  background-color: $light-white;
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