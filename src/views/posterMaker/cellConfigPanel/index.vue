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
    watcher[watchTarget] = {
      handler: function (val, oldValue) {
        if (val !== null) {
          // console.log('watcher[watchTarget]', watchTarget, val)
          if (val === this.onSelectCell.props[propKey]) return
          this.$set(this.onSelectCell.props, propKey, _.cloneDeep(val))
        }
      },
      deep: true,
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
          animationDirection: 'normal',
          animationTimingFunction: '',
          animationCount: 1,
          animationFillMode: 'both',
        },
        onEditAnimationIndex: 0,
        showBackgroundColorPick: false,
        showTextColorPick: false,
        watchSelectCell: null,
      }
    },
    created() {
      if (!this.$context.requestedFontAssets) {
        this.getFontList().then()
      }
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
      },
      'onSelectCell.props.position.width': {
        handler(val) {
          this.configProps.position.width = val
        },
      },
      'onSelectCell.props.position.height': {
        handler(val) {
          this.configProps.position.height = val
        },
      },
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
          <el-collapse>

            {Object.values(this.targetCell.panelList).map(config => {
              if (!config) return ''
              return (
                <div class="panel-item-body">
                  <el-collapse-item>
                    <template slot={'title'}>
                      {config.description}:
                    </template>
                    {this[`${config.method}`](h, config)}
                  </el-collapse-item>
                </div>
              )
            })}
          </el-collapse>
          {this.renderAnimatePickWindow(h)}
          {this.renderAssetsWindow(h)}
          {this.renderFontWindow(h)}
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
        if (!this.onSelectCell.props[this.animationPropkey]) this.onSelectCell.props[this.animationPropkey] = []
        this.onEditAnimationIndex = this.onSelectCell.props[this.animationPropkey].length
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
                  <div class="input-animation-config">
                    <span>当前选择:</span>
                    <el-input style={{display: 'inline-block', width: '200px'}} vModel={this.tempAnimationData.name}
                              placeholder={this.tempAnimationData.name}/>
                  </div>
                  <div class="input-animation-config">
                    <span>动画执行次数(数字或infinite表示无限循环):</span>
                    <el-input style={{width: '100px'}} vModel={this.tempAnimationData.animationCount} placeholder="数字"/>
                  </div>
                  <div class="input-animation-config">
                    <span>速度曲线(animation-timing-function):</span>
                    <el-input style={{width: '200px'}} vModel={this.tempAnimationData.animationTimingFunction}
                              placeholder=""/>
                  </div>
                  <div class="input-animation-config">
                    <span>动画播放方向控制（执行次数>1时生效）:</span>
                    <el-radio-group class="flex-column-config" vModel={this.tempAnimationData.animationDirection}>
                      <el-radio class="radio-label-body" label={'normal'}>正常播放</el-radio>
                      <el-radio class="radio-label-body" label={'alternate'}>奇数次正常，偶数次反向</el-radio>
                    </el-radio-group>
                  </div>
                  <div class="input-animation-config">
                    <span>动画执行时间(数字 单位秒):</span>
                    <el-input style={{display: 'inline-block', width: '200px'}}
                              vModel={this.tempAnimationData.animationDuration} placeholder="数字 单位秒"/>
                  </div>
                  <div class="input-animation-config">
                    <span>动画结束状态控制:</span>
                    <el-radio-group class="flex-column-config" vModel={this.tempAnimationData.animationFillMode}>
                      <el-radio class="radio-label-body" label={'none'}>无</el-radio>
                      <el-radio class="radio-label-body" label={'forwards'}>保持结束状态</el-radio>
                      <el-radio class="radio-label-body" label={'backwards'}>回复初始状态</el-radio>
                      <el-radio class="radio-label-body" label={'both'}>兼顾以上两种</el-radio>
                    </el-radio-group>
                  </div>
                  <div class="input-animation-config">
                    <span>动画执行延时:</span>
                    <el-input style={{display: 'inline-block', width: '200px'}}
                              vModel={this.tempAnimationData.animationDelay} placeholder="数字 单位秒"/>
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
              <el-button class="upload-button" type={'primary'} onClick={() => this.$refs.uploadInput.click()}>上传素材
              </el-button>
            </div>
            <div>
              <div class="assets-list">
                {
                  this.commonAssets.map(asset => {
                    return (
                      <div class="asset-body">
                        <div class="asset-img-body" vOn:click={() => this.handleAssetClick(asset)}>
                          <img class={`${/\.gif$/i.test(asset.asset_content) ? 'gif-bg' : ''}`}
                               src={asset.asset_content}/>
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
                  <el-button type="danger" on-click={() => this.deletePicAsset(this.onSelectAsset)}>删除</el-button>
                  <el-button type="primary" on-click={() => this.setBackgroundImage(this.onSelectAsset)}>确认</el-button>
                </div>
                }
              </div>

            </div>
          </el-dialog>
        )
      },
      renderFontWindow(h) {
        return (
          <el-dialog title="字体管理"
                     visible={this.showFontsWindow} {...{on: {'update:visible': () => this.showFontsWindow = false}}}
                     class="assets-body" width="80%">

            <div class="upload-img-body">
              <input ref="uploadFontInput" class="upload-button-input" type="file"
                     accept="font/ttf,font/woff2,font/woff,application/vnd.ms-fontobject"
                     on-change={this.handleFontFileChange}/>
              <el-button class="upload-button" type={'primary'}
                         onClick={() => this.$refs.uploadFontInput.click()}>上传字体文件
              </el-button>
            </div>
            <p>字体文件需要转码，比较耗时，上传时请耐心等待。 尽量使用ttf/woff/woff2格式字体，其它格式可能不支持。</p>
            <div>
              <div class="assets-list">
                {
                  this.allFontList.map((font, index) => {
                    return (
                      <div class="asset-body" key={index}>
                        <el-tag style={{cursor: 'pointer'}} closable={true} vOn:close={() => {
                          this.handlerFontAssetDelete(font, index)
                        }}>
                          {font.asset_name}
                        </el-tag>
                      </div>
                    )
                  })
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

  .el-input__inner {
    width: 200px;
  }

  .el-collapse {
    border: none;
  }

  .el-collapse-item__wrap {
    border-bottom: none !important;
    width: 350px;
  }

  .el-collapse-item__content {
    padding-bottom: 5px;
  }

  .el-collapse-item__header {
    line-height: 30px;
    height: 30px;
    width: 350px;
    margin-top: -10px;
    font-size: 14px;
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
      margin: 5px 5px;
    }

    .panel-item-body {
      box-sizing: border-box;
      padding: 15px 10px 5px 10px;
      width: 100%;
      border-bottom: 1px solid rgba(0, 0, 0, 0.4);
    }

    .input-main {
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-around;
      align-items: flex-start;
      margin: 5px 0;

      > span {
        margin: auto 5px 10px 0;
      }

    }

    .el-select-font {
      margin-top: 15px;
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
      justify-content: center;

      .pick-list {
        width: 250px;
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
        width: 350px;

        .example-animate-body {
          margin: 0 0 5px 0;
          overflow: auto;
          width: 100%;
          min-height: 45px;
          display: flex;
          flex-flow: column nowrap;

          .input-animation-config {
            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-start;
            align-items: center;
            margin: 10px 0;

            > span {
              display: inline-block;
              width: 120px;
              margin: auto 5px auto 0;
            }

            .flex-column-config {
              display: flex;
              flex-flow: row wrap;
              width: 220px;
            }
          }
        }
      }

      .example-body {
        display: inline-flex;
        flex-flow: column nowrap;
        margin: 0 25px;
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

          .gif-bg {
            background: black;
          }

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
