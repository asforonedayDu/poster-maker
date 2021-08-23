import {animateCell, animateQueueCell} from '@/libs/animate-help'
import el from "element-ui/src/locale/lang/el";

export default {
  props: {
    animationDuration: {
      default: '',
    },
    animationCount: {
      default: 1,
    },
    animationFillMode: {
      default: 'both',
    },
    animationDelay: {
      default: 0,
    },
    animationActions: {
      default: () => {
        return []
      },
    },
    autoAnimation: {
      default: true,
    },
    hideAfterAnimation: {
      default: -1,
    },
    designMode: {
      default: false,
    }
  },
  data() {
    return {}
  },
  created() {

  },
  async mounted() {
    if (!this.designMode) {
      const targetDom = this.$refs.targetDom
      if (this.animationDuration) {
        targetDom.style.setProperty('animate-duration', `${this.animationDuration}s`);
        targetDom.style.setProperty('-webkit-animation-duration', `${this.animationDuration}s`);
      }
      if (this.animationCount) {
        targetDom.style.setProperty('animation-iteration-count', `${this.animationCount}`);
        targetDom.style.setProperty('-webkit-animation-iteration-count', `${this.animationCount}`);
      }
      if (this.animationFillMode) {
        targetDom.style.setProperty('animation-fill-mode', `${this.animationFillMode}`);
        targetDom.style.setProperty('-webkit-animation-fill-mode', `${this.animationFillMode}`);
      }
      if (this.animationDelay) {
        targetDom.style.setProperty('animation-delay', `${this.animationDelay}s`);
        targetDom.style.setProperty('-webkit-animation-delay', `${this.animationDelay}s`);
      }
      if (this.animationActions.length > 0) {
        await this.animateQueueCell(this.$refs.targetDom, this.animationActions)
        const waitTime = parseFloat(this.hideAfterAnimation)
        if (waitTime.toString() !== "NaN") {
          if (waitTime === 0) {
            targetDom.style.display = 'none'
          } else if (waitTime > 0) {
            setTimeout(() => {
              targetDom.style.display = 'none'
            }, 1000)
          }
        } else {
          waitTime && (targetDom.style.display = 'none')
        }
      }
    }
  },
  watch: {
    // animationActions(val) {
    //   console.log('animationActions val', val)
    //   if (val) {
    //     animateCell(this.$refs.targetDom, this.animationActions[0])
    //     this.animateQueueCell(this.$refs.targetDom, this.animationActions).then(response => {
    //       if (this.hideAfterAnimation) this.$refs.targetDom.style.display = 'none'
    //     })
    //   }
    // }
  },
  computed: {
    // animateStyle() {
    //   const style = {}
    //   if (this.animationActions.length > 0) {
    //     this.animationDuration && (style['--animate-duration'] = `${this.animationDuration}s`)
    //     this.animationDuration && (style['animation-iteration-count'] = this.animationCount)
    //     this.animationDuration && (style['animation-fill-mode'] = this.animationFillMode)
    //     this.animationDuration && (style['animation-delay'] = `${this.animationDelay}s`)
    //     const firstAnimation = this.animationActions[0]
    //     this.animationDuration && (style['animation-name'] = firstAnimation)
    //     this.animateQueueCell(this.$refs.targetDom, this.animationActions.slice(1)).then(response => {
    //       if (this.hideAfterAnimation) targetDom.style.display = 'none'
    //     })
    //   }
    //   return style
    // }
  },
  methods: {
    animateQueueCell,
    injectStyleAnimation(style) {
      // this.animationDuration && (style['--animate-duration'] = `${this.animationDuration}s`)
      // this.animationCount && (style['animation-iteration-count'] = this.animationCount)
      // this.animationFillMode && (style['animation-fill-mode'] = `${this.animationFillMode}s`)
      // this.animationDelay && (style['animation-delay'] = `${this.animationDelay}s`)
    }
  }
}
