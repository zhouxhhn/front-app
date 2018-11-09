import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react/native';
import { View, Text } from 'react-native';
import {
  mainColor,
  borderColorBase,
} from '@sipin/sipin-sales-cloud-components/src/style/varibles';
import GoodsListItem from '../../components/goods-list/goods-list-item';
import Store from '../../services/list/store';
import { frontSearchSkuWarehouseStockApi } from '../../services/stock';
import * as $style from '../../utils/styles';
import { BlockHeaderName } from '../../components/block';
import ListBlock from '../../components/list-block';
import { transformGoodsSpecification } from '../../utils';

@observer
class List extends Component<any> {
  constructor(props: any) {
    super(props);
    this.store = new Store({
      apis: { getList: frontSearchSkuWarehouseStockApi },
    });
    this.store.size = 20;
  }

  createActionArea = record => {
    return (
      <View
        style={[
          $style.style.flexCenterMiddle,
          { borderWidth: 2, borderColor: borderColorBase, borderRadius: 6 },
        ]}
      >
        <View style={[$style.style.pt15]}>
          <Text
            style={[$style.style.f12, $style.style.color333, $style.style.mb5]}
          >
            库存
          </Text>
        </View>
        <View style={[$style.style.pb15]}>
          <Text style={[$style.style.f18, { color: mainColor }]}>
            {record.stockQty}
          </Text>
        </View>
      </View>
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
      _data: item,
    }));

    const ListItemComponent = props => {
      return (
        <GoodsListItem
          {...props}
          type="stock"
          numColumns={2}
          createActionArea={this.createActionArea}
          touchable={false}
          style={[
            {
              borderWidth: 1,
              borderLeftWidth: 0,
              borderTopWidth: 0,
              borderColor: borderColorBase,
            },
          ]}
        />
      );
    };

    return (
      <ListBlock
        HeaderLeft={<BlockHeaderName>查看库存</BlockHeaderName>}
        searchPlaceholder="输入商品名称/货号进行查询"
        showSearchBar
        store={this.store}
        data={data}
        params={{ warehouseId: 1 }}
        numColumns={2}
        ListItemComponent={ListItemComponent}
      />
    );
  }
}

export default List;
