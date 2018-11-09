import React from 'react';
import { Text, ScrollView } from 'react-native';
import { toJS } from 'mobx';
import { observer } from 'mobx-react/native';
import ListItem from './list-item';
import { ListHeader, HightlightText, TextCenter, FlexItem } from './ui';
import store from '../sales/store';
import { CONTENT_HEIGHT } from '../../utils/constants';

@observer
export default class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const list = (toJS(store.goods) || []).map((item, index) => (
      <ListItem key={item.uuid} item={item} index={index} />
    ));

    return (
      <>
        <ListHeader>
          <FlexItem flex={2}>
            <Text>商品</Text>
          </FlexItem>
          <FlexItem flex={1}>
            <TextCenter>
              折扣(
              <HightlightText>%</HightlightText>)
            </TextCenter>
          </FlexItem>
          <FlexItem flex={1}>
            <TextCenter>
              现价(
              <HightlightText>¥</HightlightText>)
            </TextCenter>
          </FlexItem>
          <FlexItem flex={1}>
            <TextCenter>订购数量</TextCenter>
          </FlexItem>
          <FlexItem flex={1}>
            <TextCenter>操作</TextCenter>
          </FlexItem>
        </ListHeader>
        <ScrollView style={{ height: CONTENT_HEIGHT - 75 }}>{list}</ScrollView>
      </>
    );
  }
}
