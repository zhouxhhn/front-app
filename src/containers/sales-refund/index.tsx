import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { Flex } from '@sipin/sipin-sales-cloud-components/src/components';
import { MainBlock } from '../../components/block';
import ActionButton from '../../components/action-button';
import List from './list';
import RefundInfoPanel from './refund-info-panel';
import { Left, Right, Header, HeaderText, HightlightText } from './ui';
import store from './store';

@observer
export default class SalesRefund extends Component<any> {
  componentDidMount() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    store.getOrder(id);
  }
  render() {
    const { app } = this.props;

    return (
      <MainBlock>
        <Flex style={{ height: '100%' }}>
          <Left>
            <Header>
              <HeaderText>会员: {store.order.mobile}</HeaderText>
              {store.order.salerName && (
                <HeaderText>导购: {store.order.salerName}</HeaderText>
              )}
              <HeaderText>收银: {store.order.createrName}</HeaderText>
              <HeaderText>
                状态: <HightlightText>{store.order.status}</HightlightText>
              </HeaderText>
              <Flex.Item style={{ alignItems: 'flex-end' }}>
                <ActionButton onClick={store.refundAll}>全退</ActionButton>
              </Flex.Item>
            </Header>
            <List />
          </Left>
          <Right>
            <RefundInfoPanel app={app} />
          </Right>
        </Flex>
      </MainBlock>
    );
  }
}
