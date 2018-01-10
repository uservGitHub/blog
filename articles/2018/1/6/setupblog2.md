---
title: 使用 React + Koa2 + Markdown 从零搭建博客（二）
tags: 
  - react
  - koa2
  - typescript
  - webpack
category: 前端
summary: >
  使用react + koa2 + Markdown + webpack + typescript 从零手撸个人博客，
  本篇介绍如何实现webpack-loader之articles-loader，其中涉及到Ramda.js的使用，带你了解函数式编程；
  同时，了解此部份内容以后，博主后续将带你了解ant.design如何将markdown文件转化为在线组件demo文档。
---

## 目录结构

<img src="/images/2018-1-6-setupblog1.jpg"/>

说明：
lib  编译后的代码
src
   transforms 解析器，目前只有一个markdown.js，未来可能会有扩展
     markdown.js  最终解析markdown文件的代码
   utils  工具集
     executor.js 子线程执行解析markdown的执行器
     runTask.js 调试时使用，单线程执行解析
     scheduler.js 多线程解析markdown的调度器
     source-handler.js 构建文件树的handler
   index.js 入口文件

首先要知道，一个webpack loader需要输出什么；
从上图红框部份可以看到，loader最终调用了callback方法，并返回了一段`module.exports`的字符串；
此处export出去的module就是最终项目中`import`某个module所得到的对象，如上一篇文章中的`import articles from '../articles.DOCS'`，
如何实现一个webpack loader，更详细的请参考[writing a loader](https://doc.webpack-china.org/contribute/writing-a-loader/)。

## 实现分析

index.js
```js
const fs = require('fs');
const path = require('path');
const R = require('ramda');
const sourceHandler = require('./utils/source-handler');
const scheduler = require('./utils/scheduler');
const defaultRoot = path.resolve(process.cwd(), 'articles');

const concat = obj => key => value => obj[key] = R.sortBy(
  R.compose((date) => new Date(date).getTime(), R.prop('date'))
)(R.union(obj[key], [value])).reverse();
  
/*   中间省略，完整代码请移步https://github/hihl/blog   */  

const markdown = sourceHandler.traverse(root, filePath => {
    const content = fs.readFileSync(filePath).toString();
      pickedPromises.push(new Promise(resolve => {
        scheduler.queue({
          filePath,
          content,
          callback(err, result) {
            const parsedMarkdown = JSON.parse(result);
            const category = parsedMarkdown.meta.category;
            const fileKey = '/' + filePath.split('/').slice(-4).join('/');
            const date = filePath.split('/').slice(-4, -1).join('-');
            const { title, summary } = parsedMarkdown.meta;
    
            mds[fileKey] = {
              key: fileKey,
              title,
              summary,
              content: parsedMarkdown.content,
              category,
              tags: parsedMarkdown.meta.tags,
              date
            };
    
            const value = { key: fileKey, title, summary, date};
            concat(categories)(category)(value);
            R.forEach(key => concat(tags)(key)(value), parsedMarkdown.meta.tags);
    
            resolve();
          }
        });
      }));
  });
```

看上述代码，`sourceHandler.traverse`将会解析`root`目录下的文件，
并将有效的filePath传到回调方法，
而回调方法中将读取文件内容，并转为task添加到调度器中，
调度器执行完该任务后，将result传到回调方法callback中，
callback中做最后的组装，拼装需要导出module所需的数据，包括所有按日期排序的类别、标签及文章

## 解析文件树

source-handler.js
```js
function readDirs(filter, dir) {
  return R.filter(filter)(fs.readdirSync(dir));
}

/**
 * 构建文件树，并解析md文件
 * 目录结构为
 * root
 *   |-- year 年份
 *         |-- month 月份
 *               |-- day 日期
 *                     |-- filename 文件名(全路径)
 */
function readFilesTreeStructure(root, fn) {
  return R.pipe(
    R.map(year => R.pipe(
      R.pipe(
        R.map(month => R.pipe(
          R.pipe(
            R.map(day => R.pipe(
              R.map(filename => {
                const filePath = path.join(root, year, month, day, filename);
                fn(filePath);
                return filePath;
              }),
              R.objOf(day)
            )(readDirs(R.endsWith('.md'), path.join(root, year, month, day)))),
            R.reduce(R.mergeDeepLeft, {})
          ),
          R.objOf(month)
        )(readDirs(R.and(R.lte(1), R.gte(maxDay(year, month))), path.join(root, year, month)))),
        R.reduce(R.mergeDeepLeft, {})
      ),
      R.objOf(year)
    )(readDirs(R.and(R.lte(1), R.gte(12)), path.join(root, year)))),
    R.reduce(R.mergeDeepLeft, {})
  )(readDirs(R.lt(0), root));
}

exports.traverse = function(root, fn) {
  if (!root || !isDirectory(root)) {
    return {};
  }
  return readFilesTreeStructure(root, fn);
};
```

看上述代码，`readFilesTreeStructure`的作用是，从根目录root开始，解析出json结构的文件树，并把每个解析到的合法的文件路径传给回调方法fn，
期间还过滤了非法的年月日目录及非法文件后缀。
下来详细讲解下上述代码，再次之前，请大家先了解下[Ramda](http://ramda.cn/docs/):
<br/>1、首先看最外层的pipe，先是`readDirs(R.lt(0), root)`读取错root目录下，目录名是数字且大于0(`R.lt(0)`)的子目录`[years]`
<br/>2、再对读出来的子目录做一次map、reduce，reduce操作是将map出来的数组合并成一个Object，即`{}`，接下来再看map操作得出的是怎样的数组
<br/>3、map中再次做了类似1、2的步骤，先是readDirs，只不过读取的目录变成`path.join(root, year)`，过滤条件变成了`R.and(R.lte(1), R.gte(12))`
<br/>4、下来是对步骤3中读取的目录做一次map、reduce，通过`R.objOf(year)`把reduce后得到的对象解析为`{ [year]: reduce的结果 }`的结构，
<br/>5、重复以上步骤，最终解析出来的结构就是`{[year]:{[month]:{[day]:filename}}}`

下面贴一段不使用Ramda的代码作为对比，区别大家自行感受。
```js
function readDirs(filter, dir) {
  return fs.readdirSync(dir).filter(filter);
}

function readFilesTreeStructure(root, fn) {
  return readDirs(o => o > 0, root)
    .map(year => {
      const months = readDirs(o => o >=1 && o <= 12, path.join(root, year))
        .map(month => {
          const days = readDirs(o => o >=1 && o <= maxDay(year, month), path.join(root, year, month))
            .map(day => {
              return readDirs(o => o.endsWith('.md'), path.join(root, year, month, day))
                .map(filename => {
                  const filePath = path.join(root, year, month, day, filename);
                  fn(filePath);
                  return filePath;
                });
            })
            .reduce((result, value) => {/*一段merge的代码*/}, {});
          return {
            [month]: days
          };
        })
        .reduce((result, value) => {/*一段merge的代码*/}, {});
      return {
        [year]: months
      };
    })
    .reduce((result, value) => {/*一段merge的代码*/}, {});
}
```
## 解析markdown文件内容

在上述步骤中，我们解析出了文件树结构`{[year]:{[month]:{[day]:filename}}}`，过程中调用了`fn(filePath)`，此fn即为index.js中的回调方法，
该方法首先先读取出文件内容`const content = fs.readFileSync(filePath).toString();`，再组装成task，丢到executor中执行解析
executor的逻辑非常简单，将content丢给transforms/markdown.js解析
```js
const YFM = require('yaml-front-matter');

module.exports = function MT(markdown) {
  const ret = {};
  const raw = YFM.loadFront(markdown);
  ret.content = raw.__content;
  delete raw.__content;
  ret.meta = raw;
  return ret;
};
```
我们每个markdown文件头部都是一段yaml配置，包括该文章的title、标签、分类及简要，使用[yaml-front-matter](https://www.npmjs.com/package/yaml-front-matter)这个库解析，
对于文章的内容部份`__content`，本文并没有做更多解析，因为图个简单，全部交给了[react-markdown](https://www.npmjs.com/package/react-markdown)。

## 小结
articles-loader的分析就到此结束了，其中的思路大体和dva解析markdown的思路一致的，先了解此问，再去看dva部份代码，相信是有所帮助的；
下一篇，我们将介绍，如何使用leanCloud给站点添加访问量统计，敬请期待。
源码地址：[https://github.com/hihl/blog](https://github.com/hihl/blog)
