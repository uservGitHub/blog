/**
 * Created by Zhengfeng.Yao on 2017/12/29.
 */
import React, { PureComponent } from 'react';
import Nav from '../../widgets/Nav';
import Container from '../../widgets/Container';

export default class Home extends PureComponent {
  render() {
    return [
      <Nav key="nav" />,
      <Container key="container">
        <div className="home-content">
        </div>
        <div className="home-sidebar">
        </div>
      </Container>
    ];
  }
}
