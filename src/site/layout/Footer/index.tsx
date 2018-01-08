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
                </li>
                <li>
                </li>
                <li>
                </li>
                <li>
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