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
    animationDirection: {
      default: 'normal',
    },
    animationTimingFunction: {
      default: '',
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
    },
    noAnimation: {
      default: false,
    }
  },
  data() {
    return {}
  },
  created() {

  },
  async mounted() {
    if (!this.noAnimation) {
      const targetDom = this.$refs.targetDom
      const waitTime = parseFloat(this.hideAfterAnimation)
      if (this.animationActions.length > 0) {
        await this.animateQueueCell(this.$refs.targetDom, this.animationActions)
        if (waitTime.toString() !== "NaN") {
          if (waitTime === 0) {
            targetDom.style.display = 'none'
          } else if (waitTime > 0) {
            setTimeout(() => {
              targetDom.style.display = 'none'
            }, waitTime * 1000)
          }
        } else {
          waitTime && (targetDom.style.display = 'none')
        }
      } else if (waitTime.toString() !== "NaN" && waitTime > 0) {
        setTimeout(() => {
          targetDom.style.display = 'none'
        }, waitTime * 1000)
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
  }
}
