/**
 * Created by Zhengfeng.Yao on 2017/12/26.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import Wrapper from './Wrapper';
import './styles/index.less';

const MOUNT_NODE = document.getElementById('wrapper');

ReactDOM.render(
  <Wrapper/>,
  MOUNT_NODE
);