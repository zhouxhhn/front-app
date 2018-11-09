import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import { toJS } from 'mobx';
import { observer } from 'mobx-react/native';
import { Flex } from '@sipin/sipin-sales-cloud-components/src/components';
import DetailGoodsList from './detail-goods-list';
import { CONTENT_HEIGHT } from '../../../utils/constants';
import ActionButton from '../../../components/action-button';
import constants from '../../../services/constants';
import orderPrint from '../print';
import OrderHeaderInfo from './order-header-info';

export interface IOrderDetailProps {
  id: string;
  salesStore: any;
  app: any;
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

  getOrderItem = async props => {
    const { id, salesStore } = props;
    if (id) {
      salesStore.setOrder(undefined); // 为了触发重新计算高度
      await salesStore.getOrder(id);
    } else {
      salesStore.setOrder(undefined);
    }
  };
  print = () => {
    const {
      salesStore: { order },
    } = this.props;
    orderPrint(toJS(order));
  };

  renderHeader() {
    const {
      app,
      salesStore: { order },
    } = this.props;

    const orderData = toJS(order);

    const data = [
      {
        label: '会员',
        value: orderData.mobile,
      },
      {
        label: '导购',
        value: orderData.salerName || '无',
      },
      {
        label: '收银',
        value: orderData.createrName,
      },
      {
        label: '状态',
        hightlight: true,
        value: constants.orderStatus[orderData.statusId],
      },
    ];

    return (
      <OrderHeaderInfo data={data}>
        <Flex.Item
          style={{
            alignItems: 'flex-end',
          }}
        >
          <Flex>
            {orderData.return && (
              <Flex.Item
                style={{
                  paddingRight: 20,
                }}
              >
                <ActionButton
                  onClick={() => {
                    app.push(`/sales-order/${orderData.no}/sales-refund`);
                  }}
                >
                  退货记录
                </ActionButton>
              </Flex.Item>
            )}
            <Flex.Item
              style={{
                paddingRight: 20,
              }}
            >
              <ActionButton onClick={this.print}>打印订单</ActionButton>
            </Flex.Item>
          </Flex>
        </Flex.Item>
      </OrderHeaderInfo>
    );
  }

  render() {
    const {
      salesStore: { order },
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
