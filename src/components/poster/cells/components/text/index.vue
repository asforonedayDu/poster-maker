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

  const index = {
    name: 'cell-text',
    descriptor: '文字内容',
    panelList: [panelList.name, panelList.size, panelList.switchFlexHeight, panelList.justifyContentType, panelList.inputText, panelList.verticalDirection,
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
      verticalDirection: {
        type: Boolean,
        default: false
      },
      lineHeight: {
        default: 0.2
      },
      color: {
        default: 'black'
      },
      name: {
        default: '',
      },
    },
    data() {
      return {}
    },
    // mounted() {
    // this.animateCell(this.$refs.targetDom, this.animation.actions || [])
    // },
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
