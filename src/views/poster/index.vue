<script type="text/jsx">
import page from "./page";

export default {
  name: "poster",
  props: {
    pageData: {
      default: () => {
        return []
      }
    },
    rootWidth: {
      default: 0,
    }
  },
  components: {
    page
  },
  created() {
    if (this.pageData) {
      // console.log('pageData')
      this.pages = this.pageData
    }
    let rootWidth = this.rootWidth
    if (!rootWidth) {
      rootWidth = document.documentElement.clientWidth || document.body.clientWidth
    }
    let htmlDom = document.getElementsByTagName('html')[0]
    htmlDom.style.fontSize = (rootWidth / 100) + 'px'

    // 全局抬手监听
    this.touchEndHandler = (e) => {
      this.dragging = false
    }
    window.addEventListener('mouseup', this.touchEndHandler)
    window.addEventListener('touchend', this.touchEndHandler)
  },
  destroyed() {
    window.removeEventListener('mouseup', this.touchEndHandler)
    window.removeEventListener('touchend', this.touchEndHandler)
  },
  data() {
    return {
      pages: [],
      clientHeight: 0,
      currentPage: 0,
      translateY: 0,
      dragging: false,
      touchStartY: 0,
      rolling: false,
      touchClientY: 0,
      lastPosition: {
        offsetY: 0,
        time: 0,
      },
      speed: 0,
    }
  },
  render(h, context) {
    // {...{on: mouseListeners}}
    return (
      <div class="main-body" ref="container">
        {this.pages.map((pageData, index) => {
          return (
            <page pageData={pageData} currentPage={this.currentPage} pageIndex={index}
                  translateY={this.translateY} key={index}/>
          )
        })}

      </div>
    )
  },
  mounted() {
    this.$nextTick(() => {
      this.clientHeight = this.$refs.container.clientHeight
      //
      this._isModbile = !!navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
      let mouseListeners;
      if (!this._isModbile) {
        mouseListeners = {
          'mousedown': this.handleTouchDown,
          'mouseup': this.handleTouchUp,
          'mousemove': this.handleTouchMove,
        }
      } else {
        mouseListeners = {
          'touchmove': this.handleTouchMove,
          'touchstart': this.handleTouchDown,
          'touchend': this.handleTouchUp,
        }
      }
      Object.keys(mouseListeners).forEach(key => {
        this.$refs.container.addEventListener(key, mouseListeners[key])
      })
    })
  },
  methods: {
    handleTouchMove(e) {
      // e.preventDefault()
      if (this.dragging && !this.rolling) {
        // console.log('move')
        const offsetY = (e.clientY || e.targetTouches[0].clientY) - this.touchClientY
        const pre = offsetY < 0
        if (pre && this.currentPage === this.pages.length - 1) return;
        if (!pre && this.currentPage === 0) return;
        this.translateY = (offsetY / this.clientHeight) * 100
        // 计算速度
        const now = Date.now()
        if ((now - this.lastPosition.time) < 20) {
          return
        }
        this.speed = (offsetY - this.lastPosition.offsetY) / (now - this.lastPosition.time)
        this.lastPosition.offsetY = offsetY
        this.lastPosition.time = now
        return false
        // console.log('translateY', offsetY, this.translateY, 'speed', this.speed)
      }
    },
    handleTouchDown(e) {
      // e.preventDefault()
      if (this.rolling) return
      this.touchClientY = e.clientY || e.targetTouches[0].clientY
      this.lastPosition.offsetY = 0
      this.lastPosition.time = Date.now()
      this.dragging = true
      return false
    },
    handleTouchUp(e) {
      // e.preventDefault()
      if (this.pages.length < 2) return
      const offsetY = (e.clientY || e.changedTouches[0].clientY) - this.touchClientY
      const pre = offsetY < 0
      if (pre && this.currentPage === this.pages.length - 1) return;
      if (!pre && this.currentPage === 0) return;
      this.translateY = (offsetY / this.clientHeight) * 100
      this.speed = (offsetY - this.lastPosition.offsetY) / (Date.now() - this.lastPosition.time)
      this.lastPosition.offsetY = 0
      this.lastPosition.time = 0
      this.dragging = false
      if (this.translateY !== 0) {
        this.rolling = true
        // 回滚
        if (Math.abs(this.translateY) < 8 && Math.abs(this.speed) < 0.5) {
          // console.log('roll back')
          this.speed = this.translateY > 0 ? 0.5 : -0.5
          const timer = () => {
            if ((offsetY > 0 && this.translateY > 0.1) || (offsetY < 0 && this.translateY < 0.1)) {
              this.translateY = this.translateY - this.speed
              // console.log('this.translateY', this.translateY)
              requestAnimationFrame(timer)
            } else {
              this.translateY = 0
              this.rolling = false
            }
          }
          requestAnimationFrame(timer)
        } else {
          // 滚动一屏
          this.speed = 2 + ((Math.max(Math.abs(this.speed), 0.8) * 2.5 - 2) / 7)
          console.log('this.speed', this.speed)
          this.speed = pre ? -this.speed : this.speed
          const timer = () => {
            if (this.dragging) {
              return
            }
            if (pre && this.translateY > -100) {
              this.translateY = Math.max(-100, this.translateY + this.speed)
              // console.log('this.translateY', this.translateY)
              if (this.translateY > -100) {
                requestAnimationFrame(timer)
                return;
              }
            } else if (!pre && this.translateY < 100) {
              this.translateY = Math.min(100, this.translateY + this.speed)
              // console.log('this.translateY', this.translateY)
              if (this.translateY < 100) {
                requestAnimationFrame(timer)
                return;
              }
            }
            if (pre) {
              this.currentPage += 1
            } else {
              this.currentPage -= 1
            }
            this.translateY = 0
            this.rolling = false
          }
          requestAnimationFrame(timer)
        }
      }
    }
  }
}
</script>
<style lang="scss">
  @import "../poster/libs/animations";

  .cell-container-mid {
    width: 100%;
    height: 160rem;
    top: 50%;
    transform: translateY(-50%);
    position: absolute;
    overflow: hidden;
  }

  .cell-container-flex {
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;
  }

  .default-cell {
    position: absolute;
    user-select: none;
    perspective: 100px;
    transform-style: preserve-3d;
    background-position: center !important;
    background-size: cover !important;
    background-repeat: no-repeat !important;
  }
</style>
<style lang="scss" scoped>
  @import "~animate.css";

  .main-body {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    touch-action: none;
    /*display: flex;*/
    /*flex-flow: column nowrap;*/
    /*justify-content: center;*/
    /*align-items: center;*/
  }
</style>
