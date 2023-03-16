const express = require("express");
const path = require("path");
const apiMocker = require("mocker-api");
const fs = require("fs");

// if (process.env.NODE_ENV === 'development') {
//   const app = express()
//   apiMocker(app, path.resolve('./mock/index.js'))
//   app.listen(3333)
// }
function getAnimationList() {
  const content = fs.readFileSync(
    path.resolve(__dirname, "./src/components/poster/libs/animations.scss"),
    "utf-8"
  );
  const regResult = content.match(/@keyframes (.*?) \{/gm);
  const data = [];
  regResult.forEach((item) => {
    const result = /@keyframes (.*?) \{/.exec(item);
    data.push(result[1]);
  });
  data.sort((a, b) => {
    return a.charCodeAt(0) - b.charCodeAt(0);
  });
  return data;
}

module.exports = {
  ENABLE_MOCK: false,
  MOCK_PROXY: {
    "/capi/menu/findMenu(.*)": "http://139.129.224.86:9099",
  },
  DEV_PROXY: {
    "/posterServer": {
      target: "https://www.cybernick.club/",
      changeOrigin: true,
      // pathRewrite: {
      //   '^/api_h5': '/api'
      // }
    },
    "/posterFile": {
      target: "https://www.cybernick.club/",
      changeOrigin: true,
      // pathRewrite: {
      //   '^/posterFile/font': '/'
      // },
    },
  },
  getAnimationList,
};
