import React, { PureComponent } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import {
  Price,
  Flex,
} from '@sipin/sipin-sales-cloud-components/src/components';
import math from '@sipin/basic-libs/lib/js/math';
import { mainColor } from '@sipin/sipin-sales-cloud-components/src/style/varibles';
import clickEvent from '@sipin/sipin-sales-cloud-components/src/utils/click-event';
import GoodsInfo, { IGoodsInfoProps } from './goods-info';
import * as $style from '../../utils/styles';
import Tag from '../tag';
import { goodsStatus } from '../../services/constants';

export interface IGoodsListItem {
  id?: string;
  selected?: boolean;
  data?: IGoodsInfoProps & {
    _data: any;
    amount?: number;
    discount?: string;
    stockQty?: number;
    status?: number;
  };
  type: 'sales' | 'purchase' | 'stock';
  onClick?: (data: any) => void;
  createActionArea: (data: any) => any;
  style?: any;
  touchable?: boolean;
}

class GoodsListItem extends PureComponent<IGoodsListItem, {}> {
  onPress = () => {
    const { onClick, data } = this.props;
    if (onClick) {
      onClick(data);
    }
  };

  render() {
    const { data, createActionArea, type, style, touchable } = this.props;

    const purchasePrice = math.Mul(data.amount, data.discount, 2);
    const salesPrice = math.Mul(data.amount, 1, 2);

    const purchaseNode = (
      <>
        <Text style={[$style.style.mr10, $style.style.color333]}>
          库存：
          {data.stockQty}
        </Text>
        <Text style={[$style.style.mr10, $style.style.color333]}>
          指导价：¥ {salesPrice}
        </Text>
        <Text style={[$style.style.mr10, $style.style.color333]}>
          采购价：¥ {purchasePrice}
        </Text>
      </>
    );

    const saleNode = (
      <>
        <Price size={20} color={mainColor} value={data.amount + ''} />
      </>
    );

    const stockNode = (
      <View>
        <Text
          style={[
            $style.style.textCenter,
            $style.style.mb5,
            $style.style.color333,
          ]}
        >
          指导价
        </Text>
        <Text
          style={[
            $style.style.textCenter,
            $style.style.fb,
            $style.style.f16,
            $style.style.color333,
          ]}
        >
          ¥ {salesPrice}
        </Text>
      </View>
    );

    const isSales = type === 'sales';
    const isPurchase = type === 'purchase';

    const renderNode = isSales
      ? saleNode
      : isPurchase
        ? purchaseNode
        : stockNode;

    const TouchableNode = touchable ? TouchableOpacity : View;

    let statusNode: any = null;
    if (isSales || isPurchase) {
      const color: any = ['red', 'main', 'gray', 'blue', 'cyan'][data.status];
      statusNode = (
        <Flex.Item flex={1}>
          <Tag color={color} active>
            {goodsStatus[data.status]}
          </Tag>
        </Flex.Item>
      );
    }

    return (
      <TouchableNode
        {...clickEvent(this.onPress)}
        style={[
          {
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 10,
            paddingBottom: 10,
            backgroundColor: '#fff',
            flex: 1,
          },
          style,
        ]}
      >
        <View>
          <Flex style={[$style.style.flexCenterMiddle]}>
            <Flex.Item flex={3}>
              <GoodsInfo
                title={data.title}
                descrtiption={data.descrtiption}
                cover={data.cover}
              />
            </Flex.Item>
            {statusNode}
            <Flex.Item flex={1}>{renderNode}</Flex.Item>
            <View style={{ width: 80 }}>{createActionArea(data._data)}</View>
          </Flex>
        </View>
      </TouchableNode>
    );
  }
}

export default GoodsListItem;
