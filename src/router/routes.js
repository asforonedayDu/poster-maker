import {resolveComponentPath} from "@/libs/util.import";

/**
 * 在主框架内显示
 */
const frameIn = [
  // 开发者用到的路由配置
  {
    path: '/',
    meta: {},
    redirect: {name: 'home'},
    component: resolveComponentPath('layout/default/index.js'),
    // 在这里添加子路由 导航到多个开发者界面
    children: [
      {
        path: '/index',
        name: 'home',
        meta: {
          title: '首页',
          auth: false
        },
        component: resolveComponentPath('system/index')
      },
      {
        path: '/editor',
        name: 'editor',
        meta: {
          title: '富文本编辑',
          auth: false
        },
        component: resolveComponentPath('editor')
      },
      {
        path: '/posterCenter',
        name: 'posterCenter',
        meta: {
          title: '海报中心',
          auth: false
        },
        component: resolveComponentPath('posterCenter')
      },
      {
        path: '/posterShow',
        name: 'posterShow',
        meta: {
          title: '展示页',
          auth: false
        },
        component: resolveComponentPath('posterShow')
      },
      {
        path: '/posterMaker',
        name: 'posterMaker',
        meta: {
          title: '海报制作',
          auth: false
        },
        component: resolveComponentPath('posterMaker')
      },
      {
        path: '/mouseWheelSpeed',
        name: 'mouseWheelSpeed',
        meta: {
          title: 'mouseWheelSpeed',
          auth: false
        },
        component: resolveComponentPath('mouseWheelSpeed')
      },
    ]
  }
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: resolveComponentPath('system/login')
  },
  // 系统 前端日志
  {
    path: '/log',
    name: 'log',
    meta: {
      title: '前端日志',
      auth: true
    },
    component: resolveComponentPath('system/log')
  },
  // 刷新页面 必须保留
  {
    path: '/refresh',
    name: 'refresh',
    hidden: true,
    component: resolveComponentPath('system/function/refresh')
  },
  // // 页面重定向
  // {
  //     path: '/redirect/:route*',
  //     name: 'redirect',
  //     hidden: true,
  //     component: resolveComponentPath('system/function/redirect')
  // }
]

/**
 * 错误页面
 */
const errorPage = [
  {
    path: '*',
    name: '404',
    component: resolveComponentPath('system/error/404')
  }
]

// 导出需要显示的菜单
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
