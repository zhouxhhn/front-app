import React, { ReactElement } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import {
  Stepper,
  Flex,
} from '@sipin/sipin-sales-cloud-components/src/components';
import math from '@sipin/basic-libs/lib/js/math';
import { toJS } from 'mobx';
import { ListItemWrapper, FlexItem, ItemInfoWrapper, ItemInput } from './ui';
import store from '../sales/store';
import Tag from '../../components/tag';
import LinkButton from '../../components/link-button';
import GoodsInfo from '../../components/goods-list/goods-info';
import { transformGoodsSpecification } from '../../utils';

export default observer(function ListItem({
  item,
  index,
}: {
  item: any;
  index: number;
}): ReactElement<any> {
  const handleGiftTagChange = () => {
    const record = { ...{}, ...item };
    record.gift = !item.gift;
    if (record.gift) {
      record.discount = 0;
      record.price = 0;
    } else {
      record.discount = 100;
      record.price = record.amount;
    }
    store.setGoodsItem(record, index);
  };

  const handlePickupTagChange = () => {
    const record = { ...{}, ...item };
    record.pickup = !item.pickup;
    store.setGoodsItem(record, index);
  };

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
        <ItemInput
          keyboardType="number-pad"
          value={String(isNaN(item.discount) ? 0 : item.discount)}
          onChangeText={(v: any) => {
            if (!isNaN(v)) {
              if (v > 100) {
                v = 100;
              }
              if (v < 0) {
                v = 0;
              }
              item.discount = v;
              item.price = math.Div(math.Mul(item.amount, v, 2), 100, 2);
              if (isNaN(item.price)) {
                item.price = 0;
              }
              store.setGoodsItem(item, index);
            }
          }}
        />
      </FlexItem>
      <FlexItem flex={1}>
        <ItemInput
          keyboardType="number-pad"
          value={String(isNaN(item.price) ? 0 : item.price)}
          onChangeText={(v: any) => {
            if (!isNaN(v)) {
              if (+v > item.amount) {
                v = item.amount;
              }
              item.discount = math.Mul(math.Div(v, item.amount, 2), 100, 0);
              if (isNaN(item.discount)) {
                item.discount = 0;
              }
              item.price = v;
              item.gift = false;
              store.setGoodsItem(item, index);
            }
          }}
        />
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
        <View style={{ paddingLeft: '1em' }}>
          <Flex>
            <Flex.Item>
              <Tag
                color="red"
                active={item.gift}
                onChange={handleGiftTagChange}
              >
                赠品
              </Tag>
            </Flex.Item>
            <Flex.Item>
              <Tag
                color="blue"
                active={!item.pickup}
                onChange={handlePickupTagChange}
              >
                寄送
              </Tag>
            </Flex.Item>
            <Flex.Item>
              <LinkButton align="center" onClick={handleRemove}>
                删除
              </LinkButton>
            </Flex.Item>
          </Flex>
        </View>
      </FlexItem>
    </ListItemWrapper>
  );
});
