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

/**
 * @description 多维对象转一维数组
 */
export function flattenObj({targetObj, childrenKey = 'children', level = 0, position = [], parentId = -1, namePath = ''}) {
  let result = []
  let target = targetObj instanceof Array ? targetObj : [targetObj]
  let i = 0
  target.forEach(item => {
    let children
    if (item[childrenKey] && item[childrenKey].length > 0) {
      children = item[childrenKey]
      // delete item[childrenKey]
    }
    item.$level = level
    item.$position = position.concat([i])
    item.$hasChild = !!children
    item.$parentId = parentId
    item.$namePath = namePath
    result.push(item)
    if (children) {
      result = result.concat(flattenObj({
        targetObj: children,
        childrenKey,
        level: level + 1,
        position: item.$position,
        parentId: item.id,
        namePath: (namePath ? (namePath + '/') : '') + item.name
      }))
    }
    i += 1
  })
  return result
}

/**
 * 删除多维数组中特定位置的数据
 * target 目标多维数据  每个对象的children是下一维数组
 * position 例如[1] 表示要删除第一维数组中的第二个对象 [1,3]表示要删除第一维数组中的第二个数组的第四个对象
 */
export function removeItem(target = [], position = []) {
  if (target.length - 1 < position[0]) {
    throw new Error('需要删除的数据位置超出数组下标')
  }
  // 触发删除的临界条件
  if (position.length === 1) {
    return target.splice(position[0], 1)
  }
  const childTarget = target[position[0]].children
  position.splice(0, 1)
  return removeItem(childTarget, position)
}


/**
 * @description 鼠标事件
 */
export const mouseEvent = ('ontouchstart' in window) ?
  {
    down: 'touchstart',
    move: 'touchmove',
    up: 'touchend',
    over: 'touchstart',
    out: 'touchend'
  }
  :
  {
    down: 'mousedown',
    move: 'mousemove',
    up: 'mouseup',
    over: 'mouseover',
    out: 'mouseout'
  }


/**
 * @description 阻止鼠标冒泡事件
 * @param {MouseEvent} e MouseEvent事件
 */
export function stopMouseEventPop(e) {
  e = e || window.event;
  if (e.stopPropagation) { //W3C阻止冒泡方法
    e.stopPropagation();
  } else {
    e.cancelBubble = true; //IE阻止冒泡方法
  }
}


/**
 * @description 获取窗口可视高度
 */
export function getClientHeight() {
  let clientHeight = 0;
  if (document.body.clientHeight && document.documentElement.clientHeight) {
    clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
  } else {
    clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
  }
  return clientHeight;
}

export default util
