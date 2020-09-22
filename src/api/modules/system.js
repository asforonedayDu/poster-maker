import { request } from '@/api/service'
import setting from '@/setting'

async function get_poster_detail(poster_id) {
  // 接口请求
  return await request({
    url: setting.node_server + 'queryPosterDetail',
    method: 'get',
    params: {poster_id}
  })
}

export { get_poster_detail }

export default ({ request, tools }) => ({})
