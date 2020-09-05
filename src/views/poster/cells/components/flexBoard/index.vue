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
      left: 30,
      top: 20
    },
    width: 40,
    height: 50,
  },
  panelList: panelCellList,
  mixins: [style],
  props: {}
}
</script>

<style lang="scss" scoped>

</style>
