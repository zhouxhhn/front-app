import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react/native';
import OrderListItem from '../../components/order-list/item';
import formatDate from '../../utils/date-format';
import { DEFAULT_GOODS_IMG_URL } from '../../utils/constants';
import { BlockHeaderName } from '../../components/block';
import constants from '../../services/constants';
import ListBlock from '../../components/list-block';

@observer
class List extends Component<any> {
  constructor(props: any) {
    super(props);
  }

  handleOrderItemClick = record => {
    const { app, selectedId, orderNo } = this.props;
    if (selectedId === record.no) {
      return;
    }

    if (orderNo) {
      app.push(`/sales-order/${orderNo}/sales-refund/${record.no}`);
    } else {
      app.push(`/sales-refund-list/${record.no}`);
    }
  };

  render() {
    const { listStore, selectedId, orderNo } = this.props;
    const dataSource = toJS(listStore.dataSource);

    const data = dataSource.map(item => {
      let totalQuantity = 0;
      let covers = [];

      item.returnOrderDetailVos.forEach(item => {
        totalQuantity += item.refundedQuantity;
        covers.push(item.imgPath || DEFAULT_GOODS_IMG_URL);
      });

      return {
        ...item,
        totalQuantity,
        id: item.no,
        selected: selectedId === item.no,
        status: constants.auditStatus[item.statusId],
        payableAmount: item.refundedAmount,
        createdAt: formatDate(item.createdAt),
        covers,
      };
    });

    return (
      <ListBlock
        HeaderLeft={
          <BlockHeaderName>
            销售退货单
            {orderNo && `( 订单号: ${orderNo} )`}
          </BlockHeaderName>
        }
        showSearchBar={!orderNo}
        searchPlaceholder="输入退货单号查询"
        store={listStore}
        data={data}
        params={{ orderNo }}
        handleOrderItemClick={this.handleOrderItemClick}
        ListItemComponent={OrderListItem}
      />
    );
  }
}

export default List;
