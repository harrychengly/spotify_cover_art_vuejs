<template>
  <v-container fluid class="body-wrapper">
    <transition name="drop">
      <div v-if="show" class="form-wrapper">
        <div v-if="userIsLoggedIn">
          <VueTyper
            :pre-type-delay="600"
            :repeat="0"
            text="where art 🎨 meets music 🎵."
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
            :text='["Hello 👋.", "We make art 🎨 with music 🎵.", "Log in to continue 😄."]'
          />
          <v-btn :link="true" href="http://localhost:8888/login" color="success">
            Log in with Spotify
          </v-btn>
        </div>
      </div>
    </transition>
    <!-- <div>
      <canvas
        id="my_canvas"
        width="300"
        height="300"
        style="border: 1px solid #000000"
        ref="canvas"
      ></canvas>
    </div>
    <v-btn
      color="success"
      :loading="this.buttonLoading"
      @click="convertTobase64"
      >Set as Spotify playlist cover</v-btn
    >
    <v-btn color="success" @click="downloadCoverImage">Download cover</v-btn>

    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" dark v-bind="attrs" v-on="on">
            Customise Cover
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">Customise cover</span>
          </v-card-title>
          <v-card-text>
            <v-color-picker
              elevation="1"
              class="mr-auto ml-auto"
              width="500"
              v-model="color"
            ></v-color-picker>
            <v-radio-group v-model="radioGroup">
              <v-radio label="Circle" color="success" value="circle"></v-radio>
              <v-radio label="Square" color="success" value="square"></v-radio>
              <v-radio label="Diamond" color="success" value="diamond"></v-radio>
              <v-radio label="Heart" color="success" value="cardioid"></v-radio>
              <v-radio label="Star" color="success" value="star"></v-radio>
              <v-radio label="Pentagon" color="success" value="pentagon"
              ></v-radio>
            </v-radio-group>

            <v-radio-group v-model="radioTextColorGroup">
              <v-radio
                label="Dark texts"
                color="success"
                value="random-dark"
              ></v-radio>
              <v-radio
                label="Light texts"
                color="success"
                value="random-light"
              ></v-radio>
            </v-radio-group>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">
              Close
            </v-btn>
            <v-btn color="blue darken-1" text @click="dialog = false">
              Save
            </v-btn>
          </v-card-actions >
        </v-card>
      </v-dialog>
    </v-row> -->
  </v-container>
</template>

<script>
import WordCloud from "wordcloud"
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

      dialog: false,
      type: "hex",
      hex: "#FF00FF",
    };
  },
  computed: {
    ...mapState('home', [
      'artists',
      'userIsLoggedIn'
    ]),
    color: {
      get() {
        return this[this.type];
      },
      set(v) {
        this[this.type] = v;
      },
    },
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
      'retrievePlaylistArtists'
    ]),
    /**
     * Change value of playlistLink when there is an input change in LinkForm
     */
    handleLinkChange(value) {
      this.playlistLink = value
    },
    async generateArt () {
      await this.retrievePlaylistArtists(this.playlistId)
    },
    generateWordCloud(list) {
      var options = {
        gridSize: 4,
        weightFactor: 5,
        fontFamily: "Hiragino Mincho Pro, serif",
        color: this.radioTextColorGroup,
        // color: function (word, weight) {
        //   return weight === 12 ? "#f02222" : "#c09292";
        // },
        rotateRatio: 0.5,
        rotationSteps: 2,
        backgroundColor: this.hex,
        list: list,
        shape: this.radioGroup,
      };
      WordCloud(this.$refs["canvas"], options);
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