/**
 * Created by Zhengfeng.Yao on 2017/12/27.
 */
import React from 'react';

export default class Wrapper extends React.Component {
  render() {
    return [
      <div key="container" className="container" />,
      <div key="bg" className="bg" />
    ];
  }

  componentDidMount() {
    document.body.className = "";
  }
}
