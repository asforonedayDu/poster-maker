<template>
  <div class="poster-maker-body">
    <div class="cells-body">
      <tree-container :data="treeData" :options="treeOptions" ref="treeContainer">
        <template v-slot:header>
          <div class="header-body" @click="handleCreateNewPage">
            新建页面
          </div>
          <div class="header-body" @click="dialogPreviewVisible=true">
            预览
          </div>
          <div class="header-body" @click="showPageData">
            查看数据
          </div>
        </template>
      </tree-container>
    </div>
    <div class="maker-body">
      <demo-container :demoPageData="onSelectPage" :onSelectCell="onSelectCell"/>
    </div>
    <div class="cell-config-body">
      <cell-config-panel v-if="onSelectCell" :onSelectCell.sync="onSelectCell"/>
    </div>
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
            <poster :pageData="pages"/>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import util from './libs/utils'
import {flattenObj} from '@/libs/util'
import treeContainer from '@/components/tree-container'
import cells from '../poster/cells/index.js'
import pageControl from './mixins/pageControl'
import cellControl from './mixins/cellControl'
import demoContainer from './demoContainer'
import cellConfigPanel from './cellConfigPanel'
import poster from '@/views/poster/index'

export const treeDataType = {
  CELL: '_CELL',
  PAGE: '_PAGE',
}
export const baseConfig = {
  designWidth: 500,
  designHeight: 800,
}

const cellList = cells.map(component => {
  return {
    type: component.name,
    descriptor: component.descriptor || '未描述组件',
    // 作为默认属性
    props: {
      ...(component.defaultProps ? component.defaultProps : {})
    },
    panelList: component.panelList.filter(e => e),
  }
})

export default {
  name: "posterMaker",
  components: {
    'tree-container': treeContainer,
    'demo-container': demoContainer,
    'cell-config-panel': cellConfigPanel,
    'poster': poster,
  },
  mixins: [pageControl, cellControl],
  created() {
    this.animateList = util.getAnimationList()
    // let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth
    let htmlDom = document.getElementsByTagName('html')[0]
    htmlDom.style.fontSize = '5px'

  },
  data() {
    return {
      pages: [
        {
          "id": 0, "name": "第一页", "cells": [{
            "name": "背景图",
            "id": "0_0",
            "createType": "_CELL",
            "type": "cell-flex-board",
            "descriptor": "弹性块(随目标设备屏幕宽高拉伸，用于全屏自适应背景元素)",
            "props": {
              "position": {"width": 100, "height": 100, "left": 0, "top": 0},
              "animationDuration": 1,
              "animationDelay": 0,
              "animationCount": 1,
              "animationFillMode": "forwards",
              "hideAfterAnimation": true,
              "background": "rgba(165,52,141,1)"
            },
            "panelList": [{"method": "rBackground", "propKey": "background"}, {
              "method": "rBackgroundImage",
              "propKey": "backgroundImage"
            }, {"method": "rColor", "propKey": "color"}, {
              "method": "rAnimationActions",
              "propKey": "animationActions"
            }, {"method": "rHideAfterAnimation", "propKey": "hideAfterAnimation"}, {
              "method": "rAnimationDuration",
              "propKey": "animationDuration"
            }, {"method": "rAnimationCount", "propKey": "animationCount"}, {
              "method": "rAnimationFillMode",
              "propKey": "animationFillMode"
            }, {"method": "rAnimationDelay", "propKey": "animationDelay"}],
            "$level": 1,
            "$position": [0, 0],
            "$hasChild": false,
            "$parentId": 0,
            "$namePath": "第一页"
          }], "createType": "_PAGE", "$level": 0, "$position": [0], "$hasChild": true, "$parentId": -1, "$namePath": ""
        }, {
          "id": 1,
          "name": "第2页",
          "createType": "_PAGE",
          "$level": 0,
          "$position": [1],
          "$hasChild": true,
          "$parentId": -1,
          "$namePath": "",
          "cells": [{
            "name": "背景",
            "id": "1_0",
            "createType": "_CELL",
            "type": "cell-flex-board",
            "descriptor": "弹性块(随目标设备屏幕宽高拉伸，用于全屏自适应背景元素)",
            "props": {
              "position": {"width": 101.8, "height": 101.125, "left": -1.4000000000000001, "top": -0.5},
              "animationDuration": 1,
              "animationDelay": 0,
              "animationCount": 1,
              "animationFillMode": "forwards",
              "hideAfterAnimation": true,
              "background": "rgba(71,73,63,1)"
            },
            "panelList": [{"method": "rBackground", "propKey": "background"}, {
              "method": "rBackgroundImage",
              "propKey": "backgroundImage"
            }, {"method": "rAnimationActions", "propKey": "animationActions"}, {
              "method": "rHideAfterAnimation",
              "propKey": "hideAfterAnimation"
            }, {"method": "rAnimationDuration", "propKey": "animationDuration"}, {
              "method": "rAnimationCount",
              "propKey": "animationCount"
            }, {"method": "rAnimationFillMode", "propKey": "animationFillMode"}, {
              "method": "rAnimationDelay",
              "propKey": "animationDelay"
            }],
            "$level": 1,
            "$position": [1, 0],
            "$hasChild": false,
            "$parentId": 1,
            "$namePath": "第2页"
          }]
        }],
      cellList: cellList,
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
          backgroundColor: 'white'
        },
        handleClickItem: function (item, index) {
          if (item.createType === treeDataType.PAGE) {
            return this.handleClickPage(item, index)
          } else if (item.createType === treeDataType.CELL) {
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
  methods: {
    showPageData() {
      this.$alert(_.cloneDeep(this.pages), '数据', {
        confirmButtonText: '确定',
        callback: action => {
        }
      });
    }
  }
}
</script>
<style lang="scss">
  .content-row {
    font-size: 18px;
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

    .cells-body {
      height: 100%;
      padding-top: 100px;
      box-sizing: border-box;
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
    }

  }
</style>
