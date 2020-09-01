<template>
  <div class="body">
    <router-view/>
    <!--    <transition :name="transitionActive ? 'fade-transverse' : ''">-->
    <!--      <keep-alive>-->
    <!--        <router-view/>-->
    <!--      </keep-alive>-->
    <!--    </transition>-->
  </div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'

export default {
  name: 'default-layout',
  mixins: [],
  // beforeCreate() {
  //   console.log('before created layout')
  // },
  components: {},
  data() {
    return {
      // [侧边栏宽度] 正常状态
      asideWidth: '200px',
      // [侧边栏宽度] 折叠状态
      asideWidthCollapse: '65px'
    }
  },
  created() {
  },
  computed: {
    ...mapState('d2admin', {
      transitionActive: state => state.transition.active,
    }),
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
  // 注册主题 目前无用
  @import '~@/assets/style/theme/register.scss';

  .body {
    height: 100%;
    width: 100%;
  }
</style>
