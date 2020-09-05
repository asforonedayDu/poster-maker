<script type="text/jsx">
import cells from '../../poster/cells/index.js'
import VueDraggableResizable from 'vue-draggable-resizable'
// optionally import default styles
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
import {baseConfig} from '@/views/posterMaker/index.vue'

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
    return {}
  },
  render(h, context) {
    return (
      <div class="demo-container-body">
        {this.demoCells.map(item => {
          return this.renderCell(h, item)
        })}
        {this.renderEditWindow(h)}
      </div>
    )
  },
  methods: {
    renderCell(h, item) {
      const cell = item.data
      console.log('cell.id', item.id)
      return h(`${cell.type}`, {props: {...cell.props}, ref: item.id})
    },
    renderEditWindow(h) {
      if (!this.onSelectCell) return ''
      console.log('refs', this.$refs, this.editWidth, this.editHeight)
      const position = this.onSelectCell.data.props.position
      const left = (baseConfig.designWidth * (position.left || 0)) / 100
      const top = (baseConfig.designHeight * (position.top || 0)) / 100
      const style = {top: `0`, left: `0`}
      return (
        <vue-draggable-resizable style={style} class="vue-draggable"
                                 props={{
                                   onResize: this.handleResize, onDrag: this.handleDrag
                                 }}
                                 enable-native-drag={true}
                                 disable-user-select={true}
                                 w={this.editWidth} h={this.editHeight} x={left} y={top}>
        </vue-draggable-resizable>
      )
    },
    handleResize(x, y, width, height) {
      if (!this.onSelectCell.data.props.position) this.$set(this.onSelectCell.data.props, 'position', {})
      console.log('width, height', x, y, width, height)
      // this.$set(this.onSelectCell.data.props.position, 'top', (y / baseConfig.designHeight) * 100)
      // this.$set(this.onSelectCell.data.props.position, 'left', (x / baseConfig.designWidth) * 100)
      // this.$set(this.onSelectCell.data.props.position, 'width', width / baseConfig.designWidth)
      // this.$set(this.onSelectCell.data.props.position, 'height', height / baseConfig.designHeight)
    },
    handleDrag(x, y) {
      console.log('drag', x, y)
      if (!this.onSelectCell.data.props.position) this.$set(this.onSelectCell.data.props, 'position', {})
      this.$set(this.onSelectCell.data.props.position, 'top', (y / baseConfig.designHeight) * 100)
      this.$set(this.onSelectCell.data.props.position, 'left', (x / baseConfig.designWidth) * 100)
    }
  },
  computed: {
    demoCells() {
      return this.demoPageData.children ? this.demoPageData.children : []
    },
    editWidth() {
      const targetComponent = this.$refs[this.onSelectCell.id]
      if (!targetComponent) {
        console.log('onSelectCell targetComponent 未绑定', this.onSelectCell.id)
        return 200
      }
      return targetComponent.$refs.targetDom.clientWidth
    },
    editHeight() {
      const targetComponent = this.$refs[this.onSelectCell.id]
      if (!targetComponent) {
        console.log('onSelectCell editHeight targetComponent 未绑定', this.onSelectCell.id)
        return 200
      }
      return targetComponent.$refs.targetDom.clientHeight
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

    .vue-draggable {
      /*border: 1px solid black;*/
    }
  }


</style>
