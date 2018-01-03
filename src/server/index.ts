/**
 * Created by Zhengfeng.Yao on 2017/12/26.
 */
import assets from '../website/assets.json';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as Router from 'koa-router';
import * as Static from 'koa-static';
import articles from '../articles.DOCS';
import * as R from 'ramda';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import Home from '../site/pages/home/index';
import Article from '../site/pages/articles/index';

const path = require('path');

const pageSize = 10;

const app = new Koa();

const home = new Router();

function renderView(page: any, config: any) {
  const { html, ...others } = config;
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <title>hihl|亦山</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
      <link rel="stylesheet" href="${assets[page].css}">
      <script> window.__CONFIG__ = ${JSON.stringify(others)} </script>
    </head>
    <body class="is-loading">
      <div id="wrapper" class="fade-in overlay">${html}</div>
      <script src="${assets[page].js}"></script>
    </body>
  </html>
  `;
}

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

const articlesRouter = new Router();

articlesRouter.get('/:year/:month/:day/:filename', async ( ctx ) => {
  const { year, month, day, filename } = ctx.params;
  const fileKey = `/${year}/${month}/${day}/${filename}`;
  const article = articles.mdsArray.find((item: any) => item.key === fileKey);
  if (!article) {
    ctx.body = '文章不存在';
  } else {
    ctx.body = renderView('articles', {
      article,
      html: ReactDOMServer.renderToStaticMarkup(React.createElement(Article, { article }))
    });
  }
});

// 装载所有子路由
const router = new Router();
router.use('/', home.routes(), home.allowedMethods());
router.use('/articles', articlesRouter.routes(), articlesRouter.allowedMethods());

app.use(bodyParser())
   .use(Static(path.join(__dirname, '../website')))
   .use(router.routes())
   .use(router.allowedMethods()); // 加载路由中间件

app.listen(3000, () => console.log(`The server is running at http://localhost:3000/`));
