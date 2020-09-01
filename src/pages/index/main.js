// Vue
import Vue from 'vue'
// import i18n from './i18n'
import App from './App'
// 核心插件
import d2Admin from '@/plugin/d2admin'
// store
import store from '@/store/index'

// 菜单和路由设置
import router from '@/router'

// 从公共库里面获取组件
import './load-public-components'
// 核心插件
Vue.use(d2Admin)


new Vue({
  router,
  store,
  // i18n,
  render: h => h(App),
  created() {
  },
  mounted() {
    // 用户登录后从数据库加载一系列的设置
    // this.$store.dispatch('d2admin/account/load'))
  },
  watch: {
    // 检测路由变化
    // '$route.matched': {
    //   handler (matched) {
    //   },
    //   immediate: true
    // }
  }
}).$mount('#app')
