import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import { toJS } from 'mobx';
import { observer } from 'mobx-react/native';
import { Flex } from '@sipin/sipin-sales-cloud-components/src/components';
import ActionButton from '../../../components/action-button';
import DetailGoodsList from './detail-goods-list';
import { CONTENT_HEIGHT } from '../../../utils/constants';
import constants from '../../../services/constants';
import OrderHeaderInfo from '../../sales-order/detail/order-header-info';

export interface IOrderDetailProps {
  id: string;
  refundStore: any;
}

@observer
class OrderDetail extends Component<IOrderDetailProps> {
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
    const { id, refundStore } = props;
    if (id) {
      refundStore.setOrder(undefined); // 为了触发重新计算高度
      refundStore.getOrder(id);
    } else {
      refundStore.setOrder(undefined);
    }
  };

  renderHeader() {
    const {
      refundStore,
      refundStore: { order },
    } = this.props;

    const orderData = toJS(order);

    const data = [
      {
        label: '会员',
        value: orderData.mobile,
      },
      {
        label: '销售单号',
        value: orderData.salesOrderNo,
      },
      {
        label: '操作员',
        value: orderData.creatorName,
      },
      {
        label: '状态',
        hightlight: true,
        value: constants.auditStatus[orderData.statusId],
      },
    ];

    return (
      <OrderHeaderInfo data={data}>
        <Flex.Item style={{ alignItems: 'flex-end' }}>
          <ActionButton onClick={refundStore.print}>打印退货单</ActionButton>
        </Flex.Item>
      </OrderHeaderInfo>
    );
  }

  render() {
    const {
      refundStore: { order },
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
