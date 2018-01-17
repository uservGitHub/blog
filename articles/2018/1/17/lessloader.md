---
title: Webpack Loader源码导读之less-loader
tags:
  - webpack
  - css
category: 前端
summary: >
  本篇是Webpack Loader源码导读系列中关于less-loader的解读，主要阐述loader的工作，less编译部份的内容未来将单独讲解。
---

## 源码结构

[源码 v4.0.5](https://github.com/webpack-contrib/less-loader)，src目录如下：
```bash
src
|____cjs.js
|____createWebpackLessPlugin.js
|____formatLessError.js
|____getOptions.js
|____index.js
|____processResult.js
|____removeSourceMappingUrl.js
|____stringifyLoader.js
```

## options说明

进入index.js首先看到的是`getOptions(loaderContext)`，这一步的作用是将webpack相关配置及loader的query或options部份配置合并，得到编译过程的可选项

* paths  模块解析的路径，默认使用webpack的resolver，必须是个绝对路径数组；举例，在less中我们想引用node_modules下bootstrap的less文件，可以这样写
`@import "~bootstrap/less/bootstrap";`，默认的模块解析将和webpack一致，但如果loader配置paths，则webpack的解析路径和alias配置在这里将无效。
* plugins  数组，编译时使用的插件，已有的插件见[plugins](http://lesscss.org/usage/#plugins)
* sourceMap  源码映射，需要同css-loader一同配置；可以是boolean类型，也可以是对象，sourceMap相关配置如下：
  *  {String} sourceMapFilename，对应lessc中属性值为String的--source-map选项；
  *  {String} sourceMapRootPath，对应lessc的--source-map-rootpath选项；
  *  {String} sourceMapURL，对应lessc的--source-map-url选项；
  *  {String} sourceMapBasePath，对应lessc的--source-map-basepath选项；
  *  {Boolean} sourceMapLessInline 对应lessc的--source-map-less-inline选项；
  *  {Boolean} sourceMapMapInline 对应lessc的--source-map-map-inline选项；
  *  {Boolean} outputSourceFiles 对应lessc的--source-map-map-inline选项；注意`在less-loader中会将该值默认设置成true`。

less-loader其他的配置，都可以从[less的配置选项](http://lesscss.org/usage/#command-line-usage-options)中找到，全部转成驼峰式即可。

有两个重要的配置`globalVars`和`modifyVars`，这两个是用于添加或修改less变量的，一起看个例子。

main.less
```less
@import "./other.less";

.box:extend(.hotpink) {
  width: @boxWidth;
  height: @boxHeight;
}
```

other.less
```less
@boxHeight: 10px;

.hotpink {
  background: hotpink;
  width: @boxWidth;
}
```
上面的例子中，other.less中定义了变量@boxHeight在main.less中会使用到，值为10px；main.less和other.less中都使用到了@boxWidth，但是并没有定义；
现在我们在webpack.config.js中配置
```js
{
  loader: "less-loader",
  query: {
    sourceMap: true,
    globalVars: {
      "boxWidth": '200px'
    },
    modifyVars: {
      "boxHeight": '200px'
    }
  }
}
```
最后编译没有出错，结果为
```css
.hotpink,
.box {
  background: hotpink;
  width: 200px;
}
.box {
  width: 200px;
  height: 200px;
}
```
在这个例子中，globalVars的作用相当于给每个less文件`顶部`增加一行`@boxWidth: 200px`，所以编译出来的width都为200px，而modifyVars的作用相当于在
每个文件`底部`增加一行`@boxHeight: 200px`，这样就会覆盖已有的`@boxHeight: 10px`，所以最后编译出来的height是200px而不是10px;

这有什么作用呢？
有了这两个配置项，我们就可以把部份样式抽出变量，通过不同的变量组合成不同的主题，例如：
default.less
```less
@primary-color: #003cee;
```
themes/pink.js
```js
module.exports = {
  "@primary-color": 'pink'
};
```
webpack.config.js
```js
{
  loader: 'less-loader',
  query: {
    modifyVars: require('./themes/pink')
  }
}
```

loader中解析了配置以后，就直接调用了[less的render](https://github.com/less/less.js/blob/3.x/lib/less/render.js)方法进行编译，render方法有三个入参`var render = function (input, options, callback)`，
第三个参数是个callback，看render.js源码可以知道，如果不传callback，则render方法会返回一个promise。

## 编译结果处理

看下processResult.js如何处理编译结果，resultPromise就是前面提到的render返回的promise。
```js
function processResult(loaderContext, resultPromise) {
  const { callback } = loaderContext;

  resultPromise
    .then(({ css, map, imports }) => {
      imports.forEach(loaderContext.addDependency, loaderContext);
      return {
        // Removing the sourceMappingURL comment.
        // See removeSourceMappingUrl.js for the reasoning behind this.
        css: removeSourceMappingUrl(css),
        map: typeof map === 'string' ? JSON.parse(map) : map,
      };
    }, (lessError) => {
      throw formatLessError(lessError);
    })
    .then(({ css, map }) => {
      callback(null, css, map);
    }, callback);
}
```
编译后的结果包括css，map和imports三个，css是less编译成的css内容，map则是sourceMap相关信息，imports是编译过程中所有的依赖文件路径。
拿到编译结果后，首先是调用addDependency把所有imports中的文件添加到依赖里面，这个方法的作用时在watch模式时，依赖的这些文件变化时会出发编译更新。
然后是`removeSourceMappingUrl(css)`，这个方法的作用是移除结果中的`sourceMappingURL=`，理由是less-loader无法知道最终的sourceMap会在哪里。
最后调用`callback(null, css, map)`把结果传给下一个loader去执行，less-loader的的工作就完成了。

下一篇我们将继续将css-loader，如何继续处理less-loader编译出来的结果。
