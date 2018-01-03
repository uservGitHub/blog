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
          <a href={key.substr(key.indexOf('/articles'))}>
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

export default class HomePage extends React.Component<{ pagination: any }, any> {
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
        {
          articles.map((article:any) => <Preview key={article.key} article={article}/>)
        }
        <div style={{ textAlign: 'center' }}>
          <ul className="pagination">
            <li className={`${current == idxs[0] ? 'disabled' : ''}`}><a>&larr;</a></li>
            {
              idxs.map((i:any) => (
                <li key={i} className={`${current == i ? 'active' : ''}`}>
                  <a>{i}</a>
                </li>
              ))
            }
            <li className={`${current == idxs[idxs.length - 1] ? 'disabled' : ''}`}><a>&rarr;</a></li>
          </ul>
        </div>
      </Layout>
    );
  }
}
