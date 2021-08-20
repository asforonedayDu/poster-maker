<template>
  <div class="cell-container-flex">
    <div class="default-cell" :style="style" ref="targetDom" @click="handleClick">
    </div>
  </div>
</template>

<script>
  import style from '../../mixins/style'
  import panelList from '@/views/posterMaker/cellConfigPanel/panelList'
  import base from '../../mixins/base'

  const panelCellList = Object.values({
    ...panelList,
    inputText: null,
    verticalDirection: null,
    color: null,
    fontsize: null
  })

  export default {
    name: "cell-flex-board",
    descriptor: '弹性块(随目标设备屏幕宽高拉伸，如全屏自适应背景图)',
    defaultProps: {
      position: {
        width: 70,
        height: 70,
        left: 15,
        top: 15
      },
      animationDuration: 1,
      animationDelay: 0,
      animationCount: 1,
      animationFillMode: 'both',
      hideAfterAnimation: false,
    },
    panelList: panelCellList,
    mixins: [style, base],
    props: {}
  }
</script>

<style lang="scss" scoped>

</style>
