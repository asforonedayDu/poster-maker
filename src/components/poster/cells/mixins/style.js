export default {
  props: {
    position: {
      required: true,
      default: Object,
    },
    background: {
      default: '',
    },
    backgroundImage: {
      default: '',
    },
    color: {
      default: 'black'
    },
    fontsize: {
      default: '8'
    },
  },
  computed: {
    style() {
      const style = {
        top: `${this.position.top}%`,
        left: `${this.position.left}%`,
      }
      this.position.height && (style.height = `${this.position.height}%`)
      this.position.width && (style.width = `${this.position.width}%`)
      if (this.background || this.backgroundImage) {
        style.background = `${this.backgroundImage && `url(${this.backgroundImage})`} ${this.background && `${this.background}`}`
        // console.log('style.background', style.background)
      }
      // this.background && (style.background = `${this.background}`)
      this.color && (style.color = `${this.color}`)
      this.fontsize && (style.fontSize = `${this.fontsize}rem`)
      // this.backgroundImage && (style.backgroundImage = `${this.backgroundImage}`)

      // this.animationDuration && (style['--animate-duration'] = `${this.animationDuration}s`)
      // this.animationCount && (style['animation-iteration-count'] = this.animationCount)
      // this.animationFillMode && (style['animation-fill-mode'] = `${this.animationFillMode}s`)
      // this.animationDelay && (style['animation-delay'] = `${this.animationDelay}s`)
      return style
    }
  }
}
