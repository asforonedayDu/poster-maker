<script type="text/jsx">
import Vue from 'vue'
import util from "@/views/posterMaker/libs/utils";
import {animateCell, animateQueueCell} from '@/views/poster/libs/animate-help'

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
  animationActions: {
    method: 'rAnimationActions',
    propKey: 'animationActions',
  },
  hideAfterAnimation: {
    method: 'rHideAfterAnimation',
    propKey: 'hideAfterAnimation',
  },
  animationDuration: {
    method: 'rAnimationDuration',
    propKey: 'animationDuration',
  },
  animationCount: {
    method: 'rAnimationCount',
    propKey: 'animationCount',
  },
  animationFillMode: {
    method: 'rAnimationFillMode',
    propKey: 'animationFillMode',
  },
  animationDelay: {
    method: 'rAnimationDelay',
    propKey: 'animationDelay',
  },
}
const watcher = {}
Object.keys(panelList).forEach(key => {
  const propKey = panelList[key]['propKey']
  const watchTarget = `configProps.${propKey}`
  watcher[watchTarget] = function (val, oldValue) {
    if (val !== null) {
      // console.log('watcher[watchTarget]', watchTarget, val)
      this.$set(this.onSelectCell.props, propKey, _.cloneDeep(val))
    }
  }
})
const vueComponent = {
  name: "cell-config-panel",
  props: {
    onSelectCell: {
      default: null
    }
  },
  data() {
    return {
      configProps: {},
      showAnimatePickWindow: false,
      selectedAnimation: [],
      showBackgroundColorPick: false,
      showTextColorPick: false,
    }
  },
  created() {
    this.setConfigData(this.onSelectCell)
    this.animateList = util.getAnimationList()
  },
  watch: {
    ...watcher,
    onSelectCell(val) {
      this.setConfigData(val)
    }
  },
  render(h, context) {
    if (!this.onSelectCell.panelList) {
      return '无配置项'
    }
    const cellPanelList = this.onSelectCell.panelList || []
    return (
      <div class="cell-config-panel">
        {Object.values(panelList).map(li => {
          const config = cellPanelList.find(item => item.method === li.method)
          if (!config) {
            return ''
          }
          return (
            <div class="panel-item-body">
              {this[`${config.method}`](h, config)}
            </div>
          )
        })}
        {this.renderAnimatePickWindow(h)}
      </div>
    )
  },
  methods: {
    setConfigData(onSelectCell) {
      if (onSelectCell.panelList) {
        onSelectCell.panelList.forEach(config => {
          const value = onSelectCell.props[config.propKey]
          Vue.set(this.configProps, config.propKey, value)
        })
      }
      this.selectedAnimation = this.configProps[panelList.animationActions.propKey] || []
    },
    handleAnimationSelectChange(value) {
      console.log('value', value)
      animateQueueCell(this.$refs.example, value)
    },
    setAnimation() {
      if (this.selectedAnimation) {
        this.configProps.animationActions = this.selectedAnimation
        // if (!this.configProps.animationActions) {
        //   Vue.set(this.configProps, 'animationActions', [])
        // }
        // Vue.set(this.configProps.animationActions, 0, this.selectedAnimation)
      }
      this.showAnimatePickWindow = false
    },
    renderAnimatePickWindow(h) {
      const self = this
      return (
        <el-dialog title="选择动画" visible={this.showAnimatePickWindow} show-close={false}>
          <div class="pick-window-body">
            <div class="pick-list">
              <el-checkbox-group vModel={this.selectedAnimation} on-change={this.handleAnimationSelectChange}>
                {
                  this.animateList.map(animateName => {
                    return (
                      <el-checkbox class="pick-animate-item" label={animateName}>{animateName}</el-checkbox>
                    )
                  })
                }
              </el-checkbox-group>
            </div>
            <div class="example-body">
              <div class="example-container">
                <div class="example" ref="example">
                  Animation
                </div>
              </div>
            </div>
          </div>
          <div class="button-bottom">
            <el-button type="primary" vOn:click={this.setAnimation}>确认</el-button>
            <el-button vOn:click={() => this.showAnimatePickWindow = false}>取消</el-button>
          </div>
        </el-dialog>
      )
    },
    rInputText(h, config) {
      return (
        <div class="input-main">
          <span>修改文字内容:</span>
          <el-input vModel={this.configProps[config.propKey]} placeholder="请输入内容"/>
        </div>
      )
    },
    rVerticalDirection(h, config) {
      return (
        <div>
          <span>文字方向:  </span>
          <el-radio-group vModel={this.configProps[config.propKey]}>
            <el-radio label={false}>水平方向</el-radio>
            <el-radio label={true}>竖直方向</el-radio>
          </el-radio-group>
        </div>
      )
    },
    rBackground(h, config) {
      return (
        <div class="input-main">
          <span>背景颜色(rgba|16进制|颜色单词):</span>
          <div class="inline-content">
            <el-button class="button-front" on-click={() => {
              this.showBackgroundColorPick = !this.showBackgroundColorPick
            }}>开关颜色面板
            </el-button>
            <el-input class="input-right" vModel={this.configProps[config.propKey]} placeholder=""/>
          </div>
          {this.showBackgroundColorPick &&
          <div>
            <color-pick vModel={this.configProps[config.propKey]} color-format="rgb" show={true}/>
          </div>}
        </div>
      )
    },
    rBackgroundImage(h, config) {
      return (
        <div class="input-main">
          <span>背景图片(图片链接):</span>
          <el-input vModel={this.configProps[config.propKey]} placeholder="图片链接"/>
        </div>
      )
    },
    rColor(h, config) {
      return (
        <div class="input-main">
          <span>文字颜色(rgba|16进制|颜色单词):</span>
          <div class="inline-content">
            <el-button class="button-front" on-click={() => {
              this.showTextColorPick = !this.showTextColorPick
            }}>开关颜色面板
            </el-button>
            <el-input class="input-right" vModel={this.configProps[config.propKey]} placeholder=""/>
          </div>
          {this.showTextColorPick &&
          <div>
            <color-pick vModel={this.configProps[config.propKey]} color-format="rgb" show={true}/>
          </div>}
        </div>
      )
    },
    rFontsize(h, config) {
      return (
        <div class="input-main">
          <span>字体大小(基于屏幕宽度百分比 数字):</span>
          <el-input vModel={this.configProps[config.propKey]} placeholder="基于屏幕宽度百分比"/>
        </div>
      )
    },
    rAnimationActions(h, config) {
      const actions = this.configProps[config.propKey]
      return (
        <div class="input-main">
          <span style={{display: 'inline-block'}}>当前动画:(可以多选，动画会依次播放)</span>
          <div class="inline-content">
            {actions && actions.map((name, index) => {
              return (<el-tag key={index}>{name}</el-tag>)
            })}
          </div>
          <el-button onClick={() => this.showAnimatePickWindow = true}>选择动画:</el-button>
        </div>
      )
    },
    rHideAfterAnimation(h, config) {
      return (
        <div>
          <span>动画结束后是否隐藏:  </span>
          <el-radio-group vModel={this.configProps[config.propKey]}>
            <el-radio label={true}>是</el-radio>
            <el-radio label={false}>否</el-radio>
          </el-radio-group>
        </div>
      )
    },
    rAnimationDuration(h, config) {
      return (
        <div class="input-main">
          <span>动画执行时间(数字 单位秒):</span>
          <el-input vModel={this.configProps[config.propKey]} placeholder="数字 单位秒"/>
        </div>
      )
    },
    rAnimationCount(h, config) {
      return (
        <div class="input-main">
          <span>动画执行次数(数字或者infinite表示无限循环):</span>
          <el-input vModel={this.configProps[config.propKey]} placeholder="数字"/>
        </div>
      )
    },
    rAnimationFillMode(h, config) {
      return (
        <div class="input-main">
          <span>动画结束时的状态:</span>
          <el-radio-group vModel={this.configProps[config.propKey]}>
            <el-radio class="radio-label-body" label={'none'}>无</el-radio>
            <el-radio label={'forwards'}>维持结束状态</el-radio>
            <el-radio label={'both'}>both</el-radio>
            <el-radio label={'backwards'}>backwards</el-radio>
          </el-radio-group>
        </div>
      )
    },
    rAnimationDelay(h, config) {
      return (
        <div className="input-main">
          <span>动画执行延时:</span>
          <el-input vModel={this.configProps[config.propKey]} placeholder="数字 单位秒"/>
        </div>
      )
    },
  }
}
export default vueComponent
</script>

<style lang="scss" scoped>

  .cell-config-panel {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    justify-content: flex-start;
    border-left: 1px solid rgba(0, 0, 0, 0.3);
    font-size: 16px;

    span {
      flex-shrink: 0;
      margin-bottom: 10px;
      margin-right: 10px;
    }

    .radio-label-body {
      margin: 15px 0;
    }

    .panel-item-body {
      box-sizing: border-box;
      padding: 15px 10px 15px 10px;
      width: 100%;
      border-bottom: 1px solid rgba(0, 0, 0, 0.4);
    }

    .input-main {
      display: flex;
      align-items: flex-start;
      flex-flow: column nowrap;
      justify-content: space-around;
    }

    .inline-content {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      box-sizing: border-box;

      .button-front {
        margin-right: 15px;
      }

      .input-right {
        flex: 1;
      }
    }

    .pick-window-body {
      width: 700px;
      height: 600px;
      display: flex;

      .pick-list {
        width: 300px;
        height: 100%;
        overflow: auto;

        .pick-animate-item {
          width: 100%;
          padding: 12px 0;
          box-sizing: border-box;
          margin: 0;
        }
      }

      .example-body {
        flex: 1;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        .example-container {
          width: 300px;
          height: 480px;
          position: relative;
          border: 1px solid rgba(0, 0, 0, .3);
          border-radius: 30px;
          margin-left: 50px;
          display: flex;
          align-items: center;
          justify-content: center;

          .example {
            text-align: center;
            animation-duration: 1s;
          }
        }
      }
    }

    .button-bottom {
      box-sizing: border-box;
      display: flex;
      justify-content: flex-end;
      padding: 10px 20px;
    }

    .color-pick-body {
      cursor: pointer;
      margin-left: 20px;
    }
  }
</style>
