import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { Flex } from '@sipin/sipin-sales-cloud-components/src/components';
import { toJS } from 'mobx';
import { MainBlock } from '../../components/block';
import List from './list';
import CartInfoPanel from './cart-info-panel';
import { Left, Right } from './ui';
import store from '../sales/store';

@observer
export default class SalesCart extends Component<any> {
  componentDidMount() {
    const { app } = this.props;
    const goods = toJS(store.goods);
    if (!goods || !goods.length) {
      app.push('/sales');
    }
  }
  render() {
    const { app } = this.props;

    return (
      <MainBlock>
        <Flex style={{ height: '100%' }}>
          <Left>
            <List />
          </Left>
          <Right>
            <CartInfoPanel app={app} />
          </Right>
        </Flex>
      </MainBlock>
    );
  }
}
