import {baseConfig, basicFontFamily} from '@/views/posterMaker/libs/static'

const heightWidthPercentage = baseConfig.designHeight / baseConfig.designWidth

export default {
  props: {
    position: {
      required: true,
      default: {},
    },
    background: {
      default: '',
    },
    borders: {
      default() {
        return {
          default: {default: {width: '0', style: 'solid', color: 'rgba(255,255,255,1)', radius: 0}}
        }
      }
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
      const styleCss = {
        left: `${this.position.left}%`,
        childStyle: {}
      }
      if (!this.flexHeight) {
        if (this.justifyContent === 'end') {
          if (this.position.bottom !== undefined) {
            styleCss.bottom = `${this.position.bottom}%`
          } else {
            const bottom = 100 - this.position.top - this.position.height
            styleCss.bottom = `${bottom}%`
          }
        } else if (this.justifyContent === 'mid') {
          const {top, height} = this.position
          const windowHeight = document.getElementById('poster-root').clientHeight
          const windowWidth = document.getElementById('poster-root').clientWidth
          const designAreaHeight = heightWidthPercentage * windowWidth
          // const cellAbsHeight = height * heightWidthPercentage * windowWidth / 100
          const inAreaTop = designAreaHeight * top / 100
          const outAreaTopPadding = (windowHeight - designAreaHeight) / 2
          const indeedTop = (outAreaTopPadding + inAreaTop) * 100 / windowHeight
          // const midPercentDistance = top + height / 2 - 50
          // const mid2midDistance = windowHeight * midPercentDistance / 100
          // const mid2TopDistance = windowHeight / 2 + mid2midDistance
          // const top2TopDistance = mid2TopDistance - cellAbsHeight / 2
          // const indeedTop = top2TopDistance * 100 / windowHeight
          styleCss.top = `${indeedTop}%`
        } else {
          styleCss.top = `${this.position.top}%`
        }
      } else {
        styleCss.top = `${this.position.top}%`
      }

      if (this.position.height) {
        if (this.flexHeight) {
          styleCss.height = `${this.position.height}%`
        } else {
          // 宽度是50rem    this.position.height是高度百分比
          const height = this.position.height
          const rem = (baseConfig.designHeight / baseConfig.designWidth) * height * 0.5
          styleCss.height = `${rem}rem`
        }
      }
      this.position.width && (styleCss.width = `${this.position.width}%`)

      this.color && (styleCss.color = `${this.color}`)

      // 文字相关
      if (this.fontsize) {
        const fontsize = Number(this.fontsize) / 2
        const lineHeight = Number(this.lineHeight)
        styleCss.fontSize = `${fontsize}rem`
        // styleCss.lineHeight = `${fontsize * (1 + lineHeight)}rem`
        styleCss.lineHeight = `${1 + lineHeight}`
        if (this.verticalAlia !== 'center') {
          if (this.verticalAlia === 'end') {
            styleCss['marginTop'] = `${fontsize / 2 * lineHeight}rem`
          } else {
            styleCss['marginTop'] = `${fontsize / -2 * lineHeight}rem`
          }
        }

        if (this.fontFamily) {
          const infos = this.fontFamily.split('|')
          styleCss.fontFamily = `${infos[0]}`
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
        if (this.background) {
          styleCss.background = `${this.background && `${this.background}`}`
        }
        if (this.verticalAlia === 'end') {
          styleCss.childStyle.alignItems = 'flex-end'
        } else if (this.verticalAlia === 'center') {
          styleCss.childStyle.alignItems = 'center'
        } else {
          styleCss.childStyle.alignItems = 'flex-start'
        }
      } else //图像
      {
        if (this.background || this.backgroundImage) {
          styleCss.background = `${this.backgroundImage && `url(${this.backgroundImage})`} ${this.background && `${this.background}`}`
          // console.log('style.background', style.background)
        }
      }

      if (this.borders?.default) {
        const {width = 0, style = 'solid', color = 'black', radius = 0} = this.borders.default
        styleCss.borderWidth = `${width}px`
        styleCss.borderRadius = `${radius}%`
        styleCss.borderStyle = style
        styleCss.borderColor = color
      }
      // this.backgroundImage && (style.backgroundImage = `${this.backgroundImage}`)
      return styleCss
    }
  }
}
