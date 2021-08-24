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
  for (let i = 0; i < animations.length; i++) {
    const animation = animations[i]
    if (animation.animationDuration) {
      node.style.setProperty('animate-duration', `${animation.animationDuration}s`);
      node.style.setProperty('-webkit-animation-duration', `${animation.animationDuration}s`);
    }
    if (animation.animationCount) {
      node.style.setProperty('animation-iteration-count', `${animation.animationCount}`);
      node.style.setProperty('-webkit-animation-iteration-count', `${animation.animationCount}`);
    }
    if (animation.animationFillMode) {
      node.style.setProperty('animation-fill-mode', `${animation.animationFillMode}`);
      node.style.setProperty('-webkit-animation-fill-mode', `${animation.animationFillMode}`);
    }
    if (animation.animationDelay) {
      node.style.setProperty('animation-delay', `${animation.animationDelay}s`);
      node.style.setProperty('-webkit-animation-delay', `${animation.animationDelay}s`);
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
  }
  return ''
}
export {
  animateCell,
  animateQueueCell
}
