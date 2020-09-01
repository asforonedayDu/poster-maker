import { request } from '@/api/service'
import setting from '@/setting'

function get_user_agreement_content (params = {}) {
  return request({
    method: 'GET',
    url: setting.api_prefix + 'get_user_agreement.php',
    params
  })
}

function get_privacy_policy_content (params = {}) {
  return request({
    method: 'GET',
    url: setting.api_prefix + 'get_privacy_policy.php',
    params
  })
}

function get_teenager_mode_content (params = {}) {
  return request({
    method: 'GET',
    url: setting.api_prefix + 'get_teenager_mode_content.php',
    params
  })
}

export { get_user_agreement_content, get_privacy_policy_content, get_teenager_mode_content }

export default ({ request, tools }) => ({})
