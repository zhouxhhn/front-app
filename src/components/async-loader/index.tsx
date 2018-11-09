import * as React from 'react';
import { withRouter } from 'react-router';

export default class AsyncLoader extends React.Component<any, any> {
  static defaultProps = {
    app: {},
    path: '',
    loading: <div>loading</div>,
    error: <div>404</div>,
  };

  constructor(props) {
    super(props);
    this.state = {
      module: null,
    };
  }

  componentWillMount() {
    this.load(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { props } = this;
    if (
      nextProps.path !== props.path ||
      nextProps.error !== props.error ||
      nextProps.loading !== props.loading
    ) {
      this.load(nextProps);
    }
  }

  async load(props) {
    const { loading } = props;
    this.setState({ module: loading });
    try {
      const { type } = props;
      switch (type) {
        case 'local': {
          const m: any = props.path;
          const Module: any = m.default ? withRouter(m.default) : withRouter(m);
          this.setState({
            module: <Module app={props.app} />,
          });
          break;
        }
        case 'path': {
          try {
            props.path(m => {
              const Module: any = m.default
                ? withRouter(m.default)
                : withRouter(m);
              this.setState({
                module: <Module app={props.app} />,
              });
            });
          } catch (e) {
            this.setState({ module: props.error });
          }
          break;
        }
        default:
          this.setState({ module: '页面路由请指定类型' });
          break;
      }
    } catch (e) {
      this.setState({ module: props.error });
    }
  }

  render() {
    const { module } = this.state;

    return module;
  }
}
