const CompressionWebpackPlugin = require('compression-webpack-plugin')
const VueFilenameInjector = require('@d2-projects/vue-filename-injector')
// const ThemeColorReplacer = require('webpack-theme-color-replacer')
// const forElementUI = require('webpack-theme-color-replacer/forElementUI')
const cdnDependencies = require('./dependencies-cdn')
// const { chain, set, each } = require('lodash')
const apiMocker = require('mocker-api')
const path = require('path')
const fs = require('fs')
const glob = require('glob')
// const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

const isDevelopment = process.env.NODE_ENV === 'development'
// 拼接路径
const resolve = dir => require('path').join(__dirname, dir)
// 增加环境变量
process.env.VUE_APP_VERSION = require('./package.json').version
// process.env.VUE_APP_BUILD_TIME = require('dayjs')().format('YYYY-M-D HH:mm:ss')
process.env.VUE_APP_BUILD_TIME = '2020-8-15 12:00:00'
// 基础路径 注意发布之前要先修改这里
const publicPath = process.env.VUE_APP_PUBLIC_PATH || '/poster/'

// 设置不参与构建的库 生产模式有效
const externals = {}
cdnDependencies.forEach(pkg => {
  externals[pkg.name] = pkg.library
})
// 引入文件的 cdn 链接
// const cdn = {
//   css: cdnDependencies.map(e => e.css).filter(e => !!e),
//   js: cdnDependencies.map(e => e.js).filter(e => !!e)
// }
const cdn_js = cdnDependencies.filter(e => e.js).map(e => {
  return {
    name: e.name,
    js: e.js
  }
})

const cdn_css = cdnDependencies.filter(e => e.css).map(e => {
  return {
    name: e.name,
    css: e.css
  }
})

// 多页配置，参考 https://cli.vuejs.org/zh/config/#pages
// 多页模式需要指定chunks 如果chunks为空 vue cli 默认为'chunk-vendors', 'chunk-common'以及page key 三个
let pages = {
  index:
    {
      entry: 'src/pages/index/main.js',
      template: 'public/index.html',
      title: '',
      filename: 'index.html',
      cdn: ['vue', 'vue-router', 'vuex', 'axios', 'lodash', 'element-ui', 'js-cookie'],// 'screenfull'
      //'chunk-vendors', 'chunk-common', 'vendors~index', 'chunk-vue-router', 'chunk-vuex', 'chunk-elementUI', 'chunk-axios',
      chunks: ['chunk-vendors', 'chunk-common', 'chunk-elementUI', 'index']
    },
  posterShow:
    {
      entry: 'src/pages/posterShow/main.js',
      template: 'public/index.html',
      filename: 'posterShow/index.html',
      cdn: ['vue', 'axios', 'lodash'],// 'screenfull'
      //'chunk-vendors', 'chunk-common', 'vendors~index', 'chunk-vue-router', 'chunk-vuex', 'chunk-elementUI', 'chunk-axios',
      chunks: ['chunk-vendors', 'chunk-common', 'posterShow']
    },
}

// pages = undefined
function getEntry(globPath) {
  let entries = {}, basename, tmp, pathname
  glob.sync(globPath).forEach(function (entry) {
    basename = path.basename(entry, path.extname(entry))
    tmp = entry.split('/').splice(-3)
    console.log('entry', entry, tmp)
    pathname = basename // 正确输出js和html的路径

    const fileIs = glob.sync(entry + tmp[1] + '.html')
    entries[pathname] = {
      entry: 'src/' + tmp[0] + '/' + tmp[1] + '/main.js',
      template: 'public/index.html',
      title: '',
      filename: tmp[1] + '.html',
      chunks: ['chunk-vendors', 'chunk-common', pathname]
    }
  })
  return entries
}

const DEV_SERVER = {
  publicPath,
  disableHostCheck: isDevelopment,
  historyApiFallback: {
    rewrites: [
      {
        from: /.*/,
        to: '/app/index.html'
      }
    ],
  },
  port: 9080,
  // host: '192.168.0.39',
}

// ---私有配置相关--start--
// 引入获得共享子目录函数
const PRV_CONFIG = require('./private')
if (PRV_CONFIG.ENABLE_MOCK) {
  DEV_SERVER.before = function (app) {
    apiMocker(app, path.resolve(__dirname, './mock/index.js'), {
      proxy: PRV_CONFIG.MOCK_PROXY,
      pathRewrite: {
        '^/api/': '/',
      },
      changeHost: true,
    })
    delete require.cache[require.resolve(`./mock/index.js`)]
  }
} else {
  DEV_SERVER.proxy = PRV_CONFIG.DEV_PROXY
}
// ---私有配置-end-
module.exports = {
  // 根据你的实际情况更改这里
  publicPath,
  lintOnSave: true,
  devServer: DEV_SERVER,
  css: {
    loaderOptions: {
      // 设置 scss 公用变量文件
      sass: {
        prependData: '@import \'~@/assets/style/public.scss\';'
      }
    }
  },
  pages,
  configureWebpack: config => {
    const configNew = {}
    // configNew.externals = externals
    if (!isDevelopment) {
      configNew.externals = externals
      configNew.plugins = [
        // gzip
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
          threshold: 5240,
          minRatio: 0.8,
          deleteOriginalAssets: false
        })
      ]
    }
    return configNew
  },
  // 默认设置: https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-service/lib/config/base.js
  chainWebpack: config => {
    /**
     * 添加 CDN 参数到 htmlWebpackPlugin 配置中
     * 适配多页
     */
    if (!isDevelopment) {
      Object.keys(pages).forEach(name => {
        const page = pages[name]
        config.plugin('html-' + name).tap(options => {
          // set(options, '[0].cdn', process.env.NODE_ENV === 'production' ? cdn : [])
          // set(options, '[0].cdn', {
          //   js: cdn_js.filter(i_js => page.cdn.includes(i_js.name)).map(e => e.js),
          //   css: cdn_css.filter(i_css => page.cdn.includes(i_css.name)).map(e => e.css),
          // })
          options[0]['cdn'] = {
            js: cdn_js.filter(i_js => page.cdn.includes(i_js.name)).map(e => e.js),
            css: cdn_css.filter(i_css => page.cdn.includes(i_css.name)).map(e => e.css),
          }
          return options
        })
      })
    }
    /**
     * 把动画库的keyFrames转换成数组传到项目里面
     */
    config.plugin('define')
      .tap(args => {
        args[0].ANIMATE_LIST = JSON.stringify(PRV_CONFIG.getAnimationList())
        return args
      })
    /**
     * 删除懒加载模块的 prefetch preload，降低带宽压力
     * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#prefetch
     * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#preload
     * 而且预渲染时生成的 prefetch 标签是 modern 版本的，低版本浏览器是不需要的
     */
    config.plugins
      .delete('prefetch')
      .delete('preload')
    for (let key in pages) {
      config.plugins.delete('prefetch-' + key + '')
      config.plugins.delete('preload-' + key + '')
    }
    // 解决 cli3 热更新失效 https://github.com/vuejs/vue-cli/issues/1559
    config.resolve
      .symlinks(true)
    // config
    // .plugin('theme-color-replacer')
    // .use(ThemeColorReplacer, [{
    //   fileName: 'css/theme-colors.[contenthash:8].css',
    //   matchColors: [
    //     ...forElementUI.getElementUISeries(process.env.VUE_APP_ELEMENT_COLOR) // Element-ui主色系列
    //   ],
    //   externalCssFiles: ['./node_modules/element-ui/lib/theme-chalk/index.css'], // optional, String or string array. Set external css files (such as cdn css) to extract colors.
    //   changeSelector: forElementUI.changeSelector
    // }])
    config
      // 开发环境 sourcemap 不包含列信息
      .when(isDevelopment,
        config => config.devtool('cheap-source-map')
      )
      // 预览环境构建 vue-loader 添加 filename
      .when(
        process.env.VUE_APP_SCOURCE_LINK === 'TRUE',
        config => VueFilenameInjector(config, {
          propName: process.env.VUE_APP_SOURCE_VIEWER_PROP_NAME
        })
      )
    // 去除生产环境控制台代码
    // config.when(!isDevelopment, config => {
    //   config.optimization.minimizer('terser').tap(options => {
    //     options[0].terserOptions.compress.drop_console = true
    //     return options
    //   })
    // })
    // markdown
    config.module
      .rule('md')
      .test(/\.md$/)
      .use('text-loader')
      .loader('text-loader')
      .end()
    // svg
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .include
      .add(resolve('src/assets/svg-icons/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'd2-[name]'
      })
      .end()
    // image exclude
    const imagesRule = config.module.rule('images')
    imagesRule
      .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
      .exclude
      .add(resolve('src/assets/svg-icons/icons'))
      .end()
    // 重新设置 alias
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@api', resolve('src/api'))
    // 分析工具
    if (process.env.npm_config_report) {
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }
    if (!isDevelopment) {
      config
        .optimization.splitChunks({
        chunks: 'all',
        // minSize: 10000, // 提取出的新chunk在两次压缩(打包压缩和服务器压缩)之前要大于**kb
        // minChunks: 1, // 被提取的chunk最少需要被多少chunks共同引入
        cacheGroups: {
          vendors: {
            name: 'chunk-vendors',
            // test: /[\\\/]node_modules[\\\/]/,
            test: module => {
              if (module.resource) {
                const include = [/[\\/]node_modules[\\/]/].every(reg => {
                  return reg.test(module.resource)
                })
                const exclude = [/[\\/]node_modules[\\/](element-ui|lodash|axios|vuex|vue-router)/].some(reg => {
                  return reg.test(module.resource)
                })
                return include && !exclude
              }
              return false
            },
            priority: -10,
            chunks: 'initial',
            reuseExistingChunk: false
          },
          common: {
            name: 'chunk-common',
            minChunks: 2,
            priority: -20,
            chunks: 'initial',
            reuseExistingChunk: false
          },
          // elementUI: {
          //   enforce: true,
          //   name: 'chunk-elementUI',
          //   priority: 20,
          //   test: /[\\/]node_modules[\\/](element-ui)/,
          // },
          /**
           * 单独打包lodash会导致 babel的core-js等代码被重复打包 原因暂未知
           * 目前使用cdn
           */
          // lodash: {
          //   enforce: true,
          //   name: 'chunk-lodash',
          //   priority: 21,
          //   // test: /[\\/]node_modules[\\/]lodash/,
          //   test: module => {
          //     if (module.resource) {
          //       console.log('module.resource', module.resource)
          //       return /[\\/]node_modules[\\/]lodash/.test(module.resource)
          //     }
          //   },
          // },
        }
      })
    }
  },
  // 不输出 map 文件
  productionSourceMap: false,
  // i18n
  pluginOptions: {
    i18n: {
      locale: 'zh-chs',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    }
  }
}
