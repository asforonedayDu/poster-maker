<script type="text/jsx">
import cells from '../cells/index.js'

const components = {}
cells.forEach(component => {
  components[component.name] = component
})
export default {
  name: "page",
  components,
  props: {
    pageData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {}
  },
  render(h, context) {
    const self = this
    return (
      <div class="page-body">
        {this.pageData.cells.map(cell => {
          return this.renderCell(h, cell)
        })}
      </div>
    )
  },
  methods: {
    renderCell(h, cell) {
      return h(`${cell.type}`, {props: cell.props})
    }
  }
}
</script>

<style lang="scss" scoped>
  .page-body {
    width: 100%;
    height: 100%;
    position: absolute;


    /*.cell-container {*/
    /*  position: absolute;*/
    /*}*/

    /*.content-body {*/
    /*  position: relative;*/
    /*  display: flex;*/
    /*  flex-flow: column nowrap;*/
    /*  justify-content: center;*/
    /*  height: 151vw;*/
    /*  width: 100%;*/
    /*}*/


  }
</style>
