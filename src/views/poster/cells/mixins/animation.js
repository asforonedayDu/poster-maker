import {animateCell} from '../../libs/animate-help'

export default {
  props: {
    animation: {
      required: true,
      type: Object,
      default: {
        duration: '',
        count: 1,
        fillMode: 'both',
        delay: 0,
      }
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
  mounted() {
    const targetDom = this.$refs.targetDom
    this.animation.duration && targetDom.style.setProperty('--animate-duration', `${this.animation.duration}s`);
    this.animation.count && targetDom.style.setProperty('animation-iteration-count', `${this.animation.count}`);
    this.animation.fillMode && targetDom.style.setProperty('animation-fill-mode', `${this.animation.fillMode}`);
    this.animation.delay && targetDom.style.setProperty('animation-delay', `${this.animation.delay}s`);
    if (this.autoAnimation && this.animation.actions && this.animation.actions.length > 0) {
      this.animateCell(this.$refs.targetDom, this.animation.actions || []).then(response => {
        if (this.hideAfterAnimation) targetDom.style.display = 'none'
      })
    }
  },
  methods: {
    animateCell
  }
}
