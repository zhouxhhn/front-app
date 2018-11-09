import React from 'react';
import { Text } from 'react-native';
import {
  Flex,
  Button,
} from '@sipin/sipin-sales-cloud-components/src/components';

interface IProps {
  totalCount: number;
  totalPrice: number;
  onPrint: () => void;
}

class BottomPanel extends React.Component<IProps> {
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { totalCount, totalPrice, onPrint } = this.props;

    return (
      <Flex
        style={{
          borderTopWidth: 1,
          paddingTop: 10,
          paddingBottom: 10,
          borderColor: '#eee',
        }}
      >
        <Flex.Item />
        <Flex.Item>
          <Flex justify="center" align="center">
            <Flex.Item>
              <Text style={{ fontSize: 16 }}>
                数量：
                {totalCount}笔
              </Text>
            </Flex.Item>
            <Flex.Item>
              <Text style={{ fontSize: 16 }}>
                金额：￥
                {totalPrice}
              </Text>
            </Flex.Item>
            <Flex.Item style={{ paddingRight: 20 }}>
              <Button type="primary" onClick={onPrint}>
                打印
              </Button>
            </Flex.Item>
          </Flex>
        </Flex.Item>
      </Flex>
    );
  }
}

export default BottomPanel;
