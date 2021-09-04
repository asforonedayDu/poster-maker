<template>
  <div :class="`default-cell ${fullScreenClass}`" :style="style" ref="targetDom">
    <img class="full-screen-image" v-if="this.fullScreenClass && this.backgroundImage" :src="this.backgroundImage"/>
  </div>
</template>

<script>
  import style from '../../mixins/style'
  import panelList from '@/views/posterMaker/cellConfigPanel/panelList'
  import base from '../../mixins/base'
  import animation from "../../mixins/animation";

  const fullScreenClass = 'full-screen'
  const fullScreenReverseClass = 'full-screen-reverse'
  const panelCellList = Object.values({
    ...panelList,
    inputText: null,
    verticalDirection: null,
    color: null,
    fontsize: null,
    fontFamily: null,
    lineHeight: null,
  }).filter(e => e)
  const index = {
    name: "cell-flex-board",
    descriptor: '图片或纯色',
    props: {
      position: {
        default: {
          width: 70,
          height: 70,
          left: 15,
          top: 15
        }
      },
      background: {
        default: 'rgba(11,36,132,1)'
      },
      backgroundImage: {
        default: '',
      },
      imgFullScreen: {
        default: false,
      },
      name: {
        default: '',
      },
    },
    mixins: [animation, style, base],
    panelList: panelCellList,
    data() {
      return {
        fullScreenClass: ''
      }
    },
    mounted() {
      if (this.backgroundImage && this.imgFullScreen && !this.noAnimation) {
        this.$refs.targetDom.addEventListener('click', this.handleClickFlexBoard)
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
          await this.animationPromise
        }
        if (this.fullScreenClass === fullScreenClass) {
          this.fullScreenClass = fullScreenReverseClass
          setTimeout(() => {
            this.fullScreenClass = ''
            this.$root.preventPageScroll = false
          }, 600)
        } else {
          this.fullScreenClass = fullScreenClass
          this.$root.preventPageScroll = true
        }
      },
    },
    beforeDestroy() {
      this.$refs.targetDom.removeEventListener('click', this.handleClickFlexBoard)
    },
  }
  const defaultProps = {}
  Object.keys(animation.props).forEach(key => {
    defaultProps[key] = animation.props[key].default instanceof Function ? animation.props[key].default() : animation.props[key].default
  })
  Object.keys(style.props).forEach(key => {
    defaultProps[key] = style.props[key].default instanceof Function ? style.props[key].default() : style.props[key].default
  })
  Object.keys(index.props).forEach(key => {
    defaultProps[key] = index.props[key].default instanceof Function ? index.props[key].default() : index.props[key].default
  })
  index.defaultProps = defaultProps
  export default index
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

  .full-screen-image {
    width: 100%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
</style>
