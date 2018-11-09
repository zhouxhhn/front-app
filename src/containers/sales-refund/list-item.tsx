import React, { ReactElement } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import { Stepper } from '@sipin/sipin-sales-cloud-components/src/components';
import GoodsInfo from '../../components/goods-list/goods-info';
import defaultPic from '../../static/images/default.png';
import {
  ListItemWrapper,
  TextCenter,
  FlexItem,
  ItemInfoWrapper,
  ItemTag,
  ItemInput,
} from './ui';
import store from './store';
import { transformGoodsSpecification } from '../../utils';

const tip = { marginTop: 5, fontSize: 12 };

export default observer(function ListItem({
  item,
}: {
  item: any;
}): ReactElement<any> {
  return (
    <ListItemWrapper>
      <ItemInfoWrapper>
        <View style={{ maxWidth: 300 }}>
          <GoodsInfo
            title={[item.name]}
            descrtiption={transformGoodsSpecification(item)}
            cover={item.imgPath || defaultPic}
            price={item.price}
          />
        </View>
        <View style={{ paddingLeft: 10 }}>
          {item.gift && <ItemTag>赠品</ItemTag>}
          <ItemTag color="green">{item.pickup ? '自提' : '寄送'}</ItemTag>
        </View>
      </ItemInfoWrapper>
      <FlexItem flex={1}>
        <TextCenter>{item.discountAmount}</TextCenter>
      </FlexItem>
      <FlexItem flex={1}>
        <TextCenter>{item.originalAmount}</TextCenter>
      </FlexItem>
      <FlexItem flex={1}>
        <TextCenter>{item.quantity}</TextCenter>
      </FlexItem>
      <FlexItem flex={1}>
        <Stepper
          min={0}
          max={item.refundQuantity}
          value={item.refundQuantityUpdate}
          onChange={q => store.updateQuantity(item.uid, q)}
        />
        <TextCenter style={tip}>
          最多可退
          {item.refundQuantity}件
        </TextCenter>
      </FlexItem>
      <FlexItem flex={1}>
        <ItemInput
          keyboardType="number-pad"
          value={String(item.refundAmountUpdate)}
          onChange={(e: any) => store.updateAmount(item.uid, e)}
        />
        <TextCenter style={tip}>
          最多可退¥
          {item.refundAmount}
        </TextCenter>
      </FlexItem>
    </ListItemWrapper>
  );
});
