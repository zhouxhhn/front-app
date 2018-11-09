import React, { Component } from 'react';
import { View, Text } from 'react-native';
import objectPath from 'object-path';
import * as $style from '../../utils/styles';
import { isString } from '../../utils';

interface IProps {
  columns: any[];
  data: any[];
  rowKey: (r: any) => number;
}

class Table extends Component<IProps> {
  constructor(props: any) {
    super(props);
  }
  renderRow = (rowKey, item: any, columns: any[], index) => {
    const id = rowKey(item);
    const items = columns.map((i: any) => {
      const key = i.key || i.dataIndex;
      const value = objectPath.get(item, i.dataIndex);
      const args = i.dataIndex !== '' ? [value, item, index] : [item, index];
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
        key={id}
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
  };

  renderHeader = (columns: any[] = []) => {
    const items = columns.map((item: any) => {
      const key = item.key || item.dataIndex;
      const render = React.isValidElement(item.title) ? (
        item.title
      ) : (
        <Text style={[$style.style.fb, $style.style.f14]}>{item.title}</Text>
      );

      return (
        <View
          key={key}
          style={[
            {
              flex: item.width | 1,
              alignSelf: 'stretch',
              marginTop: 10,
              marginBottom: 10,
            },
            item.style,
          ]}
        >
          {render}
        </View>
      );
    });

    return (
      <View
        style={[
          $style.style.flexCenterMiddle,
          $style.style.flexRow,
          { alignSelf: 'stretch' },
        ]}
      >
        {items}
      </View>
    );
  };

  render() {
    const { data, rowKey, columns } = this.props;

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {this.renderHeader(columns)}
        {data.map((item, index) => {
          return this.renderRow(rowKey, item, columns, index);
        })}
      </View>
    );
  }
}

export default Table;
