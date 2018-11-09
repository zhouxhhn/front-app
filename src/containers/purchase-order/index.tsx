import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { observer } from 'mobx-react/native';
import { Modal } from 'antd-mobile';
import { toJS } from 'mobx';
import { Flex } from '@sipin/sipin-sales-cloud-components/src/components';
import InfoPanel from '@sipin/sipin-sales-cloud-components/src/components/info-panel';
import { Address } from '@sipin/sipin-sales-cloud-components/src/components/address';
import ListStore from '../../services/list/store';
import PurchaseStore from './store';
import { frontPurchaseOrderListApi } from '../../services/purchase/actions';
import PurchareList from './list';
import OrderDetail from './detail';
import { LeftBlock, RightBlock, CenterBlock } from './blocks';
import LinkButton from '../../components/link-button';
import textareaPrompt from '../../components/textarea-prompt';
import constants from '../../services/constants';
import purchasePayment from '../purchase-checkout/utils/payment';

@observer
class PurchaseOrder extends Component<any> {
  constructor(props: any) {
    super(props);
    const storeParams = { apis: { getList: frontPurchaseOrderListApi } };
    this.listStore = new ListStore(storeParams);
    this.listStore.size = 20;
    this.purchaseStore = new PurchaseStore(new ListStore(storeParams));
  }
  async componentWillMount() {}

  onGoBack = () => {
    const { order: orderData } = this.purchaseStore;

    const order = toJS(orderData);

    if (!order) {
      return;
    }

    switch (order.statusId) {
      case constants.ORDER_STATUS_PAY_WAIT:
      case constants.ORDER_STATUS_PAY_FINAL_WAIT:
        Modal.alert('确认取消', <Text>订单: {order.no} ?</Text>, [
          { text: '取消' },
          {
            text: '确定',
            onPress: () => this.purchaseStore.cancelOrder(order.no),
          },
        ]);
        break;
      case constants.ORDER_STATUS_DELIVERED_PARTIAL:
        // 退货退款
        break;
      case constants.ORDER_STATUS_DELIVERED:
        // 退货退款
        break;
      default:
        break;
    }
  };
  onConfirm = () => {
    const { order: orderData } = this.purchaseStore;

    const order = toJS(orderData);

    if (!order) {
      return;
    }

    switch (order.statusId) {
      case constants.ORDER_STATUS_PAY_WAIT:
        purchasePayment(order, async () => {
          await this.purchaseStore.getOrder(order.no);
          const dataSource = this.listStore.dataSource.map(item => {
            if (item.no === order.no) {
              return {
                ...item,
                statusId: this.purchaseStore.order.statusId,
              };
            }

            return item;
          });

          this.listStore.setDataSource(dataSource);
        });

        break;
      case constants.ORDER_STATUS_DELIVERED_PARTIAL:
        // 确认收货
        break;
      case constants.ORDER_STATUS_DELIVERED:
        // 确认收货
        break;
      case constants.ORDER_STATUS_FINISHED:
        // 申请售后
        break;
      case constants.ORDER_STATUS_PAY_SUCCEED:
        // 退款
        break;
      case constants.ORDER_STATUS_DELIVERY_WAIT:
        // 退款
        break;
      default:
        break;
    }
  };

  renderAddress = () => {
    const { order } = this.purchaseStore;
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
        (orderConsignee.addr || ''),
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
    const { order: orderData } = this.purchaseStore;

    const callbackOrActions: any = [
      { text: '取消' },
      {
        text: '确定',
        onPress: value => this.purchaseStore.setNote(orderData.no, value),
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
    const { order: orderData } = this.purchaseStore;

    const order = toJS(orderData);

    if (!order) {
      return <RightBlock />;
    }

    let totalQuantity = 0;
    order.detailVos.forEach(item => {
      totalQuantity += item.total;
    });

    const data: any = [
      {
        label: '合计金额:',
        value: `¥${order.amount.toFixed(2)}`,
      },
      {
        label: '合计数量:',
        value: totalQuantity,
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
      case constants.ORDER_STATUS_DELIVERED_PARTIAL:
        goBackBtnText = '退货退款';
        confirmText = '确认收货';
        break;
      case constants.ORDER_STATUS_DELIVERED:
        goBackBtnText = '退货退款';
        confirmText = '确认收货';
        break;
      case constants.ORDER_STATUS_FINISHED:
        goBackBtnText = '';
        confirmText = '申请售后';
        break;
      case constants.ORDER_STATUS_PAY_SUCCEED:
        goBackBtnText = '';
        confirmText = '退款';
        break;
      case constants.ORDER_STATUS_DELIVERY_WAIT:
        goBackBtnText = '';
        confirmText = '退款';
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
          onGoBack={this.onGoBack}
          onConfirm={this.onConfirm}
        >
          <View>
            {this.renderAddress()}
            {this.renderNoteButton()}
          </View>
        </InfoPanel>
      </RightBlock>
    );
  };

  purchaseStore;
  listStore;
  render() {
    const {
      match: {
        params: { id },
      },
      app,
    } = this.props;

    return (
      <Flex style={{ height: '100%' }}>
        <LeftBlock>
          <PurchareList selectedId={id} app={app} listStore={this.listStore} />
        </LeftBlock>
        <CenterBlock>
          <OrderDetail id={id} purchaseStore={this.purchaseStore} />
        </CenterBlock>
        {this.renderRight()}
      </Flex>
    );
  }
}

export default PurchaseOrder;
