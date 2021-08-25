<template>
  <div class="page-config-panel">
    <div class="panel-item-body">
      <div class="input-main">
        <span>修改页名:</span>
        <el-input v-model="onSelectPage.name" :placeholder="initialName"/>
      </div>
      <div class="input-main">
        <el-button class="button-front" @click="showConfigWindow">
          所有动画时间控制
        </el-button>
      </div>
    </div>
    <el-dialog custom-class="dialog-animation-set-container" title="所有动画时间控制" v-if="isShowAnimationSetWindow"
               :visible.sync="isShowAnimationSetWindow">
      <div class="">
        <div class="time-max-set-body">
          <el-button class="button-front" @click="expandTimeLine">
            扩大时间轴范围
          </el-button>
          <el-button class="button-front" @click="shrinkTimeLine">
            缩小时间轴范围
          </el-button>
        </div>
        <div class="animation-set-container">
          <div class="set-info-body">
            <div class="info-body for-item" v-for="(item,index) in allAnimation" :key="index">
              <span>元素: {{item.cellName}}</span>
              <span>动画: {{item.animation.name}}</span>
            </div>
          </div>
          <div class="sequence-body">
            <sequence-select v-for="(item,index) in allAnimation" :key="`page${index}`" class="for-item"
                             :start.sync="item.animation.animationDelay"
                             :duration.sync="item.animation.animationDuration" :max="max"/>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import sequenceSelect from '@/components/sequence-select';

  const timeMaxSelects = [100, 200, 400, 800, 1200, 1600, 2200]
  export default {
    name: "page-config-panel",
    components: {
      sequenceSelect: sequenceSelect,
    },
    props: {
      onSelectPage: {
        default: {}
      }
    },
    data() {
      return {
        initialName: this.onSelectPage.name,
        isShowAnimationSetWindow: false,
        max: timeMaxSelects[0],
      }
    },
    methods: {
      showConfigWindow() {
        this.isShowAnimationSetWindow = true
      },
      expandTimeLine() {
        const current = timeMaxSelects.indexOf(this.max)
        if (current < timeMaxSelects.length - 1) {
          this.max = timeMaxSelects[current + 1]
        } else {
          this.$message('已达最大范围')
        }
      },
      shrinkTimeLine() {
        const current = timeMaxSelects.indexOf(this.max)
        if (current > 0) {
          this.max = timeMaxSelects[current - 1]
        } else {
          this.$message('已达最小范围')
        }
      }
    },
    computed: {
      allAnimation() {
        const animations = []
        this.onSelectPage.cells.forEach(cell => {
          if (cell.props.animationActions) {
            cell.props.animationActions.forEach(item => {
              animations.push({
                cellName: cell.name,
                animation: item,
              })
            })
          }
        })
        return animations
      }
    }
  }
</script>
<style lang="scss">
  .dialog-animation-set-container {
    width: 1200px;
  }
</style>
<style scoped lang="scss">
  .page-config-panel {
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
      padding: 15px 10px 15px 10px;
      width: 100%;
      border-bottom: 1px solid rgba(0, 0, 0, 0.4);
    }

    .input-main {
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-around;
      align-items: flex-start;
      margin: 10px 0;

      > span {
        margin: auto 5px 10px 0;
      }
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

  .time-max-set-body {

  }

  .animation-set-container {
    width: 100%;
    min-height: 400px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    overflow: hidden;

    .for-item {
      margin: 8px 5px;
    }

    .set-info-body {
      margin: 10px 0px;
      display: flex;
      overflow-x: auto;
      flex-flow: column nowrap;
      justify-content: flex-start;
      align-items: flex-start;

      .info-body {
        width: 180px;
        height: 50px;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: flex-start;
        box-sizing: border-box;
        border-bottom: 1px solid rgba(0, 0, 0, 0.4);

        span {
          margin: auto 0;
        }
      }
    }

    .sequence-body {
      flex-grow: 1;
      flex-shrink: 1;
      margin: 10px 0;
      padding: 0 10px 50px 10px;
      overflow-y: visible;
      overflow-x: auto;
      display: flex;
      flex-flow: column nowrap;
      justify-content: flex-start;
      align-items: flex-start;
      user-select: none;
    }
  }
</style>
