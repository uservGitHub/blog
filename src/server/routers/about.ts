import * as Router from 'koa-router';
import About from '../../site/pages/about/index';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import renderView from '../renderView';

const aboutRouter = new Router();

aboutRouter.get('/', async ( ctx ) => {
  ctx.body = renderView('about', {
    html: ReactDOMServer.renderToStaticMarkup(React.createElement(About, {}))
  });
});

export default aboutRouter;
