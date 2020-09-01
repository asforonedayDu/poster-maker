require('os')
const Mock = require('mockjs')
const playground = require('./routers/playground')

function getAddUserDialog() {
  return {
    "data": {
      "title": "新建单位"
    }, "failed": false, "needLogin": false, "permissionDeny": false, "status": "ok", "success": true
  }

}

const proxy = {
  'GET /menu/findMenu': function (req, res) {
    res.send(Mock.mock(proxyFunction()))
  },
  'GET /capi/view/SearchList/orgManage': function (req, res) {
    res.send(Mock.mock(getOrgManageSchema()))
  },
  'GET /capi/view/CardList/billManage': function (req, res) {
    res.send(Mock.mock(getBillManageSchema()))
  },
  'GET /capi/view/TreeList/dictManage': function (req, res) {
    res.send(Mock.mock(getDictManageSchema()))
  },
  'POST /capi/api/newsQueryImpl/search': function (req, res) {
    res.send(Mock.mock(getOrgManageListData()))
  },
  // 新增组织
  'POST /capi/api/newsQueryImpl/searchByOrg': function (req, res) {
    res.send(Mock.mock(getOrgList()))
  },
  // 获取树结构数据
  'POST /capi/api/newsQueryImpl/tree': function (req, res) {
    res.send(Mock.mock(getTreeList()))
  },
  // 新增用户 点击获取对话框数据
  'POST /capi/view/v2/addUserDialog/': function (req, res) {
    res.send(Mock.mock(getAddUserDialog()))
  },
  // 新增组织 点击获取对话框数据
  'POST /capi/view/v2//treeCreateDialog/': function (req, res) {
    res.send(Mock.mock(getTreeCreateDialog()))
  },
  'POST /capi/addUser': function (req, res) {
    const {code, content, createdBy, id, operation, status, title} = req.body || req.query
    const existed = getOrgManageListData()
    existed.data.list.push(req.body || req.query)
    res.send(Mock.mock(existed))
  },
  'POST /capi/base/saveUser': function (req, res) {
    const callback = {
      message: "保存成功",
      status: 'ok',
    }
    res.send(Mock.mock(callback))
  },
  'GET /api/user': function (req, res) {
    res.send(Mock.mock({name: '@cname', intro: '@word(20)'}))
  },
  '/capi/test/validate': function (req, res) {
    // console.log(req.params, req.body, req.query)
    const value = req.body.value || req.query.value
    const callback = {
      message: value === 'test' ? 'ok' : `${value},请输入test以通过验证`,
      status: value === 'test' ? 'ok' : 'error',
    }
    res.send(Mock.mock(callback))
  },
  'POST /capi/auth/login': (req, res) => {
    const {password, username} = req.body
    if (password === 'admin' && username === 'admin') {
      return res.send({
        status: 'ok',
        code: 0,
        data: {
          id: 1, username: username, sex: 6,
          token: 'demoAdmin',
          uuid: 'demoAdmin',
        }
      })
    } else {
      return res.send({status: 'error', code: 403, msg: '用户名或密码错误'})
    }
  },
  'POST /capi/checkLogin': (req, res) => {
    const {token, username} = req.body
    if (token === 'demoAdmin' && username === 'admin') {
      return res.send({
        status: 'ok',
        code: 0,
        data: {
          id: 1, username: username, sex: 6,
          token: 'demoAdmin',
          uuid: 'demoAdmin',
          status: 'ok',
        }
      })
    } else {
      return res.send({status: 'error', code: 403, msg: '用户名或密码错误'})
    }
  },
}
module.exports = proxy
