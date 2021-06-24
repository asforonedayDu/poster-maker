const express = require('express')
const path = require('path')
const apiMocker = require('mocker-api')
const fs = require('fs')

// if (process.env.NODE_ENV === 'development') {
//   const app = express()
//   apiMocker(app, path.resolve('./mock/index.js'))
//   app.listen(3333)
// }
function getAnimationList() {
  const content = fs.readFileSync(path.resolve(__dirname, './src/components/poster/libs/animations.scss'), 'utf-8')
  const regResult = content.match(/@keyframes (.*?) \{/gm)
  const data = []
  regResult.forEach(item => {
    const result = /@keyframes (.*?) \{/.exec(item)
    data.push(result[1])
  })
  return data
}

module.exports = {
  ENABLE_MOCK: false,
  MOCK_PROXY: {
    '/capi/menu/findMenu(.*)': 'http://139.129.224.86:9099',
  },
  DEV_PROXY: {
    '/api_h5': {
      target: 'http://testhtml5.jryaodian.com/',
      // target: 'http://39.96.43.154:8080/',
      changeOrigin: true,
      // pathRewrite: {
      //   '^/api_h5': '/api'
      // }
    },
    '/nodeServer': {
      target: 'http://testweb.jryaodian.com/',
      // target: 'http://127.0.0.1/',
      // target: 'http://39.96.43.154:8080/',
      changeOrigin: true,
      // pathRewrite: {
      //   '^/api_h5': '/api'
      // }
    },
  },
  getAnimationList
}
