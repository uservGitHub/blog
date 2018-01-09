import * as Router from 'koa-router';
import articles from '../../articles.DOCS';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import Tags from '../../site/pages/tags/index';
import renderView from '../renderView';
import * as Counter from '../countHelper';

const { categories } = articles;

const categoriesRouter = new Router();

categoriesRouter.get('/', async ( ctx ) => {
  const { total } = <any> await Counter.incrementTotal();
  ctx.body = renderView('categories', {
    categories,
    PV: total,
    html: ReactDOMServer.renderToStaticMarkup(React.createElement(Tags, { tags: categories, title: '分类' }))
  });
});

export default categoriesRouter;
