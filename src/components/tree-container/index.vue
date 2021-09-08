<script type="text/jsx">
  import _ from 'lodash'
  import Vue from 'vue'
  import defaultStyle from "./style-manager";
  import {mouseEvent, stopMouseEventPop} from '@/libs/util'

  export default {
    name: "tree-container-content",
    props: ['data', 'options'],
    data() {
      return {
        search: {input: ''},
        foldConfig: {fold: false, isMouseDown: false, downX: 0, savedContentWidth: 0},
        checkItems: {},
        openItems: {},
        selectedIndex: -1,
        treeData: [],
        contentWidth: 0,
        treeContentMaxHeight: -1,
        moreWindow: {left: 0, top: 0, index: -1, isShow: false, options: []},
        dragStarted: false,
      }
    },
    render: function (h) {
      let self = this
      return (
        <div class="container" style={{...this.getContainerStyle(), ...self.getBackgroundColor()}} ref="containerDom">
          <div class="content-body" style={{
            width: `${this.contentWidth}px`,
            'min-width': this.foldConfig.fold ? '0' : `${this.options.style.contentMinWidth ? this.options.style.contentMinWidth : '230'}px`,
          }}>
            <div class="content-border">
              {this.renderSearch(h)}
              <div class="slot-header" ref="slotHeaderDom">
                {this.$scopedSlots.header && this.$scopedSlots.header({})}
              </div>
              <div class="content" style={{
                'max-height': `${this.treeContentMaxHeight}px`,
              }}>
                {this.renderTree(h)}
              </div>
            </div>
            <div class="slot-footer" ref="slotFooterDom">
              {this.$scopedSlots.footer && this.$scopedSlots.footer({})}
            </div>
          </div>
          {this.renderFoldContent(h, self)}
          {this.renderMoreWindow(h, self)}
          <div class="container-fill-space"/>
          <div class="fold-move-handle" ref="foldMoveDom"/>
        </div>
      )
    },
    created() {
      this.treeData = this.data
      if (this.treeData.length > 0) {
        this.selectedIndex = 0
      }
      const contentWidth = _.hasIn(this, 'options.style.contentWidth') ? this.options.style.contentWidth : defaultStyle.contentWidth
      this.contentWidth = parseInt(contentWidth)
    },
    mounted() {
      let self = this
      this.initFoldMouseEvent(this)
      // 初始化列表高度
      this.handleWindowSizeChange(this)
      window.onresize = function () {
        self.handleWindowSizeChange(self)
      }
    },
    beforeDestroy() {
    },
    methods: {
      setClickItemByIndex(index) {
        this.selectedIndex = index
      },
      initFoldMouseEvent(self) {
        window.addEventListener(mouseEvent.down, function (e) {
          if (self.$refs.foldMoveDom && self.$refs.foldMoveDom === e.target) {
            self.foldConfig.isMouseDown = true
            self.foldConfig.downX = e.screenX
            e.preventDefault()
          }
        })
        window.addEventListener(mouseEvent.move, _.throttle(function (e) {
          if (self.foldConfig.isMouseDown && !self.foldConfig.fold) {
            e.preventDefault()
            window.requestAnimationFrame(function () {
              const xScroll = e.screenX - self.foldConfig.downX
              self.contentWidth = self.contentWidth + xScroll
              self.foldConfig.downX = e.screenX
            });
          }
        }, 3))
        window.addEventListener(mouseEvent.up, function (e) {
          if (self.foldConfig.isMouseDown && self.$refs.foldMoveDom) {
            self.foldConfig.isMouseDown = false
            self.foldConfig.downX = 0
          }
        })
        window.addEventListener('click', function (e) {
          if (self.moreWindow.isShow && self.$refs.moreWindowDom !== e.target) {
            self.moreWindow.isShow = false
          }
        })
      },
      renderSearch: function (h) {
        if (!_.hasIn(this, 'options.search')) {
          return ''
        }
        return (
          <div class="searchContainer" ref="searchContainerDom">
            <el-input
              class='search'
              prefix-icon="el-icon-search"
              placeholder={_.hasIn(this.options.search, 'placeholder') ? this.options.search.placeholder : ""}
              vModel={this.search.input}
              clearable>
            </el-input>
          </div>
        )
      },
      renderFoldContent(h, self) {
        return (
          <div class="fold-container">
            <div class={['fold-icon', `${self.foldConfig.fold ? 'fold-right' : 'fold-left'}`]}>
              <i onClick={self.triggerFold} class={[self.foldConfig.fold ? 'el-icon-s-unfold' : 'el-icon-s-fold']}/>
            </div>
          </div>
        )
      },
      renderTree(h) {
        let self = this
        const treeNode = []
        // show参数用于 保存一条路径的状态 如遇到不显示的 不再进入子元素
        let show = true
        let lastShowItemLevel = -1
        this.treeData.forEach(function (item, index) {
          // 搜索结果面板全部显示
          if (self.search.input && self.options.search.useLocalSearch) {
            treeNode.push(self.renderRow(h, self, item, index))
            return true
          }
          // 进入了子路径
          if (item.$level > lastShowItemLevel) {
            // 这条路径已经标记了不再显示
            if (!show) {
              return true
            }
            show = item.$hasChild ? self.openItems[item.id] : show
            lastShowItemLevel = item.$level
            treeNode.push(self.renderRow(h, self, item, index))
            return true
          } else {
            lastShowItemLevel = item.$level // 平级路径或上级路径
            show = self.openItems[item.id] // 定义子路径是否显示
            treeNode.push(self.renderRow(h, self, item, index))
            return true
          }
        })
        return treeNode
      },
      renderRow: function (h, self, item, index) {
        let draggable = false
        const dragEvents = {}
        if (this?.options?.handleDropItem) {
          draggable = true
          dragEvents.dragstart = (event) => {
            event.dataTransfer.setData('dragItem', `${item.id}`)
            this.dragStarted = true
          }
          dragEvents.drop = (event) => {
            const originId = event.dataTransfer?.getData('dragItem')
            if (originId) {
              this.handleDrop(event, originId, item)
            }
          }
          dragEvents.dragover = (event) => {
            if (this.dragStarted) event.preventDefault()
          }
        }
        return (
          <div key={item.id} class={['row-body']}
               style={{
                 'padding-left': `${(self.search.input && self.options.search.useLocalSearch) ? 0 : 14 * item.$level}px`,
                 ...self.getBackgroundColor()
               }} on={dragEvents} draggable={draggable} onDragend={this.handleDragEnd}>
            {self.renderTriangle(h, self, item, index)}
            <div
              class={['content-row', item.active === 0 && 'inactive', self.selectedIndex === index && 'item-selected']}
              oncontextmenu={(event) => {
                event.preventDefault()
                self.handleClickMore(event, self, item, index)
              }}
              onClick={() => {
                self.handleClickItem(h, self, item, index)
              }}>
              {self.renderCheckBox(h, self, item, index)}
              <i class={item.icon ? `${item.icon}` : `${self.options.defaultIcon ? self.options.defaultIcon : ''}`}/>
              <span class="content-row-span" title={self.getRowContent(item)}>
                {self.getRowContent(item)}
              </span>
              <div class="more-icon" onClick={(e) => {
                self.handleClickMore(e, self, item, index)
              }}>
                <i class="el-icon-more"/>
              </div>
            </div>
            {!self.search.input && self.renderBorder(h, self, item.$level)}
          </div>
        )
      },
      renderCheckBox(h, self, item, index) {
        if (!self.options || !self.options.checkbox) {
          return ''
        }
        return (
          <div class="checkbox-body">
            <input type="checkbox" checked={!!self.checkItems[item.id]} onClick={e => {
              e.stopPropagation()
            }} onChange={e => {
              const checked = e.target.checked
              self._handleClickCheckbox(item, checked, index)
            }}/>
          </div>
        )
      },
      renderTriangle(h, self, item, index) {
        if (self.search.input) {
          return ''
        }
        return (
          <div class="">
            <div class={['icon-triangle', self.openItems[item.id] && 'open']}
                 style={{visibility: (item.$hasChild || item.asyncChild) ? 'visible' : 'hidden'}}
                 onClick={() => {
                   self.handleClickTriangle(self, item, index)
                 }}/>
          </div>
        )
      },
      renderBorder(h, self, level) {
        if (level > 0) {
          const borders = []
          for (let i = 0; i < level; i++) {
            borders.push((
              <div class={['row-border']}
                   style={{left: `${i * 14 + 7}px`}}
              />
            ))
          }
          return borders
        }
      },
      renderMoreWindow: function (h, self) {
        const index = self.moreWindow.index
        const item = self.treeData[index]
        return (
          <div class="more-body"
               style={{display: self.moreWindow.isShow ? 'block' : 'none'}}>
            <div class="more-container" ref="moreWindowDom"
                 style={{
                   left: `${self.moreWindow.left}px`,
                   top: `${self.moreWindow.top}px`, ...self.getBackgroundColor()
                 }}>
              {this.moreWindow.options.map((option) => {
                return (
                  <p class="edit-more-text" onClick={(event) => {
                    option.onClick(item, index, event)
                  }}>{option.text}</p>
                )
              })}
            </div>
          </div>)
      },
      getRowContent(item) {
        if (this.search.input && this.options.search.useLocalSearch) {
          return (item.$namePath ? (item.$namePath + '/') : '') + item.name
        } else {
          return item?.props?.name || item.name
        }
      },
      handleDrop(event, originId, item) {
        const originItem = this.treeData.find(item => item.id === originId)
        if (originItem && originItem !== item) {
          this?.options?.handleDropItem(originItem, item)
        }
      },
      handleDragEnd(event) {
        this.dragStarted = false
      },
      handleClickItem: function (h, self, item, index) {
        self.selectedIndex = index
        if (self?.options?.handleClickItem) {
          self.options.handleClickItem(item, index, self.openItems[item.id])
        }
      },
      handleClickTriangle: function (self, item, index) {
        // 异步请求
        if (item.asyncChild && self.options.handleClickLoadChild && self.openItems[item.id] === undefined) { // 无子项 需要加载子项
          self.options.handleClickLoadChild(item, index, () => {
            Vue.set(self.openItems, item.id, !self.openItems[item.id])
          })
          return;
        }
        const newObj = Object.assign({}, self.openItems)
        newObj[item.id] = !self.openItems[item.id]
        self.openItems = newObj
      },
      handleClickMore: function (e, self, item, index) {
        if (_.hasIn(self, 'options.moreOption.getOption')) {
          const options = self.options.moreOption.getOption(item, index)
          if (options) {
            self.moreWindow.options = options
          }
        } else {
          return
        }
        if (self.moreWindow.index !== index) {
          self.moreWindow.isShow = true
          self.moreWindow.index = index
        } else {
          self.moreWindow.isShow = !!!self.moreWindow.isShow
        }
        if (self.moreWindow.isShow) {
          const rect = e.currentTarget.getBoundingClientRect()
          self.moreWindow.left = rect.right - 120
          self.moreWindow.top = rect.bottom
        }
        stopMouseEventPop(e)
      },
      handleWindowSizeChange(self) {
        const paddingSize = 45
        const searchWindowHeight = this.$refs.searchContainerDom ? this.$refs.searchContainerDom.offsetHeight : 0
        const containerHeight = this.$refs.containerDom.offsetHeight
        const slotHeaderHeight = this.$refs.slotHeaderDom.offsetHeight
        const slotFooterHeight = this.$refs.slotFooterDom.offsetHeight
        this.treeContentMaxHeight = containerHeight - slotFooterHeight - searchWindowHeight - slotHeaderHeight - paddingSize
      },
      _handleClickCheckbox(item, checked, index) {
        let self = this
        self.checkItems[item.id] = checked
        for (let i = index + 1; i < self.treeData.length; i += 1) {
          if (self.treeData[i].$level <= item.$level) {
            break
          }
          Vue.set(self.checkItems, self.treeData[i].id, checked)
        }
        self.options.checkbox.handleCheckBoxChange(item, checked,
          Object.keys(self.checkItems).filter(id => self.checkItems[id]), index)
      },
      triggerFold(e) {
        let self = this
        const animateTime = 200                   // display: self.foldConfig.fold ? 'none' : 'flex'
        const loopTime = 5
        const loopCount = animateTime / loopTime
        if (this.foldConfig.fold) {
          const increaseWidth = self.foldConfig.savedContentWidth / loopCount
          const intervalID = setInterval(function () {
            if (self.contentWidth < self.foldConfig.savedContentWidth) {
              self.contentWidth += increaseWidth
            } else {
              self.contentWidth = self.foldConfig.savedContentWidth
              self.foldConfig.fold = false
              clearInterval(intervalID)
            }
          }, loopTime)
        } else {
          self.foldConfig.fold = true
          self.foldConfig.savedContentWidth = self.contentWidth
          const increaseWidth = self.contentWidth / loopCount
          const intervalID = setInterval(function () {
            if (self.contentWidth > 0) {
              self.contentWidth -= increaseWidth
            } else {
              self.contentWidth = 0
              clearInterval(intervalID)
            }
          }, loopTime)
        }
        //savedContentWidth
      },
      getContainerStyle() {
        if (!_.hasIn(this, 'options.style')) {
          return defaultStyle
        } else {
          return {
            ...defaultStyle,
            ...this.options.style,
          }
        }
      },
      getBackgroundColor() {
        const hasSet = _.hasIn(this, 'options.style.backgroundColor')
        return {
          background: hasSet ? this.options.style.backgroundColor : defaultStyle.background
        }
      }
    },
    watch: {
      'search.input': function (newVal, oldVal) {
        if (this.options.search.useLocalSearch) {
          if (newVal.length === 0) {
            this.treeData = this.data
          } else {
            const re = new RegExp('.*' + newVal + '.*', "i"); //
            this.treeData = this.data.filter(item => {
              return re.test(item.name);
            })
          }
        }
        if (_.hasIn(this, 'options.search.handleSearch')) {
          this.options.search.handleSearch(newVal)
        }
      },
      data: function (newVal, oldVal) {
        this.treeData = newVal
        // this.$set(this, 'treeData', newVal)
        // this.$forceUpdate()
      },
      openItems(newVal, oldVal) {
        // console.log('openItems', newVal, oldVal)
      }
    }
  }

</script>

<style scoped lang="scss">

  .container {
    height: 100%;
    display: inline-flex;
    flex-direction: column;
    min-width: 33px;
    overflow: hidden;
    position: relative;
    border-right: 1px solid #2A2D2E10;
  }

  .container-fill-space {
    flex-grow: 1;
  }

  .content-body {
    padding-top: 22px;
  }

  .content-border {
    /*transition: width 0.3s ease-in-out;*/
    overflow: hidden;
    box-sizing: border-box;
    display: flex;
    flex-flow: column nowrap;
  }

  .content {
    display: flex;
    flex-grow: 1;
    flex-flow: column nowrap;
    overflow-x: hidden;
    overflow-y: auto;
    flex-shrink: 1;
    height: auto;
  }

  .searchContainer {
    display: flex;
    padding-left: 24px;
    padding-right: 40px;
    flex-flow: column nowrap;
  }

  .search {
    margin-bottom: 10px;
  }

  .slot-footer {
    width: 100%;
    height: fit-content;
    position: relative;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow-x: hidden;
  }

  .slot-header {
    width: 100%;
    height: fit-content;
    position: relative;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow-x: hidden;
  }

  .fold-container {
    display: flex;
    position: absolute;
    right: 0;
    top: 22px;
  }

  .fold-move-handle {
    position: absolute;
    width: 5px;
    right: 0;
    height: 100%;
  }

  .fold-move-handle:hover {
    cursor: w-resize;
  }

  .fold-icon {
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 32px;
    display: block;
    color: #606266;
    transition: color .15s linear;
    border: 1px solid #dee0e3;
    border-radius: 4px 0 0 4px;
  }

  .fold-left {
    border-right: none;
  }

  .fold-right {
    border-left: none;
  }

  .fold-icon:hover {
    color: #3492ff;
    cursor: pointer;
  }

  .row-body {
    display: flex;
    box-sizing: border-box;
    flex-flow: row nowrap;
    position: relative;
    padding-right: 30px;
    margin-left: 24px;
  }

  .triangle-body {
  }

  .container:hover .row-border {
    position: absolute;
    width: 1px;
    height: 100%;
    background: rgb(222, 224, 227);
  }

  .row-body:hover {
    cursor: pointer;
  }

  .item-selected {
    color: rgb(51, 112, 255);
    background-color: rgb(240, 244, 255) !important;
  }

  .content-row {
    overflow: hidden;
    padding-left: 5px;
    margin-top: 10px;
    width: 100%;
    margin-bottom: 10px;
    white-space: nowrap;
    text-overflow: fade;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-flow: row nowrap;
    height: 38px;
  }

  .content-row.inactive {
    opacity: 0.5
  }

  .content-row:hover {
    background-color: rgb(239, 240, 241);
  }

  .icon-triangle {
    position: relative;
    width: 18px;
    height: 100%;
  }

  .icon-triangle:after {
    position: absolute;
    top: calc(50% - 1.5px);
    content: "";
    width: 0;
    height: 0;
    left: 4px;
    border-color: #767c85 transparent transparent;
    border-style: solid solid none;
    border-width: 5px 5px 0;
    transform: rotate(-90deg);
    transition: transform .3s;
  }

  .icon-triangle.open:after {
    transform: rotate(0deg);
  }

  .checkbox-body {
    width: auto;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
  }

  .content-row-span {
    padding-left: 5px;
    flex-grow: 1;
    display: block;
    text-overflow: ellipsis;
  }

  .more-icon {
    flex-shrink: 0;
    min-width: 20px;
    width: 20px;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
  }

  .el-icon-more {
    transform: rotate(90deg);
  }

  .more-body {
    position: fixed;
    left: 0;
    top: 0;
  }

  .more-container {
    position: absolute;
    width: 120px;
    padding: 5px 0 5px 0;
    box-shadow: 0 0 2px 1px rgba(56, 56, 56, 0.2)
  }

  .edit-more-text {
    font-size: 14px;
    text-align: center;
    margin: 0;
    padding: 6px 5px;
    line-height: 20px;
    color: #1f2329;
  }

  .edit-more-text:hover {
    cursor: pointer;
    background: #eff0f1;
  }
</style>
