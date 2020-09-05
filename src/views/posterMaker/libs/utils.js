const util = {}
util.getAnimationList = function () {
  try {
    return ANIMATE_LIST
  } catch (e) {
    console.log('未定义 ANIMATE_LIST')
    return []
  }
}

export default util
