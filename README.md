# Simple AJAX Table

简（~~陋~~）单的AJAX表格，支持简单的搜索、筛选、分页功能。（排序功能正在添加……）

# 依赖

以下内容需要在此js文件之前引用：

* jQuery v3.1.1

* Bootstrap v4.0.0-alpha.6

* Font Awesome 4.7.0

# 使用

## 生成表格

在引用simpleAjaxTable.js后，在需要引入表格的地方添加div标签：

```
<div id="yourTableID"></div>
```

在JavaScript脚本中执行：

```
simpleAjaxTable.init(tableInfo)
```

其中tableInfo为包含表格参数的键值对集合。

## 表格参数

此为tableInfo需给出的信息，具体使用可参见最后的例子。

* id

    类型：String

    需要生成表格的div标签的id

* title

    类型：String

    表格的标题

* column

    类型：Array

    表格从左到右包含哪些列，其中元素为包含列参数的键值对集合。

    列的参数有：

    * name：列的名字，将获得的数据填入表格时将使用此名称识别数据应当填入哪一列

    * caption：显示在表头上的列的名字

    * type：可选，如果需要对列的数据进行处理，可添加此参数，目前支持的类型：

        * "datetime"：将数据中的时间转换为本地时间格式

* filter

    类型：Array

    筛选可筛选哪些内容，其中元素为包含某一筛选条目参数的键值对集合。

    目前筛选的表单仅支持input标签，参数基本为对input标签的设置。

    * name：即input的name参数，用于生成请求时使用的也是此名

    * type：即input的type参数

    * placeholder：即input的placeholder参数

    * caption：显示在输入框左侧标签的参数

* requestGenerator

    类型：Function
    
    目前，Simple AJAX Table不能自动生成完整的AJAX请求，使用时需要给出处理的函数，以生成AJAX请求所需的部分参数。

    requestGenerator为生成请求各参数的函数，格式如下：

    ```
    function(limit, page, filter, search, ordering)
    ```

    * 输入：

        * limit：

            类型：数字

            每页显示的结果数量

        * page：

            类型：数字

            显示第几页的结果

        * filter：

            类型：键值对集合

            筛选信息，为包含筛选信息的键值对，其中键为表格参数filter中的name，值为该筛选项的值

        * search：

            类型：String

            目前仅支持搜索单一项

            此参数为字符串，为搜索的信息

        * ordering：

            类型：Array

            空数组，目前暂不需要，留作之后排序用……
    
    * 返回值：

        函数的返回值应为配置AJAX请求的键值对集合，和jQuery的ajax方法同名的参数相同，如下：

        * type：请求的类型

        * url：请求发送的地址

        * dataType：预期服务器返回的数据类型

        * data：发送到服务器的数据

* dataGenerator

    类型：Function

    目前需要给出处理的函数，根据AJAX请求返回的数据返回需要填入表格的数据。

    requestGenerator为生成请求各参数的函数，格式如下：

    ```
    function(ret)
    ```

    * 输入：

        * ret：AJAX请求返回的数据的js对象

    * 返回值：

        函数的返回值应为包含如下键值对的集合：

        * count
            
            类型：数字
            
            结果的数量（可选）

        * results

            类型：Array

            表格数据，数组中元素为包含表格一行信息的键值对集合，键为表格参数column中列参数的name，值即为此行此列的值。

# 举个栗子

这是一个获得题目列表的例子，通过Simple AJAX Table请求[Django REST Framework](http://www.django-rest-framework.org)搭建的某后台并将结果显示到表格中。

## HTML

```
<div id="problem"></div>
```

## JavaScript

```
simpleAjaxTable.init({
  id: "problem",
  title: "题目列表",
  column: [
    { name: "id", caption: "ID" },
    { name: "title", caption: "标题" },
    { name: "introduction", caption: "简介" },
    { name: "create_time", caption: "创建时间", type: "datetime" },
    { name: "update_time", caption: "更新时间", type: "datetime" }
  ],
  filter: [
    { name: "creator", type: "text", placeholder: "用户名", caption: "创建者" },
    { name: "updater", type: "text", placeholder: "用户名", caption: "更新者" }
  ],
  requestGenerator: function(limit, page, filter, search, ordering) {
    var url = "/problems/"
    var requestData = {
      search: search,
      limit: limit,
      offset: (page - 1) * limit
    }
    for(var i in filter) {
      requestData[i] = filter[i]
    }

    return {
      type: "get",
      url: url,
      dataType: "json",
      data: requestData
    }
  },
  dataGenerator: function(ret) {
    results = ret.results

    return {
      count: ret.count,
      results: ret.results
    }
  }
})
```