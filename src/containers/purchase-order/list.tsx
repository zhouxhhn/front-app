import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react/native';
import OrderListItem from '../../components/order-list/item';
import formatDate from '../../utils/date-format';
import { DEFAULT_GOODS_IMG_URL } from '../../utils/constants';
import { BlockHeaderName } from '../../components/block';
import { orderStatus } from '../../services/constants';
import ListBlock from '../../components/list-block';

@observer
class List extends Component<any> {
  constructor(props: any) {
    super(props);
  }

  handleOrderItemClick = record => {
    const { app, selectedId } = this.props;
    if (selectedId === record.no) {
      return;
    }

    app.push(`/purchase-order/${record.no}`);
  };

  render() {
    const { listStore, selectedId } = this.props;
    const dataSource = toJS(listStore.dataSource);

    const data = dataSource.map(item => {
      let totalQuantity = 0;
      let covers = [];
      item.detailVos.forEach(item => {
        totalQuantity += item.total;
        covers.push(item.imgPath || DEFAULT_GOODS_IMG_URL);
      });

      return {
        ...item,
        totalQuantity,
        id: item.no,
        no: item.no,
        selected: selectedId === item.no,
        payableAmount: item.payableAmount
          ? item.payableAmount.toFixed(2)
          : '0.00',
        createdAt: formatDate(item.createdAt),
        covers,
        status: orderStatus[item.statusId],
      };
    });

    return (
      <ListBlock
        HeaderLeft={<BlockHeaderName>采购订单</BlockHeaderName>}
        searchPlaceholder="输入订单号查询"
        showSearchBar
        store={listStore}
        data={data}
        handleOrderItemClick={this.handleOrderItemClick}
        ListItemComponent={OrderListItem}
      />
    );
  }
}

export default List;
