<template>
  <div class="poster-maker-body">
    <div class="cells-body">
      <tree-container :data="treeData" :options="treeOptions" ref="treeContainer" class="tree-class">
        <template v-slot:header>
          <div class="header-body" @click="previewAllPage">
            预览
          </div>
          <div class="header-body" @click="showPosterManageWindow">
            数据管理(导入、保存、新建)
          </div>
          <div class="header-body" @click="handleCreateNewPage">
            新建页面
          </div>
          <div class="header-body" @click="showSetAudioWindow">
            全局设置（背景音等）
          </div>
        </template>
        <template v-slot:footer>
          <div class="footer-body">
          </div>
        </template>
      </tree-container>
    </div>
    <div class="maker-body">
      <demo-container :demoPageData="onSelectPage" :onSelectCell="onSelectCell"/>
    </div>
    <div class="cell-config-body">
      <page-config-panel v-if="showPageConfigPanel && onSelectPage" :onSelectPage.sync="onSelectPage"/>
      <cell-config-panel v-if="onSelectCell" :onSelectCell.sync="onSelectCell"/>
    </div>
    <el-dialog title="海报管理" :visible.sync="isShowDialogPosterManageWindow" custom-class="poster-manage-dialog"
               :close-on-click-modal="false">
      <div class="poster-manage-body">
        <div class="manage-container">
          <div class="pick-poster-body">
            <div class="pick-title">
              .导入\删除海报数据
            </div>
            <div class="poster-pick-list">
              <el-radio v-for="(poster,index) in posterList" class="pick-poster-item" v-model="onSelectExistedPoster"
                        :label="index" :key="poster.poster_id">
                {{poster.poster_name}}
              </el-radio>
            </div>
            <div class="pick-bottom">
              <el-button type="danger" @click="deletePosterData">删除</el-button>
              <el-button type="primary" @click="handleSelectPoster">导入</el-button>
            </div>
          </div>

          <div class="pick-poster-body">
            <div class="pick-title">
              .保存当前海报数据到指定数据源
            </div>
            <div class="poster-pick-list">
              <el-radio v-for="(_poster,index) in posterList" class="pick-poster-item"
                        v-model="onSelectSaveTargetPoster"
                        :label="index" :key="_poster.poster_id">
                <span v-if="poster.poster_id===_poster.poster_id" style="color:red;">(当前海报)</span>
                {{_poster.poster_name}}
              </el-radio>
            </div>
            <div class="pick-bottom">
              <el-button type="primary" @click="savePosterData">更新</el-button>
            </div>
          </div>

          <div class="create-poster-body">
            <div class="pick-title">
              .保存新海报
            </div>
            <div class="create-poster-content">
              <el-input v-model="inputNewPosterName" placeholder="输入自定义海报名字"></el-input>
            </div>
            <div class="pick-bottom">
              <el-button type="primary" class="create-new-button" @click="handleCreatePoster">创建</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="添加模板元素" :visible.sync="dialogAddCellVisible" :close-on-click-modal="false">
      <el-input v-model="onSelectAddCell.inputCellName" placeholder="输入自定义名字"></el-input>
      <el-radio class="radio-add-cell" v-model="onSelectAddCell.cell" v-for="(cell,index) in cellList" :label="cell"
                :key="index">
        {{cell.descriptor}}
      </el-radio>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddCellVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddCell">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="预览" v-if="dialogPreviewVisible" :visible.sync="dialogPreviewVisible">
      <div>
        <div class="preview-example-body">
          <div class="example-container">
            <poster :posterData="previewData" :htmlFontSize="1"/>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="全局设置" v-if="isShowSetAudioWindow" :visible.sync="isShowSetAudioWindow">
      <div>
        <div class="preview-example-body">
          <el-form ref="form" :model="tempData" label-width="100px" style="width: 500px">
            <el-form-item label="音频链接地址">
              <el-input v-model="tempData.href"></el-input>
            </el-form-item>
            <el-form-item label="循环播放">
              <el-switch v-model="tempData.loop"></el-switch>
            </el-form-item>
            <el-form-item label="自动播放">
              <el-switch v-model="tempData.autoPlay"></el-switch>
            </el-form-item>
            <el-form-item>
              <el-button @click="isShowSetAudioWindow = false">取消</el-button>
              <el-button type="primary" @click="handleSaveAudioData">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import util from './libs/utils'
  import {flattenObj} from '@/libs/util'
  import treeContainer from '@/components/tree-container'
  import cells from '../../components/poster/cells/index.js'
  import pageControl from './mixins/pageControl'
  import cellControl from './mixins/cellControl'
  import posterControl from './mixins/posterControl'
  import demoContainer from './demoContainer'
  import cellConfigPanel from './cellConfigPanel'
  import pageConfigPanel from './pageConfigPanel'
  import poster from '@/components/poster/index'
  import {treeDataType, baseConfig} from './libs/static'
  import Vue from "vue";

  const cellList = cells.map(component => {
    const defaultPops = {}
    if (component.props) {
      Object.keys(component.props).forEach(key => {
        defaultPops[key] = component.props[key].default
      })
    }
    return {
      type: component.name,
      descriptor: component.descriptor || '未描述组件',
      // 作为默认属性
      props: {
        ...defaultPops,
        locked: false, hideInDesign: false,
      },
      // panelList: component.panelList.filter(e => e),
    }
  })

  export default {
    name: "posterMaker",
    components: {
      'tree-container': treeContainer,
      'demo-container': demoContainer,
      'cell-config-panel': cellConfigPanel,
      'page-config-panel': pageConfigPanel,
      'poster': poster,
    },
    mixins: [pageControl, cellControl, posterControl],
    created() {
      this.animateList = util.getAnimationList()
      // baseConfig.designWidth
      // let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth
      let htmlDom = document.getElementsByTagName('html')[0]
      htmlDom.style.fontSize = `${baseConfig.designWidth / 50}px`
    },
    data() {
      return {
        pages: [],
        cellList: cellList,
        baseConfig,
        allFontList: [],
        requestedAssets: false,
        requestedFontAssets: false,
      }
    },
    provide() {
      return {
        'allFontList': this.allFontList,
        $context: this,
      }
    },
    async mounted() {
      const posterId = this.$route.query.posterId
      if (posterId && parseFloat(posterId).toString() !== 'NaN') {
        let data;
        try {
          data = await this.$api.GET_POSTER_LIST()
        } catch (e) {
          this.$message('获取数据失败~')
          return
        }
        Vue.set(this, 'posterList', data)
        this.requestedPosterList = true
        const targetPoster = data.find(poster => {
          return Number(poster.poster_id) === Number(posterId)
        })
        if (!targetPoster) {
          this.$message('posterId参数错误，不存在该数据')
          return
        }
        const posterData = await this.$api.GET_POSTER_DETAIL(posterId)
        this.onSelectExistedPoster = data.indexOf(targetPoster)
        this.setPosterData(posterData.poster_data)
      }
    },
    computed: {
      treeData() {
        const values = this.pages
        if (values && Object.keys(values).length > 0) {
          return flattenObj({targetObj: values, childrenKey: 'cells'})
        } else {
          return []
        }
      },
      treeOptions() {
        const self = this
        return {
          search: {
            placeholder: '根据名称搜索',
            useLocalSearch: true
          },
          style: {
            contentWidth: '380',
            contentMinWidth: '300',
            backgroundColor: 'white',
          },
          handleClickItem: function (item, index, opened) {
            if (item.createType === treeDataType.PAGE) {
              this.handleClickPage(item, index)
              this.showPageConfigPanel = true
              if (item.$hasChild && !opened) {
                const treeComponent = this.$refs.treeContainer
                treeComponent.handleClickTriangle(treeComponent, item, index)
              }
            } else if (item.createType === treeDataType.CELL) {
              this.showPageConfigPanel = false
              return this.handleClickCell(item, index)
            }
          }.bind(self),
          moreOption: {
            getOption: (item, index) => {
              if (item.createType === treeDataType.PAGE) {
                return this.getPageOptions(item, index)
              } else if (item.createType === treeDataType.CELL) {
                return this.getCellOptions(item, index)
              }
              return []
            }
          },
        }
      }
    },
    methods: {}
  }
</script>
<style lang="scss">
  .content-row {
    font-size: 18px;
  }

  .poster-manage-dialog {
    width: 80%;
  }
</style>
<style lang="scss" scoped>
  .poster-maker-body {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-start;

    .header-body {
      width: 100%;
      height: 35px;
      cursor: pointer;
      font-size: 22px;
      text-align: center;
      line-height: 35px;
    }

    .footer-body {
      min-height: 150px;
    }

    .cells-body {
      height: 100%;
      padding-top: 100px;
      box-sizing: border-box;

      .tree-class {
        overflow: hidden;
        box-sizing: border-box;
        display: flex;
        flex-flow: column nowrap;
      }
    }

    .maker-body {
      min-width: 750px;
      flex: 1;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .cell-config-body {
      width: 400px;
      height: 100%;
    }

    .radio-add-cell {
      margin: 30px 0;
      display: block;
    }

    .preview-example-body {
      flex: 1;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .example-container {
        width: 500px;
        height: 800px;
        position: relative;
        border: 1px solid rgba(0, 0, 0, .3);
        border-radius: 30px;
        margin-left: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }

      .fonts-body {
        display: flex;
        flex-flow: row wrap;
        margin: 20px 0px
      }
    }

    .poster-manage-body {
      width: 100%;
      overflow: auto;

      .manage-container {
        min-width: 850px;
        display: flex;
        justify-content: space-around;


        .pick-bottom {
          display: flex;
          padding-right: 50px;
          justify-content: flex-end;
        }

        .pick-title {
          font-weight: 500;
          color: #1f2f3d;
          margin-bottom: 20px;
        }

        .pick-poster-body {
          min-width: 250px;
          padding: 0 5px;
          box-sizing: border-box;
          border-left: 1px solid rgba(0, 0, 0, .4);
          flex-shrink: 1;

          .poster-pick-list {
            height: 500px;
            overflow: auto;

            .pick-poster-item {
              display: block;
              margin: 15px 0;
              font-weight: 400;
              color: #1f2f3d;
            }
          }
        }

        .create-poster-body {
          min-width: 300px;
          box-sizing: border-box;
          display: flex;
          flex-flow: column nowrap;

          .create-poster-content {
            flex: 1;
          }

          .create-new-button {
            width: auto;
          }
        }
      }

    }
  }
</style>
