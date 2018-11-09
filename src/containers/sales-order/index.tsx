import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { observer } from 'mobx-react/native';
import { Modal } from 'antd-mobile';
import math from '@sipin/basic-libs/lib/js/math';
import { toJS } from 'mobx';
import { Flex } from '@sipin/sipin-sales-cloud-components/src/components';
import InfoPanel from '@sipin/sipin-sales-cloud-components/src/components/info-panel';
import { Address } from '@sipin/sipin-sales-cloud-components/src/components/address';
import ListStore from '../../services/list/store';
import SalesStore from './store';
import { getIndexSalesOrder } from '../../services/sales';
import SaleOrderList from './list';
import OrderDetail from './detail';
import { LeftBlock, RightBlock, CenterBlock } from './blocks';
import { MainBlock } from '../../components/block';
import LinkButton from '../../components/link-button';
import textareaPrompt from '../../components/textarea-prompt';
import constants from '../../services/constants';

const refundable = statusId =>
  statusId >= constants.ORDER_STATUS_PAY_SUCCEED &&
  statusId <= constants.ORDER_STATUS_FINISHED;

@observer
class SalesOrder extends Component<any> {
  constructor(props: any) {
    super(props);
    const storeParams = { apis: { getList: getIndexSalesOrder } };
    this.listStore = new ListStore(storeParams);
    this.listStore.size = 20;
    this.salesStore = new SalesStore(new ListStore(storeParams));
  }
  async componentWillMount() {}

  onCancel = () => {
    const { order: orderData } = this.salesStore;
    const order = toJS(orderData);

    switch (order.statusId) {
      case constants.ORDER_STATUS_PAY_WAIT:
      case constants.ORDER_STATUS_PAY_FINAL_WAIT: {
        const { order } = this.salesStore;
        Modal.alert('确认取消', <Text>订单: {order.no} ?</Text>, [
          { text: '取消' },
          {
            text: '确定',
            onPress: () => this.salesStore.cancelOrder(order.no),
          },
        ]);
      }
    }
  };
  refund = () => {
    const { app } = this.props;
    const { order } = this.salesStore;
    app.push(`/sales-refund/${order.no}`);
  };
  onConfirm = () => {
    const { app } = this.props;
    const { order: orderData } = this.salesStore;

    const order = toJS(orderData);

    if (!order) {
      return;
    }

    switch (order.statusId) {
      case constants.ORDER_STATUS_PAY_WAIT:
        app.push(`/payment/${order.no}`);
        break;
      case constants.ORDER_STATUS_PAY_SUCCEED:
        Modal.alert('确认完成', <Text>订单: {order.no} ?</Text>, [
          { text: '取消' },
          {
            text: '确定',
            onPress: () => this.salesStore.confirmCompleteOrder(order.no),
          },
        ]);
        break;
    }
  };

  renderAddress = () => {
    const { order } = this.salesStore;
    const { orderConsignee } = order;

    if (!orderConsignee) {
      return null;
    }

    const address = {
      name: orderConsignee.name,
      mobile: orderConsignee.mobile,
      address:
        orderConsignee.province +
        orderConsignee.city +
        orderConsignee.district +
        orderConsignee.addr,
    };

    return (
      <View>
        <View>
          <Text>收货地址：</Text>
        </View>
        <View style={{ marginTop: 10 }}>
          <Address data={address} />
        </View>
      </View>
    );
  };

  renderNoteButton = () => {
    const { order: orderData } = this.salesStore;

    const callbackOrActions: any = [
      { text: '取消' },
      {
        text: '确定',
        onPress: value => this.salesStore.setNote(orderData.no, value),
      },
    ];

    let NoteButton = null;

    switch (orderData.statusId) {
      case constants.ORDER_STATUS_PAY_WAIT:
      case constants.ORDER_STATUS_PAY_FINAL_WAIT:
        NoteButton = (
          <LinkButton
            onClick={() =>
              textareaPrompt('备注', '', callbackOrActions, orderData.note)
            }
          >
            添加备注
          </LinkButton>
        );
        break;
      default:
        NoteButton = null;
    }

    return (
      <View>
        <View>
          <Text>备注：</Text>
        </View>
        <View style={{ marginTop: 10 }}>
          <Text>{orderData.note || '暂无备注'}</Text>
        </View>
        <View>{NoteButton}</View>
      </View>
    );
  };

  renderRight = () => {
    const { order: orderData } = this.salesStore;

    const order = toJS(orderData);

    if (!order) {
      return <RightBlock />;
    }

    let totalQuantity = 0;
    order.orderDetailList.forEach(item => {
      totalQuantity += item.quantity;
    });

    // 整单优惠
    const orderDiscount = math.Sub(
      order.originalPayableAmount,
      order.payableAmount,
      2
    );

    const data: any = [
      {
        label: '合计金额:',
        value: `¥${order.amount.toFixed(2)}`,
      },
      {
        label: '合计数量:',
        value: totalQuantity,
      },
      +order.couponAmount > 0 && {
        label: '优惠券:',
        value: `-¥${order.couponAmount.toFixed(2)}`,
        color: 'primary',
      },
      +order.pointsDiscount > 0 && {
        label: '积分抵扣:',
        value: `-¥${order.pointsDiscount.toFixed(2)}`,
        color: 'primary',
      },
      +orderDiscount > 0 && {
        label: '整单优惠:',
        value: `-¥${orderDiscount}`,
        color: 'primary',
      },
      {
        label: '应收:',
        value: `¥${order.payableAmount.toFixed(2)}`,
      },
      +order.paidAmount > 0 && {
        label: '实收:',
        value: `¥${order.paidAmount.toFixed(2)}`,
        color: 'primary',
      },
    ].filter(Boolean);

    let goBackBtnText = '';
    let confirmText = '';

    switch (order.statusId) {
      case constants.ORDER_STATUS_PAY_WAIT:
        goBackBtnText = '取消订单';
        confirmText = '付款';
        break;
      case constants.ORDER_STATUS_PAY_FINAL_WAIT:
        goBackBtnText = '取消订单';
        confirmText = '';
        break;
      case constants.ORDER_STATUS_PAY_SUCCEED:
        goBackBtnText = '退货';
        confirmText = '确认完成';
        break;
      case constants.ORDER_STATUS_FINISHED:
        goBackBtnText = '';
        confirmText = '退货';
        break;
      default:
        break;
    }

    return (
      <RightBlock>
        <InfoPanel
          data={data}
          confirmText={confirmText}
          goBackBtnText={goBackBtnText}
          onGoBack={refundable(order.statusId) ? this.refund : this.onCancel}
          onConfirm={
            order.statusId === constants.ORDER_STATUS_FINISHED
              ? this.refund
              : this.onConfirm
          }
        >
          <View>
            {this.renderAddress()}
            {this.renderNoteButton()}
          </View>
        </InfoPanel>
      </RightBlock>
    );
  };

  salesStore;
  listStore;
  render() {
    const {
      app,
      match: {
        params: { id },
      },
    } = this.props;

    return (
      <MainBlock>
        <Flex style={{ height: '100%' }}>
          <LeftBlock>
            <SaleOrderList
              selectedId={id}
              app={app}
              listStore={this.listStore}
            />
          </LeftBlock>
          <CenterBlock>
            <OrderDetail id={id} salesStore={this.salesStore} app={app} />
          </CenterBlock>
          {this.renderRight()}
        </Flex>
      </MainBlock>
    );
  }
}

export default SalesOrder;
