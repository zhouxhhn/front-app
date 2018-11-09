import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import { toJS } from 'mobx';
import { observer } from 'mobx-react/native';
import { Flex } from '@sipin/sipin-sales-cloud-components/src/components';
import DetailGoodsList from './detail-goods-list';
import { orderStatus } from '../../../services/constants';
import { CONTENT_HEIGHT } from '../../../utils/constants';
import ActionButton from '../../../components/action-button';
import purchaseOrderPrint from '../print';
import OrderHeaderInfo from '../../sales-order/detail/order-header-info';

export interface IOrderDetailProps {
  id: string;
  purchaseStore: any;
}

export interface IOrderDetailState {
  // selected: any
}

@observer
class OrderDetail extends Component<IOrderDetailProps, IOrderDetailState> {
  static defaultProps = {
    touchable: true,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.getOrderItem(this.props);
  }
  componentWillReceiveProps(nextProps) {
    const { id } = this.props;
    if (nextProps.id !== id) {
      this.getOrderItem(nextProps);
    }
  }

  getOrderItem = props => {
    const { id, purchaseStore } = props;
    if (id) {
      purchaseStore.setOrder(undefined); // 为了触发重新计算高度
      purchaseStore.getOrder(id);
    } else {
      purchaseStore.setOrder(undefined);
    }
  };

  print = () => {
    const {
      purchaseStore: { order },
    } = this.props;
    purchaseOrderPrint(toJS(order));
  };

  renderHeader() {
    const {
      purchaseStore: { order },
    } = this.props;

    const orderData = toJS(order);

    const data = [
      {
        label: '状态',
        hightlight: true,
        value: orderStatus[orderData.statusId],
      },
    ];

    return (
      <OrderHeaderInfo data={data}>
        <Flex.Item
          style={{
            alignItems: 'flex-end',
            paddingRight: 20,
          }}
        >
          <ActionButton onClick={this.print}>打印订单</ActionButton>
        </Flex.Item>
      </OrderHeaderInfo>
    );
  }

  render() {
    const {
      purchaseStore: { order },
    } = this.props;
    const orderData = toJS(order);

    return (
      <View>
        {orderData && this.renderHeader()}
        <ScrollView style={{ height: CONTENT_HEIGHT }}>
          <DetailGoodsList order={orderData} />
        </ScrollView>
      </View>
    );
  }
}

export default OrderDetail;
