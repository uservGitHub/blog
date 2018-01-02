import * as React from 'react';
import * as ReactDOM from 'react-dom';
import HomePage from './pages/home/index';
import pagination from './pagination';

ReactDOM.render(
  <HomePage pagination={pagination}/>,
  document.getElementById('wrapper')
);
