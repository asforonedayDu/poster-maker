import {treeDataType} from '../libs/static'

export default {
  data() {
    return {
      dialogAddCellVisible: false,
      dialogPreviewVisible: false,
      showPageConfigPanel: false,
      onSelectAddCell: {
        inputCellName: '',
        cell: ''
      },
      onSelectPage: {},
      previewData: {}
    }
  },
  methods: {
    previewAllPage() {
      this.previewData = {pages: this.pages, audio: {...this.audio}}
      this.dialogPreviewVisible = true
    },
    handleClickPage(item, index) {
      this.onSelectCell = null
      this.onSelectPage = item
    },
    handleCreateNewPage() {
      const length = this.pages.length
      const maxId = Math.max(...this.pages.map(page => page.id))
      this.pages.push({
        id: maxId + 1,
        name: `第${length + 1}页`,
        createType: treeDataType.PAGE
      })
    },
    getPageOptions(item, index) {
      this.$refs.treeContainer.setClickItemByIndex(index)
      return [
        {
          text: '预览本页',
          onClick: (item, index) => {
            const pageIndex = this.pages.indexOf(item)
            if (pageIndex === -1) {
              console.log('this.pages.indexOf(item) 错误')
              return
            }
            this.previewData = {pages: [this.pages[pageIndex]]}
            this.dialogPreviewVisible = true
          }
        },
        {
          text: '添加子元素',
          onClick: (item, index) => {
            this.onSelectPage = item
            this.dialogAddCellVisible = true
            if (!item.$hasChild) {
              const treeComponent = this.$refs.treeContainer
              treeComponent.handleClickTriangle(treeComponent, item, index)
            }
          }
        },
        {
          text: '删除',
          onClick: (item, index) => {
            const i = this.pages.indexOf(item)
            this.pages.splice(i, 1)
            this.onSelectPage = null
            this.onSelectCell = null
          }
        },
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
      if (!this.onSelectPage.cells) this.$set(this.onSelectPage, 'cells', [])
      const maxId = Math.max(...this.onSelectPage.cells.map(cell => {
        const id = Number(cell.id.split('_')[1])
        if (id === Infinity) return 0
        return id
      }))
      this.onSelectPage.cells.push(_.cloneDeep({
        name: this.onSelectAddCell.inputCellName,
        id: this.onSelectPage.id + '_' + (maxId + 1),
        createType: treeDataType.CELL,
        ...this.onSelectAddCell.cell
      }))
    }
  }
}
