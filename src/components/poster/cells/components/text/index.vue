<template>
  <div class="default-cell" :style="{...style}" ref="targetDom">
    <div :class="`cell-text-body ${verticalDirection?'vertical':''}`">{{content}}</div>
  </div>
</template>

<script>
  import animation from '../../mixins/animation'
  import style from '../../mixins/style'
  import panelList from '@/views/posterMaker/cellConfigPanel/panelList'
  import base from '../../mixins/base'

  export default {
    name: 'cell-text',
    descriptor: '文字内容',
    panelList: [panelList.size, panelList.switchFlexHeight, panelList.justifyContentType, panelList.inputText, panelList.verticalDirection,
      panelList.fontsize, panelList.lineHeight, panelList.fontFamily, panelList.color, panelList.background, panelList.borderOption,
      panelList.hideAfterAnimation, panelList.animationActions],
    mixins: [animation, style, base],
    props: {
      position: {
        default: {
          left: 40,
          top: 40,
          width: 30,
          height: 20,
        }
      },
      content: {
        default: 'TEXT',
      },
      fontsize: {
        default: 8,
      },
      fontFamily: {
        default: '',
      },
      borders: {
        default: {default: {width: '0', style: 'solid', color: 'rgba(0,0,0,1)', radius: 0}},
      },
      hideAfterAnimation: {
        default: -1,
      },
      flexHeight: {
        default: true,
      },
      justifyContent: {
        default: 'start',
      },
      verticalDirection: {
        type: Boolean,
        default: false
      },
      lineHeight: {
        default: 0.2
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
    text-align: justify;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    writing-mode: horizontal-tb;
    height: 100%;
    width: 100%;
    white-space: pre-wrap;
    word-break: normal;
  }

  .vertical {
    writing-mode: vertical-lr;
  }
</style>
