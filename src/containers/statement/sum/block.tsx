import React from 'react';
import { View, Text } from 'react-native';
import { Flex } from '@sipin/sipin-sales-cloud-components/src/components';
import {
  borderColorBase,
  textColorMain,
} from '@sipin/sipin-sales-cloud-components/src/style/varibles';
import math from '@sipin/basic-libs/lib/js/math';

interface IProps {
  title: string;
  children?: any;
  data: any[];
}

class Block extends React.Component<IProps> {
  static defaultProps = {
    data: [],
  };

  constructor(props) {
    super(props);
    this.state = {};
  }
  // eslint-disable-next-line
  renderItem = (record, key) => {
    return (
      <Flex
        key={key}
        style={{
          borderBottomWidth: 1,
          paddingBottom: 5,
          marginBottom: 15,
          borderStyle: 'dashed',
          borderColor: borderColorBase,
        }}
      >
        <Flex.Item>
          <Text>
            {record.type || '未知类型'}: ￥{math.Mul(record.price, 1, 2)}
          </Text>
        </Flex.Item>
        <Flex.Item>
          <Text style={{ textAlign: 'right' }}>{record.total}笔</Text>
        </Flex.Item>
      </Flex>
    );
  };

  render() {
    const { title, data } = this.props;

    return (
      <View>
        <View>
          <Text
            style={{ fontSize: 14, fontWeight: 'bold', color: textColorMain }}
          >
            {title}
          </Text>
        </View>
        <View style={{ marginTop: 20 }}>
          {data.map((record, index) => {
            return this.renderItem(record, index);
          })}
        </View>
      </View>
    );
  }
}

export default Block;
