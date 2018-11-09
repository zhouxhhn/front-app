import * as React from 'react';
import {
  Flex,
  Toast,
} from '@sipin/sipin-sales-cloud-components/src/components';
import { observer } from 'mobx-react/native';
import { toJS } from 'mobx';
import Header from './header';
import cartStore from '../store';
import Footer from './footer';
import CartList from './list';
import agencyStore from '../../../services/agency/store';

@observer
export default class Cart extends React.Component<any> {
  onSubmit = () => {
    const { app } = this.props;
    const { agency } = agencyStore;
    const { goods, price } = cartStore;
    if (+agency.balance < +price) {
      Toast.fail('余额不足, 不能提交');
    } else if (!goods.length) {
      Toast.fail('购物车为空, 不能提交');
    } else {
      app.push('/purchase-checkout');
    }
  };
  renderHeader = () => {
    const { agency } = agencyStore;
    const data = {
      ...toJS(agency),
    };

    return <Header {...data} />;
  };

  renderList = () => {
    const { app } = this.props;

    return (
      <CartList
        data={toJS(cartStore.goods)}
        goToCartPage={() => app.push('/purchase-cart')}
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
      },
    ];

    return (
      <Footer
        onEmptyCart={() => cartStore.emptyCart()}
        data={data}
        onSubmit={this.onSubmit}
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
