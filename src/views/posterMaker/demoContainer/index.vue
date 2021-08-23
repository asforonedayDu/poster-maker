<script type="text/jsx">
  import cells from '../../../components/poster/cells/index.js'
  import VueDraggableResizable from 'vue-draggable-resizable'
  // optionally import default styles
  import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
  import {baseConfig} from '@/views/posterMaker/libs/static'

  const components = {}
  cells.forEach(component => {
    components[component.name] = component
  })
  components['vue-draggable-resizable'] = VueDraggableResizable

  export default {
    name: "demoContainer",
    components,
    props: {
      demoPageData: {
        default: {}
      },
      onSelectCell: {
        default: null
      }
    },
    data() {
      return {
        editWidth: 0,
        editHeight: 0,
        showEditWindow: false,
      }
    },
    render(h, context) {
      let items = []
      for (let item of this.demoCells) {
        if (item.props.hideInDesign) continue
        items.push(this.renderCell(h, item, context))
        if (item === this.onSelectCell) {
          items.push(this.renderEditWindow(h))
        }
      }
      return (
        <div class="demo-container-body">
          {items}
        </div>
      )
    },
    methods: {
      renderCell(h, item, context) {
        return h(`${item.type}`, {
          props: {
            ...item.props, designMode: true, id: item.id,
            'onClickCell': (id) => {
              const item = this.demoCells.find(item => item.id === id)
              if (item) {
                const rootComponent = this.$parent
                rootComponent.$refs.treeContainer.selectedIndex = rootComponent.treeData.indexOf(item)
                rootComponent.handleClickCell(item)
              }
            }
          }, ref: item.id,
        })
      },
      renderEditWindow(h) {
        if (!this.onSelectCell || !this.showEditWindow) return ''
        // console.log('this.onSelectCell.props locked', this?.onSelectCell?.props?.locked)
        const position = this.onSelectCell.props.position
        const left = (baseConfig.designWidth * (position.left || 0)) / 100
        const top = (baseConfig.designHeight * (position.top || 0)) / 100
        const style = {top: `0`, left: `0`, 'pointer-events': `${this?.onSelectCell?.props?.locked ? 'none' : 'auto'}`}
        return (
          <vue-draggable-resizable style={style} class="vue-draggable"
                                   props={{
                                     onResize: this.handleResize, onDrag: this.handleDrag,
                                   }} w={this.editWidth} h={this.editHeight} x={left} y={top}>
          </vue-draggable-resizable>
        )
      },
      handleResize(handle, x, y, width, height) {
        if (!this.onSelectCell.props.position) this.$set(this.onSelectCell.props, 'position', {})
        this.$set(this.onSelectCell.props.position, 'top', (y / baseConfig.designHeight) * 100)
        this.$set(this.onSelectCell.props.position, 'left', (x / baseConfig.designWidth) * 100)
        this.$set(this.onSelectCell.props.position, 'width', (width / baseConfig.designWidth) * 100)
        this.$set(this.onSelectCell.props.position, 'height', (height / baseConfig.designHeight) * 100)
      },
      handleDrag(x, y) {
        if (!this.onSelectCell.props.position) this.$set(this.onSelectCell.props, 'position', {})
        this.$set(this.onSelectCell.props.position, 'top', (y / baseConfig.designHeight) * 100)
        this.$set(this.onSelectCell.props.position, 'left', (x / baseConfig.designWidth) * 100)
      }
    },
    computed: {
      demoCells() {
        return (this.demoPageData && this.demoPageData.cells) ? this.demoPageData.cells : []
      },
      // editWidth() {
      //   const targetComponent = this.$refs[this.onSelectCell.id]
      //   if (!targetComponent) {
      //     console.log('onSelectCell targetComponent 未绑定', this.onSelectCell.id)
      //     return 200
      //   }
      //   return targetComponent.$refs.targetDom.clientWidth
      // },
      // editHeight() {
      //   const targetComponent = this.$refs[this.onSelectCell.id]
      //   if (!targetComponent) {
      //     console.log('onSelectCell editHeight targetComponent 未绑定', this.onSelectCell.id)
      //     return 200
      //   }
      //   return targetComponent.$refs.targetDom.clientHeight
      // }
    },
    watch: {
      onSelectCell(val) {
        // console.log('val',val)
        if (val && !val.props.hideInDesign) {
          this.$nextTick(vm => {
            const targetComponent = this.$refs[val.id]
            if (!targetComponent) {
              console.error('onSelectCell targetComponent 未绑定', val.id)
              return 200
            }
            this.editWidth = targetComponent.$refs.targetDom.clientWidth
            this.editHeight = targetComponent.$refs.targetDom.clientHeight
            this.showEditWindow = true
          })
        }
        this.showEditWindow = false
      }
    },
    mounted() {
    }
  }
</script>

<style lang="scss" scoped>

  .demo-container-body {
    width: 500px;
    height: 800px;
    position: relative;
    border-radius: 25px;
    border: 1px solid black;
    margin-bottom: 40px;
    overflow: hidden;

    .vue-draggable {
      border: 1.5px dashed #000;

      /*transform:scale(2,2.5);*/
    }
  }


</style>
