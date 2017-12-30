/**
 * Created by Zhengfeng.Yao on 2017/12/29.
 */
import React from 'react';
import './nav.less';

// const categories = Object.keys(window.__CONFIG__.categories);

export default function Nav() {
  return (
    <div id="nav" className="nav">
      <ul className="nav-menu links">
        <li>
          <a href="/">主页</a>
        </li>
        <li>
          <a>类别</a>
          {/*<ul className="submenu">*/}
            {/*{*/}
              {/*categories.map((category, index) => (*/}
                {/*<li key={index}>*/}
                  {/*<a href={`/categories/${category}`}>{category}</a>*/}
                {/*</li>*/}
              {/*))*/}
            {/*}*/}
          {/*</ul>*/}
        </li>
        <li>
          <a>标签</a>
        </li>
        <li>
          <a>关于</a>
        </li>
      </ul>
    </div>
  );
}
