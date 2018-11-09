import React from 'react';
import { observer } from 'mobx-react/native';
import InfoPanel from '@sipin/sipin-sales-cloud-components/src/components/info-panel';
import store from '../sales/store';

@observer
export default class CartInfoPanel extends React.Component<any> {
  onGoBack = () => {
    const { app } = this.props;
    app.push('/sales');
  };
  onConfirm = () => {
    const { app } = this.props;
    app.push('/sales');
  };

  render() {
    const { amount, quantity, discounted, price } = store;
    const data = [
      {
        label: '合计金额：',
        value: `￥${amount}`,
      },
      {
        label: '合计数量：',
        value: `${quantity}`,
      },
      discounted && {
        label: '促销优惠：',
        value: `￥${discounted}`,
      },
      {
        label: '应收金额：',
        value: `￥${price}`,
        color: 'primary',
      },
    ].filter(Boolean);

    return (
      <InfoPanel
        data={data}
        onGoBack={this.onGoBack}
        onConfirm={this.onConfirm}
        panelName="结算"
        confirmText="确认"
        goBackBtnText="返回上一级"
      />
    );
  }
}
