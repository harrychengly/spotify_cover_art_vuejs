<template>
  <v-container fluid class="body-wrapper">
    <transition name="drop">
      <div v-if="show" class="form-wrapper">
        <h2 class="tagline-text">{{ $LOCAL("TITLE") }}</h2>
        <LinkForm @generate-art="generateArt" />
        <HelperModal />
      </div>
    </transition>
    <div>
      <canvas
        id="my_canvas"
        width="300"
        height="200"
        style="border: 1px solid #000000"
        ref="canvas"
      ></canvas>
    </div>
  </v-container>
</template>

<script>
import LinkForm from "../components/LinkForm";
import HelperModal from "../components/HelperModal";
import WordCloud from "wordcloud";
export default {
  name: "HomePage",
  components: {
    LinkForm: LinkForm,
    HelperModal: HelperModal,
  },
  data() {
    return {
      show: false,
      list: [],
    };
  },
  mounted() {
    this.show = true;
  },

  methods: {
    generateArt(list) {
      var options = {
        gridSize: Math.round((16 * 1000) / 1024),
        weightFactor: function (size) {
          return (Math.pow(size, 2.3) * 1000) / 1024;
        },
        fontFamily: "Times, serif",
        color: function (word, weight) {
          return weight === 12 ? "#f02222" : "#c09292";
        },
        rotateRatio: 0.5,
        rotationSteps: 2,
        backgroundColor: "#ffe0e0",
        list: list,
      };
      WordCloud(this.$refs["canvas"], options);
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