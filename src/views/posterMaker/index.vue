<template>
  <div class="poster-maker-body">
    <div class="cells-body">
      <tree-container
        :data="treeData"
        :options="treeOptions"
        ref="treeContainer"
        class="tree-class"
      >
        <template v-slot:header>
          <div class="options-body">
            <div class="option-title"></div>
            <div class="option-item" @click="previewAllPage">预览</div>
            <div class="option-item" @click="showPosterManageWindow">
              数据管理(导入、保存、新建)
            </div>
            <div class="option-item" @click="handleCreateNewPage">新建页面</div>
            <div class="option-item" @click="showSetAudioWindow">
              全局设置（背景音等）
            </div>
          </div>
          <div class="border-line" />
          <div class="tree-title">布局树：</div>
        </template>
        <template v-slot:footer>
          <div class="footer-body"></div>
        </template>
      </tree-container>
    </div>
    <div class="maker-body">
      <div class="cell-drag-body">
        <div class="drag-tip">添加元素:</div>
        <div
          class="drag-item"
          v-for="(cell, index) in cellList"
          :key="index"
          title="拖拽到设计区域以添加"
          draggable="true"
          @dragstart="dragStart($event, cell.type)"
        >
          {{ cell.descriptor }}
        </div>
      </div>
      <demo-container
        class="design-container"
        :demoPageData="onSelectPage"
        :onSelectCell="onSelectCell"
        @drop.native="handleDrop"
        @dragover.native="handleDragover"
      />
    </div>
    <div class="cell-config-body">
      <page-config-panel
        class="config-panel"
        v-if="showPageConfigPanel && onSelectPage"
        :onSelectPage.sync="onSelectPage"
      />
      <cell-config-panel
        class="config-panel"
        v-if="onSelectCell"
        :onSelectCell.sync="onSelectCell"
      />
    </div>
    <el-dialog
      title="海报管理"
      :visible.sync="isShowDialogPosterManageWindow"
      custom-class="poster-manage-dialog"
      :close-on-click-modal="false"
    >
      <div class="poster-manage-body">
        <div class="manage-container">
          <div class="pick-poster-body">
            <div class="pick-title">.导入\删除海报数据</div>
            <div class="poster-pick-list">
              <el-radio
                v-for="(poster, index) in posterList"
                class="pick-poster-item"
                v-model="onSelectExistedPoster"
                :label="index"
                :key="poster.poster_id"
              >
                {{ poster.poster_name }}
              </el-radio>
            </div>
            <div class="pick-bottom">
              <el-button type="danger" @click="deletePosterData"
                >删除</el-button
              >
              <el-button type="primary" @click="handleSelectPoster"
                >导入</el-button
              >
            </div>
          </div>

          <div class="pick-poster-body">
            <div class="pick-title">.保存当前海报数据到指定数据源</div>
            <div class="poster-pick-list">
              <el-radio
                v-for="(_poster, index) in posterList"
                class="pick-poster-item"
                v-model="onSelectSaveTargetPoster"
                :label="index"
                :key="_poster.poster_id"
              >
                <span
                  v-if="poster.poster_id === _poster.poster_id"
                  style="color: red"
                  >(当前海报)</span
                >
                {{ _poster.poster_name }}
              </el-radio>
            </div>
            <div class="pick-bottom">
              <el-button type="primary" @click="savePosterData">更新</el-button>
            </div>
          </div>

          <div class="create-poster-body">
            <div class="pick-title">.保存新海报</div>
            <div class="create-poster-content">
              <el-input
                v-model="inputNewPosterName"
                placeholder="输入自定义海报名字"
              ></el-input>
            </div>
            <div class="pick-bottom">
              <el-button
                type="primary"
                class="create-new-button"
                @click="handleCreatePoster"
                >创建</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="添加模板元素"
      :visible.sync="dialogAddCellVisible"
      :close-on-click-modal="false"
    >
      <el-input
        v-model="onSelectAddCell.inputCellName"
        placeholder="输入自定义名字"
      ></el-input>
      <el-radio
        class="radio-add-cell"
        v-model="onSelectAddCell.cell"
        v-for="(cell, index) in cellList"
        :label="cell"
        :key="index"
      >
        {{ cell.descriptor }}
      </el-radio>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddCellVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddCell">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="预览"
      v-if="dialogPreviewVisible"
      :visible.sync="dialogPreviewVisible"
    >
      <div>
        <div class="preview-example-body">
          <div
            class="example-container"
            :style="`width:${baseConfig.designWidth}px;height: ${baseConfig.designHeight}px`"
          >
            <poster :posterData="previewData" :designMode="true" />
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="全局设置"
      v-if="isShowSetAudioWindow"
      :visible.sync="isShowSetAudioWindow"
    >
      <div>
        <div class="preview-example-body">
          <el-form
            ref="form"
            :model="tempData"
            label-width="100px"
            style="width: 500px"
          >
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
              <el-button type="primary" @click="handleSaveAudioData"
                >保存</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import util from "./libs/utils";
import { flattenObj } from "@/libs/util";
import treeContainer from "@/components/tree-container";
import cells from "../../components/poster/cells/index.js";
import pageControl from "./mixins/pageControl";
import cellControl from "./mixins/cellControl";
import posterControl from "./mixins/posterControl";
import demoContainer from "./demoContainer";
import cellConfigPanel from "./cellConfigPanel";
import pageConfigPanel from "./pageConfigPanel";
import poster from "@/components/poster/index";
import {
  treeDataType,
  baseConfig,
  cleanCellProps,
  getMaxCellId,
} from "./libs/static";
import Vue from "vue";

const cellList = cells.map((component) => {
  return {
    type: component.name,
    descriptor: component.descriptor || "未描述组件",
    // 作为默认属性
    props: {
      ...component.defaultProps,
      locked: false,
      hideInDesign: false,
    },
    // panelList: component.panelList.filter(e => e),
  };
});

export default {
  name: "posterMaker",
  components: {
    "tree-container": treeContainer,
    "demo-container": demoContainer,
    "cell-config-panel": cellConfigPanel,
    "page-config-panel": pageConfigPanel,
    poster: poster,
  },
  mixins: [pageControl, cellControl, posterControl],
  created() {
    this.animateList = util.getAnimationList();
    // baseConfig.designWidth
    // let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth
    let htmlDom = document.getElementsByTagName("html")[0];
    htmlDom.style.fontSize = `${baseConfig.designWidth / 50}px`;
  },
  data() {
    return {
      pages: [],
      cellList: cellList,
      baseConfig,
      allFontList: [],
      requestedAssets: false,
      requestedFontAssets: false,
    };
  },
  provide() {
    return {
      allFontList: this.allFontList,
      $context: this,
    };
  },
  async mounted() {
    const posterId = this.$route.query.posterId;
    if (posterId && parseFloat(posterId).toString() !== "NaN") {
      let data;
      try {
        data = await this.$api.GET_POSTER_LIST();
      } catch (e) {
        this.$message("获取数据失败~");
        return;
      }
      Vue.set(this, "posterList", data);
      this.requestedPosterList = true;
      const targetPoster = data.find((poster) => {
        return Number(poster.poster_id) === Number(posterId);
      });
      if (!targetPoster) {
        this.$message("posterId参数错误，不存在该数据");
        return;
      }
      const posterData = await this.$api.GET_POSTER_DETAIL(posterId);
      this.onSelectExistedPoster = data.indexOf(targetPoster);
      this.setPosterData(posterData.poster_data);
    }
  },
  computed: {
    treeData() {
      const values = this.pages;
      if (values && Object.keys(values).length > 0) {
        return flattenObj({ targetObj: values, childrenKey: "cells" });
      } else {
        return [];
      }
    },
    treeOptions() {
      const self = this;
      return {
        search: {
          placeholder: "根据名称搜索",
          useLocalSearch: true,
        },
        style: {
          contentWidth: "380",
          contentMinWidth: "300",
          backgroundColor: "white",
        },
        handleClickItem: function (item, index, opened) {
          if (item.createType === treeDataType.PAGE) {
            this.handleClickPage(item, index);
            this.showPageConfigPanel = true;
            if (item.$hasChild && !opened) {
              const treeComponent = this.$refs.treeContainer;
              treeComponent.handleClickTriangle(treeComponent, item, index);
            }
          } else if (item.createType === treeDataType.CELL) {
            this.showPageConfigPanel = false;
            return this.handleClickCell(item, index);
          }
        }.bind(self),
        moreOption: {
          getOption: (item, index) => {
            if (item.createType === treeDataType.PAGE) {
              return this.getPageOptions(item, index);
            } else if (item.createType === treeDataType.CELL) {
              return this.getCellOptions(item, index);
            }
            return [];
          },
        },
        handleDropItem: (originItem, item) => {
          const cells = this.onSelectPage.cells;
          const originIndex = cells.indexOf(originItem);
          const toIndex = cells.indexOf(item);
          if (originIndex >= 0 && toIndex >= 0) {
            cells.splice(originIndex, 1);
            cleanCellProps(originItem);
            originItem.id = `${this.onSelectPage.id}_${
              getMaxCellId(cells) + 1
            }`;
            cells.splice(
              toIndex > originIndex ? toIndex : toIndex + 1,
              0,
              originItem
            );
          }
        },
      };
    },
  },
  methods: {
    handleDrop(event) {
      event.preventDefault();
      const cellType = event.dataTransfer?.getData("cellType");
      if (!cellType) return;
      if (!this.onSelectPage?.id) {
        if (this.pages.length > 0) {
          return this.$message("请先选择一个页面");
        } else {
          this.handleCreateNewPage();
          this.onSelectPage = this.pages[0];
        }
      }
      this.onSelectAddCell.inputCellName = "未命名元素";
      this.onSelectAddCell.cell = this.cellList.find(
        (i) => i.type === cellType
      );
      this.onSelectAddCell.parentPage = this.onSelectPage;
      this.onSelectAddCell.addPosition = this.onSelectPage.cells.length;
      this.handleAddCell();
    },
    handleDragover(event) {
      event.preventDefault();
    },
    dragStart(event, cellType) {
      event.dataTransfer.setData("cellType", cellType);
    },
  },
};
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

  .options-body {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 30px;
    padding-left: 30px;
    .option-item {
      width: auto;
      text-align: left;
      cursor: pointer;
      font-size: 18px;
      line-height: 1.8;
      padding: 0 10px;
      border: 1px solid #409eff;
      background: #1989fa;
      border-radius: 8px;
      margin: 10px 0;
      color: #fff;
    }
  }

  .border-line {
    margin: 40px 0 30px;
    height: 1px;
    border-bottom: 1px solid #68686866;
  }

  .tree-title {
    margin: 0 0 10px 30px;
    text-align: left;
    font-size: 18px;
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
    flex-flow: column nowrap;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .cell-drag-body {
      margin-bottom: 50px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 548px;

      .drag-tip {
        font-size: 18px;
      }

      .drag-item {
        margin: 0 20px;
        cursor: grab;
        background-color: #409eff;
        border: 1px solid #409eff;
        padding: 2px 10px;
        font-size: 16px;
        text-align: center;
        color: #fff;
        border-radius: 4px;

        &:hover {
        }
      }
    }

    .design-container {
      justify-self: center;
    }
  }

  .cell-config-body {
    width: 400px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
    padding-right: 28px;

    .config-panel {
      height: auto;
      border-top: 1px solid rgba(0, 0, 0, 0.3);
      border-right: 1px solid rgba(0, 0, 0, 0.3);
      margin-right: 10px;
      border-radius: 5px;
    }
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
    border-radius: 15px;

    .example-container {
      position: relative;
      border: 1px solid rgba(0, 0, 0, 0.3);
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
      margin: 20px 0px;
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
        border-left: 1px solid rgba(0, 0, 0, 0.4);
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
