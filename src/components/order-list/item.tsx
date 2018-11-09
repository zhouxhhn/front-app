import React, { PureComponent } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import {
  Flex,
  Cover,
} from '@sipin/sipin-sales-cloud-components/src/components';
import math from '@sipin/basic-libs/lib/js/math';
import {
  mainColor,
  backgroundColor,
} from '@sipin/sipin-sales-cloud-components/src/style/varibles';
import clickEvent from '@sipin/sipin-sales-cloud-components/src/utils/click-event';
import * as $style from '../../utils/styles';

export interface IGoodsListItem {
  id?: string;
  data?: any;
  selected?: boolean;
  onClick?: (data: any) => void;
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
    const { style, touchable, data } = this.props;

    const TouchableNode = touchable ? TouchableOpacity : View;

    const payableAmount = math.Mul(data.payableAmount, 1, 2);

    return (
      <TouchableNode
        {...clickEvent(this.onPress)}
        style={[
          {
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 10,
            paddingBottom: 10,
            backgroundColor: data.selected ? '#ffd4c6' : '#fff',
            borderBottomWidth: 1,
            borderColor: backgroundColor,
            flex: 1,
          },
          style,
        ]}
      >
        <View>
          <Flex style={[$style.style.flexCenterMiddle, $style.style.mb5]}>
            <Flex.Item>
              <Text style={[$style.style.color333, $style.style.f12]}>
                单号：
                {data.no}
              </Text>
            </Flex.Item>
            <Flex.Item>
              <Text
                style={[
                  $style.style.textRight,
                  $style.style.f12,
                  { color: mainColor },
                ]}
              >
                ￥{payableAmount}
              </Text>
            </Flex.Item>
          </Flex>
          <Flex style={[$style.style.flexCenterMiddle, $style.style.mb10]}>
            <Flex.Item>
              <Text style={[$style.style.color333, $style.style.f12]}>
                状态：
                {data.status}
              </Text>
            </Flex.Item>
            <Flex.Item>
              <Text
                style={[
                  $style.style.textRight,
                  $style.style.color999,
                  $style.style.f12,
                ]}
              >
                {data.createdAt}
              </Text>
            </Flex.Item>
          </Flex>
          <Flex style={[$style.style.flexCenterMiddle]}>
            <Flex.Item>
              <View style={[$style.style.flexRow]}>
                {data.covers.map((item, index) => {
                  const len = data.covers.length;
                  if (len > 3) {
                    if (index === 2) {
                      return (
                        <Cover
                          // eslint-disable-next-line
                          key={index}
                          height={50}
                          width={50}
                          style={{ marginRight: 20 }}
                          src={require('../../static/images/order-cover-more.png')}
                        />
                      );
                    }
                    if (index > 1 && index !== len - 1) {
                      return null;
                    }
                  }

                  return (
                    <Cover
                      // eslint-disable-next-line
                      key={index}
                      height={50}
                      width={50}
                      style={{ marginRight: 20 }}
                      src={item}
                    />
                  );
                })}
              </View>
            </Flex.Item>
            <View
              style={[
                $style.style.flexCol,
                $style.style[
                  data.return ? 'flexItemBetween' : 'flexItemBottom'
                ],
                { height: 50 },
              ]}
            >
              <Text style={[$style.style.textRight, $style.style.f12]}>
                {data.return && '(有退货)'}
              </Text>
              <Text style={[$style.style.textRight, $style.style.f12]}>
                x{data.totalQuantity}
              </Text>
            </View>
          </Flex>
        </View>
      </TouchableNode>
    );
  }
}

export default GoodsListItem;
