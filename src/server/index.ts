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

const path = require('path');

const pageSize = 10;

const app = new Koa();

const home = new Router();

function renderView(page: any, config: any) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <title>hihl</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
      <link rel="stylesheet" href="${assets[page].css}">
      <script> window.__CONFIG__ = ${JSON.stringify({ pagination: config.pagination })} </script>
    </head>
    <body class="is-loading">
      <div id="wrapper" class="fade-in overlay">${config.html}</div>
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

// 装载所有子路由
const router = new Router();
router.use('/', home.routes(), home.allowedMethods());

app.use(bodyParser())
   .use(Static(path.join(__dirname, '../website')))
   .use(router.routes())
   .use(router.allowedMethods()); // 加载路由中间件

app.listen(3000, () => console.log(`The server is running at http://localhost:3000/`));
