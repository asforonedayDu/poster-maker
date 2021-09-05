<template>
  <div class="poster-show-body" ref="showContainer">
    <div class="poster-show-container" :style="{width:`${rootWidth?`${rootWidth}px`:'100%'}`}" id="poster-root">
      <poster v-if="posterData.pages.length>0" :posterData="posterData" :rootWidth="rootWidth"/>
    </div>
  </div>
</template>

<script>
  import {urlParse} from "@/libs/util.dependent";
  import {get_poster_detail} from "@/api/modules/system";

  export default {
    name: "posterShow",
    components: {
      poster: () => import('@/components/poster/index')
    },
    data() {
      return {
        posterData: {pages: [], audio: {}},
        rootWidth: false,
      }
    },
    async created() {
      const urlParams = urlParse()
      const poster_id = urlParams.id
      if (!poster_id) {
        console.log('参数错误')
      }
      let result
      try {
        result = await get_poster_detail(poster_id)
      } catch (e) {
        console.log('请求错误')
        return
      }
      this.posterData = JSON.parse(result.poster_data)
      // console.log('this.posterData', this.posterData)
    },
    mounted() {
      // 设定高度是宽度1.6倍 cell-container-mid 中设置的高度是80rem 动态根据屏幕高度设置body fontsize
      // 因为移动端浏览器对html的font size最小值有限制 这里让html fontsize变大了一倍
      const rootWidth = this.$refs.showContainer.clientWidth
      const windowHeight = this.$refs.showContainer.clientHeight
      if ((windowHeight / rootWidth) < 1.6) {
        this.rootWidth = windowHeight * 5 / 8
      } else {
        this.rootWidth = rootWidth
      }
      let htmlDom = document.getElementsByTagName('html')[0]
      htmlDom.style.fontSize = (this.rootWidth / 50) + 'px'
    }
  }
</script>

<style lang="scss" scoped>
  .poster-show-body {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;

    .poster-show-container {
      height: 100%;
    }
  }
</style>
