<template>
  <div class="cell-container-mid">
    <div class="default-cell" :style="style" ref="targetDom">

    </div>
  </div>
</template>

<script>
import animation from '../../mixins/animation'
import style from '../../mixins/style'
import panelList from '@/views/posterMaker/cellConfigPanel/panelList'

const panelCellList = Object.values({...panelList, inputText: null, verticalDirection: null, fontsize: null})

export default {
  name: "cell-board",
  descriptor: '块元素(矩形区域，用于颜色块，背景色，动画块)',
  defaultProps: {
    position: {
      width: 70,
      height: 70,
      left: 20,
      top: 20
    },
    width: 60,
    height: 60,
    animationDuration: 1,
    animationDelay: 0,
    animationCount: 1,
    animationFillMode: 'forwards',
    hideAfterAnimation: true,
  },
  panelList: panelCellList,
  mixins: [animation, style],
  props: {},
  data() {
    return {}
  },
}
</script>

<style lang="scss" scoped>
  .board-body {
    width: 100%;
    height: 100%;
  }
</style>
