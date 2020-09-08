export default {
  data() {
    return {
      onSelectCell: null,
      isOpenConfigDrawer: false,
    }
  },
  methods: {
    handleClickCell(item, index) {
      const parent = this.pages.find(page => page.id === item.$parentId)
      if (!parent) {
        throw new Error('该元素未找到所属页面 handleClickCell' + item.$parentId)
      }
      this.onSelectPage = parent
      this.onSelectCell = item
      this.isOpenConfigDrawer = true
    },
    getCellOptions(item, index) {
      const parent = this.pages.find(page => page.id === item.$parentId)
      if (!parent) {
        throw new Error('该元素未找到所属页面 getCellOptions' + item.$parentId)
      }
      const moveUp = {
        text: '上移',
        onClick: (item) => {
          const i = parent.cells.indexOf(item)
          parent.cells[i] = parent.cells[i - 1]
          this.$set(parent.cells, i - 1, item)
        }
      }
      const moveDown = {
        text: '下移',
        onClick: (item, index) => {
          const i = parent.cells.indexOf(item)
          parent.cells[i] = parent.cells[i + 1]
          this.$set(parent.cells, i + 1, item)
        }
      }
      const options = [
        {
          text: '删除',
          onClick: (item, index) => {
            const i = parent.cells.indexOf(item)
            parent.cells.splice(i, 1)
            this.onSelectCell = null
          }
        },
      ]
      const position = parent.cells.indexOf(item)
      if (position > 0) {
        options.push(moveUp)
      }
      if (position < (parent.cells.length - 1)) {
        options.push(moveDown)
      }
      return options
    }
  }
}
