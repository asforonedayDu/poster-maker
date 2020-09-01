export default {
  beforeRouteEnter(to, from, next) {
    // next(instance => instance.$router.replace(JSON.parse(from.params.route)))
    next(instance => instance.$router.replace({path: to.fullPath.substr(9)}))
  },
  render: h => h()
}
