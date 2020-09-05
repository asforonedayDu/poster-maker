<template>
  <div class="main-body">
    <page :pageData="pageData" v-for="(pageData,index) in pages" :key="index"/>
  </div>
</template>

<script>
import page from "./page";

export default {
  name: "poster",
  components: {
    page
  },
  created() {
    let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth
    let htmlDom = document.getElementsByTagName('html')[0]
    htmlDom.style.fontSize = (htmlWidth / 100) + 'px'
  },
  data() {
    return {
      pages: [
        {
          // cells: [
          //   {
          //     type: 'cell-flex-board',
          //     props: {
          //       position: {
          //         top: 0,
          //         left: 0,
          //         height: 100,
          //         width: 100,
          //       },
          //       background: 'yellow',
          //       backgroundImage: '',
          //     }
          //   },
          //   {
          //     type: 'cell-text',
          //     props: {
          //       position: {
          //         top: 45,
          //         left: 37,
          //         height: 0,
          //         width: 0,
          //       },
          //       content: '我',
          //       animation: {
          //         actions: ['zoomIn'],
          //         duration: '0.4',
          //         count: 1,
          //         fillMode: 'both',
          //         delay: 0,
          //       },
          //       hideAfterAnimation: true,
          //       color: '',
          //       fontsize: 16,
          //       verticalDirection: true,
          //     }
          //   },
          //   {
          //     type: 'cell-text',
          //     props: {
          //       position: {
          //         top: 45,
          //         left: 37,
          //         height: 0,
          //         width: 0,
          //       },
          //       content: '们',
          //       animation: {
          //         actions: ['zoomIn'],
          //         duration: '0.4',
          //         count: 1,
          //         fillMode: 'both',
          //         delay: 0.4,
          //       },
          //       hideAfterAnimation: true,
          //       color: '',
          //       fontsize: 16,
          //       verticalDirection: true,
          //     }
          //   },
          //   {
          //     type: 'cell-text',
          //     props: {
          //       position: {
          //         top: 40,
          //         left: 37,
          //         height: 0,
          //         width: 0,
          //       },
          //       content: '招聘',
          //       animation: {
          //         actions: ['scaleIn'],
          //         duration: '0.4',
          //         count: 1,
          //         fillMode: 'both',
          //         delay: 0.8,
          //       },
          //       hideAfterAnimation: true,
          //       color: '',
          //       fontsize: 16,
          //       verticalDirection: true,
          //     }
          //   },
          //   {
          //     type: 'cell-text',
          //     props: {
          //       position: {
          //         top: 38,
          //         left: 34,
          //         height: 0,
          //         width: 0,
          //       },
          //       content: '招聘',
          //       animation: {
          //         actions: ['scaleIn'],
          //         duration: '0.4',
          //         count: 1,
          //         fillMode: 'both',
          //         delay: 1.2,
          //       },
          //       hideAfterAnimation: true,
          //       color: 'red',
          //       fontsize: 20,
          //       verticalDirection: true,
          //     }
          //   },
          //   {
          //     type: 'cell-text',
          //     props: {
          //       position: {
          //         top: 45,
          //         left: 37,
          //         height: 0,
          //         width: 0,
          //       },
          //       content: '啦',
          //       animation: {
          //         actions: ['scaleIn'],
          //         duration: '0.4',
          //         count: 1,
          //         fillMode: 'both',
          //         delay: 1.6,
          //       },
          //       hideAfterAnimation: true,
          //       color: '',
          //       fontsize: 16,
          //       verticalDirection: true,
          //     }
          //   },
          // ],
          cells: [
            {
              type: 'cell-flex-board',
              props: {
                position: {
                  top: 0,
                  left: 0,
                  height: 100,
                  width: 100,
                },
                background: 'yellow',
                backgroundImage: '',
              }
            },
            {
              type: 'cell-board',
              props: {
                position: {
                  top: 10,
                  left: 10,
                  height: 80,
                  width: 80,
                },
                animation: {
                  actions: ['rotateSlideInLeftDegree'],
                  duration: '1',
                  count: 1,
                  fillMode: 'forwards',
                  delay: 0,
                },
                background: 'white',
              }
            },
            {
              type: 'cell-board',
              props: {
                position: {
                  top: 10,
                  left: 10,
                  height: 80,
                  width: 80,
                },
                animation: {
                  actions: ['rotateSlideInRight'],
                  duration: '1',
                  count: 1,
                  fillMode: 'forwards',
                  delay: 0,
                },
                background: 'white',
              }
            },
            {
              type: 'cell-board',
              props: {
                position: {
                  top: 20,
                  left: 30,
                  height: 40,
                  width: 40,
                },
                animation: {
                  actions: ['fadeInLeft'],
                  duration: '1',
                  count: 1,
                  fillMode: 'both',
                  delay: 1,
                },
                background: 'black',
              }
            },
          ]
        },
      ]
    }
  },
  mounted() {
    // this.$refs.demo
  }
}
</script>

<style lang="scss" scoped>
  @import "~animate.css";

  .main-body {
    width: 100%;
    height: 100%;
    position: relative;
    /*display: flex;*/
    /*flex-flow: column nowrap;*/
    /*justify-content: center;*/
    /*align-items: center;*/
  }
</style>
