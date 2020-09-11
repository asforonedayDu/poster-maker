<script type="text/jsx">
import Vue from 'vue'
import util from "@/views/posterMaker/libs/utils";
import {animateCell, animateQueueCell} from '@/views/poster/libs/animate-help'
import panelList from "@/views/posterMaker/cellConfigPanel/panelList";
import assetsManage from "@/views/posterMaker/cellConfigPanel/assetsManage";
import panelRender from "@/views/posterMaker/cellConfigPanel/panelRender";

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
  mixins: [assetsManage, panelRender],
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
    },
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
        {this.renderAssetsWindow(h)}
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
    renderAssetsWindow(h) {
      return (
        <el-dialog title="选择素材"
                   visible={this.showAssetsWindow} {...{on: {'update:visible': () => this.showAssetsWindow = false}}}
                   class="assets-body" width="80%">
          <div class="upload-img-body">
            <input ref="uploadInput" class="upload-button-input" type="file"
                   accept="image/jpg,image/jpeg,image/png,image/gif,*.svg"
                   on-change={this.handleImgFileChange}/>
            <el-button class="upload-button" onClick={() => this.$refs.uploadInput.click()}>上传素材</el-button>
          </div>
          <div>
            <div class="assets-list">
              {
                this.commonAssets.map(asset => {
                  return (
                    <div class="asset-body">
                      <div class="asset-img-body" vOn:click={() => this.handleAssetClick(asset)}>
                        <img src={asset.asset_content}/>
                        {asset.uploading && <div class="uploading-tag">上传中</div>}
                        {this.onSelectAsset === asset && <div class="asset-selected"/>}
                      </div>
                    </div>
                  )
                })
              }
            </div>
            <div class="operation-buttons-body">
              {this.onSelectAsset &&
              <div class="operation-buttons">
                <el-button type="danger" on-click={() => this.deleteAsset(this.onSelectAsset)}>删除</el-button>
                <el-button type="primary" on-click={() => this.setBackgroundImage(this.onSelectAsset)}>确认</el-button>
              </div>
              }
            </div>

          </div>
        </el-dialog>
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
        flex-shrink: 1;
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

    .assets-body {
    }

    .upload-img-body {
      width: 100%;
      height: 40px;
      position: relative;

      .upload-button-input {
        position: absolute;
        opacity: 0;
        left: 20px;
        width: 100px;
        height: 100%;
        cursor: pointer;
        margin: auto 0;
      }

      .upload-button {
        position: absolute;
        left: 20px;
        width: 100px;
        height: 100%;
        margin: auto 0;
      }
    }

    .assets-list {
      width: 100%;
      height: 600px;
      display: flex;
      flex-flow: row wrap;
      overflow-y: auto;

      .asset-body {
        height: 250px;
        min-width: 100px;
        margin-right: 20px;
        margin-top: 20px;
        display: inline-flex;
        flex-flow: column nowrap;
        align-items: center;

        .asset-img-body {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;

          img {
            max-height: 100%;
          }

          .uploading-tag {
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.3);
          }

          .asset-selected {
            position: absolute;
            bottom: 0;
            width: 70%;
            height: 3px;
            background: rgba(0, 0, 0, .7);
          }
        }
      }
    }

    .operation-buttons-body {
      height: 40px;

      .operation-buttons {
        height: 100%;
        display: flex;
        justify-content: flex-end;
        padding-right: 40px;
        margin-top: 30px;
      }
    }

  }
</style>
