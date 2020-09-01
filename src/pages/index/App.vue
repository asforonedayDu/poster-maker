<template>
  <div id="app" class="app-container">
    <router-view/>
  </div>
</template>

<script>
// import {i18nLocaleChangeHandle} from '@/./i18n'

export default {
  name: 'app',
  watch: {
    // '$i18n.locale': i18nLocaleChangeHandle
  },
  created() {
  },
  methods: {}
}
</script>

<style lang="scss">
  @import '~@/assets/style/public-class.scss';

  .app-container {
    width: 100%;
    height: 100%;
    flex-shrink: 1;
  }
</style>
