<template>
  <div class="root-container" :style="{width:`${pxWidth}px`}" ref="root">
    <div class="indicate-body">
      <span v-for="(time,index) in timeList" class="indicate" :style="{left:`${(index)*(100/(timeList.length-1))}%`}"
            :key="index">
        {{time}}
      </span>
      <div class="line-indicate-number" :style="{left:`${startPosition}%`}">
        {{this.start}}s
      </div>
      <div class="line-indicate-number" :style="{left:`${endPosition}%`}" v-if="endPosition<=100">
        {{Math.round((Number(this.start) + Number(this.duration))*100)/100}}s
      </div>
      <div class="sequence-window" ref="duration"
           :style="{left:`${startPosition}%`,right:`${endPosition<=100?100-endPosition:0}%`}">
        <span class="duration-text">{{this.duration}}s</span>
      </div>
      <div class="line-indicate" ref="start" :style="{left:`${startPosition}%`}"/>
      <div class="line-indicate" ref="end" :style="{left:`${endPosition}%`}" v-if="endPosition<=100"/>
    </div>

  </div>
</template>

<script>
  import _ from "lodash";

  const baseWidth = 800
  export default {
    name: "sequence-select",
    props: {
      start: {
        default: 0,
      },
      duration: {
        default: 0,
      },
      max: {
        default: 1000,
      },
      preAnimation: {
        default: undefined,
      }
    },
    data() {
      return {
        stepCount: 20,
        startX: 0,
        originState: 0,
        movingWindow: false,
        draggingStartLine: false,
        draggingEndLine: false,
      }
    },
    created() {
      this.originState = Number(this.start)
      if (this.preAnimation) {
        if (Number(this.start) < this.preEndTime) {
          this.$emit('update:start', Math.round(this.preEndTime * 100) / 100)
        }
      }
    },
    mounted() {
      this.throttleHandleMove = _.throttle(this.handleMouseMove)
      const root = this.$refs.root
      root.addEventListener('mousedown', this.handleMouseDown)
      document.addEventListener('mousemove', this.throttleHandleMove)
      document.addEventListener('mouseup', this.handleMouseUp)
      // root.addEventListener('mouseleave', this.handleMouseLeave)
    },
    methods: {
      handleMouseDown(event) {
        console.log('this down', this)
        const target = event.target
        if (target === this.$refs.duration) {
          this.movingWindow = true
          this.draggingStartLine = false
          this.draggingEndLine = false
          this.originState = Number(this.start)
        } else if (target === this.$refs.start) {
          this.draggingStartLine = true
          this.movingWindow = false
          this.draggingEndLine = false
          this.originState = Number(this.start)
          this.originEnd = Number(this.duration) + this.originState
        } else if (target === this.$refs.end) {
          this.draggingEndLine = true
          this.movingWindow = false
          this.draggingStartLine = false
          this.originState = Number(this.duration)
        } else {
          return true
        }
        this.startX = event.x
      },
      handleMouseMove(event) {
        const target = event.target
        if (this.movingWindow) {
          this.moveSequence(event)
        } else if (this.draggingStartLine) {
          this.changeStartTime(event)
        } else if (this.draggingEndLine) {
          this.changeEndTime(event)
        }
      },
      moveSequence(event) {
        const maxTime = this.timeList[this.timeList.length - 1] / 10
        const distance = event.x - this.startX
        const timeDistance = (distance / this.$refs.root.clientWidth) * maxTime
        const newStart = this.originState + timeDistance
        if (newStart < 0 || (newStart + Number(this.duration)) >= (maxTime) || newStart < this.preEndTime) {
          return
        }
        this.$emit('update:start', Math.round(newStart * 100) / 100)
      },
      changeStartTime(event) {
        const distance = event.x - this.startX
        const timeDistance = (distance / this.$refs.root.clientWidth) * this.timeList[this.timeList.length - 1] / 10
        const newStart = this.originState + timeDistance
        if (newStart < 0 || newStart >= this.originEnd || newStart < this.preEndTime) {
          return
        }
        this.$emit('update:start', Math.round(newStart * 100) / 100)
        this.$emit('update:duration', Math.round((this.originEnd - newStart) * 100) / 100)
      },
      changeEndTime(event) {
        const maxTime = this.timeList[this.timeList.length - 1]
        const distance = event.x - this.startX
        const timeDistance = (distance / this.$refs.root.clientWidth) * maxTime / 10
        const newEnd = Number(this.start) + this.originState + timeDistance
        if (newEnd <= this.start || newEnd >= maxTime / 10) {
          return
        }
        this.$emit('update:duration', Math.round((newEnd - this.start) * 100) / 100)
      },
      handleMouseUp(event) {
        if (this.movingWindow || this.draggingStartLine || this.draggingEndLine) {
          this.originState = Number(this.start)
        }
        this.movingWindow = false
        this.draggingStartLine = false
        this.draggingEndLine = false
      },
      handleMouseLeave(event) {
        if (this.movingWindow || this.draggingStartLine || this.draggingEndLine) {
          this.originState = Number(this.start)
        }
        this.movingWindow = false
        this.draggingStartLine = false
        this.draggingEndLine = false
      },
    },
    computed: {
      preEndTime() {
        if (!this.preAnimation) return 0
        return Number(this.preAnimation.animationDelay) + Number(this.preAnimation.animationDuration)
      },
      pxWidth() {
        return baseWidth + 100 * Math.round(this.indeedMax / 100)
      },
      indeedMax() {
        let max
        max = this.max > 2200 ? 2200 : this.max
        max = max < 100 ? 100 : max
        return max
      },
      timeList() {
        const result = []
        const step = this.indeedMax / this.stepCount
        let start = 0 - step;
        for (let i = 0; i < this.stepCount + 1; i++) {
          result.push(Math.round(start += step))
        }
        return result
      },
      startPosition() {
        return (this.start * 10) / this.indeedMax * 100
      },
      endPosition() {
        return ((Number(this.start) + Number(this.duration)) * 10) / this.indeedMax * 100
      }
    },
    watch: {
      'preAnimation': {
        handler(newVal, oldVal) {
          const preEnd = Number(newVal.animationDelay) + Number(newVal.animationDuration)
          const distance = preEnd - Number(this.start || 0)
          if (distance > 0) this.$emit('update:start', Math.round(preEnd * 100) / 100)
        },
        deep: true
      },
    },
    beforeDestroy() {
      const root = this.$refs.root
      root.removeEventListener('mousedown', this.handleMouseDown)
      document.removeEventListener('mouseup', this.handleMouseUp)
      document.removeEventListener('mousemove', this.throttleHandleMove)
      root.removeEventListener('mouseleave', this.handleMouseLeave)
    }
  }
</script>

<style scoped lang="scss">
  .root-container {


    .indicate-body {
      position: relative;
      width: 100%;
      height: 50px;
      border: 1px solid rgba(0, 0, 0, 0.3);
      box-sizing: border-box;
      overflow: visible;

      .indicate {
        position: absolute;
        top: 0px;
        bottom: 0;
        font-size: 5px;
        transform: translateX(-50%);
        flex-shrink: 0;
        white-space: nowrap;
      }

      .line-indicate {
        position: absolute;
        top: 0px;
        bottom: 0;
        transform: translateX(-50%);
        flex-shrink: 0;
        width: 5px;
        background: black;
        border-bottom: 1px solid black;
        border-top: 1px solid black;
        cursor: w-resize;
      }

      .line-indicate-number {
        position: absolute;
        top: 50%;
        transform: translate(20%, -50%);
        flex-shrink: 0;
        font-size: 5px;
        white-space: nowrap;
      }

      .sequence-window {
        position: absolute;
        top: 0;
        bottom: 0;
        flex-shrink: 0;
        background: rgba(0, 0, 0, 0.4);
        cursor: move;

        .duration-text {
          position: absolute;
          top: 80%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 5px;
          color: rgba(0, 0, 0, 1);
          white-space: nowrap;
        }
      }
    }
  }
</style>
