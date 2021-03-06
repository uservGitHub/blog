import assets from '../website/assets.json';

export default function renderView(page: string, config: any) {
  const { html, ...others } = config;
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <title>hihl</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
      <link rel="stylesheet" href="/font-awesome-4.7.0/css/font-awesome.min.css">
      ${page === 'articles' ? '<link rel="stylesheet" href="/highlight/9.12.0/monokai.min.css">' : ''}
      <link rel="stylesheet" href="${assets[page].css}">
      <script> window.__CONFIG__ = ${JSON.stringify(others)} </script>
    </head>
    <body class="is-loading">
      <div id="wrapper" class="fade-in overlay">${html}</div>
      ${page === 'articles' ? '<script src="/highlight/9.12.0/highlight.min.js"></script>' : ''}
      <script>
        var _hmt = _hmt || [];
        (function() {
          var hm = document.createElement("script");
          hm.src = "https://hm.baidu.com/hm.js?2dc6c12306b87633571e51941e0a12c5";
          var s = document.getElementsByTagName("script")[0]; 
          s.parentNode.insertBefore(hm, s);
        })();
      </script>
      <script src="${assets[page].js}"></script>
    </body>
  </html>
  `;
}
