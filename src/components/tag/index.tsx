import React from 'react';
import { View, Text } from 'react-native';
import clickEvent from '@sipin/sipin-sales-cloud-components/src/utils/click-event';
import {
  backgroundColor,
  textColorMain,
  mainColor,
} from '@sipin/sipin-sales-cloud-components/src/style/varibles';

interface IProps {
  children: any;
  color?: 'blue' | 'red' | 'gray' | 'cyan' | 'main';
  active: boolean;
  onChange?: (bool: boolean) => void;
}

export default class Tag extends React.Component<IProps, {}> {
  static defaultProps = {
    color: 'blue',
    active: false,
  };
  constructor(props) {
    super(props);
    this.state = {};
  }
  onPress = () => {
    const { onChange, active } = this.props;

    if (onChange) {
      onChange(!active);
    }
  };
  render() {
    const { children, color, active } = this.props;

    const colors = {
      red: '#ef6878',
      blue: '#4089c7',
      gray: '#333',
      cyan: '#13c2c2',
      main: mainColor,
    };

    return (
      <View
        {...clickEvent(this.onPress)}
        style={{
          borderWidth: 1,
          borderColor: active ? colors[color] : backgroundColor,
          backgroundColor: active ? colors[color] : '#fff',
          borderRadius: 5,
          paddingTop: 5,
          paddingBottom: 5,
          paddingLeft: 5,
          paddingRight: 5,
          width: 40,
        }}
      >
        <Text style={{ fontSize: 14, color: active ? '#fff' : textColorMain }}>
          {children}
        </Text>
      </View>
    );
  }
}
