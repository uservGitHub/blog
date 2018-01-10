import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Tags from './pages/tags/index';
import configs from './configs';

ReactDOM.render(
  <Tags tags={configs.tags} title="标签"/>,
  document.getElementById('wrapper')
);
