import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { Text } from 'react-native';
import { Modal } from 'antd-mobile';
import { toJS } from 'mobx';
import {
  Flex,
  Toast,
} from '@sipin/sipin-sales-cloud-components/src/components';
import InfoPanel from '@sipin/sipin-sales-cloud-components/src/components/info-panel';
import ListStore from '../../services/list/store';
import RefundStore from './store';
import { salesRefundList } from '../../services/sales';
import List from './list';
import Detail from './detail';
import { LeftBlock, RightBlock, CenterBlock } from '../sales-order/blocks';
import { MainBlock } from '../../components/block';
import constants from '../../services/constants';

@observer
class SalesRefundList extends Component<any> {
  constructor(props: any) {
    super(props);
    const storeParams = { apis: { getList: salesRefundList } };
    this.listStore = new ListStore(storeParams);
    this.listStore.size = 20;
    this.refundStore = new RefundStore(new ListStore(storeParams));
  }

  onCancel = () => {
    const { order } = this.refundStore;
    Modal.alert('确认取消退货单', <Text>退货单: {order.no} ?</Text>, [
      { text: '取消' },
      {
        text: '确定',
        onPress: () => this.refundStore.cancelReturnOrder(order.no),
      },
    ]);
  };

  onConfirm = () => {
    const { order } = this.refundStore;
    if (order.statusId !== constants.REFUND_STATUS_PENDING) {
      Toast.fail(`此退货单${constants.auditStatus[order.statusId]}`);

      return;
    }
    Modal.alert('确认审核通过', <Text>退货单: {order.no} ?</Text>, [
      { text: '取消' },
      {
        text: '确定',
        onPress: () => this.refundStore.auditReturnOrder(order.no),
      },
    ]);
  };

  renderRight = () => {
    const { order: orderData } = this.refundStore;

    const order = toJS(orderData);

    if (!order) {
      return <RightBlock />;
    }

    const data: any = [
      {
        label: '退货金额:',
        value: `¥${(order.refundedAmount || 0).toFixed(2)}`,
      },
      {
        label: '退货数量:',
        value: order.refundQuantity,
      },
      {
        label: '退款方式:',
        value: constants.refundType[order.refundType],
      },
    ];

    let confirmText = '';
    let goBackBtnText = '';

    if (order.statusId === constants.REFUND_STATUS_PENDING) {
      confirmText = '审核通过';
      goBackBtnText = '取消退货单';
    }

    return (
      <RightBlock>
        <InfoPanel
          data={data}
          panelName="审核"
          confirmText={confirmText}
          goBackBtnText={goBackBtnText}
          onGoBack={this.onCancel}
          onConfirm={this.onConfirm}
        >
          <>
            <Text style={{ marginBottom: 5 }}>退款原因:</Text>
            <Text>{order.reasonNote}</Text>
          </>
        </InfoPanel>
      </RightBlock>
    );
  };

  refundStore;
  listStore;
  render() {
    const {
      app,
      match: {
        params: { id, order },
      },
    } = this.props;

    return (
      <MainBlock>
        <Flex style={{ height: '100%' }}>
          <LeftBlock>
            <List
              orderNo={order}
              selectedId={id}
              app={app}
              listStore={this.listStore}
            />
          </LeftBlock>
          <CenterBlock>
            <Detail id={id} refundStore={this.refundStore} />
          </CenterBlock>
          {this.renderRight()}
        </Flex>
      </MainBlock>
    );
  }
}

export default SalesRefundList;
