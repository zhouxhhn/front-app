import * as React from 'react';
import {
  Flex,
  Toast,
} from '@sipin/sipin-sales-cloud-components/src/components';
import { observer } from 'mobx-react/native';
import { toJS } from 'mobx';
import Header from './header';
import shopStore from '../../../services/shop/store';
import cartStore from '../store';
import Footer from './footer';
import CartList from './list';

@observer
export default class Cart extends React.Component<any> {
  onSubmit = () => {
    const { app } = this.props;
    const { goods } = cartStore;
    if (goods.length) {
      app.push('/checkout');
    } else {
      Toast.fail('购物车为空, 不能提交');
    }
  };
  renderHeader = () => {
    const { sellers } = shopStore;
    const { sellerId } = cartStore;

    return (
      <Header
        sellers={toJS(sellers)}
        sellerId={sellerId}
        onChange={value => cartStore.setStore('sellerId', value)}
      />
    );
  };

  renderList = () => {
    const { app } = this.props;

    return (
      <CartList
        data={toJS(cartStore.goods)}
        goToCartPage={() => app.push('/sales-cart')}
      />
    );
  };
  renderFooter = () => {
    const { quantity, price } = cartStore;
    const data = [
      {
        label: '数量：',
        value: `${quantity}`,
      },
      {
        label: '应付金额：',
        value: `￥${price}`,
        color: 'primary',
      },
    ];

    return (
      <Footer
        data={data}
        onSubmit={this.onSubmit}
        onEmptyCart={() => cartStore.emptyCart()}
      />
    );
  };
  render() {
    return (
      <Flex direction="column" style={{ height: '100%' }}>
        {this.renderHeader()}
        {this.renderList()}
        {this.renderFooter()}
      </Flex>
    );
  }
}
