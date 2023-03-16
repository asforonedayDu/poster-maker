<script type="text/jsx">
import cells from "../../../components/poster/cells/index.js";
import VueDraggableResizable from "vue-draggable-resizable";
// optionally import default styles
import "vue-draggable-resizable/dist/VueDraggableResizable.css";
import { baseConfig } from "@/views/posterMaker/libs/static";

const components = {};
cells.forEach((component) => {
  components[component.name] = component;
});
components["vue-draggable-resizable"] = VueDraggableResizable;
const invalidDragFlag = -1000;
export default {
  name: "demoContainer",
  components,
  props: {
    demoPageData: {
      default: {},
    },
    onSelectCell: {
      default: null,
    },
  },
  data() {
    return {
      editWidth: 0,
      editHeight: 0,
      showEditWindow: false,
      dragStartX: 0,
      dragStartY: 0,
      dragStartLeft: invalidDragFlag,
      dragStartTop: invalidDragFlag,
      dragLineLeft: -1,
      dragLineTop: -1,
    };
  },
  render(h, context) {
    let items = [];
    for (let item of this.demoCells) {
      if (item.props.hideInDesign) continue;
      items.push(this.renderCell(h, item, context));
      if (item === this.onSelectCell) {
        items.push(this.renderEditWindow(h));
      }
    }
    const top = this.dragLineTop;
    const left = this.dragLineLeft;
    return (
      <div
        class="design-root-container"
        ref="designContainer"
        style={{
          width: `${baseConfig.designWidth}px`,
          height: `${baseConfig.designHeight}px`,
        }}
        id="poster-root"
      >
        <div class="demo-container-body">{items}</div>
        <div class="border-body" />
        <div class="point-container">
          {...new Array(51).fill("").map(() => {
            return <div class="point-top" />;
          })}
          {...new Array(81).fill("").map(() => {
            return <div class="point-left" />;
          })}
        </div>
        <div
          class="line-horizon"
          style={{ top: `${top}px` }}
          ref="horizonLine"
        />
        <div
          class="line-horizon-right"
          style={{ top: `${top}px` }}
          ref="rightDrag"
        />
        <div
          class="line-vertical"
          style={{ left: `${left}px` }}
          ref="verticalLine"
        />
        <div
          class="line-vertical-bottom"
          style={{ left: `${left}px` }}
          ref="bottomDrag"
        />
      </div>
    );
  },
  mounted() {
    const rightDrag = this.$refs.rightDrag;
    const bottomDrag = this.$refs.bottomDrag;
    rightDrag.addEventListener("mousedown", this.handleVerticalMousedown);
    document.addEventListener("mousemove", this.handleVerticalMousemove);
    document.addEventListener("mouseup", this.handleVerticalMouseup);

    bottomDrag.addEventListener("mousedown", this.handleHorizonMousedown);
    document.addEventListener("mousemove", this.handleHorizonMousemove);
    document.addEventListener("mouseup", this.handleHorizonMouseup);
  },
  methods: {
    handleVerticalMousedown(event) {
      this.dragStartY = event.y;
      this.dragStartTop = this.dragLineTop;
    },
    handleVerticalMousemove(event) {
      if (this.dragStartY === invalidDragFlag) return;
      const distance = event.y - this.dragStartY;
      const newDragLineTop = this.dragStartTop + distance;
      if (newDragLineTop < -1) {
        this.dragLineTop = -1;
      } else if (newDragLineTop - 1 > baseConfig.designHeight) {
        this.dragLineTop = baseConfig.designHeight + 1;
      } else {
        this.dragLineTop = newDragLineTop;
      }
    },
    handleVerticalMouseup(event) {
      // this.handleVerticalMousemove(event)
      this.dragStartY = invalidDragFlag;
    },
    handleHorizonMousedown(event) {
      this.dragStartX = event.x;
      this.dragStartLeft = this.dragLineLeft;
    },
    handleHorizonMousemove(event) {
      if (this.dragStartX === invalidDragFlag) return;
      const distance = event.x - this.dragStartX;
      const newDragLineLeft = this.dragStartLeft + distance;
      if (newDragLineLeft < -1) {
        this.dragLineLeft = -1;
      } else if (newDragLineLeft - 1 > baseConfig.designWidth) {
        this.dragLineLeft = baseConfig.designWidth + 1;
      } else {
        this.dragLineLeft = newDragLineLeft;
      }
    },
    handleHorizonMouseup(event) {
      // this.handleHorizonMousemove(event)
      this.dragStartX = invalidDragFlag;
    },
    renderCell(h, item) {
      return h(`${item.type}`, {
        props: {
          ...item.props,
          designMode: true,
          noAnimation: true,
          id: item.id,
          onClickCell: (id) => {
            const item = this.demoCells.find((item) => item.id === id);
            if (item) {
              const rootComponent = this.$parent;
              rootComponent.$refs.treeContainer.selectedIndex =
                rootComponent.treeData.indexOf(item);
              rootComponent.handleClickCell(item);
            }
          },
        },
        ref: item.id,
      });
    },
    renderEditWindow(h) {
      if (!this.onSelectCell || !this.showEditWindow) return "";
      // console.log('this.onSelectCell.props locked', this?.onSelectCell?.props?.locked)
      const position = this.onSelectCell.props.position;
      const left = (baseConfig.designWidth * (position.left || 0)) / 100;
      const top = (baseConfig.designHeight * (position.top || 0)) / 100;
      const style = {
        top: `0`,
        left: `0`,
        "pointer-events": `${
          this?.onSelectCell?.props?.locked ? "none" : "auto"
        }`,
      };
      return (
        <vue-draggable-resizable
          style={style}
          class="vue-draggable"
          props={{
            onResize: this.handleResize,
            onDrag: this.handleDrag,
          }}
          w={this.editWidth}
          h={this.editHeight}
          x={left}
          y={top}
          on={{ dragstop: this.handleDragStop }}
        ></vue-draggable-resizable>
      );
    },
    handleResize(handle, x, y, width, height) {
      if (!this.onSelectCell.props.position)
        this.$set(this.onSelectCell.props, "position", {});
      const position = this.onSelectCell.props.position;
      this.$set(
        position,
        "top",
        Math.round((y / baseConfig.designHeight) * 10000) / 100
      );
      this.$set(
        position,
        "left",
        Math.round((x / baseConfig.designWidth) * 10000) / 100
      );
      this.$set(
        position,
        "width",
        Math.round((width / baseConfig.designWidth) * 10000) / 100
      );
      this.$set(
        position,
        "height",
        Math.round((height / baseConfig.designHeight) * 10000) / 100
      );
      const heightPx = (position.height * baseConfig.designHeight) / 100;
      this.$set(
        position,
        "bottom",
        Math.round(
          ((baseConfig.designHeight - heightPx - y) / baseConfig.designHeight) *
            10000
        ) / 100
      );
    },
    handleDrag(x, y) {
      if (!this.onSelectCell.props.position)
        this.$set(this.onSelectCell.props, "position", {});
      const position = this.onSelectCell.props.position;
      this.$set(
        position,
        "top",
        Math.round((y / baseConfig.designHeight) * 10000) / 100
      );
      this.$set(
        position,
        "left",
        Math.round((x / baseConfig.designWidth) * 10000) / 100
      );
      const heightPx = (position.height * baseConfig.designHeight) / 100;
      this.$set(
        position,
        "bottom",
        Math.round(
          ((baseConfig.designHeight - heightPx - y) / baseConfig.designHeight) *
            10000
        ) / 100
      );
    },
    handleDragStop(x, y) {
      const horizonEle = this.$refs.horizonLine;
      const verticalEle = this.$refs.verticalLine;
      const designContainer = this.$refs.designContainer;
      const rectH = horizonEle.getBoundingClientRect();
      const rectV = verticalEle.getBoundingClientRect();
      const rectContainer = designContainer.getBoundingClientRect();
      const lineLeft = rectV.x - rectContainer.x;
      const lineRight = rectH.y - rectContainer.y;
      let newX = x;
      let newY = y;
      if (Math.abs(lineLeft - x) < 4) {
        newX = lineLeft;
      }
      if (Math.abs(lineRight - y) < 4) {
        newY = lineRight;
      }
      if (newX !== x || newY !== y) {
        this.handleDrag(newX, newY);
      }
    },
  },
  computed: {
    demoCells() {
      return this.demoPageData && this.demoPageData.cells
        ? this.demoPageData.cells
        : [];
    },
  },
  watch: {
    "onSelectCell.props.position"(val) {
      if (val && !this.onSelectCell.props.hideInDesign) {
        this.$nextTick((vm) => {
          const targetComponent = this.$refs[this.onSelectCell.id];
          if (!targetComponent) {
            console.error(
              "onSelectCell targetComponent 未绑定",
              this.onSelectCell.id
            );
            return 200;
          }
          this.editWidth = targetComponent.$refs.targetDom.clientWidth;
          this.editHeight = targetComponent.$refs.targetDom.clientHeight;
          this.showEditWindow = true;
        });
      }
      this.showEditWindow = false;
    },
    "onSelectCell.props.position.height": {
      handler(val) {
        if (!this.onSelectCell) return;
        const targetComponent = this.$refs[this.onSelectCell.id];
        if (targetComponent) {
          this.$nextTick(() => {
            const height = targetComponent.$refs.targetDom.clientHeight;
            this.editHeight !== height && (this.editHeight = height);
          });
        }
      },
    },
    "onSelectCell.props.position.width": {
      handler(val) {
        if (!this.onSelectCell) return;
        const targetComponent = this.$refs[this.onSelectCell.id];
        if (targetComponent) {
          this.$nextTick(() => {
            const width = targetComponent.$refs.targetDom.clientWidth;
            this.editWidth !== width && (this.editWidth = width);
          });
        }
      },
    },
  },
  beforeDestroy() {
    const rightDrag = this.$refs.rightDrag;
    const bottomDrag = this.$refs.bottomDrag;
    rightDrag.removeEventListener("mousedown", this.handleVerticalMousedown);
    document.removeEventListener("mousemove", this.handleVerticalMousemove);
    document.removeEventListener("mouseup", this.handleVerticalMouseup);

    bottomDrag.removeEventListener("mousedown", this.handleHorizonMousedown);
    document.removeEventListener("mousemove", this.handleHorizonMousemove);
    document.removeEventListener("mouseup", this.handleHorizonMouseup);
  },
};
</script>

<style lang="scss" scoped>
$alias-point-left-length: 81;
$alias-point-top-length: 51;
.design-root-container {
  position: relative;
  overflow: visible;
  margin-bottom: 40px;

  .point-container {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    pointer-events: none;

    .point-top {
      position: absolute;
      transform: translateX(-50%);
      width: 1px;
      background: black;

      &:after {
        position: absolute;
        top: -15px;
        left: 50%;
        font-size: 2px;
        transform: translateX(-50%);
        margin-bottom: 10px;
      }
    }

    .point-top:nth-child(even) {
      height: 14px;
      top: -14px;
    }

    .point-top:nth-child(odd) {
      height: 5px;
      top: -5px;
    }

    @for $ii from 1 through ($alias-point-top-length) {
      .point-top:nth-child(#{$ii}) {
        left: (100/ (($alias-point-top-length)-1)) * (($ii)-1) * 1%;

        &:after {
          content: if($ii%2==1, (""+ (($ii)-1)), "");
        }
      }
    }

    .point-left {
      position: absolute;
      transform: translateY(-50%);
      height: 1px;
      background: black;

      &:after {
        position: absolute;
        top: 50%;
        left: -15px;
        font-size: 2px;
        transform: translateY(-50%);
        margin-bottom: 10px;
      }
    }

    .point-left:nth-child(even) {
      left: -5px;
      width: 5px;
    }

    .point-left:nth-child(odd) {
      left: -14px;
      width: 14px;
    }

    @for $i
      from ($alias-point-top-length + 1)
      through ($alias-point-left-length + $alias-point-top-length)
    {
      .point-left:nth-child(#{$i}) {
        top: (100/ (($alias-point-left-length)-1)) *
          (($i)-($alias-point-top-length)-1) *
          1%;

        &:after {
          content: if($i%2==0, (""+ (($i)-($alias-point-top-length)-1)), "");
        }
      }
    }
  }

  .demo-container-body {
    width: 100%;
    height: 100%;
    position: relative;
    box-sizing: content-box;
    border-radius: 25px;
    /*border: 1px solid black;*/
    overflow: visible;

    .vue-draggable {
      border: 1.5px dashed #000;
      /*transform:scale(2,2.5);*/
    }
  }

  .border-body {
    border-radius: 25px;
    box-sizing: border-box;
    border: 1px solid black;
    position: absolute;
    top: -1px;
    right: -1px;
    left: -1px;
    bottom: -1px;
    pointer-events: none;
  }

  .line-vertical {
    position: absolute;
    width: 1px;
    background: black;
    top: 0;
    bottom: -1px;
    user-select: none;
    pointer-events: none;
  }

  .line-vertical-top {
    position: absolute;
    top: -16px;
    transform: translateX(-50%);
    border-left: 8px solid transparent;
    border-bottom: 16px solid red;
    border-right: 8px solid transparent;
    cursor: grab;
  }

  .line-vertical-bottom {
    transform: translateX(-50%);
    left: -16.2px;
    position: absolute;
    bottom: -13px;
    cursor: grab;
    background: transparent;
    border-radius: 50%;
    width: 12px;
    height: 12px;
    border: 4px solid #666666;
    box-sizing: border-box;
  }

  .line-horizon {
    position: absolute;
    height: 1px;
    background: black;
    left: 0;
    right: -2px;
    user-select: none;
    pointer-events: none;
  }

  .line-horizon-left {
    position: absolute;
    left: -16.2px;
    transform: translateY(-50%);
    border-top: 8px solid transparent;
    border-right: 16px solid red;
    border-bottom: 8px solid transparent;
    cursor: grab;
  }

  .line-horizon-right {
    position: absolute;
    right: -13px;
    cursor: grab;
    background: transparent;
    border-radius: 50%;
    width: 12px;
    height: 12px;
    transform: translate(0, -50%);
    border: 4px solid #666666;
    box-sizing: border-box;
  }
}
</style>
