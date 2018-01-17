import * as React from 'react';
import './style.less';

const { Fragment } = React;

export default class App extends React.PureComponent<any, any> {
  render() {
    return (
      <Fragment>
        <header className="header">
          <div className="avatar text-center">
            <div className="row">
              <img src={require('./avatar.jpg')}/>
            </div>
            <div className="row">黄鸾</div>
            <div className="row">
              憧憬成为一名优秀的产品经历，且刚好有这样的潜力
            </div>
          </div>
          <div className="info text-center">
            <div className="row">
              <span><div className="inline-block">24岁</div><div className="inline-block">浙江杭州</div><div className="inline-block">15875558112</div></span>
            </div>
            <div className="row">1652516379@qq.com</div>
          </div>
        </header>
        <article className="article row" style={{ height: 200 }} id="intention">
          <div className="text-center col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="title">
              求职意向
            </div>
          </div>
          <div className="row">
            <div className="col-lg-offset-2 col-lg-2 col-md-3 col-sm-4 col-xs-offset-2 col-xs-4">
              <i className="fa fa-address-book" /> 产品经理
            </div>
            <div className="col-lg-2 col-md-3 col-sm-4 col-xs-4">
              <i className="fa fa-heart" /> 全职
            </div>
            <div className="col-lg-offset-0 col-lg-2 col-md-3 col-sm-4 col-xs-offset-2 col-xs-4">
              <i className="fa fa-location-arrow" /> 杭州
            </div>
            <div className="col-lg-2 col-md-3 col-sm-4 col-xs-4">
              <i className="fa fa-rmb" /> 12 - 15 K
            </div>
            <div className="col-lg-offset-0 col-lg-1 col-md-3 col-sm-4 col-xs-offset-2 col-xs-4">
              <i className="fa fa-calendar-check-o" /> 随时到岗
            </div>
          </div>
        </article>
        <article className="article row" style={{ height: 200 }} id="education">
          <div className="text-center col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="title">
              教育背景
            </div>
            <div className="row">
              <div className="col-lg-offset-2 col-lg-2 col-md-3 col-sm-4 col-xs-6">
                2011.09 - 2015.06
              </div>
              <div className="col-lg-2 col-md-3 col-sm-4 col-xs-6">
                湖北师范大学
              </div>
              <div className="col-lg-2 col-md-3 col-sm-4 col-xs-6">
                化学
              </div>
              <div className="col-lg-2 col-md-3 col-sm-4 col-xs-6">
                本科
              </div>
            </div>
          </div>
        </article>
        <article className="article row" style={{ height: 800 }} id="experience">
          <div className="text-center col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="title">
              工作经验
            </div>
            <div className="row" style={{ height: 220 }}>
              <div className="timeline">
                <div style={{ width: 18, height: 18 }}>
                  <svg width="18" height="18">
                    <g transform="translate(1,1)">
                      <circle
                        stroke="#008cee"
                        strokeWidth={1}
                        fill="#008cee"
                        fillOpacity={0.4}
                        cx="8"
                        cy="8"
                        r="4"
                      >
                        <animate attributeName="r" values="8;4;8;" begin="2s" dur="2s" repeatCount="indefinite"/>
                      </circle>
                    </g>
                  </svg>
                </div>
                <div className="timeline-line"/>
              </div>
              <div className="col-xs-12">

              </div>
            </div>

            <div className="row" style={{ height: 220 }}>
              <div className="timeline">
                <div style={{ width: 18, height: 18 }}>
                  <svg width="18" height="18">
                    <g transform="translate(1,1)">
                      <circle
                        stroke="#008cee"
                        strokeWidth={1}
                        fill="#008cee"
                        fillOpacity={0.4}
                        cx="8"
                        cy="8"
                        r="4"
                      >
                        <animate attributeName="r" values="8;4;8;" begin="2s" dur="2s" repeatCount="indefinite"/>
                      </circle>
                    </g>
                  </svg>
                </div>
                <div className="timeline-line"/>
              </div>
              <div className="col-xs-12">

              </div>
            </div>

            <div className="row" style={{ height: 220 }}>
              <div className="timeline">
                <div style={{ width: 18, height: 18 }}>
                  <svg width="18" height="18">
                    <g transform="translate(1,1)">
                      <circle
                        stroke="#008cee"
                        strokeWidth={1}
                        fill="#008cee"
                        fillOpacity={0.4}
                        cx="8"
                        cy="8"
                        r="4"
                      >
                        <animate attributeName="r" values="8;4;8;" begin="2s" dur="2s" repeatCount="indefinite"/>
                      </circle>
                    </g>
                  </svg>
                </div>
                <div className="timeline-line"/>
              </div>
              <div className="col-xs-12">

              </div>
            </div>
          </div>
        </article>
        <article className="article row" style={{ height: 200 }} id="evaluation">
          <div className="text-center col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="title">
              自我评价
            </div>
            <div className="row">
            </div>
          </div>
        </article>
      </Fragment>
    );
  }
}
