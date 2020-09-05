const animateCell = (node, animations = [], prefix = 'animate__') => {
  if (!animations instanceof Array) throw new Error('animations 参数必须是数组类型')
  return new Promise((resolve, reject) => {
    const animationsName = animations.map(animation => {
      return `${prefix}${animation}`
    })

    node.classList.add(`${prefix}animated`, ...animationsName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd() {
      // node.classList.remove(`${prefix}animated`, ...animationsName);
      node.removeEventListener('animationend', handleAnimationEnd);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd);
  });
}

export {
  animateCell
}
