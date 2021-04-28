<template>
  <div class="root" id="visibleWindow">
    <div id='container' class="container">
      <div class='demo'></div>
      <div class='demo'></div>
      <div class='demo'></div>
      <div class='demo'></div>
      <div class='demo'></div>
      <div class='demo'></div>
      <div class='demo'></div>
      <div class='demo'></div>
      <div class='demo'></div>
      <div class='demo'></div>
      <div class='demo'></div>
      <div class='demo'></div>
      <div class='demo'></div>
      <div class='demo'></div>
      <div class='demo'></div>
      <div class='demo'></div>
      <div class='demo'></div>
      <div class='demo'></div>
      <div class='demo'></div>
      <div class='demo'></div>
      <div class='demo'></div>
      <div class='demo'></div>
      <div class='demo'></div>
      <div class='demo'></div>
    </div>
  </div>

</template>

<script>
import {run} from './help'

export default {
  name: "mouseWheel",
  mounted() {
    const containerDom = document.getElementById("container");
    const visibleWindowDom = document.getElementById("visibleWindow");
// const demo = document.getElementById('demo')
    for (let i = 0; i < containerDom.children.length; i++) {
      containerDom.children[i].innerHTML = i;
    }

    let flag = 0;//timeStamp
    document.addEventListener("mousewheel", handleMouseWheel);

    function handleMouseWheel(e) {
      console.log(flag, e.deltaY);
      if (!containerDom.contains(e.target)) {
        console.log(flag, e.deltaY, e);
        return;
      }
      startAnimate(e);
    }

    const rolling = false;
    const defaultSpeed = 5;
    const speedScale = 1;
    const oneRollDistance = 50;
    const scrollTime = 1.5;
    let stop = false;
    let speed = defaultSpeed * speedScale
    let timer = null
    let calcEnd = 0;
    let wheelCount = 0;
    let offsetY = 0;
    let lastWheelTime = null;
    const allHeight = containerDom.clientHeight
    const visibleHeight = visibleWindowDom.clientHeight

    function clearRoll() {
      speed = defaultSpeed * speedScale
      wheelCount = 0;
      offsetY = 0;
      timer = null;
    }

    function startAnimate(e) {
      const rollTime = new Date().getTime()
      // 修改基准参数
      /*
      @todo 计算出新的目标停留位置 新的剩余滚动时间
      */
      calcEnd += oneRollDistance
      lastWheelTime = rollTime
      if (lastWheelTime) {

      } else {
        //初始化参数
      }

      if (!timer) {

        // 开始滚动
        timer = () => {
          if (stop) clearRoll()
          const now = new Date().getTime()
          const timeDur = now - lastWheelTime
          // 临界情况判断
          // const overHeight = allHeight - visibleHeight - offsetY
          // if (offsetY <= 0) {
          //   containerDom.style.transform = `translate3d(0,0,0)`;
          //   clearRoll()
          //   return
          // }
          // 根据滚动时间计算当前速度
          /*
          @todo 基本思路 根据离计划停留位置的距离和剩余滚轮事件的时间计算计算当前应该速度
           */
          offsetY += speed
          containerDom.style.transform = `translate3d(0,${offsetY}px,0)`;
          requestAnimationFrame(timer);
        };
        requestAnimationFrame(timer)
      }
    }

  }
}
</script>

<style lang="scss" scoped>
  html {
    height: 100%;
  }

  .root {
    height: 400px;
    overflow: hidden;
  }

  .container {
    margin: 0 auto;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;

    .demo {
      width: 100px;
      height: 80px;
      line-height: 80px;
      background: black;
      flex-shrink: 0;
      color: white;
      text-align: center;
      margin-top: 10px;
    }
  }
</style>
