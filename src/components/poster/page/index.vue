<script type="text/jsx">
  import cells from '../cells'

  const components = {}
  cells.forEach(component => {
    components[component.name] = component
  })
  export default {
    name: "page",
    components,
    props: {
      designMode: {
        default: false,
      },
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
      if (!this.isCurrentPage) {
        const translateY = Math.abs(this.translateY)
        if (translateY === 0 || translateY === 100) {
          return ''
        }
      }
      return (
        <div class={`page-body ${this.pageClass}`} style={this.styleTranslateY}>
          {this.pageData.cells && this.pageData.cells.map(cell => {
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
          cls = 'pre-page base-page'
        } else if (this.isNextPage) {
          cls = 'next-page base-page'
        } else if (this.isCurrentPage) {
          cls = ''
        } else {
          cls = 'hide-page base-page'
        }
        return cls
      }
    },
    methods: {
      renderCell(h, cell) {
        return h(`${cell.type}`, {props: {...cell.props, designMode: this.designMode}})
      }
    }
  }
</script>
<style>
  .base-page {
  }

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
    overflow: hidden;

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
