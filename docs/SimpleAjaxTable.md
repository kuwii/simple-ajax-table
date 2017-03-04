# SimpleAjaxTable

此类提供一套简（~~陋~~）单的AJAX表格，可用在需要显示资源列表的一类页面中。

## 功能

* 生成表格

* AJAX获取数据

* 筛选、搜索、按字段排序

* 分页、每页显示数量调整

## 使用方法

### 引用文件

此为Simple AJAX Table的基础功能，只需引用```sat.core.js```即可。

### 生成表格

在需要生成表格的地方添加div标签，并设置ID以供标识：

```
<div id="yourTableID"></div>
```

在JavaScript脚本中执行：

```
SATable.SimpleAjaxTable(tableInfo)
```

其中tableInfo为包含表格参数的键值对集合。

## 表格参数

此为tableInfo需给出的信息，具体使用可参见最后的例子。

* id

    类型：String

    需要生成表格的div标签的id。

* title

    类型：String

    表格的标题。

* search

    类型：Boolean

    表格是否支持搜索，如为真，则表格将显示搜索框。

    **可选**，目前搜索仅支持单一搜索框。

* createURL

    类型：String

    **可选**，如设置此项，则表格将显示创建按钮，点击后将跳转至字符串中设定的URL地址。

* columns

    类型：Array

    表格从左到右包含哪些列，其中元素为包含列参数的键值对集合。

    列的参数有：

    * name

        类型：String
    
        列的名字，将获得的数据填入表格时将使用此名称识别数据所属于的列。

    * caption
    
        类型：String

        显示在表头上的列的名字。

    * type
    
        类型：String
        
        此列的数据为何等类型的数据，可选项为：

        * Datetime：数据为日期时间，数据填入表格时将自动转换为本地时间格式。

        * Boolean：数据为布尔值，数据填入表格时将自动转换为“√”或“×”。

        * Text：数据为文本，数据填入表格时将不加处理直接填入文本。

        * Link：数据为超链接，点击后能够跳转到详情页面，此类型数据需要给出附加信息，见typeInfo项。
    
    * typeInfo

        类型：键值对集合

        对于某些特殊类型的数据，需要给出附加信息以便数据填入表格时能够按预期形式填入。

        * Link类型的数据

            对于Link类型的数据，目前支持以“基地址/主键/”的形式指定超链接。

            * base_url

                类型：String

                基地址。
            
            * key

                类型：String

                主键来源于哪一列的数据，需要是columns中某一列的name值。


* filters

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
    
    （对于Django REST Framework搭建的后台API，目前以提供适配器提供requestGenerator方法。）

    requestGenerator为生成请求各参数的函数，格式如下：

    ```
    function(requestData) {
      // TO DO ...
    }
    ```

    * 输入：

        * requestData

            类型：键值对集合

            请求的具体内容，包含如下键值对：

            * filters

                类型：键值对集合

                需要筛选的信息。
                
                键为需要筛选的字段名，是columns中需要过滤的列的name值。
                
                值为筛选值，应只显示指定字段为筛选值的结果。
            
            * search

                类型：String

                要搜索的内容。

            * ordering

                类型：Array

                要排序的字段，按表格从左到右的顺序给出。

                Array内部均为String类型对象，为columns中需要排序的列的name值，如果是正序直接给出，如果为倒序，则前面会加上‘-’符号。例如，“ID”需要正序则为“ID”，倒序则为“-ID”。
            
            * limit

                每页显示多少行数据。

            * page

                显示第几页数据。
                
    * 返回值：

        函数的返回值应为配置AJAX请求的键值对集合，和jQuery的ajax方法同名的参数相同，需要且只需要提供：

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

        * ret：AJAX请求从服务器返回的数据。

    * 返回值：

        函数的返回值应为包含如下键值对的集合：

        * count
            
            类型：数字
            
            结果的数量（可选）

        * data

            类型：Array

            表格数据，数组中每一个对象都是包含表格一行信息的键值对集合，键为表格参数column中列参数的name，值即为此行此列的值。

            数组中数据将从前之后在表格中从上至下填入。

## 举个栗子

这是一个获得题目列表的例子，通过Simple AJAX Table请求[Django REST Framework](http://www.django-rest-framework.org)搭建的某后台并将结果显示到表格中。

这里仅为示意，故省去了requestGenerator，dataGenerator的具体实现，详细可参见sat.drf.js中的实现。

### HTML

```
<div id="problem"></div>
```

### JavaScript（使用sat.core.js）

```
SATable.SimpleAjaxForm({
  id: 'problem',
  title: '题目',
  search: true,
  filters: [
    { name: 'creator', type: 'text', placeholder: '请输入创建者用户名', caption: '创建者' },
    { name: 'updater', type: 'text', placeholder: '请输入更新者用户名', caption: '更新者' }
  ],
  columns: [
    { name: 'id', caption: 'ID', sort: true, ordering: 1, type: 'Link', typeInfo: { base_url: '/home/', key: 'id' } },
    { name: 'title', caption: '标题', sort: true, type: 'Link', typeInfo: { base_url: '/home/', key: 'id' } },
    { name: 'available', caption: '对外可用', type: 'Boolean' },
    { name: 'create_time', caption: '创建时间', sort: true, type: 'Datetime' },
    { name: 'update_time', caption: '更新时间', sort: true, type: 'Datetime' },
  ],
  createURL: '/',
  requestGenerator: function(request) {
    // SOME CODE ...
  },
  dataGenerator: function(data) {
    // SOME CODE ...
  }
})
```

### JavaScript（使用sat.drf.js）

因为提供了默认的requestGenerator和dataGenerator方法，故无需自行实现方法。

但由于requestGenerator并不知道表格的URL，因此在原表格基础上需要给出请求的URL，参见下面的例子。

```
SATable.DRFTable({
  id: 'envs',
  title: '题目',
  url: '/problems/',
  search: true,
  filters: [
    { name: 'creator', type: 'text', placeholder: '请输入创建者用户名', caption: '创建者' },
    { name: 'updater', type: 'text', placeholder: '请输入更新者用户名', caption: '更新者' }
  ],
  columns: [
    { name: 'id', caption: 'ID', sort: true, ordering: 1, type: 'Link', typeInfo: { base_url: '/home/', key: 'id' } },
    { name: 'title', caption: '标题', sort: true, type: 'Link', typeInfo: { base_url: '/home/', key: 'id' } },
    { name: 'available', caption: '对外可用', type: 'Boolean' },
    { name: 'create_time', caption: '创建时间', sort: true, type: 'Datetime' },
    { name: 'update_time', caption: '更新时间', sort: true, type: 'Datetime' },
  ],
  createURL: '/'
})
```
