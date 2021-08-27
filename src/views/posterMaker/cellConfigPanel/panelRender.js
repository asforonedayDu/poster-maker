import {basicFontFamily} from '../libs/static'

export default {
  data() {
    return {
      showBorderColorPick: false,
    }
  },
  methods: {
    rInputText(h, config) {
      return (
        <div class="input-main">
          <span>修改文字内容:</span>
          <el-input vModel={this.configProps[config.propKey]} placeholder="请输入内容"/>
        </div>
      )
    },
    rBorder(h, config) {
      const defaultConfig = this.configProps[config.propKey].default //目前不支持单独配置各个边框
      const styles = ['solid', 'dotted', 'double', 'dashed']
      return (
        <div class="input-main">
          <el-form vModel={defaultConfig} label-width="100px" style="width: 400px">
            <el-form-item label="边框宽度">
              <el-input vModel={defaultConfig.width} placeholder="数字"/>
            </el-form-item>
            <el-form-item label="边框样式">
              <el-select vModel={defaultConfig.style} class="el-select-font"
                         placeholder={`${defaultConfig.style ? defaultConfig.style : 'solid'}`}>
                {styles.map((style, index) => {
                  return (
                    <el-option key={index} label={style}
                               value={`${style}`}>
                    </el-option>
                  )
                })}
              </el-select>
            </el-form-item>

            <el-form-item label="边框颜色">
              <el-input class="input-right" vModel={defaultConfig.color} on-focus={() => {
                this.showBorderColorPick = true
              }}/>
            </el-form-item>
            <div>
              {this.showBorderColorPick &&
              <color-pick style={{width: '340px'}} vModel={defaultConfig.color} color-format="rgba"
                          show={this.showBorderColorPick}/>}
            </div>
          </el-form>
        </div>
      )
    },
    rVerticalDirection(h, config) {
      return (
        <div>
          <span>文字方向:  </span>
          <el-radio-group vModel={this.configProps[config.propKey]}>
            <el-radio class="radio-label-body" label={false}>水平方向</el-radio>
            <el-radio class="radio-label-body" label={true}>竖直方向</el-radio>
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
    rFontFamily(h, config) {
      const fonts = basicFontFamily.concat(this.allFontList || [])
      return (
        <div class="input-main">
          <span>选择字体:</span>
          <el-button class="button-front" on-click={() => {
            this.showFontsWindow = true
          }}>打开字体管理库
          </el-button>
          <el-select vModel={this.configProps[config.propKey]} class="el-select-font"
                     placeholder={`${this.configProps[config.propKey] ? this.configProps[config.propKey] : '选择字体'}`}>
            {fonts.map((font, index) => {
              let indeed = font
              if (font.asset_content) {
                indeed = JSON.parse(font.asset_content)
              }
              return (
                <el-option key={index} label={font.asset_name}
                           value={`${indeed.fontFamily}${indeed.url ? `|${indeed.url}` : ''}`}>
                </el-option>
              )
            })}
          </el-select>
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
        <div class="input-main">
          <span>
            动画结束几秒后隐藏(负数则不处理,无动画也生效):
          </span>
          <el-input class="input-right" vModel={this.configProps[config.propKey]} placeholder="0"/>

        </div>
      )
    },
    rFlexHeight(h, config) {
      return (
        <div class="input-main">
          <span>高度随屏幕拉伸(宽高比不固定): </span>
          <el-radio-group vModel={this.configProps[config.propKey]}>
            <el-radio class="radio-label-body" label={true}>是(保证相对位置，图片可能会显示不完整)</el-radio>
            <el-radio class="radio-label-body" label={false}>否(保证图片显示完整，位置取决于竖向适配模式)</el-radio>
          </el-radio-group>
        </div>
      )
    },
    rJustifyContentType(h, config) {
      return (
        <div class="input-main">
          <span>元素竖向位置适配模式（高度<strong>不</strong>随屏幕拉伸时生效）: </span>
          <span>（不同尺寸屏幕下按照哪个标准确定）:</span>
          <el-radio-group vModel={this.configProps[config.propKey]}>
            <el-radio class="radio-label-body" label={'start'}>元素顶部离屏幕顶部百分比</el-radio>
            <el-radio class="radio-label-body" label={'mid'}>按照设计比例居中(长屏幕时偏中)</el-radio>
            <el-radio class="radio-label-body" label={'end'}>元素底部离屏幕底部百分比</el-radio>
          </el-radio-group>
        </div>
      )
    },
  }
}
