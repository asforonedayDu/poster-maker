import Vue from 'vue'
import VueRouter from 'vue-router'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import store from '@/store/index'
import util from '@/libs/util.js'
import {getToken} from '@/libs/auth'

// 路由数据
import routes from './routes'

// fix vue-router NavigationDuplicated
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return VueRouterPush.call(this, location).catch(err => err)
}
const VueRouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(location) {
  return VueRouterReplace.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
const router = new VueRouter({
  routes,
  base: '/company/',
})

/**
 * 路由拦截
 * 权限验证
 */
let routingFlag = false
router.beforeEach(async (to, from, next) => {
  // 确认已经获取了多语言数据
  // await store.dispatch('system/lang/isLoaded')
  // 进度条
  routingFlag = true
  setTimeout(() => {
    if (routingFlag) NProgress.start()
  }, 500)
  // 判断是否需要验证登录 未登录跳转404
  if (to.meta.auth) {
    const token = getToken()
    // const username = util.cookies.get('username')
    // 这里暂时将cookie里是否存有token作为验证是否登录的条件
    // 请根据自身业务需要修改
    if (token && token !== 'undefined') {
      // const checkLogin = await store.dispatch('d2admin/account/checkLogin', {token, username})
      // if (checkLogin) {}
      next()
    } else {
      next({
        name: '404',
      })
    }
  } else {
    next()
  }
})

router.afterEach(to => {
  console.log('after each', to.name, to.fullPath)
  // 进度条
  routingFlag = false
  NProgress.done()
  // 更改标题
  util.title(to.meta.title)
})

export default router
