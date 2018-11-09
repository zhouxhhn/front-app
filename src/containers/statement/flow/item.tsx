import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import objectPath from 'object-path';
import { isString } from '../../../utils';
import columns from './columns';

export interface IGoodsListItem {
  id?: string;
  selected?: boolean;
  style?: any;
  data?: any;
}

class ListItem extends PureComponent<IGoodsListItem, {}> {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { data } = this.props;
    const items = columns.map((i: any) => {
      const key = i.key || i.dataIndex;
      const value = objectPath.get(data, i.dataIndex);
      const args = i.dataIndex !== '' ? [value, data] : [data];
      let render = (i.render && i.render.apply(null, args)) || (
        <Text>{value}</Text>
      );

      if (isString(render)) {
        render = <Text>{render}</Text>;
      }

      return (
        <View
          key={key}
          style={[{ flex: i.width | 1, alignSelf: 'stretch' }, i.style]}
        >
          {render}
        </View>
      );
    });

    return (
      <View
        style={{
          flex: 1,
          alignSelf: 'stretch',
          flexDirection: 'row',
          marginTop: 20,
        }}
      >
        {items}
      </View>
    );
  }
}

export default ListItem;
