const express = require('express')
const path = require('path')
const apiMocker = require('mocker-api')

// if (process.env.NODE_ENV === 'development') {
//   const app = express()
//   apiMocker(app, path.resolve('./mock/index.js'))
//   app.listen(3333)
// }

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
      //   '^/': '/api'
      // }
    },
  },
}
