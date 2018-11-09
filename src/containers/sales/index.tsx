import React, { Component } from 'react';
import {
  Flex,
  Toast,
} from '@sipin/sipin-sales-cloud-components/src/components';
import SaleGoodsList from './list';
import { LeftBlock, RightBlock } from './blocks';
import { MainBlock } from '../../components/block';
import Cart from './cart';
import cartStore from './store';
import { transformGoodsToCart } from '../../utils';
import Scanner from '../../components/scanner';
import { frontSearchAllSkuNoStockApi } from '../../services/sales';
import proxy from '../../services/utils/proxy';
import isSuccess from '../../services/utils/is-success';

class Sales extends Component<any> {
  addToCart = data => {
    cartStore.addGoods(transformGoodsToCart(data));
  };

  onScan = async value => {
    const { addToCart } = this;
    const res = await proxy(
      frontSearchAllSkuNoStockApi({ page: 1, size: 10, search: value })
    );
    if (isSuccess(res)) {
      const goods = res.data && res.data.records;
      if (goods && goods.length) {
        addToCart(goods[0]);
      } else {
        Toast.fail(`无相关商品 (${value})`);
      }
    } else {
      Toast.fail(`查询出错: ${res.msg}`);
    }
  };
  render() {
    const { app } = this.props;

    return (
      <MainBlock>
        <Scanner onEnter={this.onScan} />
        <Flex style={{ height: '100%' }}>
          <LeftBlock>
            <SaleGoodsList addToCart={this.addToCart} />
          </LeftBlock>
          <RightBlock>
            <Cart app={app} addToCart={this.addToCart} />
          </RightBlock>
        </Flex>
      </MainBlock>
    );
  }
}

export default Sales;
