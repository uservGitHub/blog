import * as React from 'react';
import Nav from './Nav/index';

export default class Layout extends React.Component<{ children: any }, any> {
  render() {
    return (
      <React.Fragment>
        <Nav />
        <div className="container" style={{ paddingTop: 90 }}>
          <div className="row">
            <div className="col-lg-8 col-lg-offset-1 col-md-8 col-md-offset-1 col-sm-12 col-xs-12 post-container">
              { this.props.children }
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}