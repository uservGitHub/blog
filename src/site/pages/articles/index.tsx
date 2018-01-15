import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import './style.less';
import Layout from '../../layout/index';
import CodeBlock from "./CodeBlock";

export default class ArticlePage extends React.Component<{ article: any, previous: any, next: any }, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      views: 0
    };
  }

  render() {
    const { previous, next, article } = this.props;
    const { title, date, content, category, tags, summary } = article;
    return (
      <Layout>
        <header className="article-header" style={{ backgroundImage: `url(${require('../article-bg.jpg')})` }}>
          <div className="container">
            <div className="row">
              <div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1 text-center">
                <div className="post-heading">
                  <h1>{title}</h1>
                  <span className="meta">
                    {category}
                    <span>日期 {date}</span>
                    <span>阅读量 {this.state.views}</span>
                  </span>
                  <div style={{ marginTop: 20, textAlign: 'center' }}>
                    {
                      tags.map((tag:string) => (
                        <a className="tag" key={tag} href={`/tags/#${tag}`}>{tag}</a>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <article>
          <div className="container">
            <div className="row">
              <div className="col-lg-10 col-lg-offset-1 col-sm-12 post-container">
                <div className="summary">
                  {summary}
                </div>
                <ReactMarkdown
                  className="react-markdown"
                  source={content}
                  escapeHtml={false}
                  renderers={{ code: CodeBlock }}
                />
              </div>
            </div>
          </div>
        </article>
        <div className="container">
          <div className="row">
            <div className="col-lg-10 col-lg-offset-1 col-sm-12 post-container">
              {
                !!previous && (
                  <div className="previous">
                    上一篇：<a href={`/articles${previous.key}`}>{previous.title}</a>
                  </div>
                )
              }
              {
                !!next && (
                  <div className="next">
                    下一篇：<a href={`/articles${next.key}`}>{next.title}</a>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  componentDidMount() {
    const views = (window as any).__CONFIG__.APV;
    this.setState({ views });
    const _hmt = (window as any)._hmt;
    const { title, key } = this.props.article;
    _hmt.push(['_trackEvent', 'read', key, title]);
  }
}
