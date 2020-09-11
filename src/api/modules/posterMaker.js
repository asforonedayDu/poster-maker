import setting from "@/setting";
import jsonp from 'jsonp'

export default ({request, tools}) => ({
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
