export default {
  data() {
    return {
      onSelectCell: null,
      isOpenConfigDrawer: false,
    }
  },
  methods: {
    handleClickCell(item, index) {
      this.onSelectCell = item
      this.isOpenConfigDrawer = true
    },
    getCellOptions(item, index) {
      return []
    }
  }
}
