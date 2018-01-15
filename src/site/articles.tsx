import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ArticlePage from './pages/articles/index';
import configs from './configs';

ReactDOM.render(
  <ArticlePage article={configs.article} previous={configs.previous} next={configs.next}/>,
  document.getElementById('wrapper')
);
