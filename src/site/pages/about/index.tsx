import * as React from 'react';
import './style.less';
import Layout from '../../layout/index';

export default class About extends React.PureComponent<any, any> {
  render() {
    return (
      <Layout>
        <header className="about-header" style={{ backgroundImage: `url(${require('../article-bg.jpg')})` }}>
          <div className="container">
            <div className="row">
              <div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1 text-center">
                <div className="post-heading">
                  <h1>个人介绍</h1>
                  <span className="meta">
                    一个希望在全栈之路上可以瘦下来的胖子
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>
        <article>
          <div className="container">
            <div className="row">
              <div className="col-lg-8 col-lg-offset-1 col-sm-9 post-container">
                <p>
                  <span className="important">
                    声明：本站所有文章均为本人原创，仅代表个人思想，与其他任何人或组织无关！
                  </span>
                </p>
                <p>
                  博主名叫姚正峰，网络代号hihl，12年毕业于西安电子科技大学应用数学专业，福建福州人。做过3年多java开发，
                  后转前端，目前在同盾科技从事web前端相关工作，喜好尝试新技术，热爱分享。
                </p>
                <h3>联系方式</h3>
                <ul>
                  <li>邮箱：348267823@qq.com</li>
                  <li>github: <a target="_blank" href="https://github.com/hihl">https://github.com/hihl</a></li>
                </ul>
              </div>
            </div>
          </div>
        </article>
      </Layout>
    );
  }
}
