export default {
  methods: {
    rInputText(h, config) {
      return (
        <div class="input-main">
          <span>修改文字内容:</span>
          <el-input vModel={this.configProps[config.propKey]} placeholder="请输入内容"/>
        </div>
      )
    },
    rVerticalDirection(h, config) {
      return (
        <div>
          <span>文字方向:  </span>
          <el-radio-group vModel={this.configProps[config.propKey]}>
            <el-radio label={false}>水平方向</el-radio>
            <el-radio label={true}>竖直方向</el-radio>
          </el-radio-group>
        </div>
      )
    },
    rBackground(h, config) {
      return (
        <div class="input-main">
          <span>背景颜色(rgba|16进制|颜色单词):</span>
          <div class="inline-content">
            <el-button class="button-front" on-click={() => {
              this.showBackgroundColorPick = !this.showBackgroundColorPick
            }}>开关颜色面板
            </el-button>
            <el-input class="input-right" vModel={this.configProps[config.propKey]} placeholder=""/>
          </div>
          {this.showBackgroundColorPick &&
          <div>
            <color-pick vModel={this.configProps[config.propKey]} color-format="rgb" show={true}/>
          </div>}
        </div>
      )
    },
    rBackgroundImage(h, config) {
      return (
        <div class="input-main">
          <span>背景图片(图片链接):</span>
          <div class="inline-content">
            <el-button class="button-front" on-click={() => {
              this.showAssetsWindow = true
            }}>打开素材库
            </el-button>
            <el-input class="input-right" vModel={this.configProps[config.propKey]} placeholder="图片链接"/>
          </div>
        </div>
      )
    },
    rColor(h, config) {
      return (
        <div class="input-main">
          <span>文字颜色(rgba|16进制|颜色单词):</span>
          <div class="inline-content">
            <el-button class="button-front" on-click={() => {
              this.showTextColorPick = !this.showTextColorPick
            }}>开关颜色面板
            </el-button>
            <el-input class="input-right" vModel={this.configProps[config.propKey]} placeholder=""/>
          </div>
          {this.showTextColorPick &&
          <div>
            <color-pick vModel={this.configProps[config.propKey]} color-format="rgb" show={true}/>
          </div>}
        </div>
      )
    },
    rFontsize(h, config) {
      return (
        <div class="input-main">
          <span>字体大小(基于屏幕宽度百分比 数字):</span>
          <el-input vModel={this.configProps[config.propKey]} placeholder="基于屏幕宽度百分比"/>
        </div>
      )
    },
    rAnimationActions(h, config) {
      const actions = this.onSelectCell.props.animationActions
      return (
        <div class="input-main">
          <span style={{display: 'inline-block'}}>当前动画列表，多个动画依次生效:(点击编辑)</span>
          <div class="inline-content">
            {actions && actions.map((animationDetail, index) => {
              return (
                <el-tag style={{cursor: 'pointer'}} key={index} closable={true} vOn:close={() => {
                  this.handlerAnimationDelete(index)
                }} vOn:click={() => this.editAnimationDetail(index)}>
                  {animationDetail.name}
                </el-tag>)
            })}
          </div>
          <el-button onClick={() => this.addAnimation()}>添加动画</el-button>
        </div>
      )
    },
    rHideAfterAnimation(h, config) {
      return (
        <div>
          <span>
            动画结束几秒后隐藏(负数则不处理,无动画也生效):
              <el-input className="input-right" vModel={this.configProps[config.propKey]} placeholder="0"/>
          </span>
        </div>
      )
    },
    rFlexHeight(h, config) {
      return (
        <div>
          <span>高度随屏幕拉伸(宽高比不固定): </span>
          <el-radio-group vModel={this.configProps[config.propKey]}>
            <el-radio label={true}>是</el-radio>
            <el-radio label={false}>否</el-radio>
          </el-radio-group>
        </div>
      )
    },
  }
}
