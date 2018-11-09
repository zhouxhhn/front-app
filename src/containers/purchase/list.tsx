import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react/native';
import clickEvent from '@sipin/sipin-sales-cloud-components/src/utils/click-event';
import GoodsListItem from '../../components/goods-list/goods-list-item';
import Store from '../../services/list/store';
import { frontSearchAllSkuApi } from '../../services/purchase/actions';
import { BlockHeaderName } from '../../components/block';
import ListBlock from '../../components/list-block';
import CartButton from '../../components/cart-button/index';
import { transformGoodsSpecification } from '../../utils';

@observer
class List extends Component<any> {
  constructor(props: any) {
    super(props);
    this.store = new Store({ apis: { getList: frontSearchAllSkuApi } });
    this.store.size = 20;
  }

  createActionArea = data => {
    const { addToCart } = this.props;

    return (
      <CartButton {...clickEvent(() => addToCart(data))} label="加入采购单" />
    );
  };

  store: any;
  render() {
    const dataSource = toJS(this.store.dataSource);
    const data = dataSource.map(item => ({
      id: item.sku,
      title: [`货号：${item.number}`, item.name],
      descrtiption: transformGoodsSpecification(item),
      price: String(item.amount),
      amount: item.amount,
      stockQty: item.stockQty,
      discount: item.discount,
      cover: item.imgPath || require('../../static/images/default.png'),
      status: item.status,
      _data: item,
    }));

    const ListItemComponent = props => {
      return (
        <GoodsListItem
          {...props}
          type="purchase"
          createActionArea={this.createActionArea}
          touchable={false}
        />
      );
    };

    return (
      <ListBlock
        HeaderLeft={<BlockHeaderName>采购进货</BlockHeaderName>}
        searchPlaceholder="输入商品名称/货号进行查询"
        showSearchBar
        store={this.store}
        data={data}
        ListItemComponent={ListItemComponent}
      />
    );
  }
}

export default List;
