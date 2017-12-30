/**
 * Created by Zhengfeng.Yao on 2017/12/29.
 */
import React from 'react';
import './container.less';

export default function Container({ children }) {
  return (
    <div id="container" className="container">
      {
        children
      }
    </div>
  );
}
