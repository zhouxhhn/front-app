import * as React from 'react';
import { isWeb } from '../../utils';

const TIME_INTERVAL = 50; // keypress 响应时间间隔, 一般扫码枪在 50ms 以内, 人工操作正常 >100
const LENGTH = 11; // 单品截取输入长度
const TZ_LENGTH = 7; // 组合截取输入长度

export interface ScannerProps {
  onEnter?: (value: number | string) => void;
}
class Scanner extends React.Component<ScannerProps> {
  value = '';
  timestamp = 0;
  constructor(props) {
    super(props);
    this.scan = this.scan.bind(this);
  }

  async componentDidMount() {
    if (isWeb) {
      window.addEventListener('keypress', this.scan);
    }
  }
  componentWillUnmount() {
    if (isWeb) {
      window.removeEventListener('keypress', this.scan);
    }
  }
  scan = e => {
    const { onEnter } = this.props;
    const timestamp = this.timestamp;
    this.timestamp = Date.now();
    if (e.keyCode === 13) {
      const interval = this.timestamp - timestamp;
      const tz = this.value.slice(-TZ_LENGTH);
      const isTz = /^TZ/g.test(tz);
      const v = isTz ? tz : this.value.slice(-LENGTH);
      const isValid = isTz
        ? v && v.length === TZ_LENGTH
        : v && v.length === LENGTH && !isNaN(+v);
      if (
        interval < TIME_INTERVAL &&
        isValid &&
        typeof onEnter === 'function'
      ) {
        this.value = '';
        onEnter(v);
      }
    } else {
      this.value += e.key;
    }
  };
  render() {
    return null;
  }
}
export default Scanner;
