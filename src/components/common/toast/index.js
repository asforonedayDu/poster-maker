import Vue from 'vue'
import toast from './index.vue'

const ToastConstructor = Vue.extend(toast)

const Toast = function (text, duration = 3000, config = {}) {
  if (duration <= 0) {
    console.log('toast 时间必须大于0')
    return
  }
  const instance = new ToastConstructor({
    data: {
      toastText: text,
      duration, ...config
    }
  })
  const $el = instance.$mount().$el
  document.body.appendChild($el)
}

export default Toast
