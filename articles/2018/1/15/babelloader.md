---
title: Webpack Loader源码导读之babel-loader
tags:
  - webpack
  - babel
category: 前端
summary: >
  webpack应该是当下最主流的前端构建工具之一，但是由于webpack本身糟糕的文档，使得使用者多是会用但不知其所以然，出现问题时难以入手；
  为此，我想根据自身的理解，详细讲解一些常用loader、plugin源码，深入各个loader及其配置所带来的影响；本系列将以babel-loader开篇，
  但只讲述babel-loader所做的事情，对于babel部份的内容，将在未来开篇详谈。
---

## 源码结构

先看下[源码](https://github.com/babel/babel-loader/tree/master/src)src目录下的整体结构
```bash
|src
|——utils
|  |——exists.js  
|  |——read.js
|  |——relative.js
|——fs-cache.js
|——index.js
|——resolve-rc.js
```

## 配置说明

首先，我们进入`index.js`，找到`module.exports = function(source, inputSourceMap)`，这里就是babel-loader的入口了。
每个webpack loader返回的都是一个function，这个function有两个参数，第一个是待处理的代码，第二个参数是上一loader处理后的sourcemap，如果有的话。
进入loader以后，首先是获取文件名，再通过`loaderUtils.getOptions`获取loader的配置，即query部份，其中babel-loader支持的配置有：
* babelrc 配置文件`.babelrc`的位置，值false时不使用配置文件，配置为具体路径且文件存在时直接使用该文件，否则按默认处理(从当前文件位置开始向上查找
`.babelrc`、`.babelrc.js`或使用`package.json`中的babel配置，具体见`resolve-rc.js`)
* cacheDirectory 是否缓存目录，默认`false`;设置为true时使用默认缓存目录`node_modules/.cache/babel-loader`或者系统默认临时文件目录`os.tmpdir()`;
也可以设置具体的文件夹路径
* cacheIdentifier 缓存标识符；默认包括babel-core、babel-loader的版本号，.babelrc的内容以及`BABEL_ENV`(没有时会取`NODE_ENV`)的值
* sourceMap 是否输出源码，默认值与webpack配置devtool一致;配置此值时，将无视devtool的配置。
* forceEnv Babel编译的环境变量，默认不配置，环境变量先取BABEL_ENV再取NODE_ENV。当配置此值时，该值将覆盖BABEL_ENV和NODE_ENV。
* metadataSubscribers 订阅元数据。这个配置在文档中并没有写出来，但是是允许配置的。主要作用是订阅一些编译过程中的一些元数据，订阅以后这些元数据将会被添加
到webpack的上下文中。通常我们是用不上的，估计在某些babel-plugin中可能会使用到。数据大概是这样的，记录一些module导入导出的信息：
```json
{
  "usedHelpers": [
    "createClass",
    "classCallCheck"
  ],
  "marked": [],
  "modules": {
    "imports": [],
    "exports": {
      "exported": [
        "Test"
      ],
      "specifiers": [
        {
          "kind": "local",
          "local": "Test",
          "exported": "default"
        }
      ]
    }
  }
}
```

## cache详解

真正的编译过程都是在babel-core中执行的，babel-loader的主要作用时babel-core所需配置的一些初始化，以及编译结果的缓存，现在我们主要讲下缓存。
我们先修改下babel-loader的配置:
```js
{
  test: /\.jsx?$/,
  loader: 'babel-loader',
  include: [path.resolve(process.cwd(), 'src')],
  exclude: [path.resolve(process.cwd(), 'node_modules')],
  query: {
    cacheDirectory: path.resolve(process.cwd(), 'tmp') // 配置缓存目录到当前项目tmp下，方便等下查看缓存文件
  }
}
```
cacheIdentifier的默认值如下，如果我们配置了此值，将覆盖默认值而非合并，所以暂时先不设置该值。
```js
JSON.stringify({
  "babel-loader": pkg.version,
  "babel-core": babel.version,
  babelrc: babelrcPath ? read(fileSystem, babelrcPath) : null,
  env:
    loaderOptions.forceEnv ||
    process.env.BABEL_ENV ||
    process.env.NODE_ENV ||
    "development",
})
```
当我们配置了cacheDirectory时，loader会先查找缓存文件是否存在，文件名是通过下列方法计算得出
```js
const filename = function(source, identifier, options) {
  const hash = crypto.createHash("SHA1");
  const contents = JSON.stringify({
    source: source,
    options: options,
    identifier: identifier,
  });

  hash.end(contents);

  return hash.read().toString("hex") + ".json.gz";
};
```
可以看到，文件名是以源码`source`、loader选项`options`以及loader标识符`identifier`三个值的json字符串经过SHA1编码得到的，所以当这三个值任意一个
发生变化时，都会导致文件名发生变化。
当缓存文件不存在，或者以上三个值发生变化导致缓存文件名变成一个不存在的文件时，会调用`babel-core`的`transform`方法进行编译，编译结果包含`code`、
`map`、`metadata`三个，其中map即与源码的一些映射关系，这三个内容将保存在缓存文件中；
缓存文件是一个经过压缩的JSON内容长这样：
```bash
|tmp
|  |-- 9d08ce6a6158ff5416a96e2290c7243607f9f5c8.json.gz
|  |-- cceb4d9049dfb84308e4cdd7eeedbdadc98c7c09.json.gz
```
缓存的内容示例：
```json collapsable
{
  "code": "'use strict';\n\nvar _test = require('./test');\n\nvar _test2 = _interopRequireDefault(_test);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar test = new _test2.default();\n\nconsole.log(test.toString());",
  "map": {
    "version": 3,
    "sources": [
      "src/index.js"
    ],
    "names": [
      "test",
      "console",
      "log",
      "toString"
    ],
    "mappings": ";;AAAA;;;;;;AAEA,IAAMA,OAAO,oBAAb;;AAEAC,QAAQC,GAAR,CAAYF,KAAKG,QAAL,EAAZ",
    "file": "index.js",
    "sourceRoot": "/Users/yzf/webpack-tuition/loaders/babel",
    "sourcesContent": [
      "import Test from './test';\n\nconst test = new Test();\n\nconsole.log(test.toString());\n"
    ]
  },
  "metadata": {
    "usedHelpers": [
      "interopRequireDefault"
    ],
    "marked": [],
    "modules": {
      "imports": [
        {
          "source": "./test",
          "imported": [
            "default"
          ],
          "specifiers": [
            {
              "kind": "named",
              "imported": "default",
              "local": "Test"
            }
          ]
        }
      ],
      "exports": {
        "exported": [],
        "specifiers": []
      }
    }
  }
}
```
当缓存文件存在时，则将缓存中的编译结果read直接使用。

## 小结

babel-loader做的事情其实比较简单，本文只是作为一个引子，开启webpack常用loader的揭秘之路，对于babel整个编译过程，未来可能会单独开篇深入讲解，
如有兴趣欢迎关注我的博客[hiihl.com](http://hiihl.com)。
