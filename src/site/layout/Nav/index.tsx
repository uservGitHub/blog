import * as React from 'react';
import './style.less';

export default class Nav extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      showMenu: false
    };
  }

  render() {
    return (
      <nav className="navbar">
        <div className="navbar-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle" onClick={() => this.setState({ showMenu: !this.state.showMenu })}>
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"/>
              <span className="icon-bar"/>
              <span className="icon-bar"/>
            </button>
            <a className="navbar-header-brand" href="/">
              <span>hihl</span>
              的博客
            </a>
          </div>
          <div className={`navbar-menus ${this.state.showMenu ? 'in' : ''}`}>
            <div className="navbar-collapse" style={{ height: this.state.showMenu ? 'auto' : 0 }}>
              <ul className="navbar-right">
                <li>
                  <a href="/">主页</a>
                </li>
                <li>
                  <a href="/categories">分类</a>
                </li>
                <li>
                  <a href="/tags">标签</a>
                </li>
                <li>
                  <a href="/about">关于</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
