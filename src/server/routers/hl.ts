import * as Router from 'koa-router';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import assets from '../website/assets.json';
import App from '../../hl/App';

function renderView(page: string, config: any) {
  const { html } = config;
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <title>黄鸾的简历</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
      <link rel="stylesheet" href="/font-awesome-4.7.0/css/font-awesome.min.css">
      <link rel="stylesheet" href="${assets[page].css}">
    </head>
    <body class="is-loading">
      <div id="wrapper" class="fade-in overlay">${html}</div>
      <script src="${assets[page].js}"></script>
    </body>
  </html>
  `;
}

const router = new Router();

router.get('/', async ctx => {
  ctx.body = renderView('hl', {
    html: ReactDOMServer.renderToStaticMarkup(React.createElement(App))
  });
});

export default router;
