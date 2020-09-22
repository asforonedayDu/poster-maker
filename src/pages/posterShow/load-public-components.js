import Vue from 'vue'

// 全局 Toast 组件
import Toast from '@/components/common/toast/index.js'

// Element
// import element from 'element-ui'
// Vue.use(element)
// import {
//   Button,
//   ButtonGroup,
//   Checkbox,
//   CheckboxButton,
//   CheckboxGroup,
//   // Form,
//   // FormItem,
//   // Card,
//   Message,
//   MessageBox,
//   Input,
//   // Dialog,
//   Row,
//   Radio,
//   RadioButton,
//   RadioGroup,
//   Switch,
//   InputNumber,
//   Pagination,
//   Col,
//   // Container,
//   // Aside,
//   // Header,
//   // Main,
//   Notification
// } from 'element-ui'

/**
 * 定义全局组件
 *
 * @type {{installed: boolean, install: dynamicLoadComponents.install}}
 */
const dynamicLoadComponents = {
  installed: false,
  install: function () {
    if (dynamicLoadComponents.installed) {
      return false
    }
    dynamicLoadComponents.installed = true
    _needComponents.filter(component => {
      Vue.component(component.name, () => import('@/components/' + component.path))
      return true
    })
  }
}
// 在这里配置项目需要公共引用的组件
const _needComponents = [
  // {
  //   name: 'color-pick',
  //   path: 'color-pick'
  // },
]

Vue.use(dynamicLoadComponents)
// Vue.component(Button.name, Button)
// Vue.component(ButtonGroup.name, ButtonGroup)
// Vue.component(Input.name, Input)
// Vue.component(Checkbox.name, Checkbox)
// Vue.component(CheckboxButton.name, CheckboxButton)
// Vue.component(CheckboxGroup.name, CheckboxGroup)
// Vue.component(Row.name, Row)
// Vue.component(Radio.name, Radio)
// Vue.component(RadioButton.name, RadioButton)
// Vue.component(RadioGroup.name, RadioGroup)
// Vue.component(Switch.name, Switch)
// Vue.component(InputNumber.name, InputNumber)
// Vue.component(Pagination.name, Pagination)
// Vue.component(Col.name, Col)
// Vue.component(Notification.name, Notification)
// Vue.prototype.$message = Message
// Vue.prototype.$msgbox = MessageBox
Vue.prototype.$toast = Toast
