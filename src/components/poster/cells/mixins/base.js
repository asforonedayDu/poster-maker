export default {
  props: {
    onClickCell: {
      default: false,
    },
    id: {
      default: false,
    },
    designMode: {
      default: false,
    },
    noAnimation: {
      default: false,
    },
  },
  mounted() {
    if (this.designMode) {
      this.$refs.targetDom.addEventListener('click', this.handleClick)
    }
  },
  methods: {
    handleClick(event) {
      if (this.locked) return
      if (this.onClickCell) {
        event.preventDefault()
        event.stopPropagation()
        this.onClickCell(this.id)
      }
    }
  },
  beforeDestroy() {
    if (this.designMode) {
      this.$refs.targetDom.removeEventListener('click', this.handleClick)
    }
  }
}
