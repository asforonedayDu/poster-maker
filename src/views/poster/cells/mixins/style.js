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
      this.background && (style.background = `${this.background}`)
      this.color && (style.color = `${this.color}`)
      this.fontsize && (style.fontSize = `${this.fontsize}rem`)
      this.backgroundImage && (style.backgroundImage = `${this.backgroundImage}`)
      return style
    }
  }
}
