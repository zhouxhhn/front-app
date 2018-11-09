import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import {
  Flex,
  ListView,
  SearchInput,
  Toast,
} from '@sipin/sipin-sales-cloud-components/src/components';
import styled from 'styled-components/native';
import { BlockHeader } from '../../components/block';
import { CONTENT_HEIGHT } from '../../utils/constants';

const SearchInputWrap = styled.View`
  padding-right: 20;
`;
interface IProps {
  store: {
    loadMore: (params: any) => void;
    getList: (params: any) => void;
    setKeyword: (key: string) => void;
    keyword: any;
  };
  data: any[];
  ListHeaderComponent?: any;
  ListItemComponent: any;
  showSearchBar?: boolean;
  searchPlaceholder?: string;
  hideHeader?: boolean;
  HeaderLeft?: any;
  params?: any;
  style?: any;
  numColumns?: number;
  handleOrderItemClick?: (record: any) => void;
  onBeforeSearchSubmit?: () => void;
}

@observer
class ListBlock extends Component<IProps> {
  static defaultProps = {
    params: {},
  };
  constructor(props: any) {
    super(props);
  }
  async componentWillMount() {
    await this.onRefresh();
  }

  onEndReached = async () => {
    const { store, params } = this.props;

    return await store.loadMore({ params });
  };

  onRefresh = async () => {
    const { store, params } = this.props;
    Toast.loading('加载中', 0);
    await store.getList({ page: 1, params });
    Toast.hide();
  };

  handleOrderItemClick = record => {
    const { handleOrderItemClick } = this.props;

    if (handleOrderItemClick) {
      handleOrderItemClick(record);
    }
  };

  onSearchSubmit = async keyword => {
    const { params, onBeforeSearchSubmit, store } = this.props;
    if (onBeforeSearchSubmit) {
      await onBeforeSearchSubmit();
    }
    store.getList({
      keyword,
      params,
    });
  };

  onSearchChange = keyword => {
    const { store } = this.props;
    store.setKeyword(keyword);
  };
  onFocus = () => {
    const { store } = this.props;
    store.setKeyword('');
  };

  render() {
    const {
      store,
      data,
      HeaderLeft,
      hideHeader,
      ListHeaderComponent,
      ListItemComponent,
      numColumns,
      showSearchBar,
      searchPlaceholder,
      style,
    } = this.props;

    return (
      <View style={style}>
        {!hideHeader && (
          <BlockHeader>
            <Flex style={{ width: '100%' }}>
              <Flex.Item>{HeaderLeft}</Flex.Item>
              {showSearchBar && (
                <Flex.Item>
                  <SearchInputWrap>
                    <SearchInput
                      value={store.keyword}
                      placeholder={searchPlaceholder}
                      onSubmit={this.onSearchSubmit}
                      onChange={this.onSearchChange}
                      onFocus={this.onFocus}
                    />
                  </SearchInputWrap>
                </Flex.Item>
              )}
            </Flex>
          </BlockHeader>
        )}
        <ListView
          style={{ height: CONTENT_HEIGHT }}
          onEndReached={this.onEndReached}
          onRefresh={this.onRefresh}
          data={data}
          numColumns={numColumns || 1}
          ListHeaderComponent={ListHeaderComponent}
          ListItemComponent={
            <ListItemComponent
              style={style}
              onClick={this.handleOrderItemClick}
            />
          }
        />
      </View>
    );
  }
}

export default ListBlock;
