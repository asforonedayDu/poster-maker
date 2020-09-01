import setting from "@/setting";

export default ({request, tools}) => ({
  /**
   * @description
   * @param data
   */
  async QUERY_WORD_INFO(params) {
    // 接口请求
    return await request({
      url: setting.api_prefix + '/wordMaker_query_word_pos.php',
      method: 'get',
      query: params,
    })
  },
})
