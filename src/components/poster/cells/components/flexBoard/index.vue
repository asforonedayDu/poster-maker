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
    fontFamily: null
  })
  export default {
    name: "cell-flex-board",
    descriptor: '图片或纯色',
    defaultProps: {
      position: {
        width: 70,
        height: 70,
        left: 15,
        top: 15
      },
      background: 'rgba(78,19,42,1)',
      hideAfterAnimation: -1,
      flexHeight: true,
      justifyContent: 'start',
      borders: {
        default: {width: '0', style: 'solid', color: 'rgba(0,0,0,1)',}
      },
    },
    panelList: panelCellList,
    mixins: [animation, style, base],
    props: {}
  }
</script>

<style lang="scss" scoped>

</style>
