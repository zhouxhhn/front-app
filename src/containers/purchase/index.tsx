import React, { Component } from 'react';
import {
  Flex,
  Toast,
} from '@sipin/sipin-sales-cloud-components/src/components';
import math from '@sipin/basic-libs/lib/js/math';
import uuid from 'uuid';
import PurchaseGoodsList from './list';
import { LeftBlock, RightBlock } from '../sales/blocks';
import { MainBlock } from '../../components/block';
import Cart from './cart';
import proxy from '../../services/utils/proxy';
import isSuccess from '../../services/utils/is-success';
import cartStore from './store';
import defaultPic from '../../static/images/default.png';
import Scanner from '../../components/scanner';
import { frontSearchAllSkuApi } from '../../services/purchase/actions';

class Purchase extends Component<any> {
  addToCart = data => {
    cartStore.addGoods({
      ...data,
      quantity: 1,
      price: math.Mul(data.amount, data.discount, 2),
      uuid: uuid(),
      imgPath: data.imgPath || defaultPic,
    });
  };

  onScan = async value => {
    const { addToCart } = this;
    const res = await proxy(
      frontSearchAllSkuApi({ page: 1, size: 10, search: value })
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
            <PurchaseGoodsList addToCart={this.addToCart} />
          </LeftBlock>
          <RightBlock>
            <Cart app={app} />
          </RightBlock>
        </Flex>
      </MainBlock>
    );
  }
}

export default Purchase;
