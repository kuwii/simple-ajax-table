var DRFTable = {}

DRFTable.dataGenerator = function(data) {
  return {
    count: data.count,
    data: data.results
  }
}

DRFTable.requestGenerator = function(request) {
  var data = {}

  // 筛选项
  if (this.hasFilter()) {
    var filters = request.filters
    for (var i in request.filters) {
      data[i] = filters[i]
    }
  }
  // 搜索
  if (this.hasSearch()) {
    data.search = request.search
  }
  // 排序
  if (request.ordering) {
    var ordering = request.ordering
    var o = ''
    var first = true
    for (var i in ordering) {
      if (first) {
        first = false
      } else {
        o += ','
      }
      o += ordering[i]
    }
    data.ordering = o
  }
  // 每页显示数量
  data.limit = request.limit
  // 显示第几页
  offset = (request.page - 1) * request.limit
  data.offset = offset

  var ret = {
    type: 'get',
    url: this.extraData.url,
    dataType: 'json',
    data: data
  }

  return ret
}

SATable.DRFTable = function(tableInfo) {
  tableInfo.extraData = { url: tableInfo.url }
  tableInfo.requestGenerator = DRFTable.requestGenerator
  tableInfo.dataGenerator = DRFTable.dataGenerator
  saTable = SATable.SimpleAjaxTable(tableInfo)
}