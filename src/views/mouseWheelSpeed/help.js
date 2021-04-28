/**
 * 动画库
 */

const timeMax = 180 // 动画执行时长最大值
const frameMin = 15 // 一帧最小时间
const countMax = 10 // 最多执行的帧数
const countMin = 4 // 最少执行的帧数

// 获取当前的值，要保证执行时间不能太长，执行帧数不能太多也不能太少
function getValue(startTime, prevTime, stepCount, current, end) {
  const now = window.performance.now()
  const frameTime = Math.max(frameMin, now - prevTime) // 避免一帧时间小于最小值
  let count = (timeMax - now + startTime) / frameTime
  count = Math.ceil(count)
  count = Math.min(countMax - stepCount, count) // 控制帧数不能太多
  count = Math.max(countMin - stepCount, count, 1) // 控制帧数不能太少
  const stepLen = (end - current) / count
  current += stepLen
  if (current > end) {
    current = Math.max(end, current)
  } else {
    current = Math.min(end, current)
  }
  return current
}

function run({setValue, start, end, keepEnd, onDone}) {
  // 这是为了防止开发过程中值类型写错
  if (!"$[isProduction]") {
    if (typeof start !== 'number' || Number.isNaN(start) ||
      typeof end !== 'number' || Number.isNaN(end)) {
      throw new Error('animation value type error')
    }
  }

  onDone = onDone || Function.prototype // 下面懒得判空
  if (start === end) {
    onDone()
    return
  }
  const startTime = window.performance.now()
  let prevTime = startTime
  let isStop = false
  let current = start
  let stepCount = 0
  const step = () => {
    if (isStop) {
      // console.info(`animation: ${stepCount}, ${window.performance.now() - startTime}`)
      onDone()
      return
    }
    // 每一帧走完都准确计算下一步的值
    current = getValue(startTime, prevTime, stepCount++, current, end)
    prevTime = window.performance.now()
    if (current === end) {
      isStop = true
      setValue(keepEnd ? end : '')
      // 不可以在这里cb然后return，要保证走完最后一帧
    } else {
      setValue(current)
    }
    window.requestAnimationFrame(step)
  }
  setValue(current)
  window.requestAnimationFrame(step)
}

// 高度
function runHeight({element, start, end, keepEnd = false, onDone = null}) {
  const setValue = (value) => {
    element.style.height = value === '' ? '' : `${value}px`
  }
  run({setValue, start, end, keepEnd, onDone})
}

// X轴平移
function runTranslateX({element, start, end, keepEnd = false, onDone = null}) {
  const setValue = (value) => {
    if (value && window.rightToLeft) {
      value = -value
    }
    element.style.transform = value === '' ? '' : `translateX(${value}%)`
  }
  run({setValue, start, end, keepEnd, onDone})
}

// 旋转
function runRotate({element, start, end, keepEnd = false, onDone = null}) {
  const setValue = (value) => {
    element.style.transform = value === '' ? '' : `rotate(${value}deg)`
  }
  run({setValue, start, end, keepEnd, onDone})
}

// 透明度
function runOpacity({element, start, end, keepEnd = false, onDone = null}) {
  const setValue = (value) => {
    element.style.opacity = value
  }
  run({setValue, start, end, keepEnd, onDone})
}

export {
  run,
  runHeight,
  runRotate,
  runTranslateX,
  runOpacity,
}
