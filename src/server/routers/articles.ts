import * as Router from 'koa-router';
import articles from '../../articles.DOCS';
import Article from '../../site/pages/articles/index';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import renderView from '../renderView';
import * as Counter from '../countHelper';

const articlesRouter = new Router();

articlesRouter.get('/:year/:month/:day/:filename', async ( ctx ) => {
  const { year, month, day, filename } = ctx.params;
  const fileKey = `/${year}/${month}/${day}/${filename}`;
  const article = articles.mdsArray.find((item: any) => item.key === fileKey);
  if (!article) {
    ctx.body = '文章不存在';
  } else {
    const PVS = <any> await Counter.incrementReading(fileKey);
    ctx.body = renderView('articles', {
      article,
      PV: PVS.total,
      APV: PVS[fileKey],
      html: ReactDOMServer.renderToStaticMarkup(React.createElement(Article, { article }))
    });
  }
});

export default articlesRouter;
