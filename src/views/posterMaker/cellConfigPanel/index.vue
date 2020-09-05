<script type="text/jsx">
import Vue from 'vue'

export const panelList = {
  inputText: {
    method: 'rInputText',
    propKey: 'content',
  },
  verticalDirection: {
    method: 'rVerticalDirection',
    propKey: 'verticalDirection',
  },
  background: {
    method: 'rBackground',
    propKey: 'background',
  },
  backgroundImage: {
    method: 'rBackgroundImage',
    propKey: 'backgroundImage',
  },
  color: {
    method: 'rColor',
    propKey: 'color',
  },
  fontsize: {
    method: 'rFontsize',
    propKey: 'fontsize',
  },
  animateActions: {
    method: 'rAnimateActions',
    propKey: 'animate.actions',
  },
  hideAfterAnimation: {
    method: 'rHideAfterAnimation',
    propKey: 'hideAfterAnimation',
  },
  animationDuration: {
    method: 'rAnimationDuration',
    propKey: 'animation.duration',
  },
  animationCount: {
    method: 'rAnimationCount',
    propKey: 'animation.count',
  },
  animationFillMode: {
    method: 'rAnimationFillMode',
    propKey: 'animation.fillMode',
  },
  animationDelay: {
    method: 'rAnimationDelay',
    propKey: 'animation.delay',
  },
}
export default {
  name: "cell-config-panel",
  props: {
    onSelectCell: {
      default: null
    }
  },
  data() {
    return {
      configProps: {}
    }
  },
  created() {
    if (this.onSelectCell.data.panelList) {
      this.onSelectCell.data.panelList.forEach(config => {
        Vue.set(this.configProps, config.propKey, null)
      })
    }
  },
  watch: {
    configProps: {
      handler: function (configProps) {
        console.log('handler')
        const newCell = {...this.onSelectCell}
        Object.keys(configProps).forEach(key => {
          if (configProps[key] !== null) {
            this.$set(this.onSelectCell.data.props, key, configProps[key])
            // this.onSelectCell.data[key] = configProps[key]
          }
        })
        // this.$emit('update:onSelectCell', newCell)

      },
      deep: true
    }
  },
  render(h, context) {
    if (!this.onSelectCell.data.panelList) {
      return '无配置项'
    }
    const cellPanelList = this.onSelectCell.data.panelList
    return (
      <div class="cell-config-panel">
        {cellPanelList.map(config => {
          return (
            <div class="panel-item-body">
              {this[`${config.method}`](h, config)}
            </div>
          )
        })}
      </div>
    )
  },
  methods: {
    rInputText(h, config) {
      return (
        <div>
          <el-input vModel={this.configProps[config.propKey]} placeholder="请输入内容"/>
        </div>
      )
    },
    rVerticalDirection(h, config) {
      return (
        <div>
          rVerticalDirection
        </div>
      )
    },
    rBackground(h, config) {
      return (
        <div>
        </div>
      )
    },
    rBackgroundImage(h, config) {
      return (
        <div>

        </div>
      )
    },
    rColor(h, config) {
      return (
        <div>

        </div>
      )
    },
    rFontsize(h, config) {
      return (
        <div>

        </div>
      )
    },
    rAnimateActions(h, config) {
      return (
        <div>

        </div>
      )
    },
    rHideAfterAnimation(h, config) {
      return (
        <div>

        </div>
      )
    },
    rAnimationDuration(h, config) {
      return (
        <div>

        </div>
      )
    },
    rAnimationCount(h, config) {
      return (
        <div>

        </div>
      )
    },
    rAnimationFillMode(h, config) {
      return (
        <div>

        </div>
      )
    },
    rAnimationDelay(h, config) {
      return (
        <div>

        </div>
      )
    },
  }
}

</script>

<style lang="scss" scoped>

  .cell-config-panel {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    justify-content: flex-start;

    .panel-item-body {
      margin: 15px 0;
    }
  }
</style>
