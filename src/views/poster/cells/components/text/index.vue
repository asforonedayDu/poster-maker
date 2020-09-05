<template>
  <div class="cell-container-mid">
    <div class="default-cell" :style="style">
      <div ref="targetDom" :class="`cell-text-body ${verticalDirection?'vertical':''}`">
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
    animation: {},
    content: '输入文字',
  },
  panelList: [panelList.inputText, panelList.verticalDirection, panelList.fontsize, panelList.color, panelList.background,
    panelList.backgroundImage, panelList.hideAfterAnimation, panelList.animateActions, panelList.animationCount, panelList.animationDelay, panelList.animationDuration, panelList.animationFillMode],
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
    padding: 3px 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    writing-mode: horizontal-tb;
  }

  .vertical {
    writing-mode: vertical-lr;
  }
</style>
