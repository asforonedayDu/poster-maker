<template>
  <div class="cell-container-mid">
    <div class="default-cell" :style="style" ref="targetDom">

    </div>
  </div>
</template>

<script>
import animation from '../../mixins/animation'
import style from '../../mixins/style'
import {panelList} from '@/views/posterMaker/cellConfigPanel/index.vue'

const panelCellList = Object.values({...panelList, inputText: null, verticalDirection: null, fontsize: null})

export default {
  name: "cell-board",
  descriptor: '块元素(矩形区域，用于颜色块，背景色，动画块)',
  defaultProps: {
    position: {
      left: 30,
      top: 30
    },
    width: 40,
    height: 40,
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
