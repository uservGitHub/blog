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
