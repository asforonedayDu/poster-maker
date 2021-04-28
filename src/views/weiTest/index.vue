<template>
  <div>
    <ul class="main-container">
      <li v-for="info in infos">
        {{info}}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "weiTest",
  data() {
    return {
      weiJsUrl: 'http://res.wx.qq.com/open/js/jweixin-1.6.0.js',
      infos: [],
    }
  },
  mounted() {
    let script_dom = document.createElement('script');
    script_dom.src = this.weiJsUrl;
    script_dom.language = 'javascript';
    script_dom.type = 'text/javascript';
    script_dom.onload = this.handleScriptLoaded;
    document.head.appendChild(script_dom)
  },
  methods: {
    handleScriptLoaded() {
      this.infos.push('微信JS SDK下载完毕。。')
      this.registerSDK()
    },
    registerSDK() {

    }
  }
}
</script>

<style scoped>
  .main-container {
    padding: 100px 0;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
  }
</style>
