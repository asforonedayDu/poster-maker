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
      pageData: {
        type: Object,
        default: {}
      },
      designMode: {
        default: false
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
      },
      pageLength: {
        default: 0,
      }
    },
    data() {
      return {}
    },
    // created() {
    //   this.pageWidth = document.getElementById('poster-root').clientWidth
    // },
    render(h, context) {
      // const self = this
      let show = true
      if (!this.isCurrentPage) {
        const translateY = Math.abs(this.translateY)
        if (translateY === 0 || translateY === 100) {
          show = false
        }
      }
      return (
        <div class={`page-body ${this.pageClass}`} style={this.styleTranslateY} ref="pageContainer">
          {this.pageData.cells && show && this.pageData.cells.map(cell => {
            return !cell.props.disabled && this.renderCell(h, cell)
          })}
        </div>
      )
    },
    computed: {
      isPrePage() {
        // console.log('this.currentPage', this.currentPage, this.pageLength)
        if (this.pageLength === 2) {
          return this.pageIndex !== this.currentPage
        } else if (this.pageLength === 1) {
          return false
        }
        if (this.currentPage === 0) {
          return this.pageIndex === this.pageLength - 1
        }
        return this.pageIndex === this.currentPage - 1
      },
      isNextPage() {
        if (this.pageLength === 2) {
          return this.pageIndex !== this.currentPage
        } else if (this.pageLength === 1) {
          return false
        }
        if (this.currentPage === this.pageLength - 1) {
          return this.pageIndex === 0
        }
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
          cls = 'base-page'
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
    z-index: 0;
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
    visibility: hidden;
  }
</style>
<style lang="scss" scoped>
  .page-body {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;

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
