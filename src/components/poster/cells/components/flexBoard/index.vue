<template>
  <div
    :class="`default-cell board-cell ${fullScreenClass}`"
    :style="style"
    ref="targetDom"
  >
    <div class="img-body" v-if="this.fullScreenClass && this.backgroundImage">
      <img class="full-screen-image" ref="image" :src="this.backgroundImage" />
    </div>
  </div>
</template>

<script>
import style from "../../mixins/style";
import panelList from "@/views/posterMaker/cellConfigPanel/panelList";
import base from "../../mixins/base";
import animation from "../../mixins/animation";
import PinchZoom from "@/libs/pinchzoom";

const fullScreenClass = "full-screen";
const fullScreenReverseClass = "full-screen-reverse";

const panelCellList = Object.values({
  ...panelList,
  inputText: null,
  verticalDirection: null,
  color: null,
  fontsize: null,
  verticalAliaType: null,
  fontFamily: null,
  lineHeight: null,
}).filter((e) => e);
const index = {
  name: "cell-flex-board",
  descriptor: "图片或纯色",
  props: {
    position: {
      default: {
        width: 70,
        height: 70,
        left: 15,
        top: 15,
      },
    },
    background: {
      default: "rgba(11,36,132,1)",
    },
    backgroundImage: {
      default: "",
    },
    imgFullScreen: {
      default: false,
    },
    name: {
      default: "",
    },
  },
  mixins: [animation, style, base],
  panelList: panelCellList,
  data() {
    return {
      fullScreenClass: "",
    };
  },
  mounted() {
    if (this.backgroundImage && this.imgFullScreen && !this.noAnimation) {
      this.$refs.targetDom.addEventListener("click", this.handleClickFlexBoard);
      // const _isMobile = this.$root._isModbile
      // const mouseListeners = {
      //   'down': _isMobile ? 'touchstart' : 'mousedown',
      //   'up': _isMobile ? 'touchend' : 'mouseup',
      //   'move': _isMobile ? 'touchmove' : 'mousemove',
      // }
      // this.$refs.targetDom.addEventListener(mouseListeners.down, (event) => {
      //   console.log('mousedown')
      //   event.stopPropagation()
      // }, true)
      // this.$refs.targetDom.addEventListener(mouseListeners.move, (event) => {
      //   console.log('mousemove')
      //   event.stopPropagation()
      // }, true)
    }
  },
  methods: {
    async handleClickFlexBoard() {
      if (this.animationActions.length > 0) {
        await this.animationPromise;
      }
      if (this.fullScreenClass === fullScreenClass) {
        this.pz.disable();
        const imageDom = this.$refs.image;
        imageDom.style.top = "50%";
        imageDom.style.transform = "translate(0, -50%) scale(1, 1)";
        imageDom.style.position = "absolute";
        imageDom.parentElement.style.height = "auto";
        this.fullScreenClass = fullScreenReverseClass;
        setTimeout(() => {
          this.fullScreenClass = "";
          this.$root.preventPageScroll = false;
        }, 600);
      } else {
        this.fullScreenClass = fullScreenClass;
        this.$root.preventPageScroll = true;
        setTimeout(() => {
          this.$refs.image.style.top = 0;
          this.$refs.image.style.position = "relative";
          this.pz = new PinchZoom(this.$refs.image, {
            use2d: true,
          });
        }, 650);
      }
    },
  },
  beforeDestroy() {
    this.$refs.targetDom.removeEventListener(
      "click",
      this.handleClickFlexBoard
    );
  },
};
const defaultProps = {};
Object.keys(animation.props).forEach((key) => {
  defaultProps[key] =
    animation.props[key].default instanceof Function
      ? animation.props[key].default()
      : animation.props[key].default;
});
Object.keys(style.props).forEach((key) => {
  defaultProps[key] =
    style.props[key].default instanceof Function
      ? style.props[key].default()
      : style.props[key].default;
});
Object.keys(index.props).forEach((key) => {
  defaultProps[key] =
    index.props[key].default instanceof Function
      ? index.props[key].default()
      : index.props[key].default;
});
index.defaultProps = defaultProps;
export default index;
</script>

<style lang="scss">
@keyframes full-screen {
  0% {
  }
  100% {
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
  }
}

@keyframes full-screen-reverse {
  0% {
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
  }
  100% {
  }
}

.full-screen {
  animation-name: full-screen;
  animation-delay: 0s !important;
  animation-duration: 600ms !important;
  animation-fill-mode: forwards !important;
  animation-iteration-count: 1 !important;
  animation-timing-function: ease !important;
  animation-direction: normal !important;
  z-index: 99999;
  pointer-events: auto !important;
  background: rgba(1, 1, 1, 0.3) !important;
}

.full-screen-reverse {
  animation-delay: 0s !important;
  animation-duration: 600ms !important;
  animation-fill-mode: backwards !important;
  animation-iteration-count: 1 !important;
  animation-timing-function: ease !important;
  animation-direction: normal !important;
  animation-name: full-screen-reverse;
  z-index: 99999;
  pointer-events: auto !important;
  background: rgba(1, 1, 1, 0.3) !important;
}

.board-cell {
  display: flex;
  align-items: center;
  flex-flow: column nowrap;
  justify-content: center;

  .img-body {
    width: 100%;
    height: auto;
    /*display: flex;*/
    /*align-items: center;*/

    .full-screen-image {
      width: 100%;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}

//css文件
.pinch-zoom-container {
  width: 100%;
}

div.page {
  /*margin: 50px auto 50px auto;*/
  max-width: 500px;
  position: relative;
  text-align: left;
}

div.pinch-zoom {
  position: relative;
}

div.pinch-zoom a {
  color: white;
  position: absolute;
  bottom: 10px;
  right: 10px;
  text-decoration: none;
  background: #333;
  padding: 3px;
  font-size: 11px;
}

div.pinch-zoom div.description {
  position: absolute;
  top: 500px;
  left: 210px;
}

div.pinch-zoom div.description h1 {
  font-size: 40px;
  margin: 0px;
  margin-bottom: 10px;
}

div.pinch-zoom div.description p {
  margin: 0px;
}

ul {
  margin: 0;
  padding: 0;
}

.imgWidth {
  width: 100%;
  /*height: 100%;*/
}
</style>
