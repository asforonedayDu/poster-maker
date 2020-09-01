/**
 * 动态加载
 * @param componentPath
 * @returns {(function(): *)|(function(): *)|(function(): *)|(function(): *)}
 */
export function resolveComponentPath(componentPath) {
  if (componentPath.search(/^layout.*/) !== -1) {
    return () => import('@/layout/' + componentPath.substr(7))
  } else if (componentPath.search(/^views.*/) !== -1) {
    return () => import('@/views/' + componentPath.substr(6))
  } else {
    return () => import('@/views/' + componentPath)
  }
}
