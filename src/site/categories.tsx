import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Tags from './pages/tags/index';
import configs from './configs';

ReactDOM.render(
  <Tags tags={configs.categories} title="分类"/>,
  document.getElementById('wrapper')
);
