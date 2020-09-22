// Vue
import Vue from 'vue'
// import i18n from './i18n'
import App from './index'
import pluginApi from '@/plugin/api'

// 从公共库里面获取组件
import './load-public-components'

Vue.use(pluginApi)
new Vue({
  // i18n,
  render: h => h(App),
  created() {
  },
}).$mount('#app')
