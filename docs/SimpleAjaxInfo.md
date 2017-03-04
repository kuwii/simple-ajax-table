# SimpleAjaxForm

此类提供一套简（~~陋~~）单的AJAX详情界面，可在需要显示资源详情，并可能需要提供修改功能的一类页面生成相应的界面。

**SimpleAjaxForm尚在完善中**

## 功能

* AJAX获取单条数据详情。
    
* 支持通过GET/POST/PUT/PATCH/DELETE请求对数据进行修改更新

* 对于select标签选项可通过AJAX获取选项。
    
* 支持对数据的简单处理。

* 通过AJAX请求执行更新操作，成功后刷新页面。

* 通过AJAX请求执行删除操作，成功后跳转到指定页面。

## 使用方法

### 引用文件

本功能为Simple AJAX Table的扩展功能，需引用相应扩展文件。

在引用sat.core.js之后，引用sat.update.js文件即可。

### 生成表单

在需要生成表单的地方添加div标签，并设置ID以供标识：

```
<div id="yourInfoID"></div>
```

在JavaScript脚本中执行：

```
SATable.SimpleAjaxInfo(instanceInfo)
```

其中instanceInfo为包含表格参数的键值对集合。

### 界面参数

此为instanceInfo需给出的信息，具体使用可参见最后的例子。

* id

    类型：String

    需要生成详情界面的div标签的id。

* title

    类型：String

    标题

* getMethod

    类型：String

    查询资源信息AJAX请求的类型，可以是GET或POST。

* getURL

    类型：String

    查询资源信息AJAX请求的url

* updateMethod

    类型：String

    更新资源信息时AJAX请求的类型，可以是GET、POST、PUT、PATCH、DELETE中的一种。

* updateURL

    类型：String

    更新资源信息时AJAX请求的url。

* removeMethod

    类型：String

    **可选**，删除资源时AJAX请求的类型，可以是GET、POST、PUT、PATCH、DELETE中的一种。

    如果提供此参数，界面将显示删除按钮。

* removeURL

    类型：String

    **可选**，如果提供了removeMethod参数，则需要指定删除请求的url。

* removeToURL

    类型：String

    **可选**，如果提供了removeMethod参数，则需要指定删除成功后跳转到的页面的url。


* items

    类型：Array

    自上至下包含哪些项，其中元素为包含对应项参数的键值对集合或字符串“Divide”。
    
    若为字符串“Divide”，则将在此处显示一个分割线；否则显示一个数据项。

    每项的参数有：

    * name

        类型：String
    
        该项的名字，提交数据时使用此名称作为数据键值对的键。

    * caption
    
        类型：String

        显示在表单标签上的名字。

    * readOnly

        类型：Boolean

        该项是否为只读项，即不可修改。

    * type
    
        类型：String
        
        此项的数据为何等类型的数据，根据类型不同生成不同的输入框，可选项为：
        
        * Boolean：数据为布尔值，要么为是要么为否。

        * Number：数据为数字。

        * Text：数据为文本，根据给出附加信息的不同将进一步划分类型，参见typeInfo项。

        * Datetime：数据为时间，**目前此类型数据只可读，不提供修改方法**。

        * File：数据为文件，**目前此类型数据只可上传，不可读**

        * Select：数据为选项，在一些给定的选项中选择一至多个作为输入值，此类型数据需要给出附加信息，参见typeInfo项。

        * Item: 数据为嵌套对象，**目前只可读嵌套对象的其中一个字段，且只可读**，此类型数据需要给出附加信息，参见typeInfo项。

        可在typeInfo参数中添加writeOnly参数并设置为true，设置该项为只写项。
    
    * typeInfo

        类型：键值对集合

        对于某些特殊类型的数据，需要给出附加信息以便数据填入表格时能够按预期形式填入。

        * Text类型的数据

            * article

                类型：Boolean

                设置为true后，将支持显示空格回车等空白符，而不是忽略之后一行显示出来。

                对于一些长文本或文章，适用此参数。
            
            * markdown

                类型：Boolean

                设置为true后，则视为此项数据为Markdown格式文本，将解析并以正确格式显示出来。

                **需要引用依赖项里的markdown相关文件**
            
            * code

                类型：Boolean

                设置为true后，则视为此项数据为代码文本，将支持显示空格回车等空白符，且以等宽字符显示。

            以上三项只能三选一，且不可与password同时设置，设置后输入框将为textarea标签，否则为input标签。

            * password

                类型：Boolean

                是否为密码

            * max_length
            
                类型：Number
                
                输入的最大长度。
        
        * Item类型的数据

            对于Item类型的数据，**目前只可读**，根据提供的参数包括：

            * field
            
                类型：String
                
                显示嵌套对象的哪一个字段。

            * readOnly

                类型：Boolean

                必为true

            * type
            
                类型：String

                同type参数。

            * typeInfo

                类型：键值对集合

                同typeInfo参数。

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
                
                有时候，一次请求无法获取全部数据（某些后台可能提供了分页的数据），此时可使用参数中saForm对象本身的```requestSelectData(saForm, selectDom, item， value)```方法继续请求。具体使用方法，可参见```sat.drf.js```中对Django Rest Framework分页数据的请求方法。

                参数（自左向右）：

                * saForm：此SimpleAjaxForm对象本身。

                * selectDom：此输入项select标签的dom对象。

                * item：item参数里对应此项的对象。

                * ret：服务器返回的数据。

                * value：该项的值。

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
