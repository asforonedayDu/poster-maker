import { request } from '@/api/service'
import setting from '@/setting'

const getValidateUrl = function () {
  return '/login/verifyCode'
}

export { getValidateUrl}
export default ({ request, tools }) => ({
  /**
   * @description 获取验证码
   * @param phoneNumber
   */
  async GET_VALIDATE_CODE (phoneNumber = '') {
    // 接口请求
    return await request({
      url: setting.api_prefix + 'get_code.php',
      method: 'get',
      params: {
        type: 'verify',
        mobile: phoneNumber
      }
    })
  },
  /**
   * @description 登录
   * @param {Object} data 登录携带的信息
   */
  async SYS_USER_LOGIN (data = {}) {
    // 接口请求
    const result = await request({
      url: '/auth/login',
      method: 'post',
      data
    })
    return result.data
  },
  /**
   * @description 登录
   * @param {Object} data 登录携带的信息
   */
  async SYS_USER_CHECK_LOGIN (data = {}) {
    // 模拟数据
    // mock
    //   .onAny('/login')
    //   .reply(config => {
    //     const user = find(users, tools.parse(config.data))
    //     return user
    //       ? tools.responseSuccess(assign({}, user, { token: faker.random.uuid() }))
    //       : tools.responseError({}, '账号或密码不正确')
    //   })
    // 接口请求
    const result = await request({
      url: '/checkLogin',
      method: 'post',
      data
    })
    return result.data
  }
})
