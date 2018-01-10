---
title: 使用 React + Koa2 + Markdown 从零搭建博客（三）
tags: 
  - react
  - koa2
  - typescript
  - webpack
category: 前端
summary: >
  使用react + koa2 + Markdown + webpack + typescript 从零手撸个人博客，
  本篇介绍如何实现使用leanCloud统计博客的历史访问量。
---

## 选择leanCloud的原因

1、暂时懒得去自己写，等后续自己写的时候再迁移；
<br/>2、百度统计每周只能获取2000次统计结果；
<br/>3、[leanCloud](https://leancloud.cn/)的数据API请求每天免费使用3w次，也就是写加读两次请求可用获取一次统计结果，只要日PV不超过1.5w，都可以免费，完全够用。

## 创建leanCloud存储表

首先创建应用：

<img src="/images/2018-1-9-setupblog1.jpg"/>

然后进入存储，创建一个名为Counter的表，并添加key,time两个列，并为key建立索引，不是什么重要的数据，所以我设置了所有人可读写

<img src="/images/2018-1-9-setupblog1.jpg"/>

添加一条key值为total的行数据，作为历史访问量的统计

## node服务端接入

每个应用都有对应的appId和appKey，在读写数据时，需要先通过appId和appKey进行初始化；

部份代码如下：

```js
import * as AV from 'leancloud-storage';
import * as config from 'config';
import * as R from 'ramda';

// 从配置文件读取appId与appKey
AV.init(config.get('leanCloud'));

const Counter = AV.Object.extend('Counter');

/**
 * 添加历史访问量
 */
async function incrementTotal() {
  try {
    const query = new AV.Query(Counter);
    const totalData = (<any> await query.equalTo('key', 'total').find())[0];
    const total = AV.Object.createWithoutData('Counter', totalData.id);
    total.increment('time', 1);
    const data = <any> await total.save(null, { fetchWhenSave: true }); // 保存后获取最新数据
    return R.objOf('total', data.attributes.time);
  } catch(e) {
    console.log(e);
  }
}
```
上述代码中，appId和appKey是从配置文件中读取，production环境的配置不会提交到github，避免泄漏。
在页面被访问时，调用incrementTotal()，并获取最新的访问量，并注入到页面全局变量`window.__CONFIG__`中，在footer.tsx `componentDidMount`中设置此值
```js
  componentDidMount() {
    const PV = (window as any).__CONFIG__.PV;
    this.setState({ PV });
  }
```
## 总结
   整个系列中，涉及到的点较多，由于本人以前较少写文章，可能不够有条理，如有问题可以qq或者发邮件联系，我会抽空解答。本博客暂时没时间加评论功能，
后续会抽空加一下。PS：博客最终是部署在阿里云ECT上，1核2G的打2折买了3年，平均一年500+。
