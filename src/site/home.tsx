import * as React from 'react';
import * as ReactDOM from 'react-dom';
import HomePage from './pages/home/index';
import ats from './ats';

ReactDOM.render(
  <HomePage articles={ats}/>,
  document.getElementById('wrapper')
);
