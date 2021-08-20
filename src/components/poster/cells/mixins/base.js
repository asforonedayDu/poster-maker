export default {
  props: ['onClickCell', 'id'],
  methods: {
    handleClick(event) {
      if (this.locked) return
      if (this.onClickCell) {
        event.preventDefault()
        event.stopPropagation()
        this.onClickCell(this.id)
      }
    }
  }
}
