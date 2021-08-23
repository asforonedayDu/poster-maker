import tree from "element-ui/packages/table/src/store/tree";
import {baseConfig} from '@/views/posterMaker/libs/static'

export default {
  props: {
    position: {
      required: true,
      default: Object,
    },
    background: {
      default: '',
    },
    backgroundImage: {
      default: '',
    },
    color: {
      default: 'black'
    },
    fontsize: {
      default: '8'
    },
    flexHeight: {
      default: true
    },
  },
  computed: {
    style() {
      const style = {
        top: `${this.position.top}%`,
        left: `${this.position.left}%`,
      }
      if (this.position.height) {
        if (this.flexHeight) {
          style.height = `${this.position.height}%`
        } else {
          // 宽度是50rem    this.position.height是高度百分比
          const height = this.position.height
          const rem = (baseConfig.designHeight / baseConfig.designWidth) * height * 0.5
          style.height = `${rem}rem`
        }
      }
      this.position.width && (style.width = `${this.position.width}%`)
      if (this.background || this.backgroundImage) {
        style.background = `${this.backgroundImage && `url(${this.backgroundImage})`} ${this.background && `${this.background}`}`
        // console.log('style.background', style.background)
      }
      // this.background && (style.background = `${this.background}`)
      this.color && (style.color = `${this.color}`)
      this.fontsize && (style.fontSize = `${this.fontsize / 2}rem`)
      // this.backgroundImage && (style.backgroundImage = `${this.backgroundImage}`)

      this.injectStyleAnimation(style)
      return style
    }
  }
}
