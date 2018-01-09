import * as Router from 'koa-router';
import About from '../../site/pages/about/index';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import renderView from '../renderView';
import * as Counter from '../countHelper';

const aboutRouter = new Router();

aboutRouter.get('/', async ( ctx ) => {
  const { total } = <any> await Counter.incrementTotal();
  ctx.body = renderView('about', {
    PV: total,
    html: ReactDOMServer.renderToStaticMarkup(React.createElement(About, {}))
  });
});

export default aboutRouter;
