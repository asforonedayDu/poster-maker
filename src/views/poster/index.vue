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
      console.log('pageData')
      this.pages = this.pageData
    }
    let rootWidth = this.rootWidth
    if (!rootWidth) {
      rootWidth = document.documentElement.clientWidth || document.body.clientWidth
    }
    let htmlDom = document.getElementsByTagName('html')[0]
    htmlDom.style.fontSize = (rootWidth / 100) + 'px'
    this._isModbile = !!navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
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
    // mousedown={this.handleTouchDown} mouseup={this.handleTouchUp}
    // mousemove={this.handleTouchMove}
    // touchmove={this.handleTouchMove} touchstart={this.handleTouchDown} touchend={this.handleTouchUp}
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
    return (
      <div class="main-body" {...{on: mouseListeners}} ref="container">
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
    })
  },
  methods: {
    handleTouchMove(e) {
      if (this.dragging && !this.rolling) {
        console.log('handleTouchMove', e)
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
        console.log('translateY', offsetY, this.translateY, 'speed', this.speed)
      }
    },
    handleTouchDown(e) {
      console.log('down', e)
      if (this.rolling) return
      this.touchClientY = e.clientY || e.targetTouches[0].clientY
      this.lastPosition.offsetY = 0
      this.lastPosition.time = Date.now()
      this.dragging = true
    },
    handleTouchUp(e) {
      if (this.pages.length < 2) return
      console.log('touchup', e)
      const offsetY = (e.clientY || e.changedTouches[0].clientY) - this.touchClientY
      const pre = offsetY < 0
      if (pre && this.currentPage === this.pages.length - 1) return;
      if (!pre && this.currentPage === 0) return;
      this.translateY = (offsetY / this.clientHeight) * 100
      this.speed = (offsetY - this.lastPosition.offsetY) / (Date.now() - this.lastPosition.time)
      console.log('translateY up', this.translateY, 'speed', this.speed)
      this.lastPosition.offsetY = 0
      this.lastPosition.time = 0
      this.dragging = false
      if (this.translateY !== 0) {
        this.rolling = true
        // 回滚
        if (Math.abs(this.translateY) < 27 && Math.abs(this.speed) < 0.5) {
          console.log('roll back')
          this.speed = this.translateY > 0 ? 0.5 : -0.5
          const timer = () => {
            if ((offsetY > 0 && this.translateY > 0.1) || (offsetY < 0 && this.translateY < 0.1)) {
              this.translateY = this.translateY - this.speed
              console.log('this.translateY', this.translateY)
              requestAnimationFrame(timer)
            } else {
              this.translateY = 0
              this.rolling = false
            }
          }
          requestAnimationFrame(timer)
        } else {
          // 滚动一屏
          console.log('roll a page')
          this.speed = Math.max(Math.abs(this.speed), 0.8) * 2
          this.speed = pre ? -this.speed : this.speed
          const timer = () => {
            if (this.dragging) {
              return
            }
            if (pre && this.translateY > -100) {
              this.translateY = Math.max(-100, this.translateY + this.speed)
              console.log('this.translateY', this.translateY)
              if (this.translateY > -100) {
                requestAnimationFrame(timer)
                return;
              }
            } else if (!pre && this.translateY < 100) {
              this.translateY = Math.min(100, this.translateY + this.speed)
              console.log('this.translateY', this.translateY)
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

<style lang="scss" scoped>
  @import "~animate.css";

  .main-body {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    /*display: flex;*/
    /*flex-flow: column nowrap;*/
    /*justify-content: center;*/
    /*align-items: center;*/
  }
</style>
