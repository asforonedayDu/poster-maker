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
    },
    currentPage: {
      required: true,
      type: Number
    },
    pageIndex: {
      required: true,
      type: Number
    },
    translateY: {
      required: true,
      type: Number
    }
  },
  data() {
    return {}
  },
  render(h, context) {
    const self = this
    return (
      <div class={`page-body ${this.pageClass}`} style={this.styleTranslateY}>
        {this.pageData.cells.map(cell => {
          return this.renderCell(h, cell)
        })}
      </div>
    )
  },
  computed: {
    isPrePage() {
      return this.pageIndex === this.currentPage - 1
    },
    isNextPage() {
      return this.pageIndex === this.currentPage + 1
    },
    isCurrentPage() {
      return this.pageIndex === this.currentPage
    },
    styleTranslateY() {
      if (this.isPrePage && this.translateY > 0) {
        return `transform: translateY(-${100 - this.translateY}%);`
      } else if (this.isNextPage && this.translateY < 0) {
        return `transform: translateY(${100 + this.translateY}%);`
      }
      return ''
    },
    pageClass() {
      let cls
      if (this.isPrePage) {
        cls = 'pre-page'
      } else if (this.isNextPage) {
        cls = 'next-page'
      } else if (this.isCurrentPage) {
        cls = ''
      } else {
        cls = 'hide-page'
      }
      return cls
    }
  },
  methods: {
    renderCell(h, cell) {
      return h(`${cell.type}`, {props: cell.props})
    }
  }
}
</script>
<style>
  .pre-page {
    transform: translateY(-100%);
    z-index: 1 !important;
  }

  .next-page {
    transform: translateY(100%);
    z-index: 1 !important;
  }

  .hide-page {
    display: none;
  }
</style>
<style lang="scss" scoped>
  .page-body {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 0;


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
