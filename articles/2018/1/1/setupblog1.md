---
title: 使用 React + Koa2 + Markdown 从零搭建博客（一）
tags: 
  - react
  - koa2
  - typescript
  - webpack
category: 前端
summary: >
  使用react + koa2 + Markdown + webpack + typescript 从零手撸个人博客，本篇首先介绍如何使用
  tdtool(自己基于webpack2的一个简单封装)搭建koa2 + typescript + react的同构工程。
---

## 目录结构

<img src="/images/2018-1-1-setupblog1.jpg"/>

首先按照上图规划目录结构：
articles 存放所有的markdown文件，按照年/月/日的目录层级划分，文章以.md后缀
public 静态资源目录，如图片等
src
   server 服务端代码位置
   site 前端代码位置
     config.ts 同构数据
     styles.less 公共样式
     xxx.tsx 页面入口
     pages 具体页面的实现
     layout 整体布局
tdtool.config.js tdtool的配置文件，tdtool是基于webpack2的一个封装，可参考[tdtool](https://tdtool.github.io)后续会有介绍文章。
tsconfig.json typescript编译选项配置文件

## tdtool配置

tdtool内置了一部份webpack配置，以下配置为扩展配置

```js collapsable
const siteConfig = new Config({
  entry: {
    home: './src/site/home.tsx',
    articles: './src/site/articles.tsx',
  },
  dist: './dist/website',
  filename: isDebug ? '[name].js?[hash]' : '[name].[hash].js',
  minimize: !isDebug,
  sourceMap: isDebug,
  extends: [['less', { // less + postcss + extractTextPlugin的一个组合，用于解析编译less
    extractCss: {
      filename: '[name].css?[hash]'
    }
  }]]
});

siteConfig.add('rule.ts', { // 添加babel + ts的loader
  test: /\.tsx?$/,
  exclude: /node_modules/,
  use: [{
    loader: 'babel-loader',
    query: {
      cacheDirectory: true,
      babelrc: false,
      presets: [
        'es2015-ie',
        'react',
        'stage-2',
      ],
      plugins: [
        'transform-decorators-legacy',
        'transform-class-properties',
        'transform-runtime'
      ]
    }
  }, {
    loader: 'ts-loader'
  }]
});

siteConfig.add(  // 添加assetsPlugin 导出assets.json文件，供server端使用
  'plugin.AssetsPlugin',
  new AssetsPlugin({
    path: './dist/website',
    filename: 'assets.json',
    prettyPrint: true,
  })
);

/* 服务端配置 */
const serverConfig = new Config({
  entry: './src/server/index.ts',
  dist: './dist/server',
  target: 'node',
  filename: 'main.js',
  devServer: isDebug, // dev模式时tdtool会使用到此配置，并添加热加载, 多个config中只能配置一个devServer
  sourceMap: true,
  externals: [/^\.\.\/website\/assets\.json$/, require('webpack-node-externals')()],
  extends: [['less', {
    target: 'node'
  }]]
});

serverConfig.add('rule.ts', { // 因为node版本支持大部份es6，服务端不使用babel编译
  test: /\.tsx?$/,
  loader: 'ts-loader',
  exclude: /node_modules/
});

function loadCommon(config, key) {
  config.add('resolve.extensions', [".tsx", ".ts", ".js"]);
  config.add(
    'plugin.CleanWebpackPlugin',
    new CleanWebpackPlugin(
      [key],
      {
        root,                                  //根目录
        verbose:  true,        　　　　　　　　　　//开启在控制台输出信息
        dry:      false        　　　　　　　　　　//启用删除文件
      }
    )
  );
  // 自己实现的一个loader，用于收集markdown文件中category、tags、title等meta信息
  // 后续会有文章介绍
  config.add('rule.articles', { 
    test: /\.DOCS$/,
    loader: 'articles-loader',
    query: {
      root: path.join(__dirname, 'articles')
    }
  });

  // 本博客使用到了部份bootstrap样式及图标
  config.add('rule.glyphicons', {
    test: /glyphicons-halflings-regular\.(woff|woff2|ttf|eot|svg)($|\?)/,
    use: [{
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'fonts/[name].[ext]'
      }
    }]
  });
  // 图片文件的loader
  config.add('rule.IMAGE', {
    test: /\.(png|jpg|jpeg|gif)?$/i,
    loader: 'url-loader',
    query: {
      limit: 10000,
      name: '[name]-[hash:5].[ext]'
    }
  });
}

loadCommon(siteConfig, 'website');
loadCommon(serverConfig, 'server');

module.exports = [siteConfig.resolve(), serverConfig.resolve()];
```
## 同构

本次没有使用React-Router

#### 客户端

以主页home为例

入口文件
```js
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import HomePage from './pages/home/index';
import configs from './configs';

ReactDOM.render(
  <HomePage pagination={configs.pagination}/>,
  document.getElementById('wrapper')
);
```
HomePage是页面实现代码
`configs`是初始化数据，挂在`window.__CONFIG__`下的，由服务端注入

config.ts代码如下
```js
export default (<any>window).__CONFIG__;
```
#### 服务端

home路由代码示例

router/home.ts
```js
import * as Router from 'koa-router';
import articles from '../../articles.DOCS';
import * as R from 'ramda';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import Home from '../../site/pages/home/index';
import renderView from '../renderView';

const pageSize = 10;

const home = new Router();

home.get('/', async ( ctx ) => {
  const current = ctx.query.page || 1;
  const offset = (current - 1) * pageSize;
  const ats = R.slice(offset, offset + pageSize)(articles.mdsArray);
  const total = articles.mdsArray.length;
  const pagination = {
    current,
    total,
    articles: ats
  };
  ctx.body = renderView('home', {
    pagination,
    html: ReactDOMServer.renderToStaticMarkup(React.createElement(Home, { pagination }))
  });
});

export default home;

```
`pagination`对象即为前后端同构所需数据，服务端通过React.createElement(Home, { pagination })直接传递给组件，
客户端通过下面的方式注入

renderView.ts
<img src="/images/2018-1-1-setupblog2.jpg"/>

其中`others`对应home.ts中的`pagination`，从上述代码可以看出该值注入到`window.__CONFIG__`中供前端使用
`assets`就是前端编译输出的文件映射关系，如下：
```json
{
  "articles": {
    "js": "/articles.40099d3476b9654d29e2.js",
    "css": "/articles.css?40099d3476b9654d29e2"
  },
  "tags": {
    "js": "/tags.40099d3476b9654d29e2.js",
    "css": "/tags.css?40099d3476b9654d29e2"
  },
  "categories": {
    "js": "/categories.40099d3476b9654d29e2.js",
    "css": "/categories.css?40099d3476b9654d29e2"
  },
  "home": {
    "js": "/home.40099d3476b9654d29e2.js",
    "css": "/home.css?40099d3476b9654d29e2"
  },
  "about": {
    "js": "/about.40099d3476b9654d29e2.js",
    "css": "/about.css?40099d3476b9654d29e2"
  }
}
```
`articles.DOCS`即是通过articles-loader收集的md文章信息。
<br/>收集上来的信息包含哪些？请见[使用 React + Koa2 + Markdown 从零搭建博客（二）](/articles/2018/1/6/setupblog2.md)
<br/>源码地址：[https://github.com/hihl/blog](https://github.com/hihl/blog)
