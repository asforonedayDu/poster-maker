import { request, requestWithCookieToken } from '@/api/service'
import setting from '@/setting'

const uploadImage = function (data) {
  const options = {
    url: setting.api_prefix + 'post_upload_image.php',
    method: 'post',
    headers: {
      dataType: 'json',
      processData: false,
      contentType: false,
      timeout: 30000,
      mimeType: 'multipart/form-data'
    },
    data: data,
  }
  return request(options)
}
export {
  uploadImage
}

export default ({ request, tools }) => ({
  /**
   * @description 请求项目中的文件
   * @param {String} url 文件地址
   */
  FILE_GET (url = '') {
    return request({
      baseURL: process.env.BASE_URL,
      url,
      method: 'get'
    })
  }
})
