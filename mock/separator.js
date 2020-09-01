module.exports = function () {
  return require('os').type() === 'Windows_NT' ? '\\' : '/'
}()
