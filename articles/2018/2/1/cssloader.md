---
title: Webpack Loader源码导读之css-loader
tags:
  - webpack
  - css
category: 前端
summary: >
  在上一篇[Webpack Loader源码导读之less-loader](http://hiihl.com/articles/2018/1/17/lessloader.md)我们介绍了less-loader
  本篇是Webpack Loader源码导读系列中关于css-loader的解读，主要阐述loader的工作，及部份配置项作用。
---

## 源码结构

[源码 v0.28.8](https://github.com/webpack-contrib/css-loader)，lib目录如下：

```bash
lib
|____compile-exports.js
|____createResolver.js
|____css-base.js
|____getImportPrefix.js
|____getLocalIdent.js
|____loader.js
|____localsLoader.js
|____processCss.js
```

## 入口文件

css-loader有两个入口文件`lib/loader.js`和`lib/localsLoader.js`

## 配置项概览

| 名称 |类型 | 默认值 | 描述 |
| ----- |----- | ----- | ----- |
| root | String | / | 解析 URL 的路径，以 / 开头的 URL 不会被转译 |
| url | Boolean | true | 启用/禁用 url() 处理 |
| alias | Object | {} | 创建别名更容易导入一些模块 |
| import | Boolean | true | 启用/禁用 @import 处理 |
| modules或module | Boolean | false|启用/禁用 CSS 模块 |
| sourceMap | Boolean | false | 启用/禁用 Sourcemap |
| camelCase | Boolean或String | false | 以驼峰化式命名导出类名 |
| importLoaders | Number | 0 | 在 css-loader 前应用的 loader 的数量 |
| localIdentName | String | \[hash:base64\] | 配置生成的标识符(ident) |

各个配置项的作用，在下面走读代码的过程我们会举例说明去作用；

## processCss

无论是loader.js还是localsLoader.js，都会先解析loader选项，然后执行processCss编译css文件，他们的区别在于对编译结果的处理不通，首先我们先看看processCss做了什么处理。

先跑个示例
b.css
```css
@value colorYellow: yellow;

:local(.className) {
    background: red;
    color: colorYellow;
}

:local(.subClass) {
    composes: className;
    background: blue;
}
```
a.css
```css
@value colorYellow from './b.css';

:local(.aClass) {
    composes: className from './b.css';
    background: colorYellow;
}

.app {
    font-size: 14px;
}
```
loader配置，为了便于看编译结果，我们配置了extract-text-webpack-plugin
```js
{
  test: /\.css$/,
  loader: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [
      {
        loader: "css-loader",
        options: {
          minimize: true,
          sourceMap: true,
          modules: true,
          localIdentName: '[hash:base64]'
        }
      }
    ]
  })
}
```

首先是经过一波postcss([v5.2.17](https://github.com/postcss/postcss/tree/5.2.17))的处理，
先将输入内容做一次parse(代码在postcss/lib/parser.js中)，提取出一些关键字，转成指定对象用于后面解析，转成如下格式的对象：
```json collapsable
{
  "raws": {
    "semicolon": false,
    "after": "\n"
  },
  "type": "root",
  "nodes": [
    {
      "raws": {
        "before": "",
        "between": "",
        "afterName": " "
      },
      "type": "atrule",
      "name": "value",
      "source": {
        "start": {
          "line": 1,
          "column": 1
        },
        "input": {
          "css": "@value colorYellow from './b.css';\n\n:local(.aClass) {\n    composes: className from './b.css';\n    background: colorYellow;\n}\n\n.app {\n    font-size: 14px;\n}\n",
          "file": "/css-loader!/Users/yzf/webpack-tuition/loaders/babel/src/a.css"
        },
        "end": {
          "line": 1,
          "column": 34
        }
      },
      "params": "colorYellow from './b.css'"
    },
    {
      "raws": {
        "before": "\n\n",
        "between": " ",
        "semicolon": true,
        "after": "\n"
      },
      "type": "rule",
      "nodes": [
        {
          "raws": {
            "before": "\n    ",
            "between": ": "
          },
          "type": "decl",
          "source": {
            "start": {
              "line": 4,
              "column": 5
            },
            "input": {
              "css": "@value colorYellow from './b.css';\n\n:local(.aClass) {\n    composes: className from './b.css';\n    background: colorYellow;\n}\n\n.app {\n    font-size: 14px;\n}\n",
              "file": "/css-loader!/Users/yzf/webpack-tuition/loaders/babel/src/a.css"
            },
            "end": {
              "line": 4,
              "column": 39
            }
          },
          "prop": "composes",
          "value": "className from './b.css'"
        },
        {
          "raws": {
            "before": "\n    ",
            "between": ": "
          },
          "type": "decl",
          "source": {
            "start": {
              "line": 5,
              "column": 5
            },
            "input": {
              "css": "@value colorYellow from './b.css';\n\n:local(.aClass) {\n    composes: className from './b.css';\n    background: colorYellow;\n}\n\n.app {\n    font-size: 14px;\n}\n",
              "file": "/css-loader!/Users/yzf/webpack-tuition/loaders/babel/src/a.css"
            },
            "end": {
              "line": 5,
              "column": 28
            }
          },
          "prop": "background",
          "value": "colorYellow"
        }
      ],
      "source": {
        "start": {
          "line": 3,
          "column": 1
        },
        "input": {
          "css": "@value colorYellow from './b.css';\n\n:local(.aClass) {\n    composes: className from './b.css';\n    background: colorYellow;\n}\n\n.app {\n    font-size: 14px;\n}\n",
          "file": "/css-loader!/Users/yzf/webpack-tuition/loaders/babel/src/a.css"
        },
        "end": {
          "line": 6,
          "column": 1
        }
      },
      "selector": ":local(.aClass)"
    },
    {
      "raws": {
        "before": "\n\n",
        "between": " ",
        "semicolon": true,
        "after": "\n"
      },
      "type": "rule",
      "nodes": [
        {
          "raws": {
            "before": "\n    ",
            "between": ": "
          },
          "type": "decl",
          "source": {
            "start": {
              "line": 9,
              "column": 5
            },
            "input": {
              "css": "@value colorYellow from './b.css';\n\n:local(.aClass) {\n    composes: className from './b.css';\n    background: colorYellow;\n}\n\n.app {\n    font-size: 14px;\n}\n",
              "file": "/css-loader!/Users/yzf/webpack-tuition/loaders/babel/src/a.css"
            },
            "end": {
              "line": 9,
              "column": 20
            }
          },
          "prop": "font-size",
          "value": "14px"
        }
      ],
      "source": {
        "start": {
          "line": 8,
          "column": 1
        },
        "input": {
          "css": "@value colorYellow from './b.css';\n\n:local(.aClass) {\n    composes: className from './b.css';\n    background: colorYellow;\n}\n\n.app {\n    font-size: 14px;\n}\n",
          "file": "/css-loader!/Users/yzf/webpack-tuition/loaders/babel/src/a.css"
        },
        "end": {
          "line": 10,
          "column": 1
        }
      },
      "selector": ".app"
    }
  ],
  "source": {
    "input": {
      "css": "@value colorYellow from './b.css';\n\n:local(.aClass) {\n    composes: className from './b.css';\n    background: colorYellow;\n}\n\n.app {\n    font-size: 14px;\n}\n",
      "file": "/css-loader!/Users/yzf/webpack-tuition/loaders/babel/src/a.css"
    },
    "start": {
      "line": 1,
      "column": 1
    }
  }
}
```
其中nodes的类型包括root(跟节点)、atrule(`@`规则)、decl(声明)、comment(注释)和rule(普通规则)几种类型
然后这个nodes会经过一系列插件处理，在插件处理过程中会经常见到walkAtRules、walkRules、walkDecls和walkComments几个方法，这几个方法代码在`postcss/lib/container.js`中，
顾名思义，这几个方法分别是用来解析这几种不同规则的，如`walkAtRules('value',callback)`意思就是解析`@value`规则
在css-loader中使用到了如下几个插件
```js collapsable
var pipeline = postcss([
    modulesValues,
    localByDefault({
        mode: options.mode,
        rewriteUrl: function(global, url) {
            if(parserOptions.url){
                url = url.trim();

                if(!url.replace(/\s/g, '').length || !loaderUtils.isUrlRequest(url, root)) {
                    return url;
                }
                if(global) {
                    return loaderUtils.urlToRequest(url, root);
                }
            }
            return url;
        }
    }),
    extractImports(),
    modulesScope({
        generateScopedName: function generateScopedName (exportName) {
            return customGetLocalIdent(options.loaderContext, localIdentName, exportName, {
                regExp: localIdentRegExp,
                hashPrefix: query.hashPrefix || "",
                context: context
            });
        }
    }),
    parserPlugin(parserOptions)
]);
```

接下来我们来了解下这些插件都做了什么事情

第一个插件是modulesValues([postcss-modules-values v1.3.0](https://github.com/css-modules/postcss-icss-values/tree/v1.3.0))，其作用是解析变量@value，如b.css中
定义了`@value colorYellow: yellow;` 在后面就可以使用`color: colorYellow;`，效果等同`color: yellow;`，在a.css中也可以从b.css导入该值`@value colorYellow from './b.css';`;

第二个插件是localByDefault([postcss-modules-local-by-default v1.2.0](https://github.com/css-modules/postcss-icss-selectors/tree/v1.2.0))，该插件的作用与css-loader的配置项modules有关；
如果modules配置为true，则该插件会给每个类名前加`:local`，这样在js中`import s from './a.css'`时得到的s值为`{ colorYellow: 'yellow', aClass: '_3RfWl8Fjg9j10HraIxvVwo _2WlYzvzC-urSx4y6mIOOFM', app: '_2fkqRy5LeEcw20RyY_eLpM' }`，
否则为`{ colorYellow: 'yellow', aClass: '_3RfWl8Fjg9j10HraIxvVwo _2WlYzvzC-urSx4y6mIOOFM' }`；区别在于a.css中app这个class，在示例代码中`.app`前面没加`:local`则导出的对象中不包含app，
但是modules设置为true时本插件会默认给app加上local，所以导出的对象中就有app。

第三个插件是extractImports([postcss-modules-extract-imports v1.1.0](https://github.com/css-modules/postcss-modules-extract-imports/tree/v1.1.0))，看a.css中的代码，该插件的作用是将
```css
:local(.aClass) {
    composes: className from './b.css';
    background: colorYellow;
}
```
转成
```css
:import("./b.css"){
  className: i__imported_className_0;
}
:local(.aClass) {
    composes: i__imported_className_0;
    background: colorYellow;
}
```

第四个插件是modulesScope([postcss-modules-scope v1.1.0](https://github.com/css-modules/postcss-icss-composes/tree/v1.1.0))，该插件的作用就是export出js中能够引入的对象，会将
```css
:local(.aClass) {
    composes: i__imported_className_0;
    background: colorYellow;
}
```
转成
```css
:export {
  aClass: _3RfWl8Fjg9j10HraIxvVwo
}
._3RfWl8Fjg9j10HraIxvVwo {
    composes: i__imported_className_0;
    background: colorYellow;
}
```
这里暂时不会处理composes。其中转换出来的类名，如`_3RfWl8Fjg9j10HraIxvVwo`是根据配置项`localIdentName: '[hash:base64]'`决定的，如果配置的是
`localIdentName: '[local]'`，则类名不会变，即还是`aClass`。

最后一个插件是parserPlugin，这个代码就在`css-loader/src/processCss.js`中，是css-loader对前面编译结果做的最后处理。
我们给demo增加一个c.css，然后在a.css中导入`@import "./c.css"`，这个插件做了以下事情：

* 如果配置了import: true(默认为true)，则解析@import规则，根据options.root的配置提取出导入模块的url路径，并暂存到importItems中；
* 通过`var icss = icssUtils.extractICSS(css);`从nodes中提取出每个文件的:import与:export信息，:import的内容暂存到imports和importItems中
```js
// imports
{
  "$i__const_colorYellow_0": 1, // 值为importItems中的索引
  "$i__imported_className_0": 2
}
// importItems
[
  {
    "url": "./c.css",
    "mediaQuery": ""
  },
  {
    "url": "./b.css",
    "export": "colorYellow"
  },
  {
    "url": "./b.css",
    "export": "className"
  }
]
```
然后根据imports和importItems将exports从
```json
{
  "colorYellow": "i__const_colorYellow_0",
  "aClass": "_3RfWl8Fjg9j10HraIxvVwo i__imported_className_0",
  "app": "_2fkqRy5LeEcw20RyY_eLpM"
}
```
转换成
```json
{
  "colorYellow": "___CSS_LOADER_IMPORT___1___", // 1，2即为importItems中的索引
  "aClass": "_3RfWl8Fjg9j10HraIxvVwo ___CSS_LOADER_IMPORT___2___",
  "app": "_2fkqRy5LeEcw20RyY_eLpM"
}
```
* 将nodes中声明节点的值`i__const_colorYellow_0`都替换成`___CSS_LOADER_IMPORT___1___`形式的；

经过所有插件处理以后结果是这样的(当然中间还有个minimize配置为true时会走cssnano压缩，这里略过了)：
```css
/* a.css */
._3RfWl8Fjg9j10HraIxvVwo{background:___CSS_LOADER_IMPORT___1___}._2fkqRy5LeEcw20RyY_eLpM{font-size:14px}
/* b.css */
._2WlYzvzC-urSx4y6mIOOFM{background:red;color:#ff0}._2ZjxOCWmD5GtQv4c-EHJ1g{background:blue}
/* c.css */
._2W2YIQ3PA5I9QGXroo7b2m{display:block}
```

## loader最后处理

对于上面的处理结果，还存在着`___CSS_LOADER_IMPORT___1___`这样的内容，显然还不是最终结果，回到我们的入口文件`loader.js`看看最后的处理，
当然，如果你使用的loader是`css-loader/locals`，则入口文件是`localsLoader.js`。
loader.js最后要做的就是拼出最后module.exports要导出去的模块，将依赖的模块通过正则表达式`/___CSS_LOADER_IMPORT___([0-9]+)___/g`及前面解析出来的`importItems`
替换成`require("-!../node_modules/css-loader/index.js?{\"minimize\":true,\"sourceMap\":true,\"modules\":true,\"localIdentName\":\"[hash:base64]\"}!./b.css").locals["colorYellow"]`格式的
最终导出模块，在js中可以直接import进来得到一个对象
```js collapsable
/* a.css */
exports = module.exports = require("../node_modules/css-loader/lib/css-base.js")(true);
// imports
exports.i(require("-!../node_modules/css-loader/index.js?{\"minimize\":true,\"sourceMap\":true,\"modules\":true,\"localIdentName\":\"[hash:base64]\"}!./c.css"), "");
exports.i(require("-!../node_modules/css-loader/index.js?{\"minimize\":true,\"sourceMap\":true,\"modules\":true,\"localIdentName\":\"[hash:base64]\"}!./b.css"), undefined);

// module
exports.push([module.id, "._3RfWl8Fjg9j10HraIxvVwo{background:" 
  + require("-!../node_modules/css-loader/index.js?{\"minimize\":true,\"sourceMap\":true,\"modules\":true,\"localIdentName\":\"[hash:base64]\"}!./b.css").locals["colorYellow"] 
  + "}._2fkqRy5LeEcw20RyY_eLpM{font-size:14px}", "", {"version":3,"sources":["/Users/yzf/webpack-tuition/loaders/babel/src/a.css"],"names":[],"mappings":"AAGA,yBAEI,sCAAwB,CAC3B,AAED,yBACI,cAAgB,CACnB","file":"a.css","sourcesContent":["@import \"./c.css\";\n@value colorYellow from './b.css';\n\n:local(.aClass) {\n    composes: className from './b.css';\n    background: colorYellow;\n}\n\n.app {\n    font-size: 14px;\n}\n"],"sourceRoot":""}]);

// exports
exports.locals = {
	"colorYellow": "" + require("-!../node_modules/css-loader/index.js?{\"minimize\":true,\"sourceMap\":true,\"modules\":true,\"localIdentName\":\"[hash:base64]\"}!./b.css").locals["colorYellow"] + "",
	"aClass": "_3RfWl8Fjg9j10HraIxvVwo " + require("-!../node_modules/css-loader/index.js?{\"minimize\":true,\"sourceMap\":true,\"modules\":true,\"localIdentName\":\"[hash:base64]\"}!./b.css").locals["className"] + "",
	"app": "_2fkqRy5LeEcw20RyY_eLpM"
};

/* b.css */
exports = module.exports = require("../node_modules/css-loader/lib/css-base.js")(true);
// imports

// module
exports.push([module.id, "._2WlYzvzC-urSx4y6mIOOFM{background:red;color:#ff0}._2ZjxOCWmD5GtQv4c-EHJ1g{background:blue}", "", {"version":3,"sources":["/Users/yzf/webpack-tuition/loaders/babel/src/b.css"],"names":[],"mappings":"AAEA,yBACI,eAAgB,AAChB,UAAmB,CACtB,AAED,yBAEI,eAAiB,CACpB","file":"b.css","sourcesContent":["@value colorYellow: yellow;\n\n:local(.className) {\n    background: red;\n    color: colorYellow;\n}\n\n:local(.subClass) {\n    composes: className;\n    background: blue;\n}\n"],"sourceRoot":""}]);

// exports
exports.locals = {
	"colorYellow": "yellow",
	"className": "_2WlYzvzC-urSx4y6mIOOFM",
	"subClass": "_2ZjxOCWmD5GtQv4c-EHJ1g _2WlYzvzC-urSx4y6mIOOFM"
};
/* c.css */
exports = module.exports = require("../node_modules/css-loader/lib/css-base.js")(true);
// imports

// module
exports.push([module.id, "._2W2YIQ3PA5I9QGXroo7b2m{display:block}", "", {"version":3,"sources":["/Users/yzf/webpack-tuition/loaders/babel/src/c.css"],"names":[],"mappings":"AAAA,yBACI,aAAe,CAClB","file":"c.css","sourcesContent":[".test {\n    display: block;\n}\n"],"sourceRoot":""}]);

// exports
exports.locals = {
	"test": "_2W2YIQ3PA5I9QGXroo7b2m"
};
```
```css
/* 合并后main.css */
._2W2YIQ3PA5I9QGXroo7b2m{display:block}._2WlYzvzC-urSx4y6mIOOFM{background:red;color:#ff0}._2ZjxOCWmD5GtQv4c-EHJ1g{background:blue}._3RfWl8Fjg9j10HraIxvVwo{background:yellow}._2fkqRy5LeEcw20RyY_eLpM{font-size:14px}
/*# sourceMappingURL=main.css.map*/
```
如果是在服务端使用`css-loader/locals`则不搭配ExtractTextPlugin，处理结果为
```js
/* a.css */
module.exports = {
	"colorYellow": "" + require("-!../node_modules/css-loader/locals.js??ref--1-0!./b.css")["colorYellow"] + "",
	"aClass": "_3RfWl8Fjg9j10HraIxvVwo " + require("-!../node_modules/css-loader/locals.js??ref--1-0!./b.css")["className"] + "",
	"app": "_2fkqRy5LeEcw20RyY_eLpM"
};
/* b.css */
module.exports = {
	"colorYellow": "yellow",
	"className": "_2WlYzvzC-urSx4y6mIOOFM",
	"subClass": "_2ZjxOCWmD5GtQv4c-EHJ1g _2WlYzvzC-urSx4y6mIOOFM"
};
```
c.css没有模块导出

## 小结

这个解析过程有点长，但是css-loader对css处理的主要过程基本都提到了，我们也能够知道经过这个loader以后样式变成什么样，导出了什么模块；当然，上面提到的
@import @value composes等特性在使用less或者sass等其他css预编译时是用不到的，因为他们有自己的语法，我们一般不会去使用这些特性；
css-loader处理完以后，在实际使用时我们在最后都会再经过style-loader处理，有时搭配ExtractTextPlugin，那么这两个loader或插件又做了什么呢？我们下篇见。
如果喜欢请点赞，欢迎关注我的博客[hiihl](http://hiihl.com)。
