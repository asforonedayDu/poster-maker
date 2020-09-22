<template>
  <div class="poster-show-body">
    <div class="poster-show-container" :style="{width:`${rootWidth?`${rootWidth}px`:'100%'}`}">
      <poster v-if="posterData.length>0" :pageData="posterData" :rootWidth="rootWidth"/>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import poster from '@/views/poster/index'
import {urlParse} from "@/libs/util";

export default {
  name: "posterShow",
  components: {poster},
  data() {
    return {
      posterData: [],
      rootWidth: false,
    }
  },
  async created() {
    const urlParams = urlParse()
    if (!urlParams.id) {
      return
    }
    const poster_id = urlParams.id
    if (!poster_id) {
      this.$message('参数错误')
    }
    let result
    try {
      result = await this.$api.GET_POSTER_DETAIL(poster_id)
    } catch (e) {
      this.$message('请求错误')
      return
    }
    const windowWidth = document.documentElement.clientWidth || document.body.clientWidth
    const windowHeight = document.documentElement.clientHeight || document.body.clientHeight
    if ((windowHeight / windowWidth) < 1.6) {
      this.rootWidth = windowHeight * 5 / 8
    }
    this.posterData = JSON.parse(result.poster_data)
  },
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
