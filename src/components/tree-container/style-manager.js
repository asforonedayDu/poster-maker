import _ from "lodash";

export default defaultStyle

const defaultStyle = {
  contentWidth: '280',
  background: 'white',
  'padding-top': '20px',
  'padding-left': '20px',
  height: '100%'
}

export function getContainerStyle(self) {
  if (!_.hasIn(self, 'options.style')) {
    return defaultStyle
  } else {
    return {
      ...defaultStyle,
      ...self.options.style,
    }
  }
}

export function getBackgroundColor(self) {
  const hasSet = _.hasIn(self, 'options.style.backgroundColor')
  return {
    background: hasSet ? self.options.style.backgroundColor : defaultStyle.background
  }
}
