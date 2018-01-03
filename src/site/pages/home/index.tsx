import * as React from 'react';
import './style.less';
import Layout from '../../layout/index';

const { Fragment } = React;

class Preview extends React.PureComponent<{ article: any }, any> {
  render() {
    const { key, title, summary, category, tags, date } = this.props.article;
    return (
      <Fragment>
        <div className="article-preview">
          <a href={`/articles${key}`}>
            <h2 className="article-preview-title">{title}</h2>
            <p className="article-preview-meta">
              <i className="glyphicon glyphicon-calendar"/>
              {date}
            </p>
            <p className="article-preview-meta">分类：{category}  标签：{tags.join('  ')}</p>
            <div className="article-preview-content">
              <p>{summary}</p>
            </div>
          </a>
        </div>
        <hr style={{ margin: 0 }}/>
      </Fragment>
    );
  }
}

export default class HomePage extends React.PureComponent<{ pagination: any }, any> {
  constructor(props: any) {
    super(props);
    const { pagination } = props;
    const { current, total, articles } = pagination;
    const pages = Math.ceil(total / 10) || 1;
    let min, max;
    if (pages > 5) {
      if (current == pages) {
        max = pages;
      } else {
        max = current + 1;
      }
      min = max - 4;
    } else {
      min = 1;
      max = pages;
    }
    const idxs = [];
    for(let i = min; i <= max; i++) {
      idxs.push(i);
    }
    this.state = {
      idxs,
      current,
      articles
    };
  }
  render() {
    const { idxs, current, articles } = this.state;
    return (
      <Layout>
        <div className="container" style={{ paddingTop: 90 }}>
          <div className="row">
            <div className="col-lg-8 col-lg-offset-1 col-md-8 col-md-offset-1 col-sm-12 col-xs-12 post-container">
              {
                articles.map((article:any) => <Preview key={article.key} article={article}/>)
              }
              <div style={{ textAlign: 'center' }}>
                <ul className="pagination">
                  <li className={`${current == idxs[0] ? 'disabled' : ''}`}>
                    <a href={current == idxs[0] ? '' : `/?page=${current - 1}`}>&larr;</a>
                  </li>
                  {
                    idxs.map((i:any) => (
                      <li key={i} className={`${current == i ? 'active' : ''}`}>
                        <a href={current == i ? '' : `/?page=${i}`}>{i}</a>
                      </li>
                    ))
                  }
                  <li className={`${current == idxs[idxs.length - 1] ? 'disabled' : ''}`}>
                    <a href={current == idxs[idxs.length - 1] ? '' : `/?page=${current + 1}`}>&rarr;</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}
