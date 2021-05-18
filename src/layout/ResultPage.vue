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
        <v-expansion-panels>
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
              <v-radio-group
                :value="artSetting.shape"
                @change="changeShape"
                row
              >
                <v-radio
                  v-for="shape in shapes"
                  :key="shape.label"
                  :label="shape.label"
                  :value="shape.value"
                  dark
                ></v-radio>
              </v-radio-group>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel class="expansionPanel">
            <v-expansion-panel-header>
              <h3>Font Color</h3>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-radio-group
                :value="artSetting.textColor"
                @change="changeTextColor"
                row
              >
                <v-radio dark label="Grade Grey" value="GradeGrey"></v-radio>
                <v-radio dark label="Yoda" value="Yoda"></v-radio>
                <v-radio dark label="Cool Sky" value="CoolSky"></v-radio>
                <v-radio dark label="Pure Lust" value="PureLust"></v-radio>
                <v-radio dark label="Ohhappiness" value="Ohhappiness"></v-radio>
                <v-radio dark label="Sunkist" value="Sunkist"></v-radio>
              </v-radio-group>
              <!-- <v-swatches
                inline
                :value="artSetting.textColor"
                @input="changeTextColor"
                :swatches="['#C0392B', '#E74C3C', '#9B59B6', '#8E44AD', '#2980B9', '#3498DB', '#1ABC9C'
                , '#16A085', '#27AE60', '#2ECC71', '#F1C40F', '#F39C12', '#E67E22', '#D35400', '#ECF0F1', '#BDC3C7',
                '#95A5A6', '#7F8C8D', '#34495E', '#2C3E50']"
              >
              </v-swatches> -->
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

        <!-- <v-card>
          <v-card-actions>
            <v-btn color="success" :loading="this.buttonLoading" @click="convertTobase64">
              Set as Spotify playlist cover
            </v-btn>
            <v-btn color="success" @click="downloadCoverImage">
              Download cover
            </v-btn>
          </v-card-actions>
        </v-card> -->
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
        textColor: "GradeGrey",
        backgroundColor: "#FFF",
        shape: "circle",
        textSize: 5,
      },
      minTextSize: 1,
      maxTextSize: 10,
      undo: [],
      playlistId: "",
      buttonLoading: false,
      tickLabels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      colorGradient: null,
      gradientMap: {
        GradeGrey: {
          light: "#BDC3C7",
          dark: "#2c3e50",
        },
        Yoda: {
          dark: "#493240",
          light: "#FF0099",
        },
        CoolSky: {
          light: "#6DD5FA",
          dark: "#2980B9",
        },
        PureLust: {
          light: "#dd1818",
          dark: "#333333",
        },
        Ohhappiness: {
          light: "#96c93d",
          dark: "#00b09b",
        },
        Sunkist: {
          light: "#F2C94C",
          dark: "#F2994A",
        },
        WhatLiesBeyond: {
          light: "#f0f2f0",
          dark: "#000c40",
        },
      },
      shapes: [
        { label: "Circle", value: "circle" },
        { label: "Square", value: "square" },
        { label: "Diamond", value: "diamond" },
        { label: "Heart", value: "cardioid" },
        { label: "Star", value: "star" },
        { label: "Pentagon", value: "pentagon" },
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
      //this.addUndoListener()
    } else {
      this.$router.push({ path: "/" });
    }
  },

  methods: {
    ...mapActions("home", ["setTokens", "retrievePlaylistArtists"]),

    addUndoListener() {
      document
        .querySelector("#undoWrapper")
        .addEventListener("keydown", (e) => {
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

    generateColorGradient() {
      const colorGradient = new Gradient();
      colorGradient.setMidpoint(this.maxArtistFrequency);
      const colorOne = this.gradientMap[this.artSetting.textColor].light;
      const colorTwo = this.gradientMap[this.artSetting.textColor].dark;
      colorGradient.setGradient(colorOne, colorTwo);
      this.colorGradient = colorGradient;
    },

    generateWordCloud(list) {
      this.generateColorGradient();

      var options = {
        gridSize: 6,
        fontFamily: "Gotham",
        shuffle: false,
        rotateRatio: 0,
        rotationSteps: 2,
        list: list,
        color: (_, weight) => {
          return this.colorGradient.getColor(weight);
        },
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
  margin: 100px auto;
  background: white;
  border-radius: 5px;
}

body {
  font-family: "Gotham", Arial;
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