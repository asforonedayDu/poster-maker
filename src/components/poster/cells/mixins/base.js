export default {
  props: ['onClickCell', 'id'],
  methods: {
    handleClick() {
      if (this.onClickCell) {
        this.onClickCell(this.id)
      }
    }
  }
}
