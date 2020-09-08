<template>
  <div class="cell-container-flex">
    <div class="default-cell" :style="style" ref="targetDom">
    </div>
  </div>
</template>

<script>
import style from '../../mixins/style'
import {panelList} from '@/views/posterMaker/cellConfigPanel/index.vue'

const panelCellList = Object.values({...panelList, inputText: null, verticalDirection: null, fontsize: null})

export default {
  name: "cell-flex-board",
  descriptor: '弹性块(随目标设备屏幕宽高拉伸，用于全屏自适应背景元素)',
  defaultProps: {
    position: {
      width:70,
      height:70,
      left: 15,
      top: 15
    },
    animationDuration: 1,
    animationDelay: 0,
    animationCount: 1,
    animationFillMode: 'forwards',
    hideAfterAnimation: true,
  },
  panelList: panelCellList,
  mixins: [style],
  props: {}
}
</script>

<style lang="scss" scoped>

</style>
