const prefix = 'animate__'
const animateCell = (node, animation = '', index, eventHandler) => {
  return new Promise((resolve, reject) => {
    node.classList.add(`${prefix}animated`, `${prefix}${animation}`);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd() {
      node.classList.remove(`${prefix}animated`, `${prefix}${animation}`);
      node.removeEventListener('animationend', handleAnimationEnd);
      if (eventHandler) eventHandler(index)
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd);
  });
}//animate__animated animate__slideUp
const animateQueueCell = async function (node, animations = [], eventHandler) {
  if (!animations instanceof Array) throw new Error('animations 参数必须是数组类型')
  for (let i = 0; i < animations.length; i++) {
    const animation = animations[i]
    await animateCell(node, animation, i, eventHandler)
  }
  return ''
}
export {
  animateCell,
  animateQueueCell
}
