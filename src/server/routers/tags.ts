import * as Router from 'koa-router';
import articles from '../../articles.DOCS';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import Tags from '../../site/pages/tags/index';
import renderView from '../renderView';

const { tags } = articles;

const tagsRouter = new Router();

tagsRouter.get('/', async ( ctx ) => {
  ctx.body = renderView('tags', {
    tags,
    html: ReactDOMServer.renderToStaticMarkup(React.createElement(Tags, { tags, title: '标签' }))
  });
});

export default tagsRouter;