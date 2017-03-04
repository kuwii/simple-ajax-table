# Simple AJAX Table

简（~~陋~~）单的AJAX表格，并提供扩展，可自动生成创建表单和详情界面。

试图提供一套相对统一完整的界面，使得在前端对数据的操作只需关心数据本身，而不必过于关心界面的样式和数据操作的实现。

* 自动生成AJAX表格

    ![](https://raw.githubusercontent.com/kawaiiQ/simple-ajax-table/master/docs/SimpleAjaxTable.png)

    * 支持筛选、搜索、排序、分页。
    
    * 根据数据类型对表格中数据进行简单处理。

* 自动生成AJAX表单

    ![](https://raw.githubusercontent.com/kawaiiQ/simple-ajax-table/master/docs/SimpleAjaxForm.png)

    * 根据不同数据类型生成不同的输入框。

    * 对于select标签选项可通过AJAX获取选项。

    * 通过AJAX请求执行创建操作，成功后跳转到指定页面。

* 自动生成AJAX详情界面

    ![](https://raw.githubusercontent.com/kawaiiQ/simple-ajax-table/master/docs/SimpleAjaxInfo.png)

    * AJAX获取单条数据详情。
    
    * 支持通过GET/POST/PUT/PATCH/DELETE请求对数据进行修改更新

    * 对于select标签选项可通过AJAX获取选项。
    
    * 支持对数据的简单处理。

    * 通过AJAX请求执行更新操作，成功后刷新页面。

    * 通过AJAX请求执行删除操作，成功后跳转到指定页面。

## 依赖

以下内容需要在此js文件之前引用（可在dependency文件夹中找到对应内容）：

* jQuery v3.1.1

* Bootstrap v4.0.0-alpha.6

* Font Awesome 4.7.0

* [markdown-js](https://github.com/evilstreak/markdown-js)（如需要Markdown支持则引用）

## 使用

### 引用文件

引用所依赖的内容之后，引用目录中的```sat.core.js```文件，此文件包含了AJAX表格和扩展功能所需的必要方法。

以下文件是对核心功能的扩展，根据需要自行引用：

* sat.create.js扩展了自动生成创建表单的功能，如果需要，在sat.core.js文件之后引用。

* sat.update.js扩展了自动生成详情界面的功能，如果需要，在sat.core.js文件之后引用。

* sat.drf.js提供了适配Django REST Framework后台的适配器，默认提供了一些核心及扩展功能所需手动提供的方法，如果需要，请在最后引用。

### AJAX表格

在需要生成表格的地方添加div标签，并设置ID以供标识：

```
<div id="yourTableID"></div>
```

在JavaScript脚本中执行：

```
SATable.SimpleAjaxTable(tableInfo)
```

其中tableInfo为包含表格参数的键值对集合，具体参数参见```docs/SimpleAjaxTable.md```中的说明。

### AJAX表单

本功能为Simple AJAX Table的扩展功能，需引用相应扩展文件。

可在需要执行创建操作的一类页面生成AJAX表单。

在需要生成表单的地方添加div标签，并设置ID以供标识：
```
<div id="yourFormID"></div>
```
在JavaScript脚本中执行：
```
SATable.SimpleAjaxForm(formInfo)
```
其中formInfo为包含表格参数的键值对集合，具体参数参见```docs/SimpleAjaxForm.md```中的说明。

### AJAX详情界面（**尚在完善中……**）

本功能为Simple AJAX Table的扩展功能，需引用相应扩展文件。

可在需要显示资源详情，并可能需要提供修改功能的一类页面生成相应的界面。

在需要生成界面的地方添加div标签，并设置ID以供标识：

```
<div id="yourInfoID"></div>
```
在JavaScript脚本中执行：

```
SATable.SimpleAjaxInfo(instanceInfo)
```
其中instanceInfo为包含界面参数的键值对集合，具体参数参见```docs/SimpleAjaxInfo.md```中的说明。
