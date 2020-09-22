<template>
  <div class="poster-center-body">
    <div class="title-body">
      已保存的海报列表:
    </div>
    <div class="poster-li-body" v-for="(poster,index) in posterList" :key="index">
      <router-link :to="`/posterShow?id=${poster.poster_id}`">{{poster.poster_name}}</router-link>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  name: "posterCenter",
  data() {
    return {
      posterList: []
    }
  },
  async created() {
    const result = await this.$api.GET_POSTER_LIST()
    Vue.set(this, 'posterList', result)
  },
}
</script>

<style lang="scss" scoped>

  .poster-center-body {
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-around;
    align-items: center;
    font-size: 26px;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 1);
    color: white;
    overflow: auto;

    .title-body {
      width: 100%;
      margin-left: 30%;
    }

    .poster-li-body {
      cursor: pointer;
    }
  }
</style>
