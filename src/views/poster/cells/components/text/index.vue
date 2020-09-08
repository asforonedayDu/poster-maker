<template>
  <div class="cell-container-mid">
    <div class="default-cell" :style="style" ref="targetDom">
      <div :class="`cell-text-body ${verticalDirection?'vertical':''}`">
        {{content}}
      </div>
    </div>
  </div>
</template>

<script>
import animation from '../../mixins/animation'
import style from '../../mixins/style'
import {panelList} from '@/views/posterMaker/cellConfigPanel/index.vue'

export default {
  name: "cell-text",
  descriptor: '文字元素(文字专用)',
  defaultProps: {
    position: {
      left: 40,
      top: 40
    },
    verticalDirection: false,
    animationDuration: 1,
    animationDelay: 0,
    animationCount: 1,
    animationFillMode: 'forwards',
    content: 'TEXT',
    fontsize: 8,
    hideAfterAnimation: true,
  },
  panelList: [panelList.inputText, panelList.verticalDirection, panelList.fontsize, panelList.color, panelList.background,
    panelList.backgroundImage, panelList.hideAfterAnimation, panelList.animationActions, panelList.animationCount, panelList.animationDelay, panelList.animationDuration, panelList.animationFillMode],
  mixins: [animation, style],
  props: {
    content: {
      required: true
    },
    verticalDirection: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {}
  },
  mounted() {
    // this.animateCell(this.$refs.targetDom, this.animation.actions || [])
  },
  computed: {}
}
</script>

<style lang="scss" scoped>
  .cell-text-body {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    writing-mode: horizontal-tb;
    height: 100%;
    width: 100%;
  }

  .vertical {
    writing-mode: vertical-lr;
  }
</style>
