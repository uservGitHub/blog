import * as Router from 'koa-router';
import articles from '../../articles.DOCS';
import Article from '../../site/pages/articles/index';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import renderView from '../renderView';

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

export default articlesRouter;
