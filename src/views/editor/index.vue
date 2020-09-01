<template>
  <div class="main-container">
    <div id="toolbar" ref="toolbar" class="toolbar"/>
    <vue-draggable-resizable class="vue-draggable" @resizing="onResize" :enable-native-drag="true"
                             :disable-user-select="true"
                             :w="1200" :h="800" :parent="true" :draggable="false">
      <div class="edit-body">
        <div ref="editor" class="content-container" :style="{height:`${editHeight}px`,background:colorValue}"></div>
      </div>
    </vue-draggable-resizable>
    <div class="buttons">
      <el-button class="button-export" @click="toClipBoard($event)">复制到剪切板</el-button>
      <el-button class="button-export" @click="showContent">查看内容</el-button>
      <div class="color-set-body">
        <div class="label-color">编辑器背景颜色:</div>
        <el-input class="input-color" v-model="colorValue" placeholder="编辑器背景颜色"></el-input>
        <div class="label-color">(设置background属性)</div>
      </div>
    </div>
  </div>
</template>

<script>
import E from 'wangeditor'
import VueDraggableResizable from 'vue-draggable-resizable'
// optionally import default styles
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
import clipboard from "@/libs/clipboard";

export default {
  name: "editor",
  components: {
    'vue-draggable-resizable': VueDraggableResizable
  },
  data() {
    return {
      phoneMode: false,
      editorContent: '',
      editHeight: 750,
      colorValue: 'white',
    }
  },
  methods: {
    toClipBoard($event) {
      clipboard(this.editorContent, $event)
    },
    showContent() {
      this.$msgbox(this.editorContent)
    },
    onResize(x, y, width, height) {
      this.editHeight = height - 50
    }
  },
  mounted() {
    const editor = new E(this.$refs.toolbar, this.$refs.editor)
    editor.customConfig.onchange = (html) => {
      this.editorContent = html
    }
    editor.create()
  }

}
</script>

<style lang="scss" scoped>
  .main-container {
    width: 100%;
    height: 100%;
    padding: 40px 40px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: center;

    .vue-draggable {
      min-height: 400px;
      top: 130px;
      min-width: 300px;
    }

    .toolbar {
      border: 1px solid #ccc;
      position: absolute;
      top: 80px;
    }

    .edit-body {
      box-sizing: border-box;
      padding: 20px 20px;
      width: 100%;

      .content-container {
        text-align: left;
        min-height: 350px;
        min-width: 260px;
        border: 1px solid #ccc;
        background: black;
      }
    }

    .buttons {
      position: absolute;
      top: 40px;
      height: 30px;
      line-height: 30px;
      display: flex;
      text-align: center;
      justify-content: center;

      .button-export {
        margin: 0 20px;
        cursor: pointer;
        border: 1px solid #ccc;
        padding: 3px 9px;
        border-radius: 5px;
      }

      .color-set-body {
        display: flex;
        font-size: 22px;
        text-align: left;
        justify-content: flex-start;
        align-items: center;
        margin: 0 20px;

        .label-color {
          margin-right: 20px;
          font-size: 16px;
        }

        .input-color {
          width: 200px;
        }
      }
    }
  }
</style>
