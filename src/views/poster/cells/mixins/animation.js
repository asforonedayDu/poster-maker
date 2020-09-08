import {animateCell, animateQueueCell} from '../../libs/animate-help'

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
      default: false,
    }
  },
  data() {
    return {}
  },
  created() {

  },
  watch: {
    animationActions(val) {
      console.log('animationActions val', val)
      if (val) {
        animateCell(this.$refs.targetDom, this.animationActions[0])
        // this.animateQueueCell(this.$refs.targetDom, this.animationActions).then(response => {
        //   if (this.hideAfterAnimation) this.$refs.targetDom.style.display = 'none'
        // })
      }
    }
  },
  mounted() {
    const targetDom = this.$refs.targetDom
    this.animationDuration && targetDom.style.setProperty('--animate-duration', `${this.animationDuration}s`);
    this.animationCount && targetDom.style.setProperty('animation-iteration-count', `${this.animationCount}`);
    this.animationFillMode && targetDom.style.setProperty('animation-fill-mode', `${this.animationFillMode}`);
    this.animationDelay && targetDom.style.setProperty('animation-delay', `${this.animationDelay}s`);
    if (this.animationActions.length > 0) {
      this.animateQueueCell(this.$refs.targetDom, this.animationActions).then(response => {
        if (this.hideAfterAnimation) targetDom.style.display = 'none'
      })
    }
  },
  methods: {
    animateQueueCell
  }
}
