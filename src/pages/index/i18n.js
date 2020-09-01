import Vue from 'vue'
import VueI18n from 'vue-i18n'
import util from '@/libs/util'
import store from '@/store'
// import locale from 'element-ui/lib/locale'
// import zh_lang from 'element-ui/lib/locale/lang/zh-CN'
// import en_lang from 'element-ui/lib/locale/lang/en'

Vue.use(VueI18n)

// 获取本地多语言列表 NODE_LOCALE_LIST是vue.config中传过来的
!function getLocaleMessagesList() {
  let locales = []
  try {
    locales = NODE_LOCALE_LIST;
  } catch (e) {
    locales = []
  }
  if (!Vue.$languages) Vue.prototype.$languages = locales
}()


// 已经加载的多语言数据(文件名)
const loadedLanguages = []

const i18n = new VueI18n({
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE,
  messages: {} // 异步加载 没有加载初始值
})

// 提供一个动态加载语言的方法
export function i18nLocaleChangeHandle(val, oldVal) {
  function saveLocaleInfo() {
    util.cookies.set('lang', val)
    document.querySelector('html').setAttribute('lang', val)
  }

  if (!loadedLanguages.includes(val)) {
    loadLanguageAsync(val).then(msg => {
      saveLocaleInfo()
    })
  } else {
    setI18nLanguage(val, true)
    saveLocaleInfo()
  }
}

export async function loadLanguageAsync(lang, setDefault = true) {
  if (!loadedLanguages.includes(lang)) {
    const message = await import(/* webpackChunkName: "lang-[request]" */ `@/locales/${lang}`)
    // 把element的添加进去
    const localeElementUI = require(`element-ui/lib/locale/lang/${message._element}`)
    const mixElMessage = {
      ...message.default,
      ...localeElementUI ? localeElementUI.default : {}
    }
    i18n.setLocaleMessage(lang, mixElMessage)
    setI18nLanguage(lang, setDefault)
    loadedLanguages.push(lang)
    return Promise.resolve(mixElMessage)
  }
  return Promise.resolve(i18n.getLocaleMessage(lang))
}

function setI18nLanguage(lang, setDefault) {
  /**
   * todo element的语言数据 需要额外配对处理
   */
  // locale.use(lang !== 'zh-chs' ? en_lang : zh_lang)
  console.log('set language', lang)
  if (setDefault) i18n.locale = lang
  return lang
}

// // 初始化，获取当前语言数据
// loadLanguageAsync(util.cookies.get('lang') || process.env.VUE_APP_I18N_LOCALE)
// .then(msg => store.dispatch('system/lang/setLoaded', true)).catch(e => {
//   console.log('获取默认语言数据失败,请检查网络连接')
// })
// // 获取备用语言数据
// loadLanguageAsync(process.env.VUE_APP_I18N_FALLBACK_LOCALE, false).then()

export default i18n
