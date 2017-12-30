/**
 * Created by Zhengfeng.Yao on 2017/12/29.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import Wrapper from '../../Wrapper';
import './home.less';
import Home from './home';

const MOUNT_NODE = document.getElementById('wrapper');

ReactDOM.render(
  <Wrapper>
    <Home />
  </Wrapper>,
  MOUNT_NODE
);
