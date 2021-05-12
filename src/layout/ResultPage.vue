<template>
  <v-container fluid class="body-wrapper">
    <div>
      <canvas
        id="my_canvas"
        width="300"
        height="300"
        style="border: 1px solid #000000"
        ref="canvas"
      ></canvas>
    </div>

    <v-row justify="center">
      <div id="undoWrapper" tabindex="0">
        <v-card>
          <v-card-title>
            <h2>Customise your cover</h2>
          </v-card-title>
          <v-card-text>
            <h3 class="mb-5">Color</h3>
            <v-color-picker
              elevation="1"
              class="mr-auto ml-auto"
              width="500"
              :value="artSetting.backgroundColor"
              @input="changeBackgroundColor"
            ></v-color-picker>

            <h3 class="mt-3">Shape</h3>
            <v-radio-group :value="artSetting.shape" @change="changeShape">
              <v-radio label="Circle" color="success" value="circle"></v-radio>
              <v-radio label="Square" color="success" value="square"></v-radio>
              <v-radio
                label="Diamond"
                color="success"
                value="diamond"
              ></v-radio>
              <v-radio label="Heart" color="success" value="cardioid"></v-radio>
              <v-radio label="Star" color="success" value="star"></v-radio>
              <v-radio
                label="Pentagon"
                color="success"
                value="pentagon"
              ></v-radio>
            </v-radio-group>
             <h3 class="mt-3">Text Color</h3>
            <v-radio-group
              :value="artSetting.textColor"
              @change="changeTextColor"
            >
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
              <h3 class="mt-3">Text Size</h3>
            <v-slider
              :min="minTextSize"
              :max="maxTextSize"
              :value="artSetting.textSize"
              @change="changeTextSize"
              ticks="always"
              :tick-labels="tickLabels"
            >
            </v-slider>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="success"
              :loading="this.buttonLoading"
              @click="convertTobase64"
              >Set as Spotify playlist cover</v-btn
            >
            <v-btn color="success" @click="downloadCoverImage"
              >Download cover</v-btn
            >
          </v-card-actions>
        </v-card>
      </div>
    </v-row>
  </v-container>
</template>


<script>
import WordCloud from "wordcloud";
import { mapState, mapActions } from "vuex";
import axios from "axios";

export default {
  name: "ResultPage",
  components: {},
  data() {
    return {
      artSetting: {
        textColor: "#000",
        backgroundColor: "#fff",
        shape: "circle",
        textSize: 5,
      },
      buttonLoading: false,
      minTextSize: 1,
      maxTextSize: 10,
      tickLabels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],

      undo: [],
    };
  },
  computed: {
    ...mapState("home", ["artists"]),
  },
  mounted() {
    this.generateWordCloud(this.artists);

    document.querySelector("#undoWrapper").addEventListener("keydown", (e) => {
      if (this.getOS() === "Mac OS") {
        if (e.metaKey && e.key === "z") {
          this.undoArtSetting();
        }
      } else if (this.getOS() === "Windows" || this.getOS() === "Linux") {
        if (e.ctrlKey && e.key === "z") {
          this.undoArtSetting();
        }
      }
    });
  },

  methods: {
    ...mapActions("home", ["setTokens", "retrievePlaylistArtists"]),
    /**
     * Change value of playlistLink when there is an input change in LinkForm
     */

    getOS() {
      var userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
        windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
        iosPlatforms = ["iPhone", "iPad", "iPod"],
        os = null;

      if (macosPlatforms.indexOf(platform) !== -1) {
        os = "Mac OS";
      } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = "iOS";
      } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = "Windows";
      } else if (/Android/.test(userAgent)) {
        os = "Android";
      } else if (!os && /Linux/.test(platform)) {
        os = "Linux";
      }

      return os;
    },

    handleLinkChange(value) {
      this.playlistLink = value;
    },
    async generateArt() {
      await this.retrievePlaylistArtists(this.playlistId);
    },

    changeBackgroundColor(color) {
      this.addUndoState();
      this.artSetting.backgroundColor = color;
      this.generateWordCloud(this.artists);
    },

    changeShape(shape) {
      this.addUndoState();
      this.artSetting.shape = shape;
      this.generateWordCloud(this.artists);
    },

    changeTextColor(textColor) {
      this.addUndoState();
      this.artSetting.textColor = textColor;
      this.generateWordCloud(this.artists);
    },

    changeTextSize(textSize) {
      this.addUndoState();
      this.artSetting.textSize = textSize;
      this.generateWordCloud(this.artists);
    },

    addUndoState() {
      const copyOldArtSetting = Object.assign({}, this.artSetting);
      this.undo = [...this.undo, copyOldArtSetting];
    },

    undoArtSetting() {
      if (this.undo.length != 0) {
        this.artSetting = this.undo[this.undo.length - 1];
        this.undo = this.undo.slice(0, -1);
        this.generateWordCloud(this.artists);
      }
    },

    generateWordCloud(list) {
      var options = {
        gridSize: 4,
        weightFactor: this.artSetting.textSize,
        fontFamily: "Hiragino Mincho Pro, serif",
        color: this.artSetting.textColor,
        shuffle: false,
        rotateRatio: 0,
        rotationSteps: 2,
        backgroundColor: this.artSetting.backgroundColor,
        list: list,
        shape: this.artSetting.shape,
      };
      WordCloud(this.$refs["canvas"], options);
    },

    async convertTobase64() {
      const urlParams = new URLSearchParams(window.location.search);
      const access_token = urlParams.get("access_token");
      var canvas = document.getElementById("my_canvas");
      var dataURL = canvas.toDataURL();
      var strImage = dataURL.replace(/^data:image\/[a-z]+;base64,/, "");
      try {
        await axios.put(
          "http://localhost:8888/change_image/?access_token=" +
            access_token +
            "&playlist_id=" +
            this.playlistId,
          {
            data: {
              img: strImage,
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    },

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
}
</style>