import * as React from 'react';
import './style.less';

export default class Footer extends React.PureComponent<any, any> {
  render() {
    return (
      <footer>
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1 text-center footer">
              <br/>
              <ul className="list-inline text-center">
                <li>
                  <a target="_blank" href="https://twitter.com/hihl666">
                    <span className="fa-stack fa-lg">
                      <i className="fa fa-circle fa-stack-2x"/>
                      <i className="fa fa-twitter fa-stack-1x fa-inverse"/>
                    </span>
                  </a>
                </li>
                <li>
                  <a target="_blank" href="https://www.zhihu.com/people/hihl">
                    <span className="fa-stack fa-lg">
                      <i className="fa fa-circle fa-stack-2x"/>
                      <i className="fa fa-stack-1x fa-inverse">知</i>
                    </span>
                  </a>
                </li>
                <li>
                  <a target="_blank" href="https://www.jianshu.com/users/a25349b399cf/timeline">
                    <span className="fa-stack fa-lg">
                      <i className="fa fa-circle fa-stack-2x"/>
                      <i className="fa fa-stack-1x fa-inverse">简</i>
                    </span>
                  </a>
                </li>
                <li>
                  <a target="_blank" href="https://github.com/hihl">
                    <span className="fa-stack fa-lg">
                      <i className="fa fa-circle fa-stack-2x"/>
                      <i className="fa fa-github fa-stack-1x fa-inverse"/>
                    </span>
                  </a>
                </li>
              </ul>
              <p className="copyright text-muted">
                Copyright © hihl 2018 - 浙ICP备17040886号
                <br/>
              </p>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}