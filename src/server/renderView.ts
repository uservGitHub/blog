import assets from '../website/assets.json';

export default function renderView(page: string, config: any) {
  const { html, ...others } = config;
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <title>hihl|亦文</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
      <link rel="stylesheet" href="${assets[page].css}">
      <script> window.__CONFIG__ = ${JSON.stringify(others)} </script>
    </head>
    <body class="is-loading">
      <div id="wrapper" class="fade-in overlay">${html}</div>
      <script src="${assets[page].js}"></script>
    </body>
  </html>
  `;
}
