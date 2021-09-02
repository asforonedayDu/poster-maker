<template>
  <div class="default-cell" :style="style" ref="targetDom">
  </div>
</template>

<script>
  import style from '../../mixins/style'
  import panelList from '@/views/posterMaker/cellConfigPanel/panelList'
  import base from '../../mixins/base'
  import animation from "../../mixins/animation";

  const panelCellList = Object.values({
    ...panelList,
    inputText: null,
    verticalDirection: null,
    color: null,
    fontsize: null,
    fontFamily: null,
    lineHeight: null,
  }).filter(e => e)
  export default {
    name: "cell-flex-board",
    descriptor: '图片或纯色',
    props: {
      position: {
        default: {
          width: 70,
          height: 70,
          left: 15,
          top: 15
        }
      },
      fontsize: {
        default: null,
      },
      background: {
        default: 'rgba(78,19,42,1)'
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
      borders: {
        default: {default: {width: '0', style: 'solid', color: 'rgba(0,0,0,1)', radius: 0}},
      },
    },
    panelList: panelCellList,
    mixins: [animation, style, base],
  }
</script>

<style lang="scss" scoped>

</style>
