import * as React from 'react';
import Nav from './Nav/index';

export default class Layout extends React.Component<any, any> {
  render() {
    return (
      <React.Fragment>
        <Nav />
        <div className="container" style={{ paddingTop: 90 }}>
          { this.props.children }
        </div>
      </React.Fragment>
    );
  }
}