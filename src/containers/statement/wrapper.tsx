import React from 'react';
import { Text } from 'react-native';
import { Flex } from '@sipin/sipin-sales-cloud-components/src/components';
import {
  Block,
  MainBlock,
  BlockHeader,
  BlockHeaderName,
} from '../../components/block';
import Tabs from './tabs';

interface IProps {
  app: any;
  activeIndex: number;
  children: any;
  onChange?: (index: number) => void;
}

class StateMent extends React.Component<IProps> {
  static defaultProps = {
    activeIndex: 0,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleTabClick = index => {
    const { onChange } = this.props;

    if (onChange) {
      onChange(index);
    }
  };

  render() {
    const { children, activeIndex } = this.props;
    const data = ['汇总', '流水'];

    return (
      <MainBlock>
        <Block flex={1}>
          <BlockHeader>
            <Flex style={{ width: '100%' }}>
              <Flex.Item>
                <Text>
                  <BlockHeaderName>{data[activeIndex]}</BlockHeaderName>
                </Text>
              </Flex.Item>
              <Flex.Item>
                <Tabs
                  data={data}
                  activeIndex={activeIndex}
                  onChange={this.handleTabClick}
                />
              </Flex.Item>
              <Flex.Item />
            </Flex>
          </BlockHeader>
          {children}
        </Block>
      </MainBlock>
    );
  }
}

export default StateMent;
