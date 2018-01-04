import * as React from 'react';
import './style.less';
import Layout from '../../layout/index';

export default class Tags extends React.PureComponent<{ tags: any, title: string }, any> {
  render() {
    const { tags, title } = this.props;
    return (
      <Layout>
        <header className="tag-header" style={{ backgroundImage: `url(${require('../article-bg.jpg')})` }}>
          <div className="container">
            <div className="row">
              <div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1 text-center">
                <div className="post-heading">
                  <h1>{title}</h1>
                  <div style={{ marginTop: 20, textAlign: 'center' }}>
                    {
                      Object.keys(tags).map((tag:string) => (
                        <a className="tag" key={tag} href={`#${tag}`}>{tag}</a>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
              {
                Object.keys(tags).map((tag:string) => (
                  <div key={tag} className="article-list" id={tag}>
                    <span className="glyphicon glyphicon-list listing-seperator">
                      <span className="tag-text">{tag}</span>
                    </span>
                    {
                      tags[tag].map((article:any, index: number) => (
                        <div key={index} className="post-preview">
                          <a href={`/articles${article.key}`}>
                            <h2 className="post-title">
                              {article.title}
                            </h2>
                            <h3 className="post-summary">
                              {article.summary}
                            </h3>
                          </a>
                        </div>
                      ))
                    }
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}
