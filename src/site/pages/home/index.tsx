import * as React from 'react';
import './style.less';
import Layout from '../../layout/index';

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
    const { idxs, current } = this.state;
    return (
      <Layout>
        <div className="home">
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
        </div>
      </Layout>
    );
  }
}
