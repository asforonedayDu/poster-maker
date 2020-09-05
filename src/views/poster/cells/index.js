const files = require.context('./components', true, /index.js/)
export default files.keys().map(key => {
  return files(key).default
})
