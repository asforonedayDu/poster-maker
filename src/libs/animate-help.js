const prefix = 'animate__'
const animateCell = (node, animationName = '', index, eventHandler) => {
  return new Promise((resolve, reject) => {
    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd() {
      node.classList.remove(`${prefix}animated`, `${prefix}${animationName}`);
      node.removeEventListener('animationend', handleAnimationEnd);
      if (eventHandler) eventHandler(index)
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd);
    node.classList.add(`${prefix}animated`, `${prefix}${animationName}`);
  });
}//animate__animated animate__slideUp

const animateQueueCell = async function (node, animations = [], eventHandler) {
  if (!animations instanceof Array) throw new Error('animations 参数必须是数组类型')
  let preEndTime
  for (let i = 0; i < animations.length; i++) {
    if (i === 0) preEndTime = 0
    const animation = animations[i]
    if (animation.animationDuration) {
      const count = animation.animationCount ? Number(animation.animationCount) : 1
      const indeedDuration = animation.animationDuration / count
      node.style.setProperty('animate-duration', `${indeedDuration}s`);
      node.style.setProperty('-webkit-animation-duration', `${indeedDuration}s`);
    }
    if (animation.animationCount) {
      node.style.setProperty('animation-iteration-count', `${animation.animationCount}`);
      node.style.setProperty('-webkit-animation-iteration-count', `${animation.animationCount}`);
    }
    if (animation.animationFillMode) {
      node.style.setProperty('animation-fill-mode', `${animation.animationFillMode}`);
      node.style.setProperty('-webkit-animation-fill-mode', `${animation.animationFillMode}`);
    }
    let indeedDelay = 0
    if (animation.animationDelay) {
      indeedDelay = Number(animation.animationDelay) - preEndTime
      indeedDelay = indeedDelay > 0 ? indeedDelay : 0
      node.style.setProperty('animation-delay', `${indeedDelay}s`);
      node.style.setProperty('-webkit-animation-delay', `${indeedDelay}s`);
    }
    if (animation.animationDirection) {
      node.style.setProperty('animation-direction', `${animation.animationDirection}`);
      node.style.setProperty('-webkit-animation-direction', `${animation.animationDirection}`);
    }
    if (animation.animationTimingFunction) {
      node.style.setProperty('animation-timing-function', `${animation.animationTimingFunction}`);
      node.style.setProperty('-webkit-animation-timing-function', `${animation.animationTimingFunction}`);
    }
    await animateCell(node, animation.name, i, eventHandler)
    if (i + 1 < animations.length) {
      preEndTime += (indeedDelay + Number(animation.animationDuration || 0))
    }
  }
  return ''
}
export {
  animateCell,
  animateQueueCell
}
