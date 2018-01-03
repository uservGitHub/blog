import * as React from 'react';
import * as ReactDOM from 'react-dom';
import HomePage from './pages/home/index';
import configs from './configs';

ReactDOM.render(
  <HomePage pagination={configs.pagination}/>,
  document.getElementById('wrapper')
);
