export default {
  props: ['onClickCell', 'id'],
  mounted() {
    if (this.designMode) {
      this.$refs.targetDom.addEventListener('click', this.handleClick)
    }else {
      console.log('designMode',this.designMode)
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
