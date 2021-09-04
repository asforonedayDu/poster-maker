import {treeDataType} from '../libs/static'
import {cleanCellProps, cleanPageProps, getMaxCellId, getMaxPageId} from "@/views/posterMaker/libs/static";

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
      let maxId = getMaxPageId(this.pages)
      this.pages.push({
        id: maxId + 1,
        props: {name: `第${length + 1}页`},
        createType: treeDataType.PAGE,
        cells: []
      })
    },
    getPageOptions(item, index) {
      this.$refs.treeContainer.setClickItemByIndex(index)
      const options = [
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
        {
          text: '复制本页',
          onClick: (item, index) => {
            this.copyPage(item)
          }
        },
      ]
      const moveUp = {
        text: '上移',
        onClick: (item) => {
          const i = this.pages.indexOf(item)
          this.pages[i] = this.pages[i - 1]
          this.$set(this.pages, i - 1, item)
        }
      }
      const moveDown = {
        text: '下移',
        onClick: (item, index) => {
          const i = this.pages.indexOf(item)
          this.pages[i] = this.pages[i + 1]
          this.$set(this.pages, i + 1, item)
        }
      }

      const position = this.pages.indexOf(item)
      if (position > 0) {
        options.push(moveUp)
      }
      if (position < (this.pages.length - 1)) {
        options.push(moveDown)
      }
      return options
    },
    copyPage(page) {
      const pageNew = _.cloneDeep(page)
      const length = this.pages.length
      let maxId = getMaxPageId(this.pages)
      pageNew.props.name = `第${length + 1}页`
      pageNew.id = maxId + 1
      cleanPageProps(pageNew)

      const cells = pageNew.cells
      pageNew.cells = []
      this.pages.push(pageNew)
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i]
        cleanCellProps(cell)
        cell.id = `${pageNew.id}_${i + 1}`
        pageNew.cells.push(cell)
      }
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
      let maxId = getMaxCellId(this.onSelectPage.cells)
      this.onSelectAddCell.cell.props.name = this.onSelectAddCell.inputCellName
      this.onSelectPage.cells.push(_.cloneDeep({
        id: this.onSelectPage.id + '_' + (maxId + 1),
        createType: treeDataType.CELL,
        ...this.onSelectAddCell.cell
      }))
    }
  }
}
