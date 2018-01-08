import * as React from 'react';

export default class CodeBlock extends React.Component<{ value: string, language?: "" }, any> {
  private codeEl: HTMLInputElement;

  constructor(props:any) {
    super(props);
    this.state = {
      collapse: true
    };
  }

  componentDidMount() {
    const hljs = (window as any).hljs;
    hljs.highlightBlock(this.codeEl);
  }

  componentDidUpdate() {
    const hljs = (window as any).hljs;
    hljs.highlightBlock(this.codeEl);
  }

  render() {
    const { value, language } = this.props;
    const { collapse } = this.state;

    return (
      <pre>
        <div style={{ padding: 10, textAlign: 'right' }}>
          <a
            style={{ cursor: 'pointer' }}
            onClick={() => this.setState({ collapse: !collapse })}
          >
          { collapse ? '展开' : '收缩' }
        </a>
        </div>
        <code
          ref={(el:any) => this.codeEl = el}
          style={{ height: collapse ? 80 : '100%' }}
          className={language}>
          {value}
        </code>
      </pre>
    );
  }
}