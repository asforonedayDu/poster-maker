import setting from "@/setting";

export default ({request, tools}) => ({
  /**
   * @description 获取素材库资源
   */
  async GET_COMMON_ASSETS() {
    // 接口请求
    return await request({
      url: setting.api_prefix + 'queryAllPicAssets',
      method: 'get',
      params: {}
    })
  },
  /**
   * @description 保存上传后的图片到数据库
   */
  async SAVE_ASSETS(asset_name, asset_content) {
    // 接口请求
    return await request({
      url: setting.api_prefix + 'addAsset',
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
