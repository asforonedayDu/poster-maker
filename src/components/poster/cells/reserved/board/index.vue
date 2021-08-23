<template>
  <div class="cell-container-mid">
    <div class="default-cell" :style="{...style}" ref="targetDom" @click="handleClick">

    </div>
  </div>
</template>

<script>
  import animation from '../../mixins/animation'
  import style from '../../mixins/style'
  import base from '../../mixins/base'
  import panelList from '@/views/posterMaker/cellConfigPanel/panelList'

  const panelCellList = Object.values({
    ...panelList,
    inputText: null,
    verticalDirection: null,
    color: null,
    fontsize: null
  })

  export default {
    name: "cell-board",
    descriptor: '块元素(固定大小，用于显示图片、特定颜色等)',
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
      animationFillMode: 'both',
      hideAfterAnimation: -1,
    },
    panelList: panelCellList,
    mixins: [animation, style, base],
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
