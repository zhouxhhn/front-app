import React from 'react';
import { observer } from 'mobx-react/native';
import InfoPanel from '@sipin/sipin-sales-cloud-components/src/components/info-panel';
import store from '../purchase/store';

@observer
export default class CartInfoPanel extends React.Component<any> {
  onGoBack = () => {
    const { app } = this.props;
    app.push('/purchase');
  };
  onConfirm = () => {
    const { app } = this.props;
    app.push('/purchase');
  };

  render() {
    const panelData: any = [
      {
        label: '合计金额:',
        value: `¥${store.amount}`,
      },
      {
        label: '合计数量:',
        value: store.quantity,
      },
    ].filter(Boolean);

    return (
      <InfoPanel
        data={panelData}
        onGoBack={this.onGoBack}
        onConfirm={this.onConfirm}
        panelName="结算"
        confirmText="确认"
        goBackBtnText="返回上一级"
      />
    );
  }
}
