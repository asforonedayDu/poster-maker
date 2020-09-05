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
  @import "../../views/poster/libs/animations";

  .cell-container-mid {
    width: 100%;
    height: 160rem;
    top: 50%;
    transform: translateY(-50%);
    position: absolute;
    overflow: hidden;
  }

  .cell-container-flex {
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;
  }

  .default-cell {
    position: absolute;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }
</style>
<style lang="scss">
  @import '~@/assets/style/public-class.scss';

  .app-container {
    width: 100%;
    height: 100%;
    flex-shrink: 1;
  }
</style>
