import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as Router from 'koa-router';
import * as Static from 'koa-static-cache';
import * as convert from 'koa-convert';
import * as config from 'config';
import home from './routers/home';
import articles from './routers/articles';
import tags from './routers/tags';
import categories from './routers/categories';
import about from './routers/about';
import hl from './routers/hl';

const path = require('path');
const port = config.get('port');
const cacheOptions = config.get('cache');

const app = new Koa();

// 装载所有子路由
const router = new Router();
router.use('/', home.routes(), home.allowedMethods());
router.use('/articles', articles.routes(), articles.allowedMethods());
router.use('/tags', tags.routes(), tags.allowedMethods());
router.use('/about', about.routes(), about.allowedMethods());
router.use('/categories', categories.routes(), categories.allowedMethods());
router.use('/hl', hl.routes(), hl.allowedMethods());

app.use(bodyParser())
   .use(convert(Static(path.join(__dirname, '../website'), cacheOptions)))
   .use(convert(Static(path.join(process.cwd(), 'public'), cacheOptions)))
   .use(router.routes())
   .use(router.allowedMethods()); // 加载路由中间件

app.listen(port, () => console.log(`The server is running at http://localhost:${port}/`));
