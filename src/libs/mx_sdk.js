const definition = function () {
  const Dream = function () {
    if (!(this instanceof Dream)) {
      return new Dream()
    }
    this.init()
  }
  Dream.prototype = {
    init: function () {
      const self = this

      // 注册事件监听
      function connectWebViewJavascriptBridge (callback) {
        console.log('init 1')
        if (window.WebViewJavascriptBridge) {
          console.log('if window.WebViewJavascriptBridge 1')
          callback(window.WebViewJavascriptBridge)
        } else {
          document.addEventListener(
            'WebViewJavascriptBridgeReady',
            function () {
              callback(window.WebViewJavascriptBridge)
            },
            false
          )
        }
        // if (window.WebViewJavascriptBridge) {
        //   return callback(window.WebViewJavascriptBridge)
        // }
        if (window.WVJBCallbacks) {
          console.log('if window.WVJBCallbacks 1')
          return window.WVJBCallbacks.push(callback)
        }
        console.log('window.WVJBCallbacks 1')
        window.WVJBCallbacks = [callback]
        var WVJBIframe = document.createElement('iframe')
        WVJBIframe.style.display = 'none'
        WVJBIframe.src = 'https://__bridge_loaded__'
        document.documentElement.appendChild(WVJBIframe)
        setTimeout(function () {
          document.documentElement.removeChild(WVJBIframe)
        }, 0)
      }

      // 注册回调函数，第一次连接时调用 初始化函数
      connectWebViewJavascriptBridge(function (bridge) {
        console.log('init function', this)
        bridge.init(function (message, responseCallback) {
          var data = {
            'Javascript Responds': 'Wee!'
          }
          responseCallback(data)
        })
        bridge.registerHandler('init', function (data, responseCallback) {
          var responseData = '我接受到了初始化的调用'
          self.callback && self.callback()
          responseCallback(responseData)
        })
        // 接收安卓发来的消息   并返回给安卓通知
        bridge.registerHandler('closeWebView', function (data, responseCallback) {
          var responseData = '我接受到了注册关闭事件的调用'
          self.registerHandler.closeWebView && self.registerHandler.closeWebView(data)
          responseCallback(responseData)
        })
        // 接收安卓发来的消息   并返回给安卓通知
        bridge.registerHandler('paySuccess', function (data, responseCallback) {
          var responseData = '我接受到了支付完成事件的调用'
          self.registerHandler.paySuccess && self.registerHandler.paySuccess(data)
          responseCallback(responseData)
        })
      })
    },
    registerHandler: {
      closeWebView: null,
      paySuccess: null
    },
    closeWebView (cb) {
      // 关闭页面注册回调
      this.registerHandler['closeWebView'] = cb
    },
    paySuccess (cb) {
      // 关闭页面注册回调
      this.registerHandler['paySuccess'] = cb
    },
    callback: null,
    ready: function (cb) {
      console.log(cb)
      console.log('init')
      this.callback = cb
    },
    // 检查app中
    isApp () {
      return !!window.WebViewJavascriptBridge
    },
    // 去支付
    pay () {
      try {
        window.WebViewJavascriptBridge.callHandler(
          'gotoNative', {
            type: 6,
            data: {
              liveid: ''
            }
          },
          function (responseData) {
            console.log(responseData)
          }
        )
      } catch (e) {
        console.log('充值-error:', e)
      }
    },
    // 使用微信支付
    wechatPay (amount) {
      try {
        window.WebViewJavascriptBridge.callHandler(
          'gotoNative', {
            type: 7,
            data: {
              amount: amount
            }
          },
          function (responseData) {
            console.log(responseData)
          }
        )
      } catch (e) {
        console.log('充值-error:', e)
      }
    },
    // 使用国付宝微信支付
    wechatGopay (amount) {
      try {
        window.WebViewJavascriptBridge.callHandler(
          'gotoNative', {
            type: 8,
            data: {
              amount: amount
            }
          },
          function (responseData) {
            console.log(responseData)
          }
        )
      } catch (e) {
        console.log('充值-error:', e)
      }
    },
    // 吊起客户端联系客服界面
    customerService () {
      try {
        window.WebViewJavascriptBridge.callHandler(
          'gotoNative', {
            type: 9,
            data: {}
          },
          function (responseData) {
            console.log(responseData)
          }
        )
      } catch (e) {
        console.log('吊起客服页面-error:', e)
      }
    },
    // 使用alipay支付 仅限Android使用。
    aliPay (amount) {
      try {
        window.WebViewJavascriptBridge.callHandler(
          'gotoNative', {
            type: 10,
            data: {
              amount: amount
            }
          },
          function (responseData) {
            console.log(responseData)
          }
        )
      } catch (e) {
        console.log('充值-error:', e)
      }
    },
    // 看直播
    /**
     * @param {
     * avatar 主播头像
     * liveid 直播id
     * anchorId 主播id
     * nickname 用户昵称
     * isPrivacy 是否付费 0免费 1付费
     * privacyId 付费id
     * liveK
     * liveIv
     * liveUrl
     * }
     * obj
     */
    watchLive ({
      cover,
      liveid,
      avatar,
      anchorId,
      nickname,
      isPrivacy,
      privacyId,
      liveK,
      liveIv,
      liveUrl,
      medal
    }) {
      try {
        window.WebViewJavascriptBridge.callHandler(
          'gotoNative', {
            type: 2,
            data: {
              cover: cover || avatar,
              liveid: liveid,
              avatar: avatar || cover,
              anchorId: anchorId,
              name: nickname,
              isPrivacy: isPrivacy || 0,
              privacyId: privacyId || '',
              liveK: liveK || '',
              liveIv: liveIv || '',
              liveUrl: liveUrl,
              medal: medal || []
            }
          },
          function (responseData) {
          }
        )
      } catch (e) {
        console.log(e)
        // alert("跳直播间失败");
      }
    },
    // 开直播
    gotoLive () {
      try {
        window.WebViewJavascriptBridge.callHandler(
          'gotoNative', {
            type: 4,
            data: {}
          },
          function (responseData) {
            console.log(responseData)
          }
        )
      } catch (e) {
        console.log('开直播-error:', e)
      }
    },
    // 观看小视频
    watchVideo ({
      url,
      cover,
      avatar,
      liveid,
      uid
    }) {
      try {
        window.WebViewJavascriptBridge.callHandler(
          'gotoNative', {
            type: 3,
            data: {
              url,
              cover,
              avatar,
              liveid,
              uid
            }
          },
          function (responseData) {
            console.log(responseData)
          }
        )
      } catch (e) {
        console.log('开直播-error:', e)
      }
    },
    // 录制小视频
    gotoVideo () {
      try {
        window.WebViewJavascriptBridge.callHandler(
          'gotoNative', {
            type: 5,
            data: {}
          },
          function (responseData) {
            console.log(responseData)
          }
        )
      } catch (e) {
        console.log('开直播-error:', e)
      }
    },
    // 用户个人中心
    gotoCenter (uid) {
      try {
        window.WebViewJavascriptBridge.callHandler(
          'gotoNative', {
            type: 1,
            data: {
              uid: uid
            }
          },
          function (responseData) {
          }
        )
      } catch (e) {
        console.log(e)
      }
    },
    // 获取用户信息
    getUserinfo (cb) {
      try {
        window.WebViewJavascriptBridge.callHandler(
          'getData', {
            type: 2,
            data: '获取用户信息'
          },
          function (responseData) {
            cb && cb(responseData)
          }
        )
      } catch (e) {
        console.log('获取用户信息-error:', e)
      }
    },
    // 获取位置信息
    getLocation (cb) {
      try {
        window.WebViewJavascriptBridge.callHandler(
          'getData', {
            type: 1,
            data: '获取用户信息地理位置'
          },
          function (responseData) {
            cb && cb(responseData)
          }
        )
      } catch (e) {
        console.log('获取用户信息地理位置-error:', e)
      }
    },
    // 用户设备id
    getDeviceid (cb) {
      try {
        window.WebViewJavascriptBridge.callHandler(
          'getData', {
            type: 3,
            data: '获取设备id'
          },
          function (responseData) {
            cb && cb(responseData)
          }
        )
      } catch (e) {
        console.log('获取设备id-error:', e)
      }
    },
    // 获取版本号
    getVersion (cb) {
      try {
        window.WebViewJavascriptBridge.callHandler(
          'getData', {
            type: 4,
            data: '获取设备版本号'
          },
          function (responseData) {
            console.log('ver' + responseData)
            cb && cb(responseData)
          }
        )
      } catch (e) {
        console.log('获取设备版本号-error:', e)
      }
    },
    // 分享信息
    shareCon ({
      content,
      photo,
      title,
      url,
      avatar,
      cover,
      relateid,
      sharetype
    }) {
      try {
        window.WebViewJavascriptBridge.callHandler(
          'pushData', {
            shareStatus: true,
            shareContent: {
              content: content || '',
              photo: photo || cover || avatar,
              title: title || '',
              url: url || '',
              relateid: relateid || '',
              sharetype: sharetype || ''
            }
          },
          function (responseData) {
            console.log(responseData)
          }
        )
      } catch (e) {
        console.log('设置默认分享-error:', e)
      }
    },
    // 拉起分享
    gotoShare ({
      content,
      photo,
      title,
      url,
      avatar,
      cover,
      relateid,
      sharetype,
      gotype,
    }) {
      try {
        window.WebViewJavascriptBridge.callHandler(
          'doAction', {
            type: 2,
            shareContent: {
              content: content || '',
              photo: photo || cover || avatar,
              title: title || '',
              url: url || '',
              relateid: relateid || '',
              sharetype: sharetype || '',
              gotype: gotype || ''
            }
          },
          function (responseData) {
            console.log(responseData)
          }
        )
      } catch (e) {
        console.log('分享错误-error:', e)
      }
    },
    // 保存图片到手机
    saveImgNative ({
      picName,
      base64
    }) {
      try {
        window.WebViewJavascriptBridge.callHandler(
          'saveImage', {
            picName: picName || '',
            base64: base64 || ''
          },
          function (responseData) {
            console.log(responseData)
          }
        )
      } catch (e) {
        console.log('保存图片-error:', e)
      }
    },
    // 拷贝剪切板
    copyClipboard (con) {
      try {
        window.WebViewJavascriptBridge.callHandler(
          'doAction', {
            type: 1,
            content: con
          },
          function (responseData) {
            console.log(responseData)
          }
        )
      } catch (e) {
        console.log('复制到剪贴板-error:', e)
      }
    },
    // 关闭webview页面回到app上一级页面
    backNative () {
      try {
        window.WebViewJavascriptBridge.callHandler(
          'doAction', {
            type: 3
          },
          function (responseData) {
            console.log(responseData)
          }
        )
      } catch (e) {
        console.log('关闭webview页面回到app上一级页面-error:', e)
      }
    },
    // 余额不足
    balanceLack () {
      try {
        window.WebViewJavascriptBridge.callHandler(
          'doAction', {
            type: 4
          },
          function (responseData) {
            console.log(responseData)
          }
        )
      } catch (e) {
        console.log('余额不足-error:', e)
      }
    },
    // 通知客户端查询用户余额
    checkBalances () {
      try {
        window.WebViewJavascriptBridge.callHandler(
          'doAction', {
            type: 5
          },
          function (responseData) {
            console.log(responseData)
          }
        )
      } catch (e) {
        console.log('余额不足-error:', e)
      }
    },
    //答题专用函数
    answerGoLiveRoom ({
      liveid, //直播间id
      roundid //场次id
    }) {
      try {
        if (liveid == 0 || roundid == 0) {
          return
        }
        window.WebViewJavascriptBridge.callHandler(
          'answerGoLiveRoom', {
            liveid: liveid || '',
            roundid: roundid || ''
          },
          function (responseData) {
            console.log(responseData)
          }
        )
      } catch (e) {
        console.log('进入答题直播间-error:', e)
      }
    },
    modifyTitle (title) {
      document.title = title
      var _iframe = document.createElement('iframe')
      _iframe.style.display = 'none'
      _iframe.src = 'http://www.wesunflower.com'
      document.body.appendChild(_iframe)
      _iframe.addEventListener('load', function loadFn () {
        setTimeout(() => {
          _iframe.removeEventListener('load', loadFn, false)
          document.body.removeChild(_iframe)
          _iframe = null
        }, 0)
      }, false)
    }
  }
  return Dream
}

export default function bindWindowDream (name = '$dream') {
  if (window[name]) {
    return
  }
  if (typeof define === 'function') {
    define(definition)
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = definition()
  }
  window[name] = definition()()
}
