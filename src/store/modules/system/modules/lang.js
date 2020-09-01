import Vue from 'vue'
import router from '@/router'

export default {
  namespaced: true,
  state: {
    // 尺寸
    langLoaded: false // medium small mini
  },
  actions: {
    /**
     * @description 确认已经加载多语言文件
     * @param {Object} context
     */
    isLoaded({state}) {
      if (state.langLoaded) {
        return Promise.resolve()
      }
      return new Promise(resolve => {
        const timer = setInterval(() => {
          if (state.langLoaded) resolve(clearInterval(timer))
        }, 10)
      })
    },
    /**
     * @description 设置已经加载多语言文件
     * @param {Object} context
     * @param loaded
     */
    async setLoaded({state, dispatch}, loaded) {
      // store 赋值
      state.langLoaded = loaded
    },
  }
}
