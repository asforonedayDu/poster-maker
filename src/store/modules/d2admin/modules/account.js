import {Message, MessageBox} from 'element-ui'
import util from '@/libs/util.js'
import router from '@/router'
import api from '@/api'
import {setToken, removeToken} from '@/libs/auth'

export default {
  namespaced: true,
  state: {
    // 初次加载 从token获取用户信息后请求服务器验证
    hasCheckLogin: false
  },
  actions: {
    /**
     * @description 登录
     * @param {Object} context
     * @param {Object} payload username {String} 用户账号
     * @param {Object} payload password {String} 密码
     * @param {Object} payload route {Object} 登录成功后定向的路由对象 任何 vue-router 支持的格式
     */
    async login({dispatch, state}, {
      username = '',
      password = '',
      verifyCode,
      loginType = 0,
      code = '',
      encryptedDate = '',
      iv = '',
      openid = '',
      headurl = '',
      socketKey = '',
    } = {}) {
      const res = await api.SYS_USER_LOGIN({
        username,
        password,
        // password: window.btoa(password),
        verifyCode,
        loginType,
        code,
        encryptedDate,
        iv,
        openid,
        headurl,
        socketKey
      })
      // 设置 cookie 一定要存 uuid 和 token 两个 cookie
      // 整个系统依赖这两个数据进行校验和存储
      // uuid 是用户身份唯一标识 用户注册的时候确定 并且不可改变 不可重复
      // token 代表用户当前登录状态 建议在网络请求中携带 token
      // 如有必要 token 需要定时更新，默认保存一天
      // util.cookies.set('uuid', res.uuid)
      util.cookies.set('uuid', res.token)
      util.cookies.set('token', res.token)
      util.cookies.set('username', username)
      setToken(res.token)
      // 设置 vuex 用户信息
      await dispatch('d2admin/user/set', {name: username}, {root: true})
      // 用户登录后从持久化数据加载一系列的设置
      await dispatch('load')
      state.hasCheckLogin = true
      return true
    },

    /**
     * @description 初次从缓存登录验证登录状态
     */
    async checkLogin({dispatch, state}, {
      username = '',
      token = ''
    } = {}) {
      if (state.hasCheckLogin) {
        return true
      }
      const res = await api.SYS_USER_CHECK_LOGIN({username, token})
      if (res.status !== 'ok') {
        return false
      }
      // 设置 cookie 一定要存 uuid 和 token 两个 cookie
      // 整个系统依赖这两个数据进行校验和存储
      // uuid 是用户身份唯一标识 用户注册的时候确定 并且不可改变 不可重复
      // token 代表用户当前登录状态 建议在网络请求中携带 token
      // 如有必要 token 需要定时更新，默认保存一天
      util.cookies.set('uuid', res.uuid)
      util.cookies.set('token', res.token)
      util.cookies.set('username', username)
      // 设置 vuex 用户信息
      await dispatch('d2admin/user/set', {name: username}, {root: true})
      // 用户登录后从持久化数据加载一系列的设置
      await dispatch('load')
      state.hasCheckLogin = true
      return true
    },

    /**
     * @description 注销用户并返回登录页面
     * @param {Object} context
     * @param {Object} payload confirm {Boolean} 是否需要确认
     */
    logout({commit, dispatch}, {confirm = false} = {}) {
      /**
       * @description 注销
       */
      async function logout() {
        // 删除cookie
        util.cookies.remove('token')
        util.cookies.remove('uuid')
        removeToken()
        // 清空 vuex 用户信息
        await dispatch('d2admin/user/set', {}, {root: true})
        // 跳转路由
        router.push({name: 'login'})
      }

      // 判断是否需要确认
      if (confirm) {
        commit('d2admin/gray/set', true, {root: true})
        MessageBox.confirm('确定要注销当前用户吗', '注销用户', {type: 'warning'})
        .then(() => {
          commit('d2admin/gray/set', false, {root: true})
          logout()
        })
        .catch(() => {
          commit('d2admin/gray/set', false, {root: true})
          Message({message: '取消注销操作'})
        })
      } else {
        logout()
      }
    },
    /**
     * @description 用户登录后从持久化数据加载一系列的设置
     * @param {Object} context
     */
    async load({dispatch}) {
      // 加载用户名
      await dispatch('d2admin/user/load', null, {root: true})
      // // 加载主题
      // await dispatch('d2admin/theme/load', null, {root: true})
      // 加载页面过渡效果设置
      await dispatch('d2admin/transition/load', null, {root: true})
    }
  }
}
