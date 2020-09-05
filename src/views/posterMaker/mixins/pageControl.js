import Vue from "vue";

export default {
  data() {
    return {
      dialogAddCellVisible: false,
      onSelectAddCell: {
        inputCellName: '',
        cell: ''
      },
      onSelectPage: {},
    }
  },
  methods: {
    handleClickPage(item, index) {
      this.onselectCell = null
      this.onSelectPage = item
    },
    handleCreateNewPage() {
      const length = Object.keys(this.pages).length
      this.pages.push({
        id: length,
        name: `第${length + 1}页`,
        type: 'page'
      })
    },
    getPageOptions(item, index) {
      this.$refs.treeContainer.setClickItemByIndex(index)
      return [
        {
          text: '添加子元素',
          onClick: (item, index) => {
            this.onSelectPage = item
            this.dialogAddCellVisible = true
          }
        }
      ]
    },
    handleAddCell() {
      if (this.onSelectAddCell.inputCellName.length === 0) {
        this.$message('请输入元素名称')
        return
      }
      if (!this.onSelectAddCell.cell) {
        this.$message('请选择一个元素')
        return
      }
      this.dialogAddCellVisible = false
      if (!this.onSelectPage.children) this.$set(this.onSelectPage, 'children', [])
      this.onSelectPage.children.push({
        name: this.onSelectAddCell.inputCellName,
        id: this.onSelectPage.id + '_' + this.onSelectPage.children.length,
        type: 'cell',
        data: _.clone(this.onSelectAddCell.cell)
      })
    }
  }
}
