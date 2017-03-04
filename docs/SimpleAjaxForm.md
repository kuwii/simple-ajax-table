# SimpleAjaxForm

此类提供一套简（~~陋~~）单的AJAX表单，可在需要执行创建操作的一类页面生成AJAX表单。

## 功能

* 生成表单

* 根据不同数据类型生成不同输入框

* AJAX提交数据，成功后跳转到指定页面

## 使用方法

### 引用文件

本功能为Simple AJAX Table的扩展功能，需引用相应扩展文件。

在引用```sat.core.js```之后，引用```sat.create.js```文件即可。

### 生成表单

在需要生成表单的地方添加div标签，并设置ID以供标识：

```
<div id="yourFormID"></div>
```

在JavaScript脚本中执行：

```
SATable.SimpleAjaxForm(formInfo)
```

其中formInfo为包含表格参数的键值对集合。

### 表单参数

此为formInfo需给出的信息，具体使用可参见最后的例子。

* id

    类型：String

    需要生成表单的div标签的id。

* method

    类型：String

    AJAX请求的类型，可以是GET或POST。

* toSuccess

    类型：String

    创建成功后跳转到的页面的url。

    目前暂不支持跳转到详情页面。

* url

    类型：String

    AJAX请求发送的url。

* items

    类型：Array

    表单自上至下包含哪些项，其中元素为包含对应项参数的键值对集合。

    每项的参数有：

    * name

        类型：String
    
        该项的名字，提交数据时使用此名称作为数据键值对的键。

    * caption
    
        类型：String

        显示在表单标签上的名字。

    * type
    
        类型：String
        
        此项的数据为何等类型的数据，根据类型不同生成不同的输入框，可选项为：

        * Boolean：数据为布尔值，要么为是要么为否。

        * Text：数据为文本，根据给出附加信息的不同将进一步划分类型，参见typeInfo项。

        * Select：数据为选项，在一些给定的选项中选择一至多个作为输入值，此类型数据需要给出附加信息，参见typeInfo项。

        * Number：数据为数字。

        * Email：数据为电子邮箱地址。

        * Password: 数据为密码，可给出附加信息以做限制，参见typeInfo项。
    
    * typeInfo

        类型：键值对集合

        对于某些特殊类型的数据，需要给出附加信息以便数据填入表格时能够按预期形式填入。

        * Text类型的数据

            对于Text类型的数据，根据提供的参数进一步决定具体类型，参数包括：

            * max_length
            
                类型：Number
                
                输入的最大长度，如果给出了此参数，则生成input标签，若无此参数或无typeInfo项，则生成textarea标签。
        
        * Password类型的数据

            对于Password类型的数据，根据提供的参数包括：

            * max_length
            
                类型：Number
                
                密码的最大长度。

            * confirm
            
                类型：Boolean

                是否需要确认，如果为true，则会额外生成一个确认的输入框。

        * Select类型的数据

            对于Select类型的数据，支持直接给出选项，也支持通过AJAX请求获取选项，参数包括：

            * many

                类型：Boolean

                是否支持多选。
            
            * ajax

                类型：Boolean

                所需选项是否需要通过AJAX请求获得。

                如果需要，则需要给出ajaxInfo、responseHandler（可选）、dataGenerator三个参数。
                
                如果不需要，则需要给出choices参数提供选项。

            * ajaxInfo

                类型：键值对集合

                AJAX请求所需参数，包括：

                * type

                    类型：String

                    请求类型。
                    
                * url

                    类型：String

                    请求的url。

                * dataType

                    类型：String

                    服务器返回的数据类型。
            
            * responseHandler

                类型：Function

                有时在处理服务器返回的数据后可能需要根据返回的数据继续进行某些操作，则提供此方法扩展。
                
                有时候，一次请求无法获取全部数据（某些后台可能提供了分页的数据），此时可使用参数中saForm对象本身的```requestSelectData(saForm, selectDom, item)```方法继续请求。具体使用方法，可参见```sat.drf.js```中对Django Rest Framework分页数据的请求方法。

                参数（自左向右）：

                * saForm：此SimpleAjaxForm对象本身。

                * selectDom：此输入项select标签的dom对象。

                * item：item参数里对应此项的对象。

                * ret：服务器返回的数据。

                返回值：无需返回值

            * dataGenerator

                类型：Function

                对于AJAX请求返回的数据，因为后台的多种多样，各不相同，且希望显示的选择项的名字也不尽相同他，所以SimpleAjaxForm无法自行处理返回的数据，需要提供此方法处理数据。

                参数：

                * ret： 服务器返回的数据

                返回值：

                Array，需要加入选项中的可选项，其中元素为形如```{ text: 'TEXT', value: 'VALUE' }```的对象，text为显示在选框中的名称，value为提交数据时显示的名称。

            * choices

                类型：Array

                如果不需要通过AJAX获得选项，则需要用此参数提供可选项，其中元素为形如```{ text: 'TEXT', value: 'VALUE' }```的对象，text为显示在选框中的名称，value为提交数据时显示的名称。


## 举个栗子

这是一个SDUSTOJ中在题元里创建题目的例子。

这里仅为示意，故省去了requestHandler的具体实现，使用了sat.drf.js中的方法，详细可参见sat.drf.js中的实现。

### HTML

```
<div id="problem"></div>
```

### JavaScript（使用sat.core.js）

```
var descriptions = [{ text: '不使用描述', value: null }]
var samples = [{ text: '不使用样例', value: null }]

function getOptionsDescription(ret) {
  var results = ret.results
  for (var i in results) {
    var obj = results[i]
    var text = obj.id + ': ' + obj.title
    var value = obj.id
    descriptions.push({ text: text, value: value })
  }
  return descriptions
}

function getOptionsSample(ret) {
  var results = ret.results
  for (var i in results) {
    var obj = results[i]
    var text = obj.id + ': ' + obj.title
    var value = obj.id
    samples.push({ text: text, value: value })
  }
  return samples
}

SATable.SimpleAjaxForm({
  id: 'problem',
  method: 'POST',
  toSuccess: '/api-admin/meta-problems/1/problems/',
  url: '/api-admin/meta-problems/1/problems/',
  items: [
    { name: 'available', caption: '可用', type: 'Boolean', defaultTrue: true },
    { name: 'title', caption: '标题', type: 'Text', typeInfo: { max_length: 128 } },
    { name: 'introduction', caption: '简介', type: 'Text', typeInfo: { max_length: 512 } },
    { name: 'source', caption: '来源', type: 'Text', typeInfo: { max_length: 256 }},
    { name: 'author', caption: '作者', type: 'Text', typeInfo: { max_length: 64 } },
    {
      name: 'description_id',
      caption: '描述',
      type: 'Select',
      typeInfo: {
        ajax: true,
        ajaxInfo: {
          type: 'GET',
          url: '/api-admin/meta-problems/1/descriptions/',
          dataType: 'json'
        },
        responseHandler: SATable.DRF.keepRequest,
        dataGenerator: getOptionsDescription
      }
    },
    {
      name: 'sample_id',
      caption: '样例',
      type: 'Select',
      typeInfo: {
        ajax: true,
        ajaxInfo: {
          type: 'GET',
          url: '/api-admin/meta-problems/1/samples/',
          dataType: 'json'
        },
        responseHandler: SATable.DRF.keepRequest,
        dataGenerator: getOptionsSample
      }
    }
  ]
})
```
