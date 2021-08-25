<template>
  <div class="default-cell" :style="{...style}" ref="targetDom">
    <div :class="`cell-text-body ${verticalDirection?'vertical':''}`">
      {{content}}
    </div>
  </div>
</template>

<script>
  import animation from '../../mixins/animation'
  import style from '../../mixins/style'
  import panelList from '@/views/posterMaker/cellConfigPanel/panelList'
  import base from '../../mixins/base'

  export default {
    name: "cell-text",
    descriptor: '文字内容',
    defaultProps: {
      position: {
        left: 40,
        top: 40
      },
      verticalDirection: false,
      content: 'TEXT',
      fontsize: 8,
      hideAfterAnimation: -1,
      flexHeight: true,
      justifyContent: 'start',
    },
    panelList: [panelList.switchFlexHeight, panelList.inputText, panelList.verticalDirection, panelList.fontsize, panelList.color, panelList.background,
      panelList.hideAfterAnimation, panelList.animationActions],
    mixins: [animation, style, base],
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
    // mounted() {
    // this.animateCell(this.$refs.targetDom, this.animation.actions || [])
    // },
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
