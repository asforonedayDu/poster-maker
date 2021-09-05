<script type="text/jsx">
  import page from "./page/index";
  import _ from "lodash";

  export default {
    name: "poster",
    props: {
      posterData: {
        default: () => {
          return {pages: [], audio: {}, loopPage: false}
        }
      },
      designMode: {
        default: false,
      },
      rootWidth: {
        default: 0,
      }
    },
    components: {
      page
    },
    created() {
      if (this.posterData) {
        // console.log('posterData')
        this.pages = this.posterData.pages
        this.posterData.audio && (Object.assign(this.audio, this.posterData.audio))
      }

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
        audio: {
          href: '',
          loop: true,
          autoPlay: true,
        },
        audioPlaying: false,
      }
    },
    render(h, context) {
      // {...{on: mouseListeners}}
      return (
        <div class="main-body" ref="container">
          {this.pages.map((pageData, index) => {
            return (
              <page pageData={pageData} currentPage={this.currentPage} pageIndex={index} pageLength={this.pages.length}
                    translateY={this.translateY} key={index} designMode={this.designMode}/>
            )
          })}
          <div class={`mp3-body ${this.audioPlaying ? 'playing' : ''}`} onClick={this.triggerMusic}>
            <img src={`${require('@/assets/svg-icons/defaultPic/icon-music.jpg')}`}/>
          </div>
          {this.audio.href &&
          <audio src={`${this.audio.href}`} autoPlay={!!this.audio.autoPlay} loop={!!this.audio.loop} onPlay={() => {
            this.audioPlaying = true
            clearInterval(this.audioTimer)
          }} onPause={() => {
            this.audioPlaying = false
          }} ref={'audio'}/>}
        </div>
      )
    },
    mounted() {
      // 自动播放
      if (this.audio.autoPlay && this.audio.href) {
        this.audioTimer = setInterval(() => {
          if (this.audioPlaying) {
            clearInterval(this.audioTimer)
            return
          }
          this.$refs.audio && this.$refs.audio.play()
        }, 300)
      }
      this.clientHeight = this.$refs.container.clientHeight
      //
      this._isModbile = !!navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
      this.$root._isModbile = this._isModbile
      const mouseListeners = {
        'down': this._isModbile ? 'touchstart' : 'mousedown',
        'up': this._isModbile ? 'touchend' : 'mouseup',
        'move': this._isModbile ? 'touchmove' : 'mousemove',
      }
      this.throttleTouchDown = _.throttle(this.handleTouchDown)
      this.throttleTouchMove = _.throttle(this.handleTouchMove)
      this.throttleTouchUp = _.throttle(this.handleTouchUp)
      this.$refs.container.addEventListener(mouseListeners.down, this.throttleTouchDown)
      this.$refs.container.addEventListener(mouseListeners.move, this.throttleTouchMove)
      this.$refs.container.addEventListener(mouseListeners.up, this.throttleTouchUp)
    },
    // watch: {
    //   audioPlaying(val) {
    //     console.log('audioPlaying', val)
    //   }
    // },
    methods: {
      triggerMusic() {
        if (!this.audio.href) return
        if (this.$refs.audio.paused) {
          this.$refs.audio.play();
        } else {
          this.$refs.audio.pause();
        }
      },
      handleTouchMove(e) {
        if (this.$root.preventPageScroll) return
        // e.preventDefault()
        if (this.dragging && !this.rolling) {
          // console.log('move')
          const offsetY = (e.clientY || e.targetTouches[0].clientY) - this.touchClientY
          // const pre = offsetY < 0
          // if (pre && this.currentPage === this.pages.length - 1) return;
          // if (!pre && this.currentPage === 0) return;
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
        if (this.$root.preventPageScroll) return
        if (this.rolling) return
        this.touchClientY = e.clientY || e.targetTouches[0].clientY
        this.lastPosition.offsetY = 0
        this.lastPosition.time = Date.now()
        this.dragging = true
        return false
      },
      handleTouchUp(e) {
        // e.preventDefault()
        if (this.$root.preventPageScroll) return
        this.dragging = false
        if (this.pages.length < 2) return
        const offsetY = (e.clientY || e.changedTouches[0].clientY) - this.touchClientY
        const pre = offsetY < 0
        // if (pre && this.currentPage === this.pages.length - 1) return;
        // if (!pre && this.currentPage === 0) return;
        this.translateY = (offsetY / this.clientHeight) * 100
        this.speed = (offsetY - this.lastPosition.offsetY) / (Date.now() - this.lastPosition.time)
        this.lastPosition.offsetY = 0
        this.lastPosition.time = 0
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
            // console.log('this.speed', this.speed)
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
                this.currentPage = (this.currentPage === this.pages.length - 1) ? 0 : this.currentPage + 1
              } else {
                this.currentPage = (this.currentPage === 0) ? (this.pages.length - 1) : this.currentPage - 1
              }
              this.translateY = 0
              this.rolling = false
            }
            requestAnimationFrame(timer)
          }
        }
      }
    },
    beforeDestroy() {
      clearInterval(this.audioTimer)
      const mouseListeners = {
        'down': this._isModbile ? 'touchstart' : 'mousedown',
        'up': this._isModbile ? 'touchend' : 'mouseup',
        'move': this._isModbile ? 'touchmove' : 'mousemove',
      }
      this.$refs.container.removeEventListener(mouseListeners.down, this.throttleTouchDown)
      this.$refs.container.removeEventListener(mouseListeners.move, this.throttleTouchMove)
      this.$refs.container.removeEventListener(mouseListeners.up, this.throttleTouchUp)
    },
  }
</script>
<style lang="scss">
  /*@import "./libs/animate.compat.css";*/
  @import "./libs/animations.scss";

  .cell-container-mid {
    width: 100%;
    height: 80rem;
    top: 50%;
    transform: translateY(-50%);
    position: absolute;
    overflow: hidden;
    pointer-events: none;
  }

  .cell-container-flex {
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;
    pointer-events: none;
  }

  .default-cell {
    pointer-events: auto;
    position: absolute;
    user-select: none;
    perspective: 100px;
    transform-style: preserve-3d;
    background-position: center !important;
    background-size: cover !important;
    background-repeat: no-repeat !important;

    * {
      white-space: pre-wrap;
      flex-shrink: 1;
      text-align: justify;
      word-break: normal;
    }
  }
</style>
<style lang="scss" scoped>
  @keyframes circle-loop {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

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

    .mp3-body {
      position: absolute;
      bottom: 15px;
      right: 20px;
      width: 30px;
      height: 30px;
      animation: circle-loop 3s linear infinite;
      border-radius: 50%;
      border: 0.1px solid rgba(0, 0, 0, 0);
      overflow: hidden;
      animation-play-state: paused;
      z-index: 99999;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .playing {
      animation-play-state: running !important;
    }

    audio {
      position: absolute;
      bottom: 15px;
      right: 20px;
      width: 30px;
      height: 30px;
      opacity: 0;
    }
  }
</style>
