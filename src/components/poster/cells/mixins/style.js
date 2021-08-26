import {baseConfig, basicFontFamily} from '@/views/posterMaker/libs/static'

const heightWidthPercentage = baseConfig.designHeight / baseConfig.designWidth

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
    fontFamily: {
      default: ''
    },
    flexHeight: {
      default: true
    },

    justifyContent: {
      default: 'start'
    },
  },
  computed: {
    style() {
      const style = {
        left: `${this.position.left}%`,
      }
      if (!this.flexHeight) {
        if (this.justifyContent === 'end') {
          if (this.position.bottom !== undefined) {
            style.bottom = `${this.position.bottom}%`
          } else {
            const bottom = 100 - this.position.top - this.position.height
            style.bottom = `${bottom}%`
          }
        } else if (this.justifyContent === 'mid') {
          const midPosition = this.position.top + this.position.height / 2
          const windowHeight = this.designMode ? baseConfig.designHeight : document.documentElement.clientHeight || document.body.clientHeight
          const windowWidth = this.designMode ? baseConfig.designWidth : document.documentElement.clientWidth || document.body.clientWidth
          const cellAbsHeight = this.position.height * heightWidthPercentage * windowWidth / 100
          const heightPercent = cellAbsHeight / windowHeight * 100
          style.top = `${midPosition - heightPercent / 2}%`
        } else {
          style.top = `${this.position.top}%`
        }
      } else {
        style.top = `${this.position.top}%`
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
      if (this.fontFamily) {
        const infos = this.fontFamily.split('|')
        style.fontFamily = `${infos[0]}`
        if (infos.length > 1) {
          const fontUrl = infos[1]
          if (!this.$root.$fontLoaded) this.$root.$fontLoaded = {}
          if (!this.$root.$fontLoaded[fontUrl]) {
            this.$root.$fontLoaded[fontUrl] = true
            const newStyle = document.createElement('style');
            newStyle.setAttribute("type", "text/css");
            newStyle.appendChild(document.createTextNode("@font-face {font-family:" + infos[0] + ";src:url('" + fontUrl + "');}"));
            document.head.appendChild(newStyle);
            // console.log('load font face', infos[0], infos[1], style.fontFamily)
          }
        }
      }
      // this.backgroundImage && (style.backgroundImage = `${this.backgroundImage}`)

      return style
    }
  }
}
