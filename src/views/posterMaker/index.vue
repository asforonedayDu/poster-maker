<template>
  <div class="poster-maker-body">
    <div class="cells-body">
      <tree-container :data="treeData" :options="treeOptions" ref="treeContainer">
        <template v-slot:header>
          <div class="header-body" @click="handleCreateNewPage">
            新建页面
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
    <el-dialog title="添加模板元素" :visible.sync="dialogAddCellVisible">
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
  },
  mixins: [pageControl, cellControl],
  created() {
    this.animateList = util.getAnimationList()
    console.log('animateList', this.animateList)
    // let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth
    let htmlDom = document.getElementsByTagName('html')[0]
    htmlDom.style.fontSize = '5px'

  },
  data() {
    return {
      pages: [
        {
          id: 0,
          name: '第一页',
          type: 'page',
          children: []
        }
      ],
      cellList: cellList,
    }
  },
  computed: {
    treeData() {
      const values = this.pages
      if (values && Object.keys(values).length > 0) {
        return flattenObj({targetObj: values, childrenKey: 'children'})
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
          if (item.type === 'page') {
            return this.handleClickPage(item, index)
          } else if (item.type === 'cell') {
            return this.handleClickCell(item, index)
          }
        }.bind(self),
        moreOption: {
          getOption: (item, index) => {
            if (item.type === 'page') {
              return this.getPageOptions(item, index)
            } else if (item.type === 'cell') {
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
  }
</style>
