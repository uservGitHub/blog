/**
 * Created by Zhengfeng.Yao on 2017/12/26.
 */
import assets from '../website/assets.json';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as Router from 'koa-router';
import * as Static from 'koa-static';
import articles from './articles.DOCS';
import * as R from 'ramda';

const path = require('path');

const pageSize = 10;

const app = new Koa();

const home = new Router();

function renderView(page: any, config: any) {
 return `
  <!DOCTYPE html>
  <html>
    <head>
      <title>hihl_妖风</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
      <link rel="stylesheet" href="${assets[page].css}">
      <script> window.__CONFIG__ = ${JSON.stringify(config)} </script>
    </head>
    <body class="is-loading">
      <div id="wrapper" class="fade-in overlay"></div>
      <script src="${assets[page].js}"></script>
    </body>
  </html>
  `;
}

home.get('/', async ( ctx ) => {
  const current = ctx.query.page || 1;
  const offset = (current - 1) * pageSize;
  ctx.body = renderView('home', {
    categories: articles.categories,
    tags: articles.tags,
    total: articles.mdsArray.length,
    pageSize,
    articles: R.slice(offset, offset + pageSize)(articles.mdsArray)
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
