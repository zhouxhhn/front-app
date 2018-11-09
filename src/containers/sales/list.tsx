import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react/native';
import clickEvent from '@sipin/sipin-sales-cloud-components/src/utils/click-event';
import GoodsListItem from '../../components/goods-list/goods-list-item';
import Store from '../../services/list/store';
import { frontSearchAllSkuNoStockApi } from '../../services/sales';
import { DEFAULT_GOODS_IMG_URL } from '../../utils/constants';
import { BlockHeaderName } from '../../components/block';
import ListBlock from '../../components/list-block';
import CartButton from '../../components/cart-button';
import { transformGoodsSpecification } from '../../utils';

@observer
class List extends Component<any> {
  constructor(props: any) {
    super(props);
    this.store = new Store({ apis: { getList: frontSearchAllSkuNoStockApi } });
    this.store.size = 20;
  }

  createActionArea = data => {
    const { addToCart } = this.props;

    return <CartButton {...clickEvent(() => addToCart(data))} />;
  };

  store: any;
  render() {
    const dataSource = toJS(this.store.dataSource);
    const data = dataSource.map(item => ({
      id: item.sku,
      title: [`货号：${item.number}`, item.name],
      descrtiption: transformGoodsSpecification(item),
      amount: item.amount,
      cover: item.imgPath || DEFAULT_GOODS_IMG_URL,
      status: item.status,
      _data: item,
    }));

    const ListItemComponent = props => {
      return (
        <GoodsListItem
          {...props}
          type="sales"
          createActionArea={this.createActionArea}
          touchable={false}
        />
      );
    };

    return (
      <ListBlock
        HeaderLeft={<BlockHeaderName>开单收银</BlockHeaderName>}
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
