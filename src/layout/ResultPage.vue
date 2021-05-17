<template>
  <v-container fluid class="body-wrapper">
    <v-row>
      <v-col>
        <canvas
          id="my_canvas"
          ref="canvas"
          width="300"
          height="300"
        ></canvas>
      </v-col>
      <v-col>
        <v-expansion-panels>

          <v-expansion-panel>
            <v-expansion-panel-header>
              <h3>Color</h3>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div class="swatch-wrapper">
                <v-swatches
                  swatches="text-advanced"
                  inline
                  :value="artSetting.backgroundColor"
                  @input="changeBackgroundColor"
                >
                </v-swatches>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header>
              <h3>Shape</h3>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-radio-group :value="artSetting.shape" @change="changeShape" row>
                <v-radio 
                  v-for="shape in shapes"
                  :key="shape.label"
                  :label="shape.label"
                  :value="shape.value"
                ></v-radio>
              </v-radio-group>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header>
              <h3>Font Color</h3>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-radio-group :value="artSetting.textColor" @change="changeTextColor" row>
                <v-radio label="Dark" value="random-dark"></v-radio>
                <v-radio label="Light" value="random-light"></v-radio>
              </v-radio-group>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header>
              <h3>Font Size</h3>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-slider
                :min="minTextSize"
                :max="maxTextSize"
                :value="artSetting.textSize"
                :tick-labels="tickLabels"
                @change="changeTextSize"
                ticks="always"
              >
              </v-slider>
            </v-expansion-panel-content>
          </v-expansion-panel>

        </v-expansion-panels>

        <v-card>
          <v-card-actions>
            <v-btn color="success" :loading="this.buttonLoading" @click="convertTobase64">
              Set as Spotify playlist cover
            </v-btn>
            <v-btn color="success" @click="downloadCoverImage">
              Download cover
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import VSwatches from 'vue-swatches'
import WordCloud from "wordcloud";
import { mapState, mapActions } from "vuex";
import axios from "axios";

export default {
  name: "ResultPage",
  components: {
    VSwatches
  },
  data() {
    return {
      artSetting: {
        textColor: "#000",
        backgroundColor: "#fff",
        shape: "circle",
        textSize: 5,
      },
      minTextSize: 1,
      maxTextSize: 10,
      undo: [],
      playlistId: '',
      buttonLoading: false,
      tickLabels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      shapes: [
        {label: "Circle", value: "circle"},
        {label: "Square", value: "square"},
        {label: "Diamond", value: "diamond"},
        {label: "Heart", value: "cardioid"},
        {label: "Star", value: "star"},
        {label: "Pentagon", value: "pentagon"},
      ]
    };
  },
  computed: {
    ...mapState("home", [
      "artists",
      "error",
      "retrieveArtistsLoading"
    ]),
  },
  async mounted() {
    this.playlistId = this.$route.query.playlistId

    await this.retrievePlaylistArtists(this.playlistId)

    if (this.error === null) {
      this.generateWordCloud(this.artists)
      //this.addUndoListener()
    } else {
      this.$router.push({ path: "/" })
    }
  },

  methods: {
    ...mapActions("home", [
      "setTokens", 
      "retrievePlaylistArtists"
    ]),

    addUndoListener() {
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
      })
    },

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
        gridSize: 6,
        fontFamily: "Hiragino Mincho Pro, serif",
        shuffle: false,
        rotateRatio: 0,
        rotationSteps: 2,
        list: list,
        color: this.artSetting.textColor,
        weightFactor: this.artSetting.textSize,
        backgroundColor: this.artSetting.backgroundColor,
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
      const canvas = document.getElementById("my_canvas");
      const image = canvas.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
      const link = document.createElement("a");
      link.download = "my-coverart.png";
      link.href = image;
      link.click();
      link.remove();
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

#my_canvas {
  margin: 0 auto;
  display: block;
}

.swatch-wrapper {
  display: flex;
}
</style>