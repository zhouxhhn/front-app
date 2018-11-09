import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import { Stepper } from '@sipin/sipin-sales-cloud-components/src/components';
import { toJS } from 'mobx';
import { ListItemWrapper, FlexItem, ItemInfoWrapper, TextCenter } from './ui';
import store from '../purchase/store';
import LinkButton from '../../components/link-button';
import GoodsInfo from '../../components/goods-list/goods-info';
import * as $style from '../../utils/styles';
import { transformGoodsSpecification } from '../../utils';

@observer
export default class ListItem extends React.Component<{
  item: any;
  index: number;
}> {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { item, index } = this.props;

    const handleRemove = () => {
      let goods = toJS(store.goods);
      goods.splice(index, 1);
      store.setGoods(goods);
    };

    return (
      <ListItemWrapper>
        <ItemInfoWrapper>
          <GoodsInfo
            title={[item.name, item.number]}
            descrtiption={transformGoodsSpecification(item)}
            cover={item.imgPath}
            price={item.amount}
          />
        </ItemInfoWrapper>
        <FlexItem flex={1}>
          <TextCenter>{item.amount}</TextCenter>
        </FlexItem>
        <FlexItem flex={1}>
          <TextCenter>{item.price}</TextCenter>
        </FlexItem>
        <FlexItem flex={1}>
          <Stepper
            min={1}
            value={item.quantity}
            onChange={v => {
              item.quantity = v;
              store.setGoodsItem(item, index);
            }}
          />
        </FlexItem>
        <FlexItem flex={1}>
          <View style={[$style.style.flexRow, $style.style.flexCenterMiddle]}>
            <LinkButton align="center" onClick={handleRemove}>
              删除
            </LinkButton>
          </View>
        </FlexItem>
      </ListItemWrapper>
    );
  }
}
