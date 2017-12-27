/**
 * Created by Zhengfeng.Yao on 2017/12/26.
 */
import assets from '../website/assets.json';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as Router from 'koa-router';

const app = new Koa();

const home = new Router();

home.get('/', async ( ctx ) => {
  ctx.body = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>hihl_妖风</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
      <link rel="stylesheet" href="${assets.home.css}">
    </head>
    <body class="is-loading">
      <div id="wrapper" class="fade-in overlay"></div>
      <script src="${assets.home.js}"></script>
    </body>
  </html>
  `;
});

// 装载所有子路由
const router = new Router();
router.use('/', home.routes(), home.allowedMethods());

app.use(bodyParser());

// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => console.log(`The server is running at http://localhost:3000/`));