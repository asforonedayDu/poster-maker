<template>
  <div class="homepage-container">
    <router-link to="/wordMaker">跳转到组词页</router-link>
    <router-link to="/editor">富文本编辑页</router-link>
    <router-link to="/posterCenter">海报库</router-link>
    <router-link to="/posterMaker">制作海报</router-link>
  </div>
</template>

<script>

export default {
  name: 'homePage',
  components: {},
  data() {
    return {}
  },
  created() {
  }
}
</script>

<style lang="scss" scoped>
  .homepage-container {
    width: 100%;
    height: 100%;
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-around;
    align-items: center;
    background: black;
    font-size: 30px;
  }
</style>
