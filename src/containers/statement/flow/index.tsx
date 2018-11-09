import React, { Component } from 'react';
import { toJS } from 'mobx';
import { View, Text } from 'react-native';
import { observer } from 'mobx-react/native';
import ListBlock from '../../../components/list-block';
import { CONTENT_HEIGHT } from '../../../utils/constants';
import SearchBar from '../search-bar';
import * as $style from '../../../utils/styles';
import columns from './columns';
import ListItem from './item';
import searchBarStore from '../search-bar/store';

@observer
class FlowList extends Component<any> {
  constructor(props: any) {
    super(props);
    this.store = props.store;
  }

  handleSearchSubmit = value => {
    const { fetchSumData } = this.props;

    this.store.getList({ page: 1, params: value });
    fetchSumData();
  };

  renderHeader = (columns: any[] = []) => {
    const items = columns.map((item: any) => {
      const key = item.key || item.dataIndex;
      const render = React.isValidElement(item.title) ? (
        item.title
      ) : (
        <Text
          style={[$style.style.fb, $style.style.f14, $style.style.color333]}
        >
          {item.title}
        </Text>
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

  store: any;
  render() {
    const dataSource = toJS(this.store.dataSource);
    const data = dataSource.map(item => ({ ...item, id: item.paymentNo }));

    return (
      <View style={{ padding: 20 }}>
        <SearchBar onSubmit={this.handleSearchSubmit} />
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {this.renderHeader(columns)}
          <ListBlock
            style={{ height: CONTENT_HEIGHT - 75 - 103, width: '100%' }}
            hideHeader
            store={this.store}
            data={data}
            params={searchBarStore.params}
            ListItemComponent={ListItem}
          />
        </View>
      </View>
    );
  }
}

export default FlowList;
