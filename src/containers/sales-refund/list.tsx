import React, { ReactElement } from 'react';
import { ScrollView } from 'react-native';
import ListItem from './list-item';
import { ListHeader, HightlightText, ListHeaderText, FlexItem } from './ui';
import store from './store';

/**
 * @returns {ReactElement} list item
 */
export default function List(): ReactElement<any> {
  const list = (store.order.orderDetailList || []).map(item => (
    <ListItem key={item.uid} item={item} />
  ));

  return (
    <>
      <ListHeader>
        <FlexItem flex={3}>
          <ListHeaderText style={{ textAlign: 'left' }}>商品</ListHeaderText>
        </FlexItem>
        <FlexItem flex={1}>
          <ListHeaderText>
            折扣(
            <HightlightText>%</HightlightText>)
          </ListHeaderText>
        </FlexItem>
        <FlexItem flex={1}>
          <ListHeaderText>
            实际售价(
            <HightlightText>¥</HightlightText>)
          </ListHeaderText>
        </FlexItem>
        <FlexItem flex={1}>
          <ListHeaderText>订购数量</ListHeaderText>
        </FlexItem>
        <FlexItem flex={1}>
          <ListHeaderText>退货数量</ListHeaderText>
        </FlexItem>
        <FlexItem flex={1}>
          <ListHeaderText>退款金额</ListHeaderText>
        </FlexItem>
      </ListHeader>
      <ScrollView>{list}</ScrollView>
    </>
  );
}
