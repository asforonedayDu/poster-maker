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
  const index = {
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
      background: {
        default: 'rgba(11,36,132,1)'
      },
      backgroundImage: {
        default: '',
      },
    },
    panelList: panelCellList,
    mixins: [animation, style, base],
  }
  const defaultProps = {}
  Object.keys(animation.props).forEach(key => {
    defaultProps[key] = animation.props[key].default instanceof Function ? animation.props[key].default() : animation.props[key].default
  })
  Object.keys(style.props).forEach(key => {
    defaultProps[key] = style.props[key].default instanceof Function ? style.props[key].default() : style.props[key].default
  })
  Object.keys(index.props).forEach(key => {
    defaultProps[key] = index.props[key].default instanceof Function ? index.props[key].default() : index.props[key].default
  })
  index.defaultProps = defaultProps
  export default index
</script>

<style lang="scss" scoped>

</style>
