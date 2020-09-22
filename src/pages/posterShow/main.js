// Vue
import Vue from 'vue'
import posterShow from './index'

// 从公共库里面获取组件
import './load-public-components'

new Vue({
  render: h => h(posterShow),
}).$mount('#app')


