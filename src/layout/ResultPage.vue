<template>
  <v-container fluid class="body-wrapper" :style="bodyBackgroundColor">
    <v-row>
      <v-col>
        <div class="box">
          <canvas id="my_canvas" ref="canvas" width="300" height="300"></canvas>
          <div class="button">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  class="mr-16"
                  elevataion="2"
                  fab
                  color="#1db954"
                  dark
                  v-on="on"
                  @click="convertTobase64"
                >
                  <v-icon dark> mdi-cloud-upload</v-icon>
                </v-btn>
              </template>
              <span>Upload to Spotify</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  elevataion="2"
                  fab
                  color="#1db954"
                  dark
                  v-on="on"
                  @click="downloadCoverImage"
                >
                  <v-icon dark> mdi-download </v-icon>
                </v-btn>
              </template>
              <span>Download</span>
            </v-tooltip>
          </div>
        </div>
      </v-col>
      <v-col>
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-btn
              class="mr-10 mb-3"
              elevataion="2"
              dark
              v-on="on"
              @click="undoArtSetting"
            >
              <v-icon dark> mdi-undo</v-icon>
            </v-btn>
          </template>
           <span class ="mr-3"> or </span>
          <span v-if="getOS() === 'Mac OS' || 'Windows'">
          <kbd v-if="getOS() === 'Mac OS'">cmd</kbd>
          <kbd v-else-if="getOS() === 'Windows'">ctrl</kbd>
          <span> + </span> <kbd>z</kbd>
          <span class="ml-3">to undo</span>
        </span>
        </v-tooltip>

        <v-expansion-panels v-model="artSetting.activePanel">
          <v-expansion-panel class="expansionPanel">
            <v-expansion-panel-header>
              <h3>Color</h3>
            </v-expansion-panel-header>
            <v-expansion-panel-content class="expansionPanel">
              <v-swatches
                swatches="text-advanced"
                inline
                :value="artSetting.backgroundColor"
                @input="changeBackgroundColor"
              >
              </v-swatches>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel class="expansionPanel">
            <v-expansion-panel-header>
              <h3>Shape</h3>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-btn-toggle
                :value="artSetting.shape"
                @change="changeShape"
                dark
                borderless
              >
                <v-btn v-for="shape in shapes" :key="shape.value" dark>
                  <v-icon>
                    {{ shape.icon }}
                  </v-icon>
                </v-btn>
              </v-btn-toggle>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel class="expansionPanel">
            <v-expansion-panel-header>
              <h3>Font Color</h3>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-btn-toggle
                :value="artSetting.textColor"
                @change="changeTextColor"
                dark
                borderless
              >
                <v-btn
                  v-for="(gradient, index) in gradients" 
                  :key="gradient.label" 
                  :style="getButtonGradientColor(gradient.light, gradient.dark)"
                >
                  <v-icon v-if="index === artSetting.textColor">
                    mdi-check-circle-outline
                  </v-icon>
                </v-btn>
              </v-btn-toggle>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel class="expansionPanel">
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
                dark
              >
              </v-slider>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import Gradient from "javascript-color-gradient";
import VSwatches from "vue-swatches";
import WordCloud from "wordcloud";
import { mapState, mapActions } from "vuex";
import axios from "axios";

export default {
  name: "ResultPage",
  components: {
    VSwatches,
  },
  data() {
    return {
      artSetting: {
        backgroundColor: "#FFF",
        textColor: 0,
        shape: 0,
        textSize: 5,
        activePanel: null,
      },
      minTextSize: 1,
      maxTextSize: 10,
      undo: [],
      playlistId: "",
      buttonLoading: false,
      tickLabels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      colorGradient: null,
      gradients: [
        { label: "Grade Grey", light: "#BDC3C7", dark: "#2c3e50" },
        { label: "Yoda", light: "#FF0099", dark: "#493240" },
        { label: "Cool Sky", light: "#6DD5FA", dark: "#2980B9" },
        { label: "Pure Lust", light: "#dd1818", dark: "#333333" },
        { label: "Ohhappiness", light: "#96c93d", dark: "#00b09b" },
        { label: "WhatLiesBeyond", light: "#f0f2f0", dark: "#000c40" },
        { label: "Sunkist", light: "#F2C94C", dark: "#F2994A" },
      ],
      shapes: [
        { label: "Circle", value: "circle", icon: "mdi-checkbox-blank-circle" },
        { label: "Square", value: "square", icon: "mdi-square" },
        { label: "Diamond", value: "diamond", icon: "mdi-cards-diamond" },
        { label: "Heart", value: "cardioid", icon: "mdi-cards-heart" },
        { label: "Star", value: "star", icon: "mdi-star" },
        { label: "Pentagon", value: "pentagon", icon: "mdi-pentagon" },
      ],
    };
  },
  computed: {
    ...mapState("home", [
      "artists",
      "maxArtistFrequency",
      "error",
      "retrieveArtistsLoading",
    ]),
    bodyBackgroundColor() {
      return {
        background: `linear-gradient(120deg, ${this.artSetting.backgroundColor}, #191414)`,
      };
    },
  },
  async mounted() {
    this.playlistId = this.$route.query.playlistId;

    await this.retrievePlaylistArtists(this.playlistId);

    if (this.error === null) {
      this.generateWordCloud(this.artists);
      this.addUndoListener();
    } else {
      this.$router.push({ path: "/" });
    }
  },

  methods: {
    ...mapActions("home", ["setTokens", "retrievePlaylistArtists"]),

    getButtonGradientColor(light, dark) {
      return {
        background: `linear-gradient(90deg, ${light}, ${dark})`,
      };
    },

    addUndoListener() {
      document.addEventListener("keydown", (e) => {
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
      const before = this.artSetting.backgroundColor
      if (before !== color) {
        this.addUndoState();
        this.artSetting.backgroundColor = color;
        this.artSetting.activePanel = 0;
        this.generateWordCloud(this.artists); 
      }
    },

    changeShape(id) {
      const before = this.artSetting.shape
      if (id != undefined && before !== id) {
        this.addUndoState();
        this.artSetting.shape = id;
        this.artSetting.activePanel = 1;
        this.generateWordCloud(this.artists);
      }
    },

    changeTextColor(id) {
      const before = this.artSetting.textColor
      if (id !== undefined && before !== id) {
        this.addUndoState();
        this.artSetting.textColor = id;
        this.artSetting.activePanel = 2;
        this.generateWordCloud(this.artists);
      }
    },

    changeTextSize(textSize) {
      const before = this.artSetting.textSize
      if (before !== textSize) {
        this.addUndoState();
        this.artSetting.textSize = textSize;
        this.artSetting.activePanel = 3;
        this.generateWordCloud(this.artists);
      }
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

    generateColorGradient() {
      const colorGradient = new Gradient();
      colorGradient.setMidpoint(this.maxArtistFrequency);
      const colorOne = this.gradients[this.artSetting.textColor].light;
      const colorTwo = this.gradients[this.artSetting.textColor].dark;
      colorGradient.setGradient(colorOne, colorTwo);
      this.colorGradient = colorGradient;
    },

    generateWordCloud(list) {
      this.generateColorGradient();

      var options = {
        gridSize: 6,
        fontFamily: "Gotham Bold",
        shuffle: false,
        rotateRatio: 0,
        rotationSteps: 2,
        list: list,
        color: (_, weight) => {
          return this.colorGradient.getColor(weight);
        },
        weightFactor: this.artSetting.textSize,
        backgroundColor: this.artSetting.backgroundColor,
        shape: this.shapes[this.artSetting.shape].value,
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
      const image = canvas
        .toDataURL("image/png", 1.0)
        .replace("image/png", "image/octet-stream");
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

.box {
  box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034),
    0 6.7px 5.3px rgba(0, 0, 0, 0.048), 0 12.5px 10px rgba(0, 0, 0, 0.06),
    0 22.3px 17.9px rgba(0, 0, 0, 0.072), 0 41.8px 33.4px rgba(0, 0, 0, 0.086),
    0 100px 80px rgba(0, 0, 0, 0.12);
  width: 300px;
  height: 300px;
  margin: 0 auto;
  background: white;
  border-radius: 5px;
}

body {
  font-family: "Gotham Bold", Arial;
  font-size: 100px;
  background: #eef2f7;
}

.body-wrapper {
  display: flex;
  height: 100%;
  justify-content: center;

  // background:linear-gradient(120deg, #1db954, #191414);
}

#my_canvas {
  margin: 0 auto;
  display: block;
}

.expansionPanel {
  background: #191414 !important;
  color: white !important;
}

.radioGroup {
  color: #eef2f7;
}
.button {
  justify-content: center;
  width: 100%;
  margin-top: 30px;
  display: flex;
}
</style>