import cookies from './util.cookies'
import db from './util.db'
import log from './util.log'

const util = {
  cookies,
  db,
  log
}
//检测是否是iphone
util.checkIsIphone = function checkIsIphone() {
  return /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())

}

//检测是否是安卓
util.checkIsAndroid = function checkIsAndroid() {
  return /android/.test(navigator.userAgent.toLowerCase())
}
/**
 * 获取当前时间
 * @returns {string}
 */
util.getNowFormatDate = function getNowFormatDate() {
  const date = new Date()
  const seperator1 = '-'
  const seperator2 = ':'
  let month = date.getMonth() + 1
  let strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  return date.getFullYear() + seperator1 + month + seperator1 + strDate
    + ' ' + date.getHours() + seperator2 + date.getMinutes()
    + seperator2 + date.getSeconds()
}
/**
 * @description 更新标题
 * @param {String} title 标题
 */
util.title = function (titleText) {
  const processTitle = process.env.VUE_APP_TITLE || ''
  window.document.title = `${processTitle}${titleText ? `${titleText}` : ''}`
}

/**
 * @description 打开新页面
 * @param {String} url 地址
 */
util.open = function (url, new_page = true) {
  var a = document.createElement('a')
  a.setAttribute('href', url)
  if (new_page) a.setAttribute('target', '_blank')
  a.setAttribute('id', 'd2admin-link-temp')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(document.getElementById('d2admin-link-temp'))
}

export default util
