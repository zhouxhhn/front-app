import React from 'react';
import { Text, View } from 'react-native';
import { Flex } from '@sipin/sipin-sales-cloud-components/src/components';
import {
  mainColor,
  textColorMain,
} from '@sipin/sipin-sales-cloud-components/src/style/varibles';
import clickEvent from '@sipin/sipin-sales-cloud-components/src/utils/click-event';

interface IProps {
  onChange?: (index: number) => void;
  activeIndex: number;
  data: any[];
}

class Tabs extends React.Component<IProps> {
  static defaultProps = {
    activeIndex: 0,
  };
  constructor(props) {
    super(props);
    this.state = {};
  }
  onPress = index => {
    const { onChange } = this.props;

    if (onChange) {
      onChange(index);
    }
  };
  render() {
    const { activeIndex, data } = this.props;
    const items = data.map((item, index) => {
      return (
        <Flex.Item key={item}>
          <View {...clickEvent(this.onPress.bind(this, index))}>
            <Text
              style={{
                color: activeIndex === index ? mainColor : textColorMain,
              }}
            >
              {item}
            </Text>
          </View>
        </Flex.Item>
      );
    });

    return <Flex style={{ width: '100%' }}>{items}</Flex>;
  }
}

export default Tabs;
