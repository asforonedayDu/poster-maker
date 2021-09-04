export const treeDataType = {
  CELL: '_CELL',
  PAGE: '_PAGE',
}
export const baseConfig = {
  designWidth: 500,
  designHeight: 800,
}

export const basicFontFamily = [
  {
    fontFamily: 'Microsoft YaHei',
    asset_name: '微软雅黑',
  },
  {
    fontFamily: 'SimHei',
    asset_name: '黑体',
  },
  {
    fontFamily: 'SimSun',
    asset_name: '宋体',
  },
  // {
  //   fontFamily: '',
  //   asset_name: '微软雅黑',
  // },
]

export const getMaxPageId = function (pages) {
  if (!pages) return 0
  return Math.max(...pages.map(page => {
    if (/Infinity|null/i.test(page.id)) {
      return 0
    }
    return page.id
  }))
}

export const getMaxCellId = function (cells) {
  if (!cells) return 0
  const ids = cells.map(cell => {
    const id = cell.id.split('_')[1]
    if (/Infinity|null/i.test(id)) return 0
    return Number(id)
  })
  return Math.max(...ids)
}

export const cleanPageProps = function (page) {
  delete page.$level
  delete page.$position
  delete page.$hasChild
  delete page.$parentId
  delete page.$namePath
  delete page.name
}

export const cleanCellProps = function (cell) {
  delete cell.$level
  delete cell.$position
  delete cell.$hasChild
  delete cell.$parentId
  delete cell.name
}
