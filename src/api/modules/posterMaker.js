import setting from "@/setting";
import jsonp from 'jsonp'

export default ({request, tools}) => ({
  /**
   * @description 获取海报库资源
   */
  async GET_POSTER_LIST() {
    // 接口请求
    return await request({
      url: setting.node_server + 'queryAllPoster',
      method: 'get',
      params: {}
    })
  },
  /**
   * @description 删除海报
   */
  async DELETE_POSTER_LIST(poster_id) {
    // 接口请求
    return await request({
      url: setting.node_server + 'removePoster',
      method: 'get',
      params: {
        poster_id
      }
    })
  },
  /**
   * @description 更新现有海报
   */
  async UPDATE_POSTER(params) {
    // 接口请求
    return await request({
      url: setting.node_server + 'alterPoster',
      method: 'post',
      data: params
    })
  },
  /**
   * @description 新建海报
   */
  async CREATE_POSTER(data) {
    // 接口请求
    return await request({
      url: setting.node_server + 'addPosterData',
      method: 'post',
      data
    })
  },
  /**
   * @description 获取素材库资源
   */
  async GET_COMMON_ASSETS() {
    // return new Promise((resolve, reject) => {
    //   jsonp(setting.node_server + 'queryAllPicAssets', {}, (result) => {
    //     resolve(result.data)
    //   })
    // })
    // 接口请求
    return await request({
      url: setting.node_server + 'queryAllPicAssets',
      method: 'get',
      params: {}
    })
  },
  /**
   * @description 删除素材库资源
   */
  async DELETE_COMMON_ASSETS(id) {
    // 接口请求
    return await request({
      url: setting.node_server + 'removeAsset',
      method: 'get',
      params: {
        asset_id: id
      }
    })
  },
  /**
   * @description 保存上传后的图片到数据库
   */
  async SAVE_ASSETS(asset_name, asset_content) {
    // 接口请求
    return await request({
      url: setting.node_server + 'addAsset',
      method: 'get',
      params: {
        create_user_id: 1,
        asset_name,
        asset_type: 1,
        asset_content,
      }
    })
  },
})
