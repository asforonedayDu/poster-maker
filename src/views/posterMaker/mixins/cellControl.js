import handleClipboard from "@/libs/clipboard";
import {cleanCellProps, getMaxCellId} from "@/views/posterMaker/libs/static";

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
      this.showPageConfigPanel = false
      this.onSelectPage = parent
      this.onSelectCell = item
      this.isOpenConfigDrawer = true
    },
    getCellOptions(item, index) {
      const parent = this.pages.find(page => page.id === item.$parentId)
      if (!parent) {
        throw new Error('该元素未找到所属页面 getCellOptions' + item.$parentId)
      }
      const disableCell = {
        text: '屏蔽元素',
        onClick: (item) => {
          this.$set(item.props, 'disabled', true)
        }
      }
      const enableCell = {
        text: '解除屏蔽',
        onClick: (item) => {
          this.$set(item.props, 'disabled', false)
        }
      }
      const lock = {
        text: '锁定移动',
        onClick: (item) => {
          this.$set(item.props, 'locked', true)
        }
      }
      const unLock = {
        text: '解除锁定',
        onClick: (item) => {
          this.$set(item.props, 'locked', false)
        }
      }
      const hideInDesign = {
        text: '编辑时隐藏',
        onClick: (item) => {
          this.$set(item.props, 'hideInDesign', true)
        }
      }
      const unLockHideInDesign = {
        text: '解除隐藏',
        onClick: (item) => {
          this.$set(item.props, 'hideInDesign', false)
        }
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
      const copyAfter = {
        text: '此元素后粘贴',
        onClick: (item, index) => {
          const content = this.$root.copedCellContent
          if (content) {
            const cell = JSON.parse(content)
            cleanCellProps(cell)
            cell.id = `${parent.id}_${getMaxCellId(parent.cells) + 1}`
            const i = parent.cells.indexOf(item)
            parent.cells.splice(i + 1, 0, cell)
          }
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
        {
          text: '复制元素',
          onClick: (item, index, event) => {
            this.$root.copedCellContent = JSON.stringify(item)
          }
        },
        {
          text: '在下方添加元素',
          onClick: (item) => {
            const i = parent.cells.indexOf(item)
            this.dialogAddCellVisible = true
            this.onSelectAddCell.parentPage = parent
            this.onSelectAddCell.addPosition = i + 1
          }
        }
      ]
      const position = parent.cells.indexOf(item)
      if (position > 0) {
        options.push(moveUp)
      }
      if (position < (parent.cells.length - 1)) {
        options.push(moveDown)
      }
      options.push(item.props.locked ? unLock : lock)
      options.push(item.props.hideInDesign ? unLockHideInDesign : hideInDesign)
      options.push(item.props.disabled ? enableCell : disableCell)
      if (this.$root.copedCellContent) {
        options.push(copyAfter)
      }
      return options
    }
  }
}
