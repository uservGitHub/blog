import * as React from 'react';
import Nav from './Nav/index';
import Footer from './Footer/index';

export default class Layout extends React.Component<{ children: any }, any> {
  render() {
    return (
      <React.Fragment>
        <Nav />
        { this.props.children }
        <Footer />
      </React.Fragment>
    );
  }
}