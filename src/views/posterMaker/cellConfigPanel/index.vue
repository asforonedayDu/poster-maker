<script type="text/jsx">
  import Vue from 'vue'
  import util from "@/views/posterMaker/libs/utils";
  import {animateCell, animateQueueCell} from '@/libs/animate-help'
  import panelList from "@/views/posterMaker/cellConfigPanel/panelList";
  import assetsManage from "@/views/posterMaker/cellConfigPanel/assetsManage";
  import panelRender from "@/views/posterMaker/cellConfigPanel/panelRender";
  import cells from '@/components/poster/cells'

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
        targetCell: {},
        showAnimatePickWindow: false,
        tempAnimationData: {
          name: '',
          animationDuration: 1,
          animationDelay: 0,
          animationCount: 1,
          animationFillMode: 'both',
        },
        onEditAnimationIndex: 0,
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
      'tempAnimationData.name': {
        handler(val) {
          if (this.showAnimatePickWindow && val) {
            this.$nextTick(() => {
              this.handleAnimationSelectChange(val)
            })
          }
        }
      }
    },
    render(h, context) {
      if (!this.targetCell.panelList) {
        console.log('无配置项')
        return ''
      }
      return (
        <div class="cell-config-panel">
          <div class="panel-item-body">
            <p>{this.onSelectCell.type}</p>
          </div>
          {Object.values(this.targetCell.panelList).map(config => {
            if (!config) return ''
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
      handlerAnimationDelete(index) {
        this.onSelectCell.props[this.animationPropkey].splice(index, 1)
      },
      setConfigData(onSelectCell) {
        this.targetCell = cells.find(cell => cell.name === onSelectCell.type)
        if (this.targetCell.panelList) {
          this.targetCell.panelList.forEach(config => {
            if (!config) return
            if (config.method === 'rAnimationActions') {
              this.animationPropkey = config.propKey
            }
            const value = onSelectCell.props[config.propKey]
            Vue.set(this.configProps, config.propKey, value)
          })
        }
      },
      handleAnimationSelectChange(value) {
        animateCell(this.$refs.example, value)
      },
      saveAnimation() {
        this.showAnimatePickWindow = false
        if (!this.tempAnimationData.name) {
          return
        }
        if (this.onEditAnimationIndex >= this.onSelectCell.props[this.animationPropkey].length) {
          this.onSelectCell.props[this.animationPropkey].push(_.cloneDeep(this.tempAnimationData))
        } else {
          Object.assign(this.onSelectCell.props[this.animationPropkey][this.onEditAnimationIndex], _.cloneDeep(this.tempAnimationData))
        }
      },
      addAnimation(index) {
        this.onEditAnimationIndex = this.onSelectCell.props[this.animationPropkey].length
        Object.assign(this.tempAnimationData, {
          name: '',
          animationDuration: 1,
          animationDelay: 0,
          animationCount: 1,
          animationFillMode: 'both',
        })
        this.showAnimatePickWindow = true
      },
      editAnimationDetail(index) {
        this.onEditAnimationIndex = index
        Object.assign(this.tempAnimationData, this.onSelectCell.props[this.animationPropkey][index])
        this.showAnimatePickWindow = true
      },
      renderAnimatePickWindow(h) {
        return (
          <el-dialog title="选择动画" custom-class="dialog-select-animation" visible={this.showAnimatePickWindow}
                     show-close={false}>
            <div class="pick-window-body">
              <div class="pick-list">
                <el-radio-group v-model={this.tempAnimationData.name}>
                  {
                    this.animateList.map(animateName => {
                      return (
                        <el-radio style={{display: 'block', margin: '15px 0'}}
                                  label={animateName}>{animateName}</el-radio>)
                    })
                  }
                </el-radio-group>
              </div>
              <div class="example-body">
                <div class="example-container">
                  <div class="example-phone-container">
                    <div class="example" ref="example">
                      Animation
                    </div>
                  </div>
                  <div class="button-bottom">
                    <el-button type="primary" vOn:click={this.saveAnimation}>确认</el-button>
                    <el-button vOn:click={() => this.showAnimatePickWindow = false}>取消</el-button>
                  </div>
                </div>
              </div>
              <div class="selected-animation-body">
                <div class="example-animate-body">
                  <div class="input-main">
                    <span>当前选择:</span>
                    <el-input vModel={this.tempAnimationData.name} placeholder={this.tempAnimationData.name}/>
                  </div>
                  <div class="input-main">
                    <span>动画执行时间(数字 单位秒):</span>
                    <el-input vModel={this.tempAnimationData.animationDuration} placeholder="数字 单位秒"/>
                  </div>
                  <div class="input-main">
                    <span>动画执行次数(数字或者infinite表示无限循环):</span>
                    <el-input vModel={this.tempAnimationData.animationCount} placeholder="数字"/>
                  </div>
                  <div class="input-main">
                    <span>动画结束状态控制:</span>
                    <el-radio-group vModel={this.tempAnimationData.animationFillMode}>
                      <el-radio class="radio-label-body" label={'none'}>无</el-radio>
                      <el-radio class="radio-label-body" label={'forwards'}>保持结束状态</el-radio>
                      <el-radio class="radio-label-body" label={'backwards'}>回复初始状态</el-radio>
                      <el-radio class="radio-label-body" label={'both'}>兼顾以上两种</el-radio>
                    </el-radio-group>
                  </div>
                  <div class="input-main">
                    <span>动画执行延时:</span>
                    <el-input vModel={this.tempAnimationData.animationDelay} placeholder="数字 单位秒"/>
                  </div>
                </div>
              </div>
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
                     accept="image/jpg,image/jpeg,image/png,image/gif,image/webp,*.svg"
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
    },
  }
  export default vueComponent
</script>
<style lang="scss">
  .dialog-select-animation {
    min-width: 1150px;
    /*width: auto;*/
  }
</style>
<style lang="scss" scoped>

  .cell-config-panel {
    width: 100%;
    height: 100%;
    overflow: auto;
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
      margin: 15px 15px;
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
      flex-flow: row wrap;

      .button-front {
        margin-right: 15px;
      }

      .input-right {
        flex: 1;
        flex-shrink: 1;
      }
    }

    .pick-window-body {
      height: 600px;
      display: flex;
      justify-content: space-around;

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

      .selected-animation-body {
        display: flex;
        flex-flow: column nowrap;
        width: 300px;

        .example-animate-body {
          margin: 0 0 5px 0;
          overflow: auto;
          width: 100%;
          min-height: 45px;
          display: flex;
          flex-flow: column nowrap;
        }
      }

      .example-body {
        display: inline-flex;
        flex-flow: column nowrap;
        margin: 0 15px;
        justify-content: flex-start;
        align-items: flex-start;

        .example-container {
          width: 100%;
          flex: 1;
          display: flex;
          flex-flow: column nowrap;
          justify-content: flex-start;
          align-items: center;

          .example-phone-container {
            width: 300px;
            height: 480px;
            position: relative;
            border: 1px solid rgba(0, 0, 0, .3);
            border-radius: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .example {
            text-align: center;
            animation-duration: 1s;
          }

          .button-bottom {
            box-sizing: border-box;
            display: flex;
            justify-content: flex-end;
            padding: 10px 20px;
            align-self: flex-end;
            margin: auto 0 0 0;
          }
        }
      }
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
