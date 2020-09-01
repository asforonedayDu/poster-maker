<template>
  <div class="toast" :style="{opacity:`${showToast?'1':'0'}`}">
    {{toastText}}
  </div>
</template>

<script>
export default {
  name: 'toast',
  data () {
    return {
      showToast: false,
      duration: 1000,
      toastText: ''
    }
  },
  methods: {
    destroyElement () {
      this.$destroy(true)
    }
  },
  watch: {
    showToast (val) {
      if (!val) {
        this.$el.addEventListener('transitionend', this.destroyElement)
      }
    }
  },
  mounted () {
    const self = this
    self.showToast = true
    this.$nextTick(vm => {
      setTimeout(() => {
        self.showToast = false
      }, this.duration)
    })
    // setTimeout(() => {
    // }, 200)
  },
  beforeDestroy () {
    this.$el.removeEventListener('transitionend', this.destroyElement)
    this.$el.parentNode.removeChild(this.$el)
  }
}
</script>

<style scoped>
  .toast {
    position: fixed;
    z-index: 2000;
    left: 50%;
    top: 75%;
    transition: all .5s;
    transform: translateX(-50%) translateY(-50%);
    text-align: center;
    border-radius: 5px;
    color: #FFF;
    background: rgba(17, 17, 17, 0.7);
    max-width: 80%;
    line-height: 45px;
    font-size: 28px;
    padding: 0 15px;
  }
</style>
